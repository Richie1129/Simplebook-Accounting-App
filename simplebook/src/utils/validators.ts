import { isValid, parseISO } from 'date-fns';
import type { TransactionInput } from '../types/transaction';
import type { CategoryInput } from '../types/category';
import type { BudgetInput } from '../types/budget';

/**
 * Validation error result
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validate transaction input
 */
export function validateTransaction(input: Partial<TransactionInput>): ValidationResult {
  const errors: string[] = [];

  // Validate type
  if (!input.type) {
    errors.push('Transaction type is required');
  } else if (!['income', 'expense'].includes(input.type)) {
    errors.push('Transaction type must be "income" or "expense"');
  }

  // Validate amount
  if (input.amount === undefined || input.amount === null) {
    errors.push('Amount is required');
  } else if (typeof input.amount !== 'number') {
    errors.push('Amount must be a number');
  } else if (input.amount <= 0) {
    errors.push('Amount must be greater than 0');
  } else if (input.amount > 999999999) {
    errors.push('Amount must be less than 1 billion');
  }

  // Validate date
  if (!input.date) {
    errors.push('Date is required');
  } else {
    const parsedDate = parseISO(input.date);
    if (!isValid(parsedDate)) {
      errors.push('Date must be a valid date (YYYY-MM-DD)');
    }
  }

  // Validate categoryId
  if (!input.categoryId) {
    errors.push('Category is required');
  } else if (typeof input.categoryId !== 'number') {
    errors.push('Category ID must be a number');
  }

  // Validate description (optional)
  if (input.description !== undefined) {
    if (typeof input.description !== 'string') {
      errors.push('Description must be a string');
    } else if (input.description.length > 200) {
      errors.push('Description must be 200 characters or less');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate category input
 */
export function validateCategory(input: Partial<CategoryInput>): ValidationResult {
  const errors: string[] = [];

  // Validate name
  if (!input.name) {
    errors.push('Category name is required');
  } else if (typeof input.name !== 'string') {
    errors.push('Category name must be a string');
  } else if (input.name.length === 0) {
    errors.push('Category name cannot be empty');
  } else if (input.name.length > 20) {
    errors.push('Category name must be 20 characters or less');
  }

  // Validate type
  if (!input.type) {
    errors.push('Category type is required');
  } else if (!['income', 'expense'].includes(input.type)) {
    errors.push('Category type must be "income" or "expense"');
  }

  // Validate icon
  if (!input.icon) {
    errors.push('Category icon is required');
  } else if (typeof input.icon !== 'string') {
    errors.push('Category icon must be a string');
  }

  // Validate color (basic hex color check)
  if (!input.color) {
    errors.push('Category color is required');
  } else if (!/^#[0-9A-F]{6}$/i.test(input.color)) {
    errors.push('Category color must be a valid hex color (e.g., #22c55e)');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate budget input
 */
export function validateBudget(input: Partial<BudgetInput>): ValidationResult {
  const errors: string[] = [];

  // Validate monthYear format (YYYY-MM)
  if (!input.monthYear) {
    errors.push('Month is required');
  } else if (!/^\d{4}-\d{2}$/.test(input.monthYear)) {
    errors.push('Month must be in YYYY-MM format (e.g., 2025-10)');
  }

  // Validate limit
  if (input.limit === undefined || input.limit === null) {
    errors.push('Budget limit is required');
  } else if (typeof input.limit !== 'number') {
    errors.push('Budget limit must be a number');
  } else if (input.limit <= 0) {
    errors.push('Budget limit must be greater than 0');
  } else if (input.limit > 999999999) {
    errors.push('Budget limit must be less than 1 billion');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
