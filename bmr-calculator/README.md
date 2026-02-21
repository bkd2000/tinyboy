# Kalkulator BMR - Profesjonalny Kalkulator Podstawowej Przemiany Materii

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)
![React](https://img.shields.io/badge/React-18.3-61dafb)
![License](https://img.shields.io/badge/license-MIT-green)

Profesjonalny kalkulator BMR (Basal Metabolic Rate) dla dietetyków i diet coachów. Aplikacja oblicza BMR według wszystkich 11 uznanych modeli naukowych, porównuje wyniki w czytelnej tabeli, wylicza TDEE (Total Daily Energy Expenditure) oraz BMI.

## ✨ Funkcje

### 🧮 11 Modeli BMR
- **Harris-Benedict Original** (1919)
- **Harris-Benedict Revised** (1984)
- **Mifflin-St Jeor** (1990) - najczęściej rekomendowany
- **Katch-McArdle** (1996) - wymaga % tkanki tłuszczowej
- **Cunningham** (1980) - wymaga % tkanki tłuszczowej
- **Owen** (1986/1987)
- **Schofield/WHO** (1985)
- **Henry/Oxford** (2005)
- **Müller** (2004)
- **Livingston-Kohlstadt** (2005)
- **Bernstein** (1983)

### 📊 Dodatkowe Funkcje
- ✅ **3 metody estymacji % tkanki tłuszczowej:**
  - Ręczne wprowadzenie
  - US Navy Method (obwody ciała)
  - Deurenberg (BMI-based)
- ✅ **Kalkulator TDEE** z 5 poziomami aktywności
- ✅ **Kalkulator BMI** z wizualną skalą i kategorią
- ✅ **Eksport do PDF** - profesjonalny raport ze wszystkimi wynikami
- ✅ **Responsywny design** - działa na desktop, tablet i mobile
- ✅ **Pełny interfejs w języku polskim**

## 🚀 Szybki Start

### Wymagania
- Node.js 18+
- npm lub bun

### Instalacja

```bash
# Sklonuj repozytorium
git clone <repository-url>
cd bmr-calculator

# Zainstaluj zależności
npm install

# Uruchom serwer deweloperski
npm run dev
```

Aplikacja będzie dostępna na `http://localhost:5173`

### Build Produkcyjny

```bash
# Zbuduj dla produkcji
npm run build

# Folder dist/ zawiera gotową aplikację
```

## 📖 Jak Używać

### 1. Wprowadź Dane Podstawowe
- Waga (kg): 20-400
- Wzrost (cm): 100-250
- Wiek (lata): 15-120
- Płeć: Mężczyzna/Kobieta

### 2. Opcjonalnie: Dodaj Obwody Ciała
- Obwód szyi (cm)
- Obwód talii (cm)
- Obwód bioder (cm) - tylko dla kobiet

### 3. Wybierz Metodę Estymacji Tkanki Tłuszczowej
- **Ręczne** - wpisz znaną wartość
- **US Navy** - automatycznie z obwodów
- **Deurenberg** - automatycznie z BMI

### 4. Sprawdź Wyniki
- **Tabela BMR** - wszystkie 11 modeli ze średnią
- **TDEE** - wybierz poziom aktywności
- **BMI** - kategoria i zakres zdrowej wagi

### 5. Eksportuj do PDF
- Opcjonalnie: wpisz imię klienta
- Kliknij "Eksportuj do PDF"
- Pobierz profesjonalny raport

## 🏗️ Architektura

### Stack Technologiczny
- **Frontend:** React 18 + TypeScript
- **Styling:** Tailwind CSS 4
- **Build:** Vite
- **PDF:** jsPDF + jsPDF-AutoTable
- **Icons:** Lucide React

### Struktura Projektu
```
src/
├── components/          # Komponenty React
│   ├── InputForm/       # Formularz danych
│   ├── BodyFatEstimator/# Estymator tkanki tłuszczowej
│   ├── BMRResultsTable/ # Tabela wyników BMR
│   ├── TDEESection/     # Sekcja TDEE
│   ├── BMISection/      # Sekcja BMI
│   └── PDFExport/       # Eksport PDF
├── utils/               # Logika obliczeń
│   ├── bmrModels.ts     # 11 formuł BMR
│   ├── bodyFat.ts       # Estymatory % tkanki
│   ├── bmi.ts           # Kalkulator BMI
│   ├── tdee.ts          # Kalkulator TDEE
│   └── pdfGenerator.ts  # Generator PDF
├── types/               # TypeScript types
├── constants/           # Stałe i metadane
└── App.tsx              # Główny komponent
```

## 📚 Referencje Naukowe

Wszystkie formuły BMR są implementacją oryginalnych publikacji naukowych:

1. **Harris JA, Benedict FG** (1918). A Biometric Study of Human Basal Metabolism. PNAS.
2. **Roza AM, Shizgal HM** (1984). The Harris Benedict equation reevaluated. Am J Clin Nutr.
3. **Mifflin MD et al.** (1990). A new predictive equation for resting energy expenditure. Am J Clin Nutr.
4. **Katch VL, McArdle WD** (1996). Katch-McArdle Formula.
5. **Cunningham JJ** (1980). A reanalysis of the factors influencing basal metabolic rate. Am J Clin Nutr.
6. **Owen OE et al.** (1986/1987). A reappraisal of caloric requirements. Am J Clin Nutr.
7. **Schofield WN** (1985). Predicting basal metabolic rate, new standards. Hum Nutr Clin Nutr.
8. **Henry CJ** (2005). Basal metabolic rate studies in humans. Public Health Nutr.
9. **Müller MJ et al.** (2004). World Health Organization equations. Am J Clin Nutr.
10. **Livingston EH, Kohlstadt I** (2005). Simplified resting metabolic rate-predicting formulas. Obes Res.
11. **Bernstein RS et al.** (1983). Prediction of resting metabolic rate in obese patients. Am J Clin Nutr.

## 🧪 Testowanie

### Uruchom Testy E2E (Playwright)
```bash
# Zainstaluj Playwright (tylko raz)
npx playwright install

# Uruchom testy
npx playwright test

# Zobacz raport HTML
npx playwright show-report
```

### Manualne Testy
Zobacz `MANUAL_TEST_CHECKLIST.md` dla szczegółowej checklisty testowej (98 testów).

### Wyniki Testów
Zobacz `TESTING_RESULTS.md` dla pełnego raportu z testów.

## 🎨 Design System

### Kolory
- **Primary:** `#1E40AF` (niebieski - profesjonalizm)
- **Success:** `#16A34A` (zielony - norma BMI)
- **Warning:** `#F59E0B` (pomarańczowy - uwaga)
- **Danger:** `#DC2626` (czerwony - otyłość)
- **Background:** `#F8FAFC` (jasny szary)

### Typografia
- **Font:** Inter (system fallback)
- **Weights:** 400 (normal), 600 (semibold), 700 (bold)

### Responsywność
- **Desktop:** ≥1024px - 2-kolumnowy layout
- **Tablet:** 768-1023px - 1-kolumnowy, większe karty
- **Mobile:** ≤767px - stacked sections

## 📦 Deployment

### Vercel (Rekomendowane)

```bash
# Zainstaluj Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

### Netlify

```bash
# Zainstaluj Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy

# Production deployment
netlify deploy --prod
```

### Statyczny Hosting
Po `npm run build`, wgraj folder `dist/` na dowolny statyczny hosting:
- GitHub Pages
- AWS S3 + CloudFront
- Firebase Hosting
- Cloudflare Pages

## 🔒 Prywatność i Bezpieczeństwo

- ✅ **Brak backendu** - wszystkie obliczenia po stronie klienta
- ✅ **Brak przesyłania danych** - żadne dane nie opuszczają przeglądarki
- ✅ **Brak cookies** - stateless application
- ✅ **Brak logowania** - nie wymaga konta użytkownika
- ✅ **GDPR compliant** - nie zbiera danych osobowych

## 📊 Wydajność

- **Bundle size:** 216 kB gzipped
  - JavaScript: 211 kB (zawiera jsPDF dla PDF generation)
  - CSS: 4.5 kB
- **First Contentful Paint:** <1s
- **Time to Interactive:** <2s

## 🤝 Wkład w Projekt

Chcesz pomóc? Świetnie!

1. Fork repozytorium
2. Stwórz branch (`git checkout -b feature/AmazingFeature`)
3. Commit zmiany (`git commit -m 'Add AmazingFeature'`)
4. Push do brancha (`git push origin feature/AmazingFeature`)
5. Otwórz Pull Request

## 📝 Licencja

MIT License

## 🙏 Podziękowania

- **Społeczność naukowa** za publikacje formuł BMR
- **React Team** za wspaniały framework
- **Tailwind CSS** za świetny design system
- **jsPDF** za możliwość generowania PDF

---

**Wersja:** 1.0.0
**Data wydania:** 2026-02-20
**Status:** ✅ Production Ready

Made with ❤️ for nutritionists and diet coaches
