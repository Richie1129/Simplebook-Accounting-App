import { createTransaction } from './transactionService';
import type { TransactionInput } from '../types/transaction';
import { subDays, subMonths } from 'date-fns';
import { toISODate } from '../utils/dateHelpers';

/**
 * Generate sample transactions for demonstration
 */
export async function generateSampleData(): Promise<void> {
  const sampleTransactions: TransactionInput[] = [];
  const today = new Date();

  // Generate sample data for last 3 months
  for (let monthOffset = 0; monthOffset < 3; monthOffset++) {
    const monthDate = subMonths(today, monthOffset);

    // Income transactions (2-3 per month)
    for (let i = 0; i < 2; i++) {
      const date = subDays(monthDate, Math.floor(Math.random() * 28));
      sampleTransactions.push({
        type: 'income',
        amount: 40000 + Math.floor(Math.random() * 20000),
        date: toISODate(date),
        categoryId: 1, // 薪水
        description: '月薪',
      });
    }

    // Expense transactions (20-30 per month)
    const expenseCount = 20 + Math.floor(Math.random() * 10);
    for (let i = 0; i < expenseCount; i++) {
      const date = subDays(monthDate, Math.floor(Math.random() * 28));
      const categories = [5, 6, 7, 8, 9, 10, 11, 12]; // Expense categories
      const categoryId = categories[Math.floor(Math.random() * categories.length)];

      let amount = 0;
      let description = '';

      // Different amounts based on category
      switch (categoryId) {
        case 5: // 飲食
          amount = 50 + Math.floor(Math.random() * 300);
          description = ['早餐', '午餐', '晚餐', '咖啡'][Math.floor(Math.random() * 4)];
          break;
        case 6: // 交通
          amount = 20 + Math.floor(Math.random() * 200);
          description = ['公車', '捷運', '計程車', '停車費'][Math.floor(Math.random() * 4)];
          break;
        case 7: // 購物
          amount = 200 + Math.floor(Math.random() * 2000);
          description = ['衣服', '鞋子', '日用品'][Math.floor(Math.random() * 3)];
          break;
        case 8: // 娛樂
          amount = 100 + Math.floor(Math.random() * 1000);
          description = ['電影', '遊戲', '演唱會'][Math.floor(Math.random() * 3)];
          break;
        case 11: // 居住
          amount = 5000 + Math.floor(Math.random() * 10000);
          description = ['房租', '水電費', '網路費'][Math.floor(Math.random() * 3)];
          break;
        default:
          amount = 100 + Math.floor(Math.random() * 500);
          description = '支出';
      }

      sampleTransactions.push({
        type: 'expense',
        amount,
        date: toISODate(date),
        categoryId,
        description,
      });
    }
  }

  // Sort by date (newest first)
  sampleTransactions.sort((a, b) => b.date.localeCompare(a.date));

  // Insert into database
  for (const transaction of sampleTransactions) {
    await createTransaction(transaction);
  }

  console.log(`✅ Generated ${sampleTransactions.length} sample transactions`);
}

/**
 * Check if sample data has been loaded
 */
export async function hasSampleData(): Promise<boolean> {
  const { getAllTransactions } = await import('./transactionService');
  const transactions = await getAllTransactions();
  return transactions.length > 0;
}
