import { renderHook, act } from '@testing-library/react';
import { useSettingsStore } from '../settings.store';

// Mock localStorage for persist middleware
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('useSettingsStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useSettingsStore.setState({
      isModalOpen: false,
      activeCategory: 'display',
      display: {
        showCoordinates: true,
        showMouseCoords: true,
        showCanvasCoords: true,
        coordinateFormat: 'integer',
        coordinatePosition: 'bottom-left',
      },
      canvas: {
        backgroundType: 'grid',
        backgroundSize: 20,
        backgroundOpacity: 0.3,
      },
      collaboration: {
        language: 'vi',
      },
    });
    jest.clearAllMocks();
  });

  describe('modal state management', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useSettingsStore());

      expect(result.current.isModalOpen).toBe(false);
      expect(result.current.activeCategory).toBe('display');
    });

    it('should open modal', () => {
      const { result } = renderHook(() => useSettingsStore());

      act(() => {
        result.current.openModal();
      });

      expect(result.current.isModalOpen).toBe(true);
    });

    it('should close modal', () => {
      const { result } = renderHook(() => useSettingsStore());

      act(() => {
        result.current.openModal();
        result.current.closeModal();
      });

      expect(result.current.isModalOpen).toBe(false);
    });

    it('should set active category', () => {
      const { result } = renderHook(() => useSettingsStore());

      act(() => {
        result.current.setActiveCategory('canvas');
      });

      expect(result.current.activeCategory).toBe('canvas');
    });
  });

  describe('display settings management', () => {
    it('should update display settings', () => {
      const { result } = renderHook(() => useSettingsStore());

      act(() => {
        result.current.updateDisplaySettings({
          showCoordinates: false,
          coordinateFormat: 'decimal',
        });
      });

      expect(result.current.display.showCoordinates).toBe(false);
      expect(result.current.display.coordinateFormat).toBe('decimal');
      // Other properties should remain unchanged
      expect(result.current.display.showMouseCoords).toBe(true);
    });

    it('should have correct default display settings', () => {
      const { result } = renderHook(() => useSettingsStore());

      expect(result.current.display).toEqual({
        showCoordinates: true,
        showMouseCoords: true,
        showCanvasCoords: true,
        coordinateFormat: 'integer',
        coordinatePosition: 'bottom-left',
      });
    });
  });

  describe('canvas settings management', () => {
    it('should update canvas settings', () => {
      const { result } = renderHook(() => useSettingsStore());

      act(() => {
        result.current.updateCanvasSettings({
          backgroundType: 'dots',
          backgroundSize: 30,
        });
      });

      expect(result.current.canvas.backgroundType).toBe('dots');
      expect(result.current.canvas.backgroundSize).toBe(30);
      // Other properties should remain unchanged
      expect(result.current.canvas.backgroundOpacity).toBe(0.3);
    });

    it('should have correct default canvas settings', () => {
      const { result } = renderHook(() => useSettingsStore());

      expect(result.current.canvas).toEqual({
        backgroundType: 'grid',
        backgroundSize: 20,
        backgroundOpacity: 0.3,
      });
    });
  });

  describe('collaboration settings management', () => {
    it('should update collaboration settings', () => {
      const { result } = renderHook(() => useSettingsStore());

      act(() => {
        result.current.updateCollaborationSettings({
          language: 'en',
        });
      });

      expect(result.current.collaboration.language).toBe('en');
    });

    it('should have correct default collaboration settings', () => {
      const { result } = renderHook(() => useSettingsStore());

      expect(result.current.collaboration).toEqual({
        language: 'vi',
      });
    });
  });

  describe('reset functionality', () => {
    it('should reset all settings to defaults', () => {
      const { result } = renderHook(() => useSettingsStore());

      // Modify settings
      act(() => {
        result.current.updateDisplaySettings({ showCoordinates: false });
        result.current.updateCanvasSettings({ backgroundType: 'dots' });
        result.current.updateCollaborationSettings({ language: 'en' });
      });

      // Reset to defaults
      act(() => {
        result.current.resetToDefaults();
      });

      // Check all settings are back to defaults
      expect(result.current.display.showCoordinates).toBe(true);
      expect(result.current.canvas.backgroundType).toBe('grid');
      expect(result.current.collaboration.language).toBe('vi');
    });
  });
});
