/**
 * WHtR (Waist-to-Height Ratio) Calculations
 * Universal health indicator - same thresholds for all adults
 */

import type { WHtRCategory, WHtRData } from '../types';

/**
 * Calculate WHtR
 * Formula: waist circumference (cm) / height (cm)
 */
export function calculateWHtR(waist: number, height: number): number {
  return waist / height;
}

/**
 * Get WHtR category based on universal standards
 *
 * Universal Standards (same for all adults):
 *   - Very lean: < 0.40
 *   - Healthy: 0.40 - 0.49
 *   - Increased risk: 0.50 - 0.59
 *   - High risk: >= 0.60
 *
 * Rule: "Keep your waist circumference to less than half your height"
 */
export function getWHtRCategory(whtr: number): WHtRCategory {
  if (whtr < 0.40) return 'very-lean';
  if (whtr < 0.50) return 'healthy';
  if (whtr < 0.60) return 'increased-risk';
  return 'high-risk';
}

/**
 * Get WHtR category label in Polish
 */
export function getWHtRCategoryLabel(category: WHtRCategory): string {
  const labels: Record<WHtRCategory, string> = {
    'very-lean': 'Bardzo szczupły',
    'healthy': 'Zdrowy',
    'increased-risk': 'Zwiększone ryzyko',
    'high-risk': 'Wysokie ryzyko',
  };
  return labels[category];
}

/**
 * Get WHtR category description
 */
export function getWHtRCategoryDescription(category: WHtRCategory): string {
  const descriptions: Record<WHtRCategory, string> = {
    'very-lean': 'Twój obwód talii jest bardzo niski w stosunku do wzrostu. Może to być naturalne dla osób bardzo szczupłych lub wysportowanych.',
    'healthy': 'Twój obwód talii jest w zdrowym zakresie. Stosunek talii do wzrostu nie wskazuje na zwiększone ryzyko chorób metabolicznych.',
    'increased-risk': 'Twój obwód talii przekracza połowę wzrostu. Wskazuje to na zwiększone ryzyko chorób sercowo-naczyniowych i metabolicznych. Rozważ konsultację ze specjalistą.',
    'high-risk': 'Twój obwód talii znacznie przekracza połowę wzrostu. Wskazuje to na wysokie ryzyko chorób sercowo-naczyniowych, cukrzycy i innych chorób metabolicznych. Zalecana pilna konsultacja lekarska.',
  };
  return descriptions[category];
}

/**
 * Get color for WHtR category
 */
export function getWHtRCategoryColor(category: WHtRCategory): 'success' | 'warning' | 'danger' {
  const colors: Record<WHtRCategory, 'success' | 'warning' | 'danger'> = {
    'very-lean': 'warning',
    'healthy': 'success',
    'increased-risk': 'warning',
    'high-risk': 'danger',
  };
  return colors[category];
}

/**
 * Get complete WHtR data
 */
export function getWHtRData(waist: number, height: number): WHtRData {
  const value = calculateWHtR(waist, height);
  const category = getWHtRCategory(value);

  return {
    value: Math.round(value * 100) / 100, // Round to 2 decimals
    category,
  };
}
