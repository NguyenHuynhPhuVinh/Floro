import { useCallback, useEffect } from 'react';

/**
 * Platform detection utilities
 */
export const PLATFORM_SHORTCUTS = {
  isMac: (): boolean =>
    typeof navigator !== 'undefined' &&
    navigator.platform.toUpperCase().indexOf('MAC') >= 0,

  getModifierKey: (): 'ctrl' | 'cmd' =>
    PLATFORM_SHORTCUTS.isMac() ? 'cmd' : 'ctrl',

  formatShortcut: (shortcut: string): string => {
    const modifier = PLATFORM_SHORTCUTS.getModifierKey();
    return shortcut.replace(/ctrl|cmd/i, modifier === 'cmd' ? '⌘' : 'Ctrl');
  },
};

/**
 * Keyboard shortcuts configuration
 */
export interface KeyboardShortcuts {
  selectAll: {
    windows: 'Ctrl+A';
    mac: 'Cmd+A';
    linux: 'Ctrl+A';
  };
  clearSelection: {
    all: 'Escape';
  };
  deleteSelected: {
    all: 'Delete' | 'Backspace';
  };
  copy: {
    windows: 'Ctrl+C';
    mac: 'Cmd+C';
    linux: 'Ctrl+C';
  };
  multiSelect: {
    windows: 'Ctrl+Click';
    mac: 'Cmd+Click';
    linux: 'Ctrl+Click';
  };
  rangeSelect: {
    all: 'Shift+Click';
  };
}

/**
 * Hook return interface
 */
export interface UseKeyboardShortcutsReturn {
  handleKeyDown: (event: KeyboardEvent) => void;
  isModifierPressed: (
    modifier: 'ctrl' | 'cmd' | 'shift' | 'alt'
  ) => (event: KeyboardEvent) => boolean;
  getPlatformModifier: () => 'ctrl' | 'cmd';
}

/**
 * Keyboard shortcuts configuration for node operations
 */
export interface KeyboardShortcutHandlers {
  onSelectAll?: () => void;
  onClearSelection?: () => void;
  onDeleteSelected?: () => void;
  onCopy?: () => void;
}

/**
 * Hook for managing platform-specific keyboard shortcuts
 * Handles Ctrl/Cmd differences between platforms and provides unified event handling
 */
export const useKeyboardShortcuts = (
  handlers: KeyboardShortcutHandlers = {}
): UseKeyboardShortcutsReturn => {
  const { onSelectAll, onClearSelection, onDeleteSelected, onCopy } = handlers;

  /**
   * Check if a specific modifier key is currently pressed
   */
  const isModifierPressed = useCallback(
    (modifier: 'ctrl' | 'cmd' | 'shift' | 'alt') =>
      (event: KeyboardEvent): boolean => {
        switch (modifier) {
          case 'ctrl':
            return event.ctrlKey;
          case 'cmd':
            return event.metaKey;
          case 'shift':
            return event.shiftKey;
          case 'alt':
            return event.altKey;
          default:
            return false;
        }
      },
    []
  );

  /**
   * Get the platform-specific modifier key
   */
  const getPlatformModifier = useCallback((): 'ctrl' | 'cmd' => {
    return PLATFORM_SHORTCUTS.getModifierKey();
  }, []);

  /**
   * Handle keyboard events for node operations
   */
  const handleKeyDown = useCallback(
    (event: KeyboardEvent): void => {
      const isMac = PLATFORM_SHORTCUTS.isMac();
      const primaryModifier = isMac ? event.metaKey : event.ctrlKey;

      // Select All (Ctrl+A / Cmd+A)
      if (primaryModifier && event.key.toLowerCase() === 'a') {
        event.preventDefault();
        onSelectAll?.();
        return;
      }

      // Clear Selection (Escape)
      if (event.key === 'Escape') {
        event.preventDefault();
        onClearSelection?.();
        return;
      }

      // Delete Selected (Delete / Backspace)
      if (event.key === 'Delete' || event.key === 'Backspace') {
        // Only handle if no input elements are focused
        const activeElement = document.activeElement;
        const isInputFocused =
          activeElement?.tagName === 'INPUT' ||
          activeElement?.tagName === 'TEXTAREA' ||
          activeElement?.getAttribute('contenteditable') === 'true';

        if (!isInputFocused) {
          event.preventDefault();
          onDeleteSelected?.();
        }
        return;
      }

      // Copy (Ctrl+C / Cmd+C)
      if (primaryModifier && event.key.toLowerCase() === 'c') {
        // Only handle if no text is selected in input elements
        const selection = window.getSelection();
        const hasTextSelection = selection && selection.toString().length > 0;

        if (!hasTextSelection) {
          event.preventDefault();
          onCopy?.();
        }
        return;
      }
    },
    [onSelectAll, onClearSelection, onDeleteSelected, onCopy]
  );

  /**
   * Set up global keyboard event listeners
   */
  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent): void => {
      handleKeyDown(event);
    };

    // Add event listener
    document.addEventListener('keydown', handleGlobalKeyDown);

    // Cleanup
    return (): void => {
      document.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [handleKeyDown]);

  return {
    handleKeyDown,
    isModifierPressed,
    getPlatformModifier,
  };
};
