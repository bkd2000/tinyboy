import { useState } from 'react';
import type { FormData } from '../../types';
import { User, Weight, Ruler, Calendar } from 'lucide-react';

interface InputFormProps {
  data: FormData;
  onChange: (data: FormData) => void;
}

interface ValidationErrors {
  weight?: string;
  height?: string;
  age?: string;
  gender?: string;
}

export function InputForm({ data, onChange }: InputFormProps) {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());

  const validate = (field: keyof FormData, value: any): string | undefined => {
    switch (field) {
      case 'weight':
        if (!value) return 'To pole jest wymagane';
        if (value < 20 || value > 400) return 'Waga musi być w zakresie 20-400 kg';
        break;
      case 'height':
        if (!value) return 'To pole jest wymagane';
        if (value < 100 || value > 250) return 'Wzrost musi być w zakresie 100-250 cm';
        break;
      case 'age':
        if (!value) return 'To pole jest wymagane';
        if (value < 15 || value > 120) return 'Wiek musi być w zakresie 15-120 lat';
        break;
      case 'gender':
        if (!value) return 'To pole jest wymagane';
        break;
      case 'neckCircumference':
      case 'waistCircumference':
      case 'hipCircumference':
        if (value && value <= 0) return 'Wartość musi być większa od 0';
        break;
    }
    return undefined;
  };

  const handleChange = (field: keyof FormData, value: any) => {
    const newData = { ...data, [field]: value };
    onChange(newData);

    // Validate field
    const error = validate(field, value);
    setErrors(prev => ({
      ...prev,
      [field]: error,
    }));
  };

  const handleBlur = (field: string) => {
    setTouched(prev => new Set(prev).add(field));
  };

  const showError = (field: string) => {
    return touched.has(field) && errors[field as keyof ValidationErrors];
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <User className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold text-gray-900">Dane podstawowe</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Weight */}
        <div>
          <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
            Waga <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Weight className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="number"
              id="weight"
              min="20"
              max="400"
              step="0.1"
              value={data.weight || ''}
              onChange={(e) => handleChange('weight', e.target.value ? Number(e.target.value) : undefined)}
              onBlur={() => handleBlur('weight')}
              className={`
                block w-full pl-10 pr-12 py-2 border rounded-lg
                focus:ring-2 focus:ring-primary focus:border-primary
                ${showError('weight') ? 'border-danger' : 'border-gray-300'}
              `}
              placeholder="70"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 text-sm">kg</span>
            </div>
          </div>
          {showError('weight') && (
            <p className="mt-1 text-sm text-danger">{errors.weight}</p>
          )}
        </div>

        {/* Height */}
        <div>
          <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
            Wzrost <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Ruler className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="number"
              id="height"
              min="100"
              max="250"
              step="1"
              value={data.height || ''}
              onChange={(e) => handleChange('height', e.target.value ? Number(e.target.value) : undefined)}
              onBlur={() => handleBlur('height')}
              className={`
                block w-full pl-10 pr-12 py-2 border rounded-lg
                focus:ring-2 focus:ring-primary focus:border-primary
                ${showError('height') ? 'border-danger' : 'border-gray-300'}
              `}
              placeholder="175"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 text-sm">cm</span>
            </div>
          </div>
          {showError('height') && (
            <p className="mt-1 text-sm text-danger">{errors.height}</p>
          )}
        </div>

        {/* Age */}
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
            Wiek <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="number"
              id="age"
              min="15"
              max="120"
              step="1"
              value={data.age || ''}
              onChange={(e) => handleChange('age', e.target.value ? Number(e.target.value) : undefined)}
              onBlur={() => handleBlur('age')}
              className={`
                block w-full pl-10 pr-12 py-2 border rounded-lg
                focus:ring-2 focus:ring-primary focus:border-primary
                ${showError('age') ? 'border-danger' : 'border-gray-300'}
              `}
              placeholder="30"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 text-sm">lat</span>
            </div>
          </div>
          {showError('age') && (
            <p className="mt-1 text-sm text-danger">{errors.age}</p>
          )}
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Płeć <span className="text-danger">*</span>
          </label>
          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={() => handleChange('gender', 'male')}
              onBlur={() => handleBlur('gender')}
              className={`
                flex-1 py-2 px-4 rounded-lg border-2 font-medium transition-all
                ${data.gender === 'male'
                  ? 'bg-primary border-primary'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                }
              `}
              style={data.gender === 'male' ? { color: 'white' } : undefined}
            >
              Mężczyzna
            </button>
            <button
              type="button"
              onClick={() => handleChange('gender', 'female')}
              onBlur={() => handleBlur('gender')}
              className={`
                flex-1 py-2 px-4 rounded-lg border-2 font-medium transition-all
                ${data.gender === 'female'
                  ? 'bg-primary border-primary'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                }
              `}
              style={data.gender === 'female' ? { color: 'white' } : undefined}
            >
              Kobieta
            </button>
          </div>
          {showError('gender') && (
            <p className="mt-1 text-sm text-danger">{errors.gender}</p>
          )}
        </div>
      </div>

      {/* Optional Circumferences */}
      <div className="pt-4 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          Obwody ciała <span className="text-gray-500 text-xs">(opcjonalne, dla estymacji tkanki tłuszczowej)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Neck */}
          <div>
            <label htmlFor="neck" className="block text-sm font-medium text-gray-700 mb-1">
              Obwód szyi
            </label>
            <div className="relative">
              <input
                type="number"
                id="neck"
                min="0"
                step="0.1"
                value={data.neckCircumference || ''}
                onChange={(e) => handleChange('neckCircumference', e.target.value ? Number(e.target.value) : undefined)}
                className="block w-full pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="37"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 text-sm">cm</span>
              </div>
            </div>
          </div>

          {/* Waist */}
          <div>
            <label htmlFor="waist" className="block text-sm font-medium text-gray-700 mb-1">
              Obwód talii
            </label>
            <div className="relative">
              <input
                type="number"
                id="waist"
                min="0"
                step="0.1"
                value={data.waistCircumference || ''}
                onChange={(e) => handleChange('waistCircumference', e.target.value ? Number(e.target.value) : undefined)}
                className="block w-full pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="85"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 text-sm">cm</span>
              </div>
            </div>
          </div>

          {/* Hip - only for females */}
          {data.gender === 'female' && (
            <div>
              <label htmlFor="hip" className="block text-sm font-medium text-gray-700 mb-1">
                Obwód bioder
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="hip"
                  min="0"
                  step="0.1"
                  value={data.hipCircumference || ''}
                  onChange={(e) => handleChange('hipCircumference', e.target.value ? Number(e.target.value) : undefined)}
                  className="block w-full pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="95"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-sm">cm</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Required fields note */}
      <p className="text-xs text-gray-500">
        <span className="text-danger">*</span> Pola wymagane
      </p>
    </div>
  );
}
