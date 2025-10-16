import React from 'react';
import type { Transaction } from '../../types/transaction';
import type { Category } from '../../types/category';
import { formatCurrency } from '../../utils/formatters';
import { formatDate } from '../../utils/dateHelpers';
import { IconButton } from '../common/IconButton';

interface TransactionItemProps {
  transaction: Transaction;
  category?: Category;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: number) => void;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  category,
  onEdit,
  onDelete,
}) => {
  const isIncome = transaction.type === 'income';
  const amountColor = isIncome
    ? 'text-green-600 dark:text-green-400'
    : 'text-red-600 dark:text-red-400';

  return (
    <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
      {/* Category Color Indicator */}
      <div
        className="w-1 h-12 rounded"
        style={{ backgroundColor: category?.color || '#gray' }}
      />

      {/* Transaction Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="font-medium text-gray-900 dark:text-white">
            {category?.name || 'Unknown'}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {formatDate(transaction.date, 'MMM d, yyyy')}
          </span>
        </div>
        {transaction.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
            {transaction.description}
          </p>
        )}
      </div>

      {/* Amount */}
      <div className={`font-semibold text-lg ${amountColor}`}>
        {isIncome ? '+' : '-'}
        {formatCurrency(transaction.amount)}
      </div>

      {/* Actions */}
      <div className="flex gap-1">
        <IconButton
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          }
          ariaLabel="Edit transaction"
          onClick={() => onEdit(transaction)}
        />
        <IconButton
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          }
          ariaLabel="Delete transaction"
          variant="danger"
          onClick={() => onDelete(transaction.id!)}
        />
      </div>
    </div>
  );
};
