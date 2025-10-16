# Implementation Plan: SimpleBook Personal Accounting Web App

**Branch**: `001-simplebook-accounting-app` | **Date**: 2025-10-16 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-simplebook-accounting-app/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

SimpleBook is a personal accounting web application for tracking income and expenses locally in the browser. Core features include quick transaction recording (3-step flow), category management with customization, monthly budget overview with visual statistics (pie charts, line charts, bar charts), budget alerts, filter/search capabilities, and CSV export. The application prioritizes privacy (local-only storage via IndexedDB), performance (<2s load time, <500ms queries), responsive design (320px-1920px+), and accessibility (keyboard navigation, WCAG 2.1 AA).

**Technical Approach**: Single-page web application built with Vite + React + TypeScript + Tailwind CSS. Data stored locally using IndexedDB (via Dexie.js). State management via Zustand. Charts rendered with Recharts. Offline support via Service Workers. Component-based architecture with clear separation between UI and data logic.

## Technical Context

**Language/Version**: TypeScript 5.3+ with React 18.2+
**Primary Dependencies**:
- Vite 5.0+ (build tool)
- React 18.2+ (UI framework)
- Tailwind CSS 3.4+ (styling)
- Dexie.js 3.2+ (IndexedDB wrapper)
- Zustand 4.4+ (state management)
- Recharts 2.10+ (chart visualization)
- date-fns 3.0+ (date handling)
- Papa Parse 5.4+ (CSV export)

**Storage**: IndexedDB (via Dexie.js) for local browser storage. Three tables: transactions, categories, budgets. No remote database or API.

**Testing**: Vitest (unit tests for calculations and business logic), React Testing Library (component tests), Playwright (E2E tests for critical flows)

**Target Platform**: Modern web browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+) on desktop and mobile. Progressive Web App (PWA) with offline support via Service Workers.

**Project Type**: Single-page web application (SPA)

**Performance Goals**:
- Initial load: <2 seconds on 4G
- Query operations: <500ms for up to 1000 records
- Chart rendering: <1 second
- UI responsiveness: <100ms for user interactions

**Constraints**:
- Offline-capable (Service Workers required)
- No backend server or API calls
- No cloud storage or data transmission
- Support datasets up to 1000 transactions with performance targets
- Responsive design: 320px (mobile) to 1920px+ (desktop)
- WCAG 2.1 AA compliance for accessibility

**Scale/Scope**:
- Single-user application (no multi-user or authentication)
- Typical usage: 50-200 transactions/month
- Optimized for up to 1000 transactions total
- 9 user stories (P1-P4 priorities)
- 64 functional requirements

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Code Quality (NON-NEGOTIABLE) ✅ PASS

**Requirement**: Modern JavaScript/TypeScript best practices, clear naming, concise functions (<50 lines)

**Compliance**:
- ✅ TypeScript 5.3+ enforces type safety
- ✅ ESLint + Prettier configured for modern ES6+ standards
- ✅ Component-based architecture ensures single responsibility
- ✅ Naming conventions: camelCase for variables/functions, PascalCase for components
- ✅ Target: Functions <50 lines (complex calculations may require justification)

**Action**: Configure ESLint with strict rules, Prettier for formatting, and TypeScript strict mode

### II. Testing Standards ✅ PASS

**Requirement**: Critical features have unit tests, 80% coverage for calculations and business logic

**Compliance**:
- ✅ Vitest configured for unit testing
- ✅ Test coverage required for:
  - Financial calculations (totals, percentages, balances)
  - Category management logic
  - Budget threshold calculations
  - Filter and search algorithms
  - CSV export data formatting
- ✅ Target: 80% coverage for services/ and utils/ directories
- ✅ React Testing Library for component behavior testing

**Action**: Set up coverage reports, enforce coverage thresholds in CI

### III. User Experience ✅ PASS

**Requirement**: Responsive design (320px-1024px+), intuitive navigation, <3 step flows

**Compliance**:
- ✅ Tailwind CSS breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- ✅ Mobile-first design approach
- ✅ Touch targets: minimum 44×44px (Tailwind utilities)
- ✅ Transaction creation flow: 3 steps maximum (validated in spec)
- ✅ Visual feedback: loading states, success/error messages via toast notifications

**Action**: Test on real devices (iPhone SE 320px, iPad 768px, desktop 1920px)

### IV. Performance Requirements ✅ PASS

**Requirement**: <2s load time, <500ms queries, offline support

**Compliance**:
- ✅ Vite provides optimized production builds with code splitting
- ✅ IndexedDB queries optimized with Dexie indexes
- ✅ React.memo and useMemo for expensive chart calculations
- ✅ Service Workers configured for offline caching
- ✅ Lazy loading for chart components (React.lazy)
- ✅ Image optimization via Vite plugins

**Action**: Lighthouse audits, performance monitoring, bundle size analysis

### V. Data Security (NON-NEGOTIABLE) ✅ PASS

**Requirement**: Local storage only, no cloud transmission, privacy protection

**Compliance**:
- ✅ All data stored in IndexedDB (browser local storage)
- ✅ No backend API or external network calls
- ✅ No third-party analytics or tracking scripts
- ✅ No PII collection
- ✅ IndexedDB encryption at rest (browser-level, not app-level)
- ✅ Regular dependency audits (npm audit)

**Action**: Code review to verify no network calls, dependency security scanning

### VI. Accessibility ✅ PASS

**Requirement**: Keyboard navigation, ARIA support, WCAG 2.1 AA

**Compliance**:
- ✅ All interactive elements keyboard accessible (Tab, Enter, Escape)
- ✅ ARIA labels on icon buttons and dynamic content
- ✅ ARIA live regions for toast notifications and chart updates
- ✅ Color contrast verification (Tailwind colors adjusted for 4.5:1 ratio)
- ✅ Focus indicators (Tailwind focus: utilities)
- ✅ Semantic HTML (proper heading hierarchy, form labels)

**Action**: Automated accessibility testing (axe-core), manual keyboard testing

### Pre-Phase 0 Gate Evaluation

**Status**: ✅ PASS - All constitution principles satisfied

**Summary**: The chosen technology stack (React + TypeScript + Tailwind + IndexedDB) aligns with all constitutional requirements. No violations or deviations required.

## Project Structure

### Documentation (this feature)

```
specs/001-simplebook-accounting-app/
├── spec.md              # Feature specification (complete)
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (to be generated)
├── data-model.md        # Phase 1 output (to be generated)
├── quickstart.md        # Phase 1 output (to be generated)
├── contracts/           # Phase 1 output (to be generated)
│   └── data-contracts.md
├── checklists/
│   └── requirements.md  # Spec quality checklist (complete)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```
simplebook/
├── public/
│   ├── manifest.json          # PWA manifest
│   └── sw.js                  # Service Worker for offline support
├── src/
│   ├── components/            # React components
│   │   ├── common/           # Shared UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Toast.tsx
│   │   │   └── IconButton.tsx
│   │   ├── Dashboard/        # Dashboard components
│   │   │   ├── DashboardView.tsx
│   │   │   ├── MonthlyOverview.tsx
│   │   │   ├── CategoryPieChart.tsx
│   │   │   ├── TrendLineChart.tsx
│   │   │   ├── MonthlyComparisonChart.tsx
│   │   │   └── BudgetProgress.tsx
│   │   ├── TransactionForm/  # Add/Edit transaction
│   │   │   ├── TransactionForm.tsx
│   │   │   ├── QuickAddForm.tsx
│   │   │   ├── CategorySelector.tsx
│   │   │   └── DatePicker.tsx
│   │   ├── TransactionList/  # Transaction list and filters
│   │   │   ├── TransactionList.tsx
│   │   │   ├── TransactionItem.tsx
│   │   │   ├── FilterPanel.tsx
│   │   │   └── SearchBar.tsx
│   │   ├── Categories/       # Category management
│   │   │   ├── CategoryManager.tsx
│   │   │   ├── CategoryForm.tsx
│   │   │   ├── CategoryList.tsx
│   │   │   └── IconColorPicker.tsx
│   │   ├── Settings/         # Settings and preferences
│   │   │   ├── SettingsView.tsx
│   │   │   ├── ThemeToggle.tsx
│   │   │   ├── BudgetSettings.tsx
│   │   │   ├── DataExport.tsx
│   │   │   └── SampleDataManager.tsx
│   │   └── Layout/           # App layout
│   │       ├── AppLayout.tsx
│   │       ├── Header.tsx
│   │       └── Navigation.tsx
│   ├── hooks/                # Custom React hooks
│   │   ├── useTransactions.ts   # Transaction CRUD operations
│   │   ├── useCategories.ts     # Category CRUD operations
│   │   ├── useBudget.ts         # Budget management
│   │   ├── useStatistics.ts     # Chart calculations
│   │   ├── useFilters.ts        # Filter/search logic
│   │   └── useTheme.ts          # Theme management
│   ├── services/             # Database and business logic
│   │   ├── db.ts                # Dexie database setup
│   │   ├── transactionService.ts  # Transaction operations
│   │   ├── categoryService.ts     # Category operations
│   │   ├── budgetService.ts       # Budget operations
│   │   ├── settingsService.ts     # Settings persistence
│   │   ├── exportService.ts       # CSV export logic
│   │   └── sampleDataService.ts   # Sample data generation
│   ├── utils/                # Utility functions
│   │   ├── calculations.ts      # Financial calculations
│   │   ├── dateHelpers.ts       # Date formatting and manipulation
│   │   ├── validators.ts        # Input validation
│   │   ├── formatters.ts        # Number/currency formatting
│   │   └── chartHelpers.ts      # Chart data transformation
│   ├── types/                # TypeScript type definitions
│   │   ├── transaction.ts       # Transaction types
│   │   ├── category.ts          # Category types
│   │   ├── budget.ts            # Budget types
│   │   ├── settings.ts          # Settings types
│   │   └── chart.ts             # Chart data types
│   ├── store/                # Zustand state management
│   │   ├── transactionStore.ts  # Transaction state
│   │   ├── categoryStore.ts     # Category state
│   │   ├── budgetStore.ts       # Budget state
│   │   ├── settingsStore.ts     # Settings state
│   │   └── uiStore.ts           # UI state (modals, toasts)
│   ├── styles/               # Global styles
│   │   └── globals.css          # Tailwind imports and custom styles
│   ├── App.tsx               # Root component
│   ├── main.tsx              # React entry point
│   └── vite-env.d.ts         # Vite type declarations
├── tests/
│   ├── unit/                 # Unit tests
│   │   ├── services/         # Service layer tests
│   │   ├── utils/            # Utility function tests
│   │   └── calculations/     # Financial calculation tests
│   ├── integration/          # Integration tests
│   │   ├── transaction-flow.test.tsx
│   │   ├── category-management.test.tsx
│   │   └── budget-alerts.test.tsx
│   └── e2e/                  # End-to-end tests (Playwright)
│       ├── quick-add.spec.ts
│       ├── dashboard.spec.ts
│       └── export.spec.ts
├── .eslintrc.json            # ESLint configuration
├── .prettierrc               # Prettier configuration
├── tsconfig.json             # TypeScript configuration
├── vite.config.ts            # Vite build configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── vitest.config.ts          # Vitest test configuration
├── playwright.config.ts      # Playwright E2E configuration
├── package.json              # Dependencies and scripts
└── README.md                 # Setup and usage instructions
```

**Structure Decision**: Single-page web application structure selected because this is a frontend-only project with no backend server. The src/ directory organizes code by technical concerns (components, hooks, services, utils) which is appropriate for a React application of this scale. The services/ layer abstracts IndexedDB operations from React components, maintaining separation of concerns. Testing directory mirrors src/ structure for easy test discovery.

## Complexity Tracking

*This section is empty because there are no constitutional violations requiring justification.*

All chosen technologies and architectural patterns align with constitutional principles:
- TypeScript + ESLint ensures code quality
- Vitest + 80% coverage target ensures testing standards
- Tailwind CSS + responsive design ensures UX requirements
- Vite + Service Workers ensure performance and offline support
- IndexedDB (local-only) ensures data security
- ARIA labels + semantic HTML ensure accessibility

No deviations or complexity exceptions required.

---

## Post-Design Constitution Re-Check

*Conducted after Phase 1 design completion (data model, contracts, quickstart)*

### Design Artifacts Review

**Artifacts Generated**:
- ✅ [research.md](research.md) - Technology decisions and best practices
- ✅ [data-model.md](data-model.md) - Database schema with 4 entities, validation rules
- ✅ [contracts/data-contracts.md](contracts/data-contracts.md) - TypeScript interfaces, service contracts
- ✅ [quickstart.md](quickstart.md) - Developer onboarding guide

### Constitution Compliance Verification

#### I. Code Quality ✅ MAINTAINED

**Design Decisions**:
- TypeScript interfaces defined with strict types (contracts/data-contracts.md)
- Service interfaces enforce clear contracts
- Utility functions documented with JSDoc
- Validation schemas ensure data integrity

**Verification**: Data model and contracts enforce type safety. Service layer separates business logic from UI. All functions will be concise and well-typed.

#### II. Testing Standards ✅ MAINTAINED

**Design Decisions**:
- Comprehensive validation schemas for all inputs (validateTransaction, validateCategory, validateBudget)
- Service interfaces designed for testability (dependency injection ready)
- Clear calculation functions in utils/ for unit testing
- Test structure defined: unit/ integration/ e2e/

**Verification**: Data model includes edge cases. Validation logic is isolated and testable. 80% coverage achievable for services/ and utils/.

#### III. User Experience ✅ MAINTAINED

**Design Decisions**:
- QuickAddInput interface supports 1-step transaction creation
- TransactionFilters interface enables powerful search without complexity
- Error types provide user-friendly messages
- Dashboard statistics aggregated for fast rendering

**Verification**: Data contracts support <3 step flows. Filter/search designed for responsiveness. Chart data structures optimized for Recharts rendering.

#### IV. Performance Requirements ✅ MAINTAINED

**Design Decisions**:
- IndexedDB indexes on frequently queried fields (date, type, categoryId)
- Compound indexes for common filter combinations [date+type], [categoryId+date]
- Memoization hooks planned (useStatistics, useFilters)
- Service layer caches calculations
- Lazy loading planned for chart components

**Verification**: Database schema optimized for queries <500ms on 1000 records. Research confirms Dexie + indexes meet performance targets. Service Workers architecture planned in research.md.

#### V. Data Security ✅ MAINTAINED

**Design Decisions**:
- No service interfaces include network calls
- All data stored in IndexedDB (local-only)
- No PII fields in data model
- CSV export uses browser download (no server transmission)
- Dependencies vetted in research.md (no analytics libraries)

**Verification**: Data model exclusively uses IndexedDB. No external API contracts defined. Export service uses Blob API (client-side only). Research confirms no third-party tracking.

#### VI. Accessibility ✅ MAINTAINED

**Design Decisions**:
- Color palette verified WCAG 2.1 AA in research.md (CategoryColors)
- Error types provide structured messages for screen readers
- Service interfaces return user-friendly error messages
- Chart data includes labels and descriptions

**Verification**: Research confirms WCAG AA color contrasts. quickstart.md includes accessibility checklist. Component structure supports ARIA labels and keyboard navigation.

### Post-Design Gate Evaluation

**Status**: ✅ PASS - All constitution principles maintained through design phase

**Summary**:
- Data model design enforces local-only storage (constitutional requirement V)
- Service contracts enable comprehensive testing (constitutional requirement II)
- Validation schemas ensure code quality (constitutional requirement I)
- Performance optimizations built into schema design (constitutional requirement IV)
- Error handling supports accessibility (constitutional requirement VI)
- User-facing APIs designed for simplicity (constitutional requirement III)

**No new violations introduced during design phase.**

**Ready for Phase 2**: Proceed to `/speckit.tasks` to generate implementation tasks based on completed design artifacts.
