import { db } from './db';
import type { Category, CategoryInput, CategoryType } from '../types/category';

/**
 * Default income categories
 */
const DEFAULT_INCOME_CATEGORIES: Omit<Category, 'id'>[] = [
  { name: '薪水', type: 'income', icon: 'salary', color: '#16a34a', isDefault: true, createdAt: new Date().toISOString() },
  { name: '獎金', type: 'income', icon: 'bonus', color: '#15803d', isDefault: true, createdAt: new Date().toISOString() },
  { name: '投資收益', type: 'income', icon: 'investment', color: '#166534', isDefault: true, createdAt: new Date().toISOString() },
  { name: '其他收入', type: 'income', icon: 'other', color: '#14532d', isDefault: true, createdAt: new Date().toISOString() },
];

/**
 * Default expense categories
 */
const DEFAULT_EXPENSE_CATEGORIES: Omit<Category, 'id'>[] = [
  { name: '飲食', type: 'expense', icon: 'food', color: '#dc2626', isDefault: true, createdAt: new Date().toISOString() },
  { name: '交通', type: 'expense', icon: 'transport', color: '#b91c1c', isDefault: true, createdAt: new Date().toISOString() },
  { name: '購物', type: 'expense', icon: 'shopping', color: '#991b1b', isDefault: true, createdAt: new Date().toISOString() },
  { name: '娛樂', type: 'expense', icon: 'entertainment', color: '#7f1d1d', isDefault: true, createdAt: new Date().toISOString() },
  { name: '醫療', type: 'expense', icon: 'medical', color: '#ef4444', isDefault: true, createdAt: new Date().toISOString() },
  { name: '教育', type: 'expense', icon: 'education', color: '#f87171', isDefault: true, createdAt: new Date().toISOString() },
  { name: '居住', type: 'expense', icon: 'housing', color: '#fca5a5', isDefault: true, createdAt: new Date().toISOString() },
  { name: '其他支出', type: 'expense', icon: 'other', color: '#fecaca', isDefault: true, createdAt: new Date().toISOString() },
];

/**
 * Initialize default categories on first launch
 */
export async function initializeDefaultCategories(): Promise<void> {
  const existingCount = await db.categories.count();

  if (existingCount === 0) {
    await db.categories.bulkAdd([
      ...DEFAULT_INCOME_CATEGORIES,
      ...DEFAULT_EXPENSE_CATEGORIES
    ]);
    console.log('✅ Default categories initialized');
  }
}

/**
 * Get all categories
 */
export async function getAllCategories(): Promise<Category[]> {
  return await db.categories.toArray();
}

/**
 * Get categories by type
 */
export async function getCategoriesByType(type: CategoryType): Promise<Category[]> {
  return await db.categories.where('type').equals(type).toArray();
}

/**
 * Get category by ID
 */
export async function getCategoryById(id: number): Promise<Category | undefined> {
  return await db.categories.get(id);
}

/**
 * Create new custom category
 */
export async function createCategory(input: CategoryInput): Promise<Category> {
  const category: Omit<Category, 'id'> = {
    ...input,
    isDefault: false,
    createdAt: new Date().toISOString()
  };

  const id = await db.categories.add(category);
  return { ...category, id };
}

/**
 * Update custom category
 */
export async function updateCategory(id: number, input: Partial<CategoryInput>): Promise<Category> {
  await db.categories.update(id, input);
  const updated = await db.categories.get(id);
  if (!updated) throw new Error('Category not found');
  return updated;
}

/**
 * Delete custom category
 */
export async function deleteCategory(id: number): Promise<void> {
  const category = await db.categories.get(id);
  if (!category) throw new Error('Category not found');
  if (category.isDefault) throw new Error('Cannot delete default category');

  // TODO: Reassign transactions to uncategorized
  await db.categories.delete(id);
}
