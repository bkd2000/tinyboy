import { test, expect } from '@playwright/test';

test.describe('Header logos verification', () => {
  test('Both logos are visible in header', async ({ page }) => {
    await page.goto('http://localhost:5182');

    // Check if Instytut Dietcoachingu logo is visible
    const instytuLogo = page.locator('img[alt="Instytut Dietcoachingu"]');
    await expect(instytuLogo).toBeVisible();

    // Check if Poradnia logo is visible
    const poradniaLogo = page.locator('img[alt="Poradnia Odchudzania i Odżywiania"]');
    await expect(poradniaLogo).toBeVisible();

    // Take screenshot of the header
    const header = page.locator('header');
    await header.screenshot({ path: 'header-with-logos.png' });
  });

  test('Logos are positioned correctly on the right side', async ({ page }) => {
    await page.goto('http://localhost:5182');

    const header = page.locator('header');
    const title = page.locator('h1:has-text("BodyMetrics Pro")');
    const logosContainer = page.locator('div.flex.items-center.gap-6');

    // Verify logos container exists
    await expect(logosContainer).toBeVisible();

    // Verify both logos are in the container
    const logos = logosContainer.locator('img');
    const logoCount = await logos.count();
    expect(logoCount).toBe(2);

    // Take full page screenshot
    await page.screenshot({ path: 'complete-app-with-logos.png', fullPage: true });
  });

  test('Logos maintain proper height', async ({ page }) => {
    await page.goto('http://localhost:5182');

    const instytuLogo = page.locator('img[alt="Instytut Dietcoachingu"]');
    const poradniaLogo = page.locator('img[alt="Poradnia Odchudzania i Odżywiania"]');

    // Check if both logos have the h-16 class (64px height)
    const instytuClass = await instytuLogo.getAttribute('class');
    const poradniaClass = await poradniaLogo.getAttribute('class');

    expect(instytuClass).toContain('h-16');
    expect(poradniaClass).toContain('h-16');
  });
});
