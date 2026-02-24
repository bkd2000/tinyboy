import { useState, useMemo } from 'react';
import type { FormData, BodyFatMethod } from './types';
import { InputForm } from './components/InputForm';
import { BodyFatEstimator } from './components/BodyFatEstimator';
import { BMRResultsTable } from './components/BMRResultsTable';
import { TDEESection } from './components/TDEESection';
import { BMISection } from './components/BMISection';
import { WHRSection } from './components/WHRSection';
import { WHtRSection } from './components/WHtRSection';
import { BodyCompositionSection } from './components/BodyCompositionSection';
import { FFMISection } from './components/FFMISection';
import { AdvancedBodyMetricsSection } from './components/AdvancedBodyMetricsSection';
import { MacroCalculator } from './components/MacroCalculator';
import { PDFExport } from './components/PDFExport';
import { calculateAllBMR } from './utils/bmrModels';
import { getBMIData } from './utils/bmi';
import { getWHRData } from './utils/whr';
import { getWHtRData } from './utils/whtr';
import { getBodyCompositionData } from './utils/bodyComposition';
import { getFFMIData } from './utils/ffmi';
import { getAdvancedBodyMetricsData } from './utils/advancedBodyMetrics';
import { calculateTDEE } from './utils/tdee';
import { ACTIVITY_LEVELS } from './constants/formulas';

function App() {
  const [formData, setFormData] = useState<FormData>({});
  const [bodyFatPercentage, setBodyFatPercentage] = useState<number | undefined>();
  const [bodyFatMethod] = useState<BodyFatMethod>('manual');
  const [activityLevel, setActivityLevel] = useState<number>(1.2);

  // Calculate BMR when form data changes
  const bmrResults = useMemo(() => {
    if (!formData.weight || !formData.height || !formData.age || !formData.gender) {
      return null;
    }
    return calculateAllBMR(
      {
        weight: formData.weight,
        height: formData.height,
        age: formData.age,
        gender: formData.gender,
      },
      bodyFatPercentage
    );
  }, [formData.weight, formData.height, formData.age, formData.gender, bodyFatPercentage]);

  // Calculate BMI when weight/height changes
  const bmiData = useMemo(() => {
    if (!formData.weight || !formData.height) return null;
    return getBMIData(formData.weight, formData.height);
  }, [formData.weight, formData.height]);

  // Calculate WHR when waist/hip/gender changes
  const whrData = useMemo(() => {
    if (!formData.waistCircumference || !formData.hipCircumference || !formData.gender) return null;
    return getWHRData(formData.waistCircumference, formData.hipCircumference, formData.gender);
  }, [formData.waistCircumference, formData.hipCircumference, formData.gender]);

  // Calculate WHtR when waist/height changes
  const whtrData = useMemo(() => {
    if (!formData.waistCircumference || !formData.height) return null;
    return getWHtRData(formData.waistCircumference, formData.height);
  }, [formData.waistCircumference, formData.height]);

  // Calculate Body Composition (LBM + FFM) when weight/height/gender/bodyFat changes
  const bodyCompositionData = useMemo(() => {
    if (!formData.weight || !formData.height || !formData.gender) return null;
    return getBodyCompositionData(
      formData.weight,
      formData.height,
      formData.gender,
      bodyFatPercentage
    );
  }, [formData.weight, formData.height, formData.gender, bodyFatPercentage]);

  // Calculate FFMI when bodyComposition/height/gender changes
  const ffmiData = useMemo(() => {
    if (!bodyCompositionData?.ffm || !formData.height || !formData.gender) return null;
    return getFFMIData(bodyCompositionData.ffm.ffm, formData.height, formData.gender);
  }, [bodyCompositionData, formData.height, formData.gender]);

  // Calculate Advanced Body Metrics (SMM, TBW, Metabolic Age, Visceral Fat)
  const advancedMetricsData = useMemo(() => {
    if (!formData.weight || !formData.height || !formData.age || !formData.gender || !bmrResults || !bmiData) return null;
    const lbm = bodyCompositionData?.lbm.average ?? 0;
    return getAdvancedBodyMetricsData(
      formData.weight,
      formData.height,
      formData.age,
      formData.gender,
      bmrResults.average,
      bmiData.value,
      lbm,
      bodyFatPercentage,
      formData.waistCircumference
    );
  }, [formData.weight, formData.height, formData.age, formData.gender, bmrResults, bmiData, bodyCompositionData, bodyFatPercentage, formData.waistCircumference]);

  // Calculate TDEE
  const tdee = useMemo(() => {
    if (!bmrResults) return null;
    return calculateTDEE(bmrResults.average, activityLevel);
  }, [bmrResults, activityLevel]);

  // Get selected activity level object
  const selectedActivityLevel = ACTIVITY_LEVELS.find(l => l.value === activityLevel);

  // Check if we have required data for calculations
  const hasRequiredData = !!(formData.weight && formData.height && formData.age && formData.gender);

  // Check if we can export PDF
  const canExportPDF = !!(bmrResults && bmiData && tdee && selectedActivityLevel && hasRequiredData);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-primary">
                BodyMetrics Pro
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Wszystko czego potrzebujesz do profesjonalnej oceny składu ciała
              </p>
            </div>
            <div className="flex flex-col items-end gap-3">
              <img
                src="/logos/instytut-dietcoachingu.jpg"
                alt="Instytut Dietcoachingu"
                className="h-16 md:h-20 object-contain"
              />
              <img
                src="/logos/poradnia.jpg"
                alt="Poradnia Odchudzania i Odżywiania"
                className="h-12 md:h-14 object-contain"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Input Forms */}
          <div className="space-y-6">
            <InputForm data={formData} onChange={setFormData} />
            <BodyFatEstimator
              formData={formData}
              value={bodyFatPercentage}
              onChange={(value) => {
                setBodyFatPercentage(value);
                // Note: We'd need to track the method separately in a real implementation
                // For now, we'll use 'manual' as default in PDFExport
              }}
            />
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6">
            {!hasRequiredData && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Wyniki
                </h2>
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-600 mb-2">Wprowadź dane podstawowe</p>
                  <p className="text-sm text-gray-500">
                    Uzupełnij wagę, wzrost, wiek i płeć, aby zobaczyć wyniki BMR, TDEE i BMI
                  </p>
                </div>
              </div>
            )}

            {bmrResults && <BMRResultsTable results={bmrResults} />}

            {bmrResults && (
              <TDEESection
                bmr={bmrResults.average}
                activityLevel={activityLevel}
                onChange={setActivityLevel}
              />
            )}

            {tdee && formData.weight && (
              <MacroCalculator
                tdee={tdee}
                bodyWeight={formData.weight}
                bodyFatPercentage={bodyFatPercentage}
              />
            )}

            {bmiData && formData.height && (
              <BMISection bmi={bmiData} height={formData.height} />
            )}

            {whrData && formData.gender && (
              <WHRSection whr={whrData} gender={formData.gender} />
            )}

            {whtrData && formData.height && (
              <WHtRSection whtr={whtrData} height={formData.height} />
            )}

            {bodyCompositionData && formData.gender && (
              <BodyCompositionSection
                bodyComposition={bodyCompositionData}
                gender={formData.gender}
              />
            )}

            {formData.gender && (
              <FFMISection
                ffmi={ffmiData ?? undefined}
                gender={formData.gender}
              />
            )}

            {advancedMetricsData && formData.gender && (
              <AdvancedBodyMetricsSection
                metrics={advancedMetricsData}
                gender={formData.gender}
              />
            )}

            {canExportPDF && formData.weight && formData.height && formData.age && formData.gender && (
              <PDFExport
                formData={{
                  weight: formData.weight,
                  height: formData.height,
                  age: formData.age,
                  gender: formData.gender,
                  neckCircumference: formData.neckCircumference,
                  waistCircumference: formData.waistCircumference,
                  hipCircumference: formData.hipCircumference,
                }}
                bodyFatPercentage={bodyFatPercentage}
                bodyFatMethod={bodyFatMethod}
                bmrResults={bmrResults}
                tdee={tdee}
                activityLevel={selectedActivityLevel!}
                bmiData={bmiData}
                whrData={whrData}
                whtrData={whtrData}
                bodyCompositionData={bodyCompositionData}
                ffmiData={ffmiData}
                advancedMetricsData={advancedMetricsData}
              />
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <p className="text-sm text-gray-500 text-center">
            <strong>BodyMetrics Pro</strong> - Advanced Body Composition & Metabolism Calculator
          </p>
          <p className="text-xs text-gray-400 text-center mt-1">
            11 formuł BMR • 4 metody estymacji BF% • 15+ wskaźników składu ciała
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
