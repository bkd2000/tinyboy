import type { FFMIData, Gender } from '../../types';
import {
  getFFMICategoryLabel,
  getFFMICategoryDescription,
  getFFMICategoryColor,
} from '../../utils/ffmi';
import { Award, AlertTriangle } from 'lucide-react';

interface FFMISectionProps {
  ffmi?: FFMIData;
  gender: Gender;
}

export function FFMISection({ ffmi, gender }: FFMISectionProps) {
  // Show placeholder if FFMI is not available
  if (!ffmi) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold text-gray-900">FFMI - Wskaźnik Masy Beztłuszczowej</h2>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-600 mb-2">FFMI wymaga % tkanki tłuszczowej</p>
          <p className="text-sm text-gray-500">
            Uzupełnij dane w sekcji "Estymacja tkanki tłuszczowej" aby obliczyć FFMI
            - wskaźnik pozwalający ocenić masę mięśniową niezależnie od wzrostu i tkanki tłuszczowej.
          </p>
        </div>
      </div>
    );
  }

  const categoryLabel = getFFMICategoryLabel(ffmi.category);
  const categoryDescription = getFFMICategoryDescription(ffmi.category, gender);
  const categoryColor = getFFMICategoryColor(ffmi.category);

  // Thresholds for gender-specific warnings
  const suspiciousThreshold = gender === 'male' ? 26 : 22;
  const isSuspicious = ffmi.ffmi > suspiciousThreshold;

  // Calculate position on FFMI scale (for visual representation)
  // Scale range: 12-30 for men, 10-25 for women
  const scaleMin = gender === 'male' ? 12 : 10;
  const scaleMax = gender === 'male' ? 30 : 25;
  const scalePosition = Math.min(Math.max(((ffmi.ffmi - scaleMin) / (scaleMax - scaleMin)) * 100, 0), 100);

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

  // Gender-specific scale ranges
  const scaleRanges = gender === 'male' ? [
    { label: 'Niska', max: 18, color: 'bg-red-300' },
    { label: 'Przeciętna', max: 20, color: 'bg-yellow-300' },
    { label: 'Powyżej przeciętnej', max: 22, color: 'bg-green-300' },
    { label: 'Bardzo dobra', max: 23, color: 'bg-green-500' },
    { label: 'Doskonała', max: 26, color: 'bg-blue-500' },
    { label: 'Podejrzana', max: 30, color: 'bg-red-500' },
  ] : [
    { label: 'Niska', max: 15, color: 'bg-red-300' },
    { label: 'Przeciętna', max: 17, color: 'bg-yellow-300' },
    { label: 'Powyżej przeciętnej', max: 18, color: 'bg-green-300' },
    { label: 'Bardzo dobra', max: 20, color: 'bg-green-500' },
    { label: 'Doskonała', max: 22, color: 'bg-blue-500' },
    { label: 'Podejrzana', max: 25, color: 'bg-red-500' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Award className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold text-gray-900">FFMI - Wskaźnik Masy Beztłuszczowej</h2>
      </div>

      {/* FFMI Value Display */}
      <div className={`${colors.bg} border-2 ${colors.border} rounded-lg p-6`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Twoje FFMI</p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold text-gray-900">{ffmi.ffmi.toFixed(1)}</span>
              <span className="text-lg text-gray-600">kg/m²</span>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Normalized FFMI: <span className="font-semibold">{ffmi.normalizedFFMI.toFixed(1)}</span>
            </p>
          </div>
          <div className={`px-4 py-2 rounded-lg ${colors.badge}`}>
            <p className="font-semibold text-sm">{categoryLabel}</p>
          </div>
        </div>

        <p className={`text-sm ${colors.text}`}>{categoryDescription}</p>
      </div>

      {/* Steroid Warning for Suspicious Values */}
      {isSuspicious && (
        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-red-900 mb-1">
                Ostrzeżenie: Podejrzanie wysokie FFMI
              </p>
              <p className="text-xs text-red-800">
                FFMI powyżej {suspiciousThreshold} jest wyjątkowo rzadkie u osób nietrenujących bez wspomagania
                farmakologicznego (sterydy anaboliczne). Wartości powyżej tego progu są osiągalne naturalnie
                jedynie przez nielicznych sportowców z wyjątkową genetyką i wieloletnim treningiem.
              </p>
              <p className="text-xs text-red-700 mt-2 font-medium">
                Maksymalne naturalne FFMI (badania): ~25 dla mężczyzn, ~22 dla kobiet
              </p>
            </div>
          </div>
        </div>
      )}

      {/* FFMI Scale Visual */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">Skala FFMI dla {gender === 'male' ? 'mężczyzn' : 'kobiet'}</p>
        <div className="relative">
          {/* Scale bar */}
          <div className="h-8 rounded-lg overflow-hidden flex">
            {scaleRanges.map((range, index) => (
              <div
                key={index}
                className={`flex-1 ${range.color}`}
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
              {ffmi.ffmi.toFixed(1)}
            </div>
          </div>
        </div>

        {/* Scale labels */}
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          {gender === 'male' ? (
            <>
              <span>12</span>
              <span>18</span>
              <span>20</span>
              <span>22</span>
              <span>23</span>
              <span>26</span>
              <span>30</span>
            </>
          ) : (
            <>
              <span>10</span>
              <span>15</span>
              <span>17</span>
              <span>18</span>
              <span>20</span>
              <span>22</span>
              <span>25</span>
            </>
          )}
        </div>

        <div className="grid grid-cols-6 gap-1 text-xs text-gray-600 mt-1">
          {scaleRanges.map((range, index) => (
            <div key={index} className="text-center">{range.label}</div>
          ))}
        </div>
      </div>

      {/* FFMI Formula */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
        <p className="text-sm font-medium text-indigo-900 mb-2">Wzór FFMI</p>
        <div className="space-y-2 text-xs text-indigo-800">
          <p className="font-mono">
            FFMI = FFM / (wzrost_m)²
          </p>
          <p className="font-mono">
            Normalized FFMI = FFMI + 6.1 × (1.8 - wzrost_m)
          </p>
          <p className="text-indigo-700 mt-2">
            Normalized FFMI koryguje wartość ze względu na wzrost, umożliwiając porównanie osób o różnym wzroście.
          </p>
        </div>
      </div>

      {/* FFMI Categories Reference */}
      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-xs font-medium text-gray-700 mb-2">
          Normy FFMI dla {gender === 'male' ? 'mężczyzn' : 'kobiet'}:
        </p>
        <div className="space-y-1 text-xs text-gray-600">
          {gender === 'male' ? (
            <>
              <div className="flex justify-between">
                <span>Poniżej przeciętnej</span>
                <span className="font-medium">&lt; 18</span>
              </div>
              <div className="flex justify-between">
                <span>Przeciętna</span>
                <span className="font-medium">18 - 20</span>
              </div>
              <div className="flex justify-between">
                <span>Powyżej przeciętnej</span>
                <span className="font-medium">20 - 22</span>
              </div>
              <div className="flex justify-between">
                <span>Bardzo dobra</span>
                <span className="font-medium">22 - 23</span>
              </div>
              <div className="flex justify-between">
                <span>Doskonała</span>
                <span className="font-medium">23 - 26</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-600">Podejrzana (sterydy)</span>
                <span className="font-medium text-red-600">&gt; 26</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between">
                <span>Poniżej przeciętnej</span>
                <span className="font-medium">&lt; 15</span>
              </div>
              <div className="flex justify-between">
                <span>Przeciętna</span>
                <span className="font-medium">15 - 17</span>
              </div>
              <div className="flex justify-between">
                <span>Powyżej przeciętnej</span>
                <span className="font-medium">17 - 18</span>
              </div>
              <div className="flex justify-between">
                <span>Bardzo dobra</span>
                <span className="font-medium">18 - 20</span>
              </div>
              <div className="flex justify-between">
                <span>Doskonała</span>
                <span className="font-medium">20 - 22</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-600">Podejrzana (sterydy)</span>
                <span className="font-medium text-red-600">&gt; 22</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800">
        <p>
          <strong>Uwaga:</strong> FFMI (Fat-Free Mass Index) jest narzędziem do oceny masy mięśniowej
          niezależnie od wzrostu i poziomu tkanki tłuszczowej. Wartości powyżej 25 (mężczyźni) lub 22
          (kobiety) są wyjątkowo rzadkie bez wspomagania farmakologicznego.
        </p>
      </div>
    </div>
  );
}
