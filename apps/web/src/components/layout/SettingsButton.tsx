'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Settings } from 'lucide-react';

import { Button } from '@/components/ui/button';
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
  const { t, ready } = useTranslation('common');

  const handleClick = (): void => {
    openModal();
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleClick}
      className={className}
      aria-label={ready ? t('settings') : 'Cài đặt'}
      title={ready ? t('settings') : 'Cài đặt'}
    >
      <Settings className="h-4 w-4" />
    </Button>
  );
};

export default SettingsButton;
