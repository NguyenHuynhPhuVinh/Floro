import React from 'react';
import { useSettingsStore } from '../../../store/settings.store';
import type { LanguageType } from '../../../store/settings.store';

/**
 * Collaboration settings component for configuring language and team options.
 * Currently focuses on language selection with Vietnamese as default.
 */
export const CollaborationSettings: React.FC = () => {
  const { collaboration, updateCollaborationSettings } = useSettingsStore();

  const languageOptions: { value: LanguageType; label: string; flag: string }[] = [
    { value: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
    { value: 'en', label: 'English', flag: '🇺🇸' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Cài đặt cộng tác</h3>
        
        <div className="space-y-4">
          {/* Language Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Ngôn ngữ giao diện
            </label>
            <div className="space-y-2">
              {languageOptions.map((option) => (
                <label
                  key={option.value}
                  className={`
                    flex items-center p-3 rounded-lg border cursor-pointer transition-colors
                    ${collaboration.language === option.value
                      ? 'bg-blue-50 border-blue-300 text-blue-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="language"
                    value={option.value}
                    checked={collaboration.language === option.value}
                    onChange={(e) => updateCollaborationSettings({ language: e.target.value as LanguageType })}
                    className="sr-only"
                  />
                  <span className="text-xl mr-3">{option.flag}</span>
                  <span className="font-medium">{option.label}</span>
                  {collaboration.language === option.value && (
                    <span className="ml-auto text-blue-600">✓</span>
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Future collaboration features placeholder */}
          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Tính năng cộng tác (sắp ra mắt)
            </h4>
            <div className="space-y-2 text-sm text-gray-500">
              <div className="flex items-center">
                <span className="w-2 h-2 bg-gray-300 rounded-full mr-2"></span>
                Chia sẻ canvas theo thời gian thực
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-gray-300 rounded-full mr-2"></span>
                Bình luận và ghi chú
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-gray-300 rounded-full mr-2"></span>
                Quản lý quyền truy cập
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborationSettings;
