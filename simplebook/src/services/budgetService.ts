import { db } from './db';
import type { Budget, BudgetInput, BudgetUpdateInput, BudgetStatus } from '../types/budget';
import { validateBudget } from '../utils/validators';
import { getCurrentMonthYear } from '../utils/dateHelpers';
import { getTransactionsByDateRange } from './transactionService';


/**
 * Get budget for specific month
 */
export async function getBudgetByMonth(monthYear: string): Promise<Budget | undefined> {
  return await db.budgets.where('monthYear').equals(monthYear).first();
}

/**
 * Get budget for current month
 */
export async function getCurrentMonthBudget(): Promise<Budget | undefined> {
  const currentMonth = getCurrentMonthYear();
  return await getBudgetByMonth(currentMonth);
}

/**
 * Get all budgets
 */
export async function getAllBudgets(): Promise<Budget[]> {
  return await db.budgets.orderBy('monthYear').reverse().toArray();
}

/**
 * Create or update budget for month
 */
export async function setBudget(input: BudgetInput): Promise<Budget> {
  // Validate input
  const validation = validateBudget(input);
  if (!validation.valid) {
    throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
  }

  // Check if budget already exists
  const existing = await getBudgetByMonth(input.monthYear);

  if (existing) {
    // Update existing budget
    const now = new Date().toISOString();
    await db.budgets.update(existing.id!, {
      limit: input.limit,
      updatedAt: now,
    });
    return { ...existing, limit: input.limit, updatedAt: now };
  } else {
    // Create new budget
    const now = new Date().toISOString();
    const budget: Omit<Budget, 'id'> = {
      monthYear: input.monthYear,
      limit: input.limit,
      createdAt: now,
      updatedAt: now,
    };

    const id = await db.budgets.add(budget);
    return { ...budget, id };
  }
}

/**
 * Update budget limit
 */
export async function updateBudget(input: BudgetUpdateInput): Promise<Budget> {
  const existing = await db.budgets.get(input.id);
  if (!existing) {
    throw new Error('Budget not found');
  }

  const validation = validateBudget({ monthYear: existing.monthYear, limit: input.limit });
  if (!validation.valid) {
    throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
  }

  const now = new Date().toISOString();
  await db.budgets.update(input.id, {
    limit: input.limit,
    updatedAt: now,
  });

  return { ...existing, limit: input.limit, updatedAt: now };
}

/**
 * Delete budget
 */
export async function deleteBudget(id: number): Promise<void> {
  await db.budgets.delete(id);
}

/**
 * Calculate budget status for month
 */
export async function calculateBudgetStatus(monthYear: string): Promise<BudgetStatus | null> {
  const budget = await getBudgetByMonth(monthYear);
  if (!budget) return null;

  // Get month's expense transactions
  const [year, month] = monthYear.split('-');
  const startDate = `${year}-${month}-01`;
  const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
  const endDate = `${year}-${month}-${lastDay.toString().padStart(2, '0')}`;

  const transactions = await getTransactionsByDateRange(startDate, endDate);
  const expenses = transactions.filter((t) => t.type === 'expense');
  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);

  // Calculate usage percentage
  const usagePercentage = (totalExpenses / budget.limit) * 100;
  const remaining = budget.limit - totalExpenses;

  // Determine warning level
  let level: 'none' | 'warning' | 'alert';
  let message: string | undefined;

  if (usagePercentage >= 100) {
    level = 'alert';
    message = `Budget exceeded by NT$ ${Math.abs(remaining).toLocaleString()}`;
  } else if (usagePercentage >= 80) {
    level = 'warning';
    message = `${usagePercentage.toFixed(0)}% of budget used`;
  } else {
    level = 'none';
  }

  return {
    budget,
    totalExpenses,
    usagePercentage,
    remaining,
    level,
    message,
  };
}

/**
 * Get budget status for current month
 */
export async function getCurrentBudgetStatus(): Promise<BudgetStatus | null> {
  const currentMonth = getCurrentMonthYear();
  return await calculateBudgetStatus(currentMonth);
}
