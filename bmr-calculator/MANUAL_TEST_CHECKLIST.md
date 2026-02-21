# BMR Calculator - Manualna Checklista Testowa

Użyj tej checklisty do przetestowania aplikacji w przeglądarce: **http://localhost:5182**

---

## 🧪 1. Test Formularza Podstawowego (5 min)

### Dane testowe:
```
Waga: 70 kg
Wzrost: 175 cm
Wiek: 30 lat
Płeć: Mężczyzna
```

### Wykonaj:
- [ ] Wpisz wagę 70
- [ ] Wpisz wzrost 175
- [ ] Wpisz wiek 30
- [ ] Kliknij "Mężczyzna"
- [ ] Sprawdź czy przycisk Mężczyzna jest niebieski (aktywny)

### Walidacja:
- [ ] Wpisz wagę 500 → powinien pokazać błąd "Waga musi być w zakresie 20-400 kg"
- [ ] Popraw na 70 → błąd znika
- [ ] Kliknij w pole i kliknij poza (blur) bez wpisania → błąd "To pole jest wymagane"

**✅ PASS jeśli wszystko działa**

---

## 🧪 2. Test Obwodów Ciała (3 min)

### Wykonaj:
- [ ] Scroll w dół do "Obwody ciała"
- [ ] Wpisz Obwód szyi: 37
- [ ] Wpisz Obwód talii: 85
- [ ] Sprawdź czy pole "Obwód bioder" **NIE** jest widoczne (jesteś mężczyzną)

### Zmień płeć:
- [ ] Kliknij "Kobieta"
- [ ] Sprawdź czy pole "Obwód bioder" **JEST** teraz widoczne
- [ ] Kliknij z powrotem "Mężczyzna"
- [ ] Pole bioder znika

**✅ PASS jeśli dynamiczne pokazywanie działa**

---

## 🧪 3. Test Estymatora Tkanki Tłuszczowej (5 min)

### Metoda Ręczna:
- [ ] Scroll do sekcji "Estymacja tkanki tłuszczowej"
- [ ] Domyślnie wybrana "Ręczne wprowadzenie"
- [ ] Wpisz 15 w pole "% tkanki tłuszczowej"
- [ ] Sprawdź czy wynik pokazuje "15.0%"
- [ ] Sprawdź kategorię (prawdopodobnie "Fitness" dla mężczyzny)

### Metoda US Navy:
- [ ] Kliknij kartę "Metoda US Navy"
- [ ] Sprawdź czy automatycznie oblicza % (masz już szyja=37, talia=85)
- [ ] Wynik powinien być ~15%
- [ ] Sprawdź info: "Metoda: US Navy"

### Metoda Deurenberg:
- [ ] Kliknij kartę "Metoda Deurenberg"
- [ ] Sprawdź czy automatycznie oblicza (z BMI)
- [ ] Wynik powinien być ~18%
- [ ] Sprawdź info: "Metoda: Deurenberg (BMI)"

**✅ PASS jeśli wszystkie 3 metody działają**

---

## 🧪 4. Test Wyników BMR (10 min)

### Sprawdź tabelę:
- [ ] Po prawej stronie pojawia się sekcja "Wyniki BMR"
- [ ] Niebieska karta "Średni BMR" z dużą liczbą (~1670 kcal/dzień)
- [ ] Tabela z 11 modelami

### Modele w tabeli:
- [ ] Harris-Benedict Original (1919)
- [ ] Harris-Benedict Revised (1984)
- [ ] Mifflin-St Jeor (1990)
- [ ] Katch-McArdle (1996) - **z wartością** (masz % tkanki!)
- [ ] Cunningham (1980) - **z wartością**
- [ ] Owen (1986/1987)
- [ ] Schofield/WHO (1985)
- [ ] Henry/Oxford (2005)
- [ ] Müller (2004)
- [ ] Livingston-Kohlstadt (2005)
- [ ] Bernstein (1983)

### Wyróżnienia:
- [ ] Najniższy wynik ma niebieski background
- [ ] Najwyższy wynik ma pomarańczowy background
- [ ] Odchylenia pokazują +/- kcal i %

### Sortowanie:
- [ ] Kliknij "Sortuj" → zmienia się na "Rosnąco"
- [ ] Tabela sortuje się od najniższego do najwyższego
- [ ] Kliknij "Rosnąco" → zmienia się na "Malejąco"
- [ ] Tabela sortuje się od najwyższego do najniższego
- [ ] Kliknij "Malejąco" → wraca do "Sortuj" (brak sortowania)

**✅ PASS jeśli tabela działa i wszystko się wyświetla**

---

## 🧪 5. Test TDEE (5 min)

### Sprawdź sekcję TDEE:
- [ ] Poniżej tabeli BMR jest sekcja "TDEE"
- [ ] 5 kart z poziomami aktywności

### Kliknij każdy poziom:
- [ ] "Siedzący tryb życia" (×1.2)
  - TDEE: ~2004 kcal
  - Karta ma niebieski border i tło
  - Checkmark ✓ po prawej
- [ ] "Lekko aktywny" (×1.375)
  - TDEE: ~2296 kcal
- [ ] "Umiarkowanie aktywny" (×1.55)
  - TDEE: ~2589 kcal
- [ ] "Bardzo aktywny" (×1.725)
  - TDEE: ~2881 kcal
- [ ] "Ekstremalnie aktywny" (×1.9)
  - TDEE: ~3173 kcal

### Cele kaloryczne:
- [ ] Sprawdź czy pokazuje cele:
  - Utrzymanie wagi
  - Redukcja (-500 kcal)
  - Masa (+300 kcal)
  - Szybka redukcja (-750 kcal)

**✅ PASS jeśli TDEE się zmienia przy klikaniu**

---

## 🧪 6. Test BMI (3 min)

### Sprawdź sekcję BMI:
- [ ] Poniżej TDEE jest sekcja "BMI"
- [ ] Duża liczba: **22.9**
- [ ] Badge z kategorią: **Norma** (zielony)

### Wizualna skala:
- [ ] Kolorowa skala BMI (6 kolorów)
- [ ] Czarny wskaźnik pokazuje pozycję 22.9
- [ ] Tooltip nad wskaźnikiem z wartością
- [ ] Labels pod skalą: Niedowaga, Norma, Nadwaga, etc.

### Zakres zdrowej wagi:
- [ ] Zielona karta z ikoną tarczy
- [ ] Tekst: "Zdrowy zakres wagi dla Twojego wzrostu"
- [ ] Wzrost: 175 cm
- [ ] Zakres: **56.7 - 71.8 kg**

### Tabela klasyfikacji WHO:
- [ ] Niedowaga < 18.5
- [ ] Norma 18.5 - 24.9
- [ ] Nadwaga 25.0 - 29.9
- [ ] Otyłość I° 30.0 - 34.9
- [ ] Otyłość II° 35.0 - 39.9
- [ ] Otyłość III° ≥ 40.0

**✅ PASS jeśli BMI wyświetla się poprawnie**

---

## 🧪 7. Test Eksportu PDF (5 min)

### Sprawdź sekcję PDF:
- [ ] Na samym dole jest sekcja "Eksport do PDF"
- [ ] Pole "Imię i nazwisko klienta" (opcjonalne)
- [ ] Przycisk niebieski "Eksportuj do PDF"

### Wygeneruj PDF:
- [ ] Wpisz imię: "Jan Kowalski"
- [ ] Kliknij "Eksportuj do PDF"
- [ ] Przycisk zmienia się na "Generowanie PDF..." (szary, disabled)
- [ ] Po chwili PDF się pobiera automatycznie

### Sprawdź PDF:
- [ ] Otwórz pobrany plik
- [ ] Nagłówek niebieski z tytułem "Raport Kalkulacji BMR"
- [ ] Data: dzisiejsza (format polski)
- [ ] Imię klienta: "Jan Kowalski"
- [ ] Sekcja danych wejściowych (waga, wzrost, wiek, płeć, % tkanki)
- [ ] Tabela BMR z wszystkimi 11 modelami
- [ ] Średni BMR wyróżniony
- [ ] Sekcja TDEE (poziom aktywności, wartość)
- [ ] Cele kaloryczne (tabela)
- [ ] Sekcja BMI (wartość, kategoria, zakres)
- [ ] Stopka z disclaimerem

**✅ PASS jeśli PDF wygląda profesjonalnie**

---

## 🧪 8. Test Responsywności (10 min)

### Desktop (obecny widok):
- [ ] 2 kolumny: formularz lewo, wyniki prawo
- [ ] Wszystko czytelne

### Tablet (zmniejsz okno do ~800px):
- [ ] Kolumny nadal obok siebie lub zaczynają się stackować
- [ ] Formularze czytelne

### Mobile (zmniejsz do ~400px):
- [ ] Przejście na 1 kolumnę
- [ ] Formularz na górze
- [ ] Wyniki poniżej
- [ ] Wszystkie przyciski klikalne (duże targety)
- [ ] Tabela przewijalna poziomo jeśli potrzebne

### Przywróć normalny rozmiar:
- [ ] Wraca do 2 kolumn

**✅ PASS jeśli responsywność działa**

---

## 🧪 9. Test Edge Cases (5 min)

### Ekstremalne wartości:
- [ ] Zmień wagę na 400 kg
- [ ] Zmień wzrost na 250 cm
- [ ] Zmień wiek na 120 lat
- [ ] Sprawdź czy wszystko nadal oblicza się poprawnie
- [ ] BMI bardzo wysokie, ale kategoria pokazuje się

### Brakujące dane:
- [ ] Usuń metodę % tkanki (wybierz ręczną i zostaw puste)
- [ ] Sprawdź czy Katch-McArdle i Cunningham pokazują "Brak danych"
- [ ] Sprawdź info box "Niedostępne modele"

### Normalne wartości:
- [ ] Przywróć: waga 70, wzrost 175, wiek 30, BF% 15

**✅ PASS jeśli edge cases są obsłużone**

---

## 🧪 10. Test Użyteczności (5 min)

### Pytania:
- [ ] Czy interfejs jest intuicyjny?
- [ ] Czy wszystkie teksty są po polsku?
- [ ] Czy komunikaty błędów są zrozumiałe?
- [ ] Czy opisy poziomów aktywności pomagają w wyborze?
- [ ] Czy info boxes są pomocne?
- [ ] Czy kolory są czytelne i profesjonalne?
- [ ] Czy PDF wygląda jak oficjalny dokument medyczny?

**✅ PASS jeśli UX jest dobry**

---

## 📊 Finalne Podsumowanie

### Policzone testy:
- Formularz: ___/10
- Obwody: ___/6
- Estymator BF%: ___/9
- Tabela BMR: ___/18
- TDEE: ___/9
- BMI: ___/12
- PDF: ___/13
- Responsywność: ___/7
- Edge Cases: ___/7
- UX: ___/7

### TOTAL: ___/98

**Wynik:**
- 90+ = DOSKONAŁY ✅
- 80-89 = BARDZO DOBRY ✅
- 70-79 = DOBRY ⚠️
- <70 = WYMAGA POPRAWEK ❌

---

## 🎯 Werdykt

**Data testów:** ___________
**Tester:** ___________
**Wynik:** ___/98

**Status:**
- [ ] ✅ GOTOWE DO DEPLOYMENTU
- [ ] ⚠️ WYMAGA DROBNYCH POPRAWEK
- [ ] ❌ WYMAGA ZNACZĄCYCH POPRAWEK

**Notatki:**
_________________________________________________
_________________________________________________
_________________________________________________

---

**Koniec testów** 🎉
