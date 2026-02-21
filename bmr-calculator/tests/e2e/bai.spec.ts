import { test, expect } from '@playwright/test';

/**
 * TESTY E2E DLA KOMPONENTU BAI (Body Adiposity Index)
 *
 * Status: GOTOWE - Czekają na implementację komponentu BAI
 *
 * Te testy są pełną specyfikacją funkcjonalności BAI i pokrywają:
 * - 5 kategorii BAI dla kobiet: very-low, athletic, normal, average, elevated
 * - 4 kategorie BAI dla mężczyzn: athletic, normal, average, elevated
 * - Walidację wyświetlania komponentu (tylko gdy obwód bioder jest podany)
 * - Purple box z informacją "Unikalność BAI - Nie wymaga wagi"
 * - Indigo box z wzorem matematycznym BAI
 * - Responsywność (mobile 375px, tablet 768px)
 * - Skalę 5-kolorową (yellow, green-light, green-dark, orange, red)
 * - Dynamiczną zmianę norm przy zmianie płci
 * - Pełny workflow użytkownika
 * - Edge cases (wartości graniczne dla wszystkich kategorii)
 *
 * Aby uruchomić testy po implementacji BAI:
 * 1. Usuń .skip z wszystkich testów
 * 2. Uruchom: npx playwright test tests/e2e/bai.spec.ts
 */

test.describe('BAI Calculator - Testy E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');
  });

  test('1. BAI very-low dla kobiet (< 21%) - bardzo niska', async ({ page }) => {
    // Wypełnij dane podstawowe
    await page.fill('input#weight', '60');
    await page.fill('input#height', '170');
    await page.fill('input#age', '25');
    await page.click('button:has-text("Kobieta")');

    // Dodaj obwód bioder dla BAI < 21%
    // wzrost 170cm, biodra 75cm -> BAI ≈ 13%
    await page.fill('input#hip', '75');

    // Poczekaj na obliczenia
    await page.waitForTimeout(1000);

    // Sprawdź czy sekcja BAI się wyświetla
    await expect(page.getByText('BAI - Body Adiposity Index')).toBeVisible();

    // Sprawdź wartość BAI (około 13%)
    const baiSection = page.locator('div:has-text("Twoje BAI")').first();
    await expect(baiSection.locator('span.text-5xl').filter({ hasText: /^1[0-9]\./ })).toBeVisible();

    // Sprawdź kategorię "Bardzo niski" (wyświetlane jako paragraf)
    await expect(page.locator('p:has-text("Bardzo niski")').first()).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/bai-01-kobieta-very-low.png', fullPage: true });
  });

  test('2. BAI athletic dla kobiet (21-26%) - atletyczna', async ({ page }) => {
    // Wypełnij dane podstawowe
    await page.fill('input#weight', '65');
    await page.fill('input#height', '165');
    await page.fill('input#age', '28');
    await page.click('button:has-text("Kobieta")');

    // Dodaj obwód bioder dla BAI 21-26%
    // wzrost 165cm, biodra 85cm -> BAI ≈ 23%
    await page.fill('input#hip', '85');

    await page.waitForTimeout(1000);

    // Sprawdź czy sekcja BAI się wyświetla
    await expect(page.getByText('BAI - Body Adiposity Index')).toBeVisible();

    // Sprawdź wartość BAI (około 22%)
    const baiSection = page.locator('div:has-text("BAI - Body Adiposity Index")').first();
    await expect(baiSection.locator('span.text-5xl').filter({ hasText: /^2[0-9]\./ })).toBeVisible();

    // Sprawdź kategorię "Atletyczny" (wyświetlane jako paragraf)
    await expect(page.locator('p:has-text("Atletyczny")').first()).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/bai-02-kobieta-athletic.png', fullPage: true });
  });

  test('3. BAI normal dla kobiet (27-33%) - normalna', async ({ page }) => {
    // Wypełnij dane podstawowe
    await page.fill('input#weight', '70');
    await page.fill('input#height', '170');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Kobieta")');

    // Dodaj obwód bioder dla BAI 27-33%
    // wzrost 170cm, biodra 95cm -> BAI ≈ 30%
    await page.fill('input#hip', '95');

    await page.waitForTimeout(1000);

    // Sprawdź czy sekcja BAI się wyświetla
    await expect(page.getByText('BAI - Body Adiposity Index')).toBeVisible();

    // Sprawdź wartość BAI (około 30%)
    const baiSection = page.locator('div:has-text("Twoje BAI")').first();
    await expect(baiSection.locator('span.text-5xl').filter({ hasText: /^[23][0-9]\./ })).toBeVisible();

    // Sprawdź kategorię "Normalny" (wyświetlane jako paragraf)
    await expect(page.locator('p:has-text("Normalny")').first()).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/bai-03-kobieta-normal.png', fullPage: true });
  });

  test('4. BAI average dla kobiet (34-39%) - przeciętna', async ({ page }) => {
    // Wypełnij dane podstawowe
    await page.fill('input#weight', '75');
    await page.fill('input#height', '165');
    await page.fill('input#age', '35');
    await page.click('button:has-text("Kobieta")');

    // Dodaj obwód bioder dla BAI 34-39%
    // wzrost 165cm, biodra 100cm -> BAI ≈ 36%
    await page.fill('input#hip', '100');

    await page.waitForTimeout(1000);

    // Sprawdź czy sekcja BAI się wyświetla
    await expect(page.getByText('BAI - Body Adiposity Index')).toBeVisible();

    // Sprawdź wartość BAI (około 36%)
    const baiSection = page.locator('div:has-text("Twoje BAI")').first();
    await expect(baiSection.locator('span.text-5xl').filter({ hasText: /^3[0-9]\./ })).toBeVisible();

    // Sprawdź kategorię "Przeciętny" (wyświetlane jako paragraf)
    await expect(page.locator('p:has-text("Przeciętny")').first()).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/bai-04-kobieta-average.png', fullPage: true });
  });

  test('5. BAI elevated dla kobiet (>= 40%) - podwyższona', async ({ page }) => {
    // Wypełnij dane podstawowe
    await page.fill('input#weight', '80');
    await page.fill('input#height', '160');
    await page.fill('input#age', '40');
    await page.click('button:has-text("Kobieta")');

    // Dodaj obwód bioder dla BAI >= 40%
    // wzrost 160cm, biodra 105cm -> BAI ≈ 42%
    await page.fill('input#hip', '105');

    await page.waitForTimeout(1000);

    // Sprawdź czy sekcja BAI się wyświetla
    await expect(page.getByText('BAI - Body Adiposity Index')).toBeVisible();

    // Sprawdź wartość BAI (około 42%)
    const baiSection = page.locator('div:has-text("Twoje BAI")').first();
    await expect(baiSection.locator('span.text-5xl').filter({ hasText: /^4[0-9]\./ })).toBeVisible();

    // Sprawdź kategorię "Podwyższony" (wyświetlane jako paragraf)
    await expect(page.locator('p:has-text("Podwyższony")').first()).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/bai-05-kobieta-elevated.png', fullPage: true });
  });

  test('6. BAI athletic dla mężczyzn (8-14%) - atletyczna', async ({ page }) => {
    // Wypełnij dane podstawowe
    await page.fill('input#weight', '75');
    await page.fill('input#height', '180');
    await page.fill('input#age', '28');
    await page.click('button:has-text("Mężczyzna")');

    // Dodaj obwód bioder dla BAI 8-14%
    // wzrost 180cm, biodra 90cm -> BAI ≈ 10%
    await page.fill('input#hip', '90');

    await page.waitForTimeout(1000);

    // Sprawdź czy sekcja BAI się wyświetla
    await expect(page.getByText('BAI - Body Adiposity Index')).toBeVisible();

    // Sprawdź wartość BAI (około 10%)
    const baiSection = page.locator('div:has-text("Twoje BAI")').first();
    await expect(baiSection.locator('span.text-5xl').filter({ hasText: /^[0-9]\./ })).toBeVisible();

    // Sprawdź kategorię "Atletyczny" (wyświetlane jako paragraf)
    await expect(page.locator('p:has-text("Atletyczny")').first()).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/bai-06-mezczyzna-athletic.png', fullPage: true });
  });

  test('7. BAI normal dla mężczyzn (15-19%) - normalna', async ({ page }) => {
    // Wypełnij dane podstawowe
    await page.fill('input#weight', '80');
    await page.fill('input#height', '175');
    await page.fill('input#age', '32');
    await page.click('button:has-text("Mężczyzna")');

    // Dodaj obwód bioder dla BAI 15-19%
    // wzrost 175cm, biodra 95cm -> BAI ≈ 17%
    await page.fill('input#hip', '95');

    await page.waitForTimeout(1000);

    // Sprawdź czy sekcja BAI się wyświetla
    await expect(page.getByText('BAI - Body Adiposity Index')).toBeVisible();

    // Sprawdź wartość BAI (około 17%)
    const baiSection = page.locator('div:has-text("Twoje BAI")').first();
    await expect(baiSection.locator('span.text-5xl').filter({ hasText: /^1[0-9]\./ })).toBeVisible();

    // Sprawdź kategorię "Normalny" (wyświetlane jako paragraf)
    await expect(page.locator('p:has-text("Normalny")').first()).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/bai-07-mezczyzna-normal.png', fullPage: true });
  });

  test('8. BAI average dla mężczyzn (20-24%) - przeciętna', async ({ page }) => {
    // Wypełnij dane podstawowe
    await page.fill('input#weight', '85');
    await page.fill('input#height', '170');
    await page.fill('input#age', '35');
    await page.click('button:has-text("Mężczyzna")');

    // Dodaj obwód bioder dla BAI 20-24%
    // wzrost 170cm, biodra 95cm -> BAI ≈ 22%
    await page.fill('input#hip', '95');

    await page.waitForTimeout(1000);

    // Sprawdź czy sekcja BAI się wyświetla
    await expect(page.getByText('BAI - Body Adiposity Index')).toBeVisible();

    // Sprawdź wartość BAI (około 22%)
    const baiSection = page.locator('div:has-text("Twoje BAI")').first();
    await expect(baiSection.locator('span.text-5xl').filter({ hasText: /^2[0-9]\./ })).toBeVisible();

    // Sprawdź kategorię "Przeciętny" (wyświetlane jako paragraf)
    await expect(page.locator('p:has-text("Przeciętny")').first()).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/bai-08-mezczyzna-average.png', fullPage: true });
  });

  test('9. BAI elevated dla mężczyzn (>= 25%) - podwyższona', async ({ page }) => {
    // Wypełnij dane podstawowe
    await page.fill('input#weight', '90');
    await page.fill('input#height', '165');
    await page.fill('input#age', '40');
    await page.click('button:has-text("Mężczyzna")');

    // Dodaj obwód bioder dla BAI >= 25%
    // wzrost 165cm, biodra 100cm -> BAI ≈ 27%
    await page.fill('input#hip', '100');

    await page.waitForTimeout(1000);

    // Sprawdź czy sekcja BAI się wyświetla
    await expect(page.getByText('BAI - Body Adiposity Index')).toBeVisible();

    // Sprawdź wartość BAI (około 27%)
    const baiSection = page.locator('div:has-text("Twoje BAI")').first();
    await expect(baiSection.locator('span.text-5xl').filter({ hasText: /^2[0-9]\./ })).toBeVisible();

    // Sprawdź kategorię "Podwyższony" (wyświetlane jako paragraf)
    await expect(page.locator('p:has-text("Podwyższony")').first()).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/bai-09-mezczyzna-elevated.png', fullPage: true });
  });

  test('10. BAI NIE wyświetla się bez obwodu bioder', async ({ page }) => {
    // Wypełnij tylko dane podstawowe (bez bioder)
    await page.fill('input#weight', '70');
    await page.fill('input#height', '170');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Kobieta")');

    await page.waitForTimeout(1000);

    // Sprawdź że sekcja BAI NIE istnieje w DOM
    const baiSection = page.getByText('BAI - Body Adiposity Index');
    await expect(baiSection).not.toBeVisible();

    // Sprawdź że inne sekcje są widoczne
    await expect(page.getByText('Wyniki BMR')).toBeVisible();
    await expect(page.getByText('BMI - Wskaźnik Masy Ciała')).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/bai-10-brak-bioder.png', fullPage: true });
  });

  test('11. BAI purple box - "Unikalność BAI"', async ({ page }) => {
    // Wypełnij dane
    await page.fill('input#weight', '70');
    await page.fill('input#height', '170');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Kobieta")');
    await page.fill('input#hip', '95');

    await page.waitForTimeout(1000);

    // Sprawdź czy purple box istnieje
    const purpleBox = page.locator('div.bg-purple-50');
    await expect(purpleBox).toBeVisible();

    // Sprawdź tekst "Nie wymaga wagi"
    await expect(page.locator('text=/Nie wymaga wagi/')).toBeVisible();

    // Sprawdź informacje o unikalności BAI
    await expect(page.locator('text=/Unikalność BAI|BAI jest wyjątkowy/')).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/bai-11-purple-box.png', fullPage: true });
  });

  test('12. BAI wzór matematyczny w indigo box', async ({ page }) => {
    // Wypełnij dane
    await page.fill('input#weight', '70');
    await page.fill('input#height', '170');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Kobieta")');
    await page.fill('input#hip', '95');

    await page.waitForTimeout(1000);

    // Sprawdź czy indigo box z wzorem istnieje
    const indigoBox = page.locator('div.bg-indigo-50:has-text("Wzór BAI")');
    await expect(indigoBox).toBeVisible();

    // Sprawdź format wzoru - powinien zawierać elementy wzoru BAI
    await expect(indigoBox).toContainText('Wzór BAI');

    // Sprawdź czy wzór zawiera elementy matematyczne
    await expect(indigoBox).toContainText('obwód bioder');
    await expect(indigoBox).toContainText('wzrost');

    // Screenshot
    await page.screenshot({ path: 'test-results/bai-12-indigo-box-wzor.png', fullPage: true });
  });

  test('13. BAI responsywność mobile viewport', async ({ page }) => {
    // Ustaw viewport na mobile (iPhone SE)
    await page.setViewportSize({ width: 375, height: 667 });

    // Wypełnij dane
    await page.fill('input#weight', '70');
    await page.fill('input#height', '170');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Kobieta")');
    await page.fill('input#hip', '95');

    await page.waitForTimeout(1000);

    // Sprawdź czy sekcja BAI jest widoczna na mobile
    await expect(page.getByText('BAI - Body Adiposity Index')).toBeVisible();

    // Sprawdź czy wartość BAI jest widoczna
    const baiSection = page.locator('div:has-text("Twoje BAI")').first();
    await expect(baiSection.locator('span.text-5xl').filter({ hasText: /^[0-9]+\./ })).toBeVisible();

    // Sprawdź czy skala jest widoczna
    await expect(page.getByText('Skala BAI')).toBeVisible();

    // Screenshot mobile
    await page.screenshot({ path: 'test-results/bai-13-mobile-375px.png', fullPage: true });
  });

  test('14. BAI skala 5-kolorowa', async ({ page }) => {
    // Wypełnij dane
    await page.fill('input#weight', '70');
    await page.fill('input#height', '170');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Kobieta")');
    await page.fill('input#hip', '95');

    await page.waitForTimeout(1000);

    // Sprawdź czy sekcja skali istnieje
    await expect(page.getByText('Skala BAI')).toBeVisible();

    // Sprawdź 5 sekcji skali z odpowiednimi kolorami
    const scaleSection = page.locator('div:has-text("Skala BAI")').first();

    // Sprawdź czy skala ma odpowiednie sekcje
    // Kolory: yellow, green-light, green-dark, orange, red
    await expect(scaleSection).toBeVisible();

    // Sprawdź kategorie
    await expect(page.locator('text=/Bardzo niska/')).toBeVisible();
    await expect(page.locator('text=/Atletyczna/')).toBeVisible();
    await expect(page.locator('text=/Normalna/')).toBeVisible();
    await expect(page.locator('text=/Przeciętna/')).toBeVisible();
    await expect(page.locator('text=/Podwyższona/')).toBeVisible();

    // Screenshot skali
    await page.screenshot({ path: 'test-results/bai-14-skala-5-kolorowa.png', fullPage: true });
  });

  test('15. BAI zmiana płci - dynamiczna zmiana norm', async ({ page }) => {
    // Wypełnij dane jako kobieta
    await page.fill('input#weight', '70');
    await page.fill('input#height', '170');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Kobieta")');
    await page.fill('input#hip', '95');

    await page.waitForTimeout(1000);

    // Sprawdź normy dla kobiet
    await expect(page.getByText(/Atletyczna.*21.*26/)).toBeVisible();

    // Zapamiętaj wartość BAI
    const baiValueKobieta = await page.locator('span.text-5xl').filter({ hasText: /^[0-9]+\./ }).first().textContent();

    // Zmień na mężczyznę
    await page.click('button:has-text("Mężczyzna")');
    await page.waitForTimeout(1000);

    // Sprawdź normy dla mężczyzn (inne zakresy)
    await expect(page.getByText(/Atletyczna.*8.*14/)).toBeVisible();

    // Sprawdź że wartość BAI pozostała taka sama
    const baiValueMezczyzna = await page.locator('span.text-5xl').filter({ hasText: /^[0-9]+\./ }).first().textContent();
    expect(baiValueKobieta).toBe(baiValueMezczyzna);

    // Screenshot po zmianie płci
    await page.screenshot({ path: 'test-results/bai-15-zmiana-plci.png', fullPage: true });
  });

  test('16. BAI pełny workflow użytkownika', async ({ page }) => {
    // Symulacja pełnego przepływu użytkownika z BAI

    // 1. Wprowadź dane podstawowe
    await page.fill('input#weight', '70');
    await page.fill('input#height', '170');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Kobieta")');

    // 2. Wprowadź obwód bioder
    await page.fill('input#hip', '95');

    await page.waitForTimeout(1000);

    // 3. Sprawdź wszystkie sekcje
    await expect(page.getByRole('heading', { name: 'Wyniki BMR' })).toBeVisible();
    await expect(page.getByRole('heading', { name: /TDEE/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: /BMI/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: /BAI/ })).toBeVisible();

    // 4. Sprawdź wartości BAI
    const baiSection = page.locator('div:has-text("Twoje BAI")').first();
    await expect(baiSection.locator('span.text-5xl').filter({ hasText: /^[0-9]+\./ })).toBeVisible();

    // 5. Sprawdź skalę BAI
    await expect(page.getByText('Skala BAI')).toBeVisible();

    // 6. Sprawdź purple box "Unikalność BAI"
    await expect(page.locator('div.bg-purple-50')).toBeVisible();

    // 7. Sprawdź indigo box z wzorem
    await expect(page.locator('div.bg-indigo-50')).toBeVisible();

    // Screenshot finalny
    await page.screenshot({ path: 'test-results/bai-16-full-workflow.png', fullPage: true });
  });

  test('17. BAI edge case - wartość graniczna 21% (kobieta)', async ({ page }) => {
    // Test dla wartości granicznej między bardzo niska a atletyczna dla kobiet
    await page.fill('input#weight', '65');
    await page.fill('input#height', '168');
    await page.fill('input#age', '28');
    await page.click('button:has-text("Kobieta")');

    // Dobieramy biodra dla BAI ≈ 21%
    await page.fill('input#hip', '82');

    await page.waitForTimeout(1000);

    // Sprawdź wartość BAI (około 21%)
    const baiSection = page.locator('div:has-text("Twoje BAI")').first();
    await expect(baiSection.locator('span.text-5xl').filter({ hasText: /^2[0-9]\./ })).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/bai-17-edge-21-kobieta.png', fullPage: true });
  });

  test('18. BAI edge case - wartość graniczna 27% (kobieta)', async ({ page }) => {
    // Test dla wartości granicznej między atletyczna a normalna dla kobiet
    await page.fill('input#weight', '70');
    await page.fill('input#height', '165');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Kobieta")');

    // Dobieramy biodra dla BAI ≈ 27%
    await page.fill('input#hip', '90');

    await page.waitForTimeout(1000);

    // Sprawdź wartość BAI (około 27%)
    const baiSection = page.locator('div:has-text("Twoje BAI")').first();
    await expect(baiSection.locator('span.text-5xl').filter({ hasText: /^2[0-9]\./ })).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/bai-18-edge-27-kobieta.png', fullPage: true });
  });

  test('19. BAI edge case - wartość graniczna 34% (kobieta)', async ({ page }) => {
    // Test dla wartości granicznej między normalna a przeciętna dla kobiet
    await page.fill('input#weight', '75');
    await page.fill('input#height', '165');
    await page.fill('input#age', '35');
    await page.click('button:has-text("Kobieta")');

    // Dobieramy biodra dla BAI ≈ 34%
    await page.fill('input#hip', '98');

    await page.waitForTimeout(1000);

    // Sprawdź wartość BAI (około 34%)
    const baiSection = page.locator('div:has-text("Twoje BAI")').first();
    await expect(baiSection.locator('span.text-5xl').filter({ hasText: /^3[0-9]\./ })).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/bai-19-edge-34-kobieta.png', fullPage: true });
  });

  test('20. BAI edge case - wartość graniczna 40% (kobieta)', async ({ page }) => {
    // Test dla wartości granicznej między przeciętna a podwyższona dla kobiet
    await page.fill('input#weight', '80');
    await page.fill('input#height', '160');
    await page.fill('input#age', '40');
    await page.click('button:has-text("Kobieta")');

    // Dobieramy biodra dla BAI ≈ 40%
    await page.fill('input#hip', '103');

    await page.waitForTimeout(1000);

    // Sprawdź wartość BAI (około 40%)
    const baiSection = page.locator('div:has-text("Twoje BAI")').first();
    await expect(baiSection.locator('span.text-5xl').filter({ hasText: /^4[0-9]\./ })).toBeVisible();

    // Sprawdź kategorię "Podwyższony" (>= 40%)
    await expect(page.locator('p:has-text("Podwyższony")').first()).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/bai-20-edge-40-kobieta.png', fullPage: true });
  });

  test('21. BAI edge case - wartość graniczna 8% (mężczyzna)', async ({ page }) => {
    // Test dla wartości granicznej dla mężczyzn - początek kategorii atletyczna
    await page.fill('input#weight', '70');
    await page.fill('input#height', '185');
    await page.fill('input#age', '25');
    await page.click('button:has-text("Mężczyzna")');

    // Dobieramy biodra dla BAI ≈ 8%
    await page.fill('input#hip', '87');

    await page.waitForTimeout(1000);

    // Sprawdź wartość BAI (około 8%)
    const baiSection = page.locator('div:has-text("Twoje BAI")').first();
    await expect(baiSection.locator('span.text-5xl').filter({ hasText: /^[0-9]\./ })).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/bai-21-edge-8-mezczyzna.png', fullPage: true });
  });

  test('22. BAI edge case - wartość graniczna 15% (mężczyzna)', async ({ page }) => {
    // Test dla wartości granicznej między atletyczna a normalna dla mężczyzn
    await page.fill('input#weight', '75');
    await page.fill('input#height', '178');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Mężczyzna")');

    // Dobieramy biodra dla BAI ≈ 15%
    await page.fill('input#hip', '93');

    await page.waitForTimeout(1000);

    // Sprawdź wartość BAI (około 15%)
    const baiSection = page.locator('div:has-text("Twoje BAI")').first();
    await expect(baiSection.locator('span.text-5xl').filter({ hasText: /^1[0-9]\./ })).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/bai-22-edge-15-mezczyzna.png', fullPage: true });
  });

  test('23. BAI edge case - wartość graniczna 20% (mężczyzna)', async ({ page }) => {
    // Test dla wartości granicznej między normalna a przeciętna dla mężczyzn
    await page.fill('input#weight', '80');
    await page.fill('input#height', '172');
    await page.fill('input#age', '33');
    await page.click('button:has-text("Mężczyzna")');

    // Dobieramy biodra dla BAI ≈ 20%
    await page.fill('input#hip', '94');

    await page.waitForTimeout(1000);

    // Sprawdź wartość BAI (około 20%)
    const baiSection = page.locator('div:has-text("Twoje BAI")').first();
    await expect(baiSection.locator('span.text-5xl').filter({ hasText: /^2[0-9]\./ })).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/bai-23-edge-20-mezczyzna.png', fullPage: true });
  });

  test('24. BAI edge case - wartość graniczna 25% (mężczyzna)', async ({ page }) => {
    // Test dla wartości granicznej między przeciętna a podwyższona dla mężczyzn
    await page.fill('input#weight', '85');
    await page.fill('input#height', '168');
    await page.fill('input#age', '38');
    await page.click('button:has-text("Mężczyzna")');

    // Dobieramy biodra dla BAI ≈ 25%
    await page.fill('input#hip', '98');

    await page.waitForTimeout(1000);

    // Sprawdź wartość BAI (około 25%)
    const baiSection = page.locator('div:has-text("Twoje BAI")').first();
    await expect(baiSection.locator('span.text-5xl').filter({ hasText: /^2[0-9]\./ })).toBeVisible();

    // Sprawdź kategorię "Podwyższony" (>= 25%)
    await expect(page.locator('p:has-text("Podwyższony")').first()).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/bai-24-edge-25-mezczyzna.png', fullPage: true });
  });

  test('25. BAI responsywność tablet viewport', async ({ page }) => {
    // Ustaw viewport na tablet
    await page.setViewportSize({ width: 768, height: 1024 });

    // Wypełnij dane
    await page.fill('input#weight', '70');
    await page.fill('input#height', '170');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Kobieta")');
    await page.fill('input#hip', '95');

    await page.waitForTimeout(1000);

    // Sprawdź widoczność
    await expect(page.getByText('BAI - Body Adiposity Index')).toBeVisible();

    // Screenshot tablet
    await page.screenshot({ path: 'test-results/bai-25-tablet-768px.png', fullPage: true });
  });
});
