import React from 'react';
import type { CategoryType } from '../../types/category';
import { useCategoryStore } from '../../store/categoryStore';

interface CategorySelectorProps {
  value: number | undefined;
  onChange: (categoryId: number) => void;
  type: CategoryType;
  label?: string;
  error?: string;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  value,
  onChange,
  type,
  label = 'Category',
  error,
}) => {
  const categories = useCategoryStore((state) => state.categories);
  const filteredCategories = categories.filter((cat) => cat.type === type);

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <select
        value={value || ''}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`
          w-full px-3 py-2
          border rounded-lg
          bg-white dark:bg-gray-800
          text-gray-900 dark:text-gray-100
          focus:outline-none focus:ring-2 focus:ring-blue-500
          ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
        `}
        aria-invalid={error ? 'true' : 'false'}
      >
        <option value="">Select a category</option>
        {filteredCategories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};
