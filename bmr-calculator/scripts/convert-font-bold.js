/**
 * Font converter for jsPDF - converts TTF to base64 format (Bold variant)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const fontPath = path.join(__dirname, '../public/fonts/Roboto-Bold.ttf');
const outputPath = path.join(__dirname, '../src/fonts/Roboto-Bold.ts');

// Read font file
const fontBuffer = fs.readFileSync(fontPath);
const base64Font = fontBuffer.toString('base64');

// Generate TypeScript module
const content = `/**
 * Roboto Bold font in base64 format for jsPDF
 * Auto-generated - do not edit manually
 */
export const RobotoBoldBase64 = '${base64Font}';
`;

// Ensure output directory exists
const outputDir = path.dirname(outputPath);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Write output
fs.writeFileSync(outputPath, content);

console.log(`✅ Bold font converted successfully!`);
console.log(`   Input: ${fontPath}`);
console.log(`   Output: ${outputPath}`);
console.log(`   Size: ${(base64Font.length / 1024).toFixed(2)} KB`);
