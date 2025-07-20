'use client';
import React from 'react';
import { Settings } from 'lucide-react';
import { useSettingsStore } from '../../store/settings.store';
import { useTranslation } from 'react-i18next';

interface SettingsButtonProps {
  className?: string;
}

/**
 * Settings button component with gear icon that opens the settings modal.
 * Uses Lucide React icon and integrates with settings store.
 */
export const SettingsButton: React.FC<SettingsButtonProps> = ({
  className = '',
}) => {
  const { openModal } = useSettingsStore();
  const { t, ready } = useTranslation('common');

  const handleClick = () => {
    openModal();
  };

  return (
    <button
      onClick={handleClick}
      className={`
        p-2 rounded-lg border border-gray-300 dark:border-gray-600
        bg-white dark:bg-gray-700
        hover:bg-gray-50 dark:hover:bg-gray-600
        hover:border-gray-400 dark:hover:border-gray-500
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
        transition-colors duration-200
        ${className}
      `}
      aria-label={ready ? t('settings') : 'Cài đặt'}
      title={ready ? t('settings') : 'Cài đặt'}
    >
      <Settings
        size={20}
        className="text-gray-600 dark:text-gray-200 hover:text-gray-800 dark:hover:text-white"
      />
    </button>
  );
};

export default SettingsButton;
