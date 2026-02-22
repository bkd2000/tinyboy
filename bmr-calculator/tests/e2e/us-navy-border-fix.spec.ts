import { test, expect } from '@playwright/test';

test.describe('US Navy border fix', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5182');

    // Fill in basic data to enable US Navy calculation
    await page.locator('#weight').fill('80');
    await page.locator('#height').fill('180');
    await page.locator('#age').fill('30');

    // Select male gender
    await page.getByRole('button', { name: 'Mężczyzna' }).click();

    // Fill in circumferences for US Navy
    await page.locator('#neck').fill('38');
    await page.locator('#waist').fill('85');
  });

  test('US Navy method shows blue border when selected', async ({ page }) => {
    // Find the US Navy button by its heading
    const usNavyButton = page.locator('button').filter({ hasText: 'Metoda US Navy' });

    // Click US Navy button
    await usNavyButton.click();

    // Wait for selection to apply
    await page.waitForTimeout(300);

    // Check border styles
    const borderStyles = await usNavyButton.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        borderWidth: styles.borderWidth,
        borderColor: styles.borderColor,
        backgroundColor: styles.backgroundColor
      };
    });

    // Should have 4px border (border-4)
    expect(borderStyles.borderWidth).toBe('4px');

    // Should have white background
    expect(borderStyles.backgroundColor).toMatch(/(rgb\(255, 255, 255\)|oklch\(1|oklch\(0\.9)/);

    console.log('US Navy border styles:', borderStyles);
  });

  test('US Navy button is visible when selected', async ({ page }) => {
    const usNavyButton = page.locator('button').filter({ hasText: 'Metoda US Navy' });

    // Click US Navy
    await usNavyButton.click();
    await page.waitForTimeout(300);

    // Button should be visible
    await expect(usNavyButton).toBeVisible();

    // Should show calculated body fat percentage
    await expect(page.getByText(/Szacowany % tkanki tłuszczowej:/)).toBeVisible();

    // Take screenshot
    await page.screenshot({ path: 'us-navy-selected.png', fullPage: true });
  });

  test('Manual and US Navy border comparison', async ({ page }) => {
    const manualButton = page.locator('button').filter({ hasText: 'Ręczne wprowadzenie' });
    const usNavyButton = page.locator('button').filter({ hasText: 'Metoda US Navy' });

    // Manual should be selected by default with blue border
    const manualBorderInitial = await manualButton.evaluate((el) => {
      return window.getComputedStyle(el).borderWidth;
    });
    expect(manualBorderInitial).toBe('4px');

    // Click US Navy
    await usNavyButton.click();
    await page.waitForTimeout(300);

    // US Navy should now have 4px border
    const usNavyBorder = await usNavyButton.evaluate((el) => {
      return window.getComputedStyle(el).borderWidth;
    });
    expect(usNavyBorder).toBe('4px');

    // Manual should now have 2px border (unselected)
    const manualBorderAfter = await manualButton.evaluate((el) => {
      return window.getComputedStyle(el).borderWidth;
    });
    expect(manualBorderAfter).toBe('2px');
  });
});
