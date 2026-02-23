// Core data types for BMR Calculator

export type Gender = 'male' | 'female';

export interface FormData {
  weight?: number; // kg
  height?: number; // cm
  age?: number; // years
  gender?: Gender;
  neckCircumference?: number; // cm
  waistCircumference?: number; // cm
  hipCircumference?: number; // cm (for Navy method and WHR calculation)
}

export interface BMRParams {
  weight: number; // kg
  height: number; // cm
  age: number; // years
  gender: Gender;
}

export interface BMRParamsWithBodyFat extends BMRParams {
  bodyFatPercentage: number;
}

export interface BMRResult {
  model: string;
  value: number | null; // kcal/day, null if cannot be calculated
  year?: string;
  requiresBodyFat?: boolean;
}

export interface BMRResults {
  results: BMRResult[];
  average: number; // average of all calculable results
  min: number;
  max: number;
}

export interface NavyMethodParams {
  height: number; // cm
  neck: number; // cm
  waist: number; // cm
  hip?: number; // cm (only for females)
  gender: Gender;
}

export interface DeurenbergParams {
  bmi: number;
  age: number;
  gender: Gender;
}

export type BodyFatMethod = 'manual' | 'navy' | 'deurenberg' | 'bai' | 'weighted-average';

export interface BMIData {
  value: number;
  category: BMICategory;
  healthyWeightRange: {
    min: number;
    max: number;
  };
}

export type BMICategory =
  | 'underweight'
  | 'normal'
  | 'overweight'
  | 'obese-class-1'
  | 'obese-class-2'
  | 'obese-class-3';

export interface ActivityLevel {
  value: number;
  label: string;
  description: string;
  examples: string;
}

// Macronutrients types
export type NutritionGoal =
  | 'cutting'        // Redukcja
  | 'maintenance'    // Utrzymanie
  | 'bulking'        // Masa
  | 'recomp';        // Rekomponizycja

export type MacroStrategy =
  | 'balanced'       // Zrównoważona 30/40/30
  | 'high-protein'   // Wysokobiałkowa 40/30/30
  | 'healthy-cutting' // Zdrowe odchudzanie - 2.2g białka/kg LBM
  | 'keto'           // Ketogeniczna 25/5/70
  | 'low-carb'       // Niskowęglowodanowa 35/25/40
  | 'low-fat';       // Niskotłuszczowa 30/55/15

export interface MacroNutrient {
  grams: number;
  calories: number;
  percentage: number;
  perMeal: number;
}

export interface MacroResults {
  protein: MacroNutrient;
  carbs: MacroNutrient;
  fats: MacroNutrient;
  totalCalories: number;
  mealsPerDay: number;
  strategy: MacroStrategy;
  goal: NutritionGoal;
}

export interface PDFData {
  clientName?: string;
  formData: {
    weight: number;
    height: number;
    age: number;
    gender: Gender;
    neckCircumference?: number;
    waistCircumference?: number;
    hipCircumference?: number;
  };
  bodyFatPercentage?: number;
  bodyFatMethod?: BodyFatMethod;
  bmrResults: BMRResults;
  tdee: number;
  activityLevel: ActivityLevel;
  bmi: BMIData;
  whr?: WHRData;
  whtr?: WHtRData;
  bodyComposition?: BodyCompositionData;
  ffmi?: FFMIData;
  advancedMetrics?: AdvancedBodyMetricsData;
  macros?: MacroResults;
  generatedAt: Date;
}

// WHR (Waist-to-Hip Ratio) types
export type WHRCategory = 'low-risk' | 'moderate-risk' | 'high-risk';

export type WHRRisk = 'low' | 'moderate' | 'high';

export interface WHRData {
  value: number;
  category: WHRCategory;
  risk: WHRRisk;
}

// WHtR (Waist-to-Height Ratio) types
export type WHtRCategory = 'very-lean' | 'healthy' | 'increased-risk' | 'high-risk';

export interface WHtRData {
  value: number;
  category: WHtRCategory;
}

// BAI (Body Adiposity Index) types
export type BAICategory = 'very-low' | 'athletic' | 'normal' | 'average' | 'elevated';

export interface BAIData {
  value: number;
  category: BAICategory;
}

// LBM (Lean Body Mass) types
export type LBMFormula = 'boer' | 'james' | 'hume';

export interface LBMResult {
  formula: LBMFormula;
  value: number; // kg
  percentage: number; // percentage of total body weight
  year: string;
}

export interface LBMData {
  results: LBMResult[];
  average: number; // average LBM in kg
  averagePercentage: number; // average LBM as percentage
}

// FFM (Fat-Free Mass) types
export interface FFMData {
  ffm: number; // kg
  percentage: number; // percentage of total body weight
  breakdown: {
    water: number; // ~73% of FFM
    protein: number; // ~20% of FFM
    minerals: number; // ~7% of FFM
  };
}

// Combined Body Composition types
export interface BodyCompositionData {
  lbm: LBMData;
  ffm?: FFMData; // only available if bodyFatPercentage is provided
  difference?: number; // FFM - average LBM (only if FFM available)
}

// FFMI (Fat-Free Mass Index) types
export type FFMICategory =
  | 'below-average'
  | 'average'
  | 'above-average'
  | 'very-good'
  | 'excellent'
  | 'suspicious';

export interface FFMIData {
  ffmi: number;
  normalizedFFMI: number;
  category: FFMICategory;
}

// SMM (Skeletal Muscle Mass) types
export interface SMMData {
  smm: number; // kg
  percentage: number; // percentage of total body weight
  category: string;
}

// TBW (Total Body Water) types
export interface TBWData {
  tbw: number; // liters
  percentage: number; // percentage of total body weight
  category: string;
}

// Metabolic Age types
export interface MetabolicAgeData {
  metabolicAge: number; // years
  actualAge: number; // years
  difference: number; // metabolicAge - actualAge
  category: string;
  description: string;
}

// Visceral Fat types
export interface VisceralFatData {
  level: number; // 1-59 scale
  category: string;
  risk: string;
  description: string;
}

// Advanced Body Metrics - combined data
export interface AdvancedBodyMetricsData {
  smm?: SMMData;
  tbw: TBWData;
  metabolicAge: MetabolicAgeData;
  visceralFat?: VisceralFatData; // requires waist circumference
}
