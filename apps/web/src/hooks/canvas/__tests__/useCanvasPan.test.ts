import { renderHook, act } from '@testing-library/react';
import Konva from 'konva';

import { useCanvasStore } from '../../../store/canvas.store';

import { useCanvasPan } from '../useCanvasPan';

// Mock the canvas store
jest.mock('../../../store/canvas.store');

const mockUseCanvasStore = useCanvasStore as jest.MockedFunction<
  typeof useCanvasStore
>;

describe('useCanvasPan', () => {
  const mockSetDragging = jest.fn();
  const mockUpdatePosition = jest.fn();

  const mockStoreState = {
    viewport: { x: 0, y: 0, scale: 1, width: 800, height: 600 },
    isDragging: false,
    setDragging: mockSetDragging,
    updatePosition: mockUpdatePosition,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseCanvasStore.mockReturnValue(
      mockStoreState as ReturnType<typeof useCanvasStore>
    );
  });

  it('returns isDragging state and pan handlers', () => {
    const { result } = renderHook(() => useCanvasPan());

    expect(result.current.isDragging).toBe(false);
    expect(result.current.panHandlers).toHaveProperty('onMouseDown');
    expect(result.current.panHandlers).toHaveProperty('onMouseMove');
    expect(result.current.panHandlers).toHaveProperty('onMouseUp');
    expect(result.current.panHandlers).toHaveProperty('onTouchStart');
    expect(result.current.panHandlers).toHaveProperty('onTouchMove');
    expect(result.current.panHandlers).toHaveProperty('onTouchEnd');
  });

  describe('mouse events', () => {
    it('starts dragging on mouse down when clicking on stage', () => {
      const { result } = renderHook(() => useCanvasPan());

      const mockStage = {
        getPointerPosition: jest.fn().mockReturnValue({ x: 100, y: 200 }),
        getStage: jest.fn(),
      };

      // Make target.getStage() return the stage itself (so target === target.getStage())
      mockStage.getStage.mockReturnValue(mockStage);

      const mockEvent = {
        target: mockStage,
      };

      act(() => {
        result.current.panHandlers.onMouseDown(
          mockEvent as unknown as Konva.KonvaEventObject<MouseEvent>
        );
      });

      expect(mockSetDragging).toHaveBeenCalledWith(true);
    });

    it('does not start dragging when clicking on non-stage element', () => {
      const { result } = renderHook(() => useCanvasPan());

      const mockStage = {
        getPointerPosition: jest.fn().mockReturnValue({ x: 100, y: 200 }),
      };

      const mockNonStageTarget = {
        getStage: jest.fn().mockReturnValue(mockStage), // Returns stage but target !== stage
      };

      const mockEvent = {
        target: mockNonStageTarget,
      };

      act(() => {
        result.current.panHandlers.onMouseDown(
          mockEvent as unknown as Konva.KonvaEventObject<MouseEvent>
        );
      });

      expect(mockSetDragging).not.toHaveBeenCalled();
    });

    it('stops dragging on mouse up', () => {
      const { result } = renderHook(() => useCanvasPan());

      act(() => {
        result.current.panHandlers.onMouseUp();
      });

      expect(mockSetDragging).toHaveBeenCalledWith(false);
    });
  });

  describe('touch events', () => {
    it('starts dragging on single touch when touching stage', () => {
      const { result } = renderHook(() => useCanvasPan());

      const mockStage = {
        getPointerPosition: jest.fn().mockReturnValue({ x: 100, y: 200 }),
        getStage: jest.fn(),
      };

      // Make target.getStage() return the stage itself
      mockStage.getStage.mockReturnValue(mockStage);

      const mockEvent = {
        evt: {
          touches: [{ clientX: 100, clientY: 200 }],
        },
        target: mockStage,
      };

      act(() => {
        result.current.panHandlers.onTouchStart(
          mockEvent as unknown as Konva.KonvaEventObject<TouchEvent>
        );
      });

      expect(mockSetDragging).toHaveBeenCalledWith(true);
    });

    it('does not start dragging on multi-touch', () => {
      const { result } = renderHook(() => useCanvasPan());

      const mockEvent = {
        evt: {
          touches: [
            { clientX: 100, clientY: 200 },
            { clientX: 150, clientY: 250 },
          ],
        },
      };

      act(() => {
        result.current.panHandlers.onTouchStart(
          mockEvent as unknown as Konva.KonvaEventObject<TouchEvent>
        );
      });

      expect(mockSetDragging).not.toHaveBeenCalled();
    });

    it('stops dragging on touch end', () => {
      const { result } = renderHook(() => useCanvasPan());

      act(() => {
        result.current.panHandlers.onTouchEnd();
      });

      expect(mockSetDragging).toHaveBeenCalledWith(false);
    });
  });

  describe('pan movement', () => {
    it('updates position during mouse move when dragging', () => {
      const { result } = renderHook(() => useCanvasPan());

      // Create a stage that returns itself when getStage() is called
      const mockStage = {
        getPointerPosition: jest
          .fn()
          .mockReturnValueOnce({ x: 100, y: 200 }) // Initial position for mouse down
          .mockReturnValueOnce({ x: 150, y: 250 }), // New position for mouse move
        getStage: jest.fn(),
      };

      mockStage.getStage.mockReturnValue(mockStage);

      const mockDownEvent = {
        target: mockStage,
      };

      const mockMoveEvent = {
        target: {
          getStage: jest.fn().mockReturnValue(mockStage),
        },
      };

      // First simulate mouse down to start dragging and set initial position
      act(() => {
        result.current.panHandlers.onMouseDown(
          mockDownEvent as unknown as Konva.KonvaEventObject<MouseEvent>
        );
      });

      // Then simulate mouse move
      act(() => {
        result.current.panHandlers.onMouseMove(
          mockMoveEvent as unknown as Konva.KonvaEventObject<MouseEvent>
        );
      });

      // Should update position with delta (50, 50)
      expect(mockUpdatePosition).toHaveBeenCalledWith(50, 50);
    });

    it('does not update position when not dragging', () => {
      const { result } = renderHook(() => useCanvasPan());

      const mockStage = {
        getPointerPosition: jest.fn().mockReturnValue({ x: 150, y: 250 }),
      };

      const mockEvent = {
        target: {
          getStage: jest.fn().mockReturnValue(mockStage),
        },
      };

      act(() => {
        result.current.panHandlers.onMouseMove(
          mockEvent as unknown as Konva.KonvaEventObject<MouseEvent>
        );
      });

      expect(mockUpdatePosition).not.toHaveBeenCalled();
    });
  });
});
