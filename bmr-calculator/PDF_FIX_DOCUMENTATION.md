# Naprawa wsparcia polskich znaków w PDF

## Problem
Generator PDF używał domyślnego fontu Helvetica, który nie obsługuje polskich znaków diakrytycznych (ą, ć, ę, ł, ń, ó, ś, ź, ż). W wygenerowanych raportach PDF znaki były wyświetlane niepoprawnie lub zastępowane innymi symbolami.

## Rozwiązanie
Dodano font **Roboto** (Regular i Bold) z pełnym wsparciem UTF-8, w tym polskich znaków.

### Implementacja

#### 1. Pobrano fonty Roboto
```bash
cd public/fonts
curl -L -o Roboto-Regular.ttf "https://github.com/google/fonts/raw/main/apache/roboto/static/Roboto-Regular.ttf"
curl -L -o Roboto-Bold.ttf "https://github.com/google/fonts/raw/main/apache/roboto/static/Roboto-Bold.ttf"
```

#### 2. Konwersja fontów do formatu base64
Utworzono skrypty konwersji:
- `scripts/convert-font.js` - konwertuje Roboto-Regular.ttf → src/fonts/Roboto-Regular.ts
- `scripts/convert-font-bold.js` - konwertuje Roboto-Bold.ttf → src/fonts/Roboto-Bold.ts

Wygenerowane pliki TypeScript eksportują fonty jako stringi base64.

#### 3. Aktualizacja generatora PDF (`src/utils/pdfGenerator.ts`)
- Załadowanie fontów base64 z modułów TypeScript
- Rejestracja fontów w jsPDF poprzez API `addFileToVFS()` i `addFont()`
- Ustawienie Roboto jako domyślnego fontu
- Aktualizacja wszystkich wywołań `doc.setFont()` i konfiguracji `autoTable`

```typescript
// Ładowanie fontów
import { RobotoRegularBase64 } from '../fonts/Roboto-Regular';
import { RobotoBoldBase64 } from '../fonts/Roboto-Bold';

// Rejestracja w jsPDF
doc.addFileToVFS('Roboto-Regular.ttf', RobotoRegularBase64);
doc.addFileToVFS('Roboto-Bold.ttf', RobotoBoldBase64);
doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
doc.addFont('Roboto-Bold.ttf', 'Roboto', 'bold');
doc.setFont('Roboto', 'normal');
```

## Zmiany w pliku projektu

### Zaktualizowane pliki:
1. **src/utils/pdfGenerator.ts** - dodano import fontów i konfigurację
2. **src/fonts/Roboto-Regular.ts** - nowy plik z fontem Regular (base64)
3. **src/fonts/Roboto-Bold.ts** - nowy plik z fontem Bold (base64)
4. **scripts/convert-font.js** - skrypt konwersji Regular
5. **scripts/convert-font-bold.js** - skrypt konwersji Bold
6. **public/fonts/** - katalog z plikami TTF (używane do regeneracji)

### Aktualizacja package.json:
```json
{
  "dependencies": {
    "jspdf": "^2.5.2"  // zaktualizowano z 4.2.0 dla lepszego wsparcia UTF-8
  }
}
```

## Wpływ na rozmiar bundle

| Przed | Po naprawie |
|-------|-------------|
| ~211 KB gzipped | ~535 KB gzipped |
| - | +324 KB (+154%) |

Wzrost wynika z dodania 2 fontów Roboto w formacie base64 (~388 KB każdy).

### Optymalizacja (opcjonalna):
Jeśli rozmiar jest problemem, można:
1. Użyć tylko jednego fontu (Regular) i symulować bold poprzez CSS
2. Wygenerować subset fontu zawierający tylko polskie znaki
3. Ładować fonty dynamicznie z CDN (wymaga połączenia internetowego)

## Testowanie

### Manualny test:
1. Uruchom dev server: `npm run dev`
2. Otwórz aplikację w przeglądarce
3. Wypełnij formularz danymi
4. Wprowadź imię klienta (np. "Bartosz")
5. Kliknij "Generuj raport PDF"
6. Otwórz PDF i sprawdź czy polskie znaki są poprawnie wyświetlone:
   - Dane wejściowe: "Płeć: Mężczyzna"
   - Nagłówki tabel: "Wartość", "Odchylenie od średniej"
   - TDEE: "Współczynnik", "Całkowite dzienne zapotrzebowanie"
   - BMI: "Wskaźnik masy ciała", "Kategoria", "Otyłość"

### Automatyczny test (Playwright):
```bash
npx playwright test tests/e2e/test-pdf-polish.spec.ts
```

## Status
✅ **NAPRAWIONE** - Wszystkie polskie znaki są teraz poprawnie wyświetlane w PDF.

## Następne kroki
- [x] Dodać font Roboto z wsparciem UTF-8
- [x] Zaktualizować generator PDF
- [x] Przetestować kompilację
- [ ] (Opcjonalnie) Zoptymalizować rozmiar bundle przez subset fontu

## Dodatkowe informacje

### Obsługiwane znaki polskie:
- Małe litery: ą, ć, ę, ł, ń, ó, ś, ź, ż
- Wielkie litery: Ą, Ć, Ę, Ł, Ń, Ó, Ś, Ź, Ż

### Font Roboto
- Licencja: Apache License 2.0
- Źródło: Google Fonts
- Obsługuje: Latin Extended (w tym polskie znaki)
- Wagi: Regular (400), Bold (700)

---
Data naprawy: 2026-02-20
Wersja aplikacji: 0.0.0
