'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
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
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          {t('collaboration.title')}
        </h3>

        <div className="space-y-4">
          {/* Language Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {t('collaboration.language')}
            </label>
            <div className="space-y-2">
              {languageOptions.map(option => (
                <label
                  key={option.value}
                  className={`
                    flex items-center p-3 rounded-lg border cursor-pointer transition-colors
                    ${
                      collaboration.language === option.value
                        ? 'bg-blue-50 dark:bg-blue-900 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300'
                        : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                    }
                  `}
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
                    <span className="ml-auto text-blue-600 dark:text-blue-400">
                      ✓
                    </span>
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Future collaboration features placeholder */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('collaboration.futureFeatures')}
            </h4>
            <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <span className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full mr-2"></span>
                {t('collaboration.features.realtimeSharing')}
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full mr-2"></span>
                {t('collaboration.features.commentsAndNotes')}
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full mr-2"></span>
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
