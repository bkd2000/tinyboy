import type { Gender, LBMResult, LBMData, FFMData, BodyCompositionData } from '../types';

/**
 * Calculate LBM using Boer formula
 * Men: LBM = 0.407 × weight + 0.267 × height - 19.2
 * Women: LBM = 0.252 × weight + 0.473 × height - 48.3
 */
export function calculateLBMBoer(weight: number, height: number, gender: Gender): number {
  if (gender === 'male') {
    return 0.407 * weight + 0.267 * height - 19.2;
  } else {
    return 0.252 * weight + 0.473 * height - 48.3;
  }
}

/**
 * Calculate LBM using James formula
 * Men: LBM = 1.10 × weight - 128 × (weight/height)²
 * Women: LBM = 1.07 × weight - 148 × (weight/height)²
 */
export function calculateLBMJames(weight: number, height: number, gender: Gender): number {
  if (gender === 'male') {
    return 1.10 * weight - 128 * Math.pow(weight / height, 2);
  } else {
    return 1.07 * weight - 148 * Math.pow(weight / height, 2);
  }
}

/**
 * Calculate LBM using Hume formula
 * Men: LBM = 0.32810 × weight + 0.33929 × height - 29.5336
 * Women: LBM = 0.29569 × weight + 0.41813 × height - 43.2933
 */
export function calculateLBMHume(weight: number, height: number, gender: Gender): number {
  if (gender === 'male') {
    return 0.32810 * weight + 0.33929 * height - 29.5336;
  } else {
    return 0.29569 * weight + 0.41813 * height - 43.2933;
  }
}

/**
 * Calculate FFM (Fat-Free Mass) from weight and body fat percentage
 * FFM = weight - (weight × bodyFatPercentage / 100)
 */
export function calculateFFM(weight: number, bodyFatPercentage: number): FFMData {
  const ffm = weight - (weight * bodyFatPercentage / 100);
  const percentage = (ffm / weight) * 100;

  return {
    ffm,
    percentage,
    breakdown: {
      water: ffm * 0.73, // ~73% of FFM is water
      protein: ffm * 0.20, // ~20% of FFM is protein
      minerals: ffm * 0.07, // ~7% of FFM is minerals
    },
  };
}

/**
 * Get comprehensive body composition data combining LBM and FFM
 */
export function getBodyCompositionData(
  weight: number,
  height: number,
  gender: Gender,
  bodyFatPercentage?: number
): BodyCompositionData {
  // Calculate LBM using all three formulas
  const lbmBoer = calculateLBMBoer(weight, height, gender);
  const lbmJames = calculateLBMJames(weight, height, gender);
  const lbmHume = calculateLBMHume(weight, height, gender);

  const results: LBMResult[] = [
    {
      formula: 'boer',
      value: lbmBoer,
      percentage: (lbmBoer / weight) * 100,
      year: '1984',
    },
    {
      formula: 'james',
      value: lbmJames,
      percentage: (lbmJames / weight) * 100,
      year: '1976',
    },
    {
      formula: 'hume',
      value: lbmHume,
      percentage: (lbmHume / weight) * 100,
      year: '1966',
    },
  ];

  const average = (lbmBoer + lbmJames + lbmHume) / 3;
  const averagePercentage = (average / weight) * 100;

  const lbmData: LBMData = {
    results,
    average,
    averagePercentage,
  };

  // Calculate FFM if body fat percentage is available
  const ffmData = bodyFatPercentage !== undefined
    ? calculateFFM(weight, bodyFatPercentage)
    : undefined;

  // Calculate difference between FFM and LBM if FFM is available
  const difference = ffmData ? ffmData.ffm - average : undefined;

  return {
    lbm: lbmData,
    ffm: ffmData,
    difference,
  };
}

/**
 * Get LBM category based on percentage and gender
 */
export function getLBMCategory(lbmPercentage: number, gender: Gender): string {
  if (gender === 'male') {
    if (lbmPercentage < 70) return 'Niska';
    if (lbmPercentage < 75) return 'Poniżej przeciętnej';
    if (lbmPercentage < 80) return 'Przeciętna';
    if (lbmPercentage < 85) return 'Powyżej przeciętnej';
    return 'Wysoka';
  } else {
    if (lbmPercentage < 60) return 'Niska';
    if (lbmPercentage < 65) return 'Poniżej przeciętnej';
    if (lbmPercentage < 70) return 'Przeciętna';
    if (lbmPercentage < 75) return 'Powyżej przeciętnej';
    return 'Wysoka';
  }
}
