import React from 'react';
import { useSettingsStore } from '../../../store/settings.store';
import type { CanvasBackgroundType, ThemeType } from '../../../store/settings.store';

/**
 * Canvas settings component for configuring background, theme, and visual options.
 * Includes background type, size, opacity, and theme selection.
 */
export const CanvasSettings: React.FC = () => {
  const { canvas, updateCanvasSettings } = useSettingsStore();

  const backgroundTypeOptions: { value: CanvasBackgroundType; label: string }[] = [
    { value: 'none', label: 'Không có' },
    { value: 'grid', label: 'Lưới' },
    { value: 'dots', label: 'Chấm' },
    { value: 'lines', label: 'Đường kẻ' },
  ];

  const themeOptions: { value: ThemeType; label: string }[] = [
    { value: 'light', label: 'Sáng' },
    { value: 'dark', label: 'Tối' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Cài đặt Canvas</h3>
        
        <div className="space-y-4">
          {/* Background Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loại nền
            </label>
            <select
              value={canvas.backgroundType}
              onChange={(e) => updateCanvasSettings({ backgroundType: e.target.value as CanvasBackgroundType })}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {backgroundTypeOptions.map((option) => (
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kích thước nền: {canvas.backgroundSize}px
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={canvas.backgroundSize}
                  onChange={(e) => updateCanvasSettings({ backgroundSize: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>10px</span>
                  <span>100px</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Độ trong suốt: {Math.round(canvas.backgroundOpacity * 100)}%
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={canvas.backgroundOpacity}
                  onChange={(e) => updateCanvasSettings({ backgroundOpacity: parseFloat(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>10%</span>
                  <span>100%</span>
                </div>
              </div>
            </>
          )}

          {/* Theme */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Giao diện
            </label>
            <div className="grid grid-cols-2 gap-3">
              {themeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateCanvasSettings({ theme: option.value })}
                  className={`
                    px-4 py-2 rounded-lg border text-sm font-medium transition-colors
                    ${canvas.theme === option.value
                      ? 'bg-blue-100 border-blue-300 text-blue-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CanvasSettings;
