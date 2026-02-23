import { useState, useEffect } from 'react';
import type { FormData, BodyFatMethod } from '../../types';
import { estimateBodyFatUSNavy, estimateBodyFatDeurenberg, getBodyFatCategory } from '../../utils/bodyFat';
import { calculateBMI } from '../../utils/bmi';
import { calculateBAI, getBAICategory, getBAICategoryLabel, getBAICategoryDescription, getBAICategoryColor } from '../../utils/bai';
import { Activity, Info } from 'lucide-react';

interface BodyFatEstimatorProps {
  formData: FormData;
  value?: number;
  onChange: (value?: number) => void;
}

export function BodyFatEstimator({ formData, value, onChange }: BodyFatEstimatorProps) {
  const [method, setMethod] = useState<BodyFatMethod>('manual');
  const [manualValue, setManualValue] = useState<number | undefined>(value);

  // Auto-calculate when method or form data changes
  useEffect(() => {
    if (method === 'manual') {
      onChange(manualValue);
      return;
    }

    // Check if we have required data
    const hasRequiredData = formData.weight && formData.height && formData.age && formData.gender;
    if (!hasRequiredData) {
      onChange(undefined);
      return;
    }

    try {
      if (method === 'navy') {
        // US Navy method requires circumferences
        if (!formData.neckCircumference || !formData.waistCircumference || !formData.height || !formData.gender) {
          onChange(undefined);
          return;
        }

        // For females, also need hip
        if (formData.gender === 'female' && !formData.hipCircumference) {
          onChange(undefined);
          return;
        }

        const bodyFat = estimateBodyFatUSNavy({
          height: formData.height,
          neck: formData.neckCircumference,
          waist: formData.waistCircumference,
          hip: formData.hipCircumference,
          gender: formData.gender,
        });

        onChange(bodyFat);
      } else if (method === 'deurenberg') {
        // Deurenberg method uses BMI
        if (!formData.weight || !formData.height || !formData.age || !formData.gender) {
          onChange(undefined);
          return;
        }

        const bmi = calculateBMI(formData.weight, formData.height);
        const bodyFat = estimateBodyFatDeurenberg({
          bmi,
          age: formData.age,
          gender: formData.gender,
        });

        onChange(bodyFat);
      } else if (method === 'bai') {
        // BAI method uses hip circumference and height
        if (!formData.hipCircumference || !formData.height) {
          onChange(undefined);
          return;
        }

        const bodyFat = calculateBAI(formData.hipCircumference, formData.height);
        onChange(bodyFat);
      } else if (method === 'weighted-average') {
        // Weighted average: BAI 50%, US Navy 25%, Deurenberg 25%
        // Note: Manual input is NOT included (only automatic measurement methods)
        const methods: Array<{ value: number | null; weight: number }> = [];

        // BAI - 50% weight
        if (formData.hipCircumference && formData.height) {
          const baiFat = calculateBAI(formData.hipCircumference, formData.height);
          methods.push({ value: baiFat, weight: 0.5 });
        }

        // US Navy - 25% weight
        if (canCalculateNavy() && formData.height && formData.gender) {
          const navyFat = estimateBodyFatUSNavy({
            height: formData.height,
            neck: formData.neckCircumference!,
            waist: formData.waistCircumference!,
            hip: formData.hipCircumference,
            gender: formData.gender,
          });
          methods.push({ value: navyFat, weight: 0.25 });
        }

        // Deurenberg - 25% weight
        if (formData.weight && formData.height && formData.age && formData.gender) {
          const bmi = calculateBMI(formData.weight, formData.height);
          const deurenbergFat = estimateBodyFatDeurenberg({
            bmi,
            age: formData.age,
            gender: formData.gender,
          });
          methods.push({ value: deurenbergFat, weight: 0.25 });
        }

        // Calculate weighted average (normalize weights if not all methods available)
        if (methods.length > 0) {
          const totalWeight = methods.reduce((sum, m) => sum + m.weight, 0);
          const weightedSum = methods.reduce((sum, m) => sum + (m.value! * m.weight), 0);
          const weightedAverage = weightedSum / totalWeight;
          onChange(weightedAverage);
        } else {
          onChange(undefined);
        }
      }
    } catch (error) {
      console.error('Body fat calculation error:', error);
      onChange(undefined);
    }
  }, [method, formData, manualValue]);

  const handleMethodChange = (newMethod: BodyFatMethod) => {
    setMethod(newMethod);
  };

  const handleManualChange = (newValue: number | undefined) => {
    setManualValue(newValue);
    if (method === 'manual') {
      onChange(newValue);
    }
  };

  const canCalculateNavy = () => {
    if (!formData.neckCircumference || !formData.waistCircumference) return false;
    if (formData.gender === 'female' && !formData.hipCircumference) return false;
    return true;
  };

  const canCalculateDeurenberg = () => {
    return !!(formData.weight && formData.height && formData.age && formData.gender);
  };

  const canCalculateBAI = () => {
    return !!(formData.hipCircumference && formData.height);
  };

  const canCalculateWeightedAverage = () => {
    // Need at least BAI (50% weight) to make sense
    return canCalculateBAI();
  };

  const bodyFatCategory = value && formData.gender
    ? (method === 'bai'
        ? {
            category: getBAICategoryLabel(getBAICategory(value, formData.gender)),
            description: getBAICategoryDescription(getBAICategory(value, formData.gender), formData.gender),
            color: getBAICategoryColor(getBAICategory(value, formData.gender))
          }
        : getBodyFatCategory(value, formData.gender))
    : null;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold text-gray-900">Estymacja tkanki tłuszczowej</h2>
      </div>

      {/* Method Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Wybierz metodę estymacji
        </label>
        <div className="space-y-2">
          {/* Manual */}
          <button
            type="button"
            onClick={() => handleMethodChange('manual')}
            className={`
              w-full text-left p-3 rounded-lg border-2 transition-all
              ${method === 'manual'
                ? 'border-blue-700 border-4 bg-white'
                : 'border-gray-200 hover:border-gray-300 bg-white'
              }
            `}
          >
            <div className="font-medium text-gray-900">Ręczne wprowadzenie</div>
            <div className="text-xs mt-1 text-gray-600">
              Wpisz znany % tkanki tłuszczowej (np. z pomiaru)
            </div>
          </button>

          {/* US Navy */}
          <button
            type="button"
            onClick={() => handleMethodChange('navy')}
            className={`
              w-full text-left p-3 rounded-lg border-2 transition-all
              ${method === 'navy'
                ? 'border-blue-700 border-4 bg-white'
                : 'border-gray-200 hover:border-gray-300 bg-white'
              }
            `}
          >
            <div className="flex items-center justify-between">
              <div className="font-medium text-gray-900">Metoda US Navy</div>
              {!canCalculateNavy() && (
                <span className="text-xs text-warning-600 bg-warning-50 px-2 py-1 rounded">
                  Brak danych
                </span>
              )}
            </div>
            <div className="text-xs mt-1 text-gray-600">
              Obliczenie na podstawie obwodów ciała (szyja, talia{formData.gender === 'female' ? ', biodra' : ''})
            </div>
          </button>

          {/* Deurenberg */}
          <button
            type="button"
            onClick={() => handleMethodChange('deurenberg')}
            className={`
              w-full text-left p-3 rounded-lg border-2 transition-all
              ${method === 'deurenberg'
                ? 'border-blue-700 border-4 bg-white'
                : 'border-gray-200 hover:border-gray-300 bg-white'
              }
            `}
          >
            <div className="flex items-center justify-between">
              <div className="font-medium text-gray-900">Metoda Deurenberg</div>
              {!canCalculateDeurenberg() && (
                <span className="text-xs text-warning-600 bg-warning-50 px-2 py-1 rounded">
                  Brak danych
                </span>
              )}
            </div>
            <div className="text-xs mt-1 text-gray-600">
              Obliczenie na podstawie BMI, wieku i płci
            </div>
          </button>

          {/* BAI */}
          <button
            type="button"
            onClick={() => handleMethodChange('bai')}
            className={`
              w-full text-left p-3 rounded-lg border-2 transition-all
              ${method === 'bai'
                ? 'border-blue-700 border-4 bg-white'
                : 'border-gray-200 hover:border-gray-300 bg-white'
              }
            `}
          >
            <div className="flex items-center justify-between">
              <div className="font-medium text-gray-900">Metoda BAI (Body Adiposity Index)</div>
              {!canCalculateBAI() && (
                <span className="text-xs text-warning-600 bg-warning-50 px-2 py-1 rounded">
                  Brak danych
                </span>
              )}
            </div>
            <div className="text-xs mt-1 text-gray-600">
              Obliczenie na podstawie obwodu bioder i wzrostu
            </div>
          </button>

          {/* Weighted Average */}
          <button
            type="button"
            onClick={() => handleMethodChange('weighted-average')}
            className={`
              w-full text-left p-3 rounded-lg border-2 transition-all
              ${method === 'weighted-average'
                ? 'border-blue-700 border-4 bg-white'
                : 'border-gray-200 hover:border-gray-300 bg-white'
              }
            `}
          >
            <div className="flex items-center justify-between">
              <div className="font-medium text-gray-900">Średnia ważona z wszystkich metod</div>
              {!canCalculateWeightedAverage() && (
                <span className="text-xs text-warning-600 bg-warning-50 px-2 py-1 rounded">
                  Brak danych
                </span>
              )}
            </div>
            <div className="text-xs mt-1 text-gray-600">
              BAI 50%, US Navy 25%, Deurenberg 25% (tylko automatyczne metody)
            </div>
          </button>
        </div>
      </div>

      {/* Manual Input Field */}
      {method === 'manual' && (
        <div>
          <label htmlFor="bodyFatManual" className="block text-sm font-medium text-gray-700 mb-1">
            % tkanki tłuszczowej
          </label>
          <div className="relative">
            <input
              type="number"
              id="bodyFatManual"
              min="0"
              max="100"
              step="0.1"
              value={manualValue || ''}
              onChange={(e) => handleManualChange(e.target.value ? Number(e.target.value) : undefined)}
              className="block w-full pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="15.0"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 text-sm">%</span>
            </div>
          </div>
        </div>
      )}

      {/* US Navy Instructions */}
      {method === 'navy' && !canCalculateNavy() && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex gap-2">
            <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Wymagane pomiary:</p>
              <ul className="list-disc list-inside space-y-0.5 text-xs">
                <li>Obwód szyi</li>
                <li>Obwód talii</li>
                {formData.gender === 'female' && <li>Obwód bioder (dla kobiet)</li>}
              </ul>
              <p className="mt-2 text-xs">
                Uzupełnij obwody ciała w formularzu danych podstawowych.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* BAI Instructions */}
      {method === 'bai' && !canCalculateBAI() && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex gap-2">
            <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Wymagane pomiary:</p>
              <ul className="list-disc list-inside space-y-0.5 text-xs">
                <li>Obwód bioder</li>
                <li>Wzrost</li>
              </ul>
              <p className="mt-2 text-xs">
                Uzupełnij obwód bioder w formularzu danych podstawowych.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Weighted Average Instructions */}
      {method === 'weighted-average' && !canCalculateWeightedAverage() && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex gap-2">
            <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Średnia ważona wymaga minimum:</p>
              <ul className="list-disc list-inside space-y-0.5 text-xs">
                <li><strong>BAI (50% wagi):</strong> Obwód bioder, Wzrost</li>
                <li><strong>Opcjonalnie US Navy (25%):</strong> Obwód szyi, talii{formData.gender === 'female' ? ', bioder' : ''}</li>
                <li><strong>Opcjonalnie Deurenberg (25%):</strong> Waga, Wzrost, Wiek, Płeć</li>
              </ul>
              <p className="mt-2 text-xs">
                Im więcej metod możliwych do obliczenia, tym dokładniejszy wynik. Ręczne wprowadzenie nie jest uwzględniane w średniej ważonej.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Result Display */}
      {value !== undefined && (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Szacowany % tkanki tłuszczowej:</span>
            <span className="text-2xl font-bold text-primary">{value.toFixed(1)}%</span>
          </div>

          {bodyFatCategory && (
            <div className={`
              mt-2 px-3 py-2 rounded-lg text-sm
              ${bodyFatCategory.color === 'success' ? 'bg-success-50 text-success-700' : ''}
              ${bodyFatCategory.color === 'warning' ? 'bg-warning-50 text-warning-700' : ''}
              ${bodyFatCategory.color === 'danger' ? 'bg-danger-50 text-danger-700' : ''}
            `}>
              <div className="font-medium">{bodyFatCategory.category}</div>
              <div className="text-xs mt-0.5">{bodyFatCategory.description}</div>
            </div>
          )}

          <div className="mt-2 text-xs text-gray-500">
            Metoda: {
              method === 'manual' ? 'Ręczne wprowadzenie' :
              method === 'navy' ? 'US Navy' :
              method === 'bai' ? 'BAI (Body Adiposity Index)' :
              method === 'weighted-average' ? 'Średnia ważona (BAI 50%, Navy 25%, Deurenberg 25%)' :
              'Deurenberg (BMI)'
            }
          </div>
        </div>
      )}

      {/* Info about BMR models */}
      {value !== undefined && (
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-3">
          <div className="flex gap-2">
            <Info className="w-4 h-4 text-primary-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-primary-800">
              Estymacja % tkanki tłuszczowej umożliwi obliczenie BMR metodami Katch-McArdle i Cunningham,
              które bazują na beztłuszczowej masie ciała (LBM).
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
