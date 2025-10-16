import type { BudgetStatus } from './budget';

/**
 * Pie chart data point (for category breakdown)
 */
export interface PieChartData {
  /** Category name */
  name: string;

  /** Total amount for category */
  value: number;

  /** Percentage of total (0-100) */
  percentage: number;

  /** Category color */
  color: string;

  /** Category ID (for drill-down) */
  categoryId: number;
}

/**
 * Line chart data point (for trends)
 */
export interface LineChartData {
  /** Date label (e.g., 'Oct 16', 'Mon') */
  date: string;

  /** ISO date for sorting */
  isoDate: string;

  /** Income amount for this date */
  income: number;

  /** Expense amount for this date */
  expense: number;

  /** Net (income - expense) */
  net: number;
}

/**
 * Bar chart data point (for monthly comparison)
 */
export interface BarChartData {
  /** Month label (e.g., 'Oct 2025', '10月') */
  month: string;

  /** ISO month-year for sorting (YYYY-MM) */
  monthYear: string;

  /** Total income for month */
  income: number;

  /** Total expense for month */
  expense: number;

  /** Net (income - expense) */
  net: number;
}

/**
 * Dashboard statistics summary
 */
export interface DashboardStats {
  /** Current month income */
  monthlyIncome: number;

  /** Current month expenses */
  monthlyExpenses: number;

  /** Current month balance (income - expenses) */
  monthlyBalance: number;

  /** Category breakdown (pie chart data) */
  categoryBreakdown: PieChartData[];

  /** 7-day trend (line chart data) */
  weeklyTrend: LineChartData[];

  /** 6-month comparison (bar chart data) */
  monthlyComparison: BarChartData[];

  /** Budget status (if budget exists for current month) */
  budgetStatus?: BudgetStatus;
}
