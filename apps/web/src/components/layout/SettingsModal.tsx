'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Monitor, Grid, Users } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

  return (
    <Dialog open={isModalOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
        </DialogHeader>
        <Tabs
          value={activeCategory}
          onValueChange={setActiveCategory}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3">
            {settingsCategories.map(category => {
              const Icon = category.icon;
              return (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="flex items-center gap-2"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {t(category.titleKey)}
                  </span>
                </TabsTrigger>
              );
            })}
          </TabsList>
          {settingsCategories.map(category => {
            const Component = category.component;
            return (
              <TabsContent
                key={category.id}
                value={category.id}
                className="mt-6 max-h-[500px] overflow-y-auto"
              >
                <Component />
              </TabsContent>
            );
          })}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
