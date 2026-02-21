import { useState } from 'react';
import type { BodyCompositionData, Gender } from '../../types';
import { Activity, ArrowUpDown, TrendingUp, TrendingDown, Info } from 'lucide-react';

interface BodyCompositionSectionProps {
  bodyComposition: BodyCompositionData;
  gender: Gender;
}

type SortDirection = 'asc' | 'desc' | null;

export function BodyCompositionSection({ bodyComposition, gender }: BodyCompositionSectionProps) {
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const { lbm, ffm, difference } = bodyComposition;

  const sortedResults = [...lbm.results].sort((a, b) => {
    if (sortDirection === null) return 0;

    if (sortDirection === 'asc') {
      return a.value - b.value;
    } else {
      return b.value - a.value;
    }
  });

  const toggleSort = () => {
    setSortDirection(current => {
      if (current === null) return 'asc';
      if (current === 'asc') return 'desc';
      return null;
    });
  };

  const getDeviation = (value: number): { kg: number; percent: number } => {
    const kg = value - lbm.average;
    const percent = (kg / lbm.average) * 100;
    return { kg, percent };
  };

  const minLBM = Math.min(...lbm.results.map(r => r.value));
  const maxLBM = Math.max(...lbm.results.map(r => r.value));

  const getFormulaName = (formula: string): string => {
    switch (formula) {
      case 'boer':
        return 'Boer';
      case 'james':
        return 'James';
      case 'hume':
        return 'Hume';
      default:
        return formula;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold text-gray-900">Skład ciała - LBM i FFM</h2>
        </div>
        <button
          onClick={toggleSort}
          className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowUpDown className="w-4 h-4" />
          <span>
            {sortDirection === null && 'Sortuj'}
            {sortDirection === 'asc' && 'Rosnąco'}
            {sortDirection === 'desc' && 'Malejąco'}
          </span>
        </button>
      </div>

      {/* FFM Display (if available) */}
      {ffm ? (
        <div className="bg-primary-50 border-2 border-primary-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-primary-900">FFM (Fat-Free Mass)</p>
              <p className="text-xs text-primary-700 mt-0.5">
                Masa beztłuszczowa - obliczona z % tkanki tłuszczowej
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-primary">
                {ffm.ffm.toFixed(1)}
              </p>
              <p className="text-sm text-primary-700">kg ({ffm.percentage.toFixed(1)}% masy ciała)</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium mb-1">FFM wymaga % tkanki tłuszczowej</p>
              <p>
                Uzupełnij dane w sekcji "Estymacja tkanki tłuszczowej" aby obliczyć FFM (Fat-Free Mass)
                - najdokładniejszy wskaźnik masy beztłuszczowej oparty na rzeczywistym pomiarze % tłuszczu.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* LBM Average Display */}
      <div className="bg-success-50 border-2 border-success-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-success-900">Średnia LBM (Lean Body Mass)</p>
            <p className="text-xs text-success-700 mt-0.5">
              Średnia z {lbm.results.length} formuł estymacji
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-success">
              {lbm.average.toFixed(1)}
            </p>
            <p className="text-sm text-success-700">kg ({lbm.averagePercentage.toFixed(1)}% masy ciała)</p>
          </div>
        </div>
      </div>

      {/* Difference FFM vs LBM (if FFM available) */}
      {ffm && difference !== undefined && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-900">Różnica FFM vs LBM</p>
              <p className="text-xs text-purple-700 mt-0.5">
                FFM jest zazwyczaj bardziej precyzyjne (oparte na % tkanki tłuszczowej)
              </p>
            </div>
            <div className="text-right">
              <p className={`text-2xl font-bold ${difference > 0 ? 'text-purple-700' : 'text-purple-600'}`}>
                {difference > 0 ? '+' : ''}{difference.toFixed(1)} kg
              </p>
              <p className="text-xs text-purple-600">
                {((difference / lbm.average) * 100).toFixed(1)}% różnicy
              </p>
            </div>
          </div>
        </div>
      )}

      {/* LBM Results Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Formuła
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                LBM
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                Odchylenie
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedResults.map((result, index) => {
              const deviation = getDeviation(result.value);
              const isMin = result.value === minLBM;
              const isMax = result.value === maxLBM;

              return (
                <tr
                  key={result.formula}
                  className={`
                    ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    ${isMin ? 'bg-blue-50' : ''}
                    ${isMax ? 'bg-orange-50' : ''}
                  `}
                >
                  {/* Formula Name */}
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {getFormulaName(result.formula)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {result.year}
                      </p>
                    </div>
                  </td>

                  {/* LBM Value */}
                  <td className="px-4 py-3 text-right">
                    <div>
                      <p className={`text-sm font-medium ${
                        isMin ? 'text-blue-700' :
                        isMax ? 'text-orange-700' :
                        'text-gray-900'
                      }`}>
                        {result.value.toFixed(1)} kg
                      </p>
                      <p className="text-xs text-gray-500">
                        {result.percentage.toFixed(1)}% masy ciała
                      </p>
                      {isMin && (
                        <p className="text-xs text-blue-600 flex items-center justify-end gap-1 mt-1">
                          <TrendingDown className="w-3 h-3" />
                          Najniższy
                        </p>
                      )}
                      {isMax && (
                        <p className="text-xs text-orange-600 flex items-center justify-end gap-1 mt-1">
                          <TrendingUp className="w-3 h-3" />
                          Najwyższy
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Deviation */}
                  <td className="px-4 py-3 text-right">
                    <div className="text-xs">
                      <p className={`font-medium ${
                        deviation.kg > 0 ? 'text-orange-600' :
                        deviation.kg < 0 ? 'text-blue-600' :
                        'text-gray-500'
                      }`}>
                        {deviation.kg > 0 ? '+' : ''}
                        {deviation.kg.toFixed(1)} kg
                      </p>
                      <p className="text-gray-500">
                        {deviation.percent > 0 ? '+' : ''}
                        {deviation.percent.toFixed(1)}%
                      </p>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Range Info */}
      <div className="flex items-center justify-between text-xs text-gray-600 pt-2 border-t border-gray-200">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded"></div>
            <span>Najniższy: {minLBM.toFixed(1)} kg</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-orange-100 border border-orange-300 rounded"></div>
            <span>Najwyższy: {maxLBM.toFixed(1)} kg</span>
          </div>
        </div>
        <span>
          Rozstęp: {(maxLBM - minLBM).toFixed(1)} kg
        </span>
      </div>

      {/* FFM Breakdown (if available) */}
      {ffm && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <p className="text-sm font-medium text-indigo-900 mb-3">
            Skład masy beztłuszczowej (FFM)
          </p>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-indigo-700">Woda (~73%)</span>
              <span className="font-semibold text-indigo-900">{ffm.breakdown.water.toFixed(1)} kg</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-indigo-700">Białko (~20%)</span>
              <span className="font-semibold text-indigo-900">{ffm.breakdown.protein.toFixed(1)} kg</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-indigo-700">Minerały (~7%)</span>
              <span className="font-semibold text-indigo-900">{ffm.breakdown.minerals.toFixed(1)} kg</span>
            </div>
          </div>
          <p className="text-xs text-indigo-600 mt-3">
            Podział przybliżony według standardowych proporcji składu ciała
          </p>
        </div>
      )}

      {/* LBM Formulas Explanation */}
      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-xs font-medium text-gray-700 mb-2">Formuły LBM:</p>
        <div className="space-y-2 text-xs text-gray-600">
          <div>
            <p className="font-medium text-gray-700">Boer (1984)</p>
            <p className="text-[10px] font-mono text-gray-500 mt-0.5">
              {gender === 'male'
                ? 'LBM = 0.407 × waga + 0.267 × wzrost - 19.2'
                : 'LBM = 0.252 × waga + 0.473 × wzrost - 48.3'}
            </p>
          </div>
          <div>
            <p className="font-medium text-gray-700">James (1976)</p>
            <p className="text-[10px] font-mono text-gray-500 mt-0.5">
              {gender === 'male'
                ? 'LBM = 1.10 × waga - 128 × (waga/wzrost)²'
                : 'LBM = 1.07 × waga - 148 × (waga/wzrost)²'}
            </p>
          </div>
          <div>
            <p className="font-medium text-gray-700">Hume (1966)</p>
            <p className="text-[10px] font-mono text-gray-500 mt-0.5">
              {gender === 'male'
                ? 'LBM = 0.328 × waga + 0.339 × wzrost - 29.5'
                : 'LBM = 0.296 × waga + 0.418 × wzrost - 43.3'}
            </p>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800">
        <p>
          <strong>Uwaga:</strong> LBM (Lean Body Mass) to estymacja masy beztłuszczowej oparta tylko na
          wadze i wzroście. FFM (Fat-Free Mass) obliczane z % tkanki tłuszczowej jest dokładniejsze.
          LBM może nie uwzględniać wszystkich składników masy beztłuszczowej (np. glikogen, woda).
        </p>
      </div>
    </div>
  );
}
