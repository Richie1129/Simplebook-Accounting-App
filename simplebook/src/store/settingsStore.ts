import { create } from 'zustand';
import type { Theme, UserSettings } from '../types/settings';

interface SettingsState extends Partial<UserSettings> {
  // Actions
  setTheme: (theme: Theme) => void;
  setCurrency: (currency: string) => void;
  setDefaultExpenseCategory: (categoryId: number) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  // Default settings
  theme: 'light',
  currency: 'NT$',
  defaultExpenseCategory: 5, // Default to 飲食
  sampleDataLoaded: false,
  firstLaunch: true,
  language: 'zh-TW',

  // Actions
  setTheme: (theme) => {
    set({ theme });
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },

  setCurrency: (currency) => set({ currency }),

  setDefaultExpenseCategory: (categoryId) => set({ defaultExpenseCategory: categoryId }),

  updateSettings: (settings) => set(settings),
}));
