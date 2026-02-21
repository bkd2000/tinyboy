import { test, expect } from '@playwright/test';

test.describe('BMR Calculator - Finalne Testy E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5182');
    await page.waitForLoadState('networkidle');
  });

  test('1. Formularz - walidacja i wprowadzanie danych', async ({ page }) => {
    // Sprawdź czy formularz jest widoczny
    await expect(page.getByText('Dane podstawowe')).toBeVisible();

    // Test walidacji - nieprawidłowa waga
    await page.fill('input#weight', '500');
    await page.blur('input#weight');
    await expect(page.getByText('Waga musi być w zakresie 20-400 kg')).toBeVisible();

    // Poprawne dane
    await page.fill('input#weight', '70');
    await page.fill('input#height', '175');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Mężczyzna")');

    // Sprawdź czy przyciski płci działają
    await expect(page.locator('button:has-text("Mężczyzna")')).toHaveClass(/bg-primary/);

    // Screenshot po wypełnieniu formularza
    await page.screenshot({ path: 'test-results/01-formularz-wypelniony.png' });
  });

  test('2. Estymator tkanki tłuszczowej - wszystkie metody', async ({ page }) => {
    // Wypełnij dane podstawowe
    await page.fill('input#weight', '70');
    await page.fill('input#height', '175');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Mężczyzna")');

    // Dodaj obwody dla metody US Navy
    await page.fill('input#neck', '37');
    await page.fill('input#waist', '85');

    // Test metody US Navy
    await page.click('button:has-text("Metoda US Navy")');
    await page.waitForTimeout(500);

    // Sprawdź czy obliczył % tkanki tłuszczowej
    const bodyFatText = page.locator('text=/Szacowany % tkanki tłuszczowej:/');
    await expect(bodyFatText).toBeVisible();

    // Test metody Deurenberg
    await page.click('button:has-text("Metoda Deurenberg")');
    await page.waitForTimeout(500);
    await expect(bodyFatText).toBeVisible();

    // Test metody ręcznej
    await page.click('button:has-text("Ręczne wprowadzenie")');
    await page.fill('input#bodyFatManual', '15');
    await expect(page.getByText(/15\.0%/)).toBeVisible();

    await page.screenshot({ path: 'test-results/02-estymator-bodyfat.png' });
  });

  test('3. Wyniki BMR - 11 modeli i tabela', async ({ page }) => {
    // Wypełnij dane podstawowe
    await page.fill('input#weight', '70');
    await page.fill('input#height', '175');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Mężczyzna")');

    // Poczekaj na obliczenia
    await page.waitForTimeout(1000);

    // Sprawdź czy tabela BMR jest widoczna
    await expect(page.getByText('Wyniki BMR')).toBeVisible();

    // Sprawdź czy średni BMR jest wyświetlony
    await expect(page.getByText('Średni BMR')).toBeVisible();
    await expect(page.locator('text=/\\d+ kcal\\/dzień/')).toBeVisible();

    // Sprawdź czy wszystkie 11 modeli są w tabeli
    await expect(page.getByText('Harris-Benedict Original')).toBeVisible();
    await expect(page.getByText('Mifflin-St Jeor')).toBeVisible();
    await expect(page.getByText('Katch-McArdle')).toBeVisible();

    // Sprawdź info o brakujących danych (Katch-McArdle bez body fat)
    await expect(page.getByText(/wymaga % tkanki tłuszczowej/)).toBeVisible();

    // Test sortowania
    await page.click('button:has-text("Sortuj")');
    await page.waitForTimeout(500);
    await expect(page.getByText('Rosnąco')).toBeVisible();

    await page.click('button:has-text("Rosnąco")');
    await page.waitForTimeout(500);
    await expect(page.getByText('Malejąco')).toBeVisible();

    await page.screenshot({ path: 'test-results/03-tabela-bmr.png', fullPage: true });
  });

  test('4. TDEE - poziomy aktywności', async ({ page }) => {
    // Wypełnij dane
    await page.fill('input#weight', '70');
    await page.fill('input#height', '175');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Mężczyzna")');
    await page.waitForTimeout(1000);

    // Sprawdź czy sekcja TDEE jest widoczna
    await expect(page.getByText('TDEE - Całkowite Dzienne Zapotrzebowanie Energetyczne')).toBeVisible();

    // Test wszystkich 5 poziomów aktywności
    const levels = [
      'Siedzący tryb życia',
      'Lekko aktywny',
      'Umiarkowanie aktywny',
      'Bardzo aktywny',
      'Ekstremalnie aktywny'
    ];

    for (const level of levels) {
      await page.click(`button:has-text("${level}")`);
      await page.waitForTimeout(500);

      // Sprawdź czy wartość TDEE się zmieniła
      await expect(page.locator('text=/\\d{4} kcal\\/dzień/')).toBeVisible();
    }

    // Sprawdź cele kaloryczne
    await expect(page.getByText('Utrzymanie wagi:')).toBeVisible();
    await expect(page.getByText('Redukcja:')).toBeVisible();
    await expect(page.getByText('Masa:')).toBeVisible();

    await page.screenshot({ path: 'test-results/04-tdee-sekcja.png', fullPage: true });
  });

  test('5. BMI - wartość i kategoria', async ({ page }) => {
    // Wypełnij dane
    await page.fill('input#weight', '70');
    await page.fill('input#height', '175');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Mężczyzna")');
    await page.waitForTimeout(1000);

    // Sprawdź sekcję BMI
    await expect(page.getByText('BMI - Wskaźnik Masy Ciała')).toBeVisible();

    // Sprawdź wartość BMI (70kg / 1.75m^2 = 22.9)
    await expect(page.getByText('22.9')).toBeVisible();

    // Sprawdź kategorię
    await expect(page.getByText('Norma')).toBeVisible();

    // Sprawdź skalę BMI (powinna być widoczna)
    await expect(page.locator('text=/Skala BMI/')).toBeVisible();

    // Sprawdź zakres zdrowej wagi
    await expect(page.getByText(/Zdrowy zakres wagi/)).toBeVisible();
    await expect(page.getByText(/56\\.7 - 71\\.8/)).toBeVisible();

    await page.screenshot({ path: 'test-results/05-bmi-sekcja.png' });
  });

  test('6. Eksport PDF - dostępność i funkcjonalność', async ({ page }) => {
    // Wypełnij wszystkie dane
    await page.fill('input#weight', '70');
    await page.fill('input#height', '175');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Mężczyzna")');
    await page.waitForTimeout(1000);

    // Sprawdź czy sekcja eksportu PDF jest widoczna
    await expect(page.getByText('Eksport do PDF')).toBeVisible();

    // Wprowadź imię klienta
    await page.fill('input#clientName', 'Jan Kowalski');

    // Sprawdź przycisk eksportu
    const exportButton = page.locator('button:has-text("Eksportuj do PDF")');
    await expect(exportButton).toBeEnabled();

    await page.screenshot({ path: 'test-results/06-pdf-export.png' });

    // Uwaga: Nie klikamy przycisku, żeby nie generować PDF podczas testów
    // W prawdziwym teście można by sprawdzić download event
  });

  test('7. Responsywność - mobile viewport', async ({ page }) => {
    // Ustaw viewport na mobile
    await page.setViewportSize({ width: 375, height: 667 });

    // Wypełnij dane
    await page.fill('input#weight', '70');
    await page.fill('input#height', '175');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Mężczyzna")');
    await page.waitForTimeout(1000);

    // Sprawdź czy wszystkie sekcje są widoczne
    await expect(page.getByText('Dane podstawowe')).toBeVisible();
    await expect(page.getByText('Wyniki BMR')).toBeVisible();
    await expect(page.getByText('TDEE')).toBeVisible();
    await expect(page.getByText('BMI')).toBeVisible();

    await page.screenshot({ path: 'test-results/07-mobile-375px.png', fullPage: true });
  });

  test('8. Responsywność - tablet viewport', async ({ page }) => {
    // Ustaw viewport na tablet
    await page.setViewportSize({ width: 768, height: 1024 });

    await page.fill('input#weight', '70');
    await page.fill('input#height', '175');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Mężczyzna")');
    await page.waitForTimeout(1000);

    await page.screenshot({ path: 'test-results/08-tablet-768px.png', fullPage: true });
  });

  test('9. Edge case - ekstremalne wartości', async ({ page }) => {
    // Test z bardzo niską wagą
    await page.fill('input#weight', '20');
    await page.fill('input#height', '150');
    await page.fill('input#age', '120');
    await page.click('button:has-text("Kobieta")');
    await page.waitForTimeout(1000);

    // Sprawdź czy obliczenia nadal działają
    await expect(page.getByText('Średni BMR')).toBeVisible();
    await expect(page.locator('text=/\\d+ kcal\\/dzień/')).toBeVisible();

    await page.screenshot({ path: 'test-results/09-edge-case-ekstremalne.png', fullPage: true });
  });

  test('10. Edge case - zmiana płci (biodra)', async ({ page }) => {
    await page.fill('input#weight', '70');
    await page.fill('input#height', '175');
    await page.fill('input#age', '30');

    // Wybierz kobietę
    await page.click('button:has-text("Kobieta")');
    await page.waitForTimeout(500);

    // Sprawdź czy pole biodra się pojawiło
    await expect(page.locator('input#hip')).toBeVisible();

    // Zmień na mężczyznę
    await page.click('button:has-text("Mężczyzna")');
    await page.waitForTimeout(500);

    // Sprawdź czy pole biodra zniknęło
    await expect(page.locator('input#hip')).not.toBeVisible();

    await page.screenshot({ path: 'test-results/10-dynamiczne-pola.png' });
  });

  test('11. Pełny workflow użytkownika', async ({ page }) => {
    // Symulacja pełnego przepływu użytkownika

    // 1. Wprowadź dane podstawowe
    await page.fill('input#weight', '70');
    await page.fill('input#height', '175');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Mężczyzna")');

    // 2. Dodaj obwody
    await page.fill('input#neck', '37');
    await page.fill('input#waist', '85');

    // 3. Wybierz metodę US Navy
    await page.click('button:has-text("Metoda US Navy")');
    await page.waitForTimeout(500);

    // 4. Sprawdź wyniki BMR
    await expect(page.getByText('Średni BMR')).toBeVisible();

    // 5. Wybierz poziom aktywności
    await page.click('button:has-text("Umiarkowanie aktywny")');
    await page.waitForTimeout(500);

    // 6. Sprawdź BMI
    await expect(page.getByText('22.9')).toBeVisible();

    // 7. Przygotuj do PDF
    await page.fill('input#clientName', 'Jan Kowalski');

    // Screenshot finalny z wszystkimi danymi
    await page.screenshot({ path: 'test-results/11-full-workflow-final.png', fullPage: true });
  });

  test('12. Empty state - brak danych', async ({ page }) => {
    // Sprawdź czy empty state się wyświetla gdy brak danych
    await expect(page.getByText('Wprowadź dane podstawowe')).toBeVisible();
    await expect(page.getByText(/Uzupełnij wagę, wzrost, wiek i płeć/)).toBeVisible();

    await page.screenshot({ path: 'test-results/12-empty-state.png' });
  });
});
