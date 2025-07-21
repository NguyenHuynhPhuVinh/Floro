'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

import { cn } from '@/lib/utils';
import { useCanvasStore } from '../../store/canvas.store';
import { useSettingsStore } from '../../store/settings.store';
import { useMousePosition } from '../../hooks/ui/useMousePosition';

/**
 * Coordinate display component that shows mouse and canvas coordinates
 * in a configurable position with Vietnamese labels.
 */
export const CoordinateDisplay: React.FC = () => {
  const { display } = useSettingsStore();
  const mousePosition = useMousePosition();
  const { viewport } = useCanvasStore();
  const { t } = useTranslation('canvas');

  // Don't render if coordinates are disabled
  if (!display.showCoordinates) {
    return null;
  }

  // Position classes mapping
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };

  // Format coordinate based on settings
  const formatCoordinate = (value: number): string => {
    return display.coordinateFormat === 'integer'
      ? Math.round(value).toString()
      : value.toFixed(2);
  };

  return (
    <div
      className={cn(
        'fixed bg-background/90 border text-foreground px-3 py-2 rounded-lg',
        'text-xs font-mono leading-tight',
        'pointer-events-none select-none',
        'z-50 backdrop-blur-sm',
        positionClasses[display.coordinatePosition]
      )}
    >
      {display.showCanvasCoords && (
        <div className="mb-1">
          {t('coordinates.canvas')}: {formatCoordinate(viewport.x)},{' '}
          {formatCoordinate(viewport.y)}
        </div>
      )}
      {display.showMouseCoords && (
        <div>
          {t('coordinates.mouse')}: {formatCoordinate(mousePosition.x)},{' '}
          {formatCoordinate(mousePosition.y)}
        </div>
      )}
    </div>
  );
};

export default CoordinateDisplay;
