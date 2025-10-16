import type { Transaction } from '../types/transaction';

/**
 * Calculate total amount for an array of transactions
 */
export function calculateTotal(transactions: Transaction[]): number {
  return transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return (value / total) * 100;
}

/**
 * Round number to specified decimal places
 */
export function roundToDecimals(value: number, decimals: number = 2): number {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

/**
 * Calculate sum by type
 */
export function calculateByType(
  transactions: Transaction[],
  type: 'income' | 'expense'
): number {
  return transactions
    .filter(t => t.type === type)
    .reduce((sum, t) => sum + t.amount, 0);
}

/**
 * Calculate balance (income - expense)
 */
export function calculateBalance(transactions: Transaction[]): number {
  const income = calculateByType(transactions, 'income');
  const expense = calculateByType(transactions, 'expense');
  return income - expense;
}
