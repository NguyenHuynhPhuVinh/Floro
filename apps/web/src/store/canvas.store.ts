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
    (set: any, get: any) => ({
      viewport: initialViewport,
      performance: initialPerformance,
      isDragging: false,
      isZooming: false,

      setViewport: (newViewport: Partial<CanvasViewport>) =>
        set((state: any) => ({
          viewport: { ...state.viewport, ...newViewport },
        })),

      updatePosition: (x: number, y: number) =>
        set((state: any) => ({
          viewport: { ...state.viewport, x, y },
        })),

      updateScale: (scale: number) => {
        // Clamp scale between 0.1 and 5
        const clampedScale = Math.max(0.1, Math.min(5, scale));
        set((state: any) => ({
          viewport: { ...state.viewport, scale: clampedScale },
        }));
      },

      setDimensions: (width: number, height: number) =>
        set((state: any) => ({
          viewport: { ...state.viewport, width, height },
        })),

      setDragging: (isDragging: boolean) => set({ isDragging }),

      setZooming: (isZooming: boolean) => set({ isZooming }),

      updatePerformance: (metrics: Partial<PerformanceMetrics>) =>
        set((state: any) => ({
          performance: { ...state.performance, ...metrics },
        })),

      resetViewport: () =>
        set({
          viewport: {
            ...initialViewport,
            width: get().viewport.width,
            height: get().viewport.height,
          },
        }),

      // Performance monitoring actions
      startPerformanceMonitoring: () => {
        performanceMonitor.startFPSMonitoring();
      },

      stopPerformanceMonitoring: () => {
        performanceMonitor.stopFPSMonitoring();
      },

      updatePerformanceFromMonitor: () => {
        const currentFPS = performanceMonitor.getCurrentFPS();
        const memoryUsage = performanceMonitor.getMemoryUsage();

        set((state: any) => ({
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
