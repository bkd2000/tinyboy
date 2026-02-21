import type { BMIData } from '../../types';
import {
  getBMICategoryLabel,
  getBMICategoryDescription,
  getBMICategoryColor,
} from '../../utils/bmi';
import { Scale, Target } from 'lucide-react';

interface BMISectionProps {
  bmi: BMIData;
  height: number;
}

export function BMISection({ bmi, height }: BMISectionProps) {
  const categoryLabel = getBMICategoryLabel(bmi.category);
  const categoryDescription = getBMICategoryDescription(bmi.category);
  const categoryColor = getBMICategoryColor(bmi.category);

  // Calculate position on BMI scale (0-40 range)
  const scalePosition = Math.min(Math.max((bmi.value / 40) * 100, 0), 100);

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
        <Scale className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold text-gray-900">BMI - Wskaźnik Masy Ciała</h2>
      </div>

      {/* BMI Value Display */}
      <div className={`${colors.bg} border-2 ${colors.border} rounded-lg p-6`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Twoje BMI</p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold text-gray-900">{bmi.value}</span>
              <span className="text-lg text-gray-600">kg/m²</span>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-lg ${colors.badge}`}>
            <p className="font-semibold text-sm">{categoryLabel}</p>
          </div>
        </div>

        <p className={`text-sm ${colors.text}`}>{categoryDescription}</p>
      </div>

      {/* BMI Scale Visual */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">Skala BMI</p>
        <div className="relative">
          {/* Scale bar */}
          <div className="h-8 rounded-lg overflow-hidden flex">
            <div className="flex-1 bg-yellow-200" title="Niedowaga"></div>
            <div className="flex-1 bg-green-400" title="Norma"></div>
            <div className="flex-1 bg-yellow-400" title="Nadwaga"></div>
            <div className="flex-1 bg-orange-400" title="Otyłość I°"></div>
            <div className="flex-1 bg-red-400" title="Otyłość II°"></div>
            <div className="flex-1 bg-red-600" title="Otyłość III°"></div>
          </div>

          {/* Indicator */}
          <div
            className="absolute top-0 w-1 h-8 bg-gray-900 shadow-lg transition-all"
            style={{ left: `${scalePosition}%`, transform: 'translateX(-50%)' }}
          >
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              {bmi.value}
            </div>
          </div>
        </div>

        {/* Scale labels */}
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>15</span>
          <span>18.5</span>
          <span>25</span>
          <span>30</span>
          <span>35</span>
          <span>40+</span>
        </div>

        <div className="grid grid-cols-6 gap-1 text-xs text-gray-600 mt-1">
          <div className="text-center">Niedowaga</div>
          <div className="text-center">Norma</div>
          <div className="text-center">Nadwaga</div>
          <div className="text-center">Otyłość I°</div>
          <div className="text-center">Otyłość II°</div>
          <div className="text-center">Otyłość III°</div>
        </div>
      </div>

      {/* Healthy Weight Range */}
      <div className="bg-success-50 border border-success-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-success rounded-full flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-success-900 mb-1">
              Zdrowy zakres wagi dla Twojego wzrostu
            </p>
            <p className="text-xs text-success-700 mb-2">
              Wzrost: {height} cm
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-success">
                {bmi.healthyWeightRange.min} - {bmi.healthyWeightRange.max}
              </span>
              <span className="text-sm text-success-700">kg</span>
            </div>
            <p className="text-xs text-success-600 mt-2">
              Zakres odpowiadający BMI 18.5-24.9 (zdrowa norma WHO)
            </p>
          </div>
        </div>
      </div>

      {/* BMI Categories Reference */}
      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-xs font-medium text-gray-700 mb-2">Klasyfikacja WHO:</p>
        <div className="space-y-1 text-xs text-gray-600">
          <div className="flex justify-between">
            <span>Niedowaga</span>
            <span className="font-medium">&lt; 18.5</span>
          </div>
          <div className="flex justify-between">
            <span>Norma</span>
            <span className="font-medium">18.5 - 24.9</span>
          </div>
          <div className="flex justify-between">
            <span>Nadwaga</span>
            <span className="font-medium">25.0 - 29.9</span>
          </div>
          <div className="flex justify-between">
            <span>Otyłość I°</span>
            <span className="font-medium">30.0 - 34.9</span>
          </div>
          <div className="flex justify-between">
            <span>Otyłość II°</span>
            <span className="font-medium">35.0 - 39.9</span>
          </div>
          <div className="flex justify-between">
            <span>Otyłość III° (skrajna)</span>
            <span className="font-medium">≥ 40.0</span>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800">
        <p>
          <strong>Uwaga:</strong> BMI jest narzędziem przesiewowym i nie uwzględnia składu ciała
          (masy mięśniowej vs. tkanki tłuszczowej). Sportowcy i osoby z dużą masą mięśniową mogą
          mieć podwyższone BMI przy niskim poziomie tkanki tłuszczowej.
        </p>
      </div>
    </div>
  );
}
