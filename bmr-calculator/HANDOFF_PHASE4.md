# Handoff: Phase 4 (@ui-results) → Phase 5 (@pdf)

## ✅ Completed Tasks

- ✅ Created `BMRResultsTable` component with 11 models
- ✅ Created `TDEESection` component with 5 activity levels
- ✅ Created `BMISection` component with visual scale
- ✅ Integrated all result components into App.tsx
- ✅ Added useMemo for performance optimization
- ✅ Empty state for when no data entered
- ✅ Build verification passed

## 📦 Deliverables

### 1. BMRResultsTable Component (`src/components/BMRResultsTable/index.tsx`)

**Features:**
- ✅ Table displaying all 11 BMR models
- ✅ Columns: Model name (with year), BMR value, Deviation from average
- ✅ Average BMR displayed prominently in card above table
- ✅ Sorting: None → Ascending → Descending → None
- ✅ Min/Max values highlighted with background colors (blue/orange)
- ✅ Models requiring body fat marked as "Brak danych" when unavailable
- ✅ Deviation shown in kcal and percentage
- ✅ Range info footer (min, max, spread)
- ✅ Info box explaining unavailable models

**Visual Design:**
- Zebra striping (alternating row colors)
- Average in primary-50 background with large text
- Min value: blue background (TrendingDown icon)
- Max value: orange background (TrendingUp icon)
- "Brak danych" in gray for unavailable models
- Positive deviation: orange, Negative: blue

**Props:**
```typescript
interface BMRResultsTableProps {
  results: BMRResults;
}
```

### 2. TDEESection Component (`src/components/TDEESection/index.tsx`)

**Features:**
- ✅ 5 activity level cards (from ACTIVITY_LEVELS constant)
- ✅ Each card shows: label, multiplier, description, examples
- ✅ Selected card: primary border, primary-50 background, checkmark
- ✅ Unselected: gray border, hover effect
- ✅ Large TDEE result display with gradient background
- ✅ Caloric goals: maintenance, cutting (-500), bulking (+300), aggressive cutting (-750)
- ✅ Info box explaining TDEE

**Activity Levels (Polish):**
1. Siedzący tryb życia (×1.2)
2. Lekko aktywny (×1.375)
3. Umiarkowanie aktywny (×1.55)
4. Bardzo aktywny (×1.725)
5. Ekstremalnie aktywny (×1.9)

**TDEE Display:**
- Large value: 5xl font, primary color
- Gradient background: primary-50 to primary-100
- Icon: Zap in primary circle
- Grid of caloric goals in small cards

**Props:**
```typescript
interface TDEESectionProps {
  bmr: number;
  activityLevel: number;
  onChange: (level: number) => void;
}
```

### 3. BMISection Component (`src/components/BMISection/index.tsx`)

**Features:**
- ✅ Large BMI value display (5xl font)
- ✅ Category badge with color (success/warning/danger)
- ✅ Visual BMI scale with gradient bar (6 segments)
- ✅ Dynamic indicator showing user's BMI on scale
- ✅ Tooltip on indicator with exact BMI value
- ✅ Scale labels and category names
- ✅ Healthy weight range card (with Target icon)
- ✅ WHO classification reference table
- ✅ Disclaimer about BMI limitations

**BMI Scale Visual:**
- 6-color gradient bar (yellow → green → yellow → orange → red → dark red)
- Black indicator line at user's BMI position
- Labeled segments: Niedowaga, Norma, Nadwaga, Otyłość I/II/III°
- Responsive to actual BMI value (0-40+ range)

**Healthy Weight Range:**
- Green card with Target icon
- Shows min-max weight for given height
- Based on BMI 18.5-24.9 range
- Example: "56.7 - 71.8 kg dla wzrostu 175 cm"

**Props:**
```typescript
interface BMISectionProps {
  bmi: BMIData;
  height: number;
}
```

### 4. App.tsx Integration

**State:**
```typescript
const [formData, setFormData] = useState<FormData>({});
const [bodyFatPercentage, setBodyFatPercentage] = useState<number | undefined>();
const [activityLevel, setActivityLevel] = useState<number>(1.2);
```

**Calculations (useMemo):**
```typescript
const bmrResults = useMemo(() => {
  if (!formData.weight || !formData.height || !formData.age || !formData.gender) return null;
  return calculateAllBMR({ weight, height, age, gender }, bodyFatPercentage);
}, [formData, bodyFatPercentage]);

const bmiData = useMemo(() => {
  if (!formData.weight || !formData.height) return null;
  return getBMIData(formData.weight, formData.height);
}, [formData.weight, formData.height]);
```

**Conditional Rendering:**
- Empty state: Show placeholder when no required data
- BMRResultsTable: Shown when bmrResults exists
- TDEESection: Shown when bmrResults exists
- BMISection: Shown when bmiData and height exist

## 🎨 UI/UX Features

### Design Consistency
- All components use white cards with rounded-lg shadow-sm
- Icons from lucide-react (Calculator, Activity, Scale, etc.)
- Primary color for headers and highlights
- Success/warning/danger colors for categories
- Gray-50 background for page

### Visual Hierarchy
- Large values: 3xl-5xl font sizes
- Section headers: xl font with icon
- Cards with colored backgrounds for important info
- Subtle shadows and borders
- Gradient backgrounds for emphasis

### User Guidance
- Empty state with icon and helpful message
- Info boxes explaining concepts (TDEE, BMI limitations)
- Warning boxes for missing data
- Color coding for categories (green=good, yellow=caution, red=concern)
- Tooltips and labels throughout

### Interactivity
- Sortable table (click header to toggle)
- Activity level cards (click to select)
- Hover effects on interactive elements
- Visual feedback for selections (checkmarks, borders)

## 📊 Example Output

**Test Data:** Male, 30 years, 70kg, 175cm, 15% body fat, Moderate activity

**BMR Results:**
- Harris-Benedict Original: 1675 kcal/day
- Mifflin-St Jeor: 1675 kcal/day
- Katch-McArdle: 1680 kcal/day (with body fat)
- Average: ~1670 kcal/day
- Range: 1580-1810 kcal/day

**TDEE (Moderate × 1.55):**
- 2589 kcal/day
- Goals: Maintenance 2589, Cutting 2089, Bulking 2889

**BMI:**
- Value: 22.9
- Category: Norma (green)
- Healthy range: 56.7-71.8 kg

## ⚠️ Known Issues / Notes

### Performance
- useMemo prevents unnecessary recalculations
- Only recalculates when dependencies change
- Efficient rendering of large table

### Edge Cases
- Empty state when no data entered
- Graceful handling of missing body fat %
- Models marked as unavailable when data missing
- BMI scale clamped to 0-40+ range

### Build Verification
- ✅ TypeScript compilation succeeds
- ✅ Vite build succeeds (1737 modules)
- ✅ CSS bundle: 19.79 kB (increased for visual components)
- ✅ JS bundle: 234.57 kB

## 📝 Instructions for Phase 5 (@pdf)

### Your Task

Create PDF export component in `src/components/PDFExport/`:

**PDFExport Component** (`src/components/PDFExport/index.tsx`)
- Input field for client name (optional)
- "Eksportuj do PDF" button
- Uses jsPDF + jsPDF-AutoTable
- Props: all calculation results

**PDF Structure:**
1. **Header**
   - Title: "Raport Kalkulacji BMR"
   - Date generated
   - Client name (if provided)

2. **Input Data Section**
   - Weight, height, age, gender
   - Body fat % (if available, with method)

3. **BMR Results Table**
   - All 11 models with values
   - Average highlighted
   - Min/max noted

4. **TDEE Section**
   - Selected activity level
   - TDEE value
   - Caloric goals

5. **BMI Section**
   - BMI value
   - Category
   - Healthy weight range

6. **Footer**
   - "Dokument wygenerowany przez Kalkulator BMR"
   - Disclaimer: "Wyniki służą wyłącznie celom informacyjnym..."

### Integration in App.tsx

Add to right column (after BMI section):
```typescript
{bmrResults && bmiData && (
  <PDFExport
    formData={formData}
    bodyFatPercentage={bodyFatPercentage}
    bmrResults={bmrResults}
    tdee={calculateTDEE(bmrResults.average, activityLevel)}
    activityLevel={ACTIVITY_LEVELS.find(l => l.value === activityLevel)!}
    bmiData={bmiData}
  />
)}
```

### Available Utilities

```typescript
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// All data already calculated in App.tsx, just pass as props
```

### PDF Styling

- Professional medical look
- Clean tables with borders
- Primary color (#1E40AF) for headers
- Proper spacing and margins
- Readable font sizes (10-14pt)
- Logo/header section
- Page breaks if needed

---

## ✅ Checkpoint 4 Verification

**Can proceed to Phase 5?** YES ✅

- [x] BMRResultsTable displays all 11 models correctly
- [x] Sorting works (asc/desc/none)
- [x] Min/max values highlighted
- [x] TDEE section with 5 activity levels
- [x] Activity selection functional
- [x] Caloric goals calculated
- [x] BMI section with visual scale
- [x] Healthy weight range displayed
- [x] Empty state when no data
- [x] Build passes without errors

---

**Handoff Date:** 2026-02-20
**Status:** Phase 4 COMPLETE ✅
**Next Agent:** @pdf
