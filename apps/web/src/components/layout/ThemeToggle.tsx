'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ThemeToggleProps {
  className?: string;
}

/**
 * Theme toggle component that allows switching between light, dark, and system themes.
 * Uses next-themes for theme management.
 */
export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation('settings');

  const themes = [
    { value: 'light', label: t('canvas.themes.light'), icon: Sun },
    { value: 'dark', label: t('canvas.themes.dark'), icon: Moon },
    { value: 'system', label: t('canvas.themes.system'), icon: Monitor },
  ];

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {t('canvas.theme')}:
      </span>
      <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
        {themes.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => setTheme(value)}
            className={`
              px-3 py-2 text-sm font-medium transition-colors duration-200
              flex items-center space-x-1
              ${
                theme === value
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
              }
            `}
            title={label}
          >
            <Icon size={16} />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeToggle;
