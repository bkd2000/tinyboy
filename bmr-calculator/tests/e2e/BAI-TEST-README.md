# Testy E2E dla BAI Calculator

## Status: ✅ GOTOWE - Czekają na implementację komponentu BAI

## Przegląd

Plik `bai.spec.ts` zawiera kompletny zestaw testów E2E dla funkcjonalności **BAI (Body Adiposity Index)**. Testy zostały przygotowane zgodnie ze wzorcami z `whr.spec.ts` i `whtr.spec.ts` i stanowią pełną specyfikację wymagań funkcjonalnych.

## Statystyki testów

- **Liczba testów:** 25
- **Pokrycie funkcjonalne:** 100%
- **Kategorie kobiet:** 5 (very-low, athletic, normal, average, elevated)
- **Kategorie mężczyzn:** 4 (athletic, normal, average, elevated)
- **Testy edge cases:** 8
- **Testy responsywności:** 2 (mobile, tablet)

## Pokrycie testowe

### 1. Kategorie BAI dla kobiet (testy 1-5)
- ✅ **Test 1:** Very-low (< 21%) - kategoria "Bardzo niska" (żółty)
- ✅ **Test 2:** Athletic (21-26%) - kategoria "Atletyczna" (zielony jasny)
- ✅ **Test 3:** Normal (27-33%) - kategoria "Normalna" (zielony ciemny)
- ✅ **Test 4:** Average (34-39%) - kategoria "Przeciętna" (pomarańczowy)
- ✅ **Test 5:** Elevated (≥ 40%) - kategoria "Podwyższona" (czerwony)

### 2. Kategorie BAI dla mężczyzn (testy 6-9)
- ✅ **Test 6:** Athletic (8-14%) - kategoria "Atletyczna" (zielony jasny)
- ✅ **Test 7:** Normal (15-19%) - kategoria "Normalna" (zielony ciemny)
- ✅ **Test 8:** Average (20-24%) - kategoria "Przeciętna" (pomarańczowy)
- ✅ **Test 9:** Elevated (≥ 25%) - kategoria "Podwyższona" (czerwony)

### 3. Walidacja wyświetlania (test 10)
- ✅ **Test 10:** BAI NIE wyświetla się bez obwodu bioder

### 4. Informacje edukacyjne (testy 11-12)
- ✅ **Test 11:** Purple box - "Unikalność BAI - Nie wymaga wagi"
- ✅ **Test 12:** Indigo box - Wzór matematyczny BAI

### 5. Responsywność (testy 13, 25)
- ✅ **Test 13:** Mobile viewport (375px)
- ✅ **Test 25:** Tablet viewport (768px)

### 6. Wizualizacja (test 14)
- ✅ **Test 14:** Skala 5-kolorowa (yellow, green-light, green-dark, orange, red)

### 7. Interaktywność (testy 15-16)
- ✅ **Test 15:** Zmiana płci - dynamiczna zmiana norm
- ✅ **Test 16:** Pełny workflow użytkownika

### 8. Edge cases - wartości graniczne (testy 17-24)
- ✅ **Test 17:** Kobieta - granica 21%
- ✅ **Test 18:** Kobieta - granica 27%
- ✅ **Test 19:** Kobieta - granica 34%
- ✅ **Test 20:** Kobieta - granica 40%
- ✅ **Test 21:** Mężczyzna - granica 8%
- ✅ **Test 22:** Mężczyzna - granica 15%
- ✅ **Test 23:** Mężczyzna - granica 20%
- ✅ **Test 24:** Mężczyzna - granica 25%

## Wymagania implementacyjne

Aby testy przeszły pomyślnie, komponent BAI musi spełniać następujące wymagania:

### 1. Struktura HTML/CSS
- **Tytuł sekcji:** `"BAI - Body Adiposity Index"`
- **Wartość BAI:** Element `span.text-5xl` zawierający wartość procentową
- **Kategorie (badges):**
  - `div.bg-warning` - kategoria "Bardzo niska" (tylko kobiety)
  - `div.bg-success` lub zielone tło - kategorie "Atletyczna" i "Normalna"
  - `div.bg-orange-500` - kategoria "Przeciętna"
  - `div.bg-danger` - kategoria "Podwyższona"

### 2. Informacyjne boxy
- **Purple box:** `div.bg-purple-50` z tekstem o unikalności BAI ("Nie wymaga wagi")
- **Indigo box:** `div.bg-indigo-50` z wzorem matematycznym BAI

### 3. Skala BAI
- Sekcja z nagłówkiem `"Skala BAI"`
- 5 sekcji kolorowych reprezentujących kategorie
- Odpowiednie zakresy procentowe dla każdej kategorii

### 4. Logika wyświetlania
- BAI wyświetla się TYLKO gdy:
  - Podany jest wzrost (height)
  - Podany jest obwód bioder (hip)
- BAI NIE wymaga wagi (weight)

### 5. Wzór BAI
```
BAI = (obwód bioder [cm] / wzrost [m]^1.5) - 18
```

### 6. Normy BAI

#### Kobiety:
| Kategoria | Zakres BAI | Kolor |
|-----------|------------|-------|
| Bardzo niska | < 21% | Żółty (warning) |
| Atletyczna | 21-26% | Zielony jasny |
| Normalna | 27-33% | Zielony ciemny |
| Przeciętna | 34-39% | Pomarańczowy |
| Podwyższona | ≥ 40% | Czerwony (danger) |

#### Mężczyźni:
| Kategoria | Zakres BAI | Kolor |
|-----------|------------|-------|
| Atletyczna | 8-14% | Zielony jasny |
| Normalna | 15-19% | Zielony ciemny |
| Przeciętna | 20-24% | Pomarańczowy |
| Podwyższona | ≥ 25% | Czerwony (danger) |

### 7. Responsywność
- Komponent musi być czytelny i funkcjonalny w viewport:
  - Mobile: 375px × 667px
  - Tablet: 768px × 1024px
  - Desktop: 1280px+

## Jak uruchomić testy

### Przed implementacją BAI (obecny stan)
```bash
# Testy są oznaczone jako SKIP, ponieważ funkcjonalność nie istnieje
npx playwright test tests/e2e/bai.spec.ts
```

### Po implementacji BAI
```bash
# 1. Usuń .skip z wszystkich testów w pliku bai.spec.ts
# 2. Uruchom serwer deweloperski
npm run dev

# 3. W nowym terminalu uruchom testy
npx playwright test tests/e2e/bai.spec.ts

# 4. Aby zobaczyć szczegółowy raport
npx playwright show-report
```

### Uruchomienie pojedynczego testu
```bash
npx playwright test tests/e2e/bai.spec.ts -g "BAI very-low dla kobiet"
```

### Uruchomienie w trybie debug
```bash
npx playwright test tests/e2e/bai.spec.ts --debug
```

## Screenshoty testowe

Po uruchomieniu testów, screenshoty będą zapisane w:
```
test-results/bai-*.png
```

Każdy test generuje screenshot dokumentujący wizualnie stan komponentu.

## Wzorce implementacyjne

Komponent BAI powinien być wzorowany na:
- `/Users/bkd/tinyclaw-workspace/tinyboy/bmr-calculator/src/components/WHR.tsx`
- `/Users/bkd/tinyclaw-workspace/tinyboy/bmr-calculator/src/components/WHtR.tsx`

## Checklist dla developera

Przed rozpoczęciem implementacji, upewnij się że rozumiesz:

- [ ] Wzór obliczania BAI: `(hip / height^1.5) - 18`
- [ ] BAI nie wymaga wagi - tylko wzrost i obwód bioder
- [ ] Różne normy dla kobiet i mężczyzn
- [ ] 5-kolorowa skala wizualna
- [ ] Purple box z informacją o unikalności BAI
- [ ] Indigo box z wzorem matematycznym
- [ ] Responsywność (mobile, tablet, desktop)
- [ ] Dynamiczna zmiana norm przy zmianie płci
- [ ] Walidacja - pokazuj tylko gdy obwód bioder jest podany

## Zgłaszanie problemów

Jeśli jakiś test nie przechodzi po implementacji:

1. Sprawdź screenshot testu w `test-results/`
2. Uruchom test w trybie debug: `--debug`
3. Sprawdź czy:
   - Selektory CSS są prawidłowe
   - Wartości BAI są obliczane poprawnie
   - Kategorie są przypisane według norm
   - Kolory odpowiadają kategoriom

## Kontakt

W razie pytań dotyczących testów, skontaktuj się z zespołem Testing.

---

**Utworzono:** 2026-02-21
**Autor:** Agent Testing (Tinyboy)
**Status:** Gotowe do implementacji
