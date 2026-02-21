# BMR Calculator - Przewodnik Deployment

Ten dokument opisuje proces wdrożenia aplikacji BMR Calculator do produkcji.

---

## 🚀 Opcje Deploymentu

### 1. Vercel (Rekomendowane) ⭐

**Zalety:**
- ✅ Automatyczny deploy z Git
- ✅ Darmowy dla projektów open-source
- ✅ CDN globalny
- ✅ HTTPS automatycznie
- ✅ Szybki setup (5 min)

**Krok po kroku:**

```bash
# 1. Zainstaluj Vercel CLI
npm i -g vercel

# 2. Zaloguj się (otworzy przeglądarkę)
vercel login

# 3. Deploy (z głównego katalogu projektu)
cd bmr-calculator
vercel

# Odpowiedz na pytania:
# - Setup and deploy? Yes
# - Which scope? [wybierz swoje konto]
# - Link to existing project? No
# - Project name? bmr-calculator (lub własna nazwa)
# - Directory? ./ (domyślnie)
# - Override settings? No

# 4. Production deployment
vercel --prod
```

**URL:** Otrzymasz URL w formacie `https://bmr-calculator-xxx.vercel.app`

**Automatyczny deploy z Git:**
1. Wgraj projekt na GitHub
2. Zaloguj się na vercel.com
3. Kliknij "New Project"
4. Importuj repozytorium
5. Framework Preset: Vite
6. Deploy!

Każdy push do `main` automatycznie wdroży nową wersję.

---

### 2. Netlify

**Zalety:**
- ✅ Prosty UI
- ✅ Darmowy tier
- ✅ Drag & drop deployment
- ✅ Continuous deployment z Git

**Opcja A: Drag & Drop (najszybsza)**

```bash
# 1. Zbuduj projekt
npm run build

# 2. Idź na app.netlify.com
# 3. Przeciągnij folder dist/ na stronę
# 4. Gotowe!
```

**Opcja B: CLI**

```bash
# 1. Zainstaluj Netlify CLI
npm i -g netlify-cli

# 2. Zaloguj się
netlify login

# 3. Zainicjuj projekt
netlify init

# 4. Deploy
netlify deploy --prod
```

**Opcja C: Git Integration**

1. Push projektu na GitHub/GitLab
2. Zaloguj się na app.netlify.com
3. "New site from Git"
4. Wybierz repo
5. Build command: `npm run build`
6. Publish directory: `dist`
7. Deploy!

---

### 3. GitHub Pages

**Zalety:**
- ✅ Darmowy dla publicznych repo
- ✅ Prosty setup
- ✅ Integracja z GitHub

**Setup:**

1. **Zainstaluj gh-pages:**
```bash
npm install -D gh-pages
```

2. **Dodaj do package.json:**
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "homepage": "https://[username].github.io/bmr-calculator"
}
```

3. **Zaktualizuj vite.config.ts:**
```typescript
export default defineConfig({
  base: '/bmr-calculator/', // Nazwa repozytorium
  // ... reszta konfiguracji
})
```

4. **Deploy:**
```bash
npm run deploy
```

5. **Aktywuj GitHub Pages:**
   - Idź do Settings → Pages
   - Source: gh-pages branch
   - Save

**URL:** `https://[username].github.io/bmr-calculator`

---

### 4. Cloudflare Pages

**Zalety:**
- ✅ Szybki CDN globalny
- ✅ Darmowy tier hojny
- ✅ Workers integration

**Setup:**

1. Push projektu na GitHub
2. Zaloguj się na dash.cloudflare.com
3. Pages → Create a project
4. Connect to Git
5. Build settings:
   - Build command: `npm run build`
   - Build output: `dist`
6. Deploy!

---

### 5. Firebase Hosting

**Setup:**

```bash
# 1. Zainstaluj Firebase CLI
npm install -g firebase-tools

# 2. Zaloguj się
firebase login

# 3. Zainicjuj Firebase
firebase init hosting

# Wybierz:
# - Public directory: dist
# - Single-page app: Yes
# - Automatic builds: No

# 4. Zbuduj projekt
npm run build

# 5. Deploy
firebase deploy --only hosting
```

---

### 6. AWS S3 + CloudFront

**Dla zaawansowanych** - wymaga konfiguracji AWS.

**Kroki:**
1. Stwórz S3 bucket (public)
2. Upload `dist/` do S3
3. Skonfiguruj CloudFront distribution
4. Ustaw S3 jako origin
5. Skonfiguruj HTTPS z Certificate Manager

---

## ⚙️ Konfiguracja Pre-deploy

### 1. Optymalizacja Build

**vite.config.ts:**
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // Zwiększ limit rozmiaru chunków
    chunkSizeWarningLimit: 1000,

    // Optymalizacja rollup
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'jspdf-vendor': ['jspdf', 'jspdf-autotable'],
        },
      },
    },
  },
})
```

### 2. Environment Variables

Jeśli dodasz API klucze w przyszłości:

**Utwórz `.env.production`:**
```env
VITE_API_URL=https://api.example.com
```

**W kodzie:**
```typescript
const apiUrl = import.meta.env.VITE_API_URL
```

### 3. Dodaj .vercelignore / .gitignore

**.vercelignore:**
```
node_modules
.git
test-results
playwright-report
```

---

## 🔍 Weryfikacja Po Deployment

### Checklist:

- [ ] **Aplikacja ładuje się** - otwórz URL
- [ ] **Formularz działa** - wypełnij dane
- [ ] **Wyniki się wyświetlają** - sprawdź BMR, TDEE, BMI
- [ ] **PDF się generuje** - kliknij eksport
- [ ] **Mobile responsive** - otwórz na telefonie
- [ ] **HTTPS** - sprawdź kłódkę w URL
- [ ] **Brak błędów w konsoli** - F12 → Console
- [ ] **Performance** - Lighthouse audit (90+)

### Lighthouse Audit:

```bash
# Zainstaluj Lighthouse CLI
npm install -g lighthouse

# Uruchom audit
lighthouse https://twoja-aplikacja.vercel.app --view
```

Oczekiwane wyniki:
- **Performance:** 90+
- **Accessibility:** 95+
- **Best Practices:** 95+
- **SEO:** 90+

---

## 🌍 Custom Domain

### Vercel

1. Idź do Project Settings → Domains
2. Dodaj domenę: `bmr-calculator.example.com`
3. Skonfiguruj DNS:
   ```
   Type: CNAME
   Name: bmr-calculator
   Value: cname.vercel-dns.com
   ```
4. Poczekaj na propagację DNS (~1-24h)

### Netlify

1. Site settings → Domain management
2. Add custom domain
3. Dodaj DNS records:
   ```
   Type: CNAME
   Name: bmr-calculator
   Value: [site-name].netlify.app
   ```

---

## 🔄 Continuous Deployment

### GitHub Actions (automatyczny deploy)

**Utwórz `.github/workflows/deploy.yml`:**

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

**Sekret tokens:**
1. Wygeneruj token na vercel.com/account/tokens
2. GitHub → Settings → Secrets → Actions
3. Dodaj: `VERCEL_TOKEN`, `ORG_ID`, `PROJECT_ID`

---

## 📊 Monitoring

### Analytics (opcjonalnie)

**Google Analytics:**
```bash
npm install react-ga4
```

**Dodaj do `main.tsx`:**
```typescript
import ReactGA from 'react-ga4';

if (import.meta.env.PROD) {
  ReactGA.initialize('G-XXXXXXXXXX');
}
```

**Vercel Analytics:**
- Włącz w Project Settings → Analytics
- Automatyczne tracking speed metrics

---

## 🐛 Troubleshooting

### Build fails z "Chunk size warning"

**Rozwiązanie:**
```typescript
// vite.config.ts
build: {
  chunkSizeWarningLimit: 1000,
}
```

### 404 na refresh

**Rozwiązanie:**
Dodaj `_redirects` (Netlify) lub `vercel.json`:

**vercel.json:**
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

**_redirects (Netlify):**
```
/*    /index.html   200
```

### PDF nie działa w production

**Sprawdź:**
- [ ] jsPDF w dependencies (nie devDependencies)
- [ ] Build includes node_modules
- [ ] No CSP blocking canvas

---

## ✅ Post-Deployment Checklist

- [ ] URL działa
- [ ] HTTPS włączony
- [ ] Formularz functional
- [ ] PDF generation works
- [ ] Mobile responsive
- [ ] Performance >90 (Lighthouse)
- [ ] No console errors
- [ ] Analytics configured (opcjonalnie)
- [ ] Custom domain (opcjonalnie)
- [ ] Backup kodu (Git)

---

## 📝 Rollback (w razie problemów)

### Vercel
```bash
# Lista deployments
vercel list

# Rollback do poprzedniego
vercel rollback [deployment-url]
```

### Netlify
- Site settings → Deploys
- Kliknij "Publish deploy" na starszej wersji

---

## 🎉 Gotowe!

Aplikacja BMR Calculator jest teraz live w produkcji!

**Gratulacje!** 🎊

Udostępnij link swoim użytkownikom i ciesz się profesjonalnym kalkulatorem BMR online.

---

**Utworzono:** 2026-02-20
**Wersja:** 1.0
