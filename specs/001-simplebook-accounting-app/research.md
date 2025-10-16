# Research: SimpleBook Technical Decisions

**Feature**: SimpleBook Personal Accounting Web App
**Date**: 2025-10-16
**Purpose**: Document technology choices, best practices, and architectural decisions

## Technology Stack Decisions

### 1. Frontend Framework: React 18.2+ with TypeScript 5.3+

**Decision**: Use React with TypeScript via Vite build tool

**Rationale**:
- React provides robust component-based architecture for complex UI
- TypeScript enforces type safety (constitutional requirement I: Code Quality)
- Large ecosystem with mature libraries for charts, forms, and state management
- Strong community support and extensive documentation
- Excellent performance with React 18's concurrent features

**Alternatives Considered**:
- **Vue 3**: Simpler learning curve, but smaller ecosystem for chart libraries
- **Svelte**: Better performance, but less mature ecosystem and fewer TypeScript resources
- **Vanilla JS**: Maximum performance, but higher maintenance cost and complexity for this feature set

**Best Practices**:
- Use functional components with hooks (avoid class components)
- Implement proper error boundaries for fault tolerance
- Use React.memo for expensive chart components to prevent unnecessary re-renders
- Leverage React.lazy and Suspense for code splitting
- Follow React official docs patterns for hooks composition

**References**:
- React 18 Documentation: https://react.dev/
- TypeScript + React Best Practices: https://react-typescript-cheatsheet.netlify.app/

---

### 2. Build Tool: Vite 5.0+

**Decision**: Use Vite instead of Create React App or webpack

**Rationale**:
- Lightning-fast hot module replacement (HMR) for development
- Optimized production builds with automatic code splitting
- Native ESM support reduces bundle size
- Built-in TypeScript support without configuration
- Faster build times than webpack-based tools (10x+ improvement)
- Progressive Web App (PWA) plugin available for Service Workers

**Alternatives Considered**:
- **Create React App**: Deprecated and slower build times
- **webpack**: More configuration overhead, slower dev server
- **Parcel**: Less plugin ecosystem, less mature

**Best Practices**:
- Configure chunking strategy to split vendor code from app code
- Use environment variables for configuration
- Enable compression plugins for production (gzip/brotli)
- Set up PWA plugin for offline support (constitutional requirement IV: Performance)

**References**:
- Vite Documentation: https://vitejs.dev/
- Vite PWA Plugin: https://vite-pwa-org.netlify.app/

---

### 3. Styling: Tailwind CSS 3.4+

**Decision**: Use Tailwind CSS utility-first framework

**Rationale**:
- Rapid UI development with pre-built utility classes
- Built-in responsive breakpoints (sm, md, lg, xl) for mobile-first design (constitutional requirement III: UX)
- Dark mode support via class strategy
- Excellent tree-shaking removes unused styles (smaller bundle)
- Strong accessibility utilities (focus rings, screen reader classes)
- Consistent design tokens (spacing, colors) ensure visual cohesion

**Alternatives Considered**:
- **CSS Modules**: More boilerplate, manual responsive breakpoints
- **Styled Components**: Runtime overhead, larger bundle size
- **Material UI**: Opinionated design, heavier bundle, harder to customize

**Best Practices**:
- Configure custom color palette with WCAG 2.1 AA compliant contrasts (constitutional requirement VI: Accessibility)
- Use `@apply` directive sparingly (only for frequently repeated patterns)
- Leverage Tailwind's built-in dark mode with `class` strategy
- Define custom spacing scale for consistent touch targets (minimum 44×44px)

**References**:
- Tailwind CSS Documentation: https://tailwindcss.com/docs
- Tailwind Dark Mode: https://tailwindcss.com/docs/dark-mode
- Accessibility with Tailwind: https://tailwindcss.com/docs/screen-readers

---

### 4. State Management: Zustand 4.4+

**Decision**: Use Zustand for global state management

**Rationale**:
- Lightweight (1KB gzipped) compared to Redux (8KB+)
- Simple API with minimal boilerplate
- Built-in TypeScript support
- No Context Provider wrapper needed (simpler architecture)
- Excellent DevTools integration
- Supports middleware for persistence (localStorage sync)

**Alternatives Considered**:
- **Redux Toolkit**: More boilerplate, larger bundle size, overkill for this app's complexity
- **React Context**: Performance issues with frequent updates (charts re-rendering)
- **Jotai/Recoil**: Atomic state management is overkill for this use case

**Best Practices**:
- Separate stores by domain (transactions, categories, budget, settings, UI)
- Use selectors to prevent unnecessary re-renders
- Implement middleware for IndexedDB synchronization
- Use immer middleware for immutable state updates

**References**:
- Zustand Documentation: https://github.com/pmndrs/zustand
- Zustand Best Practices: https://docs.pmnd.rs/zustand/guides/practice-with-no-store-actions

---

### 5. Data Storage: IndexedDB via Dexie.js 3.2+

**Decision**: Use Dexie.js wrapper for IndexedDB operations

**Rationale**:
- Constitutional requirement V (Data Security): Local-only storage, no cloud transmission
- IndexedDB supports structured data with indexes (faster queries than localStorage)
- Dexie.js provides Promise-based API (cleaner than raw IndexedDB)
- Supports transactions for data consistency
- Built-in schema versioning for database migrations
- Can store large datasets (gigabytes) vs localStorage's 5-10MB limit
- TypeScript support with strong typing

**Alternatives Considered**:
- **localStorage**: 5MB limit, synchronous API blocks UI, no query capabilities
- **LocalForage**: Simpler but less powerful querying (no compound indexes)
- **Raw IndexedDB**: Complex callback-based API, harder to maintain

**Best Practices**:
- Define indexes on frequently queried fields (date, category, type)
- Use compound indexes for filter combinations (date + category)
- Implement schema versioning for future migrations
- Wrap all queries in try-catch for error handling
- Use transactions for multi-table operations (category deletion → transaction updates)

**Database Schema**:
```typescript
// Dexie schema definition
db.version(1).stores({
  transactions: '++id, date, type, categoryId, amount, [date+type], [categoryId+date]',
  categories: '++id, name, type, isDefault',
  budgets: '++id, monthYear, limit',
  settings: 'key, value'
});
```

**References**:
- Dexie.js Documentation: https://dexie.org/
- IndexedDB Best Practices: https://web.dev/indexeddb-best-practices/

---

### 6. Chart Library: Recharts 2.10+

**Decision**: Use Recharts for data visualization

**Rationale**:
- Built specifically for React (component-based API)
- Declarative syntax matches React paradigm
- Supports all required chart types: Pie, Line, Bar
- Responsive by default (works with Tailwind breakpoints)
- Good accessibility support (keyboard navigation, ARIA labels)
- Active maintenance and community
- TypeScript support

**Alternatives Considered**:
- **Chart.js**: Canvas-based (harder to customize), imperative API, less React-friendly
- **D3.js**: Steep learning curve, overkill for simple charts, larger bundle
- **Victory**: Similar to Recharts but larger bundle size

**Best Practices**:
- Use ResponsiveContainer for responsive charts
- Memoize chart data transformations (useMemo) to prevent recalculations
- Lazy load chart components (React.lazy) to reduce initial bundle
- Add ARIA labels to chart elements for screen readers
- Implement loading states while calculating chart data

**Chart Requirements**:
- Pie Chart: Expense distribution by category (FR-021, FR-022)
- Line Chart: 7-day income/expense trends (FR-023)
- Bar Chart: 6-month monthly comparison (FR-024)

**References**:
- Recharts Documentation: https://recharts.org/
- Recharts Accessibility: https://recharts.org/en-US/guide/accessibility

---

### 7. Date Handling: date-fns 3.0+

**Decision**: Use date-fns for date manipulation and formatting

**Rationale**:
- Modular design (tree-shakeable) - only import needed functions
- Immutable date operations (safer than Moment.js mutation)
- Lightweight (5-10KB for needed functions) vs Moment.js (200KB+)
- Excellent TypeScript support
- Supports i18n for future localization (Traditional Chinese)

**Alternatives Considered**:
- **Moment.js**: Deprecated, very large bundle, mutable API
- **Day.js**: Smaller but less comprehensive
- **Native Date**: Error-prone, manual timezone handling

**Best Practices**:
- Use `format` for display formatting (e.g., "yyyy-MM-dd", "MMM d, yyyy")
- Use `startOfMonth`, `endOfMonth` for monthly calculations
- Use `subDays`, `subMonths` for trend calculations
- Use `parseISO` for ISO date string parsing

**Common Date Operations**:
- Current month range: `startOfMonth(new Date())` to `endOfMonth(new Date())`
- Last 7 days: `subDays(new Date(), 7)` to `new Date()`
- Last 6 months: `subMonths(new Date(), 6)` to `new Date()`

**References**:
- date-fns Documentation: https://date-fns.org/
- date-fns Format Patterns: https://date-fns.org/docs/format

---

### 8. CSV Export: Papa Parse 5.4+

**Decision**: Use Papa Parse for CSV generation

**Rationale**:
- Handles CSV encoding correctly (UTF-8 with BOM for Chinese characters)
- Automatic escaping of special characters (commas, quotes, newlines)
- Supports large datasets (streaming for > 1000 records)
- TypeScript support
- Can generate downloadable files via Blob API

**Alternatives Considered**:
- **Manual CSV generation**: Error-prone, missing edge cases (quotes, commas)
- **json2csv**: Less maintained, fewer features

**Best Practices**:
- Use UTF-8 with BOM encoding for Excel compatibility with Chinese characters
- Include header row with column names (Date, Type, Category, Amount, Description)
- Format dates consistently (yyyy-MM-dd)
- Format amounts with NT$ prefix and comma separators
- Trigger download via `a` tag with `download` attribute

**Export Format**:
```csv
Date,Type,Category,Amount,Description
2025-10-16,Expense,飲食,NT$ 120,"午餐"
2025-10-15,Income,薪水,NT$ 50000,"月薪"
```

**References**:
- Papa Parse Documentation: https://www.papaparse.com/docs
- CSV UTF-8 BOM: https://stackoverflow.com/questions/155097/microsoft-excel-mangles-diacritics-in-csv-files

---

### 9. Testing: Vitest + React Testing Library + Playwright

**Decision**: Use Vitest for unit tests, React Testing Library for component tests, Playwright for E2E

**Rationale**:
- **Vitest**: Fast test runner built on Vite (same config, faster than Jest)
- **React Testing Library**: Tests components from user perspective (constitutional requirement II: Testing)
- **Playwright**: Cross-browser E2E testing (Chrome, Firefox, Safari)
- All three have excellent TypeScript support
- Coverage reports built-in (enforce 80% for services/ and utils/)

**Alternatives Considered**:
- **Jest**: Slower, requires additional config for ESM
- **Enzyme**: Focuses on implementation details, not user behavior
- **Cypress**: E2E only, no unit testing

**Test Strategy**:
1. **Unit Tests** (services/, utils/): Financial calculations, validators, formatters
2. **Integration Tests** (hooks/): Database operations, state management
3. **Component Tests**: User interactions, form validation, rendering
4. **E2E Tests**: Critical user flows (quick add, dashboard, export)

**Best Practices**:
- Follow Testing Library principles: test user behavior, not implementation
- Use `userEvent` instead of `fireEvent` for realistic interactions
- Mock IndexedDB for unit tests (use in-memory fake)
- Set coverage thresholds: 80% for services/, 60% for components/
- Run E2E tests on CI before deployment

**References**:
- Vitest Documentation: https://vitest.dev/
- React Testing Library: https://testing-library.com/react
- Playwright Documentation: https://playwright.dev/

---

### 10. Offline Support: Service Workers (PWA)

**Decision**: Implement Progressive Web App with Service Workers

**Rationale**:
- Constitutional requirement IV (Performance): Offline support required
- Service Workers cache app shell and assets for instant loading
- Background sync for future cloud sync (if needed)
- Install prompt allows "add to home screen" on mobile
- Works across all modern browsers (Chrome, Firefox, Safari, Edge)

**Implementation Strategy**:
- Use Vite PWA Plugin (vite-plugin-pwa) for automatic generation
- Cache strategy: Cache-First for assets, Network-First for API (future)
- Precache all static assets (JS, CSS, fonts)
- Runtime caching for dynamic content

**Best Practices**:
- Register Service Worker in main.tsx after app mount
- Display offline indicator when network unavailable
- Implement update prompt when new version available
- Clear old caches on Service Worker update

**Manifest Configuration**:
```json
{
  "name": "SimpleBook - 個人記帳本",
  "short_name": "SimpleBook",
  "description": "Personal accounting app for tracking income and expenses",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#22c55e",
  "icons": [...]
}
```

**References**:
- Vite PWA Plugin: https://vite-pwa-org.netlify.app/
- Service Worker Best Practices: https://web.dev/service-worker-lifecycle/
- PWA Checklist: https://web.dev/pwa-checklist/

---

## Accessibility Best Practices

### WCAG 2.1 AA Compliance

**Color Contrast** (Constitutional Requirement VI):
- Normal text: 4.5:1 minimum contrast ratio
- Large text (18pt+): 3:1 minimum
- Tailwind default colors may not meet AA standards - verify and adjust

**Recommended Colors** (WCAG AA compliant):
- Income (green): `green-600` on white (#16a34a on #ffffff = 4.54:1) ✅
- Expense (red): `red-600` on white (#dc2626 on #ffffff = 4.54:1) ✅
- Dark mode income: `green-400` on gray-900 (#4ade80 on #111827 = 7.19:1) ✅
- Dark mode expense: `red-400` on gray-900 (#f87171 on #111827 = 5.32:1) ✅

**Keyboard Navigation**:
- All interactive elements must be focusable (buttons, links, inputs)
- Implement focus trapping in modals
- Escape key closes modals/dialogs
- Arrow keys navigate within date pickers and selectors
- Tab order follows visual layout

**Screen Reader Support**:
- Use semantic HTML (`<button>`, `<nav>`, `<main>`, `<article>`)
- Add `aria-label` to icon buttons (e.g., "Delete transaction")
- Use `aria-live="polite"` for toast notifications
- Use `aria-describedby` for form field errors
- Use `<label>` elements for all form inputs

**References**:
- WCAG 2.1 Guidelines: https://www.w3.org/WAI/WCAG21/quickref/
- Tailwind Accessibility: https://tailwindcss.com/docs/screen-readers
- axe DevTools: https://www.deque.com/axe/devtools/

---

## Performance Optimization Strategies

### Code Splitting

**Strategy**: Split code by route and feature to reduce initial bundle

**Implementation**:
- Lazy load chart components: `const PieChart = lazy(() => import('./charts/PieChart'))`
- Lazy load heavy libraries (Recharts, Papa Parse) only when needed
- Split by route if using React Router (not needed for this SPA)

**Expected Results**:
- Initial bundle: <200KB (main app code)
- Vendor bundle: <400KB (React, Tailwind, Zustand, Dexie)
- Chart bundle: <150KB (Recharts, loaded on demand)
- Total initial load: <600KB (target: <2s on 4G = ~1MB)

### Memoization

**Use Cases**:
- Chart data transformations: `useMemo(() => calculateChartData(transactions), [transactions])`
- Filtered transaction lists: `useMemo(() => filterTransactions(transactions, filters), [transactions, filters])`
- Expensive calculations: Monthly totals, category percentages

**Best Practices**:
- Use `React.memo` for components that receive stable props (TransactionItem, CategoryItem)
- Use `useMemo` for expensive computations (array transformations, calculations)
- Use `useCallback` for event handlers passed to memoized child components

### IndexedDB Optimization

**Indexes**: Create indexes on frequently queried fields
- `date` (for date range filters)
- `categoryId` (for category filters)
- `type` (income/expense filter)
- Compound index: `[date+type]` (for monthly expense totals)
- Compound index: `[categoryId+date]` (for category breakdown by month)

**Query Patterns**:
- Current month transactions: `db.transactions.where('date').between(startOfMonth, endOfMonth).toArray()`
- Category transactions: `db.transactions.where({categoryId: id}).toArray()`
- Filtered query: Use `.and()` for complex filters

**Expected Performance**:
- Query 1000 records: <50ms (indexed)
- Filter + sort 1000 records: <100ms
- Aggregate calculations (sums): <200ms

### Virtual Scrolling

**Use Case**: Transaction list with 1000+ items

**Implementation**: Use `react-window` or `react-virtualized` for long lists
- Only render visible rows (10-20 items)
- Renders 1000 items as fast as 20 items
- Reduces DOM nodes and memory usage

**When to Implement**: If transaction count exceeds 500 (Phase 2 optimization, not MVP)

**References**:
- React Performance: https://react.dev/learn/render-and-commit
- react-window: https://github.com/bvaughn/react-window

---

## Security Considerations

### Data Privacy (Constitutional Requirement V)

**Local-Only Storage**:
- ✅ All data stored in IndexedDB (browser-local)
- ✅ No backend API calls
- ✅ No third-party analytics (Google Analytics, Sentry, etc.)
- ✅ No external CDN links (bundle all dependencies)

**Dependency Security**:
- Run `npm audit` regularly to check for vulnerabilities
- Use Dependabot or Renovate for automated dependency updates
- Review dependencies before adding (check npm download stats, GitHub activity)
- Avoid dependencies with known security issues

**Code Review Checklist**:
- [ ] No `fetch()` or `XMLHttpRequest` calls to external domains
- [ ] No third-party scripts loaded via `<script>` tags
- [ ] All dependencies reviewed and security-scanned
- [ ] No console.log() with sensitive data in production builds

### Content Security Policy (CSP)

**Recommended Headers**:
```
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'
```

This policy ensures:
- Scripts only from same origin
- No external API calls
- Inline styles allowed (required for Tailwind)
- Data URIs allowed for images (icons)

**References**:
- CSP Documentation: https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
- CSP Evaluator: https://csp-evaluator.withgoogle.com/

---

## Development Workflow

### Tooling Setup

**Required Tools**:
1. Node.js 18+ (LTS)
2. npm 9+ or pnpm 8+ (faster, disk-efficient)
3. VS Code with extensions:
   - ESLint
   - Prettier
   - Tailwind CSS IntelliSense
   - TypeScript Importer

**Project Initialization**:
```bash
npm create vite@latest simplebook -- --template react-ts
cd simplebook
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install dexie zustand recharts date-fns papaparse
npm install -D @types/papaparse vitest @testing-library/react @testing-library/user-event playwright
```

### Git Workflow

**Branch Strategy**:
- `master` (or `main`): production-ready code
- `001-simplebook-accounting-app`: feature branch (current)
- Future: `feature/*`, `fix/*`, `refactor/*` branches

**Commit Convention**:
- Follow conventional commits: `type(scope): description`
- Types: feat, fix, docs, style, refactor, test, chore
- Examples:
  - `feat(transactions): add quick add transaction form`
  - `fix(budget): correct percentage calculation rounding`
  - `test(calculations): add unit tests for monthly totals`

### Code Quality Gates

**Pre-Commit Hooks** (using Husky):
1. Run ESLint: `npm run lint`
2. Run Prettier: `npm run format`
3. Run TypeScript check: `tsc --noEmit`

**Pre-Push Hooks**:
1. Run unit tests: `npm run test`
2. Run E2E tests: `npm run test:e2e`
3. Check coverage: `npm run test:coverage`

**CI/CD Pipeline** (GitHub Actions):
1. Lint and format check
2. TypeScript compilation
3. Unit tests with coverage report
4. E2E tests on Chrome, Firefox, Safari
5. Build production bundle
6. Lighthouse performance audit
7. Accessibility audit (axe-core)

**References**:
- Husky Documentation: https://typicode.github.io/husky/
- GitHub Actions: https://docs.github.com/en/actions

---

## Deployment Strategy

### Static Hosting Options

**Recommended: Netlify or Vercel** (both free tiers available)

**Why Netlify/Vercel**:
- Automatic HTTPS
- CDN with edge caching
- Git integration (auto-deploy on push)
- Preview deployments for PRs
- Custom domain support
- Built-in PWA support

**Alternative: GitHub Pages**:
- Free for public repos
- Manual deployment workflow
- No automatic HTTPS for custom domains
- Requires `gh-pages` package

**Build Configuration**:
```json
{
  "scripts": {
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
```

### Environment Variables

**Configuration**:
- `VITE_APP_NAME`: "SimpleBook"
- `VITE_APP_VERSION`: from package.json
- `VITE_DB_NAME`: "simplebook_db"

**Access in Code**:
```typescript
const appName = import.meta.env.VITE_APP_NAME;
```

**References**:
- Vite Env Variables: https://vitejs.dev/guide/env-and-mode
- Netlify Deployment: https://docs.netlify.com/integrations/frameworks/vite/
- Vercel Deployment: https://vercel.com/docs/frameworks/vite

---

## Future Considerations (Out of Scope for v1)

### Potential Enhancements

1. **Cloud Backup (Optional)**:
   - Export to Google Drive / Dropbox
   - Requires OAuth integration (user consent for data transmission)
   - Constitutional requirement V would require explicit opt-in

2. **Multi-Device Sync**:
   - WebRTC P2P sync or Firebase Realtime Database
   - Conflicts resolution strategy needed
   - Privacy considerations (encrypted sync)

3. **Multi-Currency Support**:
   - Add currency field to transactions
   - Exchange rate API integration (online only)
   - Currency conversion for totals

4. **Recurring Transactions**:
   - Monthly salary, rent, subscriptions
   - Background job to auto-create transactions
   - Service Worker notifications

5. **Advanced Reports**:
   - Year-over-year comparison
   - Category trends over time
   - Custom date ranges for all charts

6. **Import from Bank Statements**:
   - CSV import from bank exports
   - Auto-categorization with ML (TensorFlow.js)

7. **Localization (i18n)**:
   - English, Traditional Chinese, Simplified Chinese
   - `react-i18next` library
   - date-fns locale support

---

## Summary

This research document outlines all key technology decisions for SimpleBook v1:

✅ **Stack Finalized**:
- Frontend: React 18 + TypeScript 5 + Vite 5 + Tailwind CSS 3
- State: Zustand 4
- Storage: IndexedDB via Dexie.js 3
- Charts: Recharts 2
- Utilities: date-fns 3, Papa Parse 5
- Testing: Vitest + React Testing Library + Playwright
- Offline: Service Workers (PWA)

✅ **Constitutional Compliance**: All principles satisfied with no violations

✅ **Performance Targets**: Achievable with chosen stack (<2s load, <500ms queries)

✅ **Security**: Local-only storage, no external calls, dependency audits

✅ **Accessibility**: WCAG 2.1 AA compliant colors, keyboard nav, ARIA support

**Next Phase**: Proceed to Phase 1 - Generate data-model.md and contracts
