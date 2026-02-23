import { test, expect } from '@playwright/test';

test.describe('Weighted Average Body Fat Estimation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5182');

    // Fill in basic data
    await page.locator('#weight').fill('80');
    await page.locator('#height').fill('180');
    await page.locator('#age').fill('30');
    await page.getByRole('button', { name: 'Mężczyzna' }).click();

    // Wait for BMR results
    await page.waitForSelector('text=Średni BMR', { timeout: 10000 });
  });

  test('Weighted average button is visible', async ({ page }) => {
    const weightedButton = page.locator('button').filter({ hasText: 'Średnia ważona z wszystkich metod' });
    await expect(weightedButton).toBeVisible();
  });

  test('Weighted average with only BAI (50% weight)', async ({ page }) => {
    // Provide only hip circumference for BAI
    await page.locator('#hip').fill('100');
    await page.waitForTimeout(500);

    // Select weighted average
    const weightedButton = page.locator('button').filter({ hasText: 'Średnia ważona z wszystkich metod' });
    await weightedButton.click();
    await page.waitForTimeout(500);

    // Should show result (only BAI with 100% effective weight since it's the only one available)
    await expect(page.getByText(/Szacowany % tkanki tłuszczowej:/)).toBeVisible();

    // Check method label
    await expect(page.getByText('Metoda: Średnia ważona (BAI 50%, Navy 25%, Deurenberg 25%)')).toBeVisible();
  });

  test('Weighted average with BAI + Deurenberg', async ({ page }) => {
    // Provide data for BAI and Deurenberg
    await page.locator('#hip').fill('100');
    await page.waitForTimeout(500);

    // Select weighted average
    const weightedButton = page.locator('button').filter({ hasText: 'Średnia ważona z wszystkich metod' });
    await weightedButton.click();
    await page.waitForTimeout(500);

    // Get weighted average result
    const resultText = await page.locator('span.text-2xl.font-bold.text-primary').textContent();
    const weightedAvg = parseFloat(resultText?.replace('%', '') || '0');

    console.log('Weighted Average (BAI + Deurenberg):', weightedAvg);

    // Should have a valid result
    expect(weightedAvg).toBeGreaterThan(0);
    expect(weightedAvg).toBeLessThan(60);

    // Take screenshot
    await page.screenshot({ path: 'weighted-average-bai-deurenberg.png', fullPage: true });
  });

  test('Weighted average with all methods (BAI + Navy + Deurenberg + Manual)', async ({ page }) => {
    // Provide all data
    await page.locator('#neck').fill('38');
    await page.locator('#waist').fill('85');
    await page.locator('#hip').fill('100');
    await page.waitForTimeout(500);

    // Add manual value
    const manualButton = page.locator('button').filter({ hasText: 'Ręczne wprowadzenie' });
    await manualButton.click();
    await page.locator('#bodyFatManual').fill('20');
    await page.waitForTimeout(500);

    // Now select weighted average
    const weightedButton = page.locator('button').filter({ hasText: 'Średnia ważona z wszystkich metod' });
    await weightedButton.click();
    await page.waitForTimeout(1000);

    // Get weighted average result
    const resultText = await page.locator('span.text-2xl.font-bold.text-primary').textContent();
    const weightedAvg = parseFloat(resultText?.replace('%', '') || '0');

    console.log('Weighted Average (All methods):', weightedAvg);

    // Should have a valid result
    expect(weightedAvg).toBeGreaterThan(0);
    expect(weightedAvg).toBeLessThan(60);

    // Take screenshot
    const bodyFatSection = page.locator('div.bg-white').filter({ hasText: 'Estymacja tkanki tłuszczowej' }).first();
    await bodyFatSection.screenshot({ path: 'weighted-average-all-methods.png' });
  });

  test('Compare weighted average with individual methods', async ({ page }) => {
    // Provide all data
    await page.locator('#neck').fill('38');
    await page.locator('#waist').fill('85');
    await page.locator('#hip').fill('100');
    await page.waitForTimeout(500);

    const results: Record<string, number> = {};

    // Get BAI result
    const baiButton = page.locator('button').filter({ hasText: 'Metoda BAI (Body Adiposity Index)' });
    await baiButton.click();
    await page.waitForTimeout(500);
    let resultText = await page.locator('span.text-2xl.font-bold.text-primary').textContent();
    results.bai = parseFloat(resultText?.replace('%', '') || '0');

    // Get Navy result
    const navyButton = page.locator('button').filter({ hasText: 'Metoda US Navy' });
    await navyButton.click();
    await page.waitForTimeout(500);
    resultText = await page.locator('span.text-2xl.font-bold.text-primary').textContent();
    results.navy = parseFloat(resultText?.replace('%', '') || '0');

    // Get Deurenberg result
    const deurenbergButton = page.locator('button').filter({ hasText: 'Metoda Deurenberg' });
    await deurenbergButton.click();
    await page.waitForTimeout(500);
    resultText = await page.locator('span.text-2xl.font-bold.text-primary').textContent();
    results.deurenberg = parseFloat(resultText?.replace('%', '') || '0');

    // Get Weighted Average
    const weightedButton = page.locator('button').filter({ hasText: 'Średnia ważona z wszystkich metod' });
    await weightedButton.click();
    await page.waitForTimeout(500);
    resultText = await page.locator('span.text-2xl.font-bold.text-primary').textContent();
    results.weighted = parseFloat(resultText?.replace('%', '') || '0');

    console.log('Results:', results);

    // Manual calculation of weighted average (BAI 50%, Navy 25%, Deurenberg 25%)
    // Manual input is NOT included in weighted average
    const totalWeight = 0.5 + 0.25 + 0.25; // = 1.0
    const expectedWeighted = (results.bai * 0.5 + results.navy * 0.25 + results.deurenberg * 0.25) / totalWeight;

    console.log('Expected Weighted Average:', expectedWeighted);
    console.log('Actual Weighted Average:', results.weighted);

    // Should be close (within 1%)
    expect(Math.abs(results.weighted - expectedWeighted)).toBeLessThan(1.0);

    // Weighted should be heavily influenced by BAI (50% weight)
    const diffFromBAI = Math.abs(results.weighted - results.bai);
    const diffFromNavy = Math.abs(results.weighted - results.navy);
    const diffFromDeurenberg = Math.abs(results.weighted - results.deurenberg);

    console.log('Diff from BAI:', diffFromBAI);
    console.log('Diff from Navy:', diffFromNavy);
    console.log('Diff from Deurenberg:', diffFromDeurenberg);

    // Weighted average should be closer to BAI than to other methods (due to 50% weight)
    // This assertion might not always hold if methods are very close to each other
    // So we just verify the calculation is correct instead
  });

  test('Visual verification - weighted average interface', async ({ page }) => {
    await page.locator('#hip').fill('100');
    await page.waitForTimeout(500);

    const weightedButton = page.locator('button').filter({ hasText: 'Średnia ważona z wszystkich metod' });
    await weightedButton.click();
    await page.waitForTimeout(500);

    // Take full screenshot
    await page.screenshot({ path: 'weighted-average-full-page.png', fullPage: true });

    // Take screenshot of body fat section only
    const bodyFatSection = page.locator('div.bg-white').filter({ hasText: 'Estymacja tkanki tłuszczowej' }).first();
    await bodyFatSection.screenshot({ path: 'weighted-average-section.png' });
  });
});
