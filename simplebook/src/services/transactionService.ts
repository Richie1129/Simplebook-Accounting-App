import { db } from './db';
import type {
  Transaction,
  TransactionInput,
  TransactionUpdateInput,
  QuickAddInput,
  TransactionFilters
} from '../types/transaction';
import { validateTransaction } from '../utils/validators';
import { getCurrentMonthStart, getCurrentMonthEnd, toISODate } from '../utils/dateHelpers';

/**
 * Get all transactions
 */
export async function getAllTransactions(): Promise<Transaction[]> {
  return await db.transactions.orderBy('date').reverse().toArray();
}

/**
 * Get transaction by ID
 */
export async function getTransactionById(id: number): Promise<Transaction | undefined> {
  return await db.transactions.get(id);
}

/**
 * Get transactions for current month
 */
export async function getCurrentMonthTransactions(): Promise<Transaction[]> {
  const start = getCurrentMonthStart();
  const end = getCurrentMonthEnd();

  return await db.transactions
    .where('date')
    .between(start, end, true, true)
    .reverse()
    .toArray();
}

/**
 * Get transactions by date range
 */
export async function getTransactionsByDateRange(
  start: string,
  end: string
): Promise<Transaction[]> {
  return await db.transactions
    .where('date')
    .between(start, end, true, true)
    .reverse()
    .toArray();
}

/**
 * Get transactions by category
 */
export async function getTransactionsByCategory(categoryId: number): Promise<Transaction[]> {
  return await db.transactions
    .where('categoryId')
    .equals(categoryId)
    .reverse()
    .toArray();
}

/**
 * Get filtered transactions
 */
export async function getFilteredTransactions(
  filters: TransactionFilters
): Promise<Transaction[]> {
  let transactions = await db.transactions.toArray();

  // Apply date range filter
  if (filters.dateRange) {
    transactions = transactions.filter(
      (t) => t.date >= filters.dateRange!.start && t.date <= filters.dateRange!.end
    );
  }

  // Apply type filter
  if (filters.type) {
    transactions = transactions.filter((t) => t.type === filters.type);
  }

  // Apply category filter
  if (filters.categoryIds && filters.categoryIds.length > 0) {
    transactions = transactions.filter((t) => filters.categoryIds!.includes(t.categoryId));
  }

  // Apply search filter
  if (filters.searchText) {
    const searchLower = filters.searchText.toLowerCase();
    transactions = transactions.filter(
      (t) => t.description?.toLowerCase().includes(searchLower)
    );
  }

  // Sort by date (newest first)
  return transactions.sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * Create new transaction
 */
export async function createTransaction(input: TransactionInput): Promise<Transaction> {
  // Validate input
  const validation = validateTransaction(input);
  if (!validation.valid) {
    throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
  }

  const now = new Date().toISOString();
  const transaction: Omit<Transaction, 'id'> = {
    ...input,
    createdAt: now,
    updatedAt: now,
  };

  const id = await db.transactions.add(transaction);
  return { ...transaction, id };
}

/**
 * Quick add transaction (minimal input)
 */
export async function quickAddTransaction(input: QuickAddInput): Promise<Transaction> {
  const transactionInput: TransactionInput = {
    type: input.type || 'expense',
    amount: input.amount,
    date: toISODate(new Date()),
    categoryId: input.categoryId || 5, // Default to 飲食 (Food)
    description: undefined,
  };

  return await createTransaction(transactionInput);
}

/**
 * Update existing transaction
 */
export async function updateTransaction(
  input: TransactionUpdateInput
): Promise<Transaction> {
  const { id, ...updates } = input;

  // Validate updates
  if (Object.keys(updates).length > 0) {
    const existing = await db.transactions.get(id);
    if (!existing) {
      throw new Error('Transaction not found');
    }

    const merged = { ...existing, ...updates };
    const validation = validateTransaction(merged);
    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }
  }

  await db.transactions.update(id, {
    ...updates,
    updatedAt: new Date().toISOString(),
  });

  const updated = await db.transactions.get(id);
  if (!updated) throw new Error('Transaction not found after update');
  return updated;
}

/**
 * Delete transaction
 */
export async function deleteTransaction(id: number): Promise<void> {
  const exists = await db.transactions.get(id);
  if (!exists) {
    throw new Error('Transaction not found');
  }

  await db.transactions.delete(id);
}

/**
 * Calculate total for transactions
 */
export function calculateTransactionTotal(transactions: Transaction[]): number {
  return transactions.reduce((sum, t) => sum + t.amount, 0);
}
