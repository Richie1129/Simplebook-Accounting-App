# Data Model: SimpleBook

**Feature**: SimpleBook Personal Accounting Web App
**Date**: 2025-10-16
**Storage**: IndexedDB via Dexie.js

## Overview

SimpleBook uses IndexedDB for local browser storage with four main tables: `transactions`, `categories`, `budgets`, and `settings`. All data is stored locally with no server synchronization.

## Entity Relationship Diagram

```
┌─────────────┐         ┌────────────┐
│ Transaction │ N     1 │  Category  │
│             ├─────────┤            │
│ categoryId  │         │ id         │
└─────────────┘         └────────────┘

┌────────────┐
│   Budget   │
│            │ (one per month)
│ monthYear  │
└────────────┘

┌────────────┐
│  Settings  │
│            │ (key-value store)
│ key, value │
└────────────┘
```

## Entities

### 1. Transaction

**Purpose**: Represents a single financial record (income or expense)

**TypeScript Interface**:
```typescript
interface Transaction {
  id?: number;                    // Auto-incremented primary key
  type: 'income' | 'expense';     // Transaction type
  amount: number;                 // Positive number (e.g., 120.50)
  date: string;                   // ISO 8601 date string (YYYY-MM-DD)
  categoryId: number;             // Foreign key to Category
  description?: string;           // Optional user note
  createdAt: string;              // ISO 8601 timestamp (creation time)
  updatedAt: string;              // ISO 8601 timestamp (last modification)
}
```

**Fields**:

| Field       | Type   | Nullable | Validation                           | Description                              |
|-------------|--------|----------|--------------------------------------|------------------------------------------|
| id          | number | Yes      | Auto-increment                       | Unique identifier (IndexedDB auto)       |
| type        | string | No       | Must be 'income' or 'expense'        | Transaction type                         |
| amount      | number | No       | Must be > 0, max 999999999           | Transaction amount (NT$)                 |
| date        | string | No       | Valid ISO date (YYYY-MM-DD)          | Transaction date                         |
| categoryId  | number | No       | Must exist in categories table       | Reference to category                    |
| description | string | Yes      | Max length 200 characters            | User note (optional)                     |
| createdAt   | string | No       | ISO 8601 timestamp                   | Record creation time                     |
| updatedAt   | string | No       | ISO 8601 timestamp                   | Last modification time                   |

**Indexes**:
- Primary: `++id` (auto-increment)
- `date` (for date range queries)
- `type` (for income/expense filtering)
- `categoryId` (for category filtering)
- Compound: `[date+type]` (for monthly expense totals)
- Compound: `[categoryId+date]` (for category breakdown by month)

**Validation Rules** (from spec FR-007, FR-008):
- `type`: Required, must be exactly 'income' or 'expense'
- `amount`: Required, must be positive number > 0, max 999,999,999
- `date`: Required, valid date string (use `isValid()` from date-fns)
- `categoryId`: Required, must reference existing category
- `description`: Optional, max 200 characters

**State Transitions**:
1. **Create**: User adds new transaction → Validate → Save to IndexedDB → Update Zustand store
2. **Update**: User edits transaction → Validate → Update IndexedDB → Update Zustand store
3. **Delete**: User confirms deletion → Delete from IndexedDB → Remove from Zustand store

**Business Rules**:
- Amount must always be positive (negative amounts not allowed)
- Date cannot be in the future (optional validation, not required by spec)
- Cannot delete transaction (only soft delete if needed) - spec allows hard delete
- createdAt is immutable, updatedAt changes on every edit

**Sample Data**:
```typescript
{
  id: 1,
  type: 'expense',
  amount: 120,
  date: '2025-10-16',
  categoryId: 3, // 飲食 (Food)
  description: '午餐 - 義大利麵',
  createdAt: '2025-10-16T12:30:00.000Z',
  updatedAt: '2025-10-16T12:30:00.000Z'
}

{
  id: 2,
  type: 'income',
  amount: 50000,
  date: '2025-10-01',
  categoryId: 1, // 薪水 (Salary)
  description: 'October salary',
  createdAt: '2025-10-01T09:00:00.000Z',
  updatedAt: '2025-10-01T09:00:00.000Z'
}
```

---

### 2. Category

**Purpose**: Represents a spending or income classification

**TypeScript Interface**:
```typescript
interface Category {
  id?: number;                    // Auto-incremented primary key
  name: string;                   // Category name (max 20 chars)
  type: 'income' | 'expense';     // Category type
  icon: string;                   // Icon identifier (e.g., 'food', 'transport')
  color: string;                  // Hex color code (e.g., '#22c55e')
  isDefault: boolean;             // True for predefined categories
  createdAt: string;              // ISO 8601 timestamp
}
```

**Fields**:

| Field     | Type    | Nullable | Validation                    | Description                         |
|-----------|---------|----------|-------------------------------|-------------------------------------|
| id        | number  | Yes      | Auto-increment                | Unique identifier                   |
| name      | string  | No       | Max 20 chars, unique per type | Category display name               |
| type      | string  | No       | Must be 'income' or 'expense' | Category type                       |
| icon      | string  | No       | Valid icon identifier         | Icon name (from icon set)           |
| color     | string  | No       | Valid hex color (#RRGGBB)     | Category color                      |
| isDefault | boolean | No       | true or false                 | True for predefined, false for user |
| createdAt | string  | No       | ISO 8601 timestamp            | Creation time                       |

**Indexes**:
- Primary: `++id` (auto-increment)
- `name, type` (composite unique - same name allowed for income and expense)
- `isDefault` (for filtering predefined categories)

**Validation Rules** (from spec FR-012, FR-013):
- `name`: Required, max 20 characters, must be unique within same type
- `type`: Required, must be 'income' or 'expense'
- `icon`: Required, must be valid icon identifier from predefined set
- `color`: Required, must be valid hex color with WCAG AA contrast
- `isDefault`: Cannot be deleted if true (spec FR-017)

**Predefined Categories** (from spec FR-009, FR-010):

**Income Categories**:
| ID | Name         | Icon       | Color     |
|----|--------------|------------|-----------|
| 1  | 薪水 (Salary)     | salary     | #22c55e   |
| 2  | 獎金 (Bonus)      | bonus      | #16a34a   |
| 3  | 投資收益 (Investment) | investment | #15803d   |
| 4  | 其他收入 (Other Income) | other      | #14532d   |

**Expense Categories**:
| ID | Name          | Icon       | Color     |
|----|---------------|------------|-----------|
| 5  | 飲食 (Food)        | food       | #dc2626   |
| 6  | 交通 (Transport)   | transport  | #b91c1c   |
| 7  | 購物 (Shopping)    | shopping   | #991b1b   |
| 8  | 娛樂 (Entertainment)| entertainment | #7f1d1d |
| 9  | 醫療 (Medical)     | medical    | #ef4444   |
| 10 | 教育 (Education)   | education  | #f87171   |
| 11 | 居住 (Housing)     | housing    | #fca5a5   |
| 12 | 其他支出 (Other Expense) | other | #fecaca |

**Business Rules**:
- Default categories (isDefault=true) cannot be deleted (spec FR-017)
- Custom categories (isDefault=false) can be deleted
- When deleting category with transactions, reassign to "Uncategorized" (spec FR-016)
- Category name must be unique within same type (can have "Food" for both income and expense)

**State Transitions**:
1. **Create Custom**: User adds category → Validate → Save to IndexedDB → Update store
2. **Update Custom**: User edits category → Validate → Update IndexedDB → Update transactions
3. **Delete Custom**: Check for transactions → Confirm → Reassign transactions → Delete category

**Sample Data**:
```typescript
{
  id: 5,
  name: '飲食',
  type: 'expense',
  icon: 'food',
  color: '#dc2626',
  isDefault: true,
  createdAt: '2025-10-16T00:00:00.000Z'
}

{
  id: 13,
  name: '寵物',
  type: 'expense',
  icon: 'pet',
  color: '#8b5cf6',
  isDefault: false,
  createdAt: '2025-10-16T14:20:00.000Z'
}
```

---

### 3. Budget

**Purpose**: Represents monthly spending limit

**TypeScript Interface**:
```typescript
interface Budget {
  id?: number;                    // Auto-incremented primary key
  monthYear: string;              // Month identifier (YYYY-MM format)
  limit: number;                  // Budget limit amount (NT$)
  createdAt: string;              // ISO 8601 timestamp
  updatedAt: string;              // ISO 8601 timestamp
}
```

**Fields**:

| Field     | Type   | Nullable | Validation                   | Description                     |
|-----------|--------|----------|------------------------------|---------------------------------|
| id        | number | Yes      | Auto-increment               | Unique identifier               |
| monthYear | string | No       | Format: YYYY-MM, unique      | Month identifier (e.g., '2025-10') |
| limit     | number | No       | Must be > 0, max 999999999   | Budget limit (NT$)              |
| createdAt | string | No       | ISO 8601 timestamp           | Creation time                   |
| updatedAt | string | No       | ISO 8601 timestamp           | Last modification time          |

**Indexes**:
- Primary: `++id` (auto-increment)
- `monthYear` (unique - only one budget per month)

**Validation Rules** (from spec FR-027):
- `monthYear`: Required, format YYYY-MM, unique
- `limit`: Required, must be positive number > 0, max 999,999,999
- Only one budget per month (enforce unique constraint)

**Business Rules**:
- One budget per month (spec implies monthly budgets only)
- Budget can be set below current spending (spec FR-030 allows this, shows immediate warning)
- Budget warnings:
  - 80% reached: Yellow warning (spec FR-029)
  - 100% exceeded: Red alert with overage amount (spec FR-030)

**Calculations**:
```typescript
// Current month spending
const currentMonthExpenses = transactions
  .filter(t => t.type === 'expense' && t.date.startsWith('2025-10'))
  .reduce((sum, t) => sum + t.amount, 0);

// Budget usage percentage
const usagePercentage = (currentMonthExpenses / budget.limit) * 100;

// Warning logic
if (usagePercentage >= 100) {
  const overage = currentMonthExpenses - budget.limit;
  showAlert(`Exceeded budget by NT$${overage}`);
} else if (usagePercentage >= 80) {
  showWarning(`You've used ${usagePercentage}% of your budget`);
}
```

**State Transitions**:
1. **Create**: User sets monthly budget → Validate → Save to IndexedDB → Show progress bar
2. **Update**: User edits budget → Validate → Update IndexedDB → Recalculate warnings
3. **Delete**: User removes budget → Delete from IndexedDB → Hide progress bar

**Sample Data**:
```typescript
{
  id: 1,
  monthYear: '2025-10',
  limit: 15000,
  createdAt: '2025-10-01T10:00:00.000Z',
  updatedAt: '2025-10-01T10:00:00.000Z'
}
```

---

### 4. Settings

**Purpose**: Stores user preferences and application state

**TypeScript Interface**:
```typescript
interface Setting {
  key: string;                    // Setting key (primary key)
  value: any;                     // Setting value (JSON serializable)
  updatedAt: string;              // ISO 8601 timestamp
}
```

**Fields**:

| Field     | Type   | Nullable | Validation           | Description                |
|-----------|--------|----------|----------------------|----------------------------|
| key       | string | No       | Unique, max 50 chars | Setting identifier         |
| value     | any    | No       | JSON serializable    | Setting value              |
| updatedAt | string | No       | ISO 8601 timestamp   | Last modification time     |

**Indexes**:
- Primary: `key` (unique)

**Predefined Settings**:

| Key                  | Type    | Default   | Description                        |
|----------------------|---------|-----------|-----------------------------------|
| theme                | string  | 'light'   | Theme preference ('light', 'dark') |
| currency             | string  | 'NT$'     | Currency symbol                    |
| defaultExpenseCategory | number | 12        | Default category for quick add     |
| sampleDataLoaded     | boolean | false     | Whether sample data was loaded     |
| firstLaunch          | boolean | true      | First time using app              |
| language             | string  | 'zh-TW'   | Language preference (future)       |

**Validation Rules**:
- `theme`: Must be 'light' or 'dark'
- `currency`: String, max 10 characters
- `defaultExpenseCategory`: Must reference existing category
- Boolean values: true or false

**Sample Data**:
```typescript
{
  key: 'theme',
  value: 'dark',
  updatedAt: '2025-10-16T15:30:00.000Z'
}

{
  key: 'sampleDataLoaded',
  value: true,
  updatedAt: '2025-10-16T10:00:00.000Z'
}
```

---

## IndexedDB Schema (Dexie.js)

**Database Name**: `simplebook_db`
**Version**: 1

**Schema Definition**:
```typescript
import Dexie, { Table } from 'dexie';

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

export const db = new SimpleBookDB();
```

**Index Explanation**:
- `++id`: Auto-increment primary key
- `&monthYear`: Unique constraint
- `[date+type]`: Compound index for filtering transactions by date and type
- `[categoryId+date]`: Compound index for category analysis over time
- `[name+type]`: Compound index ensuring category names are unique per type

---

## Database Initialization

**First Launch**:
1. Create IndexedDB database `simplebook_db`
2. Initialize default categories (income: 4, expense: 8)
3. Set default settings (theme: 'light', firstLaunch: true)
4. Generate 3 months of sample data (spec FR-055)
5. Set `sampleDataLoaded: true`

**Sample Data Generation** (spec FR-055, FR-056):
- Create ~90 transactions (30 per month × 3 months)
- Realistic distribution:
  - 70% expenses, 30% income
  - Food: 30%, Transport: 15%, Shopping: 15%, Other categories: 40%
  - Amount range: NT$50 - NT$5000 (expenses), NT$30,000 - NT$50,000 (income)
- All sample transactions marked with description prefix "[範例]" (Example)
- User can clear all sample data with one button (spec FR-057)

**Migration Strategy** (Future Versions):
```typescript
// Example: Adding new field in version 2
db.version(2).stores({
  transactions: '++id, date, type, categoryId, [date+type], [categoryId+date], tags'
}).upgrade(tx => {
  return tx.table('transactions').toCollection().modify(transaction => {
    transaction.tags = [];
  });
});
```

---

## Data Access Patterns

### Common Queries

**1. Get Current Month Transactions**:
```typescript
const startDate = startOfMonth(new Date());
const endDate = endOfMonth(new Date());

const transactions = await db.transactions
  .where('date')
  .between(formatISO(startDate, { representation: 'date' }),
           formatISO(endDate, { representation: 'date' }),
           true, true)
  .toArray();
```

**2. Get Transactions by Category**:
```typescript
const foodTransactions = await db.transactions
  .where('categoryId')
  .equals(categoryId)
  .toArray();
```

**3. Get Monthly Expense Total**:
```typescript
const monthlyExpenses = await db.transactions
  .where('[date+type]')
  .between(['2025-10-01', 'expense'], ['2025-10-31', 'expense'], true, true)
  .toArray();

const total = monthlyExpenses.reduce((sum, t) => sum + t.amount, 0);
```

**4. Filter Transactions** (spec FR-033 to FR-039):
```typescript
let query = db.transactions.toCollection();

if (filters.dateRange) {
  query = query.filter(t =>
    t.date >= filters.dateRange.start &&
    t.date <= filters.dateRange.end
  );
}

if (filters.categoryIds?.length) {
  query = query.filter(t => filters.categoryIds.includes(t.categoryId));
}

if (filters.type) {
  query = query.filter(t => t.type === filters.type);
}

if (filters.searchText) {
  query = query.filter(t =>
    t.description?.toLowerCase().includes(filters.searchText.toLowerCase())
  );
}

const results = await query.toArray();
```

**5. Category Breakdown** (spec FR-021):
```typescript
const categoryTotals = await db.transactions
  .where('[categoryId+date]')
  .between([categoryId, '2025-10-01'], [categoryId, '2025-10-31'], true, true)
  .toArray();

const totalByCategory = categoryTotals.reduce((acc, t) => {
  acc[t.categoryId] = (acc[t.categoryId] || 0) + t.amount;
  return acc;
}, {} as Record<number, number>);
```

---

## Data Integrity

### Referential Integrity

**Category Deletion** (spec FR-015, FR-016):
```typescript
async function deleteCategory(categoryId: number) {
  // 1. Count transactions using this category
  const count = await db.transactions.where('categoryId').equals(categoryId).count();

  // 2. Warn user
  if (count > 0 && !confirm(`This category has ${count} transactions. Delete anyway?`)) {
    return;
  }

  // 3. Reassign transactions to "Uncategorized" (create if doesn't exist)
  const uncategorized = await getOrCreateUncategorizedCategory();
  await db.transactions.where('categoryId').equals(categoryId).modify({ categoryId: uncategorized.id });

  // 4. Delete category
  await db.categories.delete(categoryId);
}
```

### Data Validation

**Transaction Validation**:
```typescript
function validateTransaction(transaction: Partial<Transaction>): string[] {
  const errors: string[] = [];

  if (!transaction.type || !['income', 'expense'].includes(transaction.type)) {
    errors.push('Type must be income or expense');
  }

  if (!transaction.amount || transaction.amount <= 0) {
    errors.push('Amount must be greater than 0');
  }

  if (transaction.amount && transaction.amount > 999999999) {
    errors.push('Amount must be less than 1 billion');
  }

  if (!transaction.date || !isValid(parseISO(transaction.date))) {
    errors.push('Date must be valid');
  }

  if (!transaction.categoryId) {
    errors.push('Category is required');
  }

  if (transaction.description && transaction.description.length > 200) {
    errors.push('Description must be 200 characters or less');
  }

  return errors;
}
```

---

## Export Format (CSV)

**CSV Structure** (spec FR-042, FR-043):

```csv
Date,Type,Category,Amount,Description
2025-10-16,Expense,飲食,NT$ 120,午餐 - 義大利麵
2025-10-15,Expense,交通,NT$ 50,捷運
2025-10-01,Income,薪水,NT$ 50000,October salary
```

**Export Implementation**:
```typescript
import Papa from 'papaparse';

async function exportTransactionsToCSV(dateRange: { start: string; end: string }) {
  // 1. Fetch transactions
  const transactions = await db.transactions
    .where('date')
    .between(dateRange.start, dateRange.end, true, true)
    .toArray();

  // 2. Fetch categories for lookup
  const categories = await db.categories.toArray();
  const categoryMap = Object.fromEntries(categories.map(c => [c.id, c]));

  // 3. Transform to CSV format
  const csvData = transactions.map(t => ({
    Date: t.date,
    Type: t.type === 'income' ? 'Income' : 'Expense',
    Category: categoryMap[t.categoryId]?.name || 'Unknown',
    Amount: `NT$ ${t.amount.toLocaleString()}`,
    Description: t.description || ''
  }));

  // 4. Generate CSV with UTF-8 BOM (for Excel)
  const csv = Papa.unparse(csvData, {
    encoding: 'utf-8',
    header: true
  });

  const bom = '\uFEFF'; // UTF-8 BOM for Excel compatibility
  const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' });

  // 5. Trigger download
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `SimpleBook_${dateRange.start}_to_${dateRange.end}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
```

---

## Summary

**Tables**: 4 (transactions, categories, budgets, settings)
**Total Entities**: ~100-1000 transactions, 12-20 categories, 1-12 budgets, ~6 settings
**Storage Size**: ~50KB for 100 transactions, ~500KB for 1000 transactions
**Performance**: All queries < 500ms for up to 1000 records (with proper indexes)

**Next Steps**: Proceed to generate contracts/data-contracts.md with TypeScript interfaces and validation schemas
