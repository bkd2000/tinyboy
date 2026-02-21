# Naprawa widoczności tekstu na przyciskach

## Problem
Tekst na przyciskach z kolorem tła `bg-primary` był niewidoczny - niebieski tekst na niebieskim tle. Dotyczyło to następujących elementów:
- Przycisk "Eksportuj do PDF" w komponencie PDFExport
- Przyciski wyboru płci "Mężczyzna" / "Kobieta" w InputForm
- Znaczniki poziomu aktywności (×1.2, ×1.375, etc.) w TDEESection

## Przyczyna
Tailwind CSS v4 ma zmienioną konfigurację i klasa `text-white` nie była prawidłowo aplikowana do przycisków z `bg-primary`. Prawdopodobnie problem ze specificity CSS lub konfiguracją @layer.

## Rozwiązanie
Dodano inline style `style={{ color: '#FFFFFF' }}` do wszystkich przycisków i elementów z tłem primary, które powinny mieć biały tekst.

### Zmienione pliki:

#### 1. src/components/PDFExport/index.tsx
```tsx
// Przed:
className="... bg-primary text-white ..."

// Po:
className="... bg-primary ..."
style={!isGenerating ? { color: '#FFFFFF' } : undefined}
```

#### 2. src/components/InputForm/index.tsx
```tsx
// Przyciski płci (Mężczyzna / Kobieta)
// Przed:
className="... bg-primary text-white border-primary ..."

// Po:
className="... bg-primary border-primary ..."
style={data.gender === 'male' ? { color: '#FFFFFF' } : undefined}
```

#### 3. src/components/TDEESection/index.tsx
```tsx
// Znaczniki poziomu aktywności
// Przed:
className="... bg-primary text-white ..."

// Po:
className="... bg-primary ..."
style={level.value === activityLevel ? { color: '#FFFFFF' } : undefined}
```

## Wynik
✅ Wszystkie przyciski i elementy z tłem primary mają teraz biały, czytelny tekst
✅ Build zakończony sukcesem (0 błędów TypeScript)
✅ Rozmiar bundle bez zmian (~535 KB gzipped)

## Testowanie
1. Uruchom aplikację: `npm run dev`
2. Sprawdź widoczność tekstu na:
   - Przyciskach wyboru płci (po kliknięciu)
   - Znacznikach poziomu aktywności (po wybraniu)
   - Przycisku "Eksportuj do PDF"

## Alternatywne rozwiązania (nie zastosowane)
- Aktualizacja konfiguracji Tailwind CSS @layer
- Użycie `!text-white` z flagą important
- Dodanie globalnego CSS dla `.bg-primary`

Wybrano inline style jako najprostsze i najbardziej niezawodne rozwiązanie.

---
Data naprawy: 2026-02-20
Wersja aplikacji: 0.0.0
