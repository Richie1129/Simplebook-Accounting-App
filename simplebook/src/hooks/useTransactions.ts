import { useTransactionStore } from '../store/transactionStore';

/**
 * Custom hook for transaction operations
 */
export function useTransactions() {
  const transactions = useTransactionStore((state) => state.transactions);
  const loading = useTransactionStore((state) => state.loading);
  const error = useTransactionStore((state) => state.error);
  const loadTransactions = useTransactionStore((state) => state.loadTransactions);
  const loadCurrentMonth = useTransactionStore((state) => state.loadCurrentMonth);
  const addTransaction = useTransactionStore((state) => state.addTransaction);
  const editTransaction = useTransactionStore((state) => state.editTransaction);
  const removeTransaction = useTransactionStore((state) => state.removeTransaction);
  const refreshTransactions = useTransactionStore((state) => state.refreshTransactions);

  return {
    transactions,
    loading,
    error,
    loadTransactions,
    loadCurrentMonth,
    addTransaction,
    editTransaction,
    removeTransaction,
    refreshTransactions,
  };
}
