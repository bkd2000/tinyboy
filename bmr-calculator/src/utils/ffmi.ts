import type { Gender, FFMICategory, FFMIData } from '../types';

/**
 * Calculate FFMI (Fat-Free Mass Index)
 * FFMI = FFM / (height_m²)
 */
export function calculateFFMI(ffm: number, height: number): number {
  const heightInMeters = height / 100;
  return ffm / Math.pow(heightInMeters, 2);
}

/**
 * Calculate Normalized FFMI (adjusted for height)
 * Normalized FFMI = FFMI + 6.1 × (1.8 - height_m)
 */
export function calculateNormalizedFFMI(ffmi: number, height: number): number {
  const heightInMeters = height / 100;
  return ffmi + 6.1 * (1.8 - heightInMeters);
}

/**
 * Get FFMI category based on value and gender
 */
export function getFFMICategory(ffmi: number, gender: Gender): FFMICategory {
  if (gender === 'male') {
    if (ffmi > 26) return 'suspicious';
    if (ffmi > 23) return 'excellent';
    if (ffmi > 22) return 'very-good';
    if (ffmi > 20) return 'above-average';
    if (ffmi >= 18) return 'average';
    return 'below-average';
  } else {
    if (ffmi > 22) return 'suspicious';
    if (ffmi > 20) return 'excellent';
    if (ffmi > 18) return 'very-good';
    if (ffmi > 17) return 'above-average';
    if (ffmi >= 15) return 'average';
    return 'below-average';
  }
}

/**
 * Get FFMI category label
 */
export function getFFMICategoryLabel(category: FFMICategory): string {
  const labels: Record<FFMICategory, string> = {
    'below-average': 'Poniżej przeciętnej',
    'average': 'Przeciętna',
    'above-average': 'Powyżej przeciętnej',
    'very-good': 'Bardzo dobra',
    'excellent': 'Doskonała',
    'suspicious': 'Podejrzana',
  };
  return labels[category];
}

/**
 * Get FFMI category description
 */
export function getFFMICategoryDescription(category: FFMICategory, gender: Gender): string {
  const descriptions: Record<FFMICategory, string> = {
    'below-average': 'Wartość poniżej przeciętnej dla populacji. Możliwy niedostatek masy mięśniowej.',
    'average': 'Wartość przeciętna dla populacji. Typowy poziom dla osób nietrenujących.',
    'above-average': 'Wartość powyżej przeciętnej. Dobry poziom masy beztłuszczowej.',
    'very-good': 'Bardzo dobry poziom masy beztłuszczowej. Charakterystyczny dla osób regularnie trenujących.',
    'excellent': 'Doskonały poziom masy beztłuszczowej. Osiągalny przy optymalnym treningu i diecie.',
    'suspicious': gender === 'male'
      ? 'FFMI > 26 jest rzadkie bez wspomagania farmakologicznego (sterydy anaboliczne).'
      : 'FFMI > 22 jest rzadkie bez wspomagania farmakologicznego (sterydy anaboliczne).',
  };
  return descriptions[category];
}

/**
 * Get FFMI category color
 */
export function getFFMICategoryColor(category: FFMICategory): 'success' | 'warning' | 'danger' {
  switch (category) {
    case 'below-average':
    case 'average':
      return 'warning';
    case 'above-average':
    case 'very-good':
    case 'excellent':
      return 'success';
    case 'suspicious':
      return 'danger';
  }
}

/**
 * Get complete FFMI data
 */
export function getFFMIData(ffm: number, height: number, gender: Gender): FFMIData {
  const ffmi = calculateFFMI(ffm, height);
  const normalizedFFMI = calculateNormalizedFFMI(ffmi, height);
  const category = getFFMICategory(ffmi, gender);

  return {
    ffmi,
    normalizedFFMI,
    category,
  };
}
