import { test, expect } from '@playwright/test';

test.describe('PDF Generation - Simple Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Generate PDF with complete data', async ({ page }) => {
    // Fill in basic data
    await page.getByRole('spinbutton', { name: 'Waga *' }).fill('80');
    await page.getByRole('spinbutton', { name: 'Wzrost *' }).fill('180');
    await page.getByRole('spinbutton', { name: 'Wiek *' }).fill('35');
    await page.getByRole('button', { name: 'Mężczyzna' }).click();

    // Fill circumferences
    await page.getByRole('spinbutton', { name: 'Obwód szyi' }).fill('38');
    await page.getByRole('spinbutton', { name: 'Obwód talii' }).fill('90');
    await page.getByRole('spinbutton', { name: 'Obwód bioder' }).fill('100');

    // Wait for calculations
    await page.waitForTimeout(1000);

    // Scroll to PDF section
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // Verify PDF export section is visible
    await expect(page.getByText('Eksport do PDF')).toBeVisible();

    // Fill client name
    await page.getByRole('textbox', { name: /Imię i nazwisko klienta/i }).fill('Jan Kowalski');

    // Set up download listener
    const downloadPromise = page.waitForEvent('download', { timeout: 30000 });

    // Click export button
    await page.getByRole('button', { name: /Generuj PDF/i }).click();

    // Wait for download
    const download = await downloadPromise;

    // Verify filename
    const filename = download.suggestedFilename();
    expect(filename).toMatch(/BMR_Raport_Jan_Kowalski_\d{4}-\d{2}-\d{2}\.pdf/);

    console.log(`✓ PDF generated: ${filename}`);
  });

  test('Verify all sections exist before PDF generation', async ({ page }) => {
    // Fill data
    await page.getByRole('spinbutton', { name: 'Waga *' }).fill('85');
    await page.getByRole('spinbutton', { name: 'Wzrost *' }).fill('178');
    await page.getByRole('spinbutton', { name: 'Wiek *' }).fill('28');
    await page.getByRole('button', { name: 'Mężczyzna' }).click();
    await page.getByRole('spinbutton', { name: 'Obwód talii' }).fill('85');
    await page.getByRole('spinbutton', { name: 'Obwód bioder' }).fill('98');

    await page.waitForTimeout(1000);

    // Check BMI section
    await page.evaluate(() => window.scrollBy(0, 400));
    await expect(page.getByText('BMI - Wskaźnik Masy Ciała')).toBeVisible();

    // Check WHR section
    await page.evaluate(() => window.scrollBy(0, 400));
    await expect(page.getByText('WHR - Stosunek Talii do Bioder')).toBeVisible();

    // Check WHtR section
    await page.evaluate(() => window.scrollBy(0, 400));
    await expect(page.getByText('WHtR - Stosunek Talii do Wzrostu')).toBeVisible();

    // Check advanced metrics
    await page.evaluate(() => window.scrollBy(0, 600));
    await expect(page.getByText('Zaawansowane Wskaźniki Składu Ciała')).toBeVisible();

    console.log('✓ All sections are visible and calculated');
  });

  test('PDF button shows correct states', async ({ page }) => {
    // Fill required data
    await page.getByRole('spinbutton', { name: 'Waga *' }).fill('75');
    await page.getByRole('spinbutton', { name: 'Wzrost *' }).fill('170');
    await page.getByRole('spinbutton', { name: 'Wiek *' }).fill('25');
    await page.getByRole('button', { name: 'Kobieta' }).click();

    await page.waitForTimeout(1000);

    // Scroll to PDF section
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    const exportButton = page.getByRole('button', { name: /Generuj PDF/i });

    // Button should be enabled
    await expect(exportButton).toBeEnabled();
    await expect(exportButton).toHaveText(/Generuj PDF/);

    console.log('✓ PDF export button is ready');
  });
});
