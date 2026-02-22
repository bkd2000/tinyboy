# Deployment Guide - BodyMetrics Pro

## 📦 Opcje Deployment

### Opcja 1: Netlify (Zalecane - Najłatwiejsze)

#### Krok 1: Zbuduj projekt
```bash
cd bmr-calculator
npm run build
```

To utworzy folder `dist/` z zbudowaną aplikacją.

#### Krok 2: Deploy przez Netlify Drop
1. Wejdź na https://app.netlify.com/drop
2. Przeciągnij folder `dist/` na stronę
3. Gotowe! Aplikacja będzie dostępna pod losowym URL (np. `https://random-name-123.netlify.app`)

#### Krok 3: (Opcjonalnie) Własna domena
1. W Netlify Dashboard → Domain Settings
2. Dodaj swoją własną domenę
3. Skonfiguruj DNS zgodnie z instrukcjami

---

### Opcja 2: Vercel

#### Przez CLI:
```bash
# Zainstaluj Vercel CLI
npm i -g vercel

# Deploy
cd bmr-calculator
vercel
```

#### Przez GitHub:
1. Wypchnij kod na GitHub
2. Wejdź na https://vercel.com
3. Import Repository
4. Vercel automatycznie wykryje Vite i zbuduje projekt

**Build settings:**
- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`

---

### Opcja 3: GitHub Pages

#### Krok 1: Dodaj konfigurację base w vite.config.ts
```typescript
export default defineConfig({
  plugins: [react()],
  base: '/nazwa-repo/', // Zamień na nazwę swojego repo
  server: {
    port: 5182,
    strictPort: true,
  },
})
```

#### Krok 2: Dodaj deploy script w package.json
```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

#### Krok 3: Zainstaluj gh-pages
```bash
npm install --save-dev gh-pages
```

#### Krok 4: Deploy
```bash
npm run deploy
```

Aplikacja będzie dostępna pod: `https://twoja-nazwa.github.io/nazwa-repo/`

---

### Opcja 4: Własny Serwer VPS (Apache/Nginx)

#### Krok 1: Zbuduj projekt lokalnie
```bash
npm run build
```

#### Krok 2: Prześlij folder dist/ na serwer
```bash
scp -r dist/* user@your-server.com:/var/www/bodymetrics-pro/
```

#### Krok 3: Konfiguracja Nginx
```nginx
server {
    listen 80;
    server_name bodymetrics-pro.com;
    root /var/www/bodymetrics-pro;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### Krok 4: Restart Nginx
```bash
sudo systemctl restart nginx
```

---

### Opcja 5: Docker

#### Dockerfile
```dockerfile
FROM node:20-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### nginx.conf
```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### Zbuduj i uruchom
```bash
docker build -t bodymetrics-pro .
docker run -p 80:80 bodymetrics-pro
```

---

## 🔍 Weryfikacja po deployment

Po wdrożeniu, sprawdź:

1. ✅ Aplikacja ładuje się poprawnie
2. ✅ Loga (Instytut Dietcoachingu + Poradnia) są widoczne
3. ✅ Formularze działają
4. ✅ Kalkulacje BMR/TDEE/BMI działają
5. ✅ Export PDF działa
6. ✅ Wszystkie grafiki i style się ładują

---

## 📝 Checklist przed deployment

- [ ] `npm run build` działa bez błędów
- [ ] Wszystkie testy Playwright przechodzą: `npx playwright test`
- [ ] Sprawdź czy loga są w folderze `public/logos/`
- [ ] Sprawdź performance: `npm run preview` i otwórz Chrome DevTools
- [ ] Sprawdź na urządzeniach mobilnych (responsive design)

---

## 🚀 Najszybsza opcja: Netlify Drop

**Dla osoby nietechnicznej, Netlify Drop jest NAJŁATWIEJSZE:**

```bash
cd bmr-calculator
npm run build
```

Potem po prostu przeciągnij folder `dist/` na https://app.netlify.com/drop

Gotowe w 2 minuty! 🎉

---

## 🔧 Troubleshooting

### Problem: Loga się nie ładują
**Rozwiązanie:** Upewnij się, że folder `public/logos/` jest zawarty w build. Vite automatycznie kopiuje zawartość `public/` do `dist/`.

### Problem: 404 przy odświeżeniu strony
**Rozwiązanie:** Skonfiguruj serwer, aby zawsze zwracał `index.html` dla wszystkich ścieżek (SPA fallback).

### Problem: Błąd przy budowaniu
**Rozwiązanie:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```
