import { test, expect } from '@playwright/test';

test.describe('Healthy Cutting - 20:50 Fats:Carbs Ratio', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5182');

    // Fill in basic data
    await page.locator('#weight').fill('80');
    await page.locator('#height').fill('180');
    await page.locator('#age').fill('30');
    await page.getByRole('button', { name: 'Mężczyzna' }).click();

    // Wait for BMR results to appear
    await page.waitForSelector('text=Średni BMR', { timeout: 10000 });

    // Add body fat for LBM calculation
    const manualButton = page.locator('button').filter({ hasText: 'Ręczne wprowadzenie' });
    await manualButton.click();
    await page.locator('#bodyFatManual').fill('20');
    await page.waitForTimeout(500);

    // Select sedentary activity
    const sedentaryButton = page.locator('button').filter({ hasText: /Siedzący.*1\.2/ });
    await sedentaryButton.click();
    await page.waitForTimeout(1000);
  });

  test('Verify 2.2g/kg LBM protein with 20:50 fats:carbs ratio', async ({ page }) => {
    // Scroll to macros
    await page.getByRole('heading', { name: 'Makroskładniki' }).scrollIntoViewIfNeeded();

    // Select "Zdrowe odchudzanie" strategy
    await page.locator('select#strategy').selectOption('healthy-cutting');
    await page.waitForTimeout(500);

    // Extract macro values
    const proteinText = await page.locator('div').filter({ hasText: /^Białko/ }).first().locator('span.font-semibold').first().textContent();
    const carbsText = await page.locator('div').filter({ hasText: /^Węglowodany/ }).first().locator('span.font-semibold').first().textContent();
    const fatsText = await page.locator('div').filter({ hasText: /^Tłuszcze/ }).first().locator('span.font-semibold').first().textContent();

    const proteinGrams = parseInt(proteinText?.replace('g', '') || '0');
    const carbsGrams = parseInt(carbsText?.replace('g', '') || '0');
    const fatsGrams = parseInt(fatsText?.replace('g', '') || '0');

    console.log('Protein:', proteinGrams, 'g');
    console.log('Carbs:', carbsGrams, 'g');
    console.log('Fats:', fatsGrams, 'g');

    // Weight: 80kg, BF: 20% → LBM = 80 * 0.8 = 64kg
    // Protein should be: 64kg * 2.2g/kg = 140.8g ≈ 141g
    expect(proteinGrams).toBeGreaterThanOrEqual(138);
    expect(proteinGrams).toBeLessThanOrEqual(143);

    // Calculate calories
    const proteinCal = proteinGrams * 4;
    const carbsCal = carbsGrams * 4;
    const fatsCal = fatsGrams * 9;
    const totalCal = proteinCal + carbsCal + fatsCal;

    console.log('Protein Cal:', proteinCal);
    console.log('Carbs Cal:', carbsCal);
    console.log('Fats Cal:', fatsCal);
    console.log('Total Cal:', totalCal);

    // Remaining calories after protein
    const remainingCal = totalCal - proteinCal;

    // Fats should be ~20/70 of remaining
    const expectedFatsCal = remainingCal * (20 / 70);
    const actualFatsRatio = fatsCal / remainingCal;

    console.log('Expected Fats Cal:', expectedFatsCal);
    console.log('Actual Fats Ratio:', actualFatsRatio);
    console.log('Expected Fats Ratio:', 20/70);

    // Allow 5% tolerance
    expect(actualFatsRatio).toBeGreaterThan(0.25); // 20/70 ≈ 0.286, tolerance: 0.25-0.32
    expect(actualFatsRatio).toBeLessThan(0.32);

    // Carbs should be ~50/70 of remaining
    const expectedCarbsCal = remainingCal * (50 / 70);
    const actualCarbsRatio = carbsCal / remainingCal;

    console.log('Expected Carbs Cal:', expectedCarbsCal);
    console.log('Actual Carbs Ratio:', actualCarbsRatio);
    console.log('Expected Carbs Ratio:', 50/70);

    // Allow 5% tolerance
    expect(actualCarbsRatio).toBeGreaterThan(0.68); // 50/70 ≈ 0.714, tolerance: 0.68-0.75
    expect(actualCarbsRatio).toBeLessThan(0.75);
  });

  test('Visual verification - Healthy cutting macros', async ({ page }) => {
    await page.getByRole('heading', { name: 'Makroskładniki' }).scrollIntoViewIfNeeded();

    // Select healthy-cutting
    await page.locator('select#strategy').selectOption('healthy-cutting');
    await page.waitForTimeout(500);

    // Take screenshot
    const macroSection = page.locator('div.bg-white').filter({ hasText: 'Makroskładniki' }).first();
    await macroSection.screenshot({ path: 'healthy-cutting-20-50-ratio.png' });
  });

  test('Compare ratios across different body fat percentages', async ({ page }) => {
    const bodyFatPercentages = [15, 20, 25, 30];
    const results: any[] = [];

    for (const bf of bodyFatPercentages) {
      // Set body fat
      await page.getByRole('heading', { name: 'Estymacja tkanki tłuszczowej' }).scrollIntoViewIfNeeded();
      await page.locator('#bodyFatManual').fill(bf.toString());
      await page.waitForTimeout(300);

      // Select healthy-cutting
      await page.getByRole('heading', { name: 'Makroskładniki' }).scrollIntoViewIfNeeded();
      await page.locator('select#strategy').selectOption('healthy-cutting');
      await page.waitForTimeout(300);

      // Extract values
      const proteinText = await page.locator('div').filter({ hasText: /^Białko/ }).first().locator('span.font-semibold').first().textContent();
      const carbsText = await page.locator('div').filter({ hasText: /^Węglowodany/ }).first().locator('span.font-semibold').first().textContent();
      const fatsText = await page.locator('div').filter({ hasText: /^Tłuszcze/ }).first().locator('span.font-semibold').first().textContent();

      const proteinGrams = parseInt(proteinText?.replace('g', '') || '0');
      const carbsGrams = parseInt(carbsText?.replace('g', '') || '0');
      const fatsGrams = parseInt(fatsText?.replace('g', '') || '0');

      // Calculate LBM
      const lbm = 80 * (1 - bf / 100);
      const expectedProtein = lbm * 2.2;

      const proteinCal = proteinGrams * 4;
      const carbsCal = carbsGrams * 4;
      const fatsCal = fatsGrams * 9;
      const remainingCal = carbsCal + fatsCal;

      const fatsRatio = fatsCal / remainingCal;
      const carbsRatio = carbsCal / remainingCal;

      results.push({
        bf,
        lbm: lbm.toFixed(1),
        expectedProtein: expectedProtein.toFixed(1),
        actualProtein: proteinGrams,
        fatsRatio: fatsRatio.toFixed(3),
        carbsRatio: carbsRatio.toFixed(3),
      });

      console.log(`BF ${bf}%: LBM=${lbm.toFixed(1)}kg, Protein=${proteinGrams}g (expected ${expectedProtein.toFixed(1)}g), Fats ratio=${fatsRatio.toFixed(3)}, Carbs ratio=${carbsRatio.toFixed(3)}`);

      // Verify protein is close to 2.2g/kg LBM
      expect(Math.abs(proteinGrams - expectedProtein)).toBeLessThan(5);

      // Verify fats:carbs ratio is close to 20:50
      expect(fatsRatio).toBeGreaterThan(0.25);
      expect(fatsRatio).toBeLessThan(0.32);
      expect(carbsRatio).toBeGreaterThan(0.68);
      expect(carbsRatio).toBeLessThan(0.75);
    }

    console.log('Summary:', results);
  });
});
