import Dexie, { type Table } from 'dexie';
import type { Transaction } from '../types/transaction';
import type { Category } from '../types/category';
import type { Budget } from '../types/budget';
import type { Setting } from '../types/settings';

/**
 * SimpleBook Database
 * Manages local storage using IndexedDB via Dexie
 */
class SimpleBookDB extends Dexie {
  transactions!: Table<Transaction, number>;
  categories!: Table<Category, number>;
  budgets!: Table<Budget, number>;
  settings!: Table<Setting, string>;

  constructor() {
    super('simplebook_db');

    this.version(1).stores({
      transactions: '++id, date, type, categoryId, [date+type], [categoryId+date]',
      categories: '++id, [name+type], isDefault',
      budgets: '++id, &monthYear',
      settings: 'key'
    });
  }
}

// Export singleton instance
export const db = new SimpleBookDB();
