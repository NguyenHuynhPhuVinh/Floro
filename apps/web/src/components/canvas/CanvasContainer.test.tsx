import { render, screen } from '@testing-library/react';
import React from 'react';

import { useCanvasViewport } from '../../hooks/canvas/useCanvasViewport';

import { CanvasContainer } from './CanvasContainer';

// Mock Next.js dynamic import with proper component
const mockUpdateStageDimensions = jest.fn();
const mockStageProps = {
  x: 10,
  y: 20,
  scaleX: 1.5,
  scaleY: 1.5,
  onMouseDown: jest.fn(),
  onMouseMove: jest.fn(),
  onMouseUp: jest.fn(),
  onWheel: jest.fn(),
  onTouchStart: jest.fn(),
  onTouchMove: jest.fn(),
  onTouchEnd: jest.fn(),
};

jest.mock('next/dynamic', () => {
  return () => {
    return function MockKonvaCanvas({
      width,
      height,
      stageProps,
    }: {
      width: number;
      height: number;
      stageProps: {
        x: number;
        y: number;
        scaleX: number;
        scaleY: number;
      };
    }): React.JSX.Element {
      return (
        <div
          data-testid="konva-canvas"
          data-width={width}
          data-height={height}
          data-x={stageProps.x}
          data-y={stageProps.y}
          data-scale-x={stageProps.scaleX}
          data-scale-y={stageProps.scaleY}
        >
          Mock Konva Canvas
        </div>
      );
    };
  };
});

jest.mock('../../hooks/canvas/useCanvasViewport');

const mockUseCanvasViewport = useCanvasViewport as jest.MockedFunction<
  typeof useCanvasViewport
>;

// Mock getBoundingClientRect for resize tests
const mockGetBoundingClientRect = jest.fn(() => ({
  width: 1200,
  height: 800,
  top: 0,
  left: 0,
  bottom: 800,
  right: 1200,
  x: 0,
  y: 0,
  toJSON: jest.fn(),
}));

describe('CanvasContainer', () => {
  let originalGetBoundingClientRect: typeof Element.prototype.getBoundingClientRect;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUpdateStageDimensions.mockClear();

    // Setup mock return value
    mockUseCanvasViewport.mockReturnValue({
      viewport: { x: 0, y: 0, scale: 1, width: 800, height: 600 },
      isDragging: false,
      isZooming: false,
      updateStageDimensions: mockUpdateStageDimensions,
      stageProps: mockStageProps,
    });

    originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
    Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;
  });

  afterEach(() => {
    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  });

  it('renders without crashing', () => {
    render(<CanvasContainer />);
    expect(screen.getByTestId('konva-canvas')).toBeInTheDocument();
  });

  it('applies custom className to container', () => {
    const customClass = 'custom-canvas-class';

    render(<CanvasContainer className={customClass} />);

    // The className is now applied to the CanvasDragDropHandler wrapper
    const dragDropContainer =
      screen.getByTestId('konva-canvas').parentElement?.parentElement;
    expect(dragDropContainer).toHaveClass(customClass);
    expect(dragDropContainer).toHaveClass('w-full', 'h-full');
  });

  it('sets default dimensions correctly', () => {
    render(<CanvasContainer />);

    const canvas = screen.getByTestId('konva-canvas');
    expect(canvas).toHaveAttribute('data-width', '800');
    expect(canvas).toHaveAttribute('data-height', '600');
  });

  it('passes stage props from useCanvasViewport hook', () => {
    render(<CanvasContainer />);

    const canvas = screen.getByTestId('konva-canvas');
    expect(canvas).toHaveAttribute('data-x', '10');
    expect(canvas).toHaveAttribute('data-y', '20');
    expect(canvas).toHaveAttribute('data-scale-x', '1.5');
    expect(canvas).toHaveAttribute('data-scale-y', '1.5');
  });

  it('has minimum height style on container', () => {
    render(<CanvasContainer />);

    const container = screen.getByTestId('konva-canvas').parentElement;
    expect(container).toHaveStyle({ minHeight: '400px' });
  });

  it('calls useCanvasViewport hook', () => {
    render(<CanvasContainer />);

    expect(mockUseCanvasViewport).toHaveBeenCalled();
  });

  it('uses memoized stage dimensions', () => {
    const { rerender } = render(<CanvasContainer />);

    // First render
    expect(screen.getByTestId('konva-canvas')).toHaveAttribute(
      'data-width',
      '800'
    );

    // Re-render with same props should use memoized values
    rerender(<CanvasContainer />);
    expect(screen.getByTestId('konva-canvas')).toHaveAttribute(
      'data-width',
      '800'
    );
  });

  it('renders with React.memo optimization', () => {
    // Component should be memoized
    expect(CanvasContainer.$$typeof).toBeDefined(); // React.memo creates this property

    render(<CanvasContainer />);
    expect(screen.getByTestId('konva-canvas')).toBeInTheDocument();
  });

  it('handles empty className prop', () => {
    render(<CanvasContainer className="" />);

    const container = screen.getByTestId('konva-canvas').parentElement;
    expect(container).toHaveClass('w-full', 'h-full');
  });

  it('handles undefined className prop', () => {
    render(<CanvasContainer />);

    const container = screen.getByTestId('konva-canvas').parentElement;
    expect(container).toHaveClass('w-full', 'h-full');
  });

  it('passes all stage props to KonvaCanvas', () => {
    render(<CanvasContainer />);

    const canvas = screen.getByTestId('konva-canvas');

    // Verify all mock stage props are passed through
    Object.entries(mockStageProps).forEach(([key, value]) => {
      if (typeof value === 'number') {
        expect(canvas).toHaveAttribute(
          `data-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`,
          String(value)
        );
      }
    });
  });

  it('calls updateStageDimensions when component mounts', () => {
    render(<CanvasContainer />);

    // updateStageDimensions should be called during useEffect
    expect(mockUpdateStageDimensions).toHaveBeenCalled();
  });

  it('calls useCanvasViewport hook during render', () => {
    render(<CanvasContainer />);
    // Hook should be called at least once (may be called multiple times due to React StrictMode)
    expect(mockUseCanvasViewport).toHaveBeenCalled();

    // Clear and re-render
    mockUseCanvasViewport.mockClear();
    render(<CanvasContainer />);

    // Should be called again for new render
    expect(mockUseCanvasViewport).toHaveBeenCalled();
  });

  it('handles multiple hook calls gracefully', () => {
    // Clear mock before test
    mockUseCanvasViewport.mockClear();

    render(<CanvasContainer className="test" />);

    // Hook may be called multiple times due to:
    // 1. React StrictMode (double invocation in development)
    // 2. useEffect dependencies
    // 3. Component re-renders
    const callCount = mockUseCanvasViewport.mock.calls.length;
    expect(callCount).toBeGreaterThanOrEqual(1);
    expect(callCount).toBeLessThanOrEqual(4); // Reasonable upper bound

    // Verify the hook returns expected values regardless of call count
    expect(mockUseCanvasViewport).toHaveReturnedWith({
      viewport: { x: 0, y: 0, scale: 1, width: 800, height: 600 },
      isDragging: false,
      isZooming: false,
      updateStageDimensions: mockUpdateStageDimensions,
      stageProps: mockStageProps,
    });
  });
});
