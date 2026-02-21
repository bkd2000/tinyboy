import { test, expect } from '@playwright/test';

test.describe('WHtR Calculator - Testy E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');
  });

  test('1. WHtR very-lean category (< 0.40) - bardzo szczupły', async ({ page }) => {
    // Wypełnij dane podstawowe
    await page.fill('input#weight', '65');
    await page.fill('input#height', '180');
    await page.fill('input#age', '25');
    await page.click('button:has-text("Mężczyzna")');

    // Dodaj obwód talii dla WHtR < 0.40
    await page.fill('input#waist', '65');

    // Poczekaj na obliczenia
    await page.waitForTimeout(1000);

    // Sprawdź czy sekcja WHtR się wyświetla
    await expect(page.getByText('WHtR - Stosunek Obwodu Talii do Wzrostu')).toBeVisible();

    // Sprawdź wartość WHtR (65/180 ≈ 0.36)
    await expect(page.locator('span.text-5xl:has-text("0.36")')).toBeVisible();

    // Sprawdź kategorię "Bardzo szczupły" (żółty)
    await expect(page.locator('div.bg-warning:has-text("Bardzo szczupły")')).toBeVisible();

    // Sprawdź kolor badge (żółty dla bardzo szczupłych)
    const badge = page.locator('div.bg-warning.text-white:has-text("Bardzo szczupły")');
    await expect(badge).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/whtr-01-very-lean.png', fullPage: true });
  });

  test('2. WHtR healthy category (0.40-0.49) - zdrowy', async ({ page }) => {
    // Wypełnij dane podstawowe
    await page.fill('input#weight', '70');
    await page.fill('input#height', '170');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Kobieta")');

    // Dodaj obwód talii dla WHtR 0.40-0.49
    await page.fill('input#waist', '75');

    // Poczekaj na obliczenia
    await page.waitForTimeout(1000);

    // Sprawdź czy sekcja WHtR się wyświetla
    await expect(page.getByText('WHtR - Stosunek Obwodu Talii do Wzrostu')).toBeVisible();

    // Sprawdź wartość WHtR (75/170 ≈ 0.44)
    await expect(page.locator('span.text-5xl:has-text("0.44")')).toBeVisible();

    // Sprawdź kategorię "Zdrowy" (zielony)
    await expect(page.locator('div.bg-success:has-text("Zdrowy")')).toBeVisible();

    // Sprawdź kolor badge (zielony dla zdrowego)
    const badge = page.locator('div.bg-success.text-white:has-text("Zdrowy")');
    await expect(badge).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/whtr-02-healthy.png', fullPage: true });
  });

  test('3. WHtR increased-risk category (0.50-0.59) - zwiększone ryzyko', async ({ page }) => {
    // Wypełnij dane podstawowe
    await page.fill('input#weight', '75');
    await page.fill('input#height', '165');
    await page.fill('input#age', '35');
    await page.click('button:has-text("Kobieta")');

    // Dodaj obwód talii dla WHtR 0.50-0.59
    await page.fill('input#waist', '90');

    // Poczekaj na obliczenia
    await page.waitForTimeout(1000);

    // Sprawdź czy sekcja WHtR się wyświetla
    await expect(page.getByText('WHtR - Stosunek Obwodu Talii do Wzrostu')).toBeVisible();

    // Sprawdź wartość WHtR (90/165 ≈ 0.55)
    await expect(page.locator('span.text-5xl:has-text("0.55")')).toBeVisible();

    // Sprawdź kategorię "Zwiększone ryzyko" (żółty)
    await expect(page.locator('div.bg-warning:has-text("Zwiększone ryzyko")')).toBeVisible();

    // Sprawdź kolor badge (żółty)
    const badge = page.locator('div.bg-warning.text-white:has-text("Zwiększone ryzyko")');
    await expect(badge).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/whtr-03-increased-risk.png', fullPage: true });
  });

  test('4. WHtR high-risk category (>= 0.60) - wysokie ryzyko', async ({ page }) => {
    // Wypełnij dane podstawowe
    await page.fill('input#weight', '90');
    await page.fill('input#height', '170');
    await page.fill('input#age', '40');
    await page.click('button:has-text("Mężczyzna")');

    // Dodaj obwód talii dla WHtR >= 0.60
    await page.fill('input#waist', '110');

    // Poczekaj na obliczenia
    await page.waitForTimeout(1000);

    // Sprawdź czy sekcja WHtR się wyświetla
    await expect(page.getByText('WHtR - Stosunek Obwodu Talii do Wzrostu')).toBeVisible();

    // Sprawdź wartość WHtR (110/170 ≈ 0.65)
    await expect(page.locator('span.text-5xl:has-text("0.65")')).toBeVisible();

    // Sprawdź kategorię "Wysokie ryzyko" (czerwony)
    await expect(page.locator('div.bg-danger:has-text("Wysokie ryzyko")')).toBeVisible();

    // Sprawdź kolor badge (czerwony)
    const badge = page.locator('div.bg-danger.text-white:has-text("Wysokie ryzyko")');
    await expect(badge).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/whtr-04-high-risk.png', fullPage: true });
  });

  test('5. WHtR NIE wyświetla się bez obwodu talii', async ({ page }) => {
    // Wypełnij tylko dane podstawowe (bez talii)
    await page.fill('input#weight', '70');
    await page.fill('input#height', '170');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Kobieta")');

    await page.waitForTimeout(1000);

    // Sprawdź że sekcja WHtR NIE istnieje w DOM
    const whtrSection = page.getByText('WHtR - Stosunek Obwodu Talii do Wzrostu');
    await expect(whtrSection).not.toBeVisible();

    // Sprawdź że inne sekcje są widoczne
    await expect(page.getByText('Wyniki BMR')).toBeVisible();
    await expect(page.getByText('BMI - Wskaźnik Masy Ciała')).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/whtr-05-brak-talii.png', fullPage: true });
  });

  test('6. WHtR sprawdza "Zasadę pół wzrostu"', async ({ page }) => {
    // Wypełnij dane podstawowe
    await page.fill('input#weight', '80');
    await page.fill('input#height', '180');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Mężczyzna")');

    // Dodaj obwód talii
    await page.fill('input#waist', '85');

    await page.waitForTimeout(1000);

    // Sprawdź czy sekcja WHtR się wyświetla
    await expect(page.getByText('WHtR - Stosunek Obwodu Talii do Wzrostu')).toBeVisible();

    // Sprawdź sekcję "Zasada pół wzrostu" - wzrost 180cm -> talia < 90 cm
    await expect(page.getByText('Zasada pół wzrostu')).toBeVisible();
    await expect(page.getByText('< 90 cm')).toBeVisible();

    // Sprawdź czy jest informacja o zasadzie
    await expect(page.locator('text=/Obwód talii powinien być mniejszy niż połowa wzrostu/')).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/whtr-06-pol-wzrostu.png', fullPage: true });
  });

  test('7. WHtR sprawdza uniwersalne normy (bez płci)', async ({ page }) => {
    // Test dla kobiety
    await page.fill('input#weight', '70');
    await page.fill('input#height', '170');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Kobieta")');
    await page.fill('input#waist', '75');

    await page.waitForTimeout(1000);

    // Sprawdź normy WHO bez rozróżnienia na płeć
    await expect(page.getByText('Normy WHO')).toBeVisible();

    // Sprawdź że NIE MA rozróżnienia "(kobiety)" lub "(mężczyźni)"
    const normsSectionWoman = page.locator('div:has-text("Normy WHO")').first();
    await expect(normsSectionWoman).not.toContainText('(kobiety)');
    await expect(normsSectionWoman).not.toContainText('(mężczyźni)');

    // Sprawdź uniwersalne zakresy
    await expect(page.getByText('Bardzo szczupły')).toBeVisible();
    await expect(page.getByText('< 0.40')).toBeVisible();
    await expect(page.getByText('Zdrowy')).toBeVisible();
    await expect(page.getByText('0.40 - 0.49')).toBeVisible();

    // Screenshot dla kobiety
    await page.screenshot({ path: 'test-results/whtr-07a-normy-kobieta.png', fullPage: true });

    // Zmień na mężczyznę
    await page.click('button:has-text("Mężczyzna")');
    await page.waitForTimeout(1000);

    // Sprawdź że normy pozostały uniwersalne (bez rozróżnienia na płeć)
    const normsSectionMan = page.locator('div:has-text("Normy WHO")').first();
    await expect(normsSectionMan).not.toContainText('(kobiety)');
    await expect(normsSectionMan).not.toContainText('(mężczyźni)');

    // Screenshot dla mężczyzny
    await page.screenshot({ path: 'test-results/whtr-07b-normy-mezczyzna.png', fullPage: true });
  });

  test('8. WHtR responsywność mobile viewport', async ({ page }) => {
    // Ustaw viewport na mobile (iPhone SE)
    await page.setViewportSize({ width: 375, height: 667 });

    // Wypełnij dane
    await page.fill('input#weight', '70');
    await page.fill('input#height', '170');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Kobieta")');
    await page.fill('input#waist', '75');

    await page.waitForTimeout(1000);

    // Sprawdź czy sekcja WHtR jest widoczna na mobile
    await expect(page.getByText('WHtR - Stosunek Obwodu Talii do Wzrostu')).toBeVisible();

    // Sprawdź czy wartość WHtR jest widoczna
    await expect(page.locator('span.text-5xl:has-text("0.44")')).toBeVisible();

    // Sprawdź czy skala jest widoczna
    await expect(page.getByText('Skala WHtR')).toBeVisible();

    // Screenshot mobile
    await page.screenshot({ path: 'test-results/whtr-08-mobile-375px.png', fullPage: true });
  });

  test('9. WHtR sprawdza skalę 4-kolorową', async ({ page }) => {
    // Wypełnij dane
    await page.fill('input#weight', '70');
    await page.fill('input#height', '170');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Kobieta")');
    await page.fill('input#waist', '75');

    await page.waitForTimeout(1000);

    // Sprawdź czy sekcja skali istnieje
    await expect(page.getByText('Skala WHtR')).toBeVisible();

    // Sprawdź 4 sekcje skali z odpowiednimi kolorami i zakresami
    const scaleSection = page.locator('div:has-text("Skala WHtR")').first();

    // 1. Bardzo szczupły (żółty) < 0.40
    await expect(scaleSection.locator('div.bg-warning:has-text("Bardzo szczupły")')).toBeVisible();
    await expect(scaleSection.locator('text=/< 0.40/')).toBeVisible();

    // 2. Zdrowy (zielony) 0.40 - 0.49
    await expect(scaleSection.locator('div.bg-success:has-text("Zdrowy")')).toBeVisible();
    await expect(scaleSection.locator('text=/0.40.*0.49/')).toBeVisible();

    // 3. Zwiększone ryzyko (żółty) 0.50 - 0.59
    await expect(scaleSection.locator('div.bg-warning:has-text("Zwiększone ryzyko")')).toBeVisible();
    await expect(scaleSection.locator('text=/0.50.*0.59/')).toBeVisible();

    // 4. Wysokie ryzyko (czerwony) >= 0.60
    await expect(scaleSection.locator('div.bg-danger:has-text("Wysokie ryzyko")')).toBeVisible();
    await expect(scaleSection.locator('text=/≥ 0.60/')).toBeVisible();

    // Screenshot skali
    await page.screenshot({ path: 'test-results/whtr-09-skala-4-kolorowa.png', fullPage: true });
  });

  test('10. WHtR pełny workflow użytkownika', async ({ page }) => {
    // Symulacja pełnego przepływu użytkownika z WHtR

    // 1. Wprowadź dane podstawowe
    await page.fill('input#weight', '75');
    await page.fill('input#height', '168');
    await page.fill('input#age', '28');
    await page.click('button:has-text("Kobieta")');

    // 2. Wprowadź obwód talii
    await page.fill('input#waist', '78');

    await page.waitForTimeout(1000);

    // 3. Sprawdź wszystkie sekcje (używamy precyzyjnych selektorów nagłówków)
    await expect(page.getByRole('heading', { name: 'Wyniki BMR' })).toBeVisible();
    await expect(page.getByRole('heading', { name: /TDEE/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: /BMI/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: /WHtR/ })).toBeVisible();

    // 4. Sprawdź wartość WHtR (78/168 ≈ 0.46)
    await expect(page.locator('span.text-5xl:has-text("0.46")')).toBeVisible();
    await expect(page.locator('div.bg-success:has-text("Zdrowy")')).toBeVisible();

    // 5. Sprawdź skalę WHtR
    await expect(page.getByText('Skala WHtR')).toBeVisible();

    // 6. Sprawdź "Zasadę pół wzrostu" - wzrost 168cm -> talia < 84 cm
    await expect(page.getByText('Zasada pół wzrostu')).toBeVisible();
    await expect(page.getByText('< 84 cm')).toBeVisible();

    // 7. Sprawdź informacje edukacyjne
    await expect(page.getByText('Co oznacza WHtR?')).toBeVisible();

    // Screenshot finalny
    await page.screenshot({ path: 'test-results/whtr-10-full-workflow.png', fullPage: true });
  });

  test('11. WHtR edge case - wartość graniczna 0.40', async ({ page }) => {
    // Test dla wartości granicznej między bardzo szczupły a zdrowy
    await page.fill('input#weight', '70');
    await page.fill('input#height', '175');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Mężczyzna")');

    // Obwód talii dokładnie 0.40 (70/175 = 0.40)
    await page.fill('input#waist', '70');

    await page.waitForTimeout(1000);

    // Sprawdź wartość WHtR
    await expect(page.locator('span.text-5xl:has-text("0.40")')).toBeVisible();

    // Sprawdź kategorię - powinno być "Zdrowy" (0.40 - 0.49)
    await expect(page.locator('div.bg-success:has-text("Zdrowy")')).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/whtr-11-edge-040.png', fullPage: true });
  });

  test('12. WHtR edge case - wartość graniczna 0.50', async ({ page }) => {
    // Test dla wartości granicznej między zdrowy a zwiększone ryzyko
    await page.fill('input#weight', '75');
    await page.fill('input#height', '170');
    await page.fill('input#age', '35');
    await page.click('button:has-text("Kobieta")');

    // Obwód talii dokładnie 0.50 (85/170 = 0.50)
    await page.fill('input#waist', '85');

    await page.waitForTimeout(1000);

    // Sprawdź wartość WHtR
    await expect(page.locator('span.text-5xl:has-text("0.50")')).toBeVisible();

    // Sprawdź kategorię - powinno być "Zwiększone ryzyko" (0.50 - 0.59)
    await expect(page.locator('div.bg-warning:has-text("Zwiększone ryzyko")')).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/whtr-12-edge-050.png', fullPage: true });
  });

  test('13. WHtR edge case - wartość graniczna 0.60', async ({ page }) => {
    // Test dla wartości granicznej między zwiększone ryzyko a wysokie ryzyko
    await page.fill('input#weight', '85');
    await page.fill('input#height', '175');
    await page.fill('input#age', '40');
    await page.click('button:has-text("Mężczyzna")');

    // Obwód talii dokładnie 0.60 (105/175 = 0.60)
    await page.fill('input#waist', '105');

    await page.waitForTimeout(1000);

    // Sprawdź wartość WHtR
    await expect(page.locator('span.text-5xl:has-text("0.60")')).toBeVisible();

    // Sprawdź kategorię - powinno być "Wysokie ryzyko" (>= 0.60)
    await expect(page.locator('div.bg-danger:has-text("Wysokie ryzyko")')).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/whtr-13-edge-060.png', fullPage: true });
  });

  test('14. WHtR wyświetla informacje edukacyjne', async ({ page }) => {
    // Wypełnij dane
    await page.fill('input#weight', '70');
    await page.fill('input#height', '170');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Kobieta")');
    await page.fill('input#waist', '75');

    await page.waitForTimeout(1000);

    // Sprawdź sekcję "Co oznacza WHtR?"
    await expect(page.getByText('Co oznacza WHtR?')).toBeVisible();

    // Sprawdź informację o pomiarze tłuszczu brzusznego
    await expect(page.locator('text=/tłuszcz brzuszny|tłuszczu wisceralnego/')).toBeVisible();

    // Sprawdź zalety WHtR
    await expect(page.locator('text=/uniwersalny dla wszystkich|nie zależy od płci/')).toBeVisible();

    // Sprawdź disclaimer - sprawdzamy tylko w ostatniej sekcji z disclaimer
    const disclaimerSection = page.locator('div.bg-yellow-50:has-text("Uwaga:")').last();
    await expect(disclaimerSection).toBeVisible();
    await expect(disclaimerSection).toContainText(/skonsultuj się z lekarzem/);

    // Screenshot z informacjami
    await page.screenshot({ path: 'test-results/whtr-14-informacje-edukacyjne.png', fullPage: true });
  });

  test('15. WHtR edge case - ekstremalne wartości wysokie', async ({ page }) => {
    // Test z ekstremalnymi wartościami
    await page.fill('input#weight', '130');
    await page.fill('input#height', '160');
    await page.fill('input#age', '50');
    await page.click('button:has-text("Kobieta")');

    // Bardzo wysoki WHtR
    await page.fill('input#waist', '120');

    await page.waitForTimeout(1000);

    // Sprawdź czy obliczenia nadal działają (120/160 = 0.75)
    await expect(page.getByText('WHtR - Stosunek Obwodu Talii do Wzrostu')).toBeVisible();
    await expect(page.locator('span.text-5xl:has-text("0.75")')).toBeVisible();
    await expect(page.locator('div.bg-danger:has-text("Wysokie ryzyko")')).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/whtr-15-edge-case-ekstremalne.png', fullPage: true });
  });

  test('16. WHtR edge case - bardzo niskie wartości', async ({ page }) => {
    // Test z bardzo niskimi wartościami WHtR
    await page.fill('input#weight', '50');
    await page.fill('input#height', '180');
    await page.fill('input#age', '25');
    await page.click('button:has-text("Mężczyzna")');

    // Bardzo niski WHtR (60/180 ≈ 0.33)
    await page.fill('input#waist', '60');

    await page.waitForTimeout(1000);

    // Sprawdź wartość WHtR
    await expect(page.locator('span.text-5xl:has-text("0.33")')).toBeVisible();
    await expect(page.locator('div.bg-warning:has-text("Bardzo szczupły")')).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/whtr-16-edge-case-niskie.png', fullPage: true });
  });

  test('17. WHtR responsywność tablet viewport', async ({ page }) => {
    // Ustaw viewport na tablet
    await page.setViewportSize({ width: 768, height: 1024 });

    // Wypełnij dane
    await page.fill('input#weight', '75');
    await page.fill('input#height', '170');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Kobieta")');
    await page.fill('input#waist', '78');

    await page.waitForTimeout(1000);

    // Sprawdź widoczność
    await expect(page.getByText('WHtR - Stosunek Obwodu Talii do Wzrostu')).toBeVisible();

    // Screenshot tablet
    await page.screenshot({ path: 'test-results/whtr-17-tablet-768px.png', fullPage: true });
  });

  test('18. WHtR zmiana wzrostu - dynamiczna aktualizacja', async ({ page }) => {
    // Wypełnij dane początkowe
    await page.fill('input#weight', '70');
    await page.fill('input#height', '170');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Kobieta")');
    await page.fill('input#waist', '75');

    await page.waitForTimeout(1000);

    // Sprawdź pierwsze wartości (75/170 ≈ 0.44)
    await expect(page.locator('span.text-5xl:has-text("0.44")')).toBeVisible();
    await expect(page.locator('div.bg-success:has-text("Zdrowy")')).toBeVisible();

    // Zmień wzrost na 150 (75/150 = 0.50)
    await page.fill('input#height', '150');
    await page.waitForTimeout(1000);

    // Sprawdź nowe wartości
    await expect(page.locator('span.text-5xl:has-text("0.50")')).toBeVisible();
    await expect(page.locator('div.bg-warning:has-text("Zwiększone ryzyko")')).toBeVisible();

    // Sprawdź "Zasadę pół wzrostu" - wzrost 150cm -> talia < 75 cm
    await expect(page.getByText('< 75 cm')).toBeVisible();

    // Screenshot po zmianie wzrostu
    await page.screenshot({ path: 'test-results/whtr-18-zmiana-wzrostu.png', fullPage: true });
  });
});
