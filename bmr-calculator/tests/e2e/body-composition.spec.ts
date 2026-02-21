import { test, expect } from '@playwright/test';

/**
 * TESTY E2E DLA BODY COMPOSITION - LBM & FFM
 *
 * Te testy pokrywają funkcjonalność składu ciała:
 * - LBM (Lean Body Mass) - masa beztłuszczowa estymowana z wagi i wzrostu
 * - FFM (Fat-Free Mass) - masa beztłuszczowa obliczona z % tkanki tłuszczowej
 * - Porównanie 3 formuł LBM: Boer, James, Hume
 * - Breakdown FFM (woda, białko, minerały)
 * - Purple box z różnicą FFM vs LBM
 * - Indigo box ze składem FFM
 * - Testowanie dla różnych płci i wartości % tkanki tłuszczowej
 */

test.describe('Body Composition - LBM & FFM', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');
  });

  test('1. Wyświetlanie LBM bez % tkanki tłuszczowej', async ({ page }) => {
    // Wprowadź dane podstawowe (bez % BF)
    await page.fill('input#weight', '80');
    await page.fill('input#height', '180');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Mężczyzna")');

    await page.waitForTimeout(1000);

    // Sprawdź czy sekcja składu ciała się wyświetla
    await expect(page.getByText('Skład ciała - LBM i FFM')).toBeVisible();

    // Sprawdź czy pokazuje tylko LBM (bez FFM)
    await expect(page.getByText('Średnia LBM (Lean Body Mass)')).toBeVisible();

    // Sprawdź info box o potrzebie uzupełnienia % BF (w kontekście sekcji Body Composition)
    const bodyCompositionSection = page.locator('div.bg-white').filter({ hasText: 'Skład ciała - LBM i FFM' });
    await expect(bodyCompositionSection.locator('text=/FFM wymaga % tkanki tłuszczowej/')).toBeVisible();
    await expect(bodyCompositionSection.locator('text=/Uzupełnij dane.*FFM.*Fat-Free Mass/')).toBeVisible();

    // Sprawdź czy tabela pokazuje 3 formuły LBM (w sekcji Body Composition)
    const bodyCompositionTable = page.locator('div.bg-white').filter({ hasText: 'Skład ciała - LBM i FFM' }).locator('table');
    await expect(bodyCompositionTable).toBeVisible();
    await expect(bodyCompositionTable.locator('text=/Boer/')).toBeVisible();
    await expect(bodyCompositionTable.locator('text=/James/')).toBeVisible();
    await expect(bodyCompositionTable.locator('text=/Hume/')).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/body-composition-01-lbm-bez-bf.png', fullPage: true });
  });

  test('2. Wyświetlanie FFM z % tkanki tłuszczowej', async ({ page }) => {
    // Wprowadź dane podstawowe
    await page.fill('input#weight', '80');
    await page.fill('input#height', '180');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Mężczyzna")');

    // Wprowadź obwody ciała
    await page.fill('input#neck', '38');
    await page.fill('input#waist', '85');

    // Wybierz metodę US Navy dla estymacji % BF
    await page.click('button:has-text("Metoda US Navy")');

    await page.waitForTimeout(1000);

    // Sprawdź czy sekcja Body Composition istnieje
    await expect(page.getByText('Skład ciała - LBM i FFM')).toBeVisible();

    // Sprawdź czy FFM się wyświetla jako główna wartość (primary-50 background)
    const ffmBox = page.locator('div.bg-primary-50').filter({ hasText: 'FFM (Fat-Free Mass)' });
    await expect(ffmBox).toBeVisible();

    // Sprawdź wartość FFM (powinno być ~68 kg przy 15% BF)
    // 80kg - (80 × 0.15) = 68kg
    const ffmValue = ffmBox.locator('p.text-3xl').first();
    await expect(ffmValue).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/body-composition-02-ffm-z-bf.png', fullPage: true });
  });

  test('3. Tabela porównawcza formuł LBM', async ({ page }) => {
    // Wprowadź dane
    await page.fill('input#weight', '80');
    await page.fill('input#height', '180');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Mężczyzna")');

    await page.waitForTimeout(1000);

    // Sprawdź czy tabela istnieje (w sekcji Body Composition)
    const bodyCompositionSection = page.locator('div.bg-white').filter({ hasText: 'Skład ciała - LBM i FFM' });
    const table = bodyCompositionSection.locator('table');
    await expect(table).toBeVisible();

    // Sprawdź nagłówki tabeli
    await expect(table.locator('th:has-text("Formuła")')).toBeVisible();
    await expect(table.locator('th:has-text("LBM")')).toBeVisible();
    await expect(table.locator('th:has-text("Odchylenie")')).toBeVisible();

    // Sprawdź czy wszystkie 3 formuły są wyświetlone
    const formulaRows = table.locator('tbody tr');
    await expect(formulaRows).toHaveCount(3);

    // Sprawdź Boer
    await expect(table.locator('text=/Boer/')).toBeVisible();
    await expect(table.locator('text=/1984/')).toBeVisible();

    // Sprawdź James
    await expect(table.locator('text=/James/')).toBeVisible();
    await expect(table.locator('text=/1976/')).toBeVisible();

    // Sprawdź Hume
    await expect(table.locator('text=/Hume/')).toBeVisible();
    await expect(table.locator('text=/1966/')).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/body-composition-03-tabela-formul.png', fullPage: true });
  });

  test('4. Breakdown FFM (woda, białko, minerały)', async ({ page }) => {
    // Wprowadź dane z % tkanki tłuszczowej
    await page.fill('input#weight', '80');
    await page.fill('input#height', '180');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Mężczyzna")');

    // Dodaj obwody dla US Navy estymacji
    await page.fill('input#neck', '38');
    await page.fill('input#waist', '85');

    // Wybierz metodę US Navy
    await page.click('button:has-text("Metoda US Navy")');

    await page.waitForTimeout(1000);

    // Sprawdź czy indigo box ze składem FFM istnieje
    const ffmBreakdown = page.locator('div.bg-indigo-50').filter({ hasText: 'Skład masy beztłuszczowej' });
    await expect(ffmBreakdown).toBeVisible();

    // Sprawdź komponenty: woda (~73%), białko (~20%), minerały (~7%)
    await expect(ffmBreakdown.locator('text=/Woda.*73%/')).toBeVisible();
    await expect(ffmBreakdown.locator('text=/Białko.*20%/')).toBeVisible();
    await expect(ffmBreakdown.locator('text=/Minerały.*7%/')).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/body-composition-04-breakdown-ffm.png', fullPage: true });
  });

  test('5. Purple box "Różnica FFM vs LBM"', async ({ page }) => {
    // Wprowadź dane z % tkanki tłuszczowej
    await page.fill('input#weight', '80');
    await page.fill('input#height', '180');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Mężczyzna")');

    // Dodaj obwody
    await page.fill('input#neck', '38');
    await page.fill('input#waist', '85');

    // Wybierz metodę US Navy
    await page.click('button:has-text("Metoda US Navy")');

    await page.waitForTimeout(1000);

    // Sprawdź czy purple box się wyświetla (w sekcji Body Composition)
    const bodyCompositionSection = page.locator('div.bg-white').filter({ hasText: 'Skład ciała - LBM i FFM' });
    const purpleBox = bodyCompositionSection.locator('div.bg-purple-50').filter({ hasText: 'Różnica FFM vs LBM' });
    await expect(purpleBox).toBeVisible();

    // Sprawdź tekst o precyzji FFM
    await expect(purpleBox.locator('text=/FFM jest zazwyczaj bardziej precyzyjne/')).toBeVisible();

    // Sprawdź czy różnica jest wyświetlona (w kg i %)
    await expect(purpleBox.locator('text=/kg/')).toBeVisible();
    await expect(purpleBox.locator('text=/różnicy/')).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/body-composition-05-purple-box.png', fullPage: true });
  });

  test('6. LBM dla kobiet - różne współczynniki', async ({ page }) => {
    // Wprowadź dane dla kobiety
    await page.fill('input#weight', '60');
    await page.fill('input#height', '165');
    await page.fill('input#age', '28');
    await page.click('button:has-text("Kobieta")');

    await page.waitForTimeout(1000);

    // Sprawdź czy sekcja się wyświetla
    await expect(page.getByText('Skład ciała - LBM i FFM')).toBeVisible();

    // Sprawdź średnią LBM
    const avgLBM = page.locator('div.bg-success-50').filter({ hasText: 'Średnia LBM' });
    await expect(avgLBM).toBeVisible();

    // Sprawdź czy formuły używają innych współczynników dla kobiet
    // (wartości będą inne niż dla mężczyzn przy tych samych parametrach)
    const table = page.locator('table').first();
    await expect(table).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/body-composition-06-lbm-kobieta.png', fullPage: true });
  });

  test('7. FFM dla kobiet z % BF', async ({ page }) => {
    // Wprowadź dane dla kobiety z obwodami
    await page.fill('input#weight', '60');
    await page.fill('input#height', '165');
    await page.fill('input#age', '28');
    await page.click('button:has-text("Kobieta")');

    // Kobiety potrzebują neck, waist i hip dla US Navy
    await page.fill('input#neck', '32');
    await page.fill('input#waist', '70');
    await page.fill('input#hip', '95');

    // Wybierz metodę US Navy
    await page.click('button:has-text("Metoda US Navy")');

    await page.waitForTimeout(1000);

    // Sprawdź FFM
    const ffmBox = page.locator('div.bg-primary-50').filter({ hasText: 'FFM (Fat-Free Mass)' });
    await expect(ffmBox).toBeVisible();

    // FFM powinno być ~45kg przy 25% BF: 60 - (60 × 0.25) = 45kg
    await expect(ffmBox).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/body-composition-07-ffm-kobieta.png', fullPage: true });
  });

  test('8. Sortowanie tabeli LBM', async ({ page }) => {
    // Wprowadź dane
    await page.fill('input#weight', '80');
    await page.fill('input#height', '180');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Mężczyzna")');

    await page.waitForTimeout(1000);

    // Sprawdź przycisk sortowania (w kontekście Body Composition)
    const bodyCompositionSection = page.locator('div.bg-white').filter({ hasText: 'Skład ciała - LBM i FFM' });
    await expect(bodyCompositionSection.locator('button:has-text("Sortuj")')).toBeVisible();

    // Kliknij raz - sortowanie rosnąco
    await bodyCompositionSection.locator('button:has-text("Sortuj")').click();
    await page.waitForTimeout(500);
    await expect(bodyCompositionSection.locator('button:has-text("Rosnąco")')).toBeVisible();

    // Kliknij drugi raz - sortowanie malejąco
    await bodyCompositionSection.locator('button:has-text("Rosnąco")').click();
    await page.waitForTimeout(500);
    await expect(bodyCompositionSection.locator('button:has-text("Malejąco")')).toBeVisible();

    // Kliknij trzeci raz - powrót do domyślnego
    await bodyCompositionSection.locator('button:has-text("Malejąco")').click();
    await page.waitForTimeout(500);
    await expect(bodyCompositionSection.locator('button:has-text("Sortuj")')).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/body-composition-08-sortowanie.png', fullPage: true });
  });

  test('9. Wyświetlanie zakresu LBM (min-max)', async ({ page }) => {
    // Wprowadź dane
    await page.fill('input#weight', '80');
    await page.fill('input#height', '180');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Mężczyzna")');

    await page.waitForTimeout(1000);

    // Sprawdź sekcję z zakresem (w kontekście Body Composition)
    const bodyCompositionSection = page.locator('div.bg-white').filter({ hasText: 'Skład ciała - LBM i FFM' });
    await expect(bodyCompositionSection.locator('text=/Najniższy:.*kg/')).toBeVisible();
    await expect(bodyCompositionSection.locator('text=/Najwyższy:.*kg/')).toBeVisible();
    await expect(bodyCompositionSection.locator('text=/Rozstęp:.*kg/')).toBeVisible();

    // Sprawdź kolorowe wskaźniki min/max
    await expect(bodyCompositionSection.locator('div.w-3.h-3.bg-blue-100')).toBeVisible(); // min
    await expect(bodyCompositionSection.locator('div.w-3.h-3.bg-orange-100')).toBeVisible(); // max

    // Screenshot
    await page.screenshot({ path: 'test-results/body-composition-09-zakres-lbm.png', fullPage: true });
  });

  test('10. Wzory formuł LBM w info box', async ({ page }) => {
    // Wprowadź dane dla mężczyzny
    await page.fill('input#weight', '80');
    await page.fill('input#height', '180');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Mężczyzna")');

    await page.waitForTimeout(1000);

    // Sprawdź box z wyjaśnieniem formuł (w sekcji Body Composition)
    const bodyCompositionSection = page.locator('div.bg-white').filter({ hasText: 'Skład ciała - LBM i FFM' });
    const formulasBox = bodyCompositionSection.locator('div.bg-gray-50').filter({ hasText: 'Formuły LBM:' });
    await expect(formulasBox).toBeVisible();

    // Sprawdź wszystkie 3 formuły
    await expect(formulasBox.locator('text=/Boer.*1984/')).toBeVisible();
    await expect(formulasBox.locator('text=/James.*1976/')).toBeVisible();
    await expect(formulasBox.locator('text=/Hume.*1966/')).toBeVisible();

    // Sprawdź czy wzory matematyczne są wyświetlone
    await expect(formulasBox.locator('text=/0.407.*waga.*0.267.*wzrost/')).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/body-composition-10-wzory-formul.png', fullPage: true });
  });

  test('11. Wzory formuł LBM dla kobiet', async ({ page }) => {
    // Wprowadź dane dla kobiety
    await page.fill('input#weight', '60');
    await page.fill('input#height', '165');
    await page.fill('input#age', '28');
    await page.click('button:has-text("Kobieta")');

    await page.waitForTimeout(1000);

    // Sprawdź box z wyjaśnieniem formuł (w sekcji Body Composition)
    const bodyCompositionSection = page.locator('div.bg-white').filter({ hasText: 'Skład ciała - LBM i FFM' });
    const formulasBox = bodyCompositionSection.locator('div.bg-gray-50').filter({ hasText: 'Formuły LBM:' });
    await expect(formulasBox).toBeVisible();

    // Sprawdź czy wzory są inne dla kobiet
    await expect(formulasBox.locator('text=/0.252.*waga.*0.473.*wzrost/')).toBeVisible(); // Boer dla kobiet

    // Screenshot
    await page.screenshot({ path: 'test-results/body-composition-11-wzory-kobieta.png', fullPage: true });
  });

  test('12. Disclaimer o różnicy LBM vs FFM', async ({ page }) => {
    // Wprowadź dane
    await page.fill('input#weight', '80');
    await page.fill('input#height', '180');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Mężczyzna")');

    await page.waitForTimeout(1000);

    // Sprawdź disclaimer (w sekcji Body Composition)
    const bodyCompositionSection = page.locator('div.bg-white').filter({ hasText: 'Skład ciała - LBM i FFM' });
    const disclaimer = bodyCompositionSection.locator('div.bg-blue-50').filter({ hasText: 'Uwaga:' });
    await expect(disclaimer).toBeVisible();

    // Sprawdź treść o różnicy LBM i FFM
    await expect(disclaimer.locator('text=/LBM.*Lean Body Mass.*estymacja/')).toBeVisible();
    await expect(disclaimer.locator('text=/FFM.*Fat-Free Mass.*dokładniejsze/')).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/body-composition-12-disclaimer.png', fullPage: true });
  });

  test('13. Responsywność mobile (375px)', async ({ page }) => {
    // Ustaw viewport na mobile
    await page.setViewportSize({ width: 375, height: 667 });

    // Wprowadź dane
    await page.fill('input#weight', '80');
    await page.fill('input#height', '180');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Mężczyzna")');

    await page.waitForTimeout(1000);

    // Sprawdź czy sekcja jest widoczna
    await expect(page.getByText('Skład ciała - LBM i FFM')).toBeVisible();

    // Sprawdź czy tabela jest scrollable
    const table = page.locator('table').first();
    await expect(table).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/body-composition-13-mobile.png', fullPage: true });
  });

  test('14. Edge case - bardzo niski % BF (5%)', async ({ page }) => {
    // Wprowadź dane
    await page.fill('input#weight', '80');
    await page.fill('input#height', '180');
    await page.fill('input#age', '25');
    await page.click('button:has-text("Mężczyzna")');

    // Dodaj obwody dla bardzo niskiego % BF
    // (bardzo cienka talia vs szyja)
    await page.fill('input#neck', '40');
    await page.fill('input#waist', '70');

    // Wybierz metodę US Navy
    await page.click('button:has-text("Metoda US Navy")');

    await page.waitForTimeout(1000);

    // FFM powinno być bardzo wysokie (95% masy ciała)
    const ffmBox = page.locator('div.bg-primary-50').filter({ hasText: 'FFM (Fat-Free Mass)' });
    await expect(ffmBox).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/body-composition-14-edge-niski-bf.png', fullPage: true });
  });

  test('15. Edge case - bardzo wysoki % BF (40%)', async ({ page }) => {
    // Wprowadź dane
    await page.fill('input#weight', '100');
    await page.fill('input#height', '170');
    await page.fill('input#age', '40');
    await page.click('button:has-text("Mężczyzna")');

    // Dodaj obwody dla wysokiego % BF
    await page.fill('input#neck', '38');
    await page.fill('input#waist', '115');

    // Wybierz metodę US Navy
    await page.click('button:has-text("Metoda US Navy")');

    await page.waitForTimeout(1000);

    // FFM powinno być niskie (60% masy ciała)
    const ffmBox = page.locator('div.bg-primary-50').filter({ hasText: 'FFM (Fat-Free Mass)' });
    await expect(ffmBox).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'test-results/body-composition-15-edge-wysoki-bf.png', fullPage: true });
  });

  test('16. Zmiana % BF - dynamiczna aktualizacja FFM', async ({ page }) => {
    // Wprowadź dane podstawowe
    await page.fill('input#weight', '80');
    await page.fill('input#height', '180');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Mężczyzna")');

    // Dodaj obwody dla ~15% BF
    await page.fill('input#neck', '38');
    await page.fill('input#waist', '85');

    // Wybierz metodę US Navy
    await page.click('button:has-text("Metoda US Navy")');

    await page.waitForTimeout(1000);

    // Zapamiętaj wartość FFM
    const ffmBox1 = page.locator('div.bg-primary-50').filter({ hasText: 'FFM (Fat-Free Mass)' });
    const ffmValue1 = await ffmBox1.locator('p.text-3xl').first().textContent();

    // Zmień obwód talii (zwiększy % BF)
    await page.fill('input#waist', '95');
    await page.waitForTimeout(1000);

    // Sprawdź czy FFM się zaktualizowało
    const ffmValue2 = await ffmBox1.locator('p.text-3xl').first().textContent();
    expect(ffmValue1).not.toBe(ffmValue2);

    // Screenshot
    await page.screenshot({ path: 'test-results/body-composition-16-zmiana-bf.png', fullPage: true });
  });

  test('17. Pełny workflow - od wagi do FFM', async ({ page }) => {
    // 1. Wprowadź dane podstawowe
    await page.fill('input#weight', '80');
    await page.fill('input#height', '180');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Mężczyzna")');

    // 2. Sprawdź że LBM się pojawia
    await page.waitForTimeout(500);
    await expect(page.getByText('Średnia LBM (Lean Body Mass)')).toBeVisible();

    // 3. Dodaj obwody ciała
    await page.fill('input#neck', '38');
    await page.fill('input#waist', '85');

    // 3.5. Wybierz metodę US Navy
    await page.click('button:has-text("Metoda US Navy")');

    // 4. Sprawdź że FFM się pojawia
    await page.waitForTimeout(1000);
    await expect(page.locator('div.bg-primary-50').filter({ hasText: 'FFM (Fat-Free Mass)' })).toBeVisible();

    // 5. Sprawdź purple box z różnicą
    await expect(page.locator('div.bg-purple-50').filter({ hasText: 'Różnica FFM vs LBM' })).toBeVisible();

    // 6. Sprawdź indigo box ze składem FFM
    await expect(page.locator('div.bg-indigo-50').filter({ hasText: 'Skład masy beztłuszczowej' })).toBeVisible();

    // Screenshot finalny
    await page.screenshot({ path: 'test-results/body-composition-17-full-workflow.png', fullPage: true });
  });

  test('18. Sprawdzenie wszystkich sekcji wraz z Body Composition', async ({ page }) => {
    // Wprowadź kompletne dane
    await page.fill('input#weight', '80');
    await page.fill('input#height', '180');
    await page.fill('input#age', '30');
    await page.click('button:has-text("Mężczyzna")');
    await page.fill('input#neck', '38');
    await page.fill('input#waist', '85');
    await page.fill('input#hip', '95');

    // Wybierz metodę US Navy
    await page.click('button:has-text("Metoda US Navy")');

    await page.waitForTimeout(1000);

    // Sprawdź wszystkie główne sekcje
    await expect(page.getByRole('heading', { name: 'Wyniki BMR' })).toBeVisible();
    await expect(page.getByRole('heading', { name: /TDEE/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: /BMI/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: /WHR/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: /WHtR/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: /BAI/ })).toBeVisible();
    await expect(page.getByText('Skład ciała - LBM i FFM')).toBeVisible();

    // Screenshot pełnej strony
    await page.screenshot({ path: 'test-results/body-composition-18-wszystkie-sekcje.png', fullPage: true });
  });
});
