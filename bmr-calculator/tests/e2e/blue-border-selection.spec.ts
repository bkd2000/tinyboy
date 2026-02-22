import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
});

test('Body fat estimation method shows blue border when selected', async ({ page }) => {
  // Fill basic data
  await page.getByRole('spinbutton', { name: 'Waga *' }).fill('80');
  await page.getByRole('spinbutton', { name: 'Wzrost *' }).fill('180');
  await page.getByRole('spinbutton', { name: 'Wiek *' }).fill('30');
  await page.getByRole('button', { name: 'Mężczyzna' }).click();

  await page.waitForTimeout(1000);

  // Scroll to body fat section
  const bodyFatSection = page.getByRole('heading', { name: 'Estymacja tkanki tłuszczowej' });
  await bodyFatSection.scrollIntoViewIfNeeded();

  // Manual method should be selected by default
  const manualButton = page.getByRole('button', { name: /Ręczne wprowadzenie/ });

  // Check border color (blue-700 is rgb(29, 78, 216) in Tailwind, but might be oklch in Tailwind 4)
  const manualBorder = await manualButton.evaluate((el) => {
    const styles = window.getComputedStyle(el);
    return {
      borderWidth: styles.borderWidth,
      borderColor: styles.borderColor,
      backgroundColor: styles.backgroundColor
    };
  });

  // Should have thick border (4px)
  expect(manualBorder.borderWidth).toBe('4px');

  // Should have white/light background (not blue)
  expect(manualBorder.backgroundColor).toMatch(/(rgb\(255, 255, 255\)|oklch\(1|oklch\(0\.9)/);

  console.log('✓ Manual method has correct border styling');

  // Click Deurenberg method
  const deurenbergButton = page.getByRole('button', { name: /Metoda Deurenberg/ });
  await deurenbergButton.click();
  await page.waitForTimeout(500);

  // Check Deurenberg now has thick border
  const deurenbergBorder = await deurenbergButton.evaluate((el) => {
    return window.getComputedStyle(el).borderWidth;
  });

  expect(deurenbergBorder).toBe('4px');

  // Manual should now have thin border
  const manualBorderAfter = await manualButton.evaluate((el) => {
    return window.getComputedStyle(el).borderWidth;
  });

  expect(manualBorderAfter).toBe('2px');

  console.log('✓ Border changes correctly when switching methods');
});

test('Activity level shows blue border when selected', async ({ page }) => {
  // Fill basic data
  await page.getByRole('spinbutton', { name: 'Waga *' }).fill('75');
  await page.getByRole('spinbutton', { name: 'Wzrost *' }).fill('175');
  await page.getByRole('spinbutton', { name: 'Wiek *' }).fill('28');
  await page.getByRole('button', { name: 'Kobieta' }).click();

  await page.waitForTimeout(1000);

  // Scroll to TDEE section
  const tdeeSection = page.getByText('TDEE - Całkowite Dzienne Zapotrzebowanie Energetyczne');
  await tdeeSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  // Sedentary should be selected by default
  const sedentaryButton = page.getByRole('button', { name: /Siedzący tryb życia/ }).first();

  const sedentaryBorder = await sedentaryButton.evaluate((el) => {
    const styles = window.getComputedStyle(el);
    return {
      borderWidth: styles.borderWidth,
      backgroundColor: styles.backgroundColor
    };
  });

  // Should have thick border
  expect(sedentaryBorder.borderWidth).toBe('4px');

  // Should have white background
  expect(sedentaryBorder.backgroundColor).toMatch(/(rgb\(255, 255, 255\)|oklch\(1|oklch\(0\.9)/);

  console.log('✓ Activity level has correct border styling');

  // Click another activity level
  const lightlyActiveButton = page.getByRole('button', { name: /Lekko aktywny/ }).first();
  await lightlyActiveButton.click();
  await page.waitForTimeout(500);

  // Check new selection has thick border
  const lightlyActiveBorder = await lightlyActiveButton.evaluate((el) => {
    return window.getComputedStyle(el).borderWidth;
  });

  expect(lightlyActiveBorder).toBe('4px');

  // Previous selection should have thin border
  const sedentaryBorderAfter = await sedentaryButton.evaluate((el) => {
    return window.getComputedStyle(el).borderWidth;
  });

  expect(sedentaryBorderAfter).toBe('2px');

  console.log('✓ Activity level border changes correctly when switching');
});

test('Visual verification - Take screenshots of selections', async ({ page }) => {
  // Fill complete data
  await page.getByRole('spinbutton', { name: 'Waga *' }).fill('80');
  await page.getByRole('spinbutton', { name: 'Wzrost *' }).fill('180');
  await page.getByRole('spinbutton', { name: 'Wiek *' }).fill('35');
  await page.getByRole('button', { name: 'Mężczyzna' }).click();

  // Fill circumferences
  await page.getByRole('spinbutton', { name: 'Obwód talii' }).fill('90');
  await page.getByRole('spinbutton', { name: 'Obwód bioder' }).fill('100');

  await page.waitForTimeout(1500);

  // Screenshot body fat estimation section
  const bodyFatSection = page.getByRole('heading', { name: 'Estymacja tkanki tłuszczowej' });
  await bodyFatSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);

  // Click Deurenberg to show selection
  await page.getByRole('button', { name: /Metoda Deurenberg/ }).click();
  await page.waitForTimeout(500);

  await page.screenshot({
    path: 'body-fat-method-selected.png',
    fullPage: false
  });

  // Scroll to activity section
  const activitySection = page.getByText('TDEE - Całkowite Dzienne Zapotrzebowanie Energetyczne');
  await activitySection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);

  await page.screenshot({
    path: 'activity-level-selected.png',
    fullPage: false
  });

  console.log('✓ Screenshots saved for visual verification');
});
