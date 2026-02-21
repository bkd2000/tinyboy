import type { Gender, WHRData } from '../../types';
import {
  getWHRCategoryLabel,
  getWHRRiskDescription,
  getWHRCategoryColor,
} from '../../utils/whr';
import { ScanLine } from 'lucide-react';

interface WHRSectionProps {
  whr: WHRData;
  gender: Gender;
}

export function WHRSection({ whr, gender }: WHRSectionProps) {
  const categoryLabel = getWHRCategoryLabel(whr.category);
  const riskDescription = getWHRRiskDescription(whr.category, gender);
  const categoryColor = getWHRCategoryColor(whr.category);

  // Calculate position on WHR scale (0.6-1.2 range for visualization)
  const minValue = 0.6;
  const maxValue = 1.2;
  const scalePosition = Math.min(
    Math.max(((whr.value - minValue) / (maxValue - minValue)) * 100, 0),
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
        <ScanLine className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold text-gray-900">WHR - Stosunek Obwodu Talii do Bioder</h2>
      </div>

      {/* WHR Value Display */}
      <div className={`${colors.bg} border-2 ${colors.border} rounded-lg p-6`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Twoje WHR</p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold text-gray-900">{whr.value.toFixed(2)}</span>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-lg ${colors.badge}`}>
            <p className="font-semibold text-sm">{categoryLabel}</p>
          </div>
        </div>

        <p className={`text-sm ${colors.text}`}>{riskDescription}</p>
      </div>

      {/* WHR Scale Visual */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">Skala WHR</p>
        <div className="relative">
          {/* Scale bar */}
          <div className="h-8 rounded-lg overflow-hidden flex">
            {gender === 'male' ? (
              <>
                {/* Male scale: <0.95 green, 0.95-1.0 orange, >1.0 red */}
                <div className="bg-green-400" style={{ width: '58.33%' }} title="Niskie ryzyko"></div>
                <div className="bg-yellow-400" style={{ width: '8.33%' }} title="Umiarkowane ryzyko"></div>
                <div className="bg-red-400" style={{ width: '33.34%' }} title="Wysokie ryzyko"></div>
              </>
            ) : (
              <>
                {/* Female scale: <0.80 green, 0.80-0.85 orange, >0.85 red */}
                <div className="bg-green-400" style={{ width: '33.33%' }} title="Niskie ryzyko"></div>
                <div className="bg-yellow-400" style={{ width: '8.33%' }} title="Umiarkowane ryzyko"></div>
                <div className="bg-red-400" style={{ width: '58.34%' }} title="Wysokie ryzyko"></div>
              </>
            )}
          </div>

          {/* Indicator */}
          <div
            className="absolute top-0 w-1 h-8 bg-gray-900 shadow-lg transition-all"
            style={{ left: `${scalePosition}%`, transform: 'translateX(-50%)' }}
          >
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              {whr.value.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Scale labels */}
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>0.6</span>
          {gender === 'male' ? (
            <>
              <span>0.95</span>
              <span>1.0</span>
            </>
          ) : (
            <>
              <span>0.80</span>
              <span>0.85</span>
            </>
          )}
          <span>1.2</span>
        </div>

        <div className="grid grid-cols-3 gap-1 text-xs text-gray-600 mt-1">
          <div className="text-center">Niskie ryzyko</div>
          <div className="text-center">Umiarkowane</div>
          <div className="text-center">Wysokie ryzyko</div>
        </div>
      </div>

      {/* WHO Standards Reference */}
      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-xs font-medium text-gray-700 mb-2">
          Normy WHO (stosunek talia/biodra):
        </p>
        {gender === 'male' ? (
          <div className="space-y-1 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Niskie ryzyko (mężczyźni)</span>
              <span className="font-medium">&lt; 0.95</span>
            </div>
            <div className="flex justify-between">
              <span>Umiarkowane ryzyko (mężczyźni)</span>
              <span className="font-medium">0.95 - 1.0</span>
            </div>
            <div className="flex justify-between">
              <span>Wysokie ryzyko (mężczyźni)</span>
              <span className="font-medium">&gt; 1.0</span>
            </div>
          </div>
        ) : (
          <div className="space-y-1 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Niskie ryzyko (kobiety)</span>
              <span className="font-medium">&lt; 0.80</span>
            </div>
            <div className="flex justify-between">
              <span>Umiarkowane ryzyko (kobiety)</span>
              <span className="font-medium">0.80 - 0.85</span>
            </div>
            <div className="flex justify-between">
              <span>Wysokie ryzyko (kobiety)</span>
              <span className="font-medium">&gt; 0.85</span>
            </div>
          </div>
        )}
      </div>

      {/* Health Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-xs font-medium text-blue-900 mb-2">
          Co oznacza WHR?
        </p>
        <div className="space-y-2 text-xs text-blue-800">
          <p>
            WHR (Waist-to-Hip Ratio) to wskaźnik rozkładu tkanki tłuszczowej w ciele.
            Pomaga ocenić ryzyko chorób sercowo-naczyniowych i metabolicznych.
          </p>
          <p>
            <strong>Typ androïdowy (jabłko):</strong> Wysokie WHR - tłuszcz gromadzi się w okolicy
            brzucha, co zwiększa ryzyko chorób metabolicznych.
          </p>
          <p>
            <strong>Typ gynoidalny (gruszka):</strong> Niskie WHR - tłuszcz gromadzi się w okolicy
            bioder i ud, co wiąże się z niższym ryzykiem zdrowotnym.
          </p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs text-yellow-800">
        <p>
          <strong>Uwaga:</strong> WHR jest jednym z wielu wskaźników oceny zdrowia. Dla pełnej
          diagnozy rozkładu tkanki tłuszczowej skonsultuj się z lekarzem lub dietetykiem.
          Pomiary obwodów powinny być wykonane zgodnie ze standardami WHO.
        </p>
      </div>
    </div>
  );
}
