import type { WHtRData } from '../../types';
import {
  getWHtRCategoryLabel,
  getWHtRCategoryDescription,
  getWHtRCategoryColor,
} from '../../utils/whtr';
import { Ruler } from 'lucide-react';

interface WHtRSectionProps {
  whtr: WHtRData;
  height: number;
}

export function WHtRSection({ whtr, height }: WHtRSectionProps) {
  const categoryLabel = getWHtRCategoryLabel(whtr.category);
  const categoryDescription = getWHtRCategoryDescription(whtr.category);
  const categoryColor = getWHtRCategoryColor(whtr.category);

  // Calculate position on WHtR scale (0.35-0.70 range for visualization)
  const minValue = 0.35;
  const maxValue = 0.70;
  const scalePosition = Math.min(
    Math.max(((whtr.value - minValue) / (maxValue - minValue)) * 100, 0),
    100
  );

  // Calculate "half height" recommendation
  const halfHeight = height / 2;

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
        <Ruler className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold text-gray-900">WHtR - Stosunek Obwodu Talii do Wzrostu</h2>
      </div>

      {/* WHtR Value Display */}
      <div className={`${colors.bg} border-2 ${colors.border} rounded-lg p-6`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Twoje WHtR</p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold text-gray-900">{whtr.value.toFixed(2)}</span>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-lg ${colors.badge}`}>
            <p className="font-semibold text-sm">{categoryLabel}</p>
          </div>
        </div>

        <p className={`text-sm ${colors.text}`}>{categoryDescription}</p>
      </div>

      {/* WHtR Scale Visual - 4 equal sections */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">Skala WHtR</p>
        <div className="relative">
          {/* Scale bar - 4 equal sections (25% each) */}
          <div className="h-8 rounded-lg overflow-hidden flex">
            <div className="bg-yellow-200" style={{ width: '25%' }} title="Bardzo szczupły"></div>
            <div className="bg-green-400" style={{ width: '25%' }} title="Zdrowy"></div>
            <div className="bg-yellow-400" style={{ width: '25%' }} title="Zwiększone ryzyko"></div>
            <div className="bg-red-400" style={{ width: '25%' }} title="Wysokie ryzyko"></div>
          </div>

          {/* Indicator */}
          <div
            className="absolute top-0 w-1 h-8 bg-gray-900 shadow-lg transition-all"
            style={{ left: `${scalePosition}%`, transform: 'translateX(-50%)' }}
          >
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              {whtr.value.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Scale labels */}
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>0.35</span>
          <span>0.40</span>
          <span>0.50</span>
          <span>0.60</span>
          <span>0.70</span>
        </div>

        <div className="grid grid-cols-4 gap-1 text-xs text-gray-600 mt-1">
          <div className="text-center">Bardzo szczupły</div>
          <div className="text-center">Zdrowy</div>
          <div className="text-center">Zwiększone</div>
          <div className="text-center">Wysokie</div>
        </div>
      </div>

      {/* Half Height Rule */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
        <p className="text-xs font-medium text-indigo-900 mb-2">
          Zasada "pół wzrostu"
        </p>
        <div className="space-y-2 text-xs text-indigo-800">
          <p>
            <strong>Twój wzrost:</strong> {height} cm → Połowa: <strong>{halfHeight.toFixed(1)} cm</strong>
          </p>
          <p>
            Aby utrzymać zdrowe WHtR (&lt; 0.50), obwód talii powinien być mniejszy niż połowa wzrostu.
          </p>
        </div>
      </div>

      {/* WHO Standards Reference */}
      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-xs font-medium text-gray-700 mb-2">
          Uniwersalne normy WHtR (dla wszystkich dorosłych):
        </p>
        <div className="space-y-1 text-xs text-gray-600">
          <div className="flex justify-between">
            <span>Bardzo szczupły</span>
            <span className="font-medium">&lt; 0.40</span>
          </div>
          <div className="flex justify-between">
            <span>Zdrowy</span>
            <span className="font-medium">0.40 - 0.49</span>
          </div>
          <div className="flex justify-between">
            <span>Zwiększone ryzyko</span>
            <span className="font-medium">0.50 - 0.59</span>
          </div>
          <div className="flex justify-between">
            <span>Wysokie ryzyko</span>
            <span className="font-medium">&ge; 0.60</span>
          </div>
        </div>
      </div>

      {/* Health Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-xs font-medium text-blue-900 mb-2">
          Co oznacza WHtR?
        </p>
        <div className="space-y-2 text-xs text-blue-800">
          <p>
            WHtR (Waist-to-Height Ratio) to uniwersalny wskaźnik oceny ryzyka zdrowotnego
            oparty na stosunku obwodu talii do wzrostu.
          </p>
          <p>
            <strong>Zalety WHtR:</strong> Prosty w interpretacji, uniwersalny dla wszystkich
            grup wiekowych i płci, silnie skorelowany z ryzykiem chorób metabolicznych.
          </p>
          <p>
            <strong>Prosta zasada:</strong> "Utrzymuj obwód talii mniejszy niż połowa wzrostu"
            - łatwa do zapamiętania i zastosowania w codziennym życiu.
          </p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs text-yellow-800">
        <p>
          <strong>Uwaga:</strong> WHtR jest jednym z wielu wskaźników oceny zdrowia. Dla pełnej
          diagnozy rozkładu tkanki tłuszczowej skonsultuj się z lekarzem lub dietetykiem.
          Pomiar obwodu talii należy wykonać w najwęższym miejscu tułowia.
        </p>
      </div>
    </div>
  );
}
