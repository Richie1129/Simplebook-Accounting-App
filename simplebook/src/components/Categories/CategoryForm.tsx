import React, { useState } from 'react';
import type { Category, CategoryInput, CategoryType } from '../../types/category';
import { CategoryColors } from '../../types/category';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

interface CategoryFormProps {
  category?: Category;
  onSubmit: (input: CategoryInput) => void;
  onCancel: () => void;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({ category, onSubmit, onCancel }) => {
  const [name, setName] = useState(category?.name || '');
  const [type, setType] = useState<CategoryType>(category?.type || 'expense');
  const [color, setColor] = useState(category?.color || CategoryColors.red600);
  const [icon] = useState(category?.icon || 'other');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const availableColors = Object.values(CategoryColors);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name || name.trim().length === 0) {
      newErrors.name = 'Category name is required';
    } else if (name.length > 20) {
      newErrors.name = 'Name must be 20 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const input: CategoryInput = {
      name: name.trim(),
      type,
      icon,
      color,
    };

    onSubmit(input);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <Input
        label="Category Name"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          setErrors({});
        }}
        error={errors.name}
        placeholder="e.g., Coffee, Salary"
        maxLength={20}
      />

      {/* Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Type
        </label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="income"
              checked={type === 'income'}
              onChange={(e) => setType(e.target.value as CategoryType)}
              className="mr-2"
            />
            <span className="text-green-600 dark:text-green-400">Income</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="expense"
              checked={type === 'expense'}
              onChange={(e) => setType(e.target.value as CategoryType)}
              className="mr-2"
            />
            <span className="text-red-600 dark:text-red-400">Expense</span>
          </label>
        </div>
      </div>

      {/* Color Picker */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Color
        </label>
        <div className="grid grid-cols-8 gap-2">
          {availableColors.map((colorValue) => (
            <button
              key={colorValue}
              type="button"
              onClick={() => setColor(colorValue)}
              className={`w-8 h-8 rounded-full border-2 transition-transform ${
                color === colorValue
                  ? 'border-blue-500 scale-110'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              style={{ backgroundColor: colorValue }}
              aria-label={`Select color ${colorValue}`}
            />
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button type="submit" variant="primary" className="flex-1">
          {category ? 'Update' : 'Create'} Category
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
