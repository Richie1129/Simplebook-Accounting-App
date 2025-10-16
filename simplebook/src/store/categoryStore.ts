import { create } from 'zustand';
import type { Category, CategoryInput } from '../types/category';
import { getAllCategories, createCategory, updateCategory as updateCategoryService, deleteCategory as deleteCategoryService } from '../services/categoryService';

interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;

  // Actions
  loadCategories: () => Promise<void>;
  addCategory: (category: CategoryInput) => Promise<void>;
  updateCategory: (id: number, updates: CategoryInput) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  categories: [],
  loading: false,
  error: null,

  loadCategories: async () => {
    set({ loading: true, error: null });
    try {
      const categories = await getAllCategories();
      set({ categories, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  addCategory: async (input) => {
    set({ loading: true, error: null });
    try {
      const category = await createCategory(input);
      set((state) => ({
        categories: [...state.categories, category],
        loading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  updateCategory: async (id, input) => {
    set({ loading: true, error: null });
    try {
      await updateCategoryService(id, input);
      const categories = await getAllCategories();
      set({ categories, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  deleteCategory: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteCategoryService(id);
      set((state) => ({
        categories: state.categories.filter((cat) => cat.id !== id),
        loading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },
}));
