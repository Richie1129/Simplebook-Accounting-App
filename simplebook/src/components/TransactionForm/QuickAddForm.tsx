import React, { useState } from 'react';
import type { QuickAddInput } from '../../types/transaction';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

interface QuickAddFormProps {
  onSubmit: (input: QuickAddInput) => void;
}

export const QuickAddForm: React.FC<QuickAddFormProps> = ({ onSubmit }) => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const amountNum = parseFloat(amount);
    if (!amount || amountNum <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    const input: QuickAddInput = {
      amount: amountNum,
    };

    onSubmit(input);
    setAmount('');
    setError('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="number"
        value={amount}
        onChange={(e) => {
          setAmount(e.target.value);
          setError('');
        }}
        error={error}
        placeholder="Quick add expense..."
        min="0"
        step="1"
        className="flex-1"
      />
      <Button type="submit" variant="primary">
        Add
      </Button>
    </form>
  );
};
