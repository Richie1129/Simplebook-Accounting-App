/**
 * Settings key enum
 */
export type SettingsKey =
  | 'theme'
  | 'currency'
  | 'defaultExpenseCategory'
  | 'sampleDataLoaded'
  | 'firstLaunch'
  | 'language';

/**
 * Theme preference
 */
export type Theme = 'light' | 'dark';

/**
 * Setting entity (key-value store)
 */
export interface Setting {
  /** Setting key (primary key) */
  key: SettingsKey;

  /** Setting value (JSON serializable) */
  value: any;

  /** Last update timestamp in ISO 8601 format */
  updatedAt: string;
}

/**
 * Typed settings object
 */
export interface UserSettings {
  /** Theme preference: light or dark */
  theme: Theme;

  /** Currency symbol (e.g., 'NT$') */
  currency: string;

  /** Default category ID for quick add expense */
  defaultExpenseCategory: number;

  /** Whether sample data has been loaded */
  sampleDataLoaded: boolean;

  /** First time launching app */
  firstLaunch: boolean;

  /** Language preference (future: 'en', 'zh-TW', 'zh-CN') */
  language: string;
}

/**
 * Settings update input
 */
export interface SettingsUpdateInput {
  key: SettingsKey;
  value: any;
}
