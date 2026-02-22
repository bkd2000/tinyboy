import type { Gender, AdvancedBodyMetricsData, SMMData, TBWData, MetabolicAgeData, VisceralFatData } from '../types';

/**
 * SMM (Skeletal Muscle Mass) - Masa mięśni szkieletowych
 *
 * Formulas based on research:
 * Men: SMM = (0.244 × weight) + (7.8 × height_m) - (0.098 × age) + 6.6 + race - fat
 * Women: SMM = (0.244 × weight) + (7.8 × height_m) - (0.098 × age) - race - fat
 *
 * Simplified version using LBM:
 * SMM ≈ LBM × 0.5 (skeletal muscle is approximately 50% of lean body mass)
 */
export function calculateSMM(
  weight: number,
  height: number,
  age: number,
  gender: Gender,
  lbm: number
): number {
  const heightInMeters = height / 100;

  if (gender === 'male') {
    // Men: SMM = (0.244 × weight) + (7.8 × height) - (0.098 × age) + 6.6
    const smm = (0.244 * weight) + (7.8 * heightInMeters) - (0.098 * age) + 6.6;
    return Math.max(smm, lbm * 0.4); // Ensure reasonable minimum
  } else {
    // Women: SMM = (0.244 × weight) + (7.8 × height) - (0.098 × age) - 9.9
    const smm = (0.244 * weight) + (7.8 * heightInMeters) - (0.098 * age) - 9.9;
    return Math.max(smm, lbm * 0.35); // Ensure reasonable minimum
  }
}

/**
 * Get SMM category based on percentage of body weight
 */
export function getSMMCategory(smmPercentage: number, gender: Gender): string {
  if (gender === 'male') {
    if (smmPercentage < 33) return 'Niska';
    if (smmPercentage < 37) return 'Poniżej przeciętnej';
    if (smmPercentage < 41) return 'Przeciętna';
    if (smmPercentage < 45) return 'Powyżej przeciętnej';
    return 'Wysoka';
  } else {
    if (smmPercentage < 24) return 'Niska';
    if (smmPercentage < 27) return 'Poniżej przeciętnej';
    if (smmPercentage < 30) return 'Przeciętna';
    if (smmPercentage < 33) return 'Powyżej przeciętnej';
    return 'Wysoka';
  }
}

/**
 * TBW (Total Body Water) - Całkowita zawartość wody w organizmie
 *
 * Watson Formula:
 * Men: TBW = 2.447 + (0.3362 × weight) + (0.1074 × height) - (0.09516 × age)
 * Women: TBW = -2.097 + (0.2466 × weight) + (0.1069 × height)
 */
export function calculateTBW(
  weight: number,
  height: number,
  age: number,
  gender: Gender
): number {
  if (gender === 'male') {
    return 2.447 + (0.3362 * weight) + (0.1074 * height) - (0.09516 * age);
  } else {
    return -2.097 + (0.2466 * weight) + (0.1069 * height);
  }
}

/**
 * Get TBW category based on percentage of body weight
 */
export function getTBWCategory(tbwPercentage: number, gender: Gender): string {
  if (gender === 'male') {
    if (tbwPercentage < 50) return 'Niska (odwodnienie)';
    if (tbwPercentage < 55) return 'Poniżej przeciętnej';
    if (tbwPercentage < 65) return 'Prawidłowa';
    if (tbwPercentage < 70) return 'Powyżej przeciętnej';
    return 'Bardzo wysoka';
  } else {
    if (tbwPercentage < 45) return 'Niska (odwodnienie)';
    if (tbwPercentage < 50) return 'Poniżej przeciętnej';
    if (tbwPercentage < 60) return 'Prawidłowa';
    if (tbwPercentage < 65) return 'Powyżej przeciętnej';
    return 'Bardzo wysoka';
  }
}

/**
 * Metabolic Age - Wiek metaboliczny
 *
 * Based on BMR comparison with age-adjusted norms
 * Formula considers BMR, body composition, and physical activity
 */
export function calculateMetabolicAge(
  actualAge: number,
  bmr: number,
  weight: number,
  height: number,
  gender: Gender,
  bodyFatPercentage?: number
): number {
  // Calculate expected BMR for actual age using Harris-Benedict
  const expectedBMR = gender === 'male'
    ? 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * actualAge)
    : 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * actualAge);

  // Calculate BMR ratio
  const bmrRatio = bmr / expectedBMR;

  // Adjust for body composition if available
  let compositionAdjustment = 0;
  if (bodyFatPercentage !== undefined) {
    const idealBF = gender === 'male' ? 15 : 22;
    const bfDifference = bodyFatPercentage - idealBF;
    compositionAdjustment = bfDifference * 0.3; // Each % BF difference adds ~0.3 years
  }

  // Calculate metabolic age
  // If BMR is higher than expected (bmrRatio > 1), metabolic age is lower
  // If BMR is lower than expected (bmrRatio < 1), metabolic age is higher
  const ageDifference = (1 - bmrRatio) * 20; // Scale factor of 20 years max difference

  let metabolicAge = actualAge + ageDifference + compositionAdjustment;

  // Clamp to reasonable range
  metabolicAge = Math.max(18, Math.min(metabolicAge, 100));

  return Math.round(metabolicAge);
}

/**
 * Get metabolic age interpretation
 */
export function getMetabolicAgeInterpretation(metabolicAge: number, actualAge: number): {
  category: string;
  description: string;
} {
  const difference = metabolicAge - actualAge;

  if (difference <= -10) {
    return {
      category: 'Doskonały',
      description: 'Twój metabolizm jest znacznie lepszy niż przeciętny dla Twojego wieku',
    };
  } else if (difference <= -5) {
    return {
      category: 'Bardzo dobry',
      description: 'Twój metabolizm jest lepszy niż przeciętny dla Twojego wieku',
    };
  } else if (difference <= -2) {
    return {
      category: 'Dobry',
      description: 'Twój metabolizm jest nieco lepszy niż przeciętny',
    };
  } else if (difference <= 2) {
    return {
      category: 'Przeciętny',
      description: 'Twój metabolizm odpowiada Twojemu wiekowi',
    };
  } else if (difference <= 5) {
    return {
      category: 'Poniżej przeciętnej',
      description: 'Twój metabolizm jest nieco wolniejszy niż przeciętny',
    };
  } else if (difference <= 10) {
    return {
      category: 'Słaby',
      description: 'Twój metabolizm jest wolniejszy niż przeciętny dla Twojego wieku',
    };
  } else {
    return {
      category: 'Wymaga poprawy',
      description: 'Twój metabolizm jest znacznie wolniejszy niż powinien być',
    };
  }
}

/**
 * Visceral Fat Level - Poziom tłuszczu trzewnego
 *
 * Estimated using waist circumference and BMI
 * Scale: 1-59 (1-9 healthy, 10-14 high, 15+ very high)
 */
export function calculateVisceralFatLevel(
  waistCircumference: number,
  bmi: number,
  age: number,
  gender: Gender
): number {
  // Base calculation using waist circumference
  const waistFactor = gender === 'male'
    ? (waistCircumference - 85) / 10
    : (waistCircumference - 75) / 10;

  // BMI adjustment
  const bmiFactor = (bmi - 22) / 3;

  // Age adjustment (visceral fat increases with age)
  const ageFactor = (age - 30) / 10;

  // Combine factors
  let visceralFat = 1 + Math.max(0, waistFactor) * 3 + Math.max(0, bmiFactor) * 2 + Math.max(0, ageFactor) * 0.5;

  // Clamp to scale 1-59
  visceralFat = Math.max(1, Math.min(visceralFat, 59));

  return Math.round(visceralFat);
}

/**
 * Get visceral fat category and health risk
 */
export function getVisceralFatCategory(level: number): {
  category: string;
  risk: string;
  description: string;
} {
  if (level <= 9) {
    return {
      category: 'Prawidłowy',
      risk: 'Niskie ryzyko',
      description: 'Poziom tłuszczu trzewnego jest prawidłowy',
    };
  } else if (level <= 14) {
    return {
      category: 'Podwyższony',
      risk: 'Średnie ryzyko',
      description: 'Rozważ zmianę diety i zwiększenie aktywności fizycznej',
    };
  } else if (level <= 24) {
    return {
      category: 'Wysoki',
      risk: 'Wysokie ryzyko',
      description: 'Zalecana konsultacja z lekarzem i modyfikacja stylu życia',
    };
  } else {
    return {
      category: 'Bardzo wysoki',
      risk: 'Bardzo wysokie ryzyko',
      description: 'Konieczna konsultacja medyczna i natychmiastowa interwencja',
    };
  }
}

/**
 * Get comprehensive advanced body metrics data
 */
export function getAdvancedBodyMetricsData(
  weight: number,
  height: number,
  age: number,
  gender: Gender,
  bmr: number,
  bmi: number,
  lbm: number,
  bodyFatPercentage?: number,
  waistCircumference?: number
): AdvancedBodyMetricsData {
  // Calculate TBW (always available)
  const tbw = calculateTBW(weight, height, age, gender);
  const tbwPercentage = (tbw / weight) * 100;
  const tbwData: TBWData = {
    tbw,
    percentage: tbwPercentage,
    category: getTBWCategory(tbwPercentage, gender),
  };

  // Calculate Metabolic Age (always available)
  const metabolicAge = calculateMetabolicAge(age, bmr, weight, height, gender, bodyFatPercentage);
  const interpretation = getMetabolicAgeInterpretation(metabolicAge, age);
  const metabolicAgeData: MetabolicAgeData = {
    metabolicAge,
    actualAge: age,
    difference: metabolicAge - age,
    category: interpretation.category,
    description: interpretation.description,
  };

  // Calculate SMM (requires LBM)
  let smmData: SMMData | undefined = undefined;
  if (lbm > 0) {
    const smm = calculateSMM(weight, height, age, gender, lbm);
    const smmPercentage = (smm / weight) * 100;
    smmData = {
      smm,
      percentage: smmPercentage,
      category: getSMMCategory(smmPercentage, gender),
    };
  }

  // Calculate Visceral Fat (requires waist circumference)
  let visceralFatData: VisceralFatData | undefined = undefined;
  if (waistCircumference !== undefined) {
    const level = calculateVisceralFatLevel(waistCircumference, bmi, age, gender);
    const categoryData = getVisceralFatCategory(level);
    visceralFatData = {
      level,
      ...categoryData,
    };
  }

  return {
    smm: smmData,
    tbw: tbwData,
    metabolicAge: metabolicAgeData,
    visceralFat: visceralFatData,
  };
}
