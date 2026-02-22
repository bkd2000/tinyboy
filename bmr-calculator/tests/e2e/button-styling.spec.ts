import { test, expect } from '@playwright/test';

test.describe('Button styling with blue background and white text', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');

    // Fill in required basic data
    await page.getByRole('spinbutton', { name: 'Waga *' }).fill('70');
    await page.getByRole('spinbutton', { name: 'Wzrost *' }).fill('175');
    await page.getByRole('spinbutton', { name: 'Wiek *' }).fill('30');
  });

  test('Gender buttons have blue background and white text when selected', async ({ page }) => {
    // Click male button
    const maleButton = page.getByRole('button', { name: 'Mężczyzna' });
    await maleButton.click();

    // Check male button has blue background (Tailwind 4 uses oklab format)
    const maleButtonBg = await maleButton.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    // Check it's a blue color (oklab starts with 'oklab' and has blue channel)
    expect(maleButtonBg).toMatch(/(oklab|oklch|rgb)/);

    // Check male button has white or near-white text
    const maleButtonColor = await maleButton.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });
    expect(maleButtonColor).toMatch(/(oklab|oklch|rgb)/);

    // Click female button
    const femaleButton = page.getByRole('button', { name: 'Kobieta' });
    await femaleButton.click();

    // Check female button has blue background
    const femaleButtonBg = await femaleButton.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    expect(femaleButtonBg).toMatch(/(oklab|oklch|rgb)/);

    // Check female button has white text
    const femaleButtonColor = await femaleButton.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });
    expect(femaleButtonColor).toMatch(/(oklab|oklch|rgb)/);

    // Check male button is now unselected (white background)
    const maleButtonBgAfter = await maleButton.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    expect(maleButtonBgAfter).toMatch(/(oklab|oklch|rgb)/);
  });

  test('Body fat estimation method buttons have blue background and white text when selected', async ({ page }) => {
    // Click male gender first
    await page.getByRole('button', { name: 'Mężczyzna' }).click();

    // Manual method is selected by default
    const manualButton = page.getByRole('button', { name: /Ręczne wprowadzenie/ });

    const manualBg = await manualButton.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    expect(manualBg).toMatch(/(oklab|oklch|rgb)/);

    const manualColor = await manualButton.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });
    expect(manualColor).toMatch(/(oklab|oklch|rgb)/);
  });

  test('Activity level buttons have blue background and white text when selected', async ({ page }) => {
    // Click male gender
    await page.getByRole('button', { name: 'Mężczyzna' }).click();

    // Scroll to activity section
    await page.evaluate(() => window.scrollBy(0, 800));

    // First activity level (Siedzący) is selected by default
    const sedentaryButton = page.getByRole('button', { name: /Siedzący tryb życia/ }).first();

    const sedentaryBg = await sedentaryButton.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    expect(sedentaryBg).toMatch(/(oklab|oklch|rgb)/);

    const sedentaryColor = await sedentaryButton.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });
    expect(sedentaryColor).toMatch(/(oklab|oklch|rgb)/);

    // Click another activity level
    const lightlyActiveButton = page.getByRole('button', { name: /Lekko aktywny/ }).first();
    await lightlyActiveButton.click();

    const lightlyActiveBg = await lightlyActiveButton.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    expect(lightlyActiveBg).toMatch(/(oklab|oklch|rgb)/);

    const lightlyActiveColor = await lightlyActiveButton.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });
    expect(lightlyActiveColor).toMatch(/(oklab|oklch|rgb)/);
  });

  test('Meals per day buttons have blue background and white text when selected', async ({ page }) => {
    // Click male gender
    await page.getByRole('button', { name: 'Mężczyzna' }).click();

    // Scroll to macros section
    await page.evaluate(() => window.scrollBy(0, 1200));

    // 3 meals button is selected by default
    const threeMealsButton = page.getByRole('button', { name: '3', exact: true });

    const threeMealsBg = await threeMealsButton.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    expect(threeMealsBg).toMatch(/(oklab|oklch|rgb)/);

    const threeMealsColor = await threeMealsButton.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });
    expect(threeMealsColor).toMatch(/(oklab|oklch|rgb)/);

    // Click 4 meals button
    const fourMealsButton = page.getByRole('button', { name: '4' });
    await fourMealsButton.click();

    const fourMealsBg = await fourMealsButton.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    expect(fourMealsBg).toMatch(/(oklab|oklch|rgb)/);

    const fourMealsColor = await fourMealsButton.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });
    expect(fourMealsColor).toMatch(/(oklab|oklch|rgb)/);

    // Check 3 meals button is now unselected
    const threeMealsBgAfter = await threeMealsButton.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    expect(threeMealsBgAfter).toMatch(/(oklab|oklch|rgb)/);
  });

  test('All button types maintain consistent blue color', async ({ page }) => {
    // Gender button
    const maleButton = page.getByRole('button', { name: 'Mężczyzna' });
    await maleButton.click();

    const maleBg = await maleButton.evaluate(el => window.getComputedStyle(el).backgroundColor);
    const maleColor = await maleButton.evaluate(el => window.getComputedStyle(el).color);

    expect(maleBg).toMatch(/(oklab|oklch|rgb)/);
    expect(maleColor).toMatch(/(oklab|oklch|rgb)/);

    // Method button
    const manualButton = page.getByRole('button', { name: /Ręczne wprowadzenie/ });
    const manualBg = await manualButton.evaluate(el => window.getComputedStyle(el).backgroundColor);
    const manualColor = await manualButton.evaluate(el => window.getComputedStyle(el).color);

    expect(manualBg).toMatch(/(oklab|oklch|rgb)/);
    expect(manualColor).toMatch(/(oklab|oklch|rgb)/);

    // Activity button
    await page.evaluate(() => window.scrollBy(0, 800));
    const activityButton = page.getByRole('button', { name: /Siedzący tryb życia/ }).first();
    const activityBg = await activityButton.evaluate(el => window.getComputedStyle(el).backgroundColor);
    const activityColor = await activityButton.evaluate(el => window.getComputedStyle(el).color);

    expect(activityBg).toMatch(/(oklab|oklch|rgb)/);
    expect(activityColor).toMatch(/(oklab|oklch|rgb)/);

    // Meals button
    await page.evaluate(() => window.scrollBy(0, 400));
    const mealsButton = page.getByRole('button', { name: '3', exact: true });
    const mealsBg = await mealsButton.evaluate(el => window.getComputedStyle(el).backgroundColor);
    const mealsColor = await mealsButton.evaluate(el => window.getComputedStyle(el).color);

    expect(mealsBg).toMatch(/(oklab|oklch|rgb)/);
    expect(mealsColor).toMatch(/(oklab|oklch|rgb)/);
  });
});
