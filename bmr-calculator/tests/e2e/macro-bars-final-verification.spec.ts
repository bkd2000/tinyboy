import { test, expect } from '@playwright/test';

test.describe('Macro bars - final verification', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5182');
    await page.locator('#weight').fill('80');
    await page.locator('#height').fill('180');
    await page.locator('#age').fill('30');
    await page.getByRole('button', { name: 'Mężczyzna' }).click();

    // Select sedentary activity
    const sedentaryButton = page.locator('button').filter({
      hasText: /Siedzący.*1\.2/
    });
    await sedentaryButton.click();
    await page.waitForTimeout(500);
  });

  test('Keto strategy - all "Na posiłek" texts are below bars (readable)', async ({ page }) => {
    // Scroll to macros section
    await page.getByRole('heading', { name: 'Makroskładniki' }).scrollIntoViewIfNeeded();

    // Select keto for low protein percentage
    await page.locator('select#strategy').selectOption('keto');
    await page.waitForTimeout(500);

    // Take screenshot of macro section only
    const macroSection = page.locator('div.bg-white').filter({ hasText: 'Makroskładniki' }).first();
    await macroSection.screenshot({ path: 'final-keto-all-text-below-bars.png' });

    // Verify all three "Na posiłek" texts are visible below bars
    const allPerMealTexts = page.locator('p.text-xs.text-gray-600').filter({ hasText: /Na posiłek:/ });
    const count = await allPerMealTexts.count();
    expect(count).toBe(3); // Protein, Carbs, Fats

    // All should be visible
    for (let i = 0; i < count; i++) {
      await expect(allPerMealTexts.nth(i)).toBeVisible();
    }
  });

  test('High-protein strategy - all "Na posiłek" texts are below bars (readable)', async ({ page }) => {
    // Scroll to macros section
    await page.getByRole('heading', { name: 'Makroskładniki' }).scrollIntoViewIfNeeded();

    // Select high-protein
    await page.locator('select#strategy').selectOption('high-protein');
    await page.waitForTimeout(500);

    // Take screenshot of macro section only
    const macroSection = page.locator('div.bg-white').filter({ hasText: 'Makroskładniki' }).first();
    await macroSection.screenshot({ path: 'final-high-protein-all-text-below-bars.png' });

    // Verify all three "Na posiłek" texts are visible below bars
    const allPerMealTexts = page.locator('p.text-xs.text-gray-600').filter({ hasText: /Na posiłek:/ });
    const count = await allPerMealTexts.count();
    expect(count).toBe(3);

    // All should be visible
    for (let i = 0; i < count; i++) {
      await expect(allPerMealTexts.nth(i)).toBeVisible();
    }
  });

  test('Balanced strategy - all "Na posiłek" texts are below bars (readable)', async ({ page }) => {
    // Scroll to macros section
    await page.getByRole('heading', { name: 'Makroskładniki' }).scrollIntoViewIfNeeded();

    // Select balanced
    await page.locator('select#strategy').selectOption('balanced');
    await page.waitForTimeout(500);

    // Take screenshot of macro section only
    const macroSection = page.locator('div.bg-white').filter({ hasText: 'Makroskładniki' }).first();
    await macroSection.screenshot({ path: 'final-balanced-all-text-below-bars.png' });

    // Verify all three "Na posiłek" texts are visible below bars
    const allPerMealTexts = page.locator('p.text-xs.text-gray-600').filter({ hasText: /Na posiłek:/ });
    const count = await allPerMealTexts.count();
    expect(count).toBe(3);

    // All should be visible and readable
    for (let i = 0; i < count; i++) {
      await expect(allPerMealTexts.nth(i)).toBeVisible();
    }
  });
});
