import { test, expect } from '@playwright/test';

test.describe('Visual verification of fixes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5182');
    await page.locator('#weight').fill('80');
    await page.locator('#height').fill('180');
    await page.locator('#age').fill('30');
    await page.getByRole('button', { name: 'Mężczyzna' }).click();
    await page.locator('#neck').fill('38');
    await page.locator('#waist').fill('85');
  });

  test('US Navy blue border is visible', async ({ page }) => {
    // Scroll to body fat estimator section
    await page.locator('text=Estymacja tkanki tłuszczowej').scrollIntoViewIfNeeded();

    // Click US Navy button
    const usNavyButton = page.locator('button').filter({ hasText: 'Metoda US Navy' });
    await usNavyButton.click();
    await page.waitForTimeout(500);

    // Take screenshot of just the body fat section
    const bodyFatSection = page.locator('div.bg-white:has-text("Estymacja tkanki tłuszczowej")').first();
    await bodyFatSection.screenshot({ path: 'fix-us-navy-blue-border.png' });

    // Verify blue border
    const borderWidth = await usNavyButton.evaluate((el) => {
      return window.getComputedStyle(el).borderWidth;
    });
    expect(borderWidth).toBe('4px');
  });

  test('Macro bars with low protein are readable', async ({ page }) => {
    // Select sedentary activity
    await page.locator('text=Poziom aktywności fizycznej').scrollIntoViewIfNeeded();
    const sedentaryButton = page.locator('button').filter({ hasText: /Siedzący.*1\.2/ });
    await sedentaryButton.click();
    await page.waitForTimeout(500);

    // Scroll to macros
    await page.locator('text=Makroskładniki').scrollIntoViewIfNeeded();

    // Select keto for low protein percentage (~25%)
    await page.locator('select#strategy').selectOption('keto');
    await page.waitForTimeout(500);

    // Take screenshot of macro section only
    const macroSection = page.locator('div.bg-white:has-text("Makroskładniki")').first();
    await macroSection.screenshot({ path: 'fix-macro-bars-keto-readable.png' });

    // Verify "Na posiłek" text is visible below the protein bar (not inside)
    const proteinSection = page.locator('div').filter({ hasText: /^Białko/ }).first();
    const perMealText = proteinSection.locator('p.text-xs.text-gray-600');
    await expect(perMealText).toBeVisible();
    await expect(perMealText).toContainText(/Na posiłek:/);
  });

  test('Macro bars with high protein show text inside', async ({ page }) => {
    // Select sedentary activity
    await page.locator('text=Poziom aktywności fizycznej').scrollIntoViewIfNeeded();
    const sedentaryButton = page.locator('button').filter({ hasText: /Siedzący.*1\.2/ });
    await sedentaryButton.click();
    await page.waitForTimeout(500);

    // Scroll to macros
    await page.locator('text=Makroskładniki').scrollIntoViewIfNeeded();

    // Select high-protein for high protein percentage (40%)
    await page.locator('select#strategy').selectOption('high-protein');
    await page.waitForTimeout(500);

    // Take screenshot of macro section only
    const macroSection = page.locator('div.bg-white:has-text("Makroskładniki")').first();
    await macroSection.screenshot({ path: 'fix-macro-bars-high-protein.png' });

    // Verify text is inside the bar
    const proteinBar = page.locator('div.bg-blue-500').first();
    await expect(proteinBar).toContainText(/Na posiłek:/);
  });

  test('Comparison: Manual vs US Navy vs Deurenberg borders', async ({ page }) => {
    await page.locator('text=Estymacja tkanki tłuszczowej').scrollIntoViewIfNeeded();
    const bodyFatSection = page.locator('div.bg-white:has-text("Estymacja tkanki tłuszczowej")').first();

    // Manual (default selected) - should have 4px blue border
    await bodyFatSection.screenshot({ path: 'fix-manual-selected-4px-border.png' });

    // Click US Navy - should have 4px blue border
    const usNavyButton = page.locator('button').filter({ hasText: 'Metoda US Navy' });
    await usNavyButton.click();
    await page.waitForTimeout(300);
    await bodyFatSection.screenshot({ path: 'fix-us-navy-selected-4px-border.png' });

    // Click Deurenberg - should have 4px blue border
    const deurenbergButton = page.locator('button').filter({ hasText: 'Metoda Deurenberg' });
    await deurenbergButton.click();
    await page.waitForTimeout(300);
    await bodyFatSection.screenshot({ path: 'fix-deurenberg-selected-4px-border.png' });

    // Click Manual again - should have 4px blue border
    const manualButton = page.locator('button').filter({ hasText: 'Ręczne wprowadzenie' });
    await manualButton.click();
    await page.waitForTimeout(300);
    await bodyFatSection.screenshot({ path: 'fix-manual-reselected-4px-border.png' });
  });
});
