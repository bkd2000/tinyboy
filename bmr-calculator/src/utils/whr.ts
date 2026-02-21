/**
 * WHR (Waist-to-Hip Ratio) Calculations
 * WHO Standards for health risk assessment
 */

import type { Gender, WHRCategory, WHRRisk, WHRData } from '../types';

/**
 * Calculate WHR
 * Formula: waist circumference (cm) / hip circumference (cm)
 */
export function calculateWHR(waist: number, hips: number): number {
  return waist / hips;
}

/**
 * Get WHR category based on WHO standards
 *
 * WHO Standards:
 * Men:
 *   - Low risk: < 0.95
 *   - Moderate risk: 0.95 - 1.0
 *   - High risk: > 1.0
 *
 * Women:
 *   - Low risk: < 0.80
 *   - Moderate risk: 0.80 - 0.85
 *   - High risk: > 0.85
 */
export function getWHRCategory(whr: number, gender: Gender): WHRCategory {
  if (gender === 'male') {
    if (whr < 0.95) return 'low-risk';
    if (whr <= 1.0) return 'moderate-risk';
    return 'high-risk';
  } else {
    // female
    if (whr < 0.80) return 'low-risk';
    if (whr <= 0.85) return 'moderate-risk';
    return 'high-risk';
  }
}

/**
 * Get WHR risk level
 */
export function getWHRRisk(category: WHRCategory): WHRRisk {
  switch (category) {
    case 'low-risk':
      return 'low';
    case 'moderate-risk':
      return 'moderate';
    case 'high-risk':
      return 'high';
  }
}

/**
 * Get WHR category label in Polish
 */
export function getWHRCategoryLabel(category: WHRCategory): string {
  const labels: Record<WHRCategory, string> = {
    'low-risk': 'Niskie ryzyko',
    'moderate-risk': 'Umiarkowane ryzyko',
    'high-risk': 'Wysokie ryzyko',
  };
  return labels[category];
}

/**
 * Get WHR risk description
 */
export function getWHRRiskDescription(category: WHRCategory, gender: Gender): string {
  if (gender === 'male') {
    const descriptions: Record<WHRCategory, string> = {
      'low-risk': 'Twój stosunek obwodu talii do bioder jest w zdrowym zakresie. Rozkład tkanki tłuszczowej nie wskazuje na zwiększone ryzyko chorób metabolicznych.',
      'moderate-risk': 'Twój stosunek obwodu talii do bioder wskazuje na umiarkowane ryzyko. Rozważ konsultację z lekarzem oraz modyfikację stylu życia.',
      'high-risk': 'Twój stosunek obwodu talii do bioder wskazuje na podwyższone ryzyko chorób sercowo-naczyniowych i metabolicznych. Zalecana konsultacja lekarska.',
    };
    return descriptions[category];
  } else {
    const descriptions: Record<WHRCategory, string> = {
      'low-risk': 'Twój stosunek obwodu talii do bioder jest w zdrowym zakresie. Rozkład tkanki tłuszczowej nie wskazuje na zwiększone ryzyko chorób metabolicznych.',
      'moderate-risk': 'Twój stosunek obwodu talii do bioder wskazuje na umiarkowane ryzyko. Rozważ konsultację z lekarzem oraz modyfikację stylu życia.',
      'high-risk': 'Twój stosunek obwodu talii do bioder wskazuje na podwyższone ryzyko chorób sercowo-naczyniowych i metabolicznych. Zalecana konsultacja lekarska.',
    };
    return descriptions[category];
  }
}

/**
 * Get color for WHR category
 */
export function getWHRCategoryColor(category: WHRCategory): 'success' | 'warning' | 'danger' {
  const colors: Record<WHRCategory, 'success' | 'warning' | 'danger'> = {
    'low-risk': 'success',
    'moderate-risk': 'warning',
    'high-risk': 'danger',
  };
  return colors[category];
}

/**
 * Get complete WHR data
 */
export function getWHRData(waist: number, hips: number, gender: Gender): WHRData {
  const value = calculateWHR(waist, hips);
  const category = getWHRCategory(value, gender);
  const risk = getWHRRisk(category);

  return {
    value: Math.round(value * 100) / 100, // Round to 2 decimals
    category,
    risk,
  };
}
