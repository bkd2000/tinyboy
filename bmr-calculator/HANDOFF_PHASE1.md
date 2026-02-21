# Handoff: Phase 1 (@setup) → Phase 2 (@calculator)

## ✅ Completed Tasks

- ✅ Vite + React 18 + TypeScript project initialized
- ✅ Tailwind CSS v4 configured with custom medical theme
- ✅ PostCSS configured with @tailwindcss/postcss
- ✅ All dependencies installed (jsPDF, jspdf-autotable, lucide-react)
- ✅ Complete directory structure created
- ✅ TypeScript types defined
- ✅ Constants and formulas metadata prepared
- ✅ Basic App.tsx with responsive layout
- ✅ Build process verified (npm run build works)

## 📦 Deliverables

### 1. Project Structure
```
bmr-calculator/
├── src/
│   ├── components/
│   │   ├── InputForm/
│   │   ├── BodyFatEstimator/
│   │   ├── BMRResultsTable/
│   │   ├── TDEESection/
│   │   ├── BMISection/
│   │   └── PDFExport/
│   ├── utils/              (ready for BMR formulas)
│   ├── types/
│   │   └── index.ts        (all TypeScript interfaces defined)
│   ├── constants/
│   │   └── formulas.ts     (activity levels, BMI categories, model info)
│   ├── App.tsx             (basic responsive layout)
│   └── index.css           (Tailwind v4 setup)
├── tailwind.config.js      (custom medical theme)
├── postcss.config.js       (@tailwindcss/postcss)
├── vite.config.ts
├── tsconfig.json
└── package.json
```

### 2. TypeScript Types (`src/types/index.ts`)
All interfaces defined:
- `FormData` - user input data
- `BMRParams` - parameters for BMR calculations
- `BMRParamsWithBodyFat` - for Katch-McArdle & Cunningham
- `BMRResult` - single model result
- `BMRResults` - all models + statistics
- `NavyMethodParams` - US Navy body fat estimation
- `DeurenbergParams` - Deurenberg body fat estimation
- `BMIData` - BMI calculation result
- `ActivityLevel` - TDEE activity level
- `PDFData` - data for PDF export

### 3. Constants (`src/constants/formulas.ts`)
- `ACTIVITY_LEVELS` - 5 poziomów aktywności z opisami po polsku
- `BMI_CATEGORIES` - kategorie BMI z zakresami i kolorami
- `BMR_MODELS_INFO` - metadata dla 11 modeli BMR (rok, referencje naukowe)

### 4. Tailwind Theme
Custom medical design system:
- Primary colors: #1E40AF (niebieski)
- Success: #16A34A (zielony)
- Warning: #F59E0B (pomarańczowy)
- Danger: #DC2626 (czerwony)
- Font: Inter (system fallback)
- Border radius: 8px (rounded-card)
- Shadows: subtle card shadows

### 5. Dependencies Installed
```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "jspdf": "^2.5.2",
    "jspdf-autotable": "^3.8.4",
    "lucide-react": "^0.468.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.1.2",
    "tailwindcss": "^4.1.2",
    "typescript": "~5.7.2",
    "vite": "^7.3.1",
    // ... others
  }
}
```

## ⚠️ Known Issues / Notes

### Tailwind CSS v4
- Used Tailwind v4 (latest) with new `@import "tailwindcss"` syntax
- PostCSS plugin changed to `@tailwindcss/postcss`
- Works perfectly with Vite

### Build Verification
- ✅ `npm run build` succeeds
- ✅ No TypeScript errors
- ✅ Tailwind classes compile correctly
- Output: `dist/` folder with optimized assets

### Next Steps for @calculator
None blocking - all setup complete!

## 📝 Instructions for Phase 2 (@calculator)

### Your Tasks
Implement calculation logic in `src/utils/`:

1. **Create `src/utils/bmrModels.ts`**
   - Implement all 11 BMR formulas
   - Export `calculateAllBMR(params, bodyFat?)` that returns `BMRResults`
   - Handle models requiring body fat percentage (mark as null if unavailable)

2. **Create `src/utils/bodyFat.ts`**
   - `estimateBodyFatUSNavy(params: NavyMethodParams): number`
   - `estimateBodyFatDeurenberg(params: DeurenbergParams): number`

3. **Create `src/utils/bmi.ts`**
   - `calculateBMI(weight, height): number`
   - `getBMICategory(bmi): BMICategory`
   - `getHealthyWeightRange(height): { min, max }`

4. **Create `src/utils/tdee.ts`**
   - `calculateTDEE(bmr, activityLevel): number`

### Available Types
All types are already defined in `src/types/index.ts`:
```typescript
import type { BMRParams, BMRResults, NavyMethodParams, etc. } from '../types';
```

### Activity Levels
Already defined in `src/constants/formulas.ts`:
```typescript
import { ACTIVITY_LEVELS } from '../constants/formulas';
```

### Testing
Create test files as needed:
- `src/utils/bmrModels.test.ts`
- Use example data: weight=70kg, height=175cm, age=30, gender='male'
- Verify results match published formulas (±1 kcal tolerance)

### Formula References
All 11 models are documented in `src/constants/formulas.ts` under `BMR_MODELS_INFO` with years and scientific references.

---

## ✅ Checkpoint 1 Verification

**Can proceed to Phase 2?** YES ✅

- [x] `npm run dev` works
- [x] Tailwind classes render correctly
- [x] Structure katalogów zgodna z planem
- [x] TypeScript types zdefiniowane
- [x] Constants gotowe do użycia
- [x] Build bez błędów

---

**Handoff Date:** 2026-02-20
**Status:** Phase 1 COMPLETE ✅
**Next Agent:** @calculator
