import type { AdvancedBodyMetricsData, Gender } from '../types';

interface Props {
  metrics: AdvancedBodyMetricsData;
  gender: Gender;
}

export function AdvancedBodyMetricsSection({ metrics, gender }: Props) {
  const { smm, tbw, metabolicAge, visceralFat } = metrics;

  // Color mapping for categories
  const getMetabolicAgeColor = (category: string): string => {
    switch (category) {
      case 'Doskonały':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'Bardzo dobry':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'Dobry':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'Przeciętny':
        return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'Poniżej przeciętnej':
        return 'text-orange-700 bg-orange-50 border-orange-200';
      case 'Słaby':
        return 'text-red-700 bg-red-50 border-red-200';
      default:
        return 'text-red-800 bg-red-50 border-red-300';
    }
  };

  const getVisceralFatColor = (risk: string): string => {
    switch (risk) {
      case 'Niskie ryzyko':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'Średnie ryzyko':
        return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'Wysokie ryzyko':
        return 'text-orange-700 bg-orange-50 border-orange-200';
      default:
        return 'text-red-800 bg-red-50 border-red-300';
    }
  };

  const getCategoryColor = (category: string): string => {
    if (category.includes('Niska') || category.includes('odwodnienie')) {
      return 'text-orange-700 bg-orange-50 border-orange-200';
    }
    if (category.includes('Poniżej')) {
      return 'text-yellow-700 bg-yellow-50 border-yellow-200';
    }
    if (category.includes('Przeciętna') || category.includes('Prawidłowa')) {
      return 'text-blue-700 bg-blue-50 border-blue-200';
    }
    if (category.includes('Powyżej')) {
      return 'text-green-700 bg-green-50 border-green-200';
    }
    if (category.includes('Wysoka')) {
      return 'text-green-800 bg-green-50 border-green-300';
    }
    return 'text-gray-700 bg-gray-50 border-gray-200';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Zaawansowane wskaźniki metaboliczne
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Szczegółowa analiza składu ciała i metabolizmu
        </p>
      </div>

      <div className="space-y-6">
        {/* SMM - Skeletal Muscle Mass */}
        {smm && (
          <div className="border-l-4 border-indigo-500 pl-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900">
                SMM <span className="text-sm font-normal text-gray-600">(Skeletal Muscle Mass)</span>
              </h3>
              <span className="text-2xl font-bold text-indigo-600">
                {smm.smm.toFixed(1)} kg
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm mb-2">
              <div>
                <span className="text-gray-600">Procent masy ciała:</span>
                <span className="ml-2 font-semibold">{smm.percentage.toFixed(1)}%</span>
              </div>
              <div>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(smm.category)}`}>
                  {smm.category}
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Masa mięśni szkieletowych - wskaźnik potencjału siłowego i sprawności fizycznej
            </p>
          </div>
        )}

        {/* TBW - Total Body Water */}
        <div className="border-l-4 border-cyan-500 pl-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900">
              TBW <span className="text-sm font-normal text-gray-600">(Total Body Water)</span>
            </h3>
            <span className="text-2xl font-bold text-cyan-600">
              {tbw.tbw.toFixed(1)} L
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm mb-2">
            <div>
              <span className="text-gray-600">Procent masy ciała:</span>
              <span className="ml-2 font-semibold">{tbw.percentage.toFixed(1)}%</span>
            </div>
            <div>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(tbw.category)}`}>
                {tbw.category}
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Całkowita zawartość wody w organizmie - kluczowa dla prawidłowego funkcjonowania
          </p>
          <div className="mt-3 p-3 bg-cyan-50 rounded-lg border border-cyan-200">
            <p className="text-xs text-cyan-800">
              <strong>Normy TBW:</strong> {gender === 'male' ? 'Mężczyźni: 55-65%' : 'Kobiety: 50-60%'} masy ciała
            </p>
          </div>
        </div>

        {/* Metabolic Age */}
        <div className="border-l-4 border-purple-500 pl-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900">
              Wiek Metaboliczny
            </h3>
            <div className="text-right">
              <span className="text-2xl font-bold text-purple-600">
                {metabolicAge.metabolicAge} lat
              </span>
              {metabolicAge.difference !== 0 && (
                <div className="text-sm font-semibold">
                  {metabolicAge.difference > 0 ? (
                    <span className="text-red-600">+{metabolicAge.difference} lat</span>
                  ) : (
                    <span className="text-green-600">{metabolicAge.difference} lat</span>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="mb-2">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-600">Wiek rzeczywisty:</span>
              <span className="font-semibold">{metabolicAge.actualAge} lat</span>
            </div>
            <div>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getMetabolicAgeColor(metabolicAge.category)}`}>
                {metabolicAge.category}
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-700 mt-2">
            {metabolicAge.description}
          </p>
          <div className="mt-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-xs text-purple-800">
              Wiek metaboliczny pokazuje, jak sprawny jest Twój metabolizm w porównaniu do przeciętnej osoby w Twoim wieku.
            </p>
          </div>
        </div>

        {/* Visceral Fat */}
        {visceralFat && (
          <div className="border-l-4 border-rose-500 pl-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900">
                Tłuszcz Trzewny <span className="text-sm font-normal text-gray-600">(Visceral Fat)</span>
              </h3>
              <span className="text-2xl font-bold text-rose-600">
                {visceralFat.level}
              </span>
            </div>
            <div className="mb-2">
              <div className="flex items-center gap-2 mb-2">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getVisceralFatColor(visceralFat.risk)}`}>
                  {visceralFat.category}
                </span>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getVisceralFatColor(visceralFat.risk)}`}>
                  {visceralFat.risk}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-700 mt-2">
              {visceralFat.description}
            </p>
            <div className="mt-3 p-3 bg-rose-50 rounded-lg border border-rose-200">
              <div className="space-y-1 text-xs text-rose-800">
                <p><strong>Skala:</strong> 1-59</p>
                <p><strong>Prawidłowy:</strong> 1-9 (niskie ryzyko chorób metabolicznych)</p>
                <p><strong>Podwyższony:</strong> 10-14 (średnie ryzyko)</p>
                <p><strong>Wysoki:</strong> 15-24 (wysokie ryzyko)</p>
                <p><strong>Bardzo wysoki:</strong> 25+ (bardzo wysokie ryzyko)</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Info disclaimer */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-xs text-gray-600">
          <strong>Uwaga:</strong> Wszystkie wskaźniki są szacunkowe i służą celom informacyjnym.
          {!visceralFat && ' Dodaj obwód talii, aby zobaczyć poziom tłuszczu trzewnego.'}
          {' '}Dla pełnej oceny zdrowia skonsultuj się z lekarzem lub dietetykiem.
        </p>
      </div>
    </div>
  );
}
