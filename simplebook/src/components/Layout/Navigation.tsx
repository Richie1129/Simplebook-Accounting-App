import React from 'react';

type ActiveView = 'dashboard' | 'transactions' | 'categories' | 'settings';

interface NavigationProps {
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeView, onNavigate }) => {
  const tabs = [
    { id: 'dashboard' as ActiveView, label: '儀表板', icon: '📊' },
    { id: 'transactions' as ActiveView, label: '交易記錄', icon: '💰' },
    { id: 'categories' as ActiveView, label: '類別管理', icon: '🏷️' },
    { id: 'settings' as ActiveView, label: '設定', icon: '⚙️' },
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-4 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-3
                border-b-2 transition-colors
                whitespace-nowrap
                ${
                  activeView === tab.id
                    ? 'border-green-600 text-green-600 dark:text-green-400'
                    : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
                }
              `}
              aria-current={activeView === tab.id ? 'page' : undefined}
            >
              <span>{tab.icon}</span>
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};
