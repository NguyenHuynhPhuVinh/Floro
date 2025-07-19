'use client';

import Konva from 'konva';
import { useEffect, useCallback, useRef } from 'react';

import { debounce } from '../../lib/performance/debounce';
import { useCanvasStore } from '../../store/canvas.store';

import { useCanvasPan } from './useCanvasPan';
import { useCanvasZoom } from './useCanvasZoom';

interface CanvasViewport {
  x: number;
  y: number;
  scale: number;
  width: number;
  height: number;
}

interface StageProps {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  onMouseDown: (e: Konva.KonvaEventObject<MouseEvent>) => void;
  onMouseMove: (e: Konva.KonvaEventObject<MouseEvent>) => void;
  onMouseUp: () => void;
  onWheel: (e: Konva.KonvaEventObject<WheelEvent>) => void;
  onTouchStart: (e: Konva.KonvaEventObject<TouchEvent>) => void;
  onTouchMove: (e: Konva.KonvaEventObject<TouchEvent>) => void;
  onTouchEnd: (e: Konva.KonvaEventObject<TouchEvent>) => void;
}

export const useCanvasViewport = (): {
  viewport: CanvasViewport;
  isDragging: boolean;
  isZooming: boolean;
  updateStageDimensions: (width: number, height: number) => void;
  stageProps: StageProps;
} => {
  const {
    viewport,
    setDimensions,
    startPerformanceMonitoring,
    stopPerformanceMonitoring,
    updatePerformanceFromMonitor,
  } = useCanvasStore();
  const { isDragging, panHandlers } = useCanvasPan();
  const { isZooming, zoomHandlers, zoomAtPoint } = useCanvasZoom();

  // Debounced performance update
  const debouncedPerformanceUpdate = useRef(
    debounce(() => {
      updatePerformanceFromMonitor();
    }, 100)
  ).current;

  // Update stage dimensions when viewport changes
  const updateStageDimensions = useCallback(
    (width: number, height: number) => {
      setDimensions(width, height);
    },
    [setDimensions]
  );

  // Start performance monitoring on mount
  useEffect(() => {
    startPerformanceMonitoring();

    // Update performance metrics periodically
    const performanceInterval = setInterval(() => {
      debouncedPerformanceUpdate();
    }, 1000);

    return (): void => {
      stopPerformanceMonitoring();
      clearInterval(performanceInterval);
    };
  }, [
    startPerformanceMonitoring,
    stopPerformanceMonitoring,
    debouncedPerformanceUpdate,
  ]);

  // Combined event handlers that handle both pan and zoom
  const handleMouseDown = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      panHandlers.onMouseDown(e);
    },
    [panHandlers]
  );

  const handleMouseMove = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      panHandlers.onMouseMove(e);
    },
    [panHandlers]
  );

  const handleMouseUp = useCallback(() => {
    panHandlers.onMouseUp();
  }, [panHandlers]);

  const handleWheel = useCallback(
    (e: Konva.KonvaEventObject<WheelEvent>) => {
      zoomHandlers.onWheel(e);
    },
    [zoomHandlers]
  );

  const handleTouchStart = useCallback(
    (e: Konva.KonvaEventObject<TouchEvent>) => {
      if (e.evt.touches.length === 1) {
        panHandlers.onTouchStart(e);
      } else if (e.evt.touches.length === 2) {
        zoomHandlers.onTouchStart(e);
      }
    },
    [panHandlers, zoomHandlers]
  );

  const handleTouchMove = useCallback(
    (e: Konva.KonvaEventObject<TouchEvent>) => {
      if (e.evt.touches.length === 1 && isDragging) {
        panHandlers.onTouchMove(e);
      } else if (e.evt.touches.length === 2 && isZooming) {
        zoomHandlers.onTouchMove(e);
      }
    },
    [panHandlers, zoomHandlers, isDragging, isZooming]
  );

  const handleTouchEnd = useCallback(
    (e: Konva.KonvaEventObject<TouchEvent>) => {
      panHandlers.onTouchEnd();
      zoomHandlers.onTouchEnd(e);
    },
    [panHandlers, zoomHandlers]
  );

  // Keyboard shortcuts for zoom
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case '=':
          case '+':
            e.preventDefault();
            // Zoom in at center
            zoomAtPoint({ x: viewport.width / 2, y: viewport.height / 2 }, 1.1);
            break;
          case '-':
            e.preventDefault();
            // Zoom out at center
            zoomAtPoint({ x: viewport.width / 2, y: viewport.height / 2 }, 0.9);
            break;
          case '0':
            e.preventDefault();
            // Reset zoom
            zoomAtPoint(
              { x: viewport.width / 2, y: viewport.height / 2 },
              1 / viewport.scale
            );
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return (): void => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [viewport.width, viewport.height, viewport.scale, zoomAtPoint]);

  return {
    viewport,
    isDragging,
    isZooming,
    updateStageDimensions,
    stageProps: {
      x: viewport.x,
      y: viewport.y,
      scaleX: viewport.scale,
      scaleY: viewport.scale,
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onWheel: handleWheel,
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
  };
};
