import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
});

test('PDF generation with complete data including all metrics', async ({ page }) => {
  // Fill in basic data
  await page.getByRole('spinbutton', { name: 'Waga *' }).fill('80');
  await page.getByRole('spinbutton', { name: 'Wzrost *' }).fill('180');
  await page.getByRole('spinbutton', { name: 'Wiek *' }).fill('35');
  await page.getByRole('button', { name: 'Mężczyzna' }).click();

  // Fill circumferences for all calculations
  await page.getByRole('spinbutton', { name: 'Obwód szyi' }).fill('38');
  await page.getByRole('spinbutton', { name: 'Obwód talii' }).fill('90');
  await page.getByRole('spinbutton', { name: 'Obwód bioder' }).fill('100');

  // Wait for calculations to complete
  await page.waitForTimeout(1500);

  // Scroll directly to PDF export section
  const pdfSection = page.getByText('Eksport do PDF');
  await pdfSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  // Verify PDF export section is visible
  await expect(pdfSection).toBeVisible();

  // Fill client name
  await page.getByRole('textbox', { name: /Imię i nazwisko klienta/i }).fill('Jan Kowalski');

  // Set up download listener
  const downloadPromise = page.waitForEvent('download', { timeout: 30000 });

  // Click export button
  await page.getByRole('button', { name: /Generuj PDF/i }).click();

  // Wait for download
  const download = await downloadPromise;

  // Verify filename contains client name and date
  const filename = download.suggestedFilename();
  expect(filename).toMatch(/BMR_Raport_Jan_Kowalski_\d{4}-\d{2}-\d{2}\.pdf/);

  console.log(`✓ PDF generated successfully: ${filename}`);
});

test('PDF generation without optional data (minimal)', async ({ page }) => {
  // Fill only required data
  await page.getByRole('spinbutton', { name: 'Waga *' }).fill('70');
  await page.getByRole('spinbutton', { name: 'Wzrost *' }).fill('175');
  await page.getByRole('spinbutton', { name: 'Wiek *' }).fill('30');
  await page.getByRole('button', { name: 'Kobieta' }).click();

  await page.waitForTimeout(1000);

  // Scroll to PDF section
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);

  // Set up download listener
  const downloadPromise = page.waitForEvent('download', { timeout: 30000 });

  // Click export without client name
  await page.getByRole('button', { name: /Generuj PDF/i }).click();

  // Wait for download
  const download = await downloadPromise;

  // Verify filename has date but no client name
  const filename = download.suggestedFilename();
  expect(filename).toMatch(/BMR_Raport_\d{4}-\d{2}-\d{2}\.pdf/);
  expect(filename).not.toContain('Jan_Kowalski');

  console.log(`✓ Minimal PDF generated: ${filename}`);
});

test('Verify all advanced metrics are calculated before PDF', async ({ page }) => {
  // Complete form with all data
  await page.getByRole('spinbutton', { name: 'Waga *' }).fill('90');
  await page.getByRole('spinbutton', { name: 'Wzrost *' }).fill('185');
  await page.getByRole('spinbutton', { name: 'Wiek *' }).fill('40');
  await page.getByRole('button', { name: 'Mężczyzna' }).click();
  await page.getByRole('spinbutton', { name: 'Obwód talii' }).fill('95');
  await page.getByRole('spinbutton', { name: 'Obwód bioder' }).fill('105');
  await page.getByRole('spinbutton', { name: 'Obwód szyi' }).fill('40');

  await page.waitForTimeout(1000);

  // Scroll and verify BMI
  await page.evaluate(() => window.scrollBy(0, 400));
  await expect(page.getByText('BMI - Wskaźnik Masy Ciała')).toBeVisible();

  // Verify WHR
  await page.evaluate(() => window.scrollBy(0, 400));
  await expect(page.getByText('WHR - Stosunek Talii do Bioder')).toBeVisible();

  // Verify WHtR
  await page.evaluate(() => window.scrollBy(0, 400));
  await expect(page.getByText('WHtR - Stosunek Talii do Wzrostu')).toBeVisible();

  // Verify Body Composition
  await page.evaluate(() => window.scrollBy(0, 400));
  await expect(page.getByText('Skład Ciała')).toBeVisible();

  // Verify FFMI
  await page.evaluate(() => window.scrollBy(0, 400));
  await expect(page.getByText('FFMI')).toBeVisible();

  // Verify Advanced Metrics
  await page.evaluate(() => window.scrollBy(0, 400));
  const advancedMetrics = page.getByText('Zaawansowane Wskaźniki Składu Ciała');
  await advancedMetrics.scrollIntoViewIfNeeded();
  await expect(advancedMetrics).toBeVisible();

  // Verify specific metrics
  await expect(page.getByText(/SMM/i)).toBeVisible();
  await expect(page.getByText(/TBW/i)).toBeVisible();
  await expect(page.getByText(/Wiek metaboliczny/i)).toBeVisible();
  await expect(page.getByText(/Tłuszcz trzewny/i)).toBeVisible();

  console.log('✓ All advanced metrics are calculated and displayed');
});

test('PDF export button is ready and enabled', async ({ page }) => {
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
