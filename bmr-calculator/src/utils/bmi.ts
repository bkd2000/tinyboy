/**
 * BMI (Body Mass Index) Calculations
 */

import type { BMICategory, BMIData } from '../types';

/**
 * Calculate BMI
 * Formula: weight (kg) / height (m)²
 */
export function calculateBMI(weight: number, height: number): number {
  const heightM = height / 100; // Convert cm to m
  return weight / (heightM * heightM);
}

/**
 * Get BMI category based on WHO classifications
 */
export function getBMICategory(bmi: number): BMICategory {
  if (bmi < 18.5) return 'underweight';
  if (bmi < 25) return 'normal';
  if (bmi < 30) return 'overweight';
  if (bmi < 35) return 'obese-class-1';
  if (bmi < 40) return 'obese-class-2';
  return 'obese-class-3';
}

/**
 * Get BMI category label in Polish
 */
export function getBMICategoryLabel(category: BMICategory): string {
  const labels: Record<BMICategory, string> = {
    underweight: 'Niedowaga',
    normal: 'Norma',
    overweight: 'Nadwaga',
    'obese-class-1': 'Otyłość I°',
    'obese-class-2': 'Otyłość II°',
    'obese-class-3': 'Otyłość III°',
  };
  return labels[category];
}

/**
 * Get BMI category description
 */
export function getBMICategoryDescription(category: BMICategory): string {
  const descriptions: Record<BMICategory, string> = {
    underweight: 'BMI poniżej zdrowego zakresu',
    normal: 'Zdrowy zakres BMI',
    overweight: 'BMI powyżej zdrowego zakresu',
    'obese-class-1': 'Otyłość pierwszego stopnia',
    'obese-class-2': 'Otyłość drugiego stopnia',
    'obese-class-3': 'Otyłość trzeciego stopnia (skrajna)',
  };
  return descriptions[category];
}

/**
 * Get color for BMI category
 */
export function getBMICategoryColor(category: BMICategory): 'success' | 'warning' | 'danger' {
  const colors: Record<BMICategory, 'success' | 'warning' | 'danger'> = {
    underweight: 'warning',
    normal: 'success',
    overweight: 'warning',
    'obese-class-1': 'danger',
    'obese-class-2': 'danger',
    'obese-class-3': 'danger',
  };
  return colors[category];
}

/**
 * Calculate healthy weight range for a given height
 * Based on BMI 18.5 - 24.9
 */
export function getHealthyWeightRange(height: number): { min: number; max: number } {
  const heightM = height / 100; // Convert cm to m
  const heightSquared = heightM * heightM;

  const min = 18.5 * heightSquared;
  const max = 24.9 * heightSquared;

  return {
    min: Math.round(min * 10) / 10, // Round to 1 decimal
    max: Math.round(max * 10) / 10,
  };
}

/**
 * Get complete BMI data
 */
export function getBMIData(weight: number, height: number): BMIData {
  const value = calculateBMI(weight, height);
  const category = getBMICategory(value);
  const healthyWeightRange = getHealthyWeightRange(height);

  return {
    value: Math.round(value * 10) / 10, // Round to 1 decimal
    category,
    healthyWeightRange,
  };
}
