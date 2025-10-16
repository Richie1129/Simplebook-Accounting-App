import React, { useEffect, useState } from 'react';
import type { DashboardStats } from '../../types/chart';
import { StatsCard } from './StatsCard';
import { BudgetAlert } from './BudgetAlert';
import { CategoryPieChart } from './CategoryPieChart';
import { TrendLineChart } from './TrendLineChart';
import { MonthlyBarChart } from './MonthlyBarChart';
import { getDashboardStats } from '../../services/statisticsService';

export const DashboardView: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await getDashboardStats();
      setStats(data);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500 dark:text-gray-400">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <p className="text-red-800 dark:text-red-200">Error: {error}</p>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      {/* Budget Alert */}
      {stats.budgetStatus && (
        <BudgetAlert budgetStatus={stats.budgetStatus} />
      )}

      {/* Monthly Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          title="Monthly Income"
          amount={stats.monthlyIncome}
          type="income"
          icon="💵"
        />
        <StatsCard
          title="Monthly Expenses"
          amount={stats.monthlyExpenses}
          type="expense"
          icon="💸"
        />
        <StatsCard
          title="Monthly Balance"
          amount={stats.monthlyBalance}
          type="balance"
          icon="💰"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Expense by Category
          </h3>
          {stats.categoryBreakdown.length > 0 ? (
            <CategoryPieChart data={stats.categoryBreakdown} />
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">
              No expense data available
            </div>
          )}
        </div>

        {/* 7-Day Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            7-Day Trend
          </h3>
          <TrendLineChart data={stats.weeklyTrend} />
        </div>
      </div>

      {/* Monthly Comparison */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          6-Month Comparison
        </h3>
        <MonthlyBarChart data={stats.monthlyComparison} />
      </div>

      {/* Category Details List */}
      {stats.categoryBreakdown.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Expense Details
          </h3>
          <div className="space-y-3">
            {stats.categoryBreakdown.map((category) => (
              <div key={category.categoryId} className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: category.color }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {category.name}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                      {category.percentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${category.percentage}%`,
                        backgroundColor: category.color,
                      }}
                    />
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                  NT$ {category.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
