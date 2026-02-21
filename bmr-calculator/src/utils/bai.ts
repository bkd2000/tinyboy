import type { Gender, BAICategory, BAIData } from '../types';

/**
 * Calculate BAI (Body Adiposity Index)
 * Formula: BAI = (hip_cm / (height_m^1.5)) - 18
 *
 * @param hipCircumference - Hip circumference in cm
 * @param height - Height in cm
 * @returns BAI value (percentage of body fat)
 */
export function calculateBAI(hipCircumference: number, height: number): number {
  const heightInMeters = height / 100;
  const bai = (hipCircumference / Math.pow(heightInMeters, 1.5)) - 18;
  return Math.round(bai * 10) / 10; // Round to 1 decimal place
}

/**
 * Get BAI category based on value and gender
 *
 * Men:
 * - < 8%: very-low (warning)
 * - 8-14%: athletic (success)
 * - 15-19%: normal (success)
 * - 20-24%: average (warning)
 * - >= 25%: elevated (danger)
 *
 * Women:
 * - < 21%: very-low (warning)
 * - 21-26%: athletic (success)
 * - 27-33%: normal (success)
 * - 34-39%: average (warning)
 * - >= 40%: elevated (danger)
 *
 * @param bai - BAI value
 * @param gender - Gender ('male' or 'female')
 * @returns BAI category
 */
export function getBAICategory(bai: number, gender: Gender): BAICategory {
  if (gender === 'male') {
    if (bai < 8) return 'very-low';
    if (bai < 15) return 'athletic';
    if (bai < 20) return 'normal';
    if (bai < 25) return 'average';
    return 'elevated';
  } else {
    if (bai < 21) return 'very-low';
    if (bai < 27) return 'athletic';
    if (bai < 34) return 'normal';
    if (bai < 40) return 'average';
    return 'elevated';
  }
}

/**
 * Get human-readable label for BAI category
 */
export function getBAICategoryLabel(category: BAICategory): string {
  const labels: Record<BAICategory, string> = {
    'very-low': 'Bardzo niski',
    'athletic': 'Atletyczny',
    'normal': 'Normalny',
    'average': 'Przeciętny',
    'elevated': 'Podwyższony',
  };
  return labels[category];
}

/**
 * Get detailed description for BAI category
 */
export function getBAICategoryDescription(category: BAICategory, gender: Gender): string {
  if (gender === 'male') {
    const descriptions: Record<BAICategory, string> = {
      'very-low': 'Bardzo niski poziom tkanki tłuszczowej (< 8%). Może wskazywać na niedożywienie lub ekstremalnie niski poziom tłuszczu. Skonsultuj się z lekarzem.',
      'athletic': 'Poziom atletyczny (8-14%). Charakterystyczny dla sportowców i osób bardzo aktywnych fizycznie. Optymalny dla wydolności sportowej.',
      'normal': 'Normalny poziom tkanki tłuszczowej (15-19%). Zdrowy zakres dla większości mężczyzn. Dobry balans między zdrowiem a kondycją.',
      'average': 'Przeciętny poziom (20-24%). Akceptowalny, ale warto rozważyć zwiększenie aktywności fizycznej i poprawę diety.',
      'elevated': 'Podwyższony poziom tkanki tłuszczowej (≥ 25%). Zalecane jest zmniejszenie tkanki tłuszczowej poprzez dietę i ćwiczenia.',
    };
    return descriptions[category];
  } else {
    const descriptions: Record<BAICategory, string> = {
      'very-low': 'Bardzo niski poziom tkanki tłuszczowej (< 21%). Może wskazywać na niedożywienie lub ekstremalnie niski poziom tłuszczu. Skonsultuj się z lekarzem.',
      'athletic': 'Poziom atletyczny (21-26%). Charakterystyczny dla sportsmenek i osób bardzo aktywnych fizycznie. Optymalny dla wydolności sportowej.',
      'normal': 'Normalny poziom tkanki tłuszczowej (27-33%). Zdrowy zakres dla większości kobiet. Dobry balans między zdrowiem a kondycją.',
      'average': 'Przeciętny poziom (34-39%). Akceptowalny, ale warto rozważyć zwiększenie aktywności fizycznej i poprawę diety.',
      'elevated': 'Podwyższony poziom tkanki tłuszczowej (≥ 40%). Zalecane jest zmniejszenie tkanki tłuszczowej poprzez dietę i ćwiczenia.',
    };
    return descriptions[category];
  }
}

/**
 * Get color variant for BAI category
 */
export function getBAICategoryColor(category: BAICategory): 'success' | 'warning' | 'danger' {
  const colors: Record<BAICategory, 'success' | 'warning' | 'danger'> = {
    'very-low': 'warning',
    'athletic': 'success',
    'normal': 'success',
    'average': 'warning',
    'elevated': 'danger',
  };
  return colors[category];
}

/**
 * Get complete BAI data including value and category
 */
export function getBAIData(hipCircumference: number, height: number, gender: Gender): BAIData {
  const value = calculateBAI(hipCircumference, height);
  const category = getBAICategory(value, gender);

  return {
    value,
    category,
  };
}

/**
 * Get scale ranges for BAI visualization based on gender
 * Returns array of 5 ranges with colors
 */
export function getBAIScaleRanges(gender: Gender): Array<{
  min: number;
  max: number;
  label: string;
  color: string;
  category: BAICategory;
}> {
  if (gender === 'male') {
    return [
      { min: 0, max: 8, label: 'Bardzo niski', color: 'bg-yellow-200', category: 'very-low' },
      { min: 8, max: 15, label: 'Atletyczny', color: 'bg-green-300', category: 'athletic' },
      { min: 15, max: 20, label: 'Normalny', color: 'bg-green-500', category: 'normal' },
      { min: 20, max: 25, label: 'Przeciętny', color: 'bg-orange-400', category: 'average' },
      { min: 25, max: 50, label: 'Podwyższony', color: 'bg-red-500', category: 'elevated' },
    ];
  } else {
    return [
      { min: 0, max: 21, label: 'Bardzo niski', color: 'bg-yellow-200', category: 'very-low' },
      { min: 21, max: 27, label: 'Atletyczny', color: 'bg-green-300', category: 'athletic' },
      { min: 27, max: 34, label: 'Normalny', color: 'bg-green-500', category: 'normal' },
      { min: 34, max: 40, label: 'Przeciętny', color: 'bg-orange-400', category: 'average' },
      { min: 40, max: 70, label: 'Podwyższony', color: 'bg-red-500', category: 'elevated' },
    ];
  }
}
