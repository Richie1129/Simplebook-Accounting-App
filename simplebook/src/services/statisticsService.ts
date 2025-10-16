import type { DashboardStats, PieChartData, LineChartData, BarChartData } from '../types/chart';
// import type { BudgetStatus } from '../types/budget';
import {
  getCurrentMonthTransactions,
  getTransactionsByDateRange,
} from './transactionService';
import { getCurrentBudgetStatus } from './budgetService';
import { getAllCategories } from './categoryService';
import { getCurrentMonthYear, getLastNDays, getLastNMonths, formatDate, getMonthName } from '../utils/dateHelpers';
import { calculateByType } from '../utils/calculations';

/**
 * Get complete dashboard statistics
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  // Get current month transactions
  const currentMonthTransactions = await getCurrentMonthTransactions();

  // Calculate monthly totals
  const monthlyIncome = calculateByType(currentMonthTransactions, 'income');
  const monthlyExpenses = calculateByType(currentMonthTransactions, 'expense');
  const monthlyBalance = monthlyIncome - monthlyExpenses;

  // Get category breakdown
  const categoryBreakdown = await getCategoryBreakdown(getCurrentMonthYear());

  // Get 7-day trend
  const weeklyTrend = await getWeeklyTrend();

  // Get 6-month comparison
  const monthlyComparison = await getMonthlyComparison();

  // Get budget status
  const budgetStatus = await getCurrentBudgetStatus();

  return {
    monthlyIncome,
    monthlyExpenses,
    monthlyBalance,
    categoryBreakdown,
    weeklyTrend,
    monthlyComparison,
    budgetStatus: budgetStatus || undefined,
  };
}

/**
 * Calculate monthly totals (income, expense, balance)
 */
export async function getMonthlyTotals(monthYear: string): Promise<{
  income: number;
  expense: number;
  balance: number;
}> {
  const [year, month] = monthYear.split('-');
  const startDate = `${year}-${month}-01`;
  const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
  const endDate = `${year}-${month}-${lastDay.toString().padStart(2, '0')}`;

  const transactions = await getTransactionsByDateRange(startDate, endDate);

  const income = calculateByType(transactions, 'income');
  const expense = calculateByType(transactions, 'expense');
  const balance = income - expense;

  return { income, expense, balance };
}

/**
 * Calculate category breakdown for pie chart
 */
export async function getCategoryBreakdown(monthYear: string): Promise<PieChartData[]> {
  const [year, month] = monthYear.split('-');
  const startDate = `${year}-${month}-01`;
  const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
  const endDate = `${year}-${month}-${lastDay.toString().padStart(2, '0')}`;

  const transactions = await getTransactionsByDateRange(startDate, endDate);
  const expenses = transactions.filter((t) => t.type === 'expense');
  const categories = await getAllCategories();

  // Group by category
  const categoryMap = new Map<number, number>();
  expenses.forEach((transaction) => {
    const current = categoryMap.get(transaction.categoryId) || 0;
    categoryMap.set(transaction.categoryId, current + transaction.amount);
  });

  // Calculate total for percentages
  const total = Array.from(categoryMap.values()).reduce((sum, amount) => sum + amount, 0);

  // Build chart data
  const chartData: PieChartData[] = [];
  categoryMap.forEach((amount, categoryId) => {
    const category = categories.find((c) => c.id === categoryId);
    if (category) {
      chartData.push({
        name: category.name,
        value: amount,
        percentage: total > 0 ? (amount / total) * 100 : 0,
        color: category.color,
        categoryId,
      });
    }
  });

  // Sort by value (highest first)
  return chartData.sort((a, b) => b.value - a.value);
}

/**
 * Calculate 7-day trend for line chart
 */
export async function getWeeklyTrend(): Promise<LineChartData[]> {
  const { start, end } = getLastNDays(7);
  const transactions = await getTransactionsByDateRange(start, end);

  // Group by date
  const dateMap = new Map<string, { income: number; expense: number }>();

  // Initialize all 7 days
  const startDate = new Date(start);
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const isoDate = date.toISOString().split('T')[0];
    dateMap.set(isoDate, { income: 0, expense: 0 });
  }

  // Aggregate transactions
  transactions.forEach((transaction) => {
    const data = dateMap.get(transaction.date);
    if (data) {
      if (transaction.type === 'income') {
        data.income += transaction.amount;
      } else {
        data.expense += transaction.amount;
      }
    }
  });

  // Build chart data
  const chartData: LineChartData[] = [];
  dateMap.forEach((data, isoDate) => {
    chartData.push({
      date: formatDate(isoDate, 'MMM d'),
      isoDate,
      income: data.income,
      expense: data.expense,
      net: data.income - data.expense,
    });
  });

  return chartData;
}

/**
 * Calculate 6-month comparison for bar chart
 */
export async function getMonthlyComparison(): Promise<BarChartData[]> {
  const { start, end } = getLastNMonths(6);
  const transactions = await getTransactionsByDateRange(start, end);

  // Group by month
  const monthMap = new Map<string, { income: number; expense: number }>();

  transactions.forEach((transaction) => {
    const monthYear = transaction.date.substring(0, 7); // YYYY-MM
    const data = monthMap.get(monthYear) || { income: 0, expense: 0 };

    if (transaction.type === 'income') {
      data.income += transaction.amount;
    } else {
      data.expense += transaction.amount;
    }

    monthMap.set(monthYear, data);
  });

  // Build chart data
  const chartData: BarChartData[] = [];
  monthMap.forEach((data, monthYear) => {
    chartData.push({
      month: getMonthName(monthYear),
      monthYear,
      income: data.income,
      expense: data.expense,
      net: data.income - data.expense,
    });
  });

  // Sort by month (oldest first)
  return chartData.sort((a, b) => a.monthYear.localeCompare(b.monthYear));
}

/**
 * Calculate total for date range
 */
export async function getTotalByDateRange(
  start: string,
  end: string,
  type?: 'income' | 'expense'
): Promise<number> {
  const transactions = await getTransactionsByDateRange(start, end);

  if (type) {
    return calculateByType(transactions.filter((t) => t.type === type), type);
  }

  return transactions.reduce((sum, t) => sum + t.amount, 0);
}
