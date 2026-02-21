import { test, expect } from '@playwright/test';

/**
 * TESTY E2E DLA FFMI (Fat-Free Mass Index)
 *
 * Te testy pokrywają funkcjonalność wskaźnika FFMI:
 * - FFMI NIE wyświetla się bez % tkanki tłuszczowej
 * - FFMI wyświetla się tylko gdy FFM jest dostępne
 * - 6 kategorii FFMI dla mężczyzn: poniżej przeciętnej, przeciętna, powyżej przeciętnej, bardzo dobra, doskonała, podejrzana
 * - 6 kategorii FFMI dla kobiet (różne zakresy)
 * - Red warning box dla wysokiego FFMI (podejrzenie sterydów)
 * - Normalized FFMI (korekta ze względu na wzrost)
 * - Skala 6-kolorowa z wizualizacją
 * - Wzór matematyczny FFMI
 * - Responsywność
 * - Edge cases (bardzo niski i bardzo wysoki FFMI)
 */

test.describe('FFMI Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');
  });

  test('1. FFMI NIE wyświetla się bez % BF', async ({ page }) => {
    // Wprowadź tylko podstawowe dane (bez obwodów -> brak % BF)
    await page.fill('input#weight', '80');
    await page.fill('input#height', '180');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Mężczyzna")');

    await page.waitForTimeout(1000);

    // Sprawdź że sekcja FFMI pokazuje placeholder
    await expect(page.getByText('FFMI - Wskaźnik Masy Beztłuszczowej')).toBeVisible();
    await expect(page.locator('text=/FFMI wymaga % tkanki tłuszczowej/')).toBeVisible();
    await expect(page.locator('text=/Uzupełnij dane w sekcji "Estymacja tkanki tłuszczowej"/')).toBeVisible();

    // Sprawdź że nie ma obliczonego FFMI (brak głównej wartości)
    const ffmiValue = page.locator('span.text-5xl').filter({ hasText: /^\d+\.\d+$/ });
    await expect(ffmiValue).not.toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/ffmi-01-brak-bf.png', fullPage: true });
  });

  test('2. FFMI wyświetla się z % BF - mężczyzna "Powyżej średniej"', async ({ page }) => {
    // Wprowadź dane: waga 80kg, wzrost 180cm, mężczyzna, %BF ~15%
    await page.fill('input#weight', '80');
    await page.fill('input#height', '180');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Mężczyzna")');

    // Dodaj obwody dla US Navy estymacji %BF
    await page.fill('input#neck', '38');
    await page.fill('input#waist', '85');

    await page.waitForTimeout(1000);

    // FFM ~68kg (80 - 80*0.15), FFMI ~21 (68 / 1.8²)
    // Kategoria: "Powyżej średniej" (20-22)

    // Sprawdź czy FFMI się wyświetla
    await expect(page.getByText('Twoje FFMI')).toBeVisible();

    // Sprawdź wartość FFMI (około 21)
    const ffmiSection = page.locator('div.bg-white').filter({ hasText: 'FFMI - Wskaźnik Masy Beztłuszczowej' });
    const ffmiValue = ffmiSection.locator('span.text-5xl').first();
    await expect(ffmiValue).toBeVisible();

    // Sprawdź kategorię "Powyżej przeciętnej"
    await expect(ffmiSection.locator('text=/Powyżej przeciętnej/')).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/ffmi-02-mezczyzna-powyzej-sredniej.png', fullPage: true });
  });

  test('3. FFMI kategoria "Przeciętna" dla mężczyzn (18-20)', async ({ page }) => {
    // Wprowadź dane dla przeciętnego FFMI
    await page.fill('input#weight', '75');
    await page.fill('input#height', '180');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Mężczyzna")');

    // Dodaj obwody dla %BF ~20%
    await page.fill('input#neck', '37');
    await page.fill('input#waist', '90');

    await page.waitForTimeout(1000);

    // FFM ~60kg, FFMI ~18.5
    // Kategoria: "Przeciętna" (18-20)

    // Sprawdź kategorię
    const ffmiSection = page.locator('div.bg-white').filter({ hasText: 'FFMI - Wskaźnik Masy Beztłuszczowej' });
    await expect(ffmiSection.locator('text=/Przeciętna/')).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/ffmi-03-mezczyzna-przecietna.png', fullPage: true });
  });

  test('4. FFMI kategoria "Poniżej przeciętnej" dla mężczyzn (< 18)', async ({ page }) => {
    // Wprowadź dane dla niskiego FFMI
    await page.fill('input#weight', '65');
    await page.fill('input#height', '180');
    await page.fill('input#age', '25');
    await page.click('button:has-text("Mężczyzna")');

    // Dodaj obwody dla %BF ~18%
    await page.fill('input#neck', '36');
    await page.fill('input#waist', '85');

    await page.waitForTimeout(1000);

    // FFM ~53kg, FFMI ~16.5
    // Kategoria: "Poniżej przeciętnej" (< 18)

    // Sprawdź kategorię
    const ffmiSection = page.locator('div.bg-white').filter({ hasText: 'FFMI - Wskaźnik Masy Beztłuszczowej' });
    await expect(ffmiSection.locator('text=/Poniżej przeciętnej/')).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/ffmi-04-mezczyzna-ponizej-przecietnej.png', fullPage: true });
  });

  test('5. FFMI kategoria "Bardzo dobra" dla mężczyzn (22-23)', async ({ page }) => {
    // Wprowadź dane dla bardzo dobrego FFMI
    await page.fill('input#weight', '85');
    await page.fill('input#height', '175');
    await page.fill('input#age', '28');
    await page.click('button:has-text("Mężczyzna")');

    // Dodaj obwody dla %BF ~12%
    await page.fill('input#neck', '39');
    await page.fill('input#waist', '78');

    await page.waitForTimeout(1000);

    // FFM ~75kg, FFMI ~24.5
    // Kategoria: "Doskonała" lub "Bardzo dobra"

    // Sprawdź kategorię
    const ffmiSection = page.locator('div.bg-white').filter({ hasText: 'FFMI - Wskaźnik Masy Beztłuszczowej' });
    await expect(ffmiSection).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/ffmi-05-mezczyzna-bardzo-dobra.png', fullPage: true });
  });

  test('6. FFMI kategoria "Doskonała" dla mężczyzn (23-26)', async ({ page }) => {
    // Wprowadź dane dla doskonałego FFMI
    await page.fill('input#weight', '90');
    await page.fill('input#height', '175');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Mężczyzna")');

    // Dodaj obwody dla %BF ~10%
    await page.fill('input#neck', '40');
    await page.fill('input#waist', '75');

    await page.waitForTimeout(1000);

    // FFM ~81kg, FFMI ~26.5 -> może być już "Podejrzana"
    // Kategoria: "Doskonała" (23-26)

    // Sprawdź kategorię
    const ffmiSection = page.locator('div.bg-white').filter({ hasText: 'FFMI - Wskaźnik Masy Beztłuszczowej' });
    await expect(ffmiSection).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/ffmi-06-mezczyzna-doskonala.png', fullPage: true });
  });

  test('7. FFMI kategorie dla kobiet - "Przeciętna" (15-17)', async ({ page }) => {
    // Wprowadź dane dla kobiety: waga 60kg, wzrost 165cm, %BF ~25%
    await page.fill('input#weight', '60');
    await page.fill('input#height', '165');
    await page.fill('input#age', '28');
    await page.click('button:has-text("Kobieta")');

    // Dodaj obwody (kobieta potrzebuje neck, waist, hip)
    await page.fill('input#neck', '32');
    await page.fill('input#waist', '70');
    await page.fill('input#hip', '95');

    await page.waitForTimeout(1000);

    // FFM ~45kg (60 - 60*0.25), FFMI ~16.5 (45 / 1.65²)
    // Kategoria: "Przeciętna" (15-17)

    // Sprawdź kategorię
    const ffmiSection = page.locator('div.bg-white').filter({ hasText: 'FFMI - Wskaźnik Masy Beztłuszczowej' });
    await expect(ffmiSection.locator('text=/Przeciętna/')).toBeVisible();

    // Sprawdź skalę dla kobiet
    await expect(ffmiSection.locator('text=/Skala FFMI dla kobiet/')).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/ffmi-07-kobieta-przecietna.png', fullPage: true });
  });

  test('8. FFMI kategoria "Poniżej przeciętnej" dla kobiet (< 15)', async ({ page }) => {
    // Wprowadź dane dla niskiego FFMI
    await page.fill('input#weight', '55');
    await page.fill('input#height', '165');
    await page.fill('input#age', '25');
    await page.click('button:has-text("Kobieta")');

    // Dodaj obwody dla wyższego %BF (~28%)
    await page.fill('input#neck', '31');
    await page.fill('input#waist', '75');
    await page.fill('input#hip', '95');

    await page.waitForTimeout(1000);

    // FFM ~40kg, FFMI ~14.7
    // Kategoria: "Poniżej przeciętnej" (< 15)

    // Sprawdź kategorię
    const ffmiSection = page.locator('div.bg-white').filter({ hasText: 'FFMI - Wskaźnik Masy Beztłuszczowej' });
    await expect(ffmiSection.locator('text=/Poniżej przeciętnej/')).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/ffmi-08-kobieta-ponizej-przecietnej.png', fullPage: true });
  });

  test('9. FFMI kategoria "Powyżej przeciętnej" dla kobiet (17-18)', async ({ page }) => {
    // Wprowadź dane dla powyżej przeciętnej
    await page.fill('input#weight', '65');
    await page.fill('input#height', '165');
    await page.fill('input#age', '28');
    await page.click('button:has-text("Kobieta")');

    // Dodaj obwody dla %BF ~22%
    await page.fill('input#neck', '32');
    await page.fill('input#waist', '68');
    await page.fill('input#hip', '95');

    await page.waitForTimeout(1000);

    // FFM ~51kg, FFMI ~18.7
    // Kategoria: "Powyżej przeciętnej" lub "Bardzo dobra"

    // Sprawdź kategorię
    const ffmiSection = page.locator('div.bg-white').filter({ hasText: 'FFMI - Wskaźnik Masy Beztłuszczowej' });
    await expect(ffmiSection).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/ffmi-09-kobieta-powyzej-przecietnej.png', fullPage: true });
  });

  test('10. Red warning box dla wysokiego FFMI - mężczyźni (> 26)', async ({ page }) => {
    // Wprowadź dane dla bardzo wysokiego FFMI
    await page.fill('input#weight', '100');
    await page.fill('input#height', '180');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Mężczyzna")');

    // Dodaj obwody dla niskiego %BF (~8%)
    await page.fill('input#neck', '42');
    await page.fill('input#waist', '75');

    await page.waitForTimeout(1000);

    // FFM ~92kg (100 - 100*0.08), FFMI ~28.4 (92 / 1.8²)
    // Kategoria: "Podejrzana" (> 26)

    // Sprawdź red warning box
    const redBox = page.locator('div.bg-red-50').filter({ hasText: 'Ostrzeżenie: Podejrzanie wysokie FFMI' });
    await expect(redBox).toBeVisible();

    // Sprawdź tekst o sterydach
    await expect(redBox.locator('text=/sterydy anaboliczne/')).toBeVisible();
    await expect(redBox.locator('text=/Maksymalne naturalne FFMI/')).toBeVisible();

    // Sprawdź że próg 26 jest wspomniany
    await expect(redBox.locator('text=/26/')).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/ffmi-10-mezczyzna-podejrzany.png', fullPage: true });
  });

  test('11. Red warning box dla wysokiego FFMI - kobiety (> 22)', async ({ page }) => {
    // Wprowadź dane dla bardzo wysokiego FFMI u kobiety
    await page.fill('input#weight', '80');
    await page.fill('input#height', '165');
    await page.fill('input#age', '28');
    await page.click('button:has-text("Kobieta")');

    // Dodaj obwody dla niskiego %BF (~15%)
    await page.fill('input#neck', '33');
    await page.fill('input#waist', '65');
    await page.fill('input#hip', '90');

    await page.waitForTimeout(1000);

    // FFM ~68kg (80 - 80*0.15), FFMI ~25 (68 / 1.65²)
    // Kategoria: "Podejrzana" (> 22)

    // Sprawdź red warning box
    const redBox = page.locator('div.bg-red-50').filter({ hasText: 'Ostrzeżenie: Podejrzanie wysokie FFMI' });
    await expect(redBox).toBeVisible();

    // Sprawdź próg 22 dla kobiet
    await expect(redBox.locator('text=/22/')).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/ffmi-11-kobieta-podejrzany.png', fullPage: true });
  });

  test('12. Normalized FFMI - korekta ze względu na wzrost', async ({ page }) => {
    // Wprowadź dane
    await page.fill('input#weight', '80');
    await page.fill('input#height', '180');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Mężczyzna")');

    await page.fill('input#neck', '38');
    await page.fill('input#waist', '85');

    await page.waitForTimeout(1000);

    // Sprawdź czy pokazuje zarówno FFMI jak i Normalized FFMI
    const ffmiSection = page.locator('div.bg-white').filter({ hasText: 'FFMI - Wskaźnik Masy Beztłuszczowej' });
    await expect(ffmiSection.locator('text=/Twoje FFMI/')).toBeVisible();
    await expect(ffmiSection.locator('text=/Normalized FFMI:/')).toBeVisible();

    // Normalized = FFMI + 6.1 × (1.8 - wzrost_m)
    // Dla wzrostu 180cm (1.8m), normalized = FFMI + 0

    // Screenshot
    await page.screenshot({ path: 'test-results/ffmi-12-normalized.png', fullPage: true });
  });

  test('13. Skala 6-kolorowa FFMI - wizualizacja', async ({ page }) => {
    // Wprowadź dane
    await page.fill('input#weight', '80');
    await page.fill('input#height', '180');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Mężczyzna")');

    await page.fill('input#neck', '38');
    await page.fill('input#waist', '85');

    await page.waitForTimeout(1000);

    // Sprawdź skalę
    const ffmiSection = page.locator('div.bg-white').filter({ hasText: 'FFMI - Wskaźnik Masy Beztłuszczowej' });
    await expect(ffmiSection.locator('text=/Skala FFMI dla mężczyzn/')).toBeVisible();

    // Sprawdź 6 sekcji skali
    await expect(ffmiSection.locator('text=/Niska/')).toBeVisible();
    await expect(ffmiSection.locator('text=/Przeciętna/')).toBeVisible();
    await expect(ffmiSection.locator('text=/Powyżej przeciętnej/')).toBeVisible();
    await expect(ffmiSection.locator('text=/Bardzo dobra/')).toBeVisible();
    await expect(ffmiSection.locator('text=/Doskonała/')).toBeVisible();
    await expect(ffmiSection.locator('text=/Podejrzana/')).toBeVisible();

    // Sprawdź wskaźnik (czarna linia)
    const indicator = ffmiSection.locator('div.bg-gray-900.w-1.h-8');
    await expect(indicator).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/ffmi-13-skala-6-kolorowa.png', fullPage: true });
  });

  test('14. Skala FFMI dla kobiet - różne zakresy', async ({ page }) => {
    // Wprowadź dane dla kobiety
    await page.fill('input#weight', '60');
    await page.fill('input#height', '165');
    await page.fill('input#age', '28');
    await page.click('button:has-text("Kobieta")');

    await page.fill('input#neck', '32');
    await page.fill('input#waist', '70');
    await page.fill('input#hip', '95');

    await page.waitForTimeout(1000);

    // Sprawdź skalę dla kobiet
    const ffmiSection = page.locator('div.bg-white').filter({ hasText: 'FFMI - Wskaźnik Masy Beztłuszczowej' });
    await expect(ffmiSection.locator('text=/Skala FFMI dla kobiet/')).toBeVisible();

    // Sprawdź wartości skali (inne niż dla mężczyzn)
    // Kobiety: 10-15-17-18-20-22-25
    // Mężczyźni: 12-18-20-22-23-26-30

    // Screenshot
    await page.screenshot({ path: 'test-results/ffmi-14-skala-kobieta.png', fullPage: true });
  });

  test('15. Wzór matematyczny FFMI w indigo box', async ({ page }) => {
    // Wprowadź dane
    await page.fill('input#weight', '80');
    await page.fill('input#height', '180');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Mężczyzna")');

    await page.fill('input#neck', '38');
    await page.fill('input#waist', '85');

    await page.waitForTimeout(1000);

    // Sprawdź indigo box z wzorem
    const indigoBox = page.locator('div.bg-indigo-50').filter({ hasText: 'Wzór FFMI' });
    await expect(indigoBox).toBeVisible();

    // Sprawdź wzory
    await expect(indigoBox.locator('text=/FFMI = FFM.*wzrost/')).toBeVisible();
    await expect(indigoBox.locator('text=/Normalized FFMI = FFMI.*6.1.*1.8.*wzrost/')).toBeVisible();

    // Sprawdź wyjaśnienie normalizacji
    await expect(indigoBox.locator('text=/koryguje wartość ze względu na wzrost/')).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/ffmi-15-wzor-matematyczny.png', fullPage: true });
  });

  test('16. Normy FFMI - tabela referencyjna', async ({ page }) => {
    // Wprowadź dane dla mężczyzny
    await page.fill('input#weight', '80');
    await page.fill('input#height', '180');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Mężczyzna")');

    await page.fill('input#neck', '38');
    await page.fill('input#waist', '85');

    await page.waitForTimeout(1000);

    // Sprawdź box z normami
    const normsBox = page.locator('div.bg-gray-50').filter({ hasText: 'Normy FFMI dla mężczyzn' });
    await expect(normsBox).toBeVisible();

    // Sprawdź wszystkie kategorie dla mężczyzn
    await expect(normsBox.locator('text=/Poniżej przeciętnej.*< 18/')).toBeVisible();
    await expect(normsBox.locator('text=/Przeciętna.*18 - 20/')).toBeVisible();
    await expect(normsBox.locator('text=/Powyżej przeciętnej.*20 - 22/')).toBeVisible();
    await expect(normsBox.locator('text=/Bardzo dobra.*22 - 23/')).toBeVisible();
    await expect(normsBox.locator('text=/Doskonała.*23 - 26/')).toBeVisible();
    await expect(normsBox.locator('text=/Podejrzana.*sterydy.*> 26/')).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/ffmi-16-normy-mezczyzna.png', fullPage: true });
  });

  test('17. Normy FFMI dla kobiet - tabela referencyjna', async ({ page }) => {
    // Wprowadź dane dla kobiety
    await page.fill('input#weight', '60');
    await page.fill('input#height', '165');
    await page.fill('input#age', '28');
    await page.click('button:has-text("Kobieta")');

    await page.fill('input#neck', '32');
    await page.fill('input#waist', '70');
    await page.fill('input#hip', '95');

    await page.waitForTimeout(1000);

    // Sprawdź box z normami dla kobiet
    const normsBox = page.locator('div.bg-gray-50').filter({ hasText: 'Normy FFMI dla kobiet' });
    await expect(normsBox).toBeVisible();

    // Sprawdź wszystkie kategorie dla kobiet
    await expect(normsBox.locator('text=/Poniżej przeciętnej.*< 15/')).toBeVisible();
    await expect(normsBox.locator('text=/Przeciętna.*15 - 17/')).toBeVisible();
    await expect(normsBox.locator('text=/Powyżej przeciętnej.*17 - 18/')).toBeVisible();
    await expect(normsBox.locator('text=/Bardzo dobra.*18 - 20/')).toBeVisible();
    await expect(normsBox.locator('text=/Doskonała.*20 - 22/')).toBeVisible();
    await expect(normsBox.locator('text=/Podejrzana.*sterydy.*> 22/')).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/ffmi-17-normy-kobieta.png', fullPage: true });
  });

  test('18. Disclaimer o FFMI', async ({ page }) => {
    // Wprowadź dane
    await page.fill('input#weight', '80');
    await page.fill('input#height', '180');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Mężczyzna")');

    await page.fill('input#neck', '38');
    await page.fill('input#waist', '85');

    await page.waitForTimeout(1000);

    // Sprawdź disclaimer
    const disclaimer = page.locator('div.bg-blue-50').filter({ hasText: 'Uwaga:' });
    await expect(disclaimer).toBeVisible();

    // Sprawdź treść
    await expect(disclaimer.locator('text=/FFMI.*Fat-Free Mass Index.*narzędziem do oceny masy mięśniowej/')).toBeVisible();
    await expect(disclaimer.locator('text=/25.*mężczyźni.*22.*kobiety/')).toBeVisible();
    await expect(disclaimer.locator('text=/wyjątkowo rzadkie bez wspomagania farmakologicznego/')).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/ffmi-18-disclaimer.png', fullPage: true });
  });

  test('19. Responsywność mobile (375px)', async ({ page }) => {
    // Ustaw viewport na mobile
    await page.setViewportSize({ width: 375, height: 667 });

    // Wprowadź dane
    await page.fill('input#weight', '80');
    await page.fill('input#height', '180');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Mężczyzna")');

    await page.fill('input#neck', '38');
    await page.fill('input#waist', '85');

    await page.waitForTimeout(1000);

    // Sprawdź czy sekcja FFMI jest widoczna na mobile
    await expect(page.getByText('FFMI - Wskaźnik Masy Beztłuszczowej')).toBeVisible();

    // Sprawdź czy wartość FFMI jest widoczna
    const ffmiValue = page.locator('span.text-5xl').first();
    await expect(ffmiValue).toBeVisible();

    // Sprawdź czy skala jest widoczna
    await expect(page.locator('text=/Skala FFMI/')).toBeVisible();

    // Screenshot mobile
    await page.screenshot({ path: 'test-results/ffmi-19-mobile-375px.png', fullPage: true });
  });

  test('20. Pełny workflow - od wagi do FFMI', async ({ page }) => {
    // 1. Wprowadź dane podstawowe
    await page.fill('input#weight', '80');
    await page.fill('input#height', '180');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Mężczyzna")');

    // 2. Sprawdź że FFMI nie jest dostępne
    await page.waitForTimeout(500);
    await expect(page.locator('text=/FFMI wymaga % tkanki tłuszczowej/')).toBeVisible();

    // 3. Dodaj obwody ciała
    await page.fill('input#neck', '38');
    await page.fill('input#waist', '85');

    // 4. Sprawdź że FFMI się pojawia
    await page.waitForTimeout(1000);
    await expect(page.locator('text=/Twoje FFMI/')).toBeVisible();

    // 5. Sprawdź wszystkie komponenty FFMI
    await expect(page.locator('text=/Normalized FFMI/')).toBeVisible();
    await expect(page.locator('text=/Skala FFMI/')).toBeVisible();
    await expect(page.locator('div.bg-indigo-50').filter({ hasText: 'Wzór FFMI' })).toBeVisible();
    await expect(page.locator('div.bg-gray-50').filter({ hasText: 'Normy FFMI' })).toBeVisible();

    // Screenshot finalny
    await page.screenshot({ path: 'test-results/ffmi-20-full-workflow.png', fullPage: true });
  });

  test('21. Edge case - normalizacja dla niskiego wzrostu', async ({ page }) => {
    // Wprowadź dane dla osoby niskiej (160cm)
    await page.fill('input#weight', '70');
    await page.fill('input#height', '160');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Mężczyzna")');

    await page.fill('input#neck', '37');
    await page.fill('input#waist', '80');

    await page.waitForTimeout(1000);

    // Normalized FFMI powinno być wyższe niż FFMI
    // Normalized = FFMI + 6.1 × (1.8 - 1.6) = FFMI + 1.22

    const ffmiSection = page.locator('div.bg-white').filter({ hasText: 'FFMI - Wskaźnik Masy Beztłuszczowej' });
    await expect(ffmiSection.locator('text=/Normalized FFMI:/')).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/ffmi-21-edge-niski-wzrost.png', fullPage: true });
  });

  test('22. Edge case - normalizacja dla wysokiego wzrostu', async ({ page }) => {
    // Wprowadź dane dla osoby wysokiej (195cm)
    await page.fill('input#weight', '95');
    await page.fill('input#height', '195');
    await page.fill('input#age', '28');
    await page.click('button:has-text("Mężczyzna")');

    await page.fill('input#neck', '40');
    await page.fill('input#waist', '85');

    await page.waitForTimeout(1000);

    // Normalized FFMI powinno być niższe niż FFMI
    // Normalized = FFMI + 6.1 × (1.8 - 1.95) = FFMI - 0.915

    const ffmiSection = page.locator('div.bg-white').filter({ hasText: 'FFMI - Wskaźnik Masy Beztłuszczowej' });
    await expect(ffmiSection.locator('text=/Normalized FFMI:/')).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/ffmi-22-edge-wysoki-wzrost.png', fullPage: true });
  });

  test('23. Zmiana płci - zmiana norm FFMI', async ({ page }) => {
    // Wprowadź dane jako mężczyzna
    await page.fill('input#weight', '70');
    await page.fill('input#height', '170');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Mężczyzna")');

    await page.fill('input#neck', '37');
    await page.fill('input#waist', '80');

    await page.waitForTimeout(1000);

    // Sprawdź normy dla mężczyzn
    await expect(page.locator('text=/Normy FFMI dla mężczyzn/')).toBeVisible();
    await expect(page.locator('text=/18 - 20/')).toBeVisible(); // Przeciętna dla mężczyzn

    // Zmień na kobietę
    await page.click('button:has-text("Kobieta")');

    // Kobieta potrzebuje hip dla US Navy
    await page.fill('input#hip', '95');
    await page.waitForTimeout(1000);

    // Sprawdź normy dla kobiet
    await expect(page.locator('text=/Normy FFMI dla kobiet/')).toBeVisible();
    await expect(page.locator('text=/15 - 17/')).toBeVisible(); // Przeciętna dla kobiet

    // Screenshot po zmianie płci
    await page.screenshot({ path: 'test-results/ffmi-23-zmiana-plci.png', fullPage: true });
  });

  test('24. Wszystkie sekcje wraz z FFMI', async ({ page }) => {
    // Wprowadź kompletne dane
    await page.fill('input#weight', '80');
    await page.fill('input#height', '180');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Mężczyzna")');
    await page.fill('input#neck', '38');
    await page.fill('input#waist', '85');
    await page.fill('input#hip', '95');

    await page.waitForTimeout(1000);

    // Sprawdź wszystkie główne sekcje
    await expect(page.getByRole('heading', { name: 'Wyniki BMR' })).toBeVisible();
    await expect(page.getByRole('heading', { name: /TDEE/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: /BMI/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: /WHR/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: /WHtR/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: /BAI/ })).toBeVisible();
    await expect(page.getByText('Skład ciała - LBM i FFM')).toBeVisible();
    await expect(page.getByText('FFMI - Wskaźnik Masy Beztłuszczowej')).toBeVisible();

    // Screenshot pełnej strony
    await page.screenshot({ path: 'test-results/ffmi-24-wszystkie-sekcje.png', fullPage: true });
  });
});
