'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
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
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-foreground mb-4">
          {t('canvas.title')}
        </h3>

        <div className="space-y-4">
          {/* Background Type */}
          <div>
            <Label className="text-sm font-medium mb-2">
              {t('canvas.backgroundType')}
            </Label>
            <Select
              value={canvas.backgroundType}
              onValueChange={value =>
                updateCanvasSettings({
                  backgroundType: value as CanvasBackgroundType,
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {backgroundTypeOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Background Size - only show if background is not 'none' */}
          {canvas.backgroundType !== 'none' && (
            <>
              <div>
                <Label className="text-sm font-medium mb-2">
                  {t('canvas.backgroundSize')}: {canvas.backgroundSize}px
                </Label>
                <Slider
                  value={[canvas.backgroundSize]}
                  onValueChange={([value]) =>
                    updateCanvasSettings({
                      backgroundSize: value,
                    })
                  }
                  min={10}
                  max={100}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>10px</span>
                  <span>100px</span>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2">
                  {t('canvas.backgroundOpacity')}:{' '}
                  {Math.round(canvas.backgroundOpacity * 100)}%
                </Label>
                <Slider
                  value={[canvas.backgroundOpacity]}
                  onValueChange={([value]) =>
                    updateCanvasSettings({
                      backgroundOpacity: value,
                    })
                  }
                  min={0.1}
                  max={1}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
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
