/**
 * Macronutrient Calculator
 * Calculates protein, carbs, and fats distribution based on TDEE and strategy
 */

import type { MacroStrategy, NutritionGoal, MacroResults } from '../types';

interface MacroRatios {
  protein: number;  // 0.0 - 1.0 (percentage of total calories)
  carbs: number;
  fats: number;
}

/**
 * Calculate macronutrients based on TDEE, body composition, and strategy
 *
 * @param tdee - Total Daily Energy Expenditure (kcal)
 * @param bodyWeight - Total body weight in kg
 * @param bodyFatPercentage - Body fat percentage (0-100), optional
 * @param goal - Nutrition goal (cutting, maintenance, bulking, recomp)
 * @param strategy - Macro distribution strategy
 * @param mealsPerDay - Number of meals per day (default: 3)
 * @returns MacroResults with detailed breakdown
 */
export function calculateMacros(
  tdee: number,
  bodyWeight: number,
  bodyFatPercentage: number | undefined,
  goal: NutritionGoal,
  strategy: MacroStrategy,
  mealsPerDay: number = 3
): MacroResults {

  // Calculate Lean Body Mass (LBM) if body fat is available
  const leanBodyMass = bodyFatPercentage !== undefined
    ? bodyWeight * (1 - bodyFatPercentage / 100)
    : bodyWeight * 0.75; // Estimate ~25% body fat if not provided

  // Get macro ratios based on strategy
  const ratios = getMacroRatios(strategy, goal, leanBodyMass, tdee);

  // Calculate calories for each macronutrient
  const proteinCal = tdee * ratios.protein;
  const carbsCal = tdee * ratios.carbs;
  const fatsCal = tdee * ratios.fats;

  // Convert calories to grams
  // Protein: 4 kcal/g, Carbs: 4 kcal/g, Fats: 9 kcal/g
  const proteinGrams = Math.round(proteinCal / 4);
  const carbsGrams = Math.round(carbsCal / 4);
  const fatsGrams = Math.round(fatsCal / 9);

  return {
    protein: {
      grams: proteinGrams,
      calories: Math.round(proteinCal),
      percentage: Math.round(ratios.protein * 100),
      perMeal: Math.round(proteinGrams / mealsPerDay),
    },
    carbs: {
      grams: carbsGrams,
      calories: Math.round(carbsCal),
      percentage: Math.round(ratios.carbs * 100),
      perMeal: Math.round(carbsGrams / mealsPerDay),
    },
    fats: {
      grams: fatsGrams,
      calories: Math.round(fatsCal),
      percentage: Math.round(ratios.fats * 100),
      perMeal: Math.round(fatsGrams / mealsPerDay),
    },
    totalCalories: tdee,
    mealsPerDay,
    strategy,
    goal,
  };
}

/**
 * Get macro ratios based on strategy and goal
 */
function getMacroRatios(
  strategy: MacroStrategy,
  _goal: NutritionGoal,
  leanBodyMass: number,
  tdee: number
): MacroRatios {

  // Special case: Healthy Cutting uses 2.2g protein per kg LBM
  if (strategy === 'healthy-cutting') {
    const proteinGrams = leanBodyMass * 2.2;
    const proteinCalories = proteinGrams * 4;
    const proteinRatio = proteinCalories / tdee;

    // Remaining calories split between carbs and fats
    // Default: 40% carbs, 60% fats of remaining calories
    const remainingRatio = 1 - proteinRatio;
    const carbsRatio = remainingRatio * 0.40;
    const fatsRatio = remainingRatio * 0.60;

    return {
      protein: Math.min(proteinRatio, 0.50), // Cap at 50% to ensure balance
      carbs: carbsRatio,
      fats: fatsRatio,
    };
  }

  // Standard strategies with predefined ratios
  const strategies: Record<MacroStrategy, MacroRatios> = {
    'balanced': { protein: 0.30, carbs: 0.40, fats: 0.30 },
    'high-protein': { protein: 0.40, carbs: 0.30, fats: 0.30 },
    'healthy-cutting': { protein: 0.35, carbs: 0.35, fats: 0.30 }, // Fallback (shouldn't reach here)
    'keto': { protein: 0.25, carbs: 0.05, fats: 0.70 },
    'low-carb': { protein: 0.35, carbs: 0.25, fats: 0.40 },
    'low-fat': { protein: 0.30, carbs: 0.55, fats: 0.15 },
  };

  return strategies[strategy];
}

/**
 * Get strategy label in Polish
 */
export function getStrategyLabel(strategy: MacroStrategy): string {
  const labels: Record<MacroStrategy, string> = {
    'balanced': 'Zrównoważona',
    'high-protein': 'Wysokobiałkowa',
    'healthy-cutting': 'Zdrowe odchudzanie (2.2g/kg LBM)',
    'keto': 'Ketogeniczna',
    'low-carb': 'Niskowęglowodanowa',
    'low-fat': 'Niskotłuszczowa',
  };

  return labels[strategy];
}

/**
 * Get goal label in Polish
 */
export function getGoalLabel(goalType: NutritionGoal): string {
  const labels: Record<NutritionGoal, string> = {
    'cutting': 'Redukcja',
    'maintenance': 'Utrzymanie',
    'bulking': 'Masa',
    'recomp': 'Rekomponizycja',
  };

  return labels[goalType];
}
