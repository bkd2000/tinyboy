import { test, expect } from '@playwright/test';

test.describe('WHR Calculator - Testy E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');
  });

  test('1. WHR wyświetla się dla kobiet z obwodami - niskie ryzyko', async ({ page }) => {
    // Wypełnij dane podstawowe
    await page.fill('input#weight', '70');
    await page.fill('input#height', '170');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Kobieta")');

    // Dodaj obwody talii i bioder
    await page.fill('input#waist', '75');
    await page.fill('input#hip', '95');

    // Poczekaj na obliczenia
    await page.waitForTimeout(1000);

    // Sprawdź czy sekcja WHR się wyświetla
    await expect(page.getByText('WHR - Stosunek Obwodu Talii do Bioder')).toBeVisible();

    // Sprawdź wartość WHR (75/95 ≈ 0.79) - używamy precyzyjnego selektora dla dużej wartości
    await expect(page.locator('span.text-5xl:has-text("0.79")')).toBeVisible();

    // Sprawdź kategorię "Niskie ryzyko"
    await expect(page.locator('div.bg-success:has-text("Niskie ryzyko")')).toBeVisible();

    // Sprawdź kolor badge (zielony dla niskiego ryzyka)
    const badge = page.locator('div.bg-success.text-white:has-text("Niskie ryzyko")');
    await expect(badge).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/whr-01-kobieta-niskie-ryzyko.png', fullPage: true });
  });

  test('2. WHR wyświetla się dla mężczyzn z obwodami - wysokie ryzyko', async ({ page }) => {
    // Wypełnij dane podstawowe
    await page.fill('input#weight', '80');
    await page.fill('input#height', '180');
    await page.fill('input#age', '35');
    await page.click('button:has-text("Mężczyzna")');

    // Dodaj obwody talii i bioder
    await page.fill('input#waist', '100');
    await page.fill('input#hip', '95');

    // Poczekaj na obliczenia
    await page.waitForTimeout(1000);

    // Sprawdź czy sekcja WHR się wyświetla
    await expect(page.getByText('WHR - Stosunek Obwodu Talii do Bioder')).toBeVisible();

    // Sprawdź wartość WHR (100/95 ≈ 1.05) - używamy nth(1) bo pierwsza wartość to BMI
    const whrValueSection = page.locator('div:has-text("Twoje WHR")').first();
    await expect(whrValueSection.locator('span.text-5xl').nth(1)).toContainText(/1\.0[0-9]/);

    // Sprawdź normy WHO dla mężczyzn (najpierw sprawdzamy konkretne wartości)
    await expect(page.getByText('Niskie ryzyko (mężczyźni)')).toBeVisible();
    await expect(page.getByText('< 0.95')).toBeVisible();
    await expect(page.getByText('Wysokie ryzyko (mężczyźni)')).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/whr-02-mezczyzna-wysokie-ryzyko.png', fullPage: true });
  });

  test('3. WHR umiarkowane ryzyko dla kobiet - kategoria żółta', async ({ page }) => {
    // Wypełnij dane podstawowe
    await page.fill('input#weight', '70');
    await page.fill('input#height', '170');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Kobieta")');

    // Dodaj obwody dla umiarkowanego ryzyka (0.80-0.85)
    await page.fill('input#waist', '82');
    await page.fill('input#hip', '100');

    await page.waitForTimeout(1000);

    // Sprawdź wartość WHR (82/100 = 0.82)
    await expect(page.locator('span.text-5xl:has-text("0.82")')).toBeVisible();

    // Sprawdź kategorię "Umiarkowane ryzyko"
    await expect(page.locator('div.bg-warning:has-text("Umiarkowane ryzyko")')).toBeVisible();

    // Sprawdź kolor badge (żółty)
    const badge = page.locator('div.bg-warning.text-white:has-text("Umiarkowane ryzyko")');
    await expect(badge).toBeVisible();

    // Sprawdź normy WHO dla kobiet
    await expect(page.getByText('Umiarkowane ryzyko (kobiety)')).toBeVisible();
    await expect(page.getByText('0.80 - 0.85')).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/whr-03-kobieta-umiarkowane-ryzyko.png', fullPage: true });
  });

  test('4. WHR wysokie ryzyko dla kobiet - kategoria czerwona', async ({ page }) => {
    // Wypełnij dane podstawowe
    await page.fill('input#weight', '75');
    await page.fill('input#height', '165');
    await page.fill('input#age', '28');
    await page.click('button:has-text("Kobieta")');

    // Dodaj obwody dla wysokiego ryzyka (>0.85)
    await page.fill('input#waist', '90');
    await page.fill('input#hip', '100');

    await page.waitForTimeout(1000);

    // Sprawdź wartość WHR (90/100 = 0.90)
    await expect(page.locator('span.text-5xl:has-text("0.90")')).toBeVisible();

    // Sprawdź kategorię "Wysokie ryzyko"
    await expect(page.locator('div.bg-danger:has-text("Wysokie ryzyko")')).toBeVisible();

    // Sprawdź kolor badge (czerwony)
    const badge = page.locator('div.bg-danger.text-white:has-text("Wysokie ryzyko")');
    await expect(badge).toBeVisible();

    // Sprawdź normy WHO
    await expect(page.getByText('Wysokie ryzyko (kobiety)')).toBeVisible();
    await expect(page.getByText('> 0.85')).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/whr-04-kobieta-wysokie-ryzyko.png', fullPage: true });
  });

  test('5. WHR NIE wyświetla się bez obwodów', async ({ page }) => {
    // Wypełnij tylko dane podstawowe (bez talii i bioder)
    await page.fill('input#weight', '70');
    await page.fill('input#height', '170');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Kobieta")');

    await page.waitForTimeout(1000);

    // Sprawdź że sekcja WHR NIE istnieje w DOM
    const whrSection = page.getByText('WHR - Stosunek Obwodu Talii do Bioder');
    await expect(whrSection).not.toBeVisible();

    // Sprawdź że inne sekcje są widoczne
    await expect(page.getByText('Wyniki BMR')).toBeVisible();
    await expect(page.getByText('BMI - Wskaźnik Masy Ciała')).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/whr-05-brak-obwodow.png', fullPage: true });
  });

  test('6. WHR NIE wyświetla się bez obwodu bioder', async ({ page }) => {
    // Wypełnij dane podstawowe
    await page.fill('input#weight', '70');
    await page.fill('input#height', '170');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Kobieta")');

    // Dodaj tylko obwód talii (bez bioder)
    await page.fill('input#waist', '75');

    await page.waitForTimeout(1000);

    // Sprawdź że sekcja WHR NIE istnieje
    const whrSection = page.getByText('WHR - Stosunek Obwodu Talii do Bioder');
    await expect(whrSection).not.toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/whr-06-brak-bioder.png' });
  });

  test('7. WHR NIE wyświetla się bez obwodu talii', async ({ page }) => {
    // Wypełnij dane podstawowe
    await page.fill('input#weight', '70');
    await page.fill('input#height', '170');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Kobieta")');

    // Dodaj tylko obwód bioder (bez talii)
    await page.fill('input#hip', '95');

    await page.waitForTimeout(1000);

    // Sprawdź że sekcja WHR NIE istnieje
    const whrSection = page.getByText('WHR - Stosunek Obwodu Talii do Bioder');
    await expect(whrSection).not.toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/whr-07-brak-talii.png' });
  });

  test('8. WHR responsywność mobile viewport', async ({ page }) => {
    // Ustaw viewport na mobile (iPhone SE)
    await page.setViewportSize({ width: 375, height: 667 });

    // Wypełnij dane
    await page.fill('input#weight', '70');
    await page.fill('input#height', '170');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Kobieta")');
    await page.fill('input#waist', '75');
    await page.fill('input#hip', '95');

    await page.waitForTimeout(1000);

    // Sprawdź czy sekcja WHR jest widoczna na mobile
    await expect(page.getByText('WHR - Stosunek Obwodu Talii do Bioder')).toBeVisible();

    // Sprawdź czy wartość WHR jest widoczna
    await expect(page.locator('span.text-5xl:has-text("0.79")')).toBeVisible();

    // Sprawdź czy skala jest widoczna
    await expect(page.getByText('Skala WHR')).toBeVisible();

    // Screenshot mobile
    await page.screenshot({ path: 'test-results/whr-08-mobile-375px.png', fullPage: true });
  });

  test('9. WHR responsywność tablet viewport', async ({ page }) => {
    // Ustaw viewport na tablet
    await page.setViewportSize({ width: 768, height: 1024 });

    // Wypełnij dane
    await page.fill('input#weight', '80');
    await page.fill('input#height', '180');
    await page.fill('input#age', '35');
    await page.click('button:has-text("Mężczyzna")');
    await page.fill('input#waist', '90');
    await page.fill('input#hip', '95');

    await page.waitForTimeout(1000);

    // Sprawdź widoczność
    await expect(page.getByText('WHR - Stosunek Obwodu Talii do Bioder')).toBeVisible();

    // Screenshot tablet
    await page.screenshot({ path: 'test-results/whr-09-tablet-768px.png', fullPage: true });
  });

  test('10. WHR zmiana płci - dynamiczna zmiana norm', async ({ page }) => {
    // Wypełnij dane jako kobieta
    await page.fill('input#weight', '70');
    await page.fill('input#height', '170');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Kobieta")');
    await page.fill('input#waist', '85');
    await page.fill('input#hip', '100');

    await page.waitForTimeout(1000);

    // Sprawdź normy dla kobiet
    await expect(page.getByText('Niskie ryzyko (kobiety)')).toBeVisible();
    await expect(page.getByText('< 0.80')).toBeVisible();

    // Zmień na mężczyznę
    await page.click('button:has-text("Mężczyzna")');
    await page.waitForTimeout(1000);

    // Sprawdź normy dla mężczyzn
    await expect(page.getByText('Niskie ryzyko (mężczyźni)')).toBeVisible();
    await expect(page.getByText('< 0.95')).toBeVisible();

    // Sprawdź że wartość WHR pozostała taka sama (0.85)
    await expect(page.locator('span.text-5xl:has-text("0.85")')).toBeVisible();

    // Screenshot po zmianie płci
    await page.screenshot({ path: 'test-results/whr-10-zmiana-plci.png', fullPage: true });
  });

  test('11. WHR wyświetla informacje edukacyjne', async ({ page }) => {
    // Wypełnij dane
    await page.fill('input#weight', '70');
    await page.fill('input#height', '170');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Kobieta")');
    await page.fill('input#waist', '75');
    await page.fill('input#hip', '95');

    await page.waitForTimeout(1000);

    // Sprawdź sekcję "Co oznacza WHR?"
    await expect(page.getByText('Co oznacza WHR?')).toBeVisible();

    // Sprawdź informacje o typach budowy ciała
    await expect(page.getByText(/Typ androïdowy|jabłko/)).toBeVisible();
    await expect(page.getByText(/Typ gynoidalny|gruszka/)).toBeVisible();

    // Sprawdź disclaimer w sekcji WHR - sprawdzamy tylko w ostatniej sekcji z disclaimer
    const disclaimerSection = page.locator('div.bg-yellow-50:has-text("Uwaga:")').last();
    await expect(disclaimerSection).toBeVisible();
    await expect(disclaimerSection).toContainText(/skonsultuj się z lekarzem/);

    // Screenshot z informacjami
    await page.screenshot({ path: 'test-results/whr-11-informacje-edukacyjne.png', fullPage: true });
  });

  test('12. WHR niskie ryzyko dla mężczyzn', async ({ page }) => {
    // Wypełnij dane dla mężczyzny z niskim WHR
    await page.fill('input#weight', '75');
    await page.fill('input#height', '175');
    await page.fill('input#age', '32');
    await page.click('button:has-text("Mężczyzna")');
    await page.fill('input#waist', '85');
    await page.fill('input#hip', '95');

    await page.waitForTimeout(1000);

    // Sprawdź wartość WHR (85/95 ≈ 0.89) - używamy nth(1) bo pierwsza wartość to BMI
    const whrValueSection = page.locator('div:has-text("Twoje WHR")').first();
    await expect(whrValueSection.locator('span.text-5xl').nth(1)).toContainText(/0\.8[0-9]/);

    // Sprawdź kategorię "Niskie ryzyko"
    await expect(page.locator('div.bg-success:has-text("Niskie ryzyko")')).toBeVisible();

    // Sprawdź kolor badge (zielony)
    const badge = page.locator('div.bg-success.text-white:has-text("Niskie ryzyko")');
    await expect(badge).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/whr-12-mezczyzna-niskie-ryzyko.png', fullPage: true });
  });

  test('13. WHR umiarkowane ryzyko dla mężczyzn', async ({ page }) => {
    // Wypełnij dane dla mężczyzny z umiarkowanym WHR (0.95-1.0)
    await page.fill('input#weight', '80');
    await page.fill('input#height', '180');
    await page.fill('input#age', '35');
    await page.click('button:has-text("Mężczyzna")');
    await page.fill('input#waist', '96');
    await page.fill('input#hip', '100');

    await page.waitForTimeout(1000);

    // Sprawdź wartość WHR (96/100 = 0.96)
    await expect(page.locator('span.text-5xl:has-text("0.96")')).toBeVisible();

    // Sprawdź kategorię "Umiarkowane ryzyko"
    await expect(page.locator('div.bg-warning:has-text("Umiarkowane ryzyko")')).toBeVisible();

    // Sprawdź kolor badge (żółty)
    const badge = page.locator('div.bg-warning.text-white:has-text("Umiarkowane ryzyko")');
    await expect(badge).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/whr-13-mezczyzna-umiarkowane-ryzyko.png', fullPage: true });
  });

  test('14. WHR pełny workflow użytkownika', async ({ page }) => {
    // Symulacja pełnego przepływu użytkownika z WHR

    // 1. Wprowadź dane podstawowe
    await page.fill('input#weight', '70');
    await page.fill('input#height', '170');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Kobieta")');

    // 2. Wprowadź obwody
    await page.fill('input#waist', '75');
    await page.fill('input#hip', '95');

    await page.waitForTimeout(1000);

    // 3. Sprawdź wszystkie sekcje (używamy precyzyjnych selektorów nagłówków)
    await expect(page.getByRole('heading', { name: 'Wyniki BMR' })).toBeVisible();
    await expect(page.getByRole('heading', { name: /TDEE/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: /BMI/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: /WHR/ })).toBeVisible();

    // 4. Sprawdź wartości WHR
    await expect(page.locator('span.text-5xl:has-text("0.79")')).toBeVisible();
    await expect(page.locator('div.bg-success:has-text("Niskie ryzyko")')).toBeVisible();

    // 5. Sprawdź skalę WHR
    await expect(page.getByText('Skala WHR')).toBeVisible();

    // Screenshot finalny
    await page.screenshot({ path: 'test-results/whr-14-full-workflow.png', fullPage: true });
  });

  test('15. WHR edge case - ekstremalne wartości', async ({ page }) => {
    // Test z ekstremalnymi wartościami
    await page.fill('input#weight', '120');
    await page.fill('input#height', '160');
    await page.fill('input#age', '50');
    await page.click('button:has-text("Kobieta")');

    // Bardzo wysoki WHR
    await page.fill('input#waist', '110');
    await page.fill('input#hip', '100');

    await page.waitForTimeout(1000);

    // Sprawdź czy obliczenia nadal działają
    await expect(page.getByText('WHR - Stosunek Obwodu Talii do Bioder')).toBeVisible();
    await expect(page.locator('span.text-5xl:has-text("1.10")')).toBeVisible();
    await expect(page.locator('div.bg-danger:has-text("Wysokie ryzyko")')).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/whr-15-edge-case-ekstremalne.png', fullPage: true });
  });

  test('16. WHR edge case - bardzo niskie wartości', async ({ page }) => {
    // Test z bardzo niskimi wartościami WHR
    await page.fill('input#weight', '50');
    await page.fill('input#height', '170');
    await page.fill('input#age', '25');
    await page.click('button:has-text("Kobieta")');

    // Bardzo niski WHR
    await page.fill('input#waist', '60');
    await page.fill('input#hip', '95');

    await page.waitForTimeout(1000);

    // Sprawdź wartość WHR (60/95 ≈ 0.63) - używamy nth(1) bo pierwsza wartość to BMI
    const whrValueSection = page.locator('div:has-text("Twoje WHR")').first();
    await expect(whrValueSection.locator('span.text-5xl').nth(1)).toContainText(/0\.6[0-9]/);
    await expect(page.locator('div.bg-success:has-text("Niskie ryzyko")')).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/whr-16-edge-case-niskie.png', fullPage: true });
  });
});
