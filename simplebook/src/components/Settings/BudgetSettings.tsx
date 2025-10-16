import React, { useState, useEffect } from 'react';
import type { Budget } from '../../types/budget';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { getCurrentMonthBudget, setBudget } from '../../services/budgetService';
import { getCurrentMonthYear } from '../../utils/dateHelpers';
import { formatCurrency } from '../../utils/formatters';

interface BudgetSettingsProps {
  onSave?: () => void;
}

export const BudgetSettings: React.FC<BudgetSettingsProps> = ({ onSave }) => {
  const [currentBudget, setCurrentBudget] = useState<Budget | null>(null);
  const [limit, setLimit] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCurrentBudget();
  }, []);

  const loadCurrentBudget = async () => {
    try {
      const budget = await getCurrentMonthBudget();
      setCurrentBudget(budget || null);
      setLimit(budget?.limit.toString() || '');
    } catch (err) {
      console.error('Failed to load budget:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const limitNum = parseFloat(limit);
    if (!limit || limitNum <= 0) {
      setError('Please enter a valid budget amount');
      return;
    }

    setSaving(true);
    setError('');

    try {
      await setBudget({
        monthYear: getCurrentMonthYear(),
        limit: limitNum,
      });

      await loadCurrentBudget();
      onSave?.();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-gray-500">Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Monthly Budget
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Set a spending limit for the current month. You'll receive alerts when approaching the limit.
        </p>
      </div>

      {currentBudget && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            Current budget: <span className="font-semibold">{formatCurrency(currentBudget.limit)}</span>
          </p>
        </div>
      )}

      <Input
        type="number"
        label="Budget Limit (NT$)"
        value={limit}
        onChange={(e) => {
          setLimit(e.target.value);
          setError('');
        }}
        error={error}
        placeholder="30000"
        min="0"
        step="100"
      />

      <div className="flex gap-3">
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : currentBudget ? 'Update Budget' : 'Set Budget'}
        </Button>
      </div>
    </div>
  );
};
