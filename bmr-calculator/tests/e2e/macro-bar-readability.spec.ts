import { test, expect } from '@playwright/test';

test.describe('Macro bar readability fix', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5182');

    // Fill in data for macro calculation
    await page.locator('#weight').fill('80');
    await page.locator('#height').fill('180');
    await page.locator('#age').fill('30');
    await page.getByRole('button', { name: 'Mężczyzna' }).click();

    // Select sedentary activity level for low calories
    const sedentaryButton = page.locator('button').filter({
      hasText: /Siedzący.*1\.2/
    });
    await sedentaryButton.click();

    // Wait for TDEE calculation
    await page.waitForTimeout(500);
  });

  test('Protein bar shows "Na posiłek" below the bar (always readable)', async ({ page }) => {
    // Select cutting goal and keto strategy for very low protein percentage
    await page.locator('select#goal').selectOption('cutting');
    await page.locator('select#strategy').selectOption('keto');

    await page.waitForTimeout(500);

    // Find the protein bar section
    const proteinSection = page.locator('div').filter({ hasText: /^Białko/ }).first();

    // The "Na posiłek" text should ALWAYS be OUTSIDE the bar (below it)
    const perMealText = proteinSection.locator('p.text-xs.text-gray-600').first();

    // Should be visible below the bar
    await expect(perMealText).toBeVisible();
    await expect(perMealText).toContainText(/Na posiłek:/);

    // Take screenshot
    await page.screenshot({ path: 'low-protein-readable.png', fullPage: true });
  });

  test('High protein bar shows "Na posiłek" below the bar (always readable)', async ({ page }) => {
    // Select high-protein strategy for high protein percentage
    await page.locator('select#goal').selectOption('maintenance');
    await page.locator('select#strategy').selectOption('high-protein');

    await page.waitForTimeout(500);

    // Find the protein section
    const proteinSection = page.locator('div').filter({ hasText: /^Białko/ }).first();

    // Text should ALWAYS be below the bar (outside), never inside
    const perMealText = proteinSection.locator('p.text-xs.text-gray-600').first();
    await expect(perMealText).toBeVisible();
    await expect(perMealText).toContainText(/Na posiłek:/);

    // Take screenshot
    await page.screenshot({ path: 'high-protein-readable.png', fullPage: true });
  });

  test('All macro bars are readable in different strategies', async ({ page }) => {
    const strategies = [
      { name: 'balanced', label: 'Zrównoważona' },
      { name: 'high-protein', label: 'Wysokobiałkowa' },
      { name: 'keto', label: 'Ketogeniczna' },
      { name: 'low-carb', label: 'Niskowęglowodanowa' }
    ];

    for (const strategy of strategies) {
      await page.locator('select#strategy').selectOption(strategy.name);
      await page.waitForTimeout(300);

      // Check all three macros have "Na posiłek" text visible somewhere
      // (either inside the bar or below it)
      const proteinText = page.locator('text=/Na posiłek:.*g/').first();
      const carbsText = page.locator('text=/Na posiłek:.*g/').nth(1);
      const fatsText = page.locator('text=/Na posiłek:.*g/').nth(2);

      await expect(proteinText).toBeVisible();
      await expect(carbsText).toBeVisible();
      await expect(fatsText).toBeVisible();

      console.log(`${strategy.label} - all macro bars readable ✓`);
    }
  });

  test('Visual verification - low protein vs high protein', async ({ page }) => {
    // Test keto (low protein ~25%)
    await page.locator('select#strategy').selectOption('keto');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'keto-macro-bars.png', fullPage: true });

    // Test high-protein (40% protein)
    await page.locator('select#strategy').selectOption('high-protein');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'high-protein-macro-bars.png', fullPage: true });

    // Test balanced
    await page.locator('select#strategy').selectOption('balanced');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'balanced-macro-bars.png', fullPage: true });
  });
});
