import Papa from 'papaparse';
import type { Transaction } from '../types/transaction';
import { formatDate } from '../utils/dateHelpers';
import { formatCurrency } from '../utils/formatters';
import { getCategoryById } from './categoryService';
import { getCurrentMonthTransactions, getAllTransactions } from './transactionService';

export type ExportScope = 'current_month' | 'all_time';

export interface ExportOptions {
  scope: ExportScope;
}

/**
 * Export transactions to CSV file
 */
export async function exportToCSV(options: ExportOptions): Promise<void> {
  let transactions: Transaction[];

  // Get transactions based on scope
  if (options.scope === 'current_month') {
    transactions = await getCurrentMonthTransactions();
  } else {
    transactions = await getAllTransactions();
  }

  // Generate CSV content
  const csvContent = await generateCSV(transactions);

  // Create filename
  const filename = getDefaultFilename(options.scope);

  // Trigger download
  downloadCSV(csvContent, filename);
}

/**
 * Export transactions to CSV string
 */
export async function exportTransactionsToCSV(transactions: Transaction[]): Promise<string> {
  return generateCSV(transactions);
}

/**
 * Generate CSV content from transactions
 */
export async function generateCSV(transactions: Transaction[]): Promise<string> {
  // Prepare data rows
  const rows = await Promise.all(
    transactions.map(async (transaction) => {
      const category = await getCategoryById(transaction.categoryId);

      return {
        Date: transaction.date,
        Type: transaction.type === 'income' ? 'Income' : 'Expense',
        Category: category?.name || 'Unknown',
        Amount: transaction.amount,
        'Amount (Formatted)': formatCurrency(transaction.amount),
        Description: transaction.description || '',
      };
    })
  );

  // Convert to CSV with UTF-8 BOM for Excel compatibility
  const csv = Papa.unparse(rows, {
    header: true,
    columns: ['Date', 'Type', 'Category', 'Amount', 'Amount (Formatted)', 'Description'],
  });

  // Add UTF-8 BOM for Chinese character support in Excel
  return '\uFEFF' + csv;
}

/**
 * Get default filename for export
 */
export function getDefaultFilename(scope: ExportScope): string {
  const date = new Date();
  const timestamp = date.toISOString().split('T')[0];

  if (scope === 'current_month') {
    const monthYear = formatDate(date.toISOString(), 'yyyy-MM');
    return `simplebook-transactions-${monthYear}-${timestamp}.csv`;
  }

  return `simplebook-transactions-all-${timestamp}.csv`;
}

/**
 * Trigger CSV file download in browser
 */
function downloadCSV(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
