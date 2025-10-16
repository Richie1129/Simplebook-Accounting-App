import React from 'react';
import type { BudgetStatus } from '../../types/budget';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

interface BudgetAlertProps {
  budgetStatus: BudgetStatus;
}

export const BudgetAlert: React.FC<BudgetAlertProps> = ({ budgetStatus }) => {
  const { level, totalExpenses, usagePercentage, message } = budgetStatus;

  if (level === 'none') return null;

  const getAlertStyles = () => {
    switch (level) {
      case 'alert':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200';
      default:
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200';
    }
  };

  const getIcon = () => {
    switch (level) {
      case 'alert':
        return '🚨';
      case 'warning':
        return '⚠️';
      default:
        return 'ℹ️';
    }
  };

  return (
    <div className={`rounded-lg border p-4 ${getAlertStyles()}`}>
      <div className="flex items-start gap-3">
        <span className="text-2xl">{getIcon()}</span>
        <div className="flex-1">
          <h4 className="font-semibold mb-1">Budget Alert</h4>
          <p className="text-sm mb-2">{message}</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="opacity-75">Spent:</span>{' '}
              <span className="font-semibold">{formatCurrency(totalExpenses)}</span>
            </div>
            <div>
              <span className="opacity-75">Usage:</span>{' '}
              <span className="font-semibold">{formatPercentage(usagePercentage)}</span>
            </div>
          </div>
          <div className="mt-2">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  level === 'alert'
                    ? 'bg-red-600 dark:bg-red-500'
                    : 'bg-yellow-600 dark:bg-yellow-500'
                }`}
                style={{ width: `${Math.min(usagePercentage, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
