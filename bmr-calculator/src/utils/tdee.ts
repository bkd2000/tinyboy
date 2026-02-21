/**
 * TDEE (Total Daily Energy Expenditure) Calculations
 */

import { ACTIVITY_LEVELS } from '../constants/formulas';
import type { ActivityLevel } from '../types';

/**
 * Calculate TDEE
 * Formula: BMR × Activity Level Multiplier
 */
export function calculateTDEE(bmr: number, activityLevel: number): number {
  return Math.round(bmr * activityLevel);
}

/**
 * Get activity level by value
 */
export function getActivityLevel(value: number): ActivityLevel | undefined {
  return ACTIVITY_LEVELS.find(level => level.value === value);
}

/**
 * Get activity level label
 */
export function getActivityLevelLabel(value: number): string {
  const level = getActivityLevel(value);
  return level?.label || 'Nieznany';
}

/**
 * Calculate TDEE for all BMR models
 */
export function calculateTDEEForAllModels(
  bmrResults: Array<{ model: string; value: number | null }>,
  activityLevel: number
): Array<{ model: string; bmr: number | null; tdee: number | null }> {
  return bmrResults.map(result => ({
    model: result.model,
    bmr: result.value,
    tdee: result.value !== null ? calculateTDEE(result.value, activityLevel) : null,
  }));
}

/**
 * Calculate caloric goals based on TDEE
 */
export function getCaloricGoals(tdee: number): {
  maintenance: number;
  cutting: number; // -500 kcal for weight loss
  bulking: number; // +300 kcal for muscle gain
  aggressiveCutting: number; // -750 kcal
} {
  return {
    maintenance: Math.round(tdee),
    cutting: Math.round(tdee - 500),
    bulking: Math.round(tdee + 300),
    aggressiveCutting: Math.round(tdee - 750),
  };
}
