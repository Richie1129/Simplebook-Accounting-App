import { create } from 'zustand';
import type { Transaction, TransactionInput, TransactionUpdateInput } from '../types/transaction';
import {
  getAllTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getCurrentMonthTransactions,
} from '../services/transactionService';

interface TransactionState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;

  // Actions
  loadTransactions: () => Promise<void>;
  loadCurrentMonth: () => Promise<void>;
  addTransaction: (input: TransactionInput) => Promise<Transaction>;
  editTransaction: (input: TransactionUpdateInput) => Promise<Transaction>;
  removeTransaction: (id: number) => Promise<void>;
  refreshTransactions: () => Promise<void>;
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],
  loading: false,
  error: null,

  loadTransactions: async () => {
    set({ loading: true, error: null });
    try {
      const transactions = await getAllTransactions();
      set({ transactions, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  loadCurrentMonth: async () => {
    set({ loading: true, error: null });
    try {
      const transactions = await getCurrentMonthTransactions();
      set({ transactions, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  addTransaction: async (input: TransactionInput) => {
    try {
      const newTransaction = await createTransaction(input);
      set((state) => ({
        transactions: [newTransaction, ...state.transactions],
      }));
      return newTransaction;
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },

  editTransaction: async (input: TransactionUpdateInput) => {
    try {
      const updated = await updateTransaction(input);
      set((state) => ({
        transactions: state.transactions.map((t) =>
          t.id === input.id ? updated : t
        ),
      }));
      return updated;
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },

  removeTransaction: async (id: number) => {
    try {
      await deleteTransaction(id);
      set((state) => ({
        transactions: state.transactions.filter((t) => t.id !== id),
      }));
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },

  refreshTransactions: async () => {
    await get().loadTransactions();
  },
}));
