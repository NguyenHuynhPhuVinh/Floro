import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { performanceMonitor } from '../lib/performance/monitor';

// Canvas viewport state interface
interface CanvasViewport {
  x: number;
  y: number;
  scale: number;
  width: number;
  height: number;
}

// Performance metrics interface
interface PerformanceMetrics {
  renderTime: number;
  nodeCount: number;
  visibleNodeCount: number;
  fps: number;
  memoryUsage?: number;
}

interface CanvasState {
  // Viewport state
  viewport: CanvasViewport;

  // Performance metrics
  performance: PerformanceMetrics;

  // Interaction state
  isDragging: boolean;
  isZooming: boolean;

  // Actions
  setViewport: (viewport: Partial<CanvasViewport>) => void;
  updatePosition: (x: number, y: number) => void;
  updateScale: (scale: number) => void;
  setDimensions: (width: number, height: number) => void;
  setDragging: (isDragging: boolean) => void;
  setZooming: (isZooming: boolean) => void;
  updatePerformance: (metrics: Partial<PerformanceMetrics>) => void;
  resetViewport: () => void;

  // Performance monitoring actions
  startPerformanceMonitoring: () => void;
  stopPerformanceMonitoring: () => void;
  updatePerformanceFromMonitor: () => void;
}

const initialViewport: CanvasViewport = {
  x: 0,
  y: 0,
  scale: 1,
  width: 800,
  height: 600,
};

const initialPerformance: PerformanceMetrics = {
  renderTime: 0,
  nodeCount: 0,
  visibleNodeCount: 0,
  fps: 60,
};

export const useCanvasStore = create<CanvasState>()(
  devtools(
    (set, get) => ({
      viewport: initialViewport,
      performance: initialPerformance,
      isDragging: false,
      isZooming: false,

      setViewport: (newViewport: Partial<CanvasViewport>): void =>
        set(state => ({
          viewport: { ...state.viewport, ...newViewport },
        })),

      updatePosition: (x: number, y: number): void =>
        set(state => ({
          viewport: { ...state.viewport, x, y },
        })),

      updateScale: (scale: number): void => {
        // Clamp scale between 0.1 and 5
        const clampedScale = Math.max(0.1, Math.min(5, scale));
        set(state => ({
          viewport: { ...state.viewport, scale: clampedScale },
        }));
      },

      setDimensions: (width: number, height: number): void =>
        set(state => ({
          viewport: { ...state.viewport, width, height },
        })),

      setDragging: (isDragging: boolean): void => set({ isDragging }),

      setZooming: (isZooming: boolean): void => set({ isZooming }),

      updatePerformance: (metrics: Partial<PerformanceMetrics>): void =>
        set(state => ({
          performance: { ...state.performance, ...metrics },
        })),

      resetViewport: (): void =>
        set({
          viewport: {
            ...initialViewport,
            width: get().viewport.width,
            height: get().viewport.height,
          },
        }),

      // Performance monitoring actions
      startPerformanceMonitoring: (): void => {
        performanceMonitor.startFPSMonitoring();
      },

      stopPerformanceMonitoring: (): void => {
        performanceMonitor.stopFPSMonitoring();
      },

      updatePerformanceFromMonitor: (): void => {
        const currentFPS = performanceMonitor.getCurrentFPS();
        const memoryUsage = performanceMonitor.getMemoryUsage();

        set(state => ({
          performance: {
            ...state.performance,
            fps: currentFPS,
            memoryUsage,
          },
        }));
      },
    }),
    {
      name: 'canvas-store',
    }
  )
);
