# Agent Orchestration Strategy - BMR Calculator

## 🤖 Strategia Orchestracji Agentów

### Przegląd
Projekt zostanie zrealizowany przez specjalistycznych agentów odpowiedzialnych za konkretne obszary funkcjonalności. Każdy agent ma jasno zdefiniowany zakres odpowiedzialności i deliverables.

---

## 📋 Mapa Agentów

```
┌─────────────────────────────────────────────────────────────┐
│                     ORCHESTRATOR                             │
│                  (Koordynacja całości)                       │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
   ┌────────┐    ┌──────────┐   ┌──────────┐
   │ @setup │    │@calculator│   │ @ui-*    │
   │        │───▶│          │──▶│          │
   └────────┘    └──────────┘   └──────────┘
                       │              │
                       ▼              ▼
                  ┌─────────┐   ┌──────────┐
                  │  @pdf   │   │@designer │
                  └─────────┘   └──────────┘
                       │              │
                       └──────┬───────┘
                              ▼
                       ┌──────────────┐
                       │ @integrator  │
                       └──────────────┘
                              │
                              ▼
                       ┌──────────────┐
                       │   @devops    │
                       └──────────────┘
```

---

## 🎭 Agenci i ich Role

### 1. @setup - Infrastructure Agent
**Rola:** Przygotowanie środowiska projektu
**Priorytet:** CRITICAL (musi być pierwszy)
**Czas:** ~1h

**Zadania:**
- [x] Inicjalizacja projektu Vite + React + TypeScript
- [x] Konfiguracja Tailwind CSS
- [x] Instalacja zależności (jsPDF, jsPDF-AutoTable, lucide-react)
- [x] Utworzenie struktury katalogów

**Deliverables:**
```
✅ package.json z wszystkimi dependencies
✅ vite.config.ts
✅ tailwind.config.js z custom theme
✅ tsconfig.json
✅ Struktura katalogów src/components, src/utils, src/types, src/constants
✅ Pusty App.tsx z podstawowym layoutem
```

**Dependencies:** None
**Blokuje:** Wszystkie inne fazy

---

### 2. @calculator - Core Logic Agent
**Rola:** Implementacja logiki obliczeniowej
**Priorytet:** HIGH
**Czas:** ~4h

**Zadania:**
- [x] Implementacja 11 formuł BMR w `utils/bmrModels.ts`
- [x] Implementacja estymatorów tkanki tłuszczowej w `utils/bodyFat.ts`
- [x] Implementacja kalkulatora BMI w `utils/bmi.ts`
- [x] Implementacja kalkulatora TDEE w `utils/tdee.ts`
- [x] Testy jednostkowe dla wszystkich funkcji
- [x] Definicje TypeScript types

**Deliverables:**
```typescript
// utils/bmrModels.ts
export function calculateHarrisBenedictOriginal(params: BMRParams): number
export function calculateHarrisBenedictRevised(params: BMRParams): number
export function calculateMifflinStJeor(params: BMRParams): number
export function calculateKatchMcArdle(params: BMRParamsWithBF): number
export function calculateCunningham(params: BMRParamsWithBF): number
export function calculateOwen(params: BMRParams): number
export function calculateSchofield(params: BMRParams): number
export function calculateHenry(params: BMRParams): number
export function calculateMuller(params: BMRParams): number
export function calculateLivingston(params: BMRParams): number
export function calculateBernstein(params: BMRParams): number
export function calculateAllBMR(params: BMRParams, bodyFat?: number): BMRResults

// utils/bodyFat.ts
export function estimateBodyFatUSNavy(params: NavyParams): number
export function estimateBodyFatDeurenberg(params: DeurenbergParams): number

// utils/bmi.ts
export function calculateBMI(weight: number, height: number): number
export function getBMICategory(bmi: number): BMICategory
export function getHealthyWeightRange(height: number): { min: number; max: number }

// utils/tdee.ts
export function calculateTDEE(bmr: number, activityLevel: number): number
export const ACTIVITY_LEVELS = [
  { value: 1.2, label: 'Siedzący tryb życia', description: '...' },
  { value: 1.375, label: 'Lekko aktywny', description: '...' },
  // ...
]
```

**Dependencies:** @setup
**Blokuje:** @ui-forms, @ui-results, @pdf

---

### 3. @ui-forms - Frontend Form Agent
**Rola:** Implementacja formularzy wejściowych
**Priorytet:** HIGH
**Czas:** ~3h

**Zadania:**
- [x] Komponent `InputForm` z walidacją
- [x] Komponent `BodyFatEstimator` z 3 metodami
- [x] Dynamiczne pokazywanie/ukrywanie pól
- [x] Komunikaty błędów po polsku
- [x] Responsywny layout formularza

**Deliverables:**
```typescript
// components/InputForm/index.tsx
export function InputForm({ data, onChange }: InputFormProps)

// components/BodyFatEstimator/index.tsx
export function BodyFatEstimator({ formData, value, onChange }: BodyFatEstimatorProps)
```

**Components:**
- InputForm
  - Pola: waga, wzrost, wiek, płeć
  - Opcjonalne: obwód szyi, talii, bioder
  - Walidacja z komunikatami błędów
- BodyFatEstimator
  - Radio: Ręczne / US Navy / Deurenberg
  - Warunkowe pola
  - Wyświetlenie wyniku estymacji

**Dependencies:** @setup, @calculator (dla types)
**Blokuje:** @integrator

---

### 4. @ui-results - Frontend Results Agent
**Rola:** Implementacja komponentów wynikowych
**Priorytet:** HIGH
**Czas:** ~4h

**Zadania:**
- [x] Komponent `BMRResultsTable` z tabelą 11 modeli
- [x] Komponent `TDEESection` z kartami aktywności
- [x] Komponent `BMISection` z kategorią i skalą
- [x] Sortowanie, highlighty, stany puste

**Deliverables:**
```typescript
// components/BMRResultsTable/index.tsx
export function BMRResultsTable({ results }: BMRResultsTableProps)

// components/TDEESection/index.tsx
export function TDEESection({ bmr, activityLevel, onChange }: TDEESectionProps)

// components/BMISection/index.tsx
export function BMISection({ bmi, height }: BMISectionProps)
```

**Components:**
- BMRResultsTable
  - Tabela z 11 modelami
  - Wyróżnienie min/max/średniej
  - Sortowanie
  - Oznaczenie modeli bez danych
- TDEESection
  - 5 kart poziomów aktywności
  - Wybór poziomu (highlight)
  - Wynik TDEE
- BMISection
  - Wartość BMI
  - Kategoria z kolorem
  - Wizualna skala
  - Zakres zdrowej wagi

**Dependencies:** @setup, @calculator
**Blokuje:** @integrator

---

### 5. @pdf - PDF Generation Agent
**Rola:** Implementacja eksportu PDF
**Priorytet:** MEDIUM
**Czas:** ~2h

**Zadania:**
- [x] Komponent `PDFExport` z UI
- [x] Funkcja generowania PDF z jsPDF
- [x] Formatowanie profesjonalnego dokumentu
- [x] Wszystkie sekcje w PDF (dane, BMR, TDEE, BMI)

**Deliverables:**
```typescript
// components/PDFExport/index.tsx
export function PDFExport({ data }: PDFExportProps)

// utils/pdfGenerator.ts
export function generatePDF(data: PDFData, clientName?: string): void
```

**PDF Sections:**
1. Nagłówek (tytuł, data, imię klienta)
2. Dane wejściowe
3. Tabela BMR (11 modeli + średnia)
4. TDEE (poziom aktywności + wartość)
5. BMI (wartość + kategoria + zakres zdrowej wagi)
6. Stopka (disclaimer)

**Dependencies:** @calculator, @ui-results (dla struktur danych)
**Blokuje:** @integrator

---

### 6. @designer - UI/UX Design Agent
**Rola:** Implementacja design systemu
**Priorytet:** MEDIUM
**Czas:** ~3h

**Zadania:**
- [x] Konfiguracja Tailwind z custom theme
- [x] Paleta kolorów (primary, success, warning, danger)
- [x] Typografia (Inter font)
- [x] Responsywne breakpointy
- [x] Komponenty stylizowane (przyciski, karty, inputy)
- [x] Ikony Lucide React

**Deliverables:**
```javascript
// tailwind.config.js z custom theme
module.exports = {
  theme: {
    extend: {
      colors: { primary: '#1E40AF', success: '#16A34A', ... },
      fontFamily: { sans: ['Inter', 'system-ui'] },
    },
  },
}
```

**Style Guidelines:**
- Desktop (≥1024px): 2-kolumnowy layout
- Tablet (768-1023px): 1-kolumnowy, większe karty
- Mobile (≤767px): stacked sections
- Karty: shadow-sm, rounded-lg (8px)
- Przyciski: primary (niebieski), secondary (szary)
- Medyczny wygląd: stonowane kolory, czytelność

**Dependencies:** @setup
**Blokuje:** @integrator

---

### 7. @integrator - Integration Agent
**Rola:** Integracja wszystkich komponentów
**Priorytet:** HIGH
**Czas:** ~3h

**Zadania:**
- [x] Stworzenie głównego `App.tsx` z integracją
- [x] State management (useState, useMemo)
- [x] Flow danych: formData → obliczenia → wyniki
- [x] Testy integracyjne
- [x] Obsługa edge cases
- [x] Przycisk Reset

**Deliverables:**
```typescript
// App.tsx
function App() {
  const [formData, setFormData] = useState<FormData>({})
  const [bodyFatPercent, setBodyFatPercent] = useState<number | null>(null)
  const [activityLevel, setActivityLevel] = useState<number>(1.2)

  const bmrResults = useMemo(() => calculateAllBMR(formData, bodyFatPercent), [formData, bodyFatPercent])
  const tdee = useMemo(() => calculateTDEE(bmrResults.average, activityLevel), [bmrResults, activityLevel])
  const bmi = useMemo(() => calculateBMI(formData.weight, formData.height), [formData])

  return (/* Layout z wszystkimi komponentami */)
}
```

**Integration Points:**
- InputForm → formData state
- BodyFatEstimator → bodyFatPercent state
- formData + bodyFatPercent → bmrResults (useMemo)
- bmrResults → BMRResultsTable
- bmrResults.average + activityLevel → TDEESection
- formData → BMISection
- all data → PDFExport

**Dependencies:** @ui-forms, @ui-results, @pdf, @designer
**Blokuje:** @devops

---

### 8. @devops - Deployment Agent
**Rola:** Build, deployment, dokumentacja
**Priorytet:** LOW
**Czas:** ~1h

**Zadania:**
- [x] Optimizacja build (`npm run build`)
- [x] Dokumentacja README.md
- [x] Dokumentacja formuł FORMULAS.md
- [x] Deploy na Vercel/Netlify

**Deliverables:**
```
✅ dist/ folder gotowy do deploymentu
✅ README.md (instalacja, uruchomienie, opis)
✅ FORMULAS.md (11 formuł BMR z źródłami)
✅ Aplikacja live na publicznym URL
```

**Documentation:**
- README.md: opis projektu, instalacja, licencja
- FORMULAS.md: szczegółowe opisy 11 formuł BMR, źródła naukowe
- Inline komentarze w kodzie

**Dependencies:** @integrator
**Blokuje:** None (ostatnia faza)

---

## 🔄 Workflow Orchestracji

### Krok 1: Sekwencyjne uruchomienie faz krytycznych
```
@setup (1h)
  ↓
@calculator (4h) || @designer (3h)  // równolegle
  ↓
@ui-forms (3h) || @ui-results (4h)  // równolegle
```

### Krok 2: Faza uzupełniająca
```
@pdf (2h)  // po @calculator, @ui-results
```

### Krok 3: Integracja
```
@integrator (3h)  // po wszystkich powyższych
```

### Krok 4: Deployment
```
@devops (1h)  // po @integrator
```

---

## 📊 Ścieżka Krytyczna (Critical Path)

```
@setup → @calculator → @ui-results → @integrator → @devops
  1h        4h            4h             3h          1h
                                     Total: 13h
```

**Równoległe ścieżki (mogą działać jednocześnie):**
- @designer może działać równolegle z @calculator
- @ui-forms może działać równolegle z @ui-results
- @pdf może działać po @calculator i podczas @ui-results

**Szacowany czas całkowity z parallelizacją:** ~15-17h

---

## ✅ Checkpointy i Review Points

### Checkpoint 1: Po @setup
**Weryfikacja:**
- [ ] `npm run dev` uruchamia aplikację
- [ ] Tailwind działa (testowy komponent z klasami)
- [ ] Struktura katalogów zgodna z planem

**Go/No-Go:** Czy można przejść do @calculator i @designer?

---

### Checkpoint 2: Po @calculator
**Weryfikacja:**
- [ ] Wszystkie 11 formuł BMR wyliczają poprawne wartości
- [ ] Estymatory tkanki tłuszczowej działają
- [ ] Testy jednostkowe przechodzą
- [ ] Types TypeScript zdefiniowane

**Testy:**
```typescript
// Przykładowe dane testowe
const testData = {
  weight: 70,
  height: 175,
  age: 30,
  gender: 'male'
}

// Oczekiwane wyniki (w przybliżeniu)
expect(calculateMifflinStJeor(testData)).toBeCloseTo(1675, 10)
```

**Go/No-Go:** Czy logika obliczeniowa jest poprawna?

---

### Checkpoint 3: Po @ui-forms i @ui-results
**Weryfikacja:**
- [ ] Formularz waliduje poprawnie dane
- [ ] Komunikaty błędów po polsku
- [ ] Tabela BMR wyświetla się czytelnie
- [ ] TDEE i BMI działają
- [ ] Responsywność na mobile/tablet

**Go/No-Go:** Czy UI jest gotowe do integracji?

---

### Checkpoint 4: Po @pdf
**Weryfikacja:**
- [ ] PDF generuje się bez błędów
- [ ] Wszystkie sekcje są w PDF
- [ ] Wygląd profesjonalny
- [ ] Czytelne tabele

**Go/No-Go:** Czy PDF spełnia wymagania?

---

### Checkpoint 5: Po @integrator
**Weryfikacja:**
- [ ] Cała aplikacja działa end-to-end
- [ ] Testy integracyjne przechodzą
- [ ] Brak błędów w konsoli
- [ ] Edge cases obsłużone
- [ ] Reset działa

**Testy E2E:**
1. Wypełnienie formularza
2. Wybór metody estymacji tkanki tłuszczowej
3. Sprawdzenie wyników BMR
4. Wybór poziomu aktywności TDEE
5. Sprawdzenie BMI
6. Wygenerowanie PDF
7. Reset i ponowne wypełnienie

**Go/No-Go:** Czy aplikacja jest gotowa do deploymentu?

---

### Checkpoint 6: Po @devops
**Weryfikacja:**
- [ ] `npm run build` działa bez błędów
- [ ] Aplikacja deployed i dostępna publicznie
- [ ] Dokumentacja kompletna
- [ ] Formuły udokumentowane ze źródłami

**Go/No-Go:** Czy projekt jest gotowy do przekazania?

---

## 🚨 Obsługa Błędów i Blokad

### Jeśli agent @calculator napotka problemy:
1. **Błędne wyniki formuł:**
   - Przegląd publikacji naukowych
   - Weryfikacja jednostek (kg vs lbs, cm vs inches)
   - Testy z przykładami z literatury

2. **Brak danych do testów:**
   - Użycie standardowych przykładów z WHO/NIH
   - Cross-reference z istniejącymi kalkulatorami online

### Jeśli agent @ui-* napotka problemy:
1. **Problemy z responsywnością:**
   - Użycie mobile-first approach
   - Testowanie na rzeczywistych urządzeniach

2. **Słaba czytelność:**
   - Konsultacja z design system guidelines
   - A/B testing różnych wariantów

### Jeśli agent @integrator napotka problemy:
1. **State management zbyt skomplikowany:**
   - Rozważenie useReducer zamiast useState
   - Ewentualnie Zustand dla globalnego stanu

2. **Performance issues:**
   - Optymalizacja useMemo/useCallback
   - Debouncing dla inputów

---

## 📞 Komunikacja między agentami

### @setup → @calculator
**Przekazuje:**
- Struktura katalogów `utils/`
- Plik `types/index.ts` z podstawowymi types

### @calculator → @ui-forms, @ui-results, @pdf
**Przekazuje:**
- TypeScript interfaces (BMRParams, BMRResults, etc.)
- Funkcje obliczeniowe jako importy

### @designer → wszyscy agenci UI
**Przekazuje:**
- Tailwind config z custom theme
- Style guidelines (kolory, typografia, spacing)

### @ui-* → @integrator
**Przekazuje:**
- Komponenty gotowe do użycia
- Props interfaces

### @integrator → @devops
**Przekazuje:**
- Gotowa aplikacja w `src/`
- Lista dependencies do optimizacji

---

## 🎯 Success Metrics

### Dla każdego agenta:

**@setup:**
- [ ] 0 błędów przy `npm install`
- [ ] `npm run dev` uruchamia się <5s

**@calculator:**
- [ ] 100% coverage testów jednostkowych
- [ ] Wyniki zgodne z publikacjami (±1 kcal)

**@ui-forms:**
- [ ] Walidacja wszystkich edge cases
- [ ] 0 błędów walidacji dla poprawnych danych

**@ui-results:**
- [ ] Tabela czytelna na mobile (min. 375px)
- [ ] Highlighty widoczne i intuicyjne

**@pdf:**
- [ ] PDF generuje się <2s
- [ ] Wszystkie sekcje w jednym dokumencie

**@designer:**
- [ ] Spójny wygląd na wszystkich breakpointach
- [ ] Kontrast WCAG AA dla tekstu

**@integrator:**
- [ ] 0 błędów w konsoli
- [ ] Reset czyści wszystkie stany

**@devops:**
- [ ] Build <1min
- [ ] Aplikacja ładuje się <3s

---

## 🔐 Handoff Protocol

### Przekazanie między fazami:
1. Agent kończy swoją fazę
2. Tworzy **HANDOFF.md** z:
   - Lista wykonanych zadań
   - Deliverables (pliki, komponenty)
   - Znane issues/ograniczenia
   - Instrukcje dla następnego agenta
3. Review przez orchestratora
4. Zatwierdzenie i start następnej fazy

### Przykład HANDOFF.md:
```markdown
# Handoff: @calculator → @ui-results

## Completed:
- ✅ 11 BMR formulas implemented
- ✅ Body fat estimators (US Navy, Deurenberg)
- ✅ BMI calculator
- ✅ TDEE calculator

## Deliverables:
- `utils/bmrModels.ts` - all 11 formulas
- `utils/bodyFat.ts` - estimators
- `types/index.ts` - BMRParams, BMRResults, etc.

## Known Issues:
- Katch-McArdle requires bodyFat% - handle in UI with conditional rendering

## Instructions for @ui-results:
- Import `calculateAllBMR()` from utils/bmrModels
- Use `BMRResults` type for table props
- Display models without data as "Brak danych" in gray
```

---

**Status:** ✅ Strategia orchestracji gotowa
**Data utworzenia:** 2026-02-20
**Wersja:** 1.0
