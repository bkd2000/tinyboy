import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test('Generate PDF with Polish characters', async ({ page }) => {
  // Navigate to the app
  await page.goto('http://localhost:5174');

  // Wait for app to load
  await page.waitForSelector('h1:has-text("Kalkulator BMR")');

  // Fill form with test data
  await page.fill('input[id="weight"]', '106');
  await page.fill('input[id="height"]', '183');
  await page.fill('input[id="age"]', '50');
  await page.click('input[id="male"]');

  // Select activity level
  await page.click('input[value="1.375"]'); // Lekko aktywny

  // Click calculate button
  await page.click('button:has-text("Oblicz BMR")');

  // Wait for results
  await page.waitForSelector('text=Wyniki BMR', { timeout: 5000 });

  // Enter client name for PDF
  await page.fill('input[placeholder="Wprowadź imię klienta (opcjonalne)"]', 'Bartosz');

  // Setup download listener
  const downloadPromise = page.waitForEvent('download');

  // Click PDF export button
  await page.click('button:has-text("Generuj raport PDF")');

  // Wait for download
  const download = await downloadPromise;

  // Get download path
  const downloadPath = path.join('/tmp', await download.suggestedFilename());

  // Save file
  await download.saveAs(downloadPath);

  console.log(`✅ PDF downloaded to: ${downloadPath}`);

  // Verify file exists and has content
  const fileStats = fs.statSync(downloadPath);
  expect(fileStats.size).toBeGreaterThan(10000); // Should be at least 10KB

  console.log(`✅ PDF size: ${(fileStats.size / 1024).toFixed(2)} KB`);
  console.log(`✅ Test completed successfully!`);
});
