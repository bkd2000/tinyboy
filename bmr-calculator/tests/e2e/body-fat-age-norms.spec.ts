import { test, expect } from '@playwright/test';

test.describe('Body Fat Age-Based Norms Visualization', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5182');
    await page.waitForLoadState('networkidle');
  });

  test('should display age-based norms for female aged 30', async ({ page }) => {
    // Fill basic data
    await page.getByRole('button', { name: 'Kobieta' }).click();
    await page.getByLabel('Wiek *').fill('30');
    await page.getByLabel('Wzrost *').fill('165');
    await page.getByLabel('Waga *').fill('65');
    await page.getByLabel('Obwód bioder').fill('100');

    // Scroll to body fat estimator
    await page.getByRole('heading', { name: 'Estymacja tkanki tłuszczowej' }).scrollIntoViewIfNeeded();

    // Select BAI method
    await page.getByRole('button', { name: /Metoda BAI/ }).click();

    // Wait for calculation
    await page.waitForTimeout(500);

    // Check that result is displayed
    const resultSection = page.locator('text=Szacowany % tkanki tłuszczowej:');
    await expect(resultSection).toBeVisible();

    // Check that age-based category is shown
    const categorySection = page.locator('text=/Normy dla kobiet w wieku 30 lat:/');
    await expect(categorySection).toBeVisible();

    // Check that the graphical bar is present
    const normBar = page.locator('text=/Niedowaga/').first();
    await expect(normBar).toBeVisible();

    // Check for norm zones in legend
    await expect(page.locator('.grid.grid-cols-5').locator('text=/19\\.7–22\\.7%/')).toBeVisible(); // Normal range for women 30-34

    // Take screenshot
    await page.screenshot({ path: 'bmr-calculator/body-fat-norms-female-30.png', fullPage: true });
  });

  test('should display age-based norms for male aged 45', async ({ page }) => {
    // Fill basic data
    await page.getByRole('button', { name: 'Mężczyzna' }).click();
    await page.getByLabel('Wiek *').fill('45');
    await page.getByLabel('Wzrost *').fill('180');
    await page.getByLabel('Waga *').fill('85');
    await page.getByLabel('Obwód bioder').fill('95');

    // Scroll to body fat estimator
    await page.getByRole('heading', { name: 'Estymacja tkanki tłuszczowej' }).scrollIntoViewIfNeeded();

    // Select BAI method
    await page.getByRole('button', { name: /Metoda BAI/ }).click();

    // Wait for calculation
    await page.waitForTimeout(500);

    // Check that result is displayed
    const resultSection = page.locator('text=Szacowany % tkanki tłuszczowej:');
    await expect(resultSection).toBeVisible();

    // Check that age-based category is shown
    const categorySection = page.locator('text=/Normy dla mężczyzn w wieku 45 lat:/');
    await expect(categorySection).toBeVisible();

    // Check that the graphical bar is present
    const normBar = page.locator('text=/Niedowaga/').first();
    await expect(normBar).toBeVisible();

    // Check for norm zones in legend
    await expect(page.locator('.grid.grid-cols-5').locator('text=/18\\.6–21\\.5%/')).toBeVisible(); // Normal range for men 45-49

    // Take screenshot
    await page.screenshot({ path: 'bmr-calculator/body-fat-norms-male-45.png', fullPage: true });
  });

  test('should display correct marker position on norm bar', async ({ page }) => {
    // Fill basic data for a woman aged 35 with known body fat
    await page.getByRole('button', { name: 'Kobieta' }).click();
    await page.getByLabel('Wiek *').fill('35');
    await page.getByLabel('Wzrost *').fill('170');
    await page.getByLabel('Waga *').fill('70');

    // Scroll to body fat estimator
    await page.getByRole('heading', { name: 'Estymacja tkanki tłuszczowej' }).scrollIntoViewIfNeeded();

    // Use manual input for precise control
    await page.getByRole('button', { name: /Ręczne wprowadzenie/ }).click();
    await page.getByLabel('% tkanki tłuszczowej').fill('23');

    // Wait for update
    await page.waitForTimeout(500);

    // Check that result shows 23.0%
    await expect(page.locator('text=/23\\.0%/').first()).toBeVisible();

    // Check that age-based norms are shown
    await expect(page.locator('text=/Normy dla kobiet w wieku 35 lat:/')).toBeVisible();

    // For women 35-39: Normal is 21.0-24.0%, so 23% should be in normal range
    await expect(page.locator('text=/Norma\\/Idealna/')).toBeVisible();
    await expect(page.locator('.grid.grid-cols-5').locator('text=/21\\.0–24\\.0%/')).toBeVisible();

    // Take screenshot
    await page.screenshot({ path: 'bmr-calculator/body-fat-norms-marker-position.png', fullPage: true });
  });

  test('should update norms when age changes', async ({ page }) => {
    // Fill basic data
    await page.getByRole('button', { name: 'Mężczyzna' }).click();
    await page.getByLabel('Wiek *').fill('25');
    await page.getByLabel('Wzrost *').fill('175');
    await page.getByLabel('Waga *').fill('75');

    // Use manual input
    await page.getByRole('heading', { name: 'Estymacja tkanki tłuszczowej' }).scrollIntoViewIfNeeded();
    await page.getByRole('button', { name: /Ręczne wprowadzenie/ }).click();
    await page.getByLabel('% tkanki tłuszczowej').fill('15');

    // Check initial norms for age 25-29 (12.8-16.5%)
    await expect(page.locator('.grid.grid-cols-5').locator('text=/12\\.8–16\\.5%/')).toBeVisible();

    // Change age to 50
    await page.getByLabel('Wiek *').fill('50');
    await page.waitForTimeout(500);

    // Norms should update to age 50-54 (19.8-22.7%)
    await expect(page.locator('.grid.grid-cols-5').locator('text=/19\\.8–22\\.7%/')).toBeVisible();

    // Take screenshot
    await page.screenshot({ path: 'bmr-calculator/body-fat-norms-age-change.png', fullPage: true });
  });

  test('should show all 5 zones in the graphical bar', async ({ page }) => {
    // Fill basic data
    await page.getByRole('button', { name: 'Kobieta' }).click();
    await page.getByLabel('Wiek *').fill('40');
    await page.getByLabel('Wzrost *').fill('165');
    await page.getByLabel('Waga *').fill('65');

    // Use manual input
    await page.getByRole('heading', { name: 'Estymacja tkanki tłuszczowej' }).scrollIntoViewIfNeeded();
    await page.getByRole('button', { name: /Ręczne wprowadzenie/ }).click();
    await page.getByLabel('% tkanki tłuszczowej').fill('25');

    // Wait for visualization
    await page.waitForTimeout(500);

    // Check that all 5 zones are mentioned in the legend
    const legendTexts = ['Niedowaga', 'Norma', 'I stopień', 'Nadwaga', 'Otyłość'];
    for (const text of legendTexts) {
      // Use more specific selector to find legend items
      const legendItem = page.locator('.grid.grid-cols-5').locator(`text="${text}"`);
      await expect(legendItem).toBeVisible();
    }

    // Take screenshot showing full visualization
    await page.screenshot({ path: 'bmr-calculator/body-fat-norms-all-zones.png', fullPage: true });
  });

  test('should not show age norms when age is missing', async ({ page }) => {
    // Fill basic data WITHOUT age
    await page.getByRole('button', { name: 'Mężczyzna' }).click();
    await page.getByLabel('Wzrost *').fill('180');
    await page.getByLabel('Waga *').fill('80');

    // Use manual input
    await page.getByRole('heading', { name: 'Estymacja tkanki tłuszczowej' }).scrollIntoViewIfNeeded();
    await page.getByRole('button', { name: /Ręczne wprowadzenie/ }).click();
    await page.getByLabel('% tkanki tłuszczowej').fill('18');

    // Wait for update
    await page.waitForTimeout(500);

    // Result should be shown
    await expect(page.locator('text=/18\\.0%/').first()).toBeVisible();

    // But age-based norms should NOT be shown (no age provided)
    await expect(page.locator('text=/Normy dla/')).not.toBeVisible();

    // Should show simple category instead
    await expect(page.locator('text=/Fitness|Przeciętny|Sportowiec/')).toBeVisible();
  });
});
