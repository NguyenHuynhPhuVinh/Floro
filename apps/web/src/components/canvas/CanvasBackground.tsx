'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import { useSettingsStore } from '../../store/settings.store';
import { useCanvasStore } from '../../store/canvas.store';
import { GridBackground } from './GridBackground';
import { DotsBackground } from './DotsBackground';
import type { CanvasBackgroundType } from '../../store/settings.store';

export interface CanvasViewport {
  x: number;
  y: number;
  scale: number;
}

export interface CanvasBackgroundProps {
  type: CanvasBackgroundType;
  size: number;
  color: string;
  opacity: number;
  viewport: CanvasViewport;
  width: number;
  height: number;
}

/**
 * Canvas background component that renders different background patterns
 * based on settings configuration. Supports grid, dots, and lines patterns.
 */
export const CanvasBackground: React.FC = () => {
  const { canvas } = useSettingsStore();
  const { viewport } = useCanvasStore();
  const { theme } = useTheme();

  // Don't render if background is disabled
  if (canvas.backgroundType === 'none') {
    return null;
  }

  // Get canvas dimensions (fallback to viewport if not available)
  const canvasWidth = 2000; // Default canvas width
  const canvasHeight = 2000; // Default canvas height

  // Determine background color based on current theme
  const backgroundColor = theme === 'dark' ? '#4B5563' : '#D1D5DB';

  const backgroundProps: CanvasBackgroundProps = {
    type: canvas.backgroundType,
    size: canvas.backgroundSize,
    color: backgroundColor,
    opacity: canvas.backgroundOpacity,
    viewport,
    width: canvasWidth,
    height: canvasHeight,
  };

  // Background rendering strategies
  const backgroundRenderers = {
    grid: () => <GridBackground {...backgroundProps} />,
    dots: () => <DotsBackground {...backgroundProps} />,
    lines: () => <GridBackground {...backgroundProps} />, // Use grid for lines for now
    none: () => null,
  };

  const BackgroundComponent = backgroundRenderers[canvas.backgroundType];

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      <BackgroundComponent />
    </div>
  );
};

export default CanvasBackground;
