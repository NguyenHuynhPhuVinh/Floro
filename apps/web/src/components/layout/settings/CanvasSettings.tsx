'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

import { useSettingsStore } from '../../../store/settings.store';
import type { CanvasBackgroundType } from '../../../store/settings.store';

import { ThemeToggle } from '../ThemeToggle';

/**
 * Canvas settings component for configuring background, theme, and visual options.
 * Includes background type, size, opacity, and theme selection.
 */
export const CanvasSettings: React.FC = () => {
  const { canvas, updateCanvasSettings } = useSettingsStore();
  const { t } = useTranslation('settings');

  const backgroundTypeOptions: {
    value: CanvasBackgroundType;
    label: string;
  }[] = [
    { value: 'none', label: t('canvas.backgrounds.none') },
    { value: 'grid', label: t('canvas.backgrounds.grid') },
    { value: 'dots', label: t('canvas.backgrounds.dots') },
    { value: 'lines', label: t('canvas.backgrounds.lines') },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          {t('canvas.title')}
        </h3>

        <div className="space-y-4">
          {/* Background Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('canvas.backgroundType')}
            </label>
            <select
              value={canvas.backgroundType}
              onChange={e =>
                updateCanvasSettings({
                  backgroundType: e.target.value as CanvasBackgroundType,
                })
              }
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {backgroundTypeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Background Size - only show if background is not 'none' */}
          {canvas.backgroundType !== 'none' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('canvas.backgroundSize')}: {canvas.backgroundSize}px
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={canvas.backgroundSize}
                  onChange={e =>
                    updateCanvasSettings({
                      backgroundSize: parseInt(e.target.value),
                    })
                  }
                  className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>10px</span>
                  <span>100px</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('canvas.backgroundOpacity')}:{' '}
                  {Math.round(canvas.backgroundOpacity * 100)}%
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={canvas.backgroundOpacity}
                  onChange={e =>
                    updateCanvasSettings({
                      backgroundOpacity: parseFloat(e.target.value),
                    })
                  }
                  className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>10%</span>
                  <span>100%</span>
                </div>
              </div>
            </>
          )}

          {/* Theme Toggle */}
          <div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CanvasSettings;
