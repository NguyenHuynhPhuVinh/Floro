'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, Monitor, Grid, Users } from 'lucide-react';

import { useSettingsStore } from '../../store/settings.store';

import { CollaborationSettings } from './settings/CollaborationSettings';
import { CanvasSettings } from './settings/CanvasSettings';
import { DisplaySettings } from './settings/DisplaySettings';

interface SettingsCategory {
  id: string;
  titleKey: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  component: React.ComponentType;
}

/**
 * Settings modal component with Vietnamese content and tabbed interface.
 * Provides access to display, canvas, and collaboration settings.
 */
export const SettingsModal: React.FC = () => {
  const { isModalOpen, activeCategory, closeModal, setActiveCategory } =
    useSettingsStore();
  const { t } = useTranslation('settings');

  const settingsCategories: SettingsCategory[] = [
    {
      id: 'display',
      titleKey: 'categories.display',
      icon: Monitor,
      component: DisplaySettings,
    },
    {
      id: 'canvas',
      titleKey: 'categories.canvas',
      icon: Grid,
      component: CanvasSettings,
    },
    {
      id: 'collaboration',
      titleKey: 'categories.collaboration',
      icon: Users,
      component: CollaborationSettings,
    },
  ];

  if (!isModalOpen) {
    return null;
  }

  const activeSettings = settingsCategories.find(
    cat => cat.id === activeCategory
  );
  const ActiveComponent = activeSettings?.component || DisplaySettings;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden transition-colors duration-300">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {t('title')}
          </h2>
          <button
            onClick={closeModal}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label={t('common:close')}
          >
            <X size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="flex h-[500px]">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 dark:bg-gray-700 border-r border-gray-200 dark:border-gray-600">
            <nav className="p-4 space-y-2">
              {settingsCategories.map(category => {
                const Icon = category.icon;
                const isActive = category.id === activeCategory;

                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left
                      transition-colors duration-200
                      ${
                        isActive
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                      }
                    `}
                  >
                    <Icon size={18} />
                    <span className="font-medium">{t(category.titleKey)}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-6 overflow-y-auto bg-white dark:bg-gray-800">
            <ActiveComponent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
