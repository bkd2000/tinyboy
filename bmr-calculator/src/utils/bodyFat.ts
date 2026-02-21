/**
 * Body Fat Percentage Estimation Methods
 */

import type { NavyMethodParams, DeurenbergParams } from '../types';

/**
 * US Navy Method
 * Reference: US Navy Circumference Method
 *
 * Uses body circumferences and height to estimate body fat percentage
 *
 * Men: Uses neck, waist, and height
 * Women: Uses neck, waist, hips, and height
 */
export function estimateBodyFatUSNavy(params: NavyMethodParams): number {
  const { height, neck, waist, hip, gender } = params;

  if (gender === 'male') {
    // Men's formula: 495 / (1.0324 - 0.19077 × log10(waist - neck) + 0.15456 × log10(height)) - 450
    const log10WaistMinusNeck = Math.log10(waist - neck);
    const log10Height = Math.log10(height);

    const denominator = 1.0324 - (0.19077 * log10WaistMinusNeck) + (0.15456 * log10Height);
    const bodyFat = (495 / denominator) - 450;

    return Math.max(0, Math.min(100, bodyFat)); // Clamp between 0-100%
  } else {
    // Women's formula: 495 / (1.29579 - 0.35004 × log10(waist + hip - neck) + 0.22100 × log10(height)) - 450
    if (hip === undefined) {
      throw new Error('Hip measurement required for female body fat estimation');
    }

    const log10WaistPlusHipMinusNeck = Math.log10(waist + hip - neck);
    const log10Height = Math.log10(height);

    const denominator = 1.29579 - (0.35004 * log10WaistPlusHipMinusNeck) + (0.22100 * log10Height);
    const bodyFat = (495 / denominator) - 450;

    return Math.max(0, Math.min(100, bodyFat)); // Clamp between 0-100%
  }
}

/**
 * Deurenberg BMI-based Method
 * Reference: Deurenberg P et al. Body mass index as a measure of body fatness. Br J Nutr 1991.
 *
 * Estimates body fat percentage based on BMI, age, and gender
 * Formula: (1.20 × BMI) + (0.23 × Age) - (10.8 × Gender) - 5.4
 * Gender: 1 for male, 0 for female
 */
export function estimateBodyFatDeurenberg(params: DeurenbergParams): number {
  const { bmi, age, gender } = params;

  const genderValue = gender === 'male' ? 1 : 0;
  const bodyFat = (1.20 * bmi) + (0.23 * age) - (10.8 * genderValue) - 5.4;

  return Math.max(0, Math.min(100, bodyFat)); // Clamp between 0-100%
}

/**
 * Get body fat category description
 */
export function getBodyFatCategory(bodyFat: number, gender: 'male' | 'female'): {
  category: string;
  description: string;
  color: string;
} {
  if (gender === 'male') {
    if (bodyFat < 6) return { category: 'Bardzo niski', description: 'Niezbędny tłuszcz', color: 'danger' };
    if (bodyFat < 14) return { category: 'Sportowiec', description: 'Niski poziom tłuszczu', color: 'success' };
    if (bodyFat < 18) return { category: 'Fitness', description: 'Zdrowy poziom fitness', color: 'success' };
    if (bodyFat < 25) return { category: 'Przeciętny', description: 'Akceptowalny poziom', color: 'warning' };
    return { category: 'Podwyższony', description: 'Powyżej zdrowego zakresu', color: 'danger' };
  } else {
    if (bodyFat < 14) return { category: 'Bardzo niski', description: 'Niezbędny tłuszcz', color: 'danger' };
    if (bodyFat < 21) return { category: 'Sportowiec', description: 'Niski poziom tłuszczu', color: 'success' };
    if (bodyFat < 25) return { category: 'Fitness', description: 'Zdrowy poziom fitness', color: 'success' };
    if (bodyFat < 32) return { category: 'Przeciętny', description: 'Akceptowalny poziom', color: 'warning' };
    return { category: 'Podwyższony', description: 'Powyżej zdrowego zakresu', color: 'danger' };
  }
}
