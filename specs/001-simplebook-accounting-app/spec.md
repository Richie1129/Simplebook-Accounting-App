# Feature Specification: SimpleBook Personal Accounting Web App

**Feature Branch**: `001-simplebook-accounting-app`
**Created**: 2025-10-16
**Status**: Draft
**Input**: User description: "開發一個個人記帳本 Web 應用程式，名為「SimpleBook」"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Quick Expense Recording (Priority: P1)

As a user, I want to quickly record daily expenses within 3 steps so I can maintain my accounting habit without friction.

**Why this priority**: This is the core value proposition - effortless expense tracking. Without quick recording, users will abandon the app. This is the MVP foundation.

**Independent Test**: Can be fully tested by opening the app, adding an expense with amount and category, and verifying it appears in the transaction list. Delivers immediate value - users can track spending.

**Acceptance Scenarios**:

1. **Given** I open the app on my phone, **When** I tap "Add Transaction", select "Expense", enter amount "120", select category "飲食" (Food), and tap "Save", **Then** the transaction is saved with today's date and appears in my transaction list
2. **Given** I want to record an expense quickly, **When** I use the "Quick Add" feature with just amount "50", **Then** the system uses default category "其他支出" (Other Expense) and today's date
3. **Given** I have recorded a transaction, **When** I review my transaction list, **Then** I see the amount, category with icon/color, date, and optional description
4. **Given** I made a mistake in recording, **When** I tap on a transaction and select "Edit", modify the amount, and save, **Then** the transaction is updated with new values
5. **Given** I recorded a duplicate transaction, **When** I tap on it and select "Delete" and confirm, **Then** the transaction is removed from my list

---

### User Story 2 - Monthly Budget Overview (Priority: P1)

As a user, I want to see my monthly income, expenses, and balance at a glance so I understand my current financial status.

**Why this priority**: Financial awareness is the primary goal. Users need immediate feedback on their spending patterns to make informed decisions. This complements P1 by showing the "why" behind tracking.

**Independent Test**: Can be tested by viewing the dashboard which displays current month totals (income, expense, balance) calculated from existing transactions. Works independently with or without other features.

**Acceptance Scenarios**:

1. **Given** I have recorded income and expenses this month, **When** I view the dashboard, **Then** I see total income (in green), total expenses (in red), and current balance (income minus expenses)
2. **Given** the current month is October, **When** I view the dashboard, **Then** I see calculations for October 1-31 only
3. **Given** I add a new transaction, **When** I return to the dashboard, **Then** the totals update automatically to reflect the new transaction
4. **Given** I have no transactions this month, **When** I view the dashboard, **Then** I see "0" for income, expenses, and balance

---

### User Story 3 - Expense Category Visualization (Priority: P2)

As a user, I want to see how my spending is distributed across categories so I can identify where my money goes.

**Why this priority**: Category insights help users discover spending patterns and make adjustments. This is the first analytical feature that drives behavior change.

**Independent Test**: Can be tested by viewing a pie chart showing expense breakdown by category for the current month. Each category slice shows percentage and amount.

**Acceptance Scenarios**:

1. **Given** I have expenses in multiple categories this month, **When** I view the "Category Analysis" section, **Then** I see a pie chart with each category as a colored slice showing percentage and total amount
2. **Given** I spent NT$3000 on food and NT$1000 on transport (total NT$4000), **When** I view the pie chart, **Then** food shows 75% and transport shows 25%
3. **Given** I tap on a category slice, **When** the detail view opens, **Then** I see all transactions for that category
4. **Given** I have only income and no expenses, **When** I view category analysis, **Then** I see a message "No expense data for this month"

---

### User Story 4 - Custom Categories (Priority: P2)

As a user, I want to create my own spending categories so the app matches my personal budgeting style.

**Why this priority**: Personalization increases adoption and accuracy. While default categories work for most users, custom categories make the app truly useful for individual needs.

**Independent Test**: Can be tested by creating a new category (name, icon, color), using it in a transaction, and seeing it appear in all category lists.

**Acceptance Scenarios**:

1. **Given** I want to track pet expenses, **When** I go to "Manage Categories", tap "Add Category", enter name "寵物" (Pets), choose an icon and color, and save, **Then** the new category appears in my category list
2. **Given** I have created a custom category, **When** I add a new transaction, **Then** I can select my custom category from the category picker
3. **Given** I have a custom category with no transactions, **When** I select it and tap "Delete", **Then** the category is removed
4. **Given** I have a custom category with existing transactions, **When** I try to delete it, **Then** I see a warning "This category has X transactions. Delete anyway?" and must confirm
5. **Given** I have a category "娛樂" (Entertainment), **When** I edit it to rename it to "休閒" (Leisure) and change its color, **Then** all existing transactions update to show the new name and color

---

### User Story 5 - Income and Expense Trends (Priority: P3)

As a user, I want to see my spending and income trends over time so I can track my financial progress.

**Why this priority**: Trend analysis provides long-term insights and motivation. Less critical than current month overview, but valuable for sustained engagement.

**Independent Test**: Can be tested by viewing a line chart showing daily income/expense totals for the past 7 days and a bar chart comparing monthly totals.

**Acceptance Scenarios**:

1. **Given** I have transactions over the past 7 days, **When** I view the "Trends" section, **Then** I see a line chart with two lines (income in green, expenses in red) showing daily totals
2. **Given** I view the monthly comparison chart, **When** I look at the bar chart, **Then** I see bars for the past 6 months showing total income and expense for each month
3. **Given** I tap on a data point in the trend chart, **When** the detail view opens, **Then** I see all transactions for that day/month
4. **Given** I have insufficient data (less than 2 days of transactions), **When** I view trends, **Then** I see a message "Add more transactions to see trends"

---

### User Story 6 - Monthly Budget Alerts (Priority: P3)

As a user, I want to set a monthly spending limit and receive warnings when I'm approaching it so I can avoid overspending.

**Why this priority**: Budget enforcement helps users develop financial discipline. Lower priority because basic tracking (P1) and awareness (P1-P2) must exist first.

**Independent Test**: Can be tested by setting a budget limit (e.g., NT$10,000), adding expenses until reaching 80% and 100% thresholds, and verifying warning messages appear.

**Acceptance Scenarios**:

1. **Given** I want to control spending, **When** I go to "Budget Settings" and set a monthly limit of NT$15,000, **Then** the budget is saved and a progress bar appears on the dashboard
2. **Given** my budget is NT$15,000 and I've spent NT$12,000 (80%), **When** I view the dashboard, **Then** I see a yellow warning "You've used 80% of your budget"
3. **Given** my budget is NT$15,000 and I've spent NT$15,500 (103%), **When** I view the dashboard, **Then** I see a red alert "You've exceeded your budget by NT$500"
4. **Given** I add a new expense that pushes me over 80%, **When** the transaction is saved, **Then** I immediately see a notification "Budget alert: 85% used"
5. **Given** I want to adjust my budget, **When** I edit the monthly limit to NT$20,000, **Then** the progress bar and warnings update based on the new limit

---

### User Story 7 - Filter and Search Transactions (Priority: P3)

As a user, I want to filter and search my past transactions so I can find specific records or analyze specific periods.

**Why this priority**: Search and filter are power-user features that become valuable as transaction volume grows. Not essential for MVP but important for long-term usability.

**Independent Test**: Can be tested by applying filters (date range, category, type) and seeing the transaction list update to show only matching records.

**Acceptance Scenarios**:

1. **Given** I want to review last week's spending, **When** I open filters and select date range "2025-10-01 to 2025-10-07", **Then** only transactions within that range are displayed
2. **Given** I want to see all food expenses, **When** I apply category filter "飲食" (Food), **Then** only food-related transactions appear
3. **Given** I want to review all income, **When** I apply type filter "Income", **Then** only income transactions are shown
4. **Given** I remember a transaction with description "birthday dinner", **When** I type "birthday" in the search box, **Then** matching transactions appear
5. **Given** I have applied multiple filters, **When** I tap "Clear All Filters", **Then** all transactions are displayed again

---

### User Story 8 - Export Data (Priority: P4)

As a user, I want to export my financial records to a CSV file so I can use them in spreadsheet software or back them up.

**Why this priority**: Data portability is important for power users and data backup, but not essential for core functionality. Lower priority than all analytical features.

**Independent Test**: Can be tested by clicking "Export", selecting a date range, and verifying a CSV file is downloaded with all transaction data in proper format.

**Acceptance Scenarios**:

1. **Given** I want to export all my data, **When** I go to "Export Data", select "All Time", and click "Export to CSV", **Then** a CSV file is downloaded containing all my transactions
2. **Given** I want to export just this month, **When** I select "Current Month" and export, **Then** the CSV contains only transactions from the current month
3. **Given** I want custom range data, **When** I select "Custom Range", choose dates "2025-07-01 to 2025-09-30", and export, **Then** the CSV contains transactions from those 3 months
4. **Given** the exported CSV file, **When** I open it in spreadsheet software, **Then** I see columns for Date, Type (Income/Expense), Category, Amount, Description

---

### User Story 9 - Dark Mode Support (Priority: P4)

As a user, I want to switch between light and dark themes so I can use the app comfortably in different lighting conditions.

**Why this priority**: Theme preference enhances comfort but doesn't affect core functionality. Nice-to-have feature for better user experience.

**Independent Test**: Can be tested by toggling the theme switcher and verifying all screens update to use dark color palette while maintaining readability.

**Acceptance Scenarios**:

1. **Given** I prefer dark mode, **When** I open settings and toggle "Dark Mode" on, **Then** the entire app switches to a dark color scheme with light text
2. **Given** dark mode is enabled, **When** I navigate through all sections (dashboard, transactions, charts), **Then** all screens use the dark theme consistently
3. **Given** I switch back to light mode, **When** I toggle "Dark Mode" off, **Then** the app returns to the light color scheme
4. **Given** I have set a theme preference, **When** I close and reopen the app, **Then** my theme preference is remembered

---

### Edge Cases

- What happens when a user tries to enter a negative amount?
  - System should prevent negative amounts or show validation error "Amount must be positive"

- What happens when a user tries to add a transaction with amount = 0?
  - System should show validation error "Amount must be greater than 0"

- What happens when a user tries to delete a category that is used in many transactions?
  - System should warn "This category has X transactions. Deleting will set them to 'Uncategorized'. Continue?" and require confirmation

- What happens when exported CSV file name conflicts with existing file?
  - Browser's default download behavior handles this (adds number suffix or prompts)

- What happens when a user sets a very large amount (e.g., 999,999,999)?
  - System should handle up to 1 billion (NT$999,999,999) and display with proper formatting (commas)

- What happens when a user's local storage is full?
  - System should detect storage quota errors and show warning "Storage is full. Please export and delete old data or clear browser data."

- What happens when a user has transactions spanning multiple years?
  - Monthly comparison chart shows last 12 months; export allows selecting specific year ranges

- What happens when a user tries to set a budget below current month's spending?
  - System allows it but immediately shows "Budget exceeded" warning with current overage amount

- What happens when a user creates a category name that's too long?
  - System should limit category names to 20 characters and show character count while typing

- What happens when sample data conflicts with user's real data?
  - Sample data is clearly marked as "Example" and user can delete all sample data with one button "Clear Sample Data"

## Requirements *(mandatory)*

### Functional Requirements

**Transaction Management**

- **FR-001**: Users MUST be able to create a new transaction record with type (income/expense), amount, date, category, and optional description
- **FR-002**: Users MUST be able to edit any field of an existing transaction
- **FR-003**: Users MUST be able to delete a transaction with confirmation prompt
- **FR-004**: System MUST provide a "Quick Add" feature that creates a transaction with only amount input, using default category and current date
- **FR-005**: Transaction list MUST display all transactions in reverse chronological order (newest first)
- **FR-006**: Each transaction MUST display its date, category with icon/color, amount (with income/expense color coding), and description (if present)
- **FR-007**: System MUST validate that amount is a positive number greater than 0
- **FR-008**: System MUST validate that required fields (type, amount, date, category) are provided before saving

**Category System**

- **FR-009**: System MUST provide pre-defined categories for income: Salary (薪水), Bonus (獎金), Investment Returns (投資收益), Other Income (其他收入)
- **FR-010**: System MUST provide pre-defined categories for expenses: Food (飲食), Transportation (交通), Shopping (購物), Entertainment (娛樂), Medical (醫療), Education (教育), Housing (居住), Other Expense (其他支出)
- **FR-011**: Each category MUST have a name, associated icon, and color
- **FR-012**: Users MUST be able to create custom categories with name, icon, and color selection
- **FR-013**: Users MUST be able to edit existing custom categories (name, icon, color)
- **FR-014**: Users MUST be able to delete custom categories
- **FR-015**: System MUST warn users before deleting a category that has associated transactions and show transaction count
- **FR-016**: When a category with transactions is deleted, system MUST reassign those transactions to a default "Uncategorized" category
- **FR-017**: System MUST prevent deletion of pre-defined default categories

**Dashboard and Statistics**

- **FR-018**: Dashboard MUST display current month's total income with green color indication
- **FR-019**: Dashboard MUST display current month's total expenses with red color indication
- **FR-020**: Dashboard MUST display current month's balance (income minus expenses)
- **FR-021**: Dashboard MUST display a pie chart showing expense distribution by category with percentages and amounts
- **FR-022**: Each pie chart slice MUST be color-coded according to its category color
- **FR-023**: Dashboard MUST display a line chart showing daily income and expense totals for the past 7 days
- **FR-024**: Dashboard MUST display a bar chart comparing monthly income and expense totals for the past 6 months
- **FR-025**: All statistics MUST update automatically when transactions are added, edited, or deleted
- **FR-026**: System MUST display appropriate message when insufficient data exists for a chart (e.g., "Add more transactions to see trends")

**Budget Management**

- **FR-027**: Users MUST be able to set a monthly spending limit (budget)
- **FR-028**: Dashboard MUST display a progress bar showing current spending as percentage of budget
- **FR-029**: System MUST display a warning when spending reaches 80% of budget
- **FR-030**: System MUST display an alert when spending exceeds 100% of budget, showing overage amount
- **FR-031**: Users MUST be able to edit or remove their monthly budget limit
- **FR-032**: Budget warnings MUST update immediately when new expense transactions are added

**Filter and Search**

- **FR-033**: Users MUST be able to filter transactions by date range (start date and end date)
- **FR-034**: Users MUST be able to filter transactions by category (single or multiple categories)
- **FR-035**: Users MUST be able to filter transactions by type (income, expense, or both)
- **FR-036**: Users MUST be able to search transactions by description text (case-insensitive partial match)
- **FR-037**: Users MUST be able to apply multiple filters simultaneously (filters are cumulative)
- **FR-038**: Users MUST be able to clear all active filters with one action
- **FR-039**: Filter and search results MUST update the transaction list in real-time

**Data Export**

- **FR-040**: Users MUST be able to export transactions to CSV file format
- **FR-041**: Export MUST support three scope options: Current Month, Custom Date Range, All Time
- **FR-042**: CSV file MUST include columns: Date, Type (Income/Expense), Category, Amount, Description
- **FR-043**: CSV file MUST use proper formatting (UTF-8 encoding with BOM for Chinese characters, comma-separated values)
- **FR-044**: Exported file name MUST include date range (e.g., "SimpleBook_2025-01_to_2025-03.csv")

**User Interface and Experience**

- **FR-045**: Application MUST support responsive design for screen widths from 320px (mobile) to 1920px+ (desktop)
- **FR-046**: Application MUST use green color scheme for income-related elements and red for expense-related elements
- **FR-047**: Application MUST provide light and dark theme options
- **FR-048**: Theme preference MUST persist across browser sessions
- **FR-049**: Touch targets on mobile MUST be minimum 44x44 pixels for usability
- **FR-050**: Transaction creation flow MUST complete in maximum 3 steps
- **FR-051**: Application MUST provide visual feedback for all user actions (loading states, success messages, error messages)
- **FR-052**: Forms MUST show inline validation errors for invalid inputs

**Data Storage and Sample Data**

- **FR-053**: All user data MUST be stored locally in the browser (using localStorage or IndexedDB)
- **FR-054**: System MUST NOT transmit any financial data to remote servers
- **FR-055**: On first use, system MUST create sample transaction data covering the past 3 months
- **FR-056**: Sample data MUST be clearly marked as "Example" or similar indicator
- **FR-057**: Users MUST be able to delete all sample data with a single action "Clear Sample Data"
- **FR-058**: System MUST persist all user data (transactions, categories, settings) across browser sessions

**Accessibility and Performance**

- **FR-059**: All interactive elements MUST be keyboard accessible (Tab, Enter, Escape navigation)
- **FR-060**: Icon buttons MUST have ARIA labels for screen reader support
- **FR-061**: Form fields MUST have proper label associations
- **FR-062**: Color contrast MUST meet WCAG 2.1 AA standards (minimum 4.5:1 for normal text)
- **FR-063**: Initial page load MUST complete in under 2 seconds on 4G connection
- **FR-064**: Data query operations (filter, search, chart calculation) MUST complete within 500ms for datasets up to 1000 records

### Key Entities

- **Transaction**: Represents a single financial record (income or expense). Contains: unique ID, type (income/expense), amount (positive number), date, category reference, description (optional text), timestamp of creation/modification.

- **Category**: Represents a spending or income classification. Contains: unique ID, name (text, max 20 chars), type (income/expense), icon identifier, color code (hex), is_default flag (true for pre-defined categories, false for custom).

- **Budget**: Represents monthly spending limit. Contains: month/year reference, limit amount, creation date. Only one budget per month.

- **Settings**: Represents user preferences. Contains: theme preference (light/dark), default currency symbol (NT$), first-day-of-week preference, sample data status (present/cleared).

**Entity Relationships**:
- Each Transaction belongs to one Category
- Each Category can have multiple Transactions
- Each Budget is associated with one specific month
- Settings is a singleton (one record per user/browser)

## Success Criteria *(mandatory)*

### Measurable Outcomes

**Usability and User Experience**

- **SC-001**: Users can create a new transaction in 3 taps or fewer on mobile devices
- **SC-002**: 90% of users successfully add their first transaction within 1 minute of opening the app
- **SC-003**: Transaction list loads and displays within 500ms for up to 1000 records
- **SC-004**: Users can complete the full transaction creation flow (open form → fill fields → save) in under 30 seconds

**Performance and Responsiveness**

- **SC-005**: Initial app load completes in under 2 seconds on 4G mobile connection
- **SC-006**: Dashboard with all charts renders within 1 second after navigation
- **SC-007**: Filter and search operations return results within 500ms for datasets up to 1000 transactions
- **SC-008**: Application remains responsive (UI updates within 100ms) during all user interactions

**Feature Adoption and Value**

- **SC-009**: Users add an average of 3 or more transactions per day during first week of use
- **SC-010**: 80% of users view the dashboard within first 5 minutes of using the app
- **SC-011**: Users successfully identify their top spending category within 2 minutes of viewing category breakdown chart
- **SC-012**: 70% of users set a monthly budget within their first week of use

**Data Accuracy and Reliability**

- **SC-013**: All financial calculations (totals, percentages, balances) are accurate to 2 decimal places
- **SC-014**: 100% of user data persists correctly across browser sessions (no data loss)
- **SC-015**: Export functionality generates valid CSV files that open correctly in Microsoft Excel and Google Sheets
- **SC-016**: Chart calculations accurately reflect transaction data with 0% calculation errors

**Accessibility and Device Support**

- **SC-017**: Application functions correctly on screen sizes from 320px to 1920px+ width
- **SC-018**: 100% of core features are accessible via keyboard navigation alone
- **SC-019**: Color contrast passes WCAG 2.1 AA validation for all text elements
- **SC-020**: Dark mode provides comfortable viewing in low-light conditions (user testing confirms reduced eye strain)

**User Retention and Engagement**

- **SC-021**: Users return to the app at least 3 times per week during the first month
- **SC-022**: Average session duration is 2-5 minutes (sufficient for recording transactions and reviewing status)
- **SC-023**: Users maintain consistent transaction recording for at least 30 consecutive days (habit formation)
- **SC-024**: 60% of users export their data at least once within first 3 months (data ownership and backup)

## Assumptions

This specification makes the following assumptions that informed the requirements:

1. **Target Audience**: Users are individuals who want to track personal finances and have basic smartphone/computer literacy. Primary use case is Taiwan market (NT$ currency).

2. **Browser Environment**: Users access the app through modern web browsers (Chrome, Firefox, Safari, Edge) with localStorage/IndexedDB support. Minimum browser versions: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+.

3. **Data Volume**: Typical users will have 50-200 transactions per month (1,500-2,400 per year). System is optimized for up to 1,000 transactions with performance targets; larger datasets may experience slower performance.

4. **Currency**: Default currency is NT$ (New Taiwan Dollar). Single-currency support only (no multi-currency conversion).

5. **Date Handling**: All dates use user's local timezone. No timezone conversion needed.

6. **Language**: Primary language is Traditional Chinese (繁體中文) with potential for English fallback. UI text and category names are in Chinese.

7. **Privacy Expectations**: Users expect complete data privacy with no cloud storage or data transmission. This is a core value proposition.

8. **Sample Data Purpose**: Three months of sample data helps new users understand the app's value immediately without empty states. Sample data mimics realistic spending patterns.

9. **Budget Scope**: Budget management is monthly only (no weekly, yearly, or category-specific budgets in this version).

10. **Chart Timeframes**:
    - 7-day trend: Captures weekly patterns without overwhelming users
    - 6-month comparison: Balances historical insight with visual clarity
    - These timeframes are based on common personal finance analysis practices

11. **Export Format**: CSV is chosen for universal compatibility with spreadsheet software and easy backup/migration.

12. **Icon and Color System**: Category icons and colors are predefined to ensure visual consistency and quick recognition. Custom categories allow user selection from a predefined icon/color palette.

13. **No Authentication**: Single-user, local-only model means no user accounts, login, or multi-device sync. Each browser installation is independent.

14. **Transaction Editing**: Full edit capability (including date, type, category) is provided. No audit trail or history of changes in this version.

15. **Deletion Confirmation**: Confirmations are shown for destructive actions (delete transaction, delete category with transactions) to prevent accidental data loss.
