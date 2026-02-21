# Handoff: Phase 3 (@ui-forms) → Phase 4 (@ui-results)

## ✅ Completed Tasks

- ✅ Created `InputForm` component with full validation
- ✅ Created `BodyFatEstimator` component with 3 methods
- ✅ Integrated components into App.tsx
- ✅ Polish error messages and labels
- ✅ Dynamic field visibility (hip for females, circumferences by method)
- ✅ Build verification passed

## 📦 Deliverables

### 1. InputForm Component (`src/components/InputForm/index.tsx`)

**Features:**
- ✅ Required fields: weight, height, age, gender
- ✅ Optional fields: neck, waist, hip circumferences
- ✅ Real-time validation with Polish error messages
- ✅ Touch-based error display (errors show only after blur)
- ✅ Icons from lucide-react (Weight, Ruler, Calendar, User)
- ✅ Gender toggle (Mężczyzna/Kobieta buttons)
- ✅ Hip circumference shown only for females
- ✅ Professional medical styling

**Validation Rules:**
- Weight: 20-400 kg, required
- Height: 100-250 cm, required
- Age: 15-120 years, required
- Gender: required
- Circumferences: optional, must be > 0 if provided

**Error Messages (Polish):**
- "Waga musi być w zakresie 20-400 kg"
- "Wzrost musi być w zakresie 100-250 cm"
- "Wiek musi być w zakresie 15-120 lat"
- "To pole jest wymagane"

**Props:**
```typescript
interface InputFormProps {
  data: FormData;
  onChange: (data: FormData) => void;
}
```

### 2. BodyFatEstimator Component (`src/components/BodyFatEstimator/index.tsx`)

**Features:**
- ✅ 3 estimation methods: Manual, US Navy, Deurenberg
- ✅ Auto-calculation when method or data changes
- ✅ Method selection with radio-style cards
- ✅ Manual input field (0-100%)
- ✅ Automatic US Navy calculation (uses neck, waist, hip)
- ✅ Automatic Deurenberg calculation (uses BMI)
- ✅ Result display with category and color
- ✅ Info messages when data is missing
- ✅ Helpful tooltips explaining what each method requires

**Methods:**
1. **Manual** - direct input of known body fat %
2. **US Navy** - calculates from circumferences
   - Men: neck, waist, height
   - Women: neck, waist, hip, height
3. **Deurenberg** - calculates from BMI, age, gender

**Body Fat Categories (Polish):**
- Bardzo niski / Niezbędny tłuszcz (danger)
- Sportowiec / Niski poziom tłuszczu (success)
- Fitness / Zdrowy poziom fitness (success)
- Przeciętny / Akceptowalny poziom (warning)
- Podwyższony / Powyżej zdrowego zakresu (danger)

**Props:**
```typescript
interface BodyFatEstimatorProps {
  formData: FormData;
  value?: number;
  onChange: (value?: number) => void;
}
```

### 3. App.tsx Integration

**State Management:**
```typescript
const [formData, setFormData] = useState<FormData>({});
const [bodyFatPercentage, setBodyFatPercentage] = useState<number | undefined>();
```

**Layout:**
- 2-column responsive layout (lg:grid-cols-2)
- Left: InputForm + BodyFatEstimator
- Right: Results (placeholder for Phase 4)
- Debug panel showing entered data

**Current Status:**
- Forms fully functional
- Data flows correctly between components
- Ready for results components

## 🎨 UI/UX Features

### Design Elements
- Clean white cards with shadow-sm
- Primary blue color for active states
- Icons for visual guidance (Weight, Ruler, Calendar, Activity, Info)
- Responsive padding and spacing
- Focus states with ring-2

### User Experience
- Touch-based validation (errors after blur, not on keystroke)
- Clear visual feedback (border colors, backgrounds)
- Helpful info boxes with explanations
- Dynamic form fields (hip only for females)
- Method selection shows when data is missing
- Auto-calculation reduces user effort

### Accessibility
- Labels for all inputs
- Required field indicators (red asterisk)
- Error messages clearly associated with fields
- Button states (hover, active)
- Semantic HTML (labels, inputs, buttons)

## 📊 Example Usage Flow

1. User enters: weight=70, height=175, age=30, gender=male
2. Form validates in real-time (after blur)
3. User can optionally enter circumferences
4. User selects body fat method:
   - **Manual:** enters known value (e.g., 15%)
   - **US Navy:** auto-calculates if neck/waist provided
   - **Deurenberg:** auto-calculates from BMI
5. Body fat result displays with category
6. Data flows to parent (App.tsx) via onChange callbacks
7. Ready for BMR/TDEE/BMI calculations

## ⚠️ Known Issues / Notes

### TypeScript
- All type guards added for optional FormData fields
- No type errors in build
- Proper handling of undefined values

### Auto-calculation
- useEffect monitors method + formData changes
- Validates required data before calculation
- Graceful fallback when data missing

### Build Verification
- ✅ TypeScript compilation succeeds
- ✅ Vite build succeeds (1731 modules)
- ✅ CSS bundle: 13.20 kB
- ✅ JS bundle: 212.79 kB

## 📝 Instructions for Phase 4 (@ui-results)

### Your Tasks

Create result components in `src/components/`:

1. **BMRResultsTable Component** (`src/components/BMRResultsTable/index.tsx`)
   - Display all 11 BMR models in a table
   - Show: model name (with year), BMR value, deviation from average
   - Highlight min/max/average values
   - Mark models requiring body fat as "Brak danych" if unavailable
   - Sortable table (ascending/descending)
   - Props: `results: BMRResults`

2. **TDEESection Component** (`src/components/TDEESection/index.tsx`)
   - 5 activity level cards with descriptions
   - Click to select activity level
   - Display TDEE result based on selected level
   - Use `ACTIVITY_LEVELS` from constants
   - Props: `bmr: number`, `activityLevel: number`, `onChange: (level: number) => void`

3. **BMISection Component** (`src/components/BMISection/index.tsx`)
   - Large BMI value display
   - Category badge with color
   - Visual BMI scale/slider
   - Healthy weight range for given height
   - Props: `bmi: BMIData`, `height: number`

### Integration in App.tsx

Add to state:
```typescript
const [activityLevel, setActivityLevel] = useState<number>(1.2);
```

Add calculations (useMemo):
```typescript
const bmrResults = useMemo(() => {
  if (!formData.weight || !formData.height || !formData.age || !formData.gender) {
    return null;
  }
  return calculateAllBMR(
    { weight: formData.weight, height: formData.height, age: formData.age, gender: formData.gender },
    bodyFatPercentage
  );
}, [formData, bodyFatPercentage]);

const tdee = useMemo(() => {
  return bmrResults ? calculateTDEE(bmrResults.average, activityLevel) : null;
}, [bmrResults, activityLevel]);

const bmiData = useMemo(() => {
  if (!formData.weight || !formData.height) return null;
  return getBMIData(formData.weight, formData.height);
}, [formData]);
```

Render in right column:
```typescript
{bmrResults && <BMRResultsTable results={bmrResults} />}
{bmrResults && <TDEESection bmr={bmrResults.average} activityLevel={activityLevel} onChange={setActivityLevel} />}
{bmiData && <BMISection bmi={bmiData} height={formData.height!} />}
```

### Available Utilities

All calculation functions ready to use:
```typescript
import { calculateAllBMR } from '../utils/bmrModels';
import { calculateTDEE } from '../utils/tdee';
import { getBMIData, getBMICategoryLabel, getBMICategoryColor } from '../utils/bmi';
import { ACTIVITY_LEVELS } from '../constants/formulas';
```

### Design Guidelines

**Table Styling:**
- Zebra striping (odd rows bg-gray-50)
- Header: bg-primary-50 text-primary-900
- Highlight average: bold, bg-primary-100
- Highlight min/max: subtle background colors
- "Brak danych" in gray text

**Activity Cards:**
- Card layout with hover effect
- Selected: border-primary bg-primary-50
- Unselected: border-gray-200 hover:border-gray-300
- Show multiplier, label, description, examples

**BMI Display:**
- Large value: text-4xl font-bold
- Category badge: colored by category (success/warning/danger)
- Visual scale: gradient bar with indicator
- Healthy range: "Dla wzrostu XXX cm: XX-XX kg"

### Polish Labels

Use from utils:
- BMI categories: `getBMICategoryLabel(category)`
- Activity levels: from `ACTIVITY_LEVELS` constant
- All text in Polish

---

## ✅ Checkpoint 3 Verification

**Can proceed to Phase 4?** YES ✅

- [x] InputForm validates all fields correctly
- [x] BodyFatEstimator auto-calculates for all 3 methods
- [x] Dynamic fields (hip for females) working
- [x] Polish error messages and labels
- [x] Data flows correctly via onChange
- [x] Build passes without errors
- [x] Responsive layout functional

---

**Handoff Date:** 2026-02-20
**Status:** Phase 3 COMPLETE ✅
**Next Agent:** @ui-results
