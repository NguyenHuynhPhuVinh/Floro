'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { useSettingsStore } from '../../../store/settings.store';
import type { LanguageType } from '../../../store/settings.store';

/**
 * Collaboration settings component for configuring language and team options.
 * Currently focuses on language selection with Vietnamese as default.
 */
export const CollaborationSettings: React.FC = () => {
  const { collaboration, updateCollaborationSettings } = useSettingsStore();
  const { t } = useTranslation('settings');

  const languageOptions: {
    value: LanguageType;
    label: string;
    flag: string;
  }[] = [
    { value: 'vi', label: t('collaboration.languages.vi'), flag: '🇻🇳' },
    { value: 'en', label: t('collaboration.languages.en'), flag: '🇺🇸' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-foreground mb-4">
          {t('collaboration.title')}
        </h3>

        <div className="space-y-4">
          {/* Language Selection */}
          <div>
            <Label className="text-sm font-medium mb-3">
              {t('collaboration.language')}
            </Label>
            <div className="space-y-2">
              {languageOptions.map(option => (
                <label
                  key={option.value}
                  className={cn(
                    'flex items-center p-3 rounded-lg border cursor-pointer transition-colors',
                    collaboration.language === option.value
                      ? 'bg-accent border-primary text-primary'
                      : 'bg-background border-border text-foreground hover:bg-accent/50'
                  )}
                >
                  <input
                    type="radio"
                    name="language"
                    value={option.value}
                    checked={collaboration.language === option.value}
                    onChange={e =>
                      updateCollaborationSettings({
                        language: e.target.value as LanguageType,
                      })
                    }
                    className="sr-only"
                  />
                  <span className="text-xl mr-3">{option.flag}</span>
                  <span className="font-medium">{option.label}</span>
                  {collaboration.language === option.value && (
                    <span className="ml-auto text-primary">✓</span>
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Future collaboration features placeholder */}
          <div className="pt-4 border-t border-border">
            <h4 className="text-sm font-medium text-foreground mb-2">
              {t('collaboration.futureFeatures')}
            </h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center">
                <span className="w-2 h-2 bg-muted rounded-full mr-2"></span>
                {t('collaboration.features.realtimeSharing')}
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-muted rounded-full mr-2"></span>
                {t('collaboration.features.commentsAndNotes')}
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-muted rounded-full mr-2"></span>
                {t('collaboration.features.accessManagement')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborationSettings;
