'use client';
import React from 'react';
import { useSettingsStore } from '../../store/settings.store';
import { useMousePosition } from '../../hooks/ui/useMousePosition';
import { useCanvasStore } from '../../store/canvas.store';

/**
 * Coordinate display component that shows mouse and canvas coordinates
 * in a configurable position with Vietnamese labels.
 */
export const CoordinateDisplay: React.FC = () => {
  const { display } = useSettingsStore();
  const mousePosition = useMousePosition();
  const { viewport } = useCanvasStore();

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
      className={`
        fixed ${positionClasses[display.coordinatePosition]}
        bg-black/75 text-white px-3 py-2 rounded-lg
        text-xs font-mono leading-tight
        pointer-events-none select-none
        z-50
      `}
    >
      {display.showCanvasCoords && (
        <div className="mb-1">
          Canvas: {formatCoordinate(viewport.x)}, {formatCoordinate(viewport.y)}
        </div>
      )}
      {display.showMouseCoords && (
        <div>
          Chuột: {formatCoordinate(mousePosition.x)},{' '}
          {formatCoordinate(mousePosition.y)}
        </div>
      )}
    </div>
  );
};

export default CoordinateDisplay;
