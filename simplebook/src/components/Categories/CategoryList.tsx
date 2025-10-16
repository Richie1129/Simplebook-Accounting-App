import React from 'react';
import type { Category } from '../../types/category';
import { IconButton } from '../common/IconButton';

interface CategoryListProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: number) => void;
}

export const CategoryList: React.FC<CategoryListProps> = ({ categories, onEdit, onDelete }) => {
  const incomeCategories = categories.filter(c => c.type === 'income');
  const expenseCategories = categories.filter(c => c.type === 'expense');

  const renderCategoryItem = (category: Category) => (
    <div
      key={category.id}
      className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
    >
      <div
        className="w-4 h-4 rounded-full"
        style={{ backgroundColor: category.color }}
      />
      <span className="flex-1 text-gray-900 dark:text-white font-medium">
        {category.name}
      </span>
      {category.isDefault ? (
        <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
          Default
        </span>
      ) : (
        <div className="flex gap-1">
          <IconButton
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            }
            ariaLabel="Edit category"
            onClick={() => onEdit(category)}
          />
          <IconButton
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            }
            ariaLabel="Delete category"
            variant="danger"
            onClick={() => category.id && onDelete(category.id)}
          />
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-3">
          Income Categories ({incomeCategories.length})
        </h3>
        <div className="space-y-2">
          {incomeCategories.map(renderCategoryItem)}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-3">
          Expense Categories ({expenseCategories.length})
        </h3>
        <div className="space-y-2">
          {expenseCategories.map(renderCategoryItem)}
        </div>
      </div>
    </div>
  );
};
