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
 * Get body fat category based on age and gender
 * Reference: Age-adjusted body fat norms
 */
export function getBodyFatCategoryByAge(bodyFat: number, age: number, gender: 'male' | 'female'): {
  category: string;
  description: string;
  color: string;
  range: string;
} {
  if (gender === 'female') {
    // Women's age-adjusted norms
    let underweight: number, normalMin: number, normalMax: number, overweight1: number, overweight2: number;

    if (age >= 19 && age <= 24) {
      underweight = 18.9;
      normalMin = 18.9;
      normalMax = 22.1;
      overweight1 = 25.0;
      overweight2 = 29.6;
    } else if (age >= 25 && age <= 29) {
      underweight = 18.9;
      normalMin = 18.9;
      normalMax = 22.0;
      overweight1 = 25.4;
      overweight2 = 29.8;
    } else if (age >= 30 && age <= 34) {
      underweight = 19.7;
      normalMin = 19.7;
      normalMax = 22.7;
      overweight1 = 26.4;
      overweight2 = 30.5;
    } else if (age >= 35 && age <= 39) {
      underweight = 21.0;
      normalMin = 21.0;
      normalMax = 24.0;
      overweight1 = 27.7;
      overweight2 = 31.5;
    } else if (age >= 40 && age <= 44) {
      underweight = 22.6;
      normalMin = 22.6;
      normalMax = 25.6;
      overweight1 = 29.3;
      overweight2 = 32.8;
    } else if (age >= 45 && age <= 49) {
      underweight = 24.3;
      normalMin = 24.3;
      normalMax = 27.3;
      overweight1 = 30.9;
      overweight2 = 34.1;
    } else if (age >= 50 && age <= 54) {
      underweight = 26.6;
      normalMin = 26.6;
      normalMax = 29.7;
      overweight1 = 33.1;
      overweight2 = 36.2;
    } else if (age >= 55 && age <= 59) {
      underweight = 27.4;
      normalMin = 27.4;
      normalMax = 30.7;
      overweight1 = 34.0;
      overweight2 = 37.3;
    } else { // 60+
      underweight = 27.6;
      normalMin = 27.6;
      normalMax = 31.0;
      overweight1 = 34.4;
      overweight2 = 38.0;
    }

    if (bodyFat < underweight) {
      return {
        category: 'Niedowaga',
        description: `Poniżej normy dla wieku ${age} lat`,
        color: 'warning',
        range: `<${underweight.toFixed(1)}%`
      };
    } else if (bodyFat >= normalMin && bodyFat <= normalMax) {
      return {
        category: 'Norma/Idealna',
        description: `Prawidłowy poziom dla wieku ${age} lat`,
        color: 'success',
        range: `${normalMin.toFixed(1)}–${normalMax.toFixed(1)}%`
      };
    } else if (bodyFat > normalMax && bodyFat <= overweight1) {
      return {
        category: 'I stopień nadwagi',
        description: `Lekka nadwaga dla wieku ${age} lat`,
        color: 'warning',
        range: `${normalMax.toFixed(1)}–${overweight1.toFixed(1)}%`
      };
    } else if (bodyFat > overweight1 && bodyFat <= overweight2) {
      return {
        category: 'Nadwaga',
        description: `Nadwaga dla wieku ${age} lat`,
        color: 'danger',
        range: `${overweight1.toFixed(1)}–${overweight2.toFixed(1)}%`
      };
    } else {
      return {
        category: 'Otyłość',
        description: `Otyłość dla wieku ${age} lat`,
        color: 'danger',
        range: `>${overweight2.toFixed(1)}%`
      };
    }
  } else {
    // Men's age-adjusted norms
    let underweight: number, normalMin: number, normalMax: number, overweight1: number, overweight2: number;

    if (age >= 19 && age <= 24) {
      underweight = 10.8;
      normalMin = 10.8;
      normalMax = 14.9;
      overweight1 = 19.0;
      overweight2 = 23.3;
    } else if (age >= 25 && age <= 29) {
      underweight = 12.8;
      normalMin = 12.8;
      normalMax = 16.5;
      overweight1 = 20.3;
      overweight2 = 24.4;
    } else if (age >= 30 && age <= 34) {
      underweight = 14.5;
      normalMin = 14.5;
      normalMax = 18.0;
      overweight1 = 21.5;
      overweight2 = 25.2;
    } else if (age >= 35 && age <= 39) {
      underweight = 16.1;
      normalMin = 16.1;
      normalMax = 19.4;
      overweight1 = 22.6;
      overweight2 = 26.1;
    } else if (age >= 40 && age <= 44) {
      underweight = 17.5;
      normalMin = 17.5;
      normalMax = 20.5;
      overweight1 = 23.6;
      overweight2 = 26.9;
    } else if (age >= 45 && age <= 49) {
      underweight = 18.6;
      normalMin = 18.6;
      normalMax = 21.5;
      overweight1 = 24.5;
      overweight2 = 27.6;
    } else if (age >= 50 && age <= 54) {
      underweight = 19.8;
      normalMin = 19.8;
      normalMax = 22.7;
      overweight1 = 25.6;
      overweight2 = 28.7;
    } else if (age >= 55 && age <= 59) {
      underweight = 20.2;
      normalMin = 20.2;
      normalMax = 23.2;
      overweight1 = 26.2;
      overweight2 = 29.3;
    } else { // 60+
      underweight = 20.3;
      normalMin = 20.3;
      normalMax = 23.5;
      overweight1 = 26.7;
      overweight2 = 29.8;
    }

    if (bodyFat < underweight) {
      return {
        category: 'Niedowaga',
        description: `Poniżej normy dla wieku ${age} lat`,
        color: 'warning',
        range: `<${underweight.toFixed(1)}%`
      };
    } else if (bodyFat >= normalMin && bodyFat <= normalMax) {
      return {
        category: 'Norma/Idealna',
        description: `Prawidłowy poziom dla wieku ${age} lat`,
        color: 'success',
        range: `${normalMin.toFixed(1)}–${normalMax.toFixed(1)}%`
      };
    } else if (bodyFat > normalMax && bodyFat <= overweight1) {
      return {
        category: 'I stopień nadwagi',
        description: `Lekka nadwaga dla wieku ${age} lat`,
        color: 'warning',
        range: `${normalMax.toFixed(1)}–${overweight1.toFixed(1)}%`
      };
    } else if (bodyFat > overweight1 && bodyFat <= overweight2) {
      return {
        category: 'Nadwaga',
        description: `Nadwaga dla wieku ${age} lat`,
        color: 'danger',
        range: `${overweight1.toFixed(1)}–${overweight2.toFixed(1)}%`
      };
    } else {
      return {
        category: 'Otyłość',
        description: `Otyłość dla wieku ${age} lat`,
        color: 'danger',
        range: `>${overweight2.toFixed(1)}%`
      };
    }
  }
}

/**
 * Get body fat category description (legacy - simple categorization)
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
