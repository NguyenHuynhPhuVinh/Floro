import React from 'react';
import { render, screen } from '@testing-library/react';
import { CoordinateDisplay } from '../CoordinateDisplay';

// Mock the settings store
const mockDisplaySettings = {
  showCoordinates: true,
  showMouseCoords: true,
  showCanvasCoords: true,
  coordinateFormat: 'integer' as const,
  coordinatePosition: 'bottom-left' as const,
};

jest.mock('../../../store/settings.store', () => ({
  useSettingsStore: () => ({
    display: mockDisplaySettings,
  }),
}));

// Mock the mouse position hook
const mockMousePosition = { x: 150, y: 200 };
jest.mock('../../../hooks/ui/useMousePosition', () => ({
  useMousePosition: () => mockMousePosition,
}));

// Mock the canvas store
const mockViewport = { x: 100, y: 50, scale: 1 };
jest.mock('../../../store/canvas.store', () => ({
  useCanvasStore: () => ({
    viewport: mockViewport,
  }),
}));

describe('CoordinateDisplay', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders coordinates when enabled', () => {
    render(<CoordinateDisplay />);
    
    expect(screen.getByText(/Canvas: 100, 50/)).toBeInTheDocument();
    expect(screen.getByText(/Chuột: 150, 200/)).toBeInTheDocument();
  });

  it('does not render when coordinates are disabled', () => {
    jest.doMock('../../../store/settings.store', () => ({
      useSettingsStore: () => ({
        display: { ...mockDisplaySettings, showCoordinates: false },
      }),
    }));

    const { container } = render(<CoordinateDisplay />);
    expect(container.firstChild).toBeNull();
  });

  it('shows only mouse coordinates when canvas coordinates are disabled', () => {
    jest.doMock('../../../store/settings.store', () => ({
      useSettingsStore: () => ({
        display: { ...mockDisplaySettings, showCanvasCoords: false },
      }),
    }));

    render(<CoordinateDisplay />);
    
    expect(screen.getByText(/Chuột: 150, 200/)).toBeInTheDocument();
    expect(screen.queryByText(/Canvas:/)).not.toBeInTheDocument();
  });

  it('shows only canvas coordinates when mouse coordinates are disabled', () => {
    jest.doMock('../../../store/settings.store', () => ({
      useSettingsStore: () => ({
        display: { ...mockDisplaySettings, showMouseCoords: false },
      }),
    }));

    render(<CoordinateDisplay />);
    
    expect(screen.getByText(/Canvas: 100, 50/)).toBeInTheDocument();
    expect(screen.queryByText(/Chuột:/)).not.toBeInTheDocument();
  });

  it('formats coordinates as integers when format is integer', () => {
    render(<CoordinateDisplay />);
    
    // Should show rounded values
    expect(screen.getByText(/Canvas: 100, 50/)).toBeInTheDocument();
    expect(screen.getByText(/Chuột: 150, 200/)).toBeInTheDocument();
  });

  it('formats coordinates as decimals when format is decimal', () => {
    jest.doMock('../../../store/settings.store', () => ({
      useSettingsStore: () => ({
        display: { ...mockDisplaySettings, coordinateFormat: 'decimal' },
      }),
    }));

    render(<CoordinateDisplay />);
    
    // Should show decimal values (mocked values are integers, so .00)
    expect(screen.getByText(/Canvas: 100.00, 50.00/)).toBeInTheDocument();
    expect(screen.getByText(/Chuột: 150.00, 200.00/)).toBeInTheDocument();
  });

  it('applies correct position classes', () => {
    const { container } = render(<CoordinateDisplay />);
    
    const coordinateDiv = container.firstChild as HTMLElement;
    expect(coordinateDiv).toHaveClass('bottom-4', 'left-4'); // bottom-left position
  });

  it('has correct styling and accessibility', () => {
    const { container } = render(<CoordinateDisplay />);
    
    const coordinateDiv = container.firstChild as HTMLElement;
    expect(coordinateDiv).toHaveClass(
      'fixed',
      'bg-black/75',
      'text-white',
      'px-3',
      'py-2',
      'rounded-lg',
      'text-xs',
      'font-mono',
      'leading-tight',
      'pointer-events-none',
      'select-none',
      'z-50'
    );
  });

  it('handles different coordinate positions', () => {
    // Test different positions by checking class application
    const positions = [
      { position: 'top-left', expectedClasses: ['top-4', 'left-4'] },
      { position: 'top-right', expectedClasses: ['top-4', 'right-4'] },
      { position: 'bottom-right', expectedClasses: ['bottom-4', 'right-4'] },
    ];

    positions.forEach(({ position, expectedClasses }) => {
      jest.doMock('../../../store/settings.store', () => ({
        useSettingsStore: () => ({
          display: { ...mockDisplaySettings, coordinatePosition: position },
        }),
      }));

      const { container } = render(<CoordinateDisplay />);
      const coordinateDiv = container.firstChild as HTMLElement;
      
      expectedClasses.forEach(className => {
        expect(coordinateDiv).toHaveClass(className);
      });
    });
  });

  it('uses Vietnamese labels', () => {
    render(<CoordinateDisplay />);
    
    // Check for Vietnamese text
    expect(screen.getByText(/Chuột:/)).toBeInTheDocument();
    expect(screen.getByText(/Canvas:/)).toBeInTheDocument();
  });
});
