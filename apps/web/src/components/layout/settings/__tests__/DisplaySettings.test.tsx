import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DisplaySettings } from '../DisplaySettings';

// Mock the settings store
const mockUpdateDisplaySettings = jest.fn();
const mockDisplaySettings = {
  showCoordinates: true,
  showMouseCoords: true,
  showCanvasCoords: true,
  coordinateFormat: 'integer' as const,
  coordinatePosition: 'bottom-left' as const,
};

jest.mock('../../../../store/settings.store', () => ({
  useSettingsStore: () => ({
    display: mockDisplaySettings,
    updateDisplaySettings: mockUpdateDisplaySettings,
  }),
}));

// Mock the localization hook
const mockGetText = jest.fn((key: string) => {
  const texts: Record<string, string> = {
    display: 'Hiển thị',
    settings: 'Cài đặt',
    showCoordinates: 'Hiển thị tọa độ',
    mouseCoordinates: 'Tọa độ chuột',
    canvasCoordinates: 'Tọa độ canvas',
    coordinateFormat: 'Định dạng tọa độ',
    coordinatePosition: 'Vị trí hiển thị',
    integer: 'Số nguyên',
    decimal: 'Thập phân',
    topLeft: 'Trên trái',
    topRight: 'Trên phải',
    bottomLeft: 'Dưới trái',
    bottomRight: 'Dưới phải',
  };
  return texts[key] || key;
});

jest.mock('../../../../hooks/ui/useLocalization', () => ({
  useLocalization: () => ({
    getText: mockGetText,
  }),
}));

describe('DisplaySettings', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders display settings title', () => {
    render(<DisplaySettings />);
    
    expect(screen.getByText('Hiển thị Cài đặt')).toBeInTheDocument();
  });

  it('renders show coordinates toggle', () => {
    render(<DisplaySettings />);
    
    expect(screen.getByText('Hiển thị tọa độ')).toBeInTheDocument();
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('calls updateDisplaySettings when coordinates toggle is changed', () => {
    render(<DisplaySettings />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(mockUpdateDisplaySettings).toHaveBeenCalledWith({
      showCoordinates: false,
    });
  });

  it('shows coordinate type options when coordinates are enabled', () => {
    render(<DisplaySettings />);
    
    expect(screen.getByText('Tọa độ chuột')).toBeInTheDocument();
    expect(screen.getByText('Tọa độ canvas')).toBeInTheDocument();
  });

  it('hides coordinate type options when coordinates are disabled', () => {
    // Mock disabled coordinates
    jest.doMock('../../../../store/settings.store', () => ({
      useSettingsStore: () => ({
        display: { ...mockDisplaySettings, showCoordinates: false },
        updateDisplaySettings: mockUpdateDisplaySettings,
      }),
    }));

    render(<DisplaySettings />);
    
    expect(screen.queryByText('Tọa độ chuột')).not.toBeInTheDocument();
    expect(screen.queryByText('Tọa độ canvas')).not.toBeInTheDocument();
  });

  it('renders coordinate format dropdown', () => {
    render(<DisplaySettings />);
    
    expect(screen.getByText('Định dạng tọa độ')).toBeInTheDocument();
    
    const select = screen.getByDisplayValue('Số nguyên');
    expect(select).toBeInTheDocument();
  });

  it('calls updateDisplaySettings when coordinate format is changed', () => {
    render(<DisplaySettings />);
    
    const select = screen.getByDisplayValue('Số nguyên');
    fireEvent.change(select, { target: { value: 'decimal' } });
    
    expect(mockUpdateDisplaySettings).toHaveBeenCalledWith({
      coordinateFormat: 'decimal',
    });
  });

  it('renders coordinate position dropdown', () => {
    render(<DisplaySettings />);
    
    expect(screen.getByText('Vị trí hiển thị')).toBeInTheDocument();
    
    const select = screen.getByDisplayValue('Dưới trái');
    expect(select).toBeInTheDocument();
  });

  it('calls updateDisplaySettings when coordinate position is changed', () => {
    render(<DisplaySettings />);
    
    const select = screen.getByDisplayValue('Dưới trái');
    fireEvent.change(select, { target: { value: 'top-right' } });
    
    expect(mockUpdateDisplaySettings).toHaveBeenCalledWith({
      coordinatePosition: 'top-right',
    });
  });

  it('handles mouse coordinates toggle', () => {
    render(<DisplaySettings />);
    
    const mouseCheckboxes = screen.getAllByRole('checkbox');
    const mouseCoordCheckbox = mouseCheckboxes.find(checkbox => 
      checkbox.closest('div')?.textContent?.includes('Tọa độ chuột')
    );
    
    if (mouseCoordCheckbox) {
      fireEvent.click(mouseCoordCheckbox);
      
      expect(mockUpdateDisplaySettings).toHaveBeenCalledWith({
        showMouseCoords: false,
      });
    }
  });

  it('handles canvas coordinates toggle', () => {
    render(<DisplaySettings />);
    
    const canvasCheckboxes = screen.getAllByRole('checkbox');
    const canvasCoordCheckbox = canvasCheckboxes.find(checkbox => 
      checkbox.closest('div')?.textContent?.includes('Tọa độ canvas')
    );
    
    if (canvasCoordCheckbox) {
      fireEvent.click(canvasCoordCheckbox);
      
      expect(mockUpdateDisplaySettings).toHaveBeenCalledWith({
        showCanvasCoords: false,
      });
    }
  });

  it('uses localization for all text elements', () => {
    render(<DisplaySettings />);
    
    // Verify that getText was called for all expected keys
    expect(mockGetText).toHaveBeenCalledWith('display');
    expect(mockGetText).toHaveBeenCalledWith('settings');
    expect(mockGetText).toHaveBeenCalledWith('showCoordinates');
    expect(mockGetText).toHaveBeenCalledWith('integer');
    expect(mockGetText).toHaveBeenCalledWith('decimal');
    expect(mockGetText).toHaveBeenCalledWith('bottomLeft');
  });
});
