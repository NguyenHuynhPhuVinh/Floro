import { renderHook, act } from '@testing-library/react';

import { useCanvasStore } from './canvas.store';

describe('useCanvasStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useCanvasStore.setState({
      viewport: {
        x: 0,
        y: 0,
        scale: 1,
        width: 800,
        height: 600,
      },
      performance: {
        renderTime: 0,
        nodeCount: 0,
        visibleNodeCount: 0,
        fps: 60,
      },
      isDragging: false,
      isZooming: false,
    });
  });

  describe('initial state', () => {
    it('has correct initial viewport state', () => {
      const { result } = renderHook(() => useCanvasStore());

      expect(result.current.viewport).toEqual({
        x: 0,
        y: 0,
        scale: 1,
        width: 800,
        height: 600,
      });
    });

    it('has correct initial performance state', () => {
      const { result } = renderHook(() => useCanvasStore());

      expect(result.current.performance).toEqual({
        renderTime: 0,
        nodeCount: 0,
        visibleNodeCount: 0,
        fps: 60,
      });
    });

    it('has correct initial interaction state', () => {
      const { result } = renderHook(() => useCanvasStore());

      expect(result.current.isDragging).toBe(false);
      expect(result.current.isZooming).toBe(false);
    });
  });

  describe('viewport actions', () => {
    it('updates viewport with setViewport', () => {
      const { result } = renderHook(() => useCanvasStore());

      act(() => {
        result.current.setViewport({ x: 100, y: 200 });
      });

      expect(result.current.viewport.x).toBe(100);
      expect(result.current.viewport.y).toBe(200);
      expect(result.current.viewport.scale).toBe(1); // unchanged
    });

    it('updates position with updatePosition', () => {
      const { result } = renderHook(() => useCanvasStore());

      act(() => {
        result.current.updatePosition(50, 75);
      });

      expect(result.current.viewport.x).toBe(50);
      expect(result.current.viewport.y).toBe(75);
    });

    it('updates scale with updateScale', () => {
      const { result } = renderHook(() => useCanvasStore());

      act(() => {
        result.current.updateScale(2);
      });

      expect(result.current.viewport.scale).toBe(2);
    });

    it('clamps scale to minimum value', () => {
      const { result } = renderHook(() => useCanvasStore());

      act(() => {
        result.current.updateScale(0.05); // Below minimum
      });

      expect(result.current.viewport.scale).toBe(0.1);
    });

    it('clamps scale to maximum value', () => {
      const { result } = renderHook(() => useCanvasStore());

      act(() => {
        result.current.updateScale(10); // Above maximum
      });

      expect(result.current.viewport.scale).toBe(5);
    });

    it('updates dimensions with setDimensions', () => {
      const { result } = renderHook(() => useCanvasStore());

      act(() => {
        result.current.setDimensions(1200, 800);
      });

      expect(result.current.viewport.width).toBe(1200);
      expect(result.current.viewport.height).toBe(800);
    });

    it('resets viewport with resetViewport', () => {
      const { result } = renderHook(() => useCanvasStore());

      // First modify the viewport
      act(() => {
        result.current.setViewport({ x: 100, y: 200, scale: 2 });
        result.current.setDimensions(1200, 800);
      });

      // Then reset
      act(() => {
        result.current.resetViewport();
      });

      expect(result.current.viewport.x).toBe(0);
      expect(result.current.viewport.y).toBe(0);
      expect(result.current.viewport.scale).toBe(1);
      // Dimensions should be preserved
      expect(result.current.viewport.width).toBe(1200);
      expect(result.current.viewport.height).toBe(800);
    });
  });

  describe('interaction state actions', () => {
    it('updates dragging state', () => {
      const { result } = renderHook(() => useCanvasStore());

      act(() => {
        result.current.setDragging(true);
      });

      expect(result.current.isDragging).toBe(true);

      act(() => {
        result.current.setDragging(false);
      });

      expect(result.current.isDragging).toBe(false);
    });

    it('updates zooming state', () => {
      const { result } = renderHook(() => useCanvasStore());

      act(() => {
        result.current.setZooming(true);
      });

      expect(result.current.isZooming).toBe(true);

      act(() => {
        result.current.setZooming(false);
      });

      expect(result.current.isZooming).toBe(false);
    });
  });

  describe('performance actions', () => {
    it('updates performance metrics', () => {
      const { result } = renderHook(() => useCanvasStore());

      act(() => {
        result.current.updatePerformance({
          renderTime: 16.7,
          nodeCount: 100,
          fps: 58,
        });
      });

      expect(result.current.performance.renderTime).toBe(16.7);
      expect(result.current.performance.nodeCount).toBe(100);
      expect(result.current.performance.fps).toBe(58);
      expect(result.current.performance.visibleNodeCount).toBe(0); // unchanged
    });
  });
});
