# Rozwiązywanie problemów z generowaniem PDF

## Problem 1: ERR_BLOCKED_BY_CLIENT

### Objawy:
- Alert: "Wystąpił błąd podczas generowania PDF"
- W konsoli przeglądarki: `net::ERR_BLOCKED_BY_CLIENT`
- PDF nie zostaje pobrany

### Przyczyna:
Błąd `ERR_BLOCKED_BY_CLIENT` oznacza, że przeglądarka (lub zainstalowane rozszerzenie) blokuje pobieranie pliku. Najczęstsze przyczyny:
1. **Blokada reklam** (AdBlock, uBlock Origin, itp.)
2. **Privacy extensions** (Privacy Badger, Ghostery)
3. **Firewall lub antywirus** blokujący pobieranie
4. **Ustawienia przeglądarki** blokujące automatyczne pobieranie

### Rozwiązanie:

#### Metoda 1: Wyłącz blokery (zalecane)
1. Tymczasowo wyłącz wszystkie rozszerzenia blokujące zawartość
2. Odśwież stronę (F5)
3. Spróbuj wygenerować PDF ponownie

#### Metoda 2: Dodaj wyjątek
1. W AdBlock/uBlock Origin: kliknij ikonę rozszerzenia
2. Wybierz "Wyłącz na tej stronie" lub "Disable on this site"
3. Odśwież stronę
4. Spróbuj ponownie

#### Metoda 3: Tryb incognito
1. Otwórz przeglądarkę w trybie incognito (Ctrl+Shift+N / Cmd+Shift+N)
2. Wpisz adres aplikacji (localhost:5173)
3. Spróbuj wygenerować PDF

#### Metoda 4: Inna przeglądarka
- Spróbuj w Chrome, Firefox, Edge lub Safari
- Różne przeglądarki mają różne zasady blokowania

---

## Problem 2: Duży rozmiar bundle (~535 KB)

### Przyczyna:
Fonty Roboto (Regular + Bold) w formacie base64 dodają ~776 KB do bundle przed kompresją (~324 KB po gzip).

### Wpływ:
- Większy czas ładowania aplikacji (szczególnie na wolnych połączeniach)
- Większe zużycie pamięci przeglądarki
- Potencjalne problemy z limitami pamięci na starszych urządzeniach

### Rozwiązania:

#### Opcja A: Zaakceptować większy rozmiar (obecne rozwiązanie)
**Zalety:**
- Działa offline
- Pełne wsparcie polskich znaków
- Brak zależności zewnętrznych

**Wady:**
- Większy bundle size
- Wolniejsze pierwsze ładowanie

#### Opcja B: Lazy loading fontów
Załaduj fonty tylko gdy użytkownik kliknie "Generuj PDF":

```typescript
// Dynamiczny import
const handleExport = async () => {
  const { generatePDF } = await import('./utils/pdfGenerator');
  await generatePDF(data);
};
```

**Zalety:**
- Szybsze pierwsze ładowanie aplikacji
- Fonty ładowane tylko gdy potrzebne

**Wady:**
- Wymaga zmiany w kodzie
- Pierwsze generowanie PDF będzie wolniejsze

#### Opcja C: Subset fontu (zaawansowane)
Wygeneruj font zawierający tylko polskie znaki i cyfry.

**Narzędzia:**
- `fonttools` (Python)
- `glyphhanger` (Node.js)
- Online: `everythingfonts.com/subsetter`

**Kroki:**
```bash
# Instalacja fonttools
pip install fonttools brotli

# Subset dla polskich znaków
pyftsubset Roboto-Regular.ttf \
  --unicodes="U+0020-007E,U+0104-0105,U+0106-0107,U+0118-0119,U+0141-0142,U+0143-0144,U+00D3,U+00F3,U+015A-015B,U+0179-017C" \
  --output-file="Roboto-Regular-Polish.ttf" \
  --flavor=woff2
```

**Zalety:**
- Znacznie mniejszy rozmiar (~50-100 KB zamiast 388 KB)
- Nadal pełne wsparcie polskich znaków

**Wady:**
- Wymaga dodatkowych narzędzi
- Komplikuje proces budowania

#### Opcja D: CDN (wymaga internetu)
Załaduj fonty z Google Fonts CDN.

**Wady:**
- Nie działa offline
- Wymaga połączenia internetowego
- CORS może powodować problemy

---

## Problem 3: Polskie znaki nie wyświetlają się poprawnie

### Przyczyna:
Domyślne fonty jsPDF (Helvetica, Times, Courier) nie obsługują polskich znaków diakrytycznych.

### Rozwiązanie:
✅ **Już zaimplementowane** - aplikacja używa fontów Roboto z pełnym wsparciem UTF-8.

### Weryfikacja:
1. Wygeneruj PDF
2. Sprawdź czy znaki są poprawne:
   - ą, ć, ę, ł, ń, ó, ś, ź, ż
   - Ą, Ć, Ę, Ł, Ń, Ó, Ś, Ź, Ż

---

## Debugowanie

### Włącz szczegółowe logi:
Otwórz konsolę przeglądarki (F12) i sprawdź logi:

```
[PDF] Creating jsPDF instance...
[PDF] Loading custom fonts...
[PDF] Fonts loaded successfully
[PDF] Saving PDF file...
[PDF] PDF saved successfully: BMR_Raport_...
```

### Typowe błędy:

#### "Cannot read property 'addFileToVFS' of undefined"
- **Przyczyna:** jsPDF nie został poprawnie zainstalowany
- **Rozwiązanie:** `npm install jspdf@^2.5.2`

#### "Font 'Roboto' is not available"
- **Przyczyna:** Fonty nie zostały załadowane
- **Rozwiązanie:** Sprawdź czy pliki `src/fonts/Roboto-*.ts` istnieją

#### "Maximum call stack size exceeded"
- **Przyczyna:** Zbyt duże fonty base64
- **Rozwiązanie:** Użyj lazy loading lub subset fontu

---

## Testowanie

### Test manualny:
1. `npm run dev`
2. Otwórz http://localhost:5173
3. Wypełnij formularz
4. Kliknij "Eksportuj do PDF"
5. Sprawdź konsolę (F12) po logi
6. Otwórz pobrany PDF i sprawdź polskie znaki

### Test z różnymi przeglądarkami:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Edge 90+
- ✅ Safari 14+

### Test z blokerami:
- ❌ uBlock Origin - może blokować (wyłącz na localhost)
- ❌ AdBlock Plus - może blokować (wyłącz na localhost)
- ✅ Bez blokerów - działa zawsze

---

## Kontakt / Wsparcie

Jeśli problem nadal występuje:

1. Sprawdź konsolę przeglądarki (F12 → Console)
2. Skopiuj dokładny komunikat błędu
3. Sprawdź kartę Network (czy są zablokowane zasoby)
4. Spróbuj w trybie incognito
5. Spróbuj w innej przeglądarce

---

Data utworzenia: 2026-02-20
Wersja aplikacji: 0.0.0
jsPDF: 2.5.2
