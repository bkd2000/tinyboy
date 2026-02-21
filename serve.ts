// TinyClaw Dashboard Server
// Uruchom: bun serve.ts
import { join } from "path";
import { Database } from "bun:sqlite";
import { homedir } from "os";
import { readdirSync, readFileSync, statSync } from "fs";

const PORT = 8080;
const DIR = import.meta.dir;
const DB_PATH = join(homedir(), ".tinyclaw", "tasks.db");
const WORKSPACE = join(homedir(), "tinyclaw-workspace");

// ── DATABASE ──────────────────────────────────────────────────
const db = new Database(DB_PATH, { create: true });

db.run(`CREATE TABLE IF NOT EXISTS tasks (
  id          TEXT PRIMARY KEY,
  title       TEXT NOT NULL,
  description TEXT DEFAULT '',
  priority    TEXT DEFAULT 'medium' CHECK(priority IN ('high','medium','low')),
  agent       TEXT DEFAULT 'unassigned',
  status      TEXT DEFAULT 'inbox' CHECK(status IN ('inbox','inprogress','done')),
  source      TEXT DEFAULT 'dashboard',
  created_at  TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at  TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
)`);

const stmts = {
  getAll:    db.prepare("SELECT * FROM tasks ORDER BY CASE status WHEN 'inbox' THEN 0 WHEN 'inprogress' THEN 1 ELSE 2 END, created_at DESC"),
  getById:   db.prepare("SELECT * FROM tasks WHERE id = ?"),
  insert:    db.prepare("INSERT INTO tasks (id,title,description,priority,agent,status,source) VALUES (?,?,?,?,?,?,?)"),
  update:    db.prepare("UPDATE tasks SET title=?,description=?,priority=?,agent=?,status=?,updated_at=strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE id=?"),
  patch:     db.prepare("UPDATE tasks SET status=?,updated_at=strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE id=?"),
  delete:    db.prepare("DELETE FROM tasks WHERE id=?"),
  byStatus:  db.prepare("SELECT * FROM tasks WHERE status=? ORDER BY created_at DESC"),
  byAgent:   db.prepare("SELECT * FROM tasks WHERE agent=? ORDER BY created_at DESC"),
};

function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

// ── SSE BROADCAST ─────────────────────────────────────────────
const sseClients = new Set<ReadableStreamDefaultController<string>>();

function broadcastTasks() {
  if (sseClients.size === 0) return;
  const tasks = stmts.getAll.all();
  const data = `data: ${JSON.stringify(tasks)}\n\n`;
  for (const ctrl of sseClients) {
    try { ctrl.enqueue(data); } catch { sseClients.delete(ctrl); }
  }
}

// Poll DB for changes every 1s and broadcast to SSE clients
setInterval(broadcastTasks, 1000);

// ── CORS HEADERS ──────────────────────────────────────────────
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...CORS },
  });
}

function err(msg: string, status = 400): Response {
  return json({ error: msg }, status);
}

// ── REQUEST HANDLER ───────────────────────────────────────────
Bun.serve({
  port: PORT,
  hostname: "0.0.0.0",
  async fetch(req) {
    const url = new URL(req.url);
    const { pathname } = url;

    // CORS preflight
    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS });
    }

    // ── CLAUDE-MEM PROXY (/mem/* → localhost:37777/*) ──
    if (pathname.startsWith("/mem/")) {
      const upstream = "http://localhost:37777" + pathname.slice(4) + (url.search || "");
      try {
        const proxyRes = await fetch(upstream, {
          method: req.method,
          headers: { "Content-Type": req.headers.get("Content-Type") || "application/json" },
          body: req.method !== "GET" && req.method !== "HEAD" ? await req.text() : undefined,
        });
        const contentType = proxyRes.headers.get("Content-Type") || "application/json";
        // SSE stream — pipe body directly without buffering
        if (contentType.includes("text/event-stream")) {
          return new Response(proxyRes.body, {
            status: proxyRes.status,
            headers: { "Content-Type": contentType, "Cache-Control": "no-cache", "Connection": "keep-alive", ...CORS },
          });
        }
        const body = await proxyRes.text();
        return new Response(body, {
          status: proxyRes.status,
          headers: { "Content-Type": contentType, ...CORS },
        });
      } catch {
        return err("claude-mem unavailable", 502);
      }
    }

    // ── SSE STREAM ──
    if (pathname === "/tasks/stream" && req.method === "GET") {
      let ctrl: ReadableStreamDefaultController<string>;
      const stream = new ReadableStream<string>({
        start(c) {
          ctrl = c;
          sseClients.add(ctrl);
          // Send current state immediately on connect
          const tasks = stmts.getAll.all();
          ctrl.enqueue(`data: ${JSON.stringify(tasks)}\n\n`);
        },
        cancel() {
          sseClients.delete(ctrl);
        },
      });
      return new Response(stream as any, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
          ...CORS,
        },
      });
    }

    // ── TASKS API ──
    if (pathname === "/tasks") {
      if (req.method === "GET") {
        const status = url.searchParams.get("status");
        const agent = url.searchParams.get("agent");
        const tasks = status
          ? stmts.byStatus.all(status)
          : agent
          ? stmts.byAgent.all(agent)
          : stmts.getAll.all();
        return json(tasks);
      }

      if (req.method === "POST") {
        const body = await req.json().catch(() => null);
        if (!body?.title?.trim()) return err("title required");
        const task = {
          id:          body.id || genId(),
          title:       body.title.trim(),
          description: body.description?.trim() || "",
          priority:    ["high","medium","low"].includes(body.priority) ? body.priority : "medium",
          agent:       body.agent || "unassigned",
          status:      ["inbox","inprogress","done"].includes(body.status) ? body.status : "inbox",
          source:      body.source || "dashboard",
        };
        stmts.insert.run(task.id, task.title, task.description, task.priority, task.agent, task.status, task.source);
        return json(stmts.getById.get(task.id), 201);
      }
    }

    // /tasks/:id
    const taskMatch = pathname.match(/^\/tasks\/([^/]+)$/);
    if (taskMatch) {
      const id = taskMatch[1];
      const existing = stmts.getById.get(id);

      if (req.method === "GET") {
        return existing ? json(existing) : err("Not found", 404);
      }

      if (req.method === "PUT") {
        const body = await req.json().catch(() => null);
        if (!body?.title?.trim()) return err("title required");
        if (!existing) return err("Not found", 404);
        stmts.update.run(
          body.title.trim(),
          body.description?.trim() || "",
          ["high","medium","low"].includes(body.priority) ? body.priority : existing.priority,
          body.agent || existing.agent,
          ["inbox","inprogress","done"].includes(body.status) ? body.status : existing.status,
          id
        );
        return json(stmts.getById.get(id));
      }

      if (req.method === "PATCH") {
        const body = await req.json().catch(() => null);
        if (!existing) return err("Not found", 404);
        // Full field patch
        stmts.update.run(
          body.title?.trim() || existing.title,
          body.description?.trim() ?? existing.description,
          ["high","medium","low"].includes(body.priority) ? body.priority : existing.priority,
          body.agent || existing.agent,
          ["inbox","inprogress","done"].includes(body.status) ? body.status : existing.status,
          id
        );
        return json(stmts.getById.get(id));
      }

      if (req.method === "DELETE") {
        if (!existing) return err("Not found", 404);
        stmts.delete.run(id);
        return json({ deleted: id });
      }
    }

    // ── AGENTS API ──
    const AGENT_FILES = ["AGENTS.md", "IDENTITY.md", "SOUL.md"];
    const TINYCLAW_HOME = join(homedir(), ".tinyclaw");

    // GET /agents — list all agents with their definition files
    if (pathname === "/agents" && req.method === "GET") {
      try {
        const entries = readdirSync(WORKSPACE, { withFileTypes: true });
        const agents = entries
          .filter(e => e.isDirectory() && !e.name.startsWith('.'))
          .map(e => {
            const agentDir = join(WORKSPACE, e.name);
            const files: { name: string; size: number; modified: string }[] = [];
            for (const fname of AGENT_FILES) {
              // Look in agent dir first, then ~/.tinyclaw
              const candidates = [join(agentDir, fname), join(TINYCLAW_HOME, fname)];
              for (const fp of candidates) {
                try {
                  const stat = statSync(fp);
                  files.push({ name: fname, size: stat.size, modified: stat.mtime.toISOString() });
                  break; // found — stop looking
                } catch {}
              }
            }
            return { name: e.name, files };
          });
        return json(agents);
      } catch (e: any) {
        return err(e.message, 500);
      }
    }

    // GET /agents/:name/files/:filename — read file content
    const agentFileMatch = pathname.match(/^\/agents\/([^/]+)\/files\/(.+)$/);
    if (agentFileMatch && req.method === "GET") {
      const [, agentName, fileName] = agentFileMatch;
      // Security: only allow whitelisted files, no path traversal
      if (agentName.includes('..') || fileName.includes('..') || !AGENT_FILES.includes(fileName)) return err("Invalid path", 400);
      // Look in agent dir first, then ~/.tinyclaw
      const agentDir = join(WORKSPACE, agentName);
      const candidates = [join(agentDir, fileName), join(TINYCLAW_HOME, fileName)];
      let filePath = candidates[0];
      for (const fp of candidates) {
        try { statSync(fp); filePath = fp; break; } catch {}
      }
      try {
        const content = readFileSync(filePath, "utf8");
        return new Response(JSON.stringify({ content }), {
          headers: { "Content-Type": "application/json", ...CORS },
        });
      } catch {
        return err("File not found", 404);
      }
    }

    // ── STATIC FILES ──
    const filePath = pathname === "/" ? "/dashboard.html" : pathname;
    const file = Bun.file(join(DIR, filePath));
    if (await file.exists()) {
      return new Response(file, { headers: CORS });
    }

    return new Response("Not found", { status: 404, headers: CORS });
  },
});

const { execSync } = await import("child_process");
let tailscaleIp = "";
try { tailscaleIp = execSync("tailscale ip -4 2>/dev/null || /Applications/Tailscale.app/Contents/MacOS/Tailscale ip -4 2>/dev/null", { shell: "/bin/sh" }).toString().trim(); } catch {}

console.log(`TinyClaw Dashboard  → http://localhost:${PORT}`);
if (tailscaleIp) console.log(`TinyClaw Dashboard  → http://${tailscaleIp}:${PORT}  (Tailscale)`);
console.log(`Tasks DB            → ${DB_PATH}`);
console.log(`Tasks API           → http://localhost:${PORT}/tasks`);
