import type { BAIData, Gender } from '../../types';
import {
  getBAICategoryLabel,
  getBAICategoryDescription,
  getBAICategoryColor,
  getBAIScaleRanges,
} from '../../utils/bai';
import { Percent } from 'lucide-react';

interface BAISectionProps {
  bai: BAIData;
  gender: Gender;
  hipCircumference: number;
  height: number;
}

export function BAISection({ bai, gender, hipCircumference, height }: BAISectionProps) {
  const categoryLabel = getBAICategoryLabel(bai.category);
  const categoryDescription = getBAICategoryDescription(bai.category, gender);
  const categoryColor = getBAICategoryColor(bai.category);
  const scaleRanges = getBAIScaleRanges(gender);

  // Calculate position on BAI scale for visualization
  const minValue = gender === 'male' ? 0 : 0;
  const maxValue = gender === 'male' ? 50 : 70;
  const scalePosition = Math.min(
    Math.max(((bai.value - minValue) / (maxValue - minValue)) * 100, 0),
    100
  );

  const colorClasses = {
    success: {
      bg: 'bg-success-50',
      border: 'border-success-200',
      text: 'text-success-700',
      badge: 'bg-success text-white',
    },
    warning: {
      bg: 'bg-warning-50',
      border: 'border-warning-200',
      text: 'text-warning-700',
      badge: 'bg-warning text-white',
    },
    danger: {
      bg: 'bg-danger-50',
      border: 'border-danger-200',
      text: 'text-danger-700',
      badge: 'bg-danger text-white',
    },
  };

  const colors = colorClasses[categoryColor];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Percent className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold text-gray-900">BAI - Body Adiposity Index</h2>
      </div>

      {/* BAI Value Display */}
      <div className={`${colors.bg} border-2 ${colors.border} rounded-lg p-6`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Twoje BAI</p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold text-gray-900">{bai.value.toFixed(1)}</span>
              <span className="text-2xl font-semibold text-gray-600">%</span>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-lg ${colors.badge}`}>
            <p className="font-semibold text-sm">{categoryLabel}</p>
          </div>
        </div>

        <p className={`text-sm ${colors.text}`}>{categoryDescription}</p>
      </div>

      {/* BAI Scale Visual - 5 sections based on gender */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">Skala BAI ({gender === 'male' ? 'Mężczyźni' : 'Kobiety'})</p>
        <div className="relative">
          {/* Scale bar - 5 equal sections (20% each) */}
          <div className="h-8 rounded-lg overflow-hidden flex">
            {scaleRanges.map((range, index) => (
              <div
                key={index}
                className={range.color}
                style={{ width: '20%' }}
                title={range.label}
              ></div>
            ))}
          </div>

          {/* Indicator */}
          <div
            className="absolute top-0 w-1 h-8 bg-gray-900 shadow-lg transition-all"
            style={{ left: `${scalePosition}%`, transform: 'translateX(-50%)' }}
          >
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              {bai.value.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Scale labels */}
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          {scaleRanges.map((range, index) => (
            <span key={index}>{range.min}%</span>
          ))}
          <span>{gender === 'male' ? '50%' : '70%'}</span>
        </div>

        <div className="grid grid-cols-5 gap-1 text-xs text-gray-600 mt-1">
          {scaleRanges.map((range, index) => (
            <div key={index} className="text-center">{range.label}</div>
          ))}
        </div>
      </div>

      {/* Unique BAI Feature - Purple box */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <p className="text-xs font-medium text-purple-900 mb-2">
          Dlaczego BAI jest wyjątkowy?
        </p>
        <div className="space-y-2 text-xs text-purple-800">
          <p>
            <strong>Nie wymaga wagi</strong> - BAI oblicza się wyłącznie na podstawie obwodu bioder i wzrostu, co czyni go unikalnym wskaźnikiem.
          </p>
          <p>
            <strong>Bezpośrednia estymacja tłuszczu</strong> - W przeciwieństwie do BMI, BAI bezpośrednio szacuje procent tkanki tłuszczowej w organizmie.
          </p>
          <p>
            <strong>Bardziej precyzyjny niż BMI</strong> - BAI lepiej koreluje z rzeczywistym poziomem tkanki tłuszczowej, szczególnie u osób z różną budową ciała.
          </p>
        </div>
      </div>

      {/* Formula explanation - Indigo box */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
        <p className="text-xs font-medium text-indigo-900 mb-2">
          Wzór BAI
        </p>
        <div className="space-y-2 text-xs text-indigo-800">
          <p className="font-mono bg-white px-3 py-2 rounded border border-indigo-200">
            BAI = (obwód bioder / wzrost<sup>1.5</sup>) - 18
          </p>
          <p>
            <strong>Twoje dane:</strong> Obwód bioder: {hipCircumference} cm, Wzrost: {height} cm → BAI: <strong>{bai.value.toFixed(1)}%</strong>
          </p>
          <p>
            Wynik BAI to bezpośrednie oszacowanie procentu tkanki tłuszczowej w organizmie.
          </p>
        </div>
      </div>

      {/* Standards Reference - Gray box */}
      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-xs font-medium text-gray-700 mb-2">
          Normy BAI - {gender === 'male' ? 'Mężczyźni' : 'Kobiety'}:
        </p>
        <div className="space-y-1 text-xs text-gray-600">
          {scaleRanges.map((range, index) => (
            <div key={index} className="flex justify-between">
              <span>{range.label}</span>
              <span className="font-medium">
                {range.max === (gender === 'male' ? 50 : 70)
                  ? `≥ ${range.min}%`
                  : `${range.min} - ${range.max - 1}%`}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Health Information - Blue box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-xs font-medium text-blue-900 mb-2">
          Co to jest BAI?
        </p>
        <div className="space-y-2 text-xs text-blue-800">
          <p>
            BAI (Body Adiposity Index) to wskaźnik adipozytarności ciała, który estymuje procent tkanki tłuszczowej bez konieczności ważenia się.
          </p>
          <p>
            <strong>Zastosowanie:</strong> BAI jest szczególnie przydatny dla osób, które nie mają dostępu do wagi lub chcą monitorować skład ciała bez użycia sprzętu pomiarowego.
          </p>
          <p>
            <strong>Ograniczenia:</strong> BAI może być mniej dokładny u sportowców z bardzo rozwiniętą muskulaturą lub u osób starszych.
          </p>
        </div>
      </div>

      {/* Disclaimer - Yellow box */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs text-yellow-800">
        <p>
          <strong>Uwaga:</strong> BAI jest narzędziem szacunkowym i nie zastępuje profesjonalnej oceny składu ciała (np. DEXA, bioimpedancja). Dla dokładnej diagnozy poziomu tkanki tłuszczowej skonsultuj się z lekarzem lub dietetykiem. Pomiar obwodu bioder należy wykonać w najszerszym miejscu pośladków.
        </p>
      </div>
    </div>
  );
}
