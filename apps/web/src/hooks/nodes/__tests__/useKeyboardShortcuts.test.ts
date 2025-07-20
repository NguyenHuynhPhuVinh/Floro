import { renderHook } from '@testing-library/react';
import { useKeyboardShortcuts, PLATFORM_SHORTCUTS } from '../useKeyboardShortcuts';

// Mock navigator
const mockNavigator = {
  platform: 'MacIntel',
};

Object.defineProperty(window, 'navigator', {
  value: mockNavigator,
  writable: true,
});

describe('useKeyboardShortcuts', () => {
  let mockHandlers: {
    onSelectAll: jest.Mock;
    onClearSelection: jest.Mock;
    onDeleteSelected: jest.Mock;
    onCopy: jest.Mock;
  };

  beforeEach(() => {
    mockHandlers = {
      onSelectAll: jest.fn(),
      onClearSelection: jest.fn(),
      onDeleteSelected: jest.fn(),
      onCopy: jest.fn(),
    };

    // Reset navigator platform
    mockNavigator.platform = 'MacIntel';
  });

  afterEach(() => {
    jest.clearAllMocks();
    // Remove any event listeners
    document.removeEventListener('keydown', jest.fn());
  });

  describe('PLATFORM_SHORTCUTS', () => {
    it('should detect Mac platform', () => {
      mockNavigator.platform = 'MacIntel';
      expect(PLATFORM_SHORTCUTS.isMac()).toBe(true);
      expect(PLATFORM_SHORTCUTS.getModifierKey()).toBe('cmd');
    });

    it('should detect Windows platform', () => {
      mockNavigator.platform = 'Win32';
      expect(PLATFORM_SHORTCUTS.isMac()).toBe(false);
      expect(PLATFORM_SHORTCUTS.getModifierKey()).toBe('ctrl');
    });

    it('should format shortcuts correctly', () => {
      mockNavigator.platform = 'MacIntel';
      expect(PLATFORM_SHORTCUTS.formatShortcut('Ctrl+A')).toBe('⌘+A');
      
      mockNavigator.platform = 'Win32';
      expect(PLATFORM_SHORTCUTS.formatShortcut('Cmd+A')).toBe('Ctrl+A');
    });
  });

  describe('handleKeyDown', () => {
    it('should handle Select All on Mac (Cmd+A)', () => {
      mockNavigator.platform = 'MacIntel';
      const { result } = renderHook(() => useKeyboardShortcuts(mockHandlers));

      const event = new KeyboardEvent('keydown', {
        key: 'a',
        metaKey: true,
        bubbles: true,
      });

      result.current.handleKeyDown(event);

      expect(mockHandlers.onSelectAll).toHaveBeenCalled();
    });

    it('should handle Select All on Windows (Ctrl+A)', () => {
      mockNavigator.platform = 'Win32';
      const { result } = renderHook(() => useKeyboardShortcuts(mockHandlers));

      const event = new KeyboardEvent('keydown', {
        key: 'a',
        ctrlKey: true,
        bubbles: true,
      });

      result.current.handleKeyDown(event);

      expect(mockHandlers.onSelectAll).toHaveBeenCalled();
    });

    it('should handle Clear Selection (Escape)', () => {
      const { result } = renderHook(() => useKeyboardShortcuts(mockHandlers));

      const event = new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
      });

      result.current.handleKeyDown(event);

      expect(mockHandlers.onClearSelection).toHaveBeenCalled();
    });

    it('should handle Delete Selected (Delete key)', () => {
      const { result } = renderHook(() => useKeyboardShortcuts(mockHandlers));

      const event = new KeyboardEvent('keydown', {
        key: 'Delete',
        bubbles: true,
      });

      result.current.handleKeyDown(event);

      expect(mockHandlers.onDeleteSelected).toHaveBeenCalled();
    });

    it('should handle Delete Selected (Backspace key)', () => {
      const { result } = renderHook(() => useKeyboardShortcuts(mockHandlers));

      const event = new KeyboardEvent('keydown', {
        key: 'Backspace',
        bubbles: true,
      });

      result.current.handleKeyDown(event);

      expect(mockHandlers.onDeleteSelected).toHaveBeenCalled();
    });

    it('should handle Copy on Mac (Cmd+C)', () => {
      mockNavigator.platform = 'MacIntel';
      
      // Mock window.getSelection to return no selection
      Object.defineProperty(window, 'getSelection', {
        value: jest.fn(() => ({
          toString: () => '',
        })),
        writable: true,
      });

      const { result } = renderHook(() => useKeyboardShortcuts(mockHandlers));

      const event = new KeyboardEvent('keydown', {
        key: 'c',
        metaKey: true,
        bubbles: true,
      });

      result.current.handleKeyDown(event);

      expect(mockHandlers.onCopy).toHaveBeenCalled();
    });

    it('should not handle Delete when input is focused', () => {
      // Mock active element as input
      const mockInput = document.createElement('input');
      jest.spyOn(document, 'activeElement', 'get').mockReturnValue(mockInput);

      const { result } = renderHook(() => useKeyboardShortcuts(mockHandlers));

      const event = new KeyboardEvent('keydown', {
        key: 'Delete',
        bubbles: true,
      });

      result.current.handleKeyDown(event);

      expect(mockHandlers.onDeleteSelected).not.toHaveBeenCalled();
    });

    it('should not handle Copy when text is selected', () => {
      // Mock window.getSelection to return selected text
      Object.defineProperty(window, 'getSelection', {
        value: jest.fn(() => ({
          toString: () => 'selected text',
        })),
        writable: true,
      });

      const { result } = renderHook(() => useKeyboardShortcuts(mockHandlers));

      const event = new KeyboardEvent('keydown', {
        key: 'c',
        ctrlKey: true,
        bubbles: true,
      });

      result.current.handleKeyDown(event);

      expect(mockHandlers.onCopy).not.toHaveBeenCalled();
    });
  });

  describe('isModifierPressed', () => {
    it('should detect modifier keys correctly', () => {
      const { result } = renderHook(() => useKeyboardShortcuts());

      const event = new KeyboardEvent('keydown', {
        ctrlKey: true,
        metaKey: false,
        shiftKey: true,
        altKey: false,
      });

      expect(result.current.isModifierPressed('ctrl')(event)).toBe(true);
      expect(result.current.isModifierPressed('cmd')(event)).toBe(false);
      expect(result.current.isModifierPressed('shift')(event)).toBe(true);
      expect(result.current.isModifierPressed('alt')(event)).toBe(false);
    });
  });

  describe('getPlatformModifier', () => {
    it('should return correct platform modifier', () => {
      mockNavigator.platform = 'MacIntel';
      const { result } = renderHook(() => useKeyboardShortcuts());
      expect(result.current.getPlatformModifier()).toBe('cmd');

      mockNavigator.platform = 'Win32';
      const { result: result2 } = renderHook(() => useKeyboardShortcuts());
      expect(result2.current.getPlatformModifier()).toBe('ctrl');
    });
  });
});
