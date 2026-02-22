# 🎯 BodyMetrics Pro

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![React](https://img.shields.io/badge/React-19.2-61dafb)
![License](https://img.shields.io/badge/license-MIT-green)

## *Advanced Body Composition & Metabolism Calculator*

**Wszystko czego potrzebujesz do profesjonalnej oceny składu ciała**

Kompleksowa platforma analityczna dla dietetyków, diet-coaches i trenerów personalnych. BodyMetrics Pro łączy najszersze spektrum wzorów BMR, zaawansowane wskaźniki składu ciała i automatyczne raporty PDF w jednym narzędziu.

---

## ✨ Kluczowe Funkcje

### 🧮 11 Formuł BMR - Największa Baza
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

### 🔬 4 Metody Estymacji Tkanki Tłuszczowej
- ✅ **Ręczne wprowadzenie** - dla znanych wartości
- ✅ **US Navy Method** - obwody ciała (szyja, talia, biodra)
- ✅ **Deurenberg** - oparty na BMI, wieku i płci
- ✅ **BAI (Body Adiposity Index)** - obwód bioder i wzrost ⭐ NOWE!

### 📊 15+ Wskaźników Składu Ciała

#### Podstawowe Wskaźniki
- **BMI** (Body Mass Index) - z wizualną skalą i kategorią
- **WHR** (Waist-to-Hip Ratio) - stosunek talii do bioder
- **WHtR** (Waist-to-Height Ratio) - stosunek talii do wzrostu
- **BAI** (Body Adiposity Index) - wskaźnik adiposity

#### Zaawansowane Wskaźniki Składu Ciała
- **LBM** (Lean Body Mass) - 3 formuły: Boer, James, Hume
- **FFM** (Fat-Free Mass) - masa beztłuszczowa
- **FFMI** (Fat-Free Mass Index) - indeks masy beztłuszczowej z normalizacją wzrostu

#### Wskaźniki Metaboliczne ⭐ NOWE!
- **SMM** (Skeletal Muscle Mass) - masa mięśni szkieletowych
- **TBW** (Total Body Water) - całkowita zawartość wody w organizmie
- **Wiek Metaboliczny** - porównanie metabolizmu z normami wiekowymi
- **Tłuszcz Trzewny** (Visceral Fat) - ocena ryzyka chorób metabolicznych

### 🍽️ Zaawansowany Kalkulator Makroskładników
- **6 strategii żywieniowych:**
  - Cutting (redukcja)
  - Bulking (masa)
  - Maintenance (utrzymanie)
  - Recomposition (rekomponizycja)
  - Keto (ketogeniczna)
  - Low-carb (niskowęglowodanowa)
- Precyzyjne wyliczenia białka, węglowodanów i tłuszczów
- Podział na posiłki

### 📄 Profesjonalne Raporty PDF
- Export wszystkich wyników jednym kliknięciem
- Możliwość dodania imienia klienta
- Czytelny, profesjonalny layout
- Wszystkie wskaźniki i interpretacje

### 🎨 UX/UI
- ✅ **Pełna responsywność** - desktop, tablet, mobile
- ✅ **Polski interfejs** - wszystkie opisy i kategorie
- ✅ **Intuicyjna nawigacja** - sekcje expandują się automatycznie
- ✅ **Kolorowe wskaźniki** - łatwa interpretacja wyników

---

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

Aplikacja będzie dostępna na `http://localhost:5182`

### Build Produkcyjny

```bash
# Zbuduj dla produkcji
npm run build

# Folder dist/ zawiera gotową aplikację
```

### 🌐 Deployment na Serwer

#### Opcja 1: Netlify (Zalecane - Najłatwiejsze) 🚀

```bash
# 1. Zbuduj projekt
npm run build

# 2. Wejdź na https://app.netlify.com/drop
# 3. Przeciągnij folder 'dist' na stronę
# Gotowe! Aplikacja będzie online w 30 sekund
```

#### Opcja 2: Vercel

```bash
# Przez CLI
npm i -g vercel
vercel

# LUB przez GitHub - push kod i połącz w Vercel Dashboard
```

#### Opcja 3: Własny Serwer (VPS)

```bash
# 1. Zbuduj lokalnie
npm run build

# 2. Prześlij na serwer
scp -r dist/* user@server.com:/var/www/bodymetrics-pro/

# 3. Skonfiguruj Nginx/Apache (zobacz DEPLOYMENT.md)
```

#### Opcja 4: Szybki Skrypt Deployment

```bash
# Automatyczny build i weryfikacja
./deploy-quick.sh
```

**📖 Pełna instrukcja deployment:** Zobacz [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 📖 Jak Używać

### 1️⃣ Wprowadź Dane Podstawowe
- **Waga** (kg): 20-400
- **Wzrost** (cm): 100-250
- **Wiek** (lata): 15-120
- **Płeć**: Mężczyzna/Kobieta

### 2️⃣ Opcjonalnie: Dodaj Obwody Ciała
- **Obwód szyi** (cm) - dla US Navy
- **Obwód talii** (cm) - dla WHR, WHtR i Visceral Fat
- **Obwód bioder** (cm) - dla WHR i BAI

### 3️⃣ Wybierz Metodę Estymacji BF%
- **Ręczne** - wpisz znaną wartość
- **US Navy** - automatycznie z obwodów
- **Deurenberg** - automatycznie z BMI
- **BAI** - automatycznie z bioder i wzrostu

### 4️⃣ Sprawdź Wyniki
- **Tabela BMR** - wszystkie 11 modeli ze średnią
- **TDEE** - wybierz poziom aktywności (1.2 - 1.95)
- **BMI** - kategoria i zakres zdrowej wagi
- **Wskaźniki składu ciała** - WHR, WHtR, BAI, LBM, FFM, FFMI
- **Wskaźniki metaboliczne** - SMM, TBW, Wiek Metaboliczny, Visceral Fat
- **Makroskładniki** - wybierz cel i strategię żywieniową

### 5️⃣ Eksportuj do PDF
- Opcjonalnie: wpisz imię klienta
- Kliknij "Eksportuj do PDF"
- Pobierz profesjonalny raport

---

## 🏗️ Architektura

### Stack Technologiczny
- **Frontend:** React 19 + TypeScript 5.9
- **Styling:** Tailwind CSS 4
- **Build:** Vite 7
- **PDF:** jsPDF + jsPDF-AutoTable
- **Icons:** Lucide React
- **Testing:** Playwright (125 testów E2E)

### Struktura Projektu
```
src/
├── components/                # Komponenty React
│   ├── InputForm/            # Formularz danych
│   ├── BodyFatEstimator/     # 4 metody estymacji BF%
│   ├── BMRResultsTable/      # Tabela 11 wzorów BMR
│   ├── TDEESection/          # Kalkulator TDEE
│   ├── BMISection/           # Sekcja BMI
│   ├── WHRSection/           # WHR (Waist-Hip Ratio)
│   ├── WHtRSection/          # WHtR (Waist-Height Ratio)
│   ├── BodyCompositionSection/  # LBM + FFM
│   ├── FFMISection/          # Fat-Free Mass Index
│   ├── AdvancedBodyMetricsSection/  # SMM, TBW, Metabolic Age, Visceral Fat
│   ├── MacroCalculator/      # 6 strategii makro
│   └── PDFExport/            # Generator PDF
├── utils/                    # Logika obliczeń
│   ├── bmrModels.ts          # 11 formuł BMR
│   ├── bodyFat.ts            # Estymatory % tkanki
│   ├── bmi.ts                # Kalkulator BMI
│   ├── whr.ts                # WHR calculations
│   ├── whtr.ts               # WHtR calculations
│   ├── bai.ts                # BAI calculations
│   ├── bodyComposition.ts    # LBM + FFM calculations
│   ├── ffmi.ts               # FFMI calculations
│   ├── advancedBodyMetrics.ts # SMM, TBW, Metabolic Age, Visceral Fat
│   ├── tdee.ts               # Kalkulator TDEE
│   ├── macros.ts             # Kalkulacje makroskładników
│   └── pdfGenerator.ts       # Generator PDF
├── types/                    # TypeScript types
├── constants/                # Stałe i metadane
└── App.tsx                   # Główny komponent
```

---

## 📚 Referencje Naukowe

Wszystkie formuły implementują oryginalne publikacje naukowe:

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
12. **Boer P** (1984). Estimated lean body mass as an index for normalization. Am J Clin Nutr.
13. **Watson PE et al.** (1980). Total body water volumes for adult males and females. Am J Clin Nutr.

---

## 🧪 Testowanie

### Pokrycie Testami
- **125 testów E2E (Playwright)** ✅
- **11 testów** dla zaawansowanych wskaźników metabolicznych
- **11 testów** dla BAI jako estymatora
- **24 testów** dla FFMI
- **20 testów** dla LBM/FFM
- Pełne pokrycie wszystkich funkcjonalności

### Uruchom Testy

```bash
# Zainstaluj Playwright (tylko raz)
npx playwright install

# Uruchom wszystkie testy
npx playwright test

# Uruchom konkretny plik testów
npx playwright test advanced-body-metrics.spec.ts

# Zobacz raport HTML
npx playwright show-report
```

---

## 🎯 Target Audience

### Dla Kogo?
- 🏥 **Dietetycy kliniczni** - kompleksowa analiza pacjentów
- 💪 **Diet-coaches** - profesjonalne plany żywieniowe
- 🏋️ **Trenerzy personalni** - ocena składu ciała i postępów
- 🏢 **Kliniki żywieniowe** - standaryzowane raporty

### Use Cases
- 📋 **Pierwsza konsultacja** - pełna analiza wyjściowa klienta
- 📊 **Monitoring postępów** - porównywanie wyników w czasie
- 💪 **Planowanie treningów** - na podstawie FFMI i SMM
- 🎯 **Cele żywieniowe** - precyzyjne kalkulacje makroskładników
- 📄 **Profesjonalne raporty** - PDF dla klientów

---

## 🎨 Design System

### Kolory
- **Primary:** Niebieski/Indygo - profesjonalizm, zaufanie
- **Success:** Zielony - zdrowy zakres, norma
- **Warning:** Pomarańczowy/Żółty - uwaga, podwyższone wartości
- **Danger:** Czerwony - wysokie ryzyko
- **Background:** Jasny szary - czytelność

### Responsywność
- **Desktop:** ≥1024px - 2-kolumnowy layout
- **Tablet:** 768-1023px - 1-kolumnowy, większe karty
- **Mobile:** ≤767px - stacked sections, pełna funkcjonalność

---

## 🔒 Prywatność i Bezpieczeństwo

- ✅ **Brak backendu** - wszystkie obliczenia po stronie klienta
- ✅ **Brak przesyłania danych** - żadne dane nie opuszczają przeglądarki
- ✅ **Brak cookies** - stateless application
- ✅ **Brak logowania** - nie wymaga konta użytkownika
- ✅ **GDPR compliant** - nie zbiera danych osobowych
- ✅ **100% offline capable** - działa bez internetu (po załadowaniu)

---

## 📊 Wydajność

- **Bundle size:** ~211 kB gzipped
  - JavaScript: ~210 kB (zawiera jsPDF)
  - CSS: ~5.5 kB
- **First Contentful Paint:** <1s
- **Time to Interactive:** <2s
- **Lighthouse Score:** 95+

---

## 🚀 Unique Selling Points (USP)

1. **11 formuł BMR** - największa baza na rynku polskim
2. **4 metody estymacji BF%** - w tym unikalna metoda BAI
3. **15+ wskaźników składu ciała** - kompleksowa analiza
4. **Wiek metaboliczny** - jedyne narzędzie z tym wskaźnikiem
5. **100% po polsku** - wszystkie opisy, kategorie, normy
6. **Offline-first** - działa bez internetu
7. **Privacy-first** - zero zbierania danych

---

## 📝 Licencja

MIT License

---

## 🙏 Podziękowania

- **Społeczność naukowa** za publikacje formuł BMR i wskaźników składu ciała
- **React Team** za wspaniały framework
- **Tailwind CSS** za świetny design system
- **jsPDF** za możliwość generowania PDF
- **Playwright** za framework do testowania

---

**Wersja:** 1.0.0
**Data wydania:** 2026-02-22
**Status:** ✅ Production Ready

**BodyMetrics Pro** - Made with ❤️ for nutritionists, diet-coaches & personal trainers

*Wszystko czego potrzebujesz do profesjonalnej oceny składu ciała*
