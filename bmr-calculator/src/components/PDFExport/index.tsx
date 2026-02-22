import { useState } from 'react';
import type {
  BMRResults,
  BMIData,
  ActivityLevel,
  Gender,
  BodyFatMethod,
  WHRData,
  WHtRData,
  BodyCompositionData,
  FFMIData,
  AdvancedBodyMetricsData
} from '../../types';
import { generatePDF } from '../../utils/pdfGenerator';
import { FileDown, User } from 'lucide-react';

interface PDFExportProps {
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
  bmiData: BMIData;
  whrData?: WHRData | null;
  whtrData?: WHtRData | null;
  bodyCompositionData?: BodyCompositionData | null;
  ffmiData?: FFMIData | null;
  advancedMetricsData?: AdvancedBodyMetricsData | null;
}

export function PDFExport({
  formData,
  bodyFatPercentage,
  bodyFatMethod,
  bmrResults,
  tdee,
  activityLevel,
  bmiData,
  whrData,
  whtrData,
  bodyCompositionData,
  ffmiData,
  advancedMetricsData,
}: PDFExportProps) {
  const [clientName, setClientName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleExport = async () => {
    setIsGenerating(true);
    try {
      console.log('Starting PDF generation...');
      await generatePDF({
        clientName: clientName || undefined,
        formData,
        bodyFatPercentage,
        bodyFatMethod,
        bmrResults,
        tdee,
        activityLevel,
        bmi: bmiData,
        whr: whrData ?? undefined,
        whtr: whtrData ?? undefined,
        bodyComposition: bodyCompositionData ?? undefined,
        ffmi: ffmiData ?? undefined,
        advancedMetrics: advancedMetricsData ?? undefined,
        generatedAt: new Date(),
      });
      console.log('PDF generated successfully!');
    } catch (error) {
      console.error('PDF generation error:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      const errorMessage = error instanceof Error ? error.message : String(error);
      alert(`Wystąpił błąd podczas generowania PDF:\n${errorMessage}\n\nSprawdź konsolę przeglądarki (F12) po więcej szczegółów.`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
      <div className="flex items-center gap-2">
        <FileDown className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold text-gray-900">Eksport do PDF</h2>
      </div>

      <p className="text-sm text-gray-600">
        Wygeneruj profesjonalny raport PDF ze wszystkimi obliczeniami i wynikami.
      </p>

      {/* Client Name Input */}
      <div>
        <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-1">
          Imię i nazwisko klienta <span className="text-gray-500 text-xs">(opcjonalne)</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            id="clientName"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="Jan Kowalski"
          />
        </div>
      </div>

      {/* Export Button */}
      <button
        onClick={handleExport}
        disabled={isGenerating}
        className={`
          w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all
          ${isGenerating
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-primary hover:bg-primary-dark shadow-sm hover:shadow-md text-white'
          }
        `}
      >
        <FileDown className="w-5 h-5" style={!isGenerating ? { color: 'white' } : undefined} />
        {isGenerating ? 'Generowanie PDF...' : 'Eksportuj do PDF'}
      </button>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800">
        <p className="font-medium mb-1">Raport będzie zawierał:</p>
        <ul className="list-disc list-inside space-y-0.5">
          <li>Dane wejściowe klienta</li>
          <li>Wyniki wszystkich 11 modeli BMR</li>
          <li>Wartość TDEE z wybranym poziomem aktywności</li>
          <li>BMI z kategorią i zdrowym zakresem wagi</li>
          <li>Datę wygenerowania raportu</li>
        </ul>
      </div>

      <p className="text-xs text-gray-500 text-center">
        Plik zostanie automatycznie pobrany po wygenerowaniu
      </p>
    </div>
  );
}
