import React from 'react';
import { useSettingsStore } from '../../../store/settings.store';
import { useLocalization } from '../../../hooks/ui/useLocalization';
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
  const { getText } = useLocalization();

  const coordinateFormatOptions: { value: CoordinateFormat; label: string }[] =
    [
      { value: 'integer', label: getText('integer') },
      { value: 'decimal', label: getText('decimal') },
    ];

  const coordinatePositionOptions: {
    value: CoordinatePosition;
    label: string;
  }[] = [
    { value: 'top-left', label: getText('topLeft') },
    { value: 'top-right', label: getText('topRight') },
    { value: 'bottom-left', label: getText('bottomLeft') },
    { value: 'bottom-right', label: getText('bottomRight') },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {getText('display')} {getText('settings')}
        </h3>

        {/* Show Coordinates Toggle */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              {getText('showCoordinates')}
            </label>
            <input
              type="checkbox"
              checked={display.showCoordinates}
              onChange={e =>
                updateDisplaySettings({ showCoordinates: e.target.checked })
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>

          {/* Coordinate Type Options - only show if coordinates are enabled */}
          {display.showCoordinates && (
            <>
              <div className="ml-4 space-y-3 border-l-2 border-gray-200 pl-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-600">Tọa độ chuột</label>
                  <input
                    type="checkbox"
                    checked={display.showMouseCoords}
                    onChange={e =>
                      updateDisplaySettings({
                        showMouseCoords: e.target.checked,
                      })
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-600">Tọa độ canvas</label>
                  <input
                    type="checkbox"
                    checked={display.showCanvasCoords}
                    onChange={e =>
                      updateDisplaySettings({
                        showCanvasCoords: e.target.checked,
                      })
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
              </div>

              {/* Coordinate Format */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Định dạng tọa độ
                </label>
                <select
                  value={display.coordinateFormat}
                  onChange={e =>
                    updateDisplaySettings({
                      coordinateFormat: e.target.value as CoordinateFormat,
                    })
                  }
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vị trí hiển thị
                </label>
                <select
                  value={display.coordinatePosition}
                  onChange={e =>
                    updateDisplaySettings({
                      coordinatePosition: e.target.value as CoordinatePosition,
                    })
                  }
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
