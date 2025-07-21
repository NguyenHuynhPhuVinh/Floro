'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
        <h3 className="text-lg font-medium text-foreground mb-4">
          {t('display.title')}
        </h3>

        {/* Show Coordinates Toggle */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="show-coordinates" className="text-sm font-medium">
              {t('display.showCoordinates')}
            </Label>
            <Checkbox
              id="show-coordinates"
              checked={display.showCoordinates}
              onCheckedChange={checked =>
                updateDisplaySettings({ showCoordinates: !!checked })
              }
            />
          </div>

          {/* Coordinate Type Options - only show if coordinates are enabled */}
          {display.showCoordinates && (
            <>
              <div className="ml-4 space-y-3 border-l-2 border-border pl-4">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="show-mouse-coords"
                    className="text-sm text-muted-foreground"
                  >
                    {t('display.mouseCoordinates')}
                  </Label>
                  <Checkbox
                    id="show-mouse-coords"
                    checked={display.showMouseCoords}
                    onCheckedChange={checked =>
                      updateDisplaySettings({
                        showMouseCoords: !!checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="show-canvas-coords"
                    className="text-sm text-muted-foreground"
                  >
                    {t('display.canvasCoordinates')}
                  </Label>
                  <Checkbox
                    id="show-canvas-coords"
                    checked={display.showCanvasCoords}
                    onCheckedChange={checked =>
                      updateDisplaySettings({
                        showCanvasCoords: !!checked,
                      })
                    }
                  />
                </div>
              </div>

              {/* Coordinate Format */}
              <div>
                <Label className="text-sm font-medium mb-2">
                  {t('display.coordinateFormat')}
                </Label>
                <Select
                  value={display.coordinateFormat}
                  onValueChange={value =>
                    updateDisplaySettings({
                      coordinateFormat: value as CoordinateFormat,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {coordinateFormatOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Coordinate Position */}
              <div>
                <Label className="text-sm font-medium mb-2">
                  {t('display.coordinatePosition')}
                </Label>
                <Select
                  value={display.coordinatePosition}
                  onValueChange={value =>
                    updateDisplaySettings({
                      coordinatePosition: value as CoordinatePosition,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {coordinatePositionOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DisplaySettings;
