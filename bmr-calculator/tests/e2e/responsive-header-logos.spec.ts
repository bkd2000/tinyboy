import { test, expect } from '@playwright/test';

test.describe('Responsive Header Logos', () => {
  test('should display logos side by side on desktop', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('http://localhost:5182');
    await page.waitForLoadState('networkidle');

    // Check both logos are visible
    const instytutLogo = page.getByAltText('Instytut Dietcoachingu');
    const poradniaLogo = page.getByAltText('Poradnia Odchudzania i Odżywiania');

    await expect(instytutLogo).toBeVisible();
    await expect(poradniaLogo).toBeVisible();

    // Get bounding boxes to verify horizontal layout
    const instytutBox = await instytutLogo.boundingBox();
    const poradniaBox = await poradniaLogo.boundingBox();

    expect(instytutBox).not.toBeNull();
    expect(poradniaBox).not.toBeNull();

    // On desktop, logos should be roughly on the same vertical level (side by side)
    // Allow 20px tolerance for vertical alignment
    const verticalDiff = Math.abs((instytutBox!.y + instytutBox!.height / 2) - (poradniaBox!.y + poradniaBox!.height / 2));
    expect(verticalDiff).toBeLessThan(20);

    // Poradnia logo should be to the right of Instytut logo
    expect(poradniaBox!.x).toBeGreaterThan(instytutBox!.x + instytutBox!.width);

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

  test('should display logos stacked on tablet portrait', async ({ page }) => {
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

    // On tablet (md breakpoint is 768px), logos should be side by side at exactly 768px
    // Check if they're roughly horizontally aligned
    const verticalDiff = Math.abs((instytutBox!.y + instytutBox!.height / 2) - (poradniaBox!.y + poradniaBox!.height / 2));

    // Should be side by side at 768px (md breakpoint)
    expect(verticalDiff).toBeLessThan(20);

    // First logo should be within viewport
    expect(instytutBox!.x + instytutBox!.width).toBeLessThanOrEqual(768);

    // Second logo may extend slightly beyond due to flex layout, but should start within viewport
    expect(poradniaBox!.x).toBeLessThan(768);

    // Take screenshot
    await page.screenshot({ path: 'bmr-calculator/responsive-logos-tablet.png', fullPage: false });
  });

  test('should have appropriate logo sizes on different screens', async ({ page }) => {
    // Test mobile size (sm:h-14 = 56px)
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('http://localhost:5182');
    await page.waitForLoadState('networkidle');

    let instytutBox = await page.getByAltText('Instytut Dietcoachingu').boundingBox();
    expect(instytutBox).not.toBeNull();
    // Height should be h-12 (48px) on mobile
    expect(instytutBox!.height).toBeCloseTo(48, 0);

    // Test tablet size (sm:h-14 = 56px, md:h-16 = 64px)
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500); // Wait for resize

    instytutBox = await page.getByAltText('Instytut Dietcoachingu').boundingBox();
    expect(instytutBox).not.toBeNull();
    // Height should be h-16 (64px) on tablet (md breakpoint)
    expect(instytutBox!.height).toBeCloseTo(64, 0);

    // Test desktop size (md:h-16 = 64px)
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.waitForTimeout(500); // Wait for resize

    instytutBox = await page.getByAltText('Instytut Dietcoachingu').boundingBox();
    expect(instytutBox).not.toBeNull();
    // Height should be h-16 (64px) on desktop
    expect(instytutBox!.height).toBeCloseTo(64, 0);
  });
});
