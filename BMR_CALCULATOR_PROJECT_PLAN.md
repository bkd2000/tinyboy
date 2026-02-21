# BMR Calculator - Plan Projektu i Orchestracja Agentów

## 📋 Przegląd Projektu

**Nazwa:** Kalkulator BMR (Basal Metabolic Rate)
**Typ:** Aplikacja webowa SPA (Single Page Application)
**Stack Technologiczny:** React 18 + TypeScript + Vite + Tailwind CSS
**Język Interfejsu:** Polski
**Status:** Planowanie

## 🎯 Cel Projektu

Stworzenie profesjonalnego kalkulatora BMR dla dietetyków i diet coachów, który:
- Oblicza BMR według 11 uznanych modeli naukowych
- Porównuje wyniki w czytelnej tabeli
- Wylicza TDEE (Total Daily Energy Expenditure) i BMI
- Zawiera wbudowane estymatory % tkanki tłuszczowej
- Eksportuje wyniki do profesjonalnego PDF
- Oferuje medyczny, wzbudzający zaufanie interfejs w języku polskim

## 🤖 Strategia Orchestracji Agentów

### Faza 1: Inicjalizacja Projektu
**Agent:** `@setup` (Infrastructure Agent)
**Zadania:**
1. Inicjalizacja projektu Vite + React + TypeScript
2. Konfiguracja Tailwind CSS z custom design system
3. Instalacja zależności: jsPDF, jsPDF-AutoTable, lucide-react
4. Utworzenie struktury katalogów:
   ```
   src/
   ├── components/
   │   ├── InputForm/
   │   ├── BodyFatEstimator/
   │   ├── BMRResultsTable/
   │   ├── TDEESection/
   │   ├── BMISection/
   │   └── PDFExport/
   ├── utils/
   │   ├── bmrModels.ts
   │   ├── bodyFat.ts
   │   ├── bmi.ts
   │   └── tdee.ts
   ├── types/
   │   └── index.ts
   └── constants/
       └── formulas.ts
   ```

**Deliverables:**
- ✅ Działający projekt Vite
- ✅ Skonfigurowany Tailwind z custom theme
- ✅ Kompletna struktura katalogów
- ✅ Zainstalowane wszystkie zależności

---

### Faza 2: Core Logic - Implementacja Obliczeń
**Agent:** `@calculator` (Backend Logic Agent)
**Zadania:**

#### 2.1 Implementacja 11 Modeli BMR (`utils/bmrModels.ts`)
1. **Harris-Benedict Original (1919)**
   - Mężczyźni: 66.5 + (13.75 × waga) + (5.003 × wzrost) - (6.755 × wiek)
   - Kobiety: 655.1 + (9.563 × waga) + (1.850 × wzrost) - (4.676 × wiek)

2. **Harris-Benedict Revised (1984)**
   - Mężczyźni: 88.362 + (13.397 × waga) + (4.799 × wzrost) - (5.677 × wiek)
   - Kobiety: 447.593 + (9.247 × waga) + (3.098 × wzrost) - (4.330 × wiek)

3. **Mifflin-St Jeor (1990)**
   - Mężczyźni: (10 × waga) + (6.25 × wzrost) - (5 × wiek) + 5
   - Kobiety: (10 × waga) + (6.25 × wzrost) - (5 × wiek) - 161

4. **Katch-McArdle** (wymaga % tkanki tłuszczowej)
   - BMR = 370 + (21.6 × LBM), gdzie LBM = waga × (1 - %tkanki_tłuszczowej/100)

5. **Cunningham (1980)** (wymaga % tkanki tłuszczowej)
   - BMR = 500 + (22 × LBM)

6. **Owen (1986/1987)**
   - Mężczyźni: 879 + (10.2 × waga)
   - Kobiety: 795 + (7.18 × waga)

7. **Schofield / WHO (1985)** - z przedziałami wiekowymi
8. **Henry / Oxford Equations (2005)**
9. **Müller (2004)** - uwzględnia kategorię BMI
10. **Livingston & Kohlstadt (2005)** - model potęgowy
11. **Bernstein (1983)** - dla osób z otyłością

#### 2.2 Estymatory Tkanki Tłuszczowej (`utils/bodyFat.ts`)
1. **US Navy Method**
   - Mężczyźni: 495 / (1.0324 - 0.19077 × log10(talia - szyja) + 0.15456 × log10(wzrost)) - 450
   - Kobiety: 495 / (1.29579 - 0.35004 × log10(talia + biodra - szyja) + 0.22100 × log10(wzrost)) - 450

2. **Deurenberg (BMI-based)**
   - (1.20 × BMI) + (0.23 × wiek) - (10.8 × płeć) - 5.4 (płeć: 1 dla mężczyzn, 0 dla kobiet)

3. **Manual Input** - bezpośrednie wpisanie wartości

#### 2.3 BMI (`utils/bmi.ts`)
- Obliczenie: waga (kg) / (wzrost (m))²
- Kategoryzacja:
  - < 18.5: Niedowaga
  - 18.5-24.9: Norma
  - 25-29.9: Nadwaga
  - 30-34.9: Otyłość I°
  - 35-39.9: Otyłość II°
  - ≥ 40: Otyłość III°
- Zakres zdrowej wagi dla danego wzrostu

#### 2.4 TDEE (`utils/tdee.ts`)
Współczynniki aktywności × średni BMR:
- Siedzący (1.2)
- Lekko aktywny (1.375)
- Umiarkowanie aktywny (1.55)
- Bardzo aktywny (1.725)
- Ekstremalnie aktywny (1.9)

**Deliverables:**
- ✅ Wszystkie 11 formuł BMR z testami jednostkowymi
- ✅ 3 metody estymacji tkanki tłuszczowej
- ✅ Kalkulator BMI z kategoryzacją
- ✅ Kalkulator TDEE
- ✅ Typy TypeScript dla wszystkich funkcji

---

### Faza 3: UI Components - Formularz i Walidacja
**Agent:** `@ui-forms` (Frontend Form Agent)
**Zadania:**

#### 3.1 InputForm Component
- Pola:
  - Waga (kg): 20-400, wymagane
  - Wzrost (cm): 100-250, wymagane
  - Wiek (lata): 15-120, wymagane
  - Płeć: toggle mężczyzna/kobieta, wymagane
  - Obwód szyi (cm): opcjonalne
  - Obwód talii (cm): opcjonalne
  - Obwód bioder (cm): opcjonalne, widoczne tylko dla kobiet
- Walidacja po polsku:
  - "Waga musi być w zakresie 20-400 kg"
  - "Wzrost musi być w zakresie 100-250 cm"
  - "Wiek musi być w zakresie 15-120 lat"
- Dynamiczne pokazywanie/ukrywanie pól obwodów

#### 3.2 BodyFatEstimator Component
- Wybór metody: Radio buttons (Ręczne / US Navy / Deurenberg)
- Warunkowe pola:
  - Ręczne: pole numeryczne
  - US Navy: pola obwodów (jeśli nie wypełnione w formularzu głównym)
  - Deurenberg: automatyczne na podstawie BMI
- Wyświetlenie wyniku: "Szacowany % tkanki tłuszczowej: XX.X% (metoda: [nazwa])"

**Deliverables:**
- ✅ Komponent InputForm z pełną walidacją
- ✅ Komponent BodyFatEstimator z 3 metodami
- ✅ Komunikaty błędów po polsku
- ✅ Responsywny layout formularza

---

### Faza 4: UI Components - Wyniki
**Agent:** `@ui-results` (Frontend Results Agent)
**Zadania:**

#### 4.1 BMRResultsTable Component
- Tabela z kolumnami:
  - Nazwa modelu (polski opis + rok)
  - Wynik BMR (kcal/dzień)
  - Odchylenie od średniej (±X kcal, ±X%)
- Funkcje:
  - Wyróżnienie min/max/średniej (kolory, bold)
  - Oznaczenie modeli niemożliwych do obliczenia (szary, "Brak danych")
  - Sortowanie rosnąco/malejąco
  - Legenda: jakie dane są wymagane dla każdego modelu
- Średnia BMR: duża, wyróżniona karta nad lub pod tabelą

#### 4.2 TDEESection Component
- 5 kart z poziomami aktywności:
  - Tytuł poziomu + współczynnik
  - Opis słowny z konkretnymi przykładami
  - Kliknięcie karty: wybór poziomu (highlight, border)
- Wynik TDEE:
  - Duża wartość w kcal/dzień
  - Opcjonalnie: TDEE dla każdego modelu BMR (rozszerzona tabela)

#### 4.3 BMISection Component
- Duża wartość BMI
- Kategoria z kolorem:
  - Zielony: norma
  - Żółty: niedowaga
  - Pomarańczowy: nadwaga
  - Czerwony: otyłość
- Wizualna skala BMI (slider/bar)
- Zakres zdrowej wagi: "Dla Twojego wzrostu (XXX cm), zdrowa waga to XX-XX kg"

**Deliverables:**
- ✅ BMRResultsTable z sortowaniem i highlightami
- ✅ TDEESection z 5 kartami aktywności
- ✅ BMISection z kategorią i skalą wizualną
- ✅ Stany puste ("Wprowadź dane, aby zobaczyć wyniki")

---

### Faza 5: PDF Export
**Agent:** `@pdf` (PDF Generation Agent)
**Zadania:**

#### 5.1 PDFExport Component
- Pole: Imię i nazwisko klienta (opcjonalne)
- Przycisk: "Eksportuj do PDF"

#### 5.2 PDF Content (jsPDF + jsPDF-AutoTable)
- **Nagłówek:**
  - Tytuł: "Raport Kalkulacji BMR"
  - Data wygenerowania
  - Imię i nazwisko klienta (jeśli podane)
- **Dane wejściowe:**
  - Waga, wzrost, wiek, płeć
  - % tkanki tłuszczowej (jeśli dostępne)
- **Tabela BMR:**
  - Wszystkie 11 modeli z wynikami
  - Średnia BMR (wyróżniona)
- **TDEE:**
  - Wybrany poziom aktywności
  - Wartość TDEE
- **BMI:**
  - Wartość BMI
  - Kategoria
  - Zakres zdrowej wagi
- **Stopka:**
  - Informacja: "Dokument wygenerowany przez Kalkulator BMR"
  - Disclaimer: "Wyniki służą wyłącznie celom informacyjnym..."

**Deliverables:**
- ✅ Profesjonalny PDF z czytelnymi tabelami
- ✅ Wygląd jak oficjalny dokument medyczny
- ✅ Wszystkie sekcje w jednym dokumencie

---

### Faza 6: Design System & Styling
**Agent:** `@designer` (UI/UX Design Agent)
**Zadania:**

#### 6.1 Tailwind Config
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1E40AF',
          light: '#3B82F6',
          dark: '#1E3A8A',
        },
        success: '#16A34A',
        warning: '#F59E0B',
        danger: '#DC2626',
        gray: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          // ...
          900: '#1E293B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
}
```

#### 6.2 Layout
- **Desktop (≥1024px):** 2-kolumnowy (formularz lewo, wyniki prawo)
- **Tablet (768-1023px):** 1-kolumnowy, większe karty
- **Mobile (≤767px):** 1-kolumnowy, stacked sections

#### 6.3 Komponenty stylizowane
- Przyciski: primary (niebieski), secondary (szary), ghost
- Karty: białe tło, shadow-sm, border-radius 8px
- Inputy: border, focus:ring-2, błędy w czerwonym
- Tabele: header z tłem primary-50, zebra striping

**Deliverables:**
- ✅ Skonfigurowany Tailwind z custom theme
- ✅ Responsywny layout na wszystkie breakpointy
- ✅ Profesjonalny medyczny wygląd
- ✅ Ikony Lucide React (stethoscope, calculator, user, etc.)

---

### Faza 7: Integration & Testing
**Agent:** `@integrator` (Integration Agent)
**Zadania:**

#### 7.1 App.tsx - Główna integracja
```typescript
function App() {
  const [formData, setFormData] = useState<FormData>({})
  const [bodyFatPercent, setBodyFatPercent] = useState<number | null>(null)
  const [activityLevel, setActivityLevel] = useState<number>(1.2)

  const bmrResults = useMemo(() => calculateAllBMR(formData, bodyFatPercent), [formData, bodyFatPercent])
  const tdee = useMemo(() => calculateTDEE(bmrResults.average, activityLevel), [bmrResults, activityLevel])
  const bmi = useMemo(() => calculateBMI(formData.weight, formData.height), [formData])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <InputForm data={formData} onChange={setFormData} />
            <BodyFatEstimator formData={formData} onChange={setBodyFatPercent} />
          </div>
          <div>
            <BMRResultsTable results={bmrResults} />
            <TDEESection bmr={bmrResults.average} onChange={setActivityLevel} />
            <BMISection bmi={bmi} height={formData.height} />
            <PDFExport data={{ formData, bmrResults, tdee, bmi }} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
```

#### 7.2 Testy
- **Jednostkowe:** Wszystkie funkcje obliczeniowe
- **Integracyjne:** Flow: dane → obliczenia → wyniki → PDF
- **E2E:** Testowanie z przykładowymi danymi
- **Edge cases:**
  - Ekstremalne wartości (BMI 50+, wiek 100+)
  - Brak opcjonalnych danych
  - Różne kombinacje metod estymacji

**Deliverables:**
- ✅ Działająca aplikacja z pełną integracją
- ✅ Testy pokrywające wszystkie formuły
- ✅ Obsługa błędów i edge cases
- ✅ Przycisk "Reset" czyszczący wszystkie dane

---

### Faza 8: Deployment & Documentation
**Agent:** `@devops` (Deployment Agent)
**Zadania:**

#### 8.1 Build & Optimization
- `npm run build` - optymalizacja produkcyjna
- Lazy loading komponentów (jeśli potrzebne)
- Optymalizacja bundle size

#### 8.2 Dokumentacja
- **README.md:**
  - Opis projektu
  - Instalacja: `npm install` + `npm run dev`
  - Źródła naukowe dla formuł
  - Licencja
- **FORMULAS.md:**
  - Szczegółowe opisy wszystkich 11 formuł BMR
  - Źródła publikacji naukowych
  - Zakresy stosowania każdej formuły

#### 8.3 Deployment
- Hosting: Vercel / Netlify (automatyczny deploy z Git)
- Domena: opcjonalnie custom domain

**Deliverables:**
- ✅ Zbudowana aplikacja gotowa do deploymentu
- ✅ Kompletna dokumentacja
- ✅ Aplikacja live na publicznym URL

---

## 📊 Harmonogram Implementacji

| Faza | Agent | Czas estymowany | Zależności |
|------|-------|-----------------|------------|
| 1. Inicjalizacja | @setup | 1h | - |
| 2. Core Logic | @calculator | 4h | Faza 1 |
| 3. UI Forms | @ui-forms | 3h | Faza 1, 2 |
| 4. UI Results | @ui-results | 4h | Faza 1, 2 |
| 5. PDF Export | @pdf | 2h | Faza 2, 3, 4 |
| 6. Design System | @designer | 3h | Faza 1 |
| 7. Integration | @integrator | 3h | Faza 3, 4, 5, 6 |
| 8. Deployment | @devops | 1h | Faza 7 |
| **TOTAL** | | **~21h** | |

---

## 🎯 Priorytety i Kamienie Milowe

### MVP (Minimum Viable Product) - Faza 1-4
- ✅ Działający kalkulator z 11 modelami BMR
- ✅ Formularz z walidacją
- ✅ Wyniki w formie tabeli
- ✅ TDEE i BMI

### Enhanced Version - Faza 5-6
- ✅ Eksport PDF
- ✅ Profesjonalny design medyczny
- ✅ Pełna responsywność

### Production Ready - Faza 7-8
- ✅ Testy i edge cases
- ✅ Dokumentacja
- ✅ Deployment

---

## 🔧 Techniczne Wymagania

### Pakiety npm
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.0.0",
    "jspdf": "^2.5.1",
    "jspdf-autotable": "^3.5.31",
    "lucide-react": "^0.263.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.0.0",
    "autoprefixer": "^10.4.14",
    "postcss": "^8.4.24",
    "tailwindcss": "^3.3.2",
    "vite": "^4.3.9",
    "vitest": "^0.32.2"
  }
}
```

### Środowisko
- Node.js 18+
- npm lub bun
- Nowoczesna przeglądarka (Chrome, Firefox, Safari, Edge)

---

## ✅ Kryteria Sukcesu

### Funkcjonalność
- [ ] Wszystkie 11 modeli BMR wyliczają się poprawnie
- [ ] Estymatory tkanki tłuszczowej działają zgodnie z publikacjami
- [ ] TDEE dla wszystkich 5 poziomów aktywności
- [ ] BMI z prawidłową kategoryzacją
- [ ] PDF generuje się poprawnie z wszystkimi danymi

### UX
- [ ] Interfejs 100% po polsku
- [ ] Intuicyjny flow bez dokumentacji
- [ ] Czytelne komunikaty błędów
- [ ] Opisy aktywności z przykładami ułatwiającymi wybór

### Jakość Techniczna
- [ ] Brak błędów w konsoli
- [ ] Szybkie obliczenia (<100ms)
- [ ] Poprawna walidacja wszystkich pól
- [ ] Responsywność na desktop/tablet/mobile

### Design
- [ ] Profesjonalny medyczny wygląd
- [ ] Spójna paleta kolorów
- [ ] Czytelne tabele i typografia
- [ ] PDF wygląda jak dokument z gabinetu

---

## 🚀 Kolejne Kroki

1. **Zatwierdzenie planu** przez użytkownika
2. **Uruchomienie Fazy 1** (@setup): Inicjalizacja projektu
3. **Iteracyjna implementacja** faza po fazie z review po każdej
4. **Testy** na końcu każdej fazy
5. **Deploy** po zakończeniu Fazy 8

---

## 📚 Źródła Naukowe (do referencji w kodzie)

1. Harris JA, Benedict FG. (1918). "A Biometric Study of Human Basal Metabolism"
2. Roza AM, Shizgal HM. (1984). "The Harris Benedict equation reevaluated"
3. Mifflin MD, et al. (1990). "A new predictive equation for resting energy expenditure"
4. Katch VL, McArdle WD. (1996). "Katch-McArdle Formula"
5. Cunningham JJ. (1980). "A reanalysis of the factors influencing basal metabolic rate"
6. Owen OE, et al. (1986/1987). "A reappraisal of caloric requirements"
7. Schofield WN. (1985). "Predicting basal metabolic rate, new standards"
8. Henry CJ. (2005). "Basal metabolic rate studies in humans"
9. Müller MJ, et al. (2004). "World Health Organization equations"
10. Livingston EH, Kohlstadt I. (2005). "Simplified resting metabolic rate-predicting formulas"
11. Bernstein RS, et al. (1983). "Prediction of the resting metabolic rate in obese patients"

---

**Status:** ✅ Plan gotowy do implementacji
**Data utworzenia:** 2026-02-20
**Wersja:** 1.0
