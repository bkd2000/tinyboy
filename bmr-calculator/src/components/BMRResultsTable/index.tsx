import { useState } from 'react';
import type { BMRResults } from '../../types';
import { Calculator, TrendingUp, TrendingDown, ArrowUpDown } from 'lucide-react';

interface BMRResultsTableProps {
  results: BMRResults;
}

type SortDirection = 'asc' | 'desc' | null;

export function BMRResultsTable({ results }: BMRResultsTableProps) {
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const sortedResults = [...results.results].sort((a, b) => {
    if (sortDirection === null) return 0;

    const aValue = a.value ?? -Infinity;
    const bValue = b.value ?? -Infinity;

    if (sortDirection === 'asc') {
      return aValue - bValue;
    } else {
      return bValue - aValue;
    }
  });

  const toggleSort = () => {
    setSortDirection(current => {
      if (current === null) return 'asc';
      if (current === 'asc') return 'desc';
      return null;
    });
  };

  const getDeviation = (value: number | null): { kcal: number; percent: number } | null => {
    if (value === null || results.average === 0) return null;
    const kcal = value - results.average;
    const percent = (kcal / results.average) * 100;
    return { kcal, percent };
  };

  const isMinValue = (value: number | null) => value !== null && value === results.min;
  const isMaxValue = (value: number | null) => value !== null && value === results.max;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold text-gray-900">Wyniki BMR</h2>
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

      {/* Average Display */}
      <div className="bg-primary-50 border-2 border-primary-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-primary-900">Średni BMR</p>
            <p className="text-xs text-primary-700 mt-0.5">
              Średnia z {results.results.filter(r => r.value !== null).length} dostępnych modeli
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-primary">
              {Math.round(results.average)}
            </p>
            <p className="text-sm text-primary-700">kcal/dzień</p>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Model
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                BMR
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                Odchylenie
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedResults.map((result, index) => {
              const deviation = getDeviation(result.value);
              const isMin = isMinValue(result.value);
              const isMax = isMaxValue(result.value);

              return (
                <tr
                  key={result.model}
                  className={`
                    ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    ${isMin ? 'bg-blue-50' : ''}
                    ${isMax ? 'bg-orange-50' : ''}
                  `}
                >
                  {/* Model Name */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {result.model}
                        </p>
                        <p className="text-xs text-gray-500">
                          {result.year}
                          {result.requiresBodyFat && result.value === null && (
                            <span className="ml-1 text-warning-600">
                              • wymaga % tkanki tłuszczowej
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* BMR Value */}
                  <td className="px-4 py-3 text-right">
                    {result.value !== null ? (
                      <div>
                        <p className={`text-sm font-medium ${
                          isMin ? 'text-blue-700' :
                          isMax ? 'text-orange-700' :
                          'text-gray-900'
                        }`}>
                          {Math.round(result.value)} kcal/dzień
                        </p>
                        {isMin && (
                          <p className="text-xs text-blue-600 flex items-center justify-end gap-1">
                            <TrendingDown className="w-3 h-3" />
                            Najniższy
                          </p>
                        )}
                        {isMax && (
                          <p className="text-xs text-orange-600 flex items-center justify-end gap-1">
                            <TrendingUp className="w-3 h-3" />
                            Najwyższy
                          </p>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">Brak danych</span>
                    )}
                  </td>

                  {/* Deviation */}
                  <td className="px-4 py-3 text-right">
                    {deviation ? (
                      <div className="text-xs">
                        <p className={`font-medium ${
                          deviation.kcal > 0 ? 'text-orange-600' :
                          deviation.kcal < 0 ? 'text-blue-600' :
                          'text-gray-500'
                        }`}>
                          {deviation.kcal > 0 ? '+' : ''}
                          {Math.round(deviation.kcal)} kcal
                        </p>
                        <p className="text-gray-500">
                          {deviation.percent > 0 ? '+' : ''}
                          {deviation.percent.toFixed(1)}%
                        </p>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
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
            <span>Najniższy: {Math.round(results.min)} kcal</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-orange-100 border border-orange-300 rounded"></div>
            <span>Najwyższy: {Math.round(results.max)} kcal</span>
          </div>
        </div>
        <span>
          Rozstęp: {Math.round(results.max - results.min)} kcal
        </span>
      </div>

      {/* Info about models requiring body fat */}
      {results.results.some(r => r.requiresBodyFat && r.value === null) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs text-yellow-800">
          <p className="font-medium mb-1">Niedostępne modele:</p>
          <p>
            Modele <strong>Katch-McArdle</strong> i <strong>Cunningham</strong> wymagają estymacji % tkanki tłuszczowej.
            Uzupełnij dane w sekcji "Estymacja tkanki tłuszczowej" aby je obliczyć.
          </p>
        </div>
      )}
    </div>
  );
}
