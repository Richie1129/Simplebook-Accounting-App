import React from 'react';
import { useSettingsStore } from '../../store/settingsStore';

export const ThemeToggle: React.FC = () => {
  const theme = useSettingsStore((state) => state.theme);
  const setTheme = useSettingsStore((state) => state.setTheme);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Dark Mode
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Switch between light and dark theme
        </p>
      </div>
      <button
        onClick={toggleTheme}
        className={`
          relative inline-flex h-8 w-14 items-center rounded-full
          transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          ${theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300'}
        `}
        role="switch"
        aria-checked={theme === 'dark'}
      >
        <span
          className={`
            inline-block h-6 w-6 transform rounded-full bg-white transition-transform
            ${theme === 'dark' ? 'translate-x-7' : 'translate-x-1'}
          `}
        />
      </button>
    </div>
  );
};
