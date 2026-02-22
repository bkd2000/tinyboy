/**
 * Macro Calculator Component
 * Professional tool for calculating macronutrient distribution
 */

import { useState } from 'react';
import { calculateMacros, getStrategyLabel, getGoalLabel } from '../../utils/macros';
import type { NutritionGoal, MacroStrategy } from '../../types';
import { Utensils } from 'lucide-react';

interface MacroCalculatorProps {
  tdee: number;
  bodyWeight: number;
  bodyFatPercentage?: number;
}

export function MacroCalculator({ tdee, bodyWeight, bodyFatPercentage }: MacroCalculatorProps) {
  const [goal, setGoal] = useState<NutritionGoal>('cutting');
  const [strategy, setStrategy] = useState<MacroStrategy>('healthy-cutting');
  const [meals, setMeals] = useState(3);

  const macros = calculateMacros(tdee, bodyWeight, bodyFatPercentage, goal, strategy, meals);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Utensils className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold text-gray-900">Makroskładniki</h2>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Goal selector */}
        <div>
          <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-1">
            Cel
          </label>
          <select
            id="goal"
            value={goal}
            onChange={(e) => setGoal(e.target.value as NutritionGoal)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="cutting">Redukcja</option>
            <option value="maintenance">Utrzymanie</option>
            <option value="bulking">Masa</option>
            <option value="recomp">Rekomponizycja</option>
          </select>
        </div>

        {/* Strategy selector */}
        <div>
          <label htmlFor="strategy" className="block text-sm font-medium text-gray-700 mb-1">
            Strategia
          </label>
          <select
            id="strategy"
            value={strategy}
            onChange={(e) => setStrategy(e.target.value as MacroStrategy)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="balanced">Zrównoważona (30/40/30)</option>
            <option value="high-protein">Wysokobiałkowa (40/30/30)</option>
            <option value="healthy-cutting">Zdrowe odchudzanie (2.2g/kg LBM)</option>
            <option value="keto">Ketogeniczna (25/5/70)</option>
            <option value="low-carb">Niskowęglowodanowa (35/25/40)</option>
            <option value="low-fat">Niskotłuszczowa (30/55/15)</option>
          </select>
        </div>

        {/* Meals per day */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Posiłków/dzień
          </label>
          <div className="flex gap-2">
            {[3, 4, 5, 6].map((n) => (
              <button
                key={n}
                onClick={() => setMeals(n)}
                className={`
                  flex-1 py-2 rounded-lg border-2 font-medium transition-all
                  ${meals === n
                    ? 'bg-blue-700 border-blue-700 text-white'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                  }
                `}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {/* Protein */}
        <MacroBar
          label="Białko"
          color="bg-blue-500"
          {...macros.protein}
        />

        {/* Carbs */}
        <MacroBar
          label="Węglowodany"
          color="bg-green-500"
          {...macros.carbs}
        />

        {/* Fats */}
        <MacroBar
          label="Tłuszcze"
          color="bg-yellow-500"
          {...macros.fats}
        />
      </div>

      {/* Summary info */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Cel</p>
            <p className="font-semibold text-gray-900">{getGoalLabel(goal)}</p>
          </div>
          <div>
            <p className="text-gray-600">Strategia</p>
            <p className="font-semibold text-gray-900">{getStrategyLabel(strategy)}</p>
          </div>
          <div>
            <p className="text-gray-600">TDEE</p>
            <p className="font-semibold text-gray-900">{tdee} kcal</p>
          </div>
          <div>
            <p className="text-gray-600">Posiłków</p>
            <p className="font-semibold text-gray-900">{meals}/dzień</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * MacroBar component - displays single macronutrient with bar
 */
interface MacroBarProps {
  label: string;
  color: string;
  grams: number;
  calories: number;
  percentage: number;
  perMeal: number;
}

function MacroBar({ label, color, grams, calories, percentage, perMeal }: MacroBarProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium text-gray-900">{label}</span>
        <div className="flex items-baseline gap-2 text-sm">
          <span className="font-semibold text-gray-900">{grams}g</span>
          <span className="text-gray-600">({calories} kcal)</span>
          <span className="text-gray-500">• {percentage}%</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden">
        <div
          className={`${color} h-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-xs text-gray-600 mt-1">Na posiłek: ~{perMeal}g</p>
    </div>
  );
}
