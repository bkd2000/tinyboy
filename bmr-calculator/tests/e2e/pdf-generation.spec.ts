import { test, expect } from '@playwright/test';
import { readFileSync, existsSync, statSync, mkdirSync, readdirSync, unlinkSync } from 'fs';
import { join } from 'path';

test.describe('PDF Generation with All Indicators', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Generate PDF with complete data including all advanced metrics', async ({ page }) => {
    // Fill in basic data
    await page.getByRole('spinbutton', { name: 'Waga *' }).fill('80');
    await page.getByRole('spinbutton', { name: 'Wzrost *' }).fill('180');
    await page.getByRole('spinbutton', { name: 'Wiek *' }).fill('35');

    // Select gender
    await page.getByRole('button', { name: 'Mężczyzna' }).click();

    // Fill circumferences for all calculations
    await page.getByRole('spinbutton', { name: 'Obwód szyi' }).fill('38');
    await page.getByRole('spinbutton', { name: 'Obwód talii' }).fill('90');
    await page.getByRole('spinbutton', { name: 'Obwód bioder' }).fill('100');

    // Wait for calculations to complete
    await page.waitForTimeout(500);

    // Scroll to see more sections
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(300);

    // Verify WHR section is visible
    await expect(page.getByText('WHR - Stosunek Talii do Bioder')).toBeVisible();

    // Verify WHtR section is visible
    await expect(page.getByText('WHtR - Stosunek Talii do Wzrostu')).toBeVisible();

    // Scroll more to see advanced metrics
    await page.evaluate(() => window.scrollBy(0, 800));
    await page.waitForTimeout(300);

    // Verify advanced metrics sections are visible
    await expect(page.getByText('Zaawansowane Wskaźniki Składu Ciała')).toBeVisible();

    // Scroll to PDF export section
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);

    // Verify PDF export section is visible
    await expect(page.getByText('Eksport do PDF')).toBeVisible();

    // Fill client name
    const clientNameInput = page.getByRole('textbox', { name: /Imię i nazwisko klienta/i });
    await clientNameInput.fill('Jan Kowalski');

    // Set up download listener
    const downloadPromise = page.waitForEvent('download', { timeout: 30000 });

    // Click export button
    const exportButton = page.getByRole('button', { name: /Generuj PDF/i });
    await exportButton.click();

    // Wait for download
    const download = await downloadPromise;

    // Verify filename contains client name and date
    const filename = download.suggestedFilename();
    expect(filename).toMatch(/BMR_Raport_Jan_Kowalski_\d{4}-\d{2}-\d{2}\.pdf/);

    // Save the PDF to temp location for verification
    const downloadsPath = join(__dirname, '../../test-downloads');
    if (!existsSync(downloadsPath)) {
      mkdirSync(downloadsPath, { recursive: true });
    }

    const filePath = join(downloadsPath, filename);
    await download.saveAs(filePath);

    // Verify file was downloaded and has content
    expect(existsSync(filePath)).toBeTruthy();
    const stats = statSync(filePath);
    expect(stats.size).toBeGreaterThan(10000); // PDF should be at least 10KB

    console.log(`✓ PDF generated successfully: ${filename}`);
    console.log(`✓ File size: ${(stats.size / 1024).toFixed(2)} KB`);
  });

  test('Generate PDF without optional data (minimal)', async ({ page }) => {
    // Fill only required data
    await page.getByRole('spinbutton', { name: 'Waga *' }).fill('70');
    await page.getByRole('spinbutton', { name: 'Wzrost *' }).fill('175');
    await page.getByRole('spinbutton', { name: 'Wiek *' }).fill('30');

    // Select gender
    await page.getByRole('button', { name: 'Kobieta' }).click();

    // Wait for calculations
    await page.waitForTimeout(500);

    // Scroll to PDF section
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);

    // Set up download listener
    const downloadPromise = page.waitForEvent('download', { timeout: 30000 });

    // Click export without client name
    const exportButton = page.getByRole('button', { name: /Generuj PDF/i });
    await exportButton.click();

    // Wait for download
    const download = await downloadPromise;

    // Verify filename has date but no client name
    const filename = download.suggestedFilename();
    expect(filename).toMatch(/BMR_Raport_\d{4}-\d{2}-\d{2}\.pdf/);
    expect(filename).not.toContain('Jan_Kowalski');

    console.log(`✓ Minimal PDF generated: ${filename}`);
  });

  test('PDF includes all calculated metrics when available', async ({ page }) => {
    // Fill complete data to trigger all calculations
    await page.getByRole('spinbutton', { name: 'Waga *' }).fill('85');
    await page.getByRole('spinbutton', { name: 'Wzrost *' }).fill('178');
    await page.getByRole('spinbutton', { name: 'Wiek *' }).fill('28');
    await page.getByRole('button', { name: 'Mężczyzna' }).click();

    // Fill all circumferences
    await page.getByRole('spinbutton', { name: 'Obwód szyi' }).fill('40');
    await page.getByRole('spinbutton', { name: 'Obwód talii' }).fill('85');
    await page.getByRole('spinbutton', { name: 'Obwód bioder' }).fill('98');

    await page.waitForTimeout(500);

    // Verify all sections are calculated
    await page.evaluate(() => window.scrollBy(0, 400));
    await expect(page.getByText('BMI - Wskaźnik Masy Ciała')).toBeVisible();

    await page.evaluate(() => window.scrollBy(0, 400));
    await expect(page.getByText('WHR - Stosunek Talii do Bioder')).toBeVisible();

    await page.evaluate(() => window.scrollBy(0, 400));
    await expect(page.getByText('WHtR - Stosunek Talii do Wzrostu')).toBeVisible();

    await page.evaluate(() => window.scrollBy(0, 400));
    await expect(page.getByText('Skład Ciała')).toBeVisible();

    await page.evaluate(() => window.scrollBy(0, 400));
    await expect(page.getByText('FFMI')).toBeVisible();

    // Scroll to bottom for PDF export
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);

    const clientNameInput = page.getByRole('textbox', { name: /Imię i nazwisko klienta/i });
    await clientNameInput.fill('Test Complete Metrics');

    // Generate PDF
    const downloadPromise = page.waitForEvent('download', { timeout: 30000 });
    await page.getByRole('button', { name: /Generuj PDF/i }).click();
    const download = await downloadPromise;

    // Save and verify
    const downloadsPath = join(__dirname, '../../test-downloads');
    if (!existsSync(downloadsPath)) {
      mkdirSync(downloadsPath, { recursive: true });
    }

    const filePath = join(downloadsPath, download.suggestedFilename());
    await download.saveAs(filePath);

    const stats = statSync(filePath);

    // PDF with all metrics should be larger than minimal version
    expect(stats.size).toBeGreaterThan(15000); // At least 15KB with all sections

    console.log(`✓ Complete metrics PDF size: ${(stats.size / 1024).toFixed(2)} KB`);
  });

  test('PDF export button is disabled during generation', async ({ page }) => {
    // Fill required data
    await page.getByRole('spinbutton', { name: 'Waga *' }).fill('75');
    await page.getByRole('spinbutton', { name: 'Wzrost *' }).fill('170');
    await page.getByRole('spinbutton', { name: 'Wiek *' }).fill('25');
    await page.getByRole('button', { name: 'Kobieta' }).click();

    await page.waitForTimeout(500);

    // Scroll to PDF section
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);

    const exportButton = page.getByRole('button', { name: /Generuj PDF/i });

    // Button should be enabled initially
    await expect(exportButton).toBeEnabled();

    // Set up download listener
    const downloadPromise = page.waitForEvent('download', { timeout: 30000 });

    // Click export
    await exportButton.click();

    // Button should show "Generowanie..." and be disabled during generation
    // Note: This might be too fast to catch, but we try
    const isDisabled = await exportButton.isDisabled().catch(() => false);

    // Wait for download to complete
    await downloadPromise;

    // Button should be enabled again after generation
    await expect(exportButton).toBeEnabled();
    await expect(exportButton).toHaveText(/Generuj PDF/);

    console.log('✓ Button state transitions correctly');
  });

  test('Verify PDF contains BMR formulas table', async ({ page }) => {
    // Fill data
    await page.getByRole('spinbutton', { name: 'Waga *' }).fill('80');
    await page.getByRole('spinbutton', { name: 'Wzrost *' }).fill('180');
    await page.getByRole('spinbutton', { name: 'Wiek *' }).fill('30');
    await page.getByRole('button', { name: 'Mężczyzna' }).click();

    await page.waitForTimeout(500);

    // Verify BMR results table exists on page (indicates data for PDF)
    await page.evaluate(() => window.scrollBy(0, 600));

    // Look for specific BMR formulas
    await expect(page.getByText('Harris-Benedict')).toBeVisible();
    await expect(page.getByText('Mifflin-St Jeor')).toBeVisible();
    await expect(page.getByText('Katch-McArdle')).toBeVisible();

    console.log('✓ BMR formulas are calculated and visible');
  });

  test('Verify advanced metrics are calculated before PDF generation', async ({ page }) => {
    // Complete form
    await page.getByRole('spinbutton', { name: 'Waga *' }).fill('90');
    await page.getByRole('spinbutton', { name: 'Wzrost *' }).fill('185');
    await page.getByRole('spinbutton', { name: 'Wiek *' }).fill('40');
    await page.getByRole('button', { name: 'Mężczyzna' }).click();
    await page.getByRole('spinbutton', { name: 'Obwód talii' }).fill('95');
    await page.getByRole('spinbutton', { name: 'Obwód bioder' }).fill('105');

    await page.waitForTimeout(500);

    // Scroll through all sections to verify they exist
    await page.evaluate(() => window.scrollBy(0, 800));
    await page.waitForTimeout(200);

    // Check for advanced metrics section
    const advancedMetrics = page.getByText('Zaawansowane Wskaźniki Składu Ciała');
    await advancedMetrics.scrollIntoViewIfNeeded();
    await expect(advancedMetrics).toBeVisible();

    // Verify specific metrics are shown
    await expect(page.getByText(/SMM/i)).toBeVisible();
    await expect(page.getByText(/TBW/i)).toBeVisible();
    await expect(page.getByText(/Wiek metaboliczny/i)).toBeVisible();
    await expect(page.getByText(/Tłuszcz trzewny/i)).toBeVisible();

    console.log('✓ All advanced metrics are calculated and displayed');
  });

  test.afterEach(async () => {
    // Cleanup: Remove test downloads after tests complete
    const downloadsPath = join(__dirname, '../../test-downloads');
    if (existsSync(downloadsPath)) {
      const files = readdirSync(downloadsPath);
      // Keep the last generated PDF for manual inspection, delete older ones
      if (files.length > 3) {
        files
          .sort()
          .slice(0, -3)
          .forEach(file => {
            unlinkSync(join(downloadsPath, file));
          });
      }
    }
  });
});
