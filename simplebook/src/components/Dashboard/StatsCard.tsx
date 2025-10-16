import React from 'react';
import { formatCurrency } from '../../utils/formatters';

interface StatsCardProps {
  title: string;
  amount: number;
  type: 'income' | 'expense' | 'balance';
  icon?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, amount, type, icon = '💰' }) => {
  const getColorClasses = () => {
    switch (type) {
      case 'income':
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
      case 'expense':
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
      case 'balance':
        return amount >= 0
          ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
          : 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</h3>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className={`text-3xl font-bold ${getColorClasses()}`}>
        {type === 'balance' && amount > 0 && '+'}
        {formatCurrency(amount)}
      </div>
    </div>
  );
};
