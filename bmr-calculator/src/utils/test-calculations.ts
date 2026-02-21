/**
 * Test calculations to verify all formulas work correctly
 * Run this with: node --loader ts-node/esm src/utils/test-calculations.ts
 */

import { calculateAllBMR } from './bmrModels';
import { estimateBodyFatUSNavy, estimateBodyFatDeurenberg } from './bodyFat';
import { getBMIData } from './bmi';
import { calculateTDEE } from './tdee';
import type { BMRParams } from '../types';

// Test data: 30-year-old male, 70kg, 175cm
const testParams: BMRParams = {
  weight: 70,
  height: 175,
  age: 30,
  gender: 'male',
};

console.log('=== BMR Calculator Test ===\n');
console.log('Test Parameters:', testParams);
console.log('');

// Test BMR calculations
console.log('--- BMR Results (without body fat %) ---');
const bmrResults = calculateAllBMR(testParams);

bmrResults.results.forEach(result => {
  const valueStr = result.value !== null
    ? `${Math.round(result.value)} kcal/day`
    : 'N/A (requires body fat %)';
  console.log(`${result.model} (${result.year}): ${valueStr}`);
});

console.log('');
console.log(`Average BMR: ${Math.round(bmrResults.average)} kcal/day`);
console.log(`Min: ${Math.round(bmrResults.min)} kcal/day`);
console.log(`Max: ${Math.round(bmrResults.max)} kcal/day`);
console.log('');

// Test body fat estimation - US Navy
console.log('--- Body Fat Estimation (US Navy Method) ---');
const navyBodyFat = estimateBodyFatUSNavy({
  height: 175,
  neck: 37,
  waist: 85,
  gender: 'male',
});
console.log(`Body Fat: ${navyBodyFat.toFixed(1)}%`);
console.log('');

// Test body fat estimation - Deurenberg
console.log('--- Body Fat Estimation (Deurenberg Method) ---');
const bmiForDeurenberg = 70 / Math.pow(1.75, 2); // ~22.9
const deurenbergBodyFat = estimateBodyFatDeurenberg({
  bmi: bmiForDeurenberg,
  age: 30,
  gender: 'male',
});
console.log(`Body Fat: ${deurenbergBodyFat.toFixed(1)}%`);
console.log('');

// Test BMR with body fat percentage
console.log('--- BMR Results (with body fat %) ---');
const bmrWithBF = calculateAllBMR(testParams, navyBodyFat);
const katchResult = bmrWithBF.results.find(r => r.model === 'Katch-McArdle');
const cunninghamResult = bmrWithBF.results.find(r => r.model === 'Cunningham');

if (katchResult?.value) {
  console.log(`Katch-McArdle: ${Math.round(katchResult.value)} kcal/day`);
}
if (cunninghamResult?.value) {
  console.log(`Cunningham: ${Math.round(cunninghamResult.value)} kcal/day`);
}
console.log(`New Average: ${Math.round(bmrWithBF.average)} kcal/day`);
console.log('');

// Test BMI
console.log('--- BMI Calculation ---');
const bmiData = getBMIData(testParams.weight, testParams.height);
console.log(`BMI: ${bmiData.value}`);
console.log(`Category: ${bmiData.category}`);
console.log(`Healthy weight range: ${bmiData.healthyWeightRange.min}kg - ${bmiData.healthyWeightRange.max}kg`);
console.log('');

// Test TDEE
console.log('--- TDEE Calculation ---');
const activityLevels = [
  { label: 'Sedentary', value: 1.2 },
  { label: 'Light', value: 1.375 },
  { label: 'Moderate', value: 1.55 },
  { label: 'Very Active', value: 1.725 },
  { label: 'Extremely Active', value: 1.9 },
];

activityLevels.forEach(level => {
  const tdee = calculateTDEE(bmrResults.average, level.value);
  console.log(`${level.label} (${level.value}): ${tdee} kcal/day`);
});

console.log('\n=== All Tests Complete ===');
