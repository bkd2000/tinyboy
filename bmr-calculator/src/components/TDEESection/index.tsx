import { ACTIVITY_LEVELS } from '../../constants/formulas';
import { calculateTDEE } from '../../utils/tdee';
import { Activity, Zap } from 'lucide-react';

interface TDEESectionProps {
  bmr: number;
  activityLevel: number;
  onChange: (level: number) => void;
}

export function TDEESection({ bmr, activityLevel, onChange }: TDEESectionProps) {
  const tdee = calculateTDEE(bmr, activityLevel);
  const selectedLevel = ACTIVITY_LEVELS.find(l => l.value === activityLevel);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Activity className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold text-gray-900">TDEE - Całkowite Dzienne Zapotrzebowanie Energetyczne</h2>
      </div>

      <p className="text-sm text-gray-600">
        Wybierz poziom aktywności fizycznej, aby obliczyć TDEE (BMR × współczynnik aktywności)
      </p>

      {/* Activity Level Cards */}
      <div className="space-y-3">
        {ACTIVITY_LEVELS.map((level) => (
          <button
            key={level.value}
            onClick={() => onChange(level.value)}
            className={`
              w-full text-left p-4 rounded-lg border-2 transition-all
              ${level.value === activityLevel
                ? 'border-primary bg-primary-50 shadow-sm'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }
            `}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className={`font-semibold ${
                    level.value === activityLevel ? 'text-primary-900' : 'text-gray-900'
                  }`}>
                    {level.label}
                  </h3>
                  <span
                    className={`text-sm px-2 py-0.5 rounded ${
                      level.value === activityLevel
                        ? 'bg-primary'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                    style={level.value === activityLevel ? { color: '#FFFFFF' } : undefined}
                  >
                    ×{level.value}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{level.description}</p>
                <p className="text-xs text-gray-500 italic">
                  Przykład: {level.examples}
                </p>
              </div>
              {level.value === activityLevel && (
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* TDEE Result */}
      <div className="bg-gradient-to-br from-primary-50 to-primary-100 border-2 border-primary-200 rounded-lg p-6 mt-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-primary-900">Twoje TDEE</p>
            <p className="text-xs text-primary-700">
              {selectedLevel?.label} (×{activityLevel})
            </p>
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <p className="text-5xl font-bold text-primary">
            {tdee.toLocaleString('pl-PL')}
          </p>
          <p className="text-lg text-primary-700">kcal/dzień</p>
        </div>

        <div className="mt-4 pt-4 border-t border-primary-200">
          <p className="text-xs text-primary-800 mb-2 font-medium">Cele kaloryczne:</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-white/50 rounded px-2 py-1.5">
              <span className="text-primary-700">Utrzymanie wagi:</span>
              <span className="font-semibold text-primary-900 ml-1">{tdee} kcal</span>
            </div>
            <div className="bg-white/50 rounded px-2 py-1.5">
              <span className="text-primary-700">Redukcja:</span>
              <span className="font-semibold text-primary-900 ml-1">{tdee - 500} kcal</span>
            </div>
            <div className="bg-white/50 rounded px-2 py-1.5">
              <span className="text-primary-700">Masa:</span>
              <span className="font-semibold text-primary-900 ml-1">{tdee + 300} kcal</span>
            </div>
            <div className="bg-white/50 rounded px-2 py-1.5">
              <span className="text-primary-700">Szybka redukcja:</span>
              <span className="font-semibold text-primary-900 ml-1">{tdee - 750} kcal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800">
        <p>
          <strong>TDEE (Total Daily Energy Expenditure)</strong> to całkowita ilość kalorii,
          którą spalasz w ciągu dnia, uwzględniając podstawową przemianę materii (BMR) oraz aktywność fizyczną.
        </p>
      </div>
    </div>
  );
}
