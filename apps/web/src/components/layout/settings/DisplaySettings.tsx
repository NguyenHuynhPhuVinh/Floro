'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSettingsStore } from '../../../store/settings.store';
import type {
  CoordinateFormat,
  CoordinatePosition,
} from '../../../store/settings.store';

/**
 * Display settings component for configuring coordinate display options.
 * Includes toggles for coordinate visibility, format, and position.
 */
export const DisplaySettings: React.FC = () => {
  const { display, updateDisplaySettings } = useSettingsStore();
  const { t } = useTranslation('settings');

  const coordinateFormatOptions: { value: CoordinateFormat; label: string }[] =
    [
      { value: 'integer', label: t('display.formats.integer') },
      { value: 'decimal', label: t('display.formats.decimal') },
    ];

  const coordinatePositionOptions: {
    value: CoordinatePosition;
    label: string;
  }[] = [
    { value: 'top-left', label: t('display.positions.topLeft') },
    { value: 'top-right', label: t('display.positions.topRight') },
    { value: 'bottom-left', label: t('display.positions.bottomLeft') },
    { value: 'bottom-right', label: t('display.positions.bottomRight') },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {t('display.title')}
        </h3>

        {/* Show Coordinates Toggle */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('display.showCoordinates')}
            </label>
            <input
              type="checkbox"
              checked={display.showCoordinates}
              onChange={e =>
                updateDisplaySettings({ showCoordinates: e.target.checked })
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
            />
          </div>

          {/* Coordinate Type Options - only show if coordinates are enabled */}
          {display.showCoordinates && (
            <>
              <div className="ml-4 space-y-3 border-l-2 border-gray-200 dark:border-gray-600 pl-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-600 dark:text-gray-400">
                    {t('display.mouseCoordinates')}
                  </label>
                  <input
                    type="checkbox"
                    checked={display.showMouseCoords}
                    onChange={e =>
                      updateDisplaySettings({
                        showMouseCoords: e.target.checked,
                      })
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-600 dark:text-gray-400">
                    {t('display.canvasCoordinates')}
                  </label>
                  <input
                    type="checkbox"
                    checked={display.showCanvasCoords}
                    onChange={e =>
                      updateDisplaySettings({
                        showCanvasCoords: e.target.checked,
                      })
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                  />
                </div>
              </div>

              {/* Coordinate Format */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('display.coordinateFormat')}
                </label>
                <select
                  value={display.coordinateFormat}
                  onChange={e =>
                    updateDisplaySettings({
                      coordinateFormat: e.target.value as CoordinateFormat,
                    })
                  }
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {coordinateFormatOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Coordinate Position */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('display.coordinatePosition')}
                </label>
                <select
                  value={display.coordinatePosition}
                  onChange={e =>
                    updateDisplaySettings({
                      coordinatePosition: e.target.value as CoordinatePosition,
                    })
                  }
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {coordinatePositionOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DisplaySettings;
