import { test, expect } from '@playwright/test';

test.describe('Responsive Header Logos', () => {
  test('should display logos stacked vertically on right on desktop', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('http://localhost:5182');
    await page.waitForLoadState('networkidle');

    // Check both logos are visible
    const instytutLogo = page.getByAltText('Instytut Dietcoachingu');
    const poradniaLogo = page.getByAltText('Poradnia Odchudzania i Odżywiania');

    await expect(instytutLogo).toBeVisible();
    await expect(poradniaLogo).toBeVisible();

    // Get bounding boxes to verify vertical stacking
    const instytutBox = await instytutLogo.boundingBox();
    const poradniaBox = await poradniaLogo.boundingBox();

    expect(instytutBox).not.toBeNull();
    expect(poradniaBox).not.toBeNull();

    // Logos should be stacked vertically (Poradnia below Instytut)
    expect(poradniaBox!.y).toBeGreaterThan(instytutBox!.y + instytutBox!.height);

    // Both logos should be roughly aligned on the right (x positions similar)
    // Tolerance increased to 75px since Instytut logo is now 44% larger than original
    const horizontalDiff = Math.abs(instytutBox!.x - poradniaBox!.x);
    expect(horizontalDiff).toBeLessThan(75);

    // Take screenshot
    await page.screenshot({ path: 'bmr-calculator/responsive-logos-desktop.png', fullPage: false });
  });

  test('should display logos stacked on mobile', async ({ page }) => {
    // Set mobile viewport (iPhone 12 Pro size)
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('http://localhost:5182');
    await page.waitForLoadState('networkidle');

    // Check both logos are visible
    const instytutLogo = page.getByAltText('Instytut Dietcoachingu');
    const poradniaLogo = page.getByAltText('Poradnia Odchudzania i Odżywiania');

    await expect(instytutLogo).toBeVisible();
    await expect(poradniaLogo).toBeVisible();

    // Get bounding boxes to verify vertical layout
    const instytutBox = await instytutLogo.boundingBox();
    const poradniaBox = await poradniaLogo.boundingBox();

    expect(instytutBox).not.toBeNull();
    expect(poradniaBox).not.toBeNull();

    // On mobile, logos should be stacked vertically
    // Poradnia logo should be below Instytut logo
    expect(poradniaBox!.y).toBeGreaterThan(instytutBox!.y + instytutBox!.height);

    // Both logos should be within viewport width
    expect(instytutBox!.x + instytutBox!.width).toBeLessThanOrEqual(390);
    expect(poradniaBox!.x + poradniaBox!.width).toBeLessThanOrEqual(390);

    // Take screenshot
    await page.screenshot({ path: 'bmr-calculator/responsive-logos-mobile.png', fullPage: false });
  });

  test('should display logos stacked vertically on tablet portrait', async ({ page }) => {
    // Set tablet portrait viewport (iPad Mini size)
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('http://localhost:5182');
    await page.waitForLoadState('networkidle');

    // Check both logos are visible
    const instytutLogo = page.getByAltText('Instytut Dietcoachingu');
    const poradniaLogo = page.getByAltText('Poradnia Odchudzania i Odżywiania');

    await expect(instytutLogo).toBeVisible();
    await expect(poradniaLogo).toBeVisible();

    // Get bounding boxes
    const instytutBox = await instytutLogo.boundingBox();
    const poradniaBox = await poradniaLogo.boundingBox();

    expect(instytutBox).not.toBeNull();
    expect(poradniaBox).not.toBeNull();

    // Logos should be stacked vertically (Poradnia below Instytut)
    expect(poradniaBox!.y).toBeGreaterThan(instytutBox!.y + instytutBox!.height);

    // Both logos should be within viewport
    expect(instytutBox!.x + instytutBox!.width).toBeLessThanOrEqual(768);
    expect(poradniaBox!.x + poradniaBox!.width).toBeLessThanOrEqual(768);

    // Take screenshot
    await page.screenshot({ path: 'bmr-calculator/responsive-logos-tablet.png', fullPage: false });
  });

  test('should have appropriate logo sizes on different screens', async ({ page }) => {
    // Test mobile size - Instytut: h-16 (64px), Poradnia: h-12 (48px)
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('http://localhost:5182');
    await page.waitForLoadState('networkidle');

    let instytutBox = await page.getByAltText('Instytut Dietcoachingu').boundingBox();
    let poradniaBox = await page.getByAltText('Poradnia Odchudzania i Odżywiania').boundingBox();
    expect(instytutBox).not.toBeNull();
    expect(poradniaBox).not.toBeNull();
    // Height should be h-16 (64px) for Instytut, h-12 (48px) for Poradnia on mobile
    expect(instytutBox!.height).toBeCloseTo(64, 0);
    expect(poradniaBox!.height).toBeCloseTo(48, 0);

    // Test tablet size - Instytut: md:h-20 (80px), Poradnia: md:h-14 (56px)
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500); // Wait for resize

    instytutBox = await page.getByAltText('Instytut Dietcoachingu').boundingBox();
    poradniaBox = await page.getByAltText('Poradnia Odchudzania i Odżywiania').boundingBox();
    expect(instytutBox).not.toBeNull();
    expect(poradniaBox).not.toBeNull();
    // Height should be h-20 (80px) for Instytut, h-14 (56px) for Poradnia on tablet
    expect(instytutBox!.height).toBeCloseTo(80, 0);
    expect(poradniaBox!.height).toBeCloseTo(56, 0);

    // Test desktop size - Instytut: md:h-20 (80px), Poradnia: md:h-14 (56px)
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.waitForTimeout(500); // Wait for resize

    instytutBox = await page.getByAltText('Instytut Dietcoachingu').boundingBox();
    poradniaBox = await page.getByAltText('Poradnia Odchudzania i Odżywiania').boundingBox();
    expect(instytutBox).not.toBeNull();
    expect(poradniaBox).not.toBeNull();
    // Height should be h-20 (80px) for Instytut, h-14 (56px) for Poradnia on desktop
    expect(instytutBox!.height).toBeCloseTo(80, 0);
    expect(poradniaBox!.height).toBeCloseTo(56, 0);
  });
});
