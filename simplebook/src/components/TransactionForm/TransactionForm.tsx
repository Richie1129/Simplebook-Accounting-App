import React, { useState } from 'react';
import type { Transaction, TransactionInput, TransactionType } from '../../types/transaction';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { CategorySelector } from './CategorySelector';
import { DatePicker } from './DatePicker';
import { toISODate } from '../../utils/dateHelpers';

interface TransactionFormProps {
  transaction?: Transaction;
  onSubmit: (input: TransactionInput) => void;
  onCancel: () => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  transaction,
  onSubmit,
  onCancel,
}) => {
  const [type, setType] = useState<TransactionType>(transaction?.type || 'expense');
  const [amount, setAmount] = useState(transaction?.amount.toString() || '');
  const [date, setDate] = useState(transaction?.date || toISODate(new Date()));
  const [categoryId, setCategoryId] = useState<number | undefined>(transaction?.categoryId);
  const [description, setDescription] = useState(transaction?.description || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!date) {
      newErrors.date = 'Date is required';
    }

    if (!categoryId) {
      newErrors.categoryId = 'Category is required';
    }

    if (description && description.length > 200) {
      newErrors.description = 'Description must be 200 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const input: TransactionInput = {
      type,
      amount: parseFloat(amount),
      date,
      categoryId: categoryId!,
      description: description || undefined,
    };

    onSubmit(input);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
              onChange={(e) => {
                setType(e.target.value as TransactionType);
                setCategoryId(undefined); // Reset category when type changes
              }}
              className="mr-2"
            />
            <span className="text-green-600 dark:text-green-400">Income</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="expense"
              checked={type === 'expense'}
              onChange={(e) => {
                setType(e.target.value as TransactionType);
                setCategoryId(undefined); // Reset category when type changes
              }}
              className="mr-2"
            />
            <span className="text-red-600 dark:text-red-400">Expense</span>
          </label>
        </div>
      </div>

      {/* Amount */}
      <Input
        type="number"
        label="Amount (NT$)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        error={errors.amount}
        placeholder="0"
        min="0"
        step="1"
      />

      {/* Date */}
      <DatePicker
        value={date}
        onChange={setDate}
        label="Date"
        error={errors.date}
      />

      {/* Category */}
      <CategorySelector
        value={categoryId}
        onChange={setCategoryId}
        type={type}
        label="Category"
        error={errors.categoryId}
      />

      {/* Description */}
      <Input
        type="text"
        label="Description (Optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        error={errors.description}
        placeholder="Add a note..."
        maxLength={200}
      />

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button type="submit" variant="primary" className="flex-1">
          {transaction ? 'Update' : 'Add'} Transaction
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
