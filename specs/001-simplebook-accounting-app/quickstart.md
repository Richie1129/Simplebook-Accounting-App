# QuickStart: SimpleBook Development Guide

**Feature**: SimpleBook Personal Accounting Web App
**Last Updated**: 2025-10-16
**Branch**: `001-simplebook-accounting-app`

## Overview

This guide will get you from zero to running SimpleBook locally in under 15 minutes.

**What you'll build**:
- Personal accounting web app with income/expense tracking
- Local-only storage (IndexedDB) - no backend required
- Visual statistics (pie charts, line charts, bar charts)
- Budget alerts and data export

**Tech Stack**:
- React 18 + TypeScript 5
- Vite 5 (build tool)
- Tailwind CSS 3 (styling)
- IndexedDB via Dexie.js (storage)
- Zustand (state management)
- Recharts (charts)

---

## Prerequisites

**Required**:
- Node.js 18+ ([download](https://nodejs.org/))
- npm 9+ or pnpm 8+
- Git
- Modern browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)

**Optional**:
- VS Code with extensions:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript Importer

**Check your versions**:
```bash
node --version   # Should be v18.0.0 or higher
npm --version    # Should be 9.0.0 or higher
git --version    # Any recent version
```

---

## 1. Project Setup (5 minutes)

### Create Project

```bash
# Create Vite project with React + TypeScript template
npm create vite@latest simplebook -- --template react-ts

# Navigate to project
cd simplebook

# Initialize git (if not already initialized)
git init
git checkout -b 001-simplebook-accounting-app
```

### Install Dependencies

```bash
# Core dependencies
npm install dexie zustand recharts date-fns papaparse

# Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Development dependencies
npm install -D @types/papaparse

# Testing (optional for initial setup)
npm install -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom
npm install -D @playwright/test
```

### Configure Tailwind CSS

**File**: `tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        income: {
          light: '#22c55e',  // green-600
          dark: '#4ade80',   // green-400
        },
        expense: {
          light: '#dc2626',  // red-600
          dark: '#f87171',   // red-400
        },
      },
    },
  },
  plugins: [],
}
```

**File**: `src/styles/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom styles */
@layer base {
  html {
    @apply h-full;
  }

  body {
    @apply h-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100;
  }
}

@layer components {
  /* Touch target minimum size (44x44px) */
  .btn {
    @apply min-h-[44px] min-w-[44px] px-4 py-2;
  }

  /* Focus indicators for accessibility */
  .focus-ring {
    @apply focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500;
  }
}
```

---

## 2. Project Structure (Reference)

Create this folder structure (folders will be created as you add files):

```
simplebook/
├── public/
│   ├── manifest.json          # PWA manifest (create later)
│   └── sw.js                  # Service Worker (create later)
├── src/
│   ├── components/            # React components
│   │   ├── common/           # Shared UI components
│   │   ├── Dashboard/        # Dashboard components
│   │   ├── TransactionForm/  # Transaction forms
│   │   ├── TransactionList/  # Transaction list and filters
│   │   ├── Categories/       # Category management
│   │   ├── Settings/         # Settings and preferences
│   │   └── Layout/           # App layout
│   ├── hooks/                # Custom React hooks
│   ├── services/             # Database and business logic
│   ├── utils/                # Utility functions
│   ├── types/                # TypeScript type definitions
│   ├── store/                # Zustand state management
│   ├── styles/               # Global styles
│   │   └── globals.css
│   ├── App.tsx               # Root component
│   ├── main.tsx              # React entry point
│   └── vite-env.d.ts         # Vite type declarations
├── tests/                    # Tests (create later)
├── .eslintrc.json            # ESLint configuration
├── .prettierrc               # Prettier configuration
├── tsconfig.json             # TypeScript configuration
├── vite.config.ts            # Vite build configuration
├── tailwind.config.js        # Tailwind CSS configuration
└── package.json              # Dependencies and scripts
```

---

## 3. Database Setup (10 minutes)

### Create Database Schema

**File**: `src/services/db.ts`

```typescript
import Dexie, { Table } from 'dexie';

// Import types (you'll create these next)
export interface Transaction {
  id?: number;
  type: 'income' | 'expense';
  amount: number;
  date: string;
  categoryId: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id?: number;
  name: string;
  type: 'income' | 'expense';
  icon: string;
  color: string;
  isDefault: boolean;
  createdAt: string;
}

export interface Budget {
  id?: number;
  monthYear: string;
  limit: number;
  createdAt: string;
  updatedAt: string;
}

export interface Setting {
  key: string;
  value: any;
  updatedAt: string;
}

// Define database class
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
```

### Initialize Default Categories

**File**: `src/services/categoryService.ts`

```typescript
import { db, Category } from './db';

const DEFAULT_INCOME_CATEGORIES: Omit<Category, 'id'>[] = [
  { name: '薪水', type: 'income', icon: 'salary', color: '#16a34a', isDefault: true, createdAt: new Date().toISOString() },
  { name: '獎金', type: 'income', icon: 'bonus', color: '#15803d', isDefault: true, createdAt: new Date().toISOString() },
  { name: '投資收益', type: 'income', icon: 'investment', color: '#166534', isDefault: true, createdAt: new Date().toISOString() },
  { name: '其他收入', type: 'income', icon: 'other', color: '#14532d', isDefault: true, createdAt: new Date().toISOString() },
];

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

export async function getAllCategories(): Promise<Category[]> {
  return await db.categories.toArray();
}

export async function getCategoryById(id: number): Promise<Category | undefined> {
  return await db.categories.get(id);
}
```

---

## 4. Create Basic Components (10 minutes)

### Root App Component

**File**: `src/App.tsx`

```typescript
import { useEffect, useState } from 'react';
import { initializeDefaultCategories } from './services/categoryService';
import './styles/globals.css';

function App() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    async function initialize() {
      try {
        await initializeDefaultCategories();
        setInitialized(true);
      } catch (error) {
        console.error('Failed to initialize app:', error);
      }
    }

    initialize();
  }, []);

  if (!initialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading SimpleBook...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            SimpleBook 個人記帳本
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Welcome to SimpleBook!</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Your personal accounting app is ready. Start tracking your income and expenses.
          </p>

          <div className="mt-6">
            <button className="btn bg-green-600 text-white rounded-lg hover:bg-green-700 focus-ring">
              Add Transaction
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
```

### Update Main Entry Point

**File**: `src/main.tsx`

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

---

## 5. Run Development Server

```bash
# Start dev server
npm run dev

# Open browser to http://localhost:5173
```

You should see:
- ✅ "SimpleBook 個人記帳本" header
- ✅ Welcome message
- ✅ "Add Transaction" button

**Verify Database**:
1. Open browser DevTools (F12)
2. Go to Application → IndexedDB
3. Expand `simplebook_db` → `categories`
4. You should see 12 default categories (4 income, 8 expense)

---

## 6. Configuration Files

### TypeScript Configuration

**File**: `tsconfig.json` (update the existing file)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "strict": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### ESLint Configuration

**File**: `.eslintrc.json`

```json
{
  "env": {
    "browser": true,
    "es2020": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": ["react-refresh"],
  "rules": {
    "react-refresh/only-export-components": "warn",
    "@typescript-eslint/no-explicit-any": "warn",
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  }
}
```

### Prettier Configuration

**File**: `.prettierrc`

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
```

### Package.json Scripts

**File**: `package.json` (add these scripts)

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "format": "prettier --write \"src/**/*.{ts,tsx,css}\"",
    "type-check": "tsc --noEmit",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test"
  }
}
```

---

## 7. Verify Setup

Run these commands to verify everything is working:

```bash
# Type check
npm run type-check
# ✅ Should complete with no errors

# Lint
npm run lint
# ✅ Should complete with no errors

# Format code
npm run format
# ✅ Should format all files

# Build production bundle
npm run build
# ✅ Should create dist/ folder

# Preview production build
npm run preview
# ✅ Open http://localhost:4173 and verify app works
```

---

## 8. Next Steps

You now have a working SimpleBook foundation! Here's what to build next:

### Priority 1: Core Features (P1 User Stories)
1. **Transaction Management**:
   - Create `TransactionForm` component
   - Implement add/edit/delete operations
   - Add transaction list with filtering

2. **Dashboard**:
   - Create `DashboardView` component
   - Display monthly totals (income, expense, balance)
   - Add category pie chart (using Recharts)

### Priority 2: Analytics (P2 User Stories)
3. **Category Visualization**:
   - Implement `CategoryPieChart` component
   - Add category breakdown calculations

4. **Custom Categories**:
   - Create `CategoryManager` component
   - Implement add/edit/delete for custom categories

### Priority 3: Advanced Features (P3 User Stories)
5. **Trends and Budgets**:
   - Implement `TrendLineChart` (7-day trend)
   - Implement `MonthlyComparisonChart` (bar chart)
   - Add budget settings and alerts

6. **Filters and Search**:
   - Create `FilterPanel` component
   - Implement date range, category, type filters
   - Add search functionality

### Priority 4: Polish (P4 User Stories)
7. **Export and Theme**:
   - Implement CSV export
   - Add dark mode toggle
   - Create settings page

---

## 9. Development Workflow

### Before Committing Code

```bash
# 1. Format code
npm run format

# 2. Run linter
npm run lint

# 3. Type check
npm run type-check

# 4. Run tests (when you have tests)
npm run test

# 5. Build to verify no production issues
npm run build
```

### Commit Convention

Follow conventional commits:

```bash
git commit -m "feat(transactions): add transaction form component"
git commit -m "fix(budget): correct percentage calculation rounding"
git commit -m "test(calculations): add unit tests for monthly totals"
git commit -m "docs(readme): update setup instructions"
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

---

## 10. Troubleshooting

### Port already in use

```bash
# Vite uses port 5173 by default
# If it's taken, Vite will automatically try the next port (5174, 5175, etc.)
# Or specify a port explicitly:
npm run dev -- --port 3000
```

### IndexedDB not visible in DevTools

- **Chrome**: DevTools → Application → IndexedDB
- **Firefox**: DevTools → Storage → Indexed DB
- **Safari**: Develop → Show Web Inspector → Storage → Indexed Databases

If database doesn't appear, check browser console for errors.

### TypeScript errors with Dexie

Make sure you have Dexie installed:
```bash
npm install dexie
```

Dexie includes TypeScript definitions, no @types package needed.

### Tailwind styles not applying

1. Verify `globals.css` is imported in `main.tsx` or `App.tsx`
2. Check `tailwind.config.js` content paths include your TSX files
3. Restart dev server after changing config

---

## 11. Useful Resources

**Documentation**:
- [React Docs](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Dexie.js](https://dexie.org/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Recharts](https://recharts.org/)
- [date-fns](https://date-fns.org/)

**Design References** (for inspiration, all have great demos and examples):
- [Tailwind UI Components](https://tailwindui.com/components)
- [Headless UI](https://headlessui.com/)
- [Recharts Examples](https://recharts.org/en-US/examples)

**Testing**:
- [Vitest](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright](https://playwright.dev/)

---

## 12. Constitutional Compliance Checklist

As you develop, ensure compliance with project constitution:

- [ ] **Code Quality**: TypeScript strict mode, ESLint passing, functions <50 lines
- [ ] **Testing**: Unit tests for calculations, 80% coverage for services/utils
- [ ] **UX**: Responsive design (test on 320px, 768px, 1920px), <3 step flows
- [ ] **Performance**: <2s load time, <500ms queries, Service Workers for offline
- [ ] **Security**: No external API calls, no analytics, IndexedDB only
- [ ] **Accessibility**: Keyboard nav, ARIA labels, WCAG 2.1 AA contrast

Run regular checks:
```bash
# Code quality
npm run lint && npm run type-check

# Performance (Lighthouse audit in Chrome DevTools)
# 1. npm run build
# 2. npm run preview
# 3. Open DevTools → Lighthouse → Run audit

# Accessibility (axe DevTools extension)
# Install: https://www.deque.com/axe/devtools/
```

---

## Summary

**You now have**:
- ✅ Vite + React + TypeScript project
- ✅ Tailwind CSS configured with dark mode
- ✅ IndexedDB database with Dexie.js
- ✅ Default categories initialized
- ✅ Development server running
- ✅ ESLint + Prettier configured
- ✅ Build pipeline working

**Time to first render**: ~15 minutes
**Next milestone**: Implement P1 user stories (transaction management + dashboard)

**Ready to code!** 🚀

For detailed implementation guidance, refer to:
- [plan.md](plan.md) - Full implementation plan
- [data-model.md](data-model.md) - Database schema and entities
- [contracts/data-contracts.md](contracts/data-contracts.md) - TypeScript interfaces and service contracts
- [research.md](research.md) - Technology decisions and best practices
