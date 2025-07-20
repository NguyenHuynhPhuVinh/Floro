import { renderHook, act } from '@testing-library/react';
import { useMousePosition } from '../useMousePosition';

// Mock window.addEventListener and removeEventListener
const mockAddEventListener = jest.fn();
const mockRemoveEventListener = jest.fn();

Object.defineProperty(window, 'addEventListener', {
  value: mockAddEventListener,
});

Object.defineProperty(window, 'removeEventListener', {
  value: mockRemoveEventListener,
});

describe('useMousePosition', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default position (0, 0)', () => {
    const { result } = renderHook(() => useMousePosition());
    
    expect(result.current).toEqual({ x: 0, y: 0 });
  });

  it('should add mousemove event listener on mount', () => {
    renderHook(() => useMousePosition());
    
    expect(mockAddEventListener).toHaveBeenCalledWith(
      'mousemove',
      expect.any(Function)
    );
  });

  it('should remove mousemove event listener on unmount', () => {
    const { unmount } = renderHook(() => useMousePosition());
    
    unmount();
    
    expect(mockRemoveEventListener).toHaveBeenCalledWith(
      'mousemove',
      expect.any(Function)
    );
  });

  it('should update position when mouse moves', () => {
    const { result } = renderHook(() => useMousePosition());
    
    // Get the event handler that was registered
    const mouseMoveHandler = mockAddEventListener.mock.calls[0][1];
    
    // Simulate mouse move event
    act(() => {
      mouseMoveHandler({
        clientX: 100,
        clientY: 200,
      });
    });
    
    expect(result.current).toEqual({ x: 100, y: 200 });
  });

  it('should update position multiple times', () => {
    const { result } = renderHook(() => useMousePosition());
    
    const mouseMoveHandler = mockAddEventListener.mock.calls[0][1];
    
    // First move
    act(() => {
      mouseMoveHandler({
        clientX: 50,
        clientY: 75,
      });
    });
    
    expect(result.current).toEqual({ x: 50, y: 75 });
    
    // Second move
    act(() => {
      mouseMoveHandler({
        clientX: 150,
        clientY: 250,
      });
    });
    
    expect(result.current).toEqual({ x: 150, y: 250 });
  });

  it('should handle negative coordinates', () => {
    const { result } = renderHook(() => useMousePosition());
    
    const mouseMoveHandler = mockAddEventListener.mock.calls[0][1];
    
    act(() => {
      mouseMoveHandler({
        clientX: -10,
        clientY: -20,
      });
    });
    
    expect(result.current).toEqual({ x: -10, y: -20 });
  });

  it('should handle zero coordinates', () => {
    const { result } = renderHook(() => useMousePosition());
    
    const mouseMoveHandler = mockAddEventListener.mock.calls[0][1];
    
    act(() => {
      mouseMoveHandler({
        clientX: 0,
        clientY: 0,
      });
    });
    
    expect(result.current).toEqual({ x: 0, y: 0 });
  });

  it('should handle large coordinates', () => {
    const { result } = renderHook(() => useMousePosition());
    
    const mouseMoveHandler = mockAddEventListener.mock.calls[0][1];
    
    act(() => {
      mouseMoveHandler({
        clientX: 9999,
        clientY: 8888,
      });
    });
    
    expect(result.current).toEqual({ x: 9999, y: 8888 });
  });

  it('should use the same event handler reference', () => {
    const { rerender } = renderHook(() => useMousePosition());
    
    const firstHandler = mockAddEventListener.mock.calls[0][1];
    
    // Re-render the hook
    rerender();
    
    // Should not add a new event listener
    expect(mockAddEventListener).toHaveBeenCalledTimes(1);
    
    // Handler should be the same reference
    expect(mockAddEventListener.mock.calls[0][1]).toBe(firstHandler);
  });
});
