// Activity levels for TDEE calculation
import type { ActivityLevel } from '../types';

export const ACTIVITY_LEVELS: ActivityLevel[] = [
  {
    value: 1.2,
    label: 'Siedzący tryb życia',
    description: 'Brak regularnych ćwiczeń, praca biurowa',
    examples: 'Praca przy biurku 8h dziennie, wieczorem oglądanie TV, brak aktywności fizycznej',
  },
  {
    value: 1.375,
    label: 'Lekko aktywny',
    description: 'Lekkie ćwiczenia 1-3 dni w tygodniu',
    examples: 'Spacery 30 min dziennie, 1-2 lekkie treningi w tygodniu (joga, stretching)',
  },
  {
    value: 1.55,
    label: 'Umiarkowanie aktywny',
    description: 'Umiarkowane ćwiczenia 3-5 dni w tygodniu',
    examples: '2-3× trening siłowy tygodniowo + 1-2× cardio (bieganie, rower)',
  },
  {
    value: 1.725,
    label: 'Bardzo aktywny',
    description: 'Intensywne ćwiczenia 6-7 dni w tygodniu',
    examples: 'Codzienny trening, praca fizyczna, aktywny tryb życia',
  },
  {
    value: 1.9,
    label: 'Ekstremalnie aktywny',
    description: 'Bardzo intensywny trening + praca fizyczna',
    examples: 'Zawodowy sportowiec, 2 treningi dziennie, bardzo ciężka praca fizyczna',
  },
];

// BMI category thresholds and labels
export const BMI_CATEGORIES = {
  underweight: {
    max: 18.5,
    label: 'Niedowaga',
    color: 'warning',
    description: 'BMI poniżej zdrowego zakresu',
  },
  normal: {
    min: 18.5,
    max: 24.9,
    label: 'Norma',
    color: 'success',
    description: 'Zdrowy zakres BMI',
  },
  overweight: {
    min: 25,
    max: 29.9,
    label: 'Nadwaga',
    color: 'warning',
    description: 'BMI powyżej zdrowego zakresu',
  },
  'obese-class-1': {
    min: 30,
    max: 34.9,
    label: 'Otyłość I°',
    color: 'danger',
    description: 'Otyłość pierwszego stopnia',
  },
  'obese-class-2': {
    min: 35,
    max: 39.9,
    label: 'Otyłość II°',
    color: 'danger',
    description: 'Otyłość drugiego stopnia',
  },
  'obese-class-3': {
    min: 40,
    max: Infinity,
    label: 'Otyłość III°',
    color: 'danger',
    description: 'Otyłość trzeciego stopnia (skrajna)',
  },
} as const;

// Scientific references for BMR models
export const BMR_MODELS_INFO = {
  'Harris-Benedict Original': {
    year: '1919',
    reference: 'Harris JA, Benedict FG. A Biometric Study of Human Basal Metabolism. PNAS 1918.',
    note: 'Pierwsza szeroko stosowana formuła BMR',
  },
  'Harris-Benedict Revised': {
    year: '1984',
    reference: 'Roza AM, Shizgal HM. The Harris Benedict equation reevaluated. Am J Clin Nutr 1984.',
    note: 'Zrewidowana wersja z dokładniejszymi współczynnikami',
  },
  'Mifflin-St Jeor': {
    year: '1990',
    reference: 'Mifflin MD et al. A new predictive equation for resting energy expenditure. Am J Clin Nutr 1990.',
    note: 'Obecnie najczęściej rekomendowany model',
  },
  'Katch-McArdle': {
    year: '1996',
    reference: 'Katch VL, McArdle WD. Katch-McArdle Formula. 1996.',
    note: 'Wymaga % tkanki tłuszczowej, bazuje na beztłuszczowej masie ciała',
  },
  Cunningham: {
    year: '1980',
    reference: 'Cunningham JJ. A reanalysis of the factors influencing basal metabolic rate. Am J Clin Nutr 1980.',
    note: 'Podobny do Katch-McArdle, wymaga % tkanki tłuszczowej',
  },
  Owen: {
    year: '1986/1987',
    reference: 'Owen OE et al. A reappraisal of caloric requirements in healthy women/men. Am J Clin Nutr 1986/1987.',
    note: 'Uproszczony model bazujący głównie na wadze',
  },
  'Schofield/WHO': {
    year: '1985',
    reference: 'Schofield WN. Predicting basal metabolic rate, new standards. Hum Nutr Clin Nutr 1985.',
    note: 'Model WHO z przedziałami wiekowymi',
  },
  'Henry/Oxford': {
    year: '2005',
    reference: 'Henry CJ. Basal metabolic rate studies in humans. Public Health Nutr 2005.',
    note: 'Zaktualizowana wersja równań Schofield',
  },
  Müller: {
    year: '2004',
    reference: 'Müller MJ et al. World Health Organization equations have shortcomings. Am J Clin Nutr 2004.',
    note: 'Uwzględnia kategorię BMI',
  },
  'Livingston-Kohlstadt': {
    year: '2005',
    reference: 'Livingston EH, Kohlstadt I. Simplified resting metabolic rate-predicting formulas. Obes Res 2005.',
    note: 'Model potęgowy bazujący na wadze',
  },
  Bernstein: {
    year: '1983',
    reference: 'Bernstein RS et al. Prediction of the resting metabolic rate in obese patients. Am J Clin Nutr 1983.',
    note: 'Dedykowany osobom z otyłością',
  },
} as const;
