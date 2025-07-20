'use client';
import React from 'react';
import { Settings } from 'lucide-react';
import { useSettingsStore } from '../../store/settings.store';

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

  const handleClick = () => {
    openModal();
  };

  return (
    <button
      onClick={handleClick}
      className={`
        p-2 rounded-lg border border-gray-300 bg-white
        hover:bg-gray-50 hover:border-gray-400
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
        transition-colors duration-200
        ${className}
      `}
      aria-label="Cài đặt"
      title="Cài đặt"
    >
      <Settings size={20} className="text-gray-600 hover:text-gray-800" />
    </button>
  );
};

export default SettingsButton;
