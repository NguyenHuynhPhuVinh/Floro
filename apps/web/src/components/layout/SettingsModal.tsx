'use client';
import React from 'react';
import { X, Monitor, Grid, Users } from 'lucide-react';
import { useSettingsStore } from '../../store/settings.store';
import { DisplaySettings } from './settings/DisplaySettings';
import { CanvasSettings } from './settings/CanvasSettings';
import { CollaborationSettings } from './settings/CollaborationSettings';

interface SettingsCategory {
  id: string;
  title: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  component: React.ComponentType;
}

const settingsCategories: SettingsCategory[] = [
  {
    id: 'display',
    title: 'Hiển thị',
    icon: Monitor,
    component: DisplaySettings,
  },
  {
    id: 'canvas',
    title: 'Canvas',
    icon: Grid,
    component: CanvasSettings,
  },
  {
    id: 'collaboration',
    title: 'Cộng tác',
    icon: Users,
    component: CollaborationSettings,
  },
];

/**
 * Settings modal component with Vietnamese content and tabbed interface.
 * Provides access to display, canvas, and collaboration settings.
 */
export const SettingsModal: React.FC = () => {
  const { isModalOpen, activeCategory, closeModal, setActiveCategory } =
    useSettingsStore();

  if (!isModalOpen) {
    return null;
  }

  const activeSettings = settingsCategories.find(
    cat => cat.id === activeCategory
  );
  const ActiveComponent = activeSettings?.component || DisplaySettings;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Cài đặt</h2>
          <button
            onClick={closeModal}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Đóng"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="flex h-[500px]">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 border-r border-gray-200">
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
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    <Icon size={18} />
                    <span className="font-medium">{category.title}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-6 overflow-y-auto">
            <ActiveComponent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
