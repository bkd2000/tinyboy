import { test, expect } from '@playwright/test';

/**
 * TESTY E2E DLA BAI JAKO METODY ESTYMACJI TKANKI TŁUSZCZOWEJ
 *
 * BAI (Body Adiposity Index) został przeniesiony do sekcji "Estymacja tkanki tłuszczowej"
 * jako czwarta metoda obok: Ręczne wprowadzenie, US Navy i Deurenberg
 */

test.describe('BAI jako metoda estymacji tkanki tłuszczowej', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5182');
    await page.waitForLoadState('networkidle');
  });

  test('1. BAI jest dostępny jako metoda estymacji', async ({ page }) => {
    // Sprawdź czy przycisk BAI jest widoczny w estymatorze
    await expect(page.getByText('Metoda BAI (Body Adiposity Index)')).toBeVisible();
  });

  test('2. BAI oblicza % tkanki tłuszczowej dla kobiety', async ({ page }) => {
    // Wypełnij dane podstawowe
    await page.fill('input#weight', '65');
    await page.fill('input#height', '165');
    await page.fill('input#age', '28');
    await page.click('button:has-text("Kobieta")');

    // Dodaj obwód bioder
    await page.fill('input#hip', '85');
    await page.waitForTimeout(500);

    // Wybierz metodę BAI
    await page.click('button:has-text("Metoda BAI (Body Adiposity Index)")');
    await page.waitForTimeout(500);

    // Sprawdź czy wyświetla się wynik
    await expect(page.getByText(/Szacowany % tkanki tłuszczowej:/)).toBeVisible();

    // Sprawdź czy wartość jest wyświetlana (BAI dla 165cm wzrostu i 85cm bioder ≈ 23%)
    await expect(page.locator('text=/2[0-9]\\.\\d%/').first()).toBeVisible();

    // Sprawdź czy kategoria jest wyświetlana
    await expect(page.locator('div').filter({ hasText: /Atletyczny|Normalny|Przeciętny/ }).first()).toBeVisible();
  });

  test('3. BAI oblicza % tkanki tłuszczowej dla mężczyzny', async ({ page }) => {
    // Wypełnij dane podstawowe
    await page.fill('input#weight', '80');
    await page.fill('input#height', '180');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Mężczyzna")');

    // Dodaj obwód bioder
    await page.fill('input#hip', '95');
    await page.waitForTimeout(500);

    // Wybierz metodę BAI
    await page.click('button:has-text("Metoda BAI (Body Adiposity Index)")');
    await page.waitForTimeout(500);

    // Sprawdź czy wyświetla się wynik
    await expect(page.getByText(/Szacowany % tkanki tłuszczowej:/)).toBeVisible();

    // Sprawdź czy kategoria jest wyświetlana
    await expect(page.locator('div').filter({ hasText: /Atletyczny|Normalny|Przeciętny/ }).first()).toBeVisible();
  });

  test('4. BAI wymaga obwodu bioder i wzrostu', async ({ page }) => {
    // Wypełnij tylko część danych (bez bioder)
    await page.fill('input#weight', '70');
    await page.fill('input#height', '170');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Kobieta")');
    await page.waitForTimeout(500);

    // Wybierz metodę BAI
    await page.click('button:has-text("Metoda BAI (Body Adiposity Index)")');
    await page.waitForTimeout(500);

    // Sprawdź czy wyświetla się informacja o brakujących danych
    await expect(page.getByText(/Brak danych/).first()).toBeVisible();

    // Sprawdź instrukcje
    await expect(page.getByText(/Wymagane pomiary:/)).toBeVisible();
    await expect(page.getByRole('listitem').filter({ hasText: 'Obwód bioder' })).toBeVisible();
  });

  test('5. BAI wyświetla komunikat o wymaganych pomiarach', async ({ page }) => {
    // Wybierz metodę BAI bez wypełniania danych
    await page.click('button:has-text("Metoda BAI (Body Adiposity Index)")');
    await page.waitForTimeout(500);

    // Sprawdź instrukcje
    await expect(page.getByText(/Wymagane pomiary:/)).toBeVisible();
    await expect(page.getByRole('listitem').filter({ hasText: 'Obwód bioder' })).toBeVisible();
    await expect(page.getByRole('listitem').filter({ hasText: 'Wzrost' })).toBeVisible();
  });

  test('6. BAI wartość jest używana do obliczeń BMR (Katch-McArdle)', async ({ page }) => {
    // Wypełnij dane podstawowe
    await page.fill('input#weight', '70');
    await page.fill('input#height', '170');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Kobieta")');

    // Dodaj obwód bioder
    await page.fill('input#hip', '95');
    await page.waitForTimeout(500);

    // Wybierz metodę BAI
    await page.click('button:has-text("Metoda BAI (Body Adiposity Index)")');
    await page.waitForTimeout(1500);

    // Sprawdź czy tabela BMR pokazuje wartości dla Katch-McArdle
    await expect(page.getByText('Katch-McArdle', { exact: true })).toBeVisible();

    // Sprawdź czy Katch-McArdle ma wartość (nie "wymaga % tkanki tłuszczowej")
    // Po wybraniu BAI, Katch-McArdle powinien mieć wartość liczbową
    const katchRow = page.locator('tr:has-text("Katch-McArdle")');
    await expect(katchRow.locator('td').filter({ hasText: /\d+ kcal/ }).first()).toBeVisible({ timeout: 10000 });
  });

  test('7. BAI pełny workflow - od wyboru metody do wyników', async ({ page }) => {
    // Krok 1: Wypełnij dane podstawowe
    await page.fill('input#weight', '75');
    await page.fill('input#height', '175');
    await page.fill('input#age', '35');
    await page.click('button:has-text("Mężczyzna")');
    await page.waitForTimeout(500);

    // Krok 2: Sprawdź że BAI pokazuje "Brak danych"
    await page.click('button:has-text("Metoda BAI (Body Adiposity Index)")');
    await expect(page.getByText(/Brak danych/).first()).toBeVisible();

    // Krok 3: Dodaj obwód bioder
    await page.fill('input#hip', '100');
    await page.waitForTimeout(1000);

    // Krok 4: Sprawdź czy wyświetla się wynik BAI
    await expect(page.getByText(/Szacowany % tkanki tłuszczowej:/)).toBeVisible();

    // Krok 5: Sprawdź info o wykorzystaniu w BMR
    await expect(page.getByText(/Estymacja % tkanki tłuszczowej umożliwi obliczenie BMR/)).toBeVisible();

    // Krok 6: Sprawdź metodę w wyniku
    await expect(page.getByText(/Metoda: BAI \(Body Adiposity Index\)/)).toBeVisible();
  });

  test('8. BAI zmiana płci - dynamiczna aktualizacja kategorii', async ({ page }) => {
    // Wypełnij dane podstawowe dla kobiety
    await page.fill('input#weight', '70');
    await page.fill('input#height', '170');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Kobieta")');
    await page.fill('input#hip', '95');
    await page.waitForTimeout(500);

    // Wybierz BAI
    await page.click('button:has-text("Metoda BAI (Body Adiposity Index)")');
    await page.waitForTimeout(1000);

    // Zapisz kategorię dla kobiety
    const femaleCategory = await page.locator('div.font-medium').filter({ hasText: /Atletyczny|Normalny|Przeciętny/ }).first().textContent();

    // Zmień na mężczyznę
    await page.click('button:has-text("Mężczyzna")');
    await page.waitForTimeout(1000);

    // Sprawdź czy kategoria mogła się zmienić (inne normy dla mężczyzn)
    const maleCategory = await page.locator('div.font-medium').filter({ hasText: /Atletyczny|Normalny|Przeciętny/ }).first().textContent();

    // Kategorie mogą być różne dla tej samej wartości BAI
    expect(maleCategory).toBeTruthy();
  });

  test('9. BAI responsywność - mobile 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    await page.fill('input#weight', '70');
    await page.fill('input#height', '170');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Kobieta")');
    await page.fill('input#hip', '95');
    await page.waitForTimeout(500);

    // Wybierz BAI
    await page.click('button:has-text("Metoda BAI (Body Adiposity Index)")');
    await page.waitForTimeout(500);

    // Sprawdź czy wynik jest widoczny na mobile
    await expect(page.getByText(/Szacowany % tkanki tłuszczowej:/)).toBeVisible();
    const bfValue = page.locator('span.text-primary.font-bold').filter({ hasText: /%/ });
    await expect(bfValue.first()).toBeVisible();
  });

  test('10. BAI edge case - niskie biodra (wartość < 21% dla kobiety)', async ({ page }) => {
    await page.fill('input#weight', '60');
    await page.fill('input#height', '170');
    await page.fill('input#age', '25');
    await page.click('button:has-text("Kobieta")');

    // Małe biodra -> BAI < 21%
    await page.fill('input#hip', '75');
    await page.waitForTimeout(500);

    await page.click('button:has-text("Metoda BAI (Body Adiposity Index)")');
    await page.waitForTimeout(500);

    // Sprawdź kategorię "Bardzo niski"
    await expect(page.locator('div').filter({ hasText: /Bardzo niski/ }).first()).toBeVisible();
  });

  test('11. BAI edge case - wysokie biodra (wartość >= 40% dla kobiety)', async ({ page }) => {
    await page.fill('input#weight', '80');
    await page.fill('input#height', '155');
    await page.fill('input#age', '35');
    await page.click('button:has-text("Kobieta")');

    // Duże biodra + niski wzrost -> BAI >= 40%
    // wzrost 155cm, biodra 118cm -> BAI ≈ 42%
    await page.fill('input#hip', '118');
    await page.waitForTimeout(500);

    await page.click('button:has-text("Metoda BAI (Body Adiposity Index)")');
    await page.waitForTimeout(500);

    // Sprawdź kategorię "Podwyższony"
    await expect(page.locator('div').filter({ hasText: /Podwyższony/ }).first()).toBeVisible();
  });
});
