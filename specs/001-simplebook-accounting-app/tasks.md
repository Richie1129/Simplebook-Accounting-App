# Tasks: SimpleBook Personal Accounting Web App

**Input**: Design documents from `/specs/001-simplebook-accounting-app/`
**Prerequisites**: plan.md (required), spec.md (required), data-model.md, contracts/, research.md, quickstart.md

**Tests**: Tests are OPTIONAL in this implementation - focusing on core functionality first

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, etc.)
- Include exact file paths in descriptions

## Path Conventions
- **Single project**: `src/`, `tests/` at repository root
- All paths shown below assume single SPA project structure

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create Vite React TypeScript project with command: npm create vite@latest simplebook -- --template react-ts
- [ ] T002 [P] Install core dependencies: dexie zustand recharts date-fns papaparse
- [ ] T003 [P] Install Tailwind CSS dependencies: tailwindcss postcss autoprefixer
- [ ] T004 [P] Install development dependencies: @types/papaparse vitest @testing-library/react
- [ ] T005 Initialize Tailwind CSS with command: npx tailwindcss init -p
- [ ] T006 Configure Tailwind in tailwind.config.js with dark mode class strategy and custom colors
- [ ] T007 Create src/styles/globals.css with Tailwind imports and custom styles
- [ ] T008 Configure TypeScript strict mode in tsconfig.json with path aliases
- [ ] T009 [P] Create .eslintrc.json with React and TypeScript rules
- [ ] T010 [P] Create .prettierrc with code formatting rules
- [ ] T011 Update package.json with scripts: dev, build, lint, format, type-check
- [ ] T012 Create project directory structure: src/{components,hooks,services,utils,types,store,styles}

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T013 Create TypeScript types in src/types/transaction.ts: Transaction, TransactionInput, TransactionFilters
- [ ] T014 [P] Create TypeScript types in src/types/category.ts: Category, CategoryInput, CategoryColors
- [ ] T015 [P] Create TypeScript types in src/types/budget.ts: Budget, BudgetInput, BudgetStatus
- [ ] T016 [P] Create TypeScript types in src/types/settings.ts: Setting, UserSettings, Theme
- [ ] T017 [P] Create TypeScript types in src/types/chart.ts: PieChartData, LineChartData, BarChartData
- [ ] T017a [P] Define CategoryColors constant and CategoryIcon type in src/types/category.ts with WCAG AA compliant colors
- [ ] T018 Setup Dexie database schema in src/services/db.ts with 4 tables: transactions, categories, budgets, settings
- [ ] T019 Create validation utilities in src/utils/validators.ts: validateTransaction, validateCategory, validateBudget
- [ ] T020 [P] Create calculation utilities in src/utils/calculations.ts: calculateTotal, calculatePercentage
- [ ] T021 [P] Create date helper utilities in src/utils/dateHelpers.ts with date-fns wrappers
- [ ] T022 [P] Create formatter utilities in src/utils/formatters.ts: formatCurrency, formatDate
- [ ] T023 Initialize default categories in src/services/categoryService.ts: 4 income + 8 expense categories
- [ ] T024 Create category service functions in src/services/categoryService.ts: getAll, create, update, delete
- [ ] T025 Create Zustand category store in src/store/categoryStore.ts with state and actions
- [ ] T026 [P] Create Zustand settings store in src/store/settingsStore.ts with theme and preferences
- [ ] T027 [P] Create Zustand UI store in src/store/uiStore.ts for modals and toast notifications
- [ ] T028 Create common Button component in src/components/common/Button.tsx with Tailwind styles
- [ ] T029 [P] Create common Input component in src/components/common/Input.tsx with validation
- [ ] T030 [P] Create common Modal component in src/components/common/Modal.tsx with accessibility
- [ ] T031 [P] Create common Toast component in src/components/common/Toast.tsx for notifications
- [ ] T032 [P] Create IconButton component in src/components/common/IconButton.tsx with ARIA labels
- [ ] T033 Create App Layout in src/components/Layout/AppLayout.tsx with header and navigation
- [ ] T034 [P] Create Header component in src/components/Layout/Header.tsx with app title
- [ ] T035 [P] Create Navigation component in src/components/Layout/Navigation.tsx for tab/desktop menu
- [ ] T036 Update src/App.tsx to initialize database and load default categories
- [ ] T037 Update src/main.tsx to import globals.css and render App with StrictMode
- [ ] T037a [P] Setup Service Workers for offline support in public/sw.js and public/manifest.json for PWA

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Quick Expense Recording (Priority: P1) 🎯 MVP

**Goal**: Enable users to add, edit, delete transactions with quick add feature. Display transaction list.

**Independent Test**: Open app, add expense with amount and category, verify it appears in transaction list. Test edit and delete.

### Implementation for User Story 1

- [ ] T038 [P] [US1] Create Transaction type in src/types/transaction.ts (if not in Foundational)
- [ ] T039 [P] [US1] Create transaction service in src/services/transactionService.ts: getAll, create, update, delete, quickAdd
- [ ] T040 [US1] Create Zustand transaction store in src/store/transactionStore.ts with CRUD operations
- [ ] T041 [US1] Create useTransactions custom hook in src/hooks/useTransactions.ts wrapping store
- [ ] T042 [P] [US1] Create TransactionForm component in src/components/TransactionForm/TransactionForm.tsx with type, amount, date, category, description fields
- [ ] T043 [P] [US1] Create QuickAddForm component in src/components/TransactionForm/QuickAddForm.tsx with minimal fields
- [ ] T044 [P] [US1] Create CategorySelector component in src/components/TransactionForm/CategorySelector.tsx dropdown
- [ ] T045 [P] [US1] Create DatePicker component in src/components/TransactionForm/DatePicker.tsx with date-fns
- [ ] T046 [US1] Create TransactionList component in src/components/TransactionList/TransactionList.tsx displaying all transactions
- [ ] T047 [P] [US1] Create TransactionItem component in src/components/TransactionList/TransactionItem.tsx with edit/delete actions
- [ ] T048 [US1] Integrate TransactionForm modal trigger in App.tsx with "Add Transaction" button
- [ ] T049 [US1] Implement delete confirmation modal for transactions
- [ ] T050 [US1] Add form validation with inline error messages for transaction form
- [ ] T051 [US1] Test transaction CRUD flow: create → display → edit → delete

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Monthly Budget Overview (Priority: P1) 🎯 MVP

**Goal**: Display dashboard with current month income, expense, balance totals. Auto-update on transaction changes.

**Independent Test**: View dashboard showing monthly totals. Add transaction and verify totals update automatically.

### Implementation for User Story 2

- [ ] T052 [P] [US2] Create statistics service in src/services/statisticsService.ts: getMonthlyTotals, getDashboardStats
- [ ] T053 [P] [US2] Create chart helper utilities in src/utils/chartHelpers.ts for data transformations
- [ ] T054 [US2] Create useStatistics custom hook in src/hooks/useStatistics.ts with monthly calculations
- [ ] T055 [P] [US2] Create DashboardView component in src/components/Dashboard/DashboardView.tsx layout
- [ ] T056 [P] [US2] Create MonthlyOverview component in src/components/Dashboard/MonthlyOverview.tsx showing income/expense/balance
- [ ] T057 [US2] Implement color coding: green for income, red for expense in MonthlyOverview
- [ ] T058 [US2] Add auto-update logic: subscribe to transaction store changes in useStatistics
- [ ] T059 [US2] Handle empty state: show "0" for all totals when no transactions exist
- [ ] T060 [US2] Integrate DashboardView into App.tsx as default view
- [ ] T061 [US2] Test monthly total calculations with sample transactions

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Expense Category Visualization (Priority: P2)

**Goal**: Display pie chart showing expense distribution by category with percentages and amounts.

**Independent Test**: View pie chart with multiple expense categories. Tap slice to see category transactions.

### Implementation for User Story 3

- [ ] T062 [P] [US3] Add getCategoryBreakdown method to statistics service in src/services/statisticsService.ts
- [ ] T063 [P] [US3] Create CategoryPieChart component in src/components/Dashboard/CategoryPieChart.tsx using Recharts
- [ ] T064 [US3] Implement pie chart data transformation in useStatistics hook
- [ ] T065 [P] [US3] Add color-coding to pie slices based on category colors
- [ ] T066 [P] [US3] Display percentage and amount on each pie slice
- [ ] T067 [US3] Implement click handler on pie slice to filter transactions by category
- [ ] T068 [US3] Handle empty state: show "No expense data for this month" when no expenses
- [ ] T069 [US3] Add CategoryPieChart to DashboardView component
- [ ] T070 [US3] Test pie chart with various expense distributions

**Checkpoint**: At this point, User Stories 1, 2, AND 3 should all work independently

---

## Phase 6: User Story 4 - Custom Categories (Priority: P2)

**Goal**: Allow users to create, edit, delete custom categories. Prevent deletion of default categories.

**Independent Test**: Create custom category, use in transaction, edit category, delete unused category.

### Implementation for User Story 4

- [ ] T071 [P] [US4] Create useCategories custom hook in src/hooks/useCategories.ts wrapping category service
- [ ] T072 [P] [US4] Create CategoryManager component in src/components/Categories/CategoryManager.tsx list view
- [ ] T073 [P] [US4] Create CategoryForm component in src/components/Categories/CategoryForm.tsx for add/edit
- [ ] T074 [P] [US4] Create IconColorPicker component in src/components/Categories/IconColorPicker.tsx
- [ ] T075 [P] [US4] Create CategoryList component in src/components/Categories/CategoryList.tsx
- [ ] T076 [US4] Implement create custom category flow in CategoryForm
- [ ] T077 [US4] Implement edit custom category with name, icon, color changes
- [ ] T078 [US4] Implement delete category with transaction count warning
- [ ] T079 [US4] Prevent deletion of default categories (isDefault=true)
- [ ] T080 [US4] Reassign transactions to "Uncategorized" when category deleted
- [ ] T081 [US4] Add category management page to navigation
- [ ] T082 [US4] Test custom category lifecycle: create → use in transaction → edit → delete

**Checkpoint**: At this point, User Stories 1-4 should all work independently

---

## Phase 7: User Story 5 - Income and Expense Trends (Priority: P3)

**Goal**: Display 7-day trend line chart and 6-month comparison bar chart.

**Independent Test**: View line chart showing daily trends. View bar chart showing monthly comparison.

### Implementation for User Story 5

- [ ] T083 [P] [US5] Add getWeeklyTrend method to statistics service in src/services/statisticsService.ts
- [ ] T084 [P] [US5] Add getMonthlyComparison method to statistics service in src/services/statisticsService.ts
- [ ] T085 [P] [US5] Create TrendLineChart component in src/components/Dashboard/TrendLineChart.tsx using Recharts
- [ ] T086 [P] [US5] Create MonthlyComparisonChart component in src/components/Dashboard/MonthlyComparisonChart.tsx using Recharts
- [ ] T087 [US5] Implement 7-day trend calculation with date-fns
- [ ] T088 [US5] Implement 6-month comparison calculation
- [ ] T089 [US5] Add click handler on trend data points to show transactions for that day
- [ ] T090 [US5] Handle empty state: show "Add more transactions to see trends" when insufficient data
- [ ] T091 [US5] Add charts to DashboardView component
- [ ] T092 [US5] Lazy load chart components with React.lazy for performance
- [ ] T093 [US5] Test trend calculations with various time periods

**Checkpoint**: At this point, User Stories 1-5 should all work independently

---

## Phase 8: User Story 6 - Monthly Budget Alerts (Priority: P3)

**Goal**: Allow users to set monthly budget and display warnings at 80% and 100% thresholds.

**Independent Test**: Set budget, add expenses to reach 80% (see yellow warning), reach 100% (see red alert).

### Implementation for User Story 6

- [ ] T094 [P] [US6] Create budget service in src/services/budgetService.ts: set, update, delete, calculateStatus
- [ ] T095 [P] [US6] Create Zustand budget store in src/store/budgetStore.ts
- [ ] T096 [US6] Create useBudget custom hook in src/hooks/useBudget.ts
- [ ] T097 [P] [US6] Create BudgetSettings component in src/components/Settings/BudgetSettings.tsx
- [ ] T098 [P] [US6] Create BudgetProgress component in src/components/Dashboard/BudgetProgress.tsx
- [ ] T099 [US6] Implement budget calculation logic: usage percentage, remaining amount
- [ ] T100 [US6] Implement warning level detection: 80% = warning, 100%+ = alert
- [ ] T101 [US6] Display yellow warning at 80% usage
- [ ] T102 [US6] Display red alert at 100%+ usage with overage amount
- [ ] T103 [US6] Show budget progress bar on dashboard
- [ ] T104 [US6] Add BudgetSettings to Settings page
- [ ] T105 [US6] Test budget alerts with various spending levels

**Checkpoint**: At this point, User Stories 1-6 should all work independently

---

## Phase 9: User Story 7 - Filter and Search Transactions (Priority: P3)

**Goal**: Implement date range, category, type filters and description search. Allow clearing all filters.

**Independent Test**: Apply date range filter, category filter, search text. Clear all filters.

### Implementation for User Story 7

- [ ] T106 [P] [US7] Create filter utilities in src/utils/filters.ts for transaction filtering logic
- [ ] T107 [P] [US7] Create useFilters custom hook in src/hooks/useFilters.ts with filter state
- [ ] T108 [P] [US7] Create FilterPanel component in src/components/TransactionList/FilterPanel.tsx
- [ ] T109 [P] [US7] Create SearchBar component in src/components/TransactionList/SearchBar.tsx
- [ ] T110 [US7] Implement date range filter with start/end date pickers
- [ ] T111 [US7] Implement category filter with multi-select dropdown
- [ ] T112 [US7] Implement type filter (income/expense/both) with radio buttons
- [ ] T113 [US7] Implement description search with case-insensitive partial match
- [ ] T114 [US7] Implement cumulative filter logic: all filters applied simultaneously
- [ ] T115 [US7] Add "Clear All Filters" button to reset filters
- [ ] T116 [US7] Update TransactionList to use filtered results in real-time
- [ ] T117 [US7] Add FilterPanel to TransactionList view
- [ ] T118 [US7] Test filter combinations and search functionality

**Checkpoint**: At this point, User Stories 1-7 should all work independently

---

## Phase 10: User Story 8 - Export Data (Priority: P4)

**Goal**: Export transactions to CSV with three scope options: Current Month, Custom Range, All Time.

**Independent Test**: Export current month to CSV, open in Excel/Google Sheets, verify columns and data.

### Implementation for User Story 8

- [ ] T119 [P] [US8] Create export service in src/services/exportService.ts: exportToCSV, generateCSV
- [ ] T120 [P] [US8] Create DataExport component in src/components/Settings/DataExport.tsx
- [ ] T121 [US8] Implement CSV generation with Papa Parse
- [ ] T122 [US8] Add UTF-8 BOM for Excel compatibility with Chinese characters
- [ ] T123 [US8] Include CSV columns: Date, Type, Category, Amount, Description
- [ ] T124 [US8] Implement "Current Month" export scope
- [ ] T125 [US8] Implement "Custom Range" export scope with date range picker
- [ ] T126 [US8] Implement "All Time" export scope
- [ ] T127 [US8] Generate filename with date range: SimpleBook_YYYY-MM_to_YYYY-MM.csv
- [ ] T128 [US8] Trigger browser download with Blob API
- [ ] T129 [US8] Add DataExport to Settings page
- [ ] T130 [US8] Test CSV export in Excel and Google Sheets

**Checkpoint**: At this point, User Stories 1-8 should all work independently

---

## Phase 11: User Story 9 - Dark Mode Support (Priority: P4)

**Goal**: Implement light/dark theme toggle. Persist theme preference across sessions.

**Independent Test**: Toggle dark mode on, navigate through all pages, close/reopen app, verify theme persists.

### Implementation for User Story 9

- [ ] T131 [P] [US9] Create useTheme custom hook in src/hooks/useTheme.ts wrapping settings store
- [ ] T132 [P] [US9] Create ThemeToggle component in src/components/Settings/ThemeToggle.tsx
- [ ] T133 [US9] Implement theme switching logic: add/remove 'dark' class on document root
- [ ] T134 [US9] Verify all components use Tailwind dark mode classes
- [ ] T135 [US9] Ensure WCAG 2.1 AA contrast in both light and dark modes
- [ ] T136 [US9] Persist theme preference to IndexedDB settings table
- [ ] T137 [US9] Load theme preference on app initialization
- [ ] T138 [US9] Add ThemeToggle to Settings page and header
- [ ] T139 [US9] Test theme consistency across all pages
- [ ] T140 [US9] Test theme persistence across browser sessions

**Checkpoint**: All user stories should now be independently functional

---

## Phase 12: Sample Data & Polish

**Purpose**: Generate sample data, add final touches, cross-cutting improvements

- [ ] T141 [P] Create sample data service in src/services/sampleDataService.ts: generate, clearSampleData
- [ ] T142 [P] Create SampleDataManager component in src/components/Settings/SampleDataManager.tsx
- [ ] T143 Generate 90 sample transactions covering 3 months with realistic patterns
- [ ] T144 Mark sample data with [範例] prefix in description
- [ ] T145 Add "Clear Sample Data" button to settings
- [ ] T146 Generate sample data on first launch (check firstLaunch setting)
- [ ] T147 [P] Create SettingsView component in src/components/Settings/SettingsView.tsx as container
- [ ] T148 [P] Add loading states to all async operations
- [ ] T149 [P] Add error boundaries for graceful error handling
- [ ] T150 [P] Optimize IndexedDB queries with proper indexes
- [ ] T151 [P] Add keyboard shortcuts (e.g., Ctrl+N for new transaction)
- [ ] T152 [P] Improve accessibility: add ARIA labels to all icon buttons
- [ ] T153 [P] Add focus management for modals and forms
- [ ] T154 Optimize bundle size: verify code splitting and lazy loading
- [ ] T155 Run Lighthouse audit: verify performance score > 90
- [ ] T156 Run axe accessibility audit: fix any WCAG violations
- [ ] T157 Test on real devices: iPhone SE (320px), iPad (768px), Desktop (1920px)
- [ ] T158 Cross-browser testing: Chrome, Firefox, Safari, Edge

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-11)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3 → P4)
- **Polish (Phase 12)**: Depends on all desired user stories being complete

### User Story Dependencies

- **US1 (P1 - Quick Recording)**: Can start after Foundational - No dependencies on other stories
- **US2 (P1 - Monthly Overview)**: Can start after Foundational - Integrates with US1 transactions but independently testable
- **US3 (P2 - Category Visualization)**: Can start after Foundational - Uses transactions and categories from US1/US2
- **US4 (P2 - Custom Categories)**: Can start after Foundational - Independent, but enhances US1/US2/US3
- **US5 (P3 - Trends)**: Can start after Foundational - Uses transactions from US1
- **US6 (P3 - Budget Alerts)**: Can start after Foundational - Uses transactions from US1, integrates with US2 dashboard
- **US7 (P3 - Filters)**: Can start after Foundational - Enhances US1 transaction list
- **US8 (P4 - Export)**: Can start after Foundational - Uses transactions from US1
- **US9 (P4 - Dark Mode)**: Can start after Foundational - Cross-cutting, affects all UI components

### Within Each User Story

- **Foundational tasks** marked [P] can run in parallel
- **User story tasks** marked [P] within the same story can run in parallel
- Models/types → services → hooks → components → integration (sequential)
- Story complete before moving to next priority (recommended for clarity)

### Parallel Opportunities

**Setup Phase** (all can run in parallel after T001):
```bash
T002, T003, T004, T009, T010 (dependency installations and configs)
```

**Foundational Phase** (groups that can run in parallel):

Group 1 - Types (after T013):
```bash
T014, T015, T016, T017, T017a (all type definitions)
```

Group 2 - Utils (after T018):
```bash
T020, T021, T022 (utilities)
```

Group 3 - Stores (after T025):
```bash
T026, T027 (stores)
```

Group 4 - Common Components (after T028):
```bash
T029, T030, T031, T032 (common UI components)
T034, T035 (layout components)
```

Group 5 - PWA Setup (after T037):
```bash
T037a (Service Workers and PWA manifest)
```

**User Story 1** (groups that can run in parallel):

Group 1 - Service layer:
```bash
T038, T039 (types and service - if not in Foundational)
```

Group 2 - Form components (after T041):
```bash
T042, T043, T044, T045 (all form components)
```

Group 3 - List components (after T041):
```bash
T046, T047 (list components)
```

**User Story 2**:
```bash
T052, T053 (statistics service and chart helpers)
T055, T056 (dashboard components)
```

**User Story 3**:
```bash
T062, T063 (pie chart service and component)
T065, T066 (chart enhancements)
```

**Similar parallel patterns apply to US4-US9**

---

## Implementation Strategy

### MVP First (User Stories 1 + 2 Only)

**Recommended Approach** for initial delivery:

1. **Complete Phase 1**: Setup (~1-2 hours)
2. **Complete Phase 2**: Foundational (~3-4 hours) - CRITICAL: All stories blocked until this is done
3. **Complete Phase 3**: User Story 1 - Quick Recording (~4-6 hours)
4. **Complete Phase 4**: User Story 2 - Monthly Overview (~2-3 hours)
5. **STOP and VALIDATE**: Test MVP independently
   - Can add transactions
   - Can view monthly totals
   - Data persists across sessions
6. Deploy/demo if ready

**MVP Delivers**:
- ✅ Core value: Track income/expenses
- ✅ Core insight: See monthly financial status
- ✅ ~10-15 hours of development

### Incremental Delivery (Add Features Progressively)

After MVP is validated:

1. **Add User Story 3** (Category Visualization) → Test independently → Deploy/Demo
2. **Add User Story 4** (Custom Categories) → Test independently → Deploy/Demo
3. **Add User Story 5** (Trends) → Test independently → Deploy/Demo
4. **Add User Story 6** (Budget Alerts) → Test independently → Deploy/Demo
5. **Add User Story 7** (Filters) → Test independently → Deploy/Demo
6. **Add User Story 8** (Export) → Test independently → Deploy/Demo
7. **Add User Story 9** (Dark Mode) → Test independently → Deploy/Demo
8. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. **Team completes Setup + Foundational together** (~4-6 hours)
2. **Once Foundational is done**, split team:
   - Developer A: User Story 1 (Quick Recording)
   - Developer B: User Story 2 (Monthly Overview)
   - Developer C: User Story 3 (Category Visualization)
3. Stories complete and integrate independently
4. Continue parallel work on P3 and P4 stories

**Note**: Foundational phase is critical - all developers must wait for this to complete before starting user story work.

---

## Parallel Execution Examples

### Example 1: User Story 1 Components

Launch all form components together (after T041 completes):

```bash
# All these tasks can run in parallel (different files, no dependencies)
- T042 [P] [US1] TransactionForm component
- T043 [P] [US1] QuickAddForm component
- T044 [P] [US1] CategorySelector component
- T045 [P] [US1] DatePicker component
```

### Example 2: Foundational Common Components

Launch all common UI components together (after T028 completes):

```bash
# All these tasks can run in parallel
- T029 [P] Input component
- T030 [P] Modal component
- T031 [P] Toast component
- T032 [P] IconButton component
```

### Example 3: User Story 5 Chart Components

Launch both chart components together (after T084 completes):

```bash
# Both can run in parallel (different files)
- T085 [P] [US5] TrendLineChart component
- T086 [P] [US5] MonthlyComparisonChart component
```

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- All file paths are from repository root (simplebook/)

---

## Task Summary

**Total Tasks**: 160
**Setup**: 12 tasks
**Foundational**: 27 tasks
**User Story 1 (P1)**: 14 tasks
**User Story 2 (P1)**: 10 tasks
**User Story 3 (P2)**: 9 tasks
**User Story 4 (P2)**: 12 tasks
**User Story 5 (P3)**: 11 tasks
**User Story 6 (P3)**: 12 tasks
**User Story 7 (P3)**: 13 tasks
**User Story 8 (P4)**: 12 tasks
**User Story 9 (P4)**: 10 tasks
**Polish**: 18 tasks

**Parallel Opportunities**: 62+ tasks marked [P] can run concurrently

**Minimum Viable Product (MVP)**:
- Phase 1 (Setup) + Phase 2 (Foundational) + Phase 3 (US1) + Phase 4 (US2) = **63 tasks**
- Estimated time: **10-15 hours** for a single developer
- Delivers core transaction tracking and monthly overview

**Full Feature Set**: All 160 tasks
- Estimated time: **40-60 hours** for a single developer
- Estimated time: **20-30 hours** with 3 developers working in parallel
