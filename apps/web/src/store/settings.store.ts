import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types for settings configuration
export type CanvasBackgroundType = 'none' | 'grid' | 'dots' | 'lines';
export type LanguageType = 'vi' | 'en';
export type CoordinateFormat = 'decimal' | 'integer';
export type CoordinatePosition =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

export interface DisplaySettings {
  showCoordinates: boolean;
  showMouseCoords: boolean;
  showCanvasCoords: boolean;
  coordinateFormat: CoordinateFormat;
  coordinatePosition: CoordinatePosition;
}

export interface CanvasSettings {
  backgroundType: CanvasBackgroundType;
  backgroundSize: number;
  backgroundOpacity: number;
}

export interface CollaborationSettings {
  language: LanguageType;
}

export interface SettingsState {
  // Modal state
  isModalOpen: boolean;
  activeCategory: string;

  // Settings categories
  display: DisplaySettings;
  canvas: CanvasSettings;
  collaboration: CollaborationSettings;

  // Actions
  openModal: () => void;
  closeModal: () => void;
  setActiveCategory: (category: string) => void;
  updateDisplaySettings: (settings: Partial<DisplaySettings>) => void;
  updateCanvasSettings: (settings: Partial<CanvasSettings>) => void;
  updateCollaborationSettings: (
    settings: Partial<CollaborationSettings>
  ) => void;
  resetToDefaults: () => void;
}

// Default settings values
const defaultDisplaySettings: DisplaySettings = {
  showCoordinates: true,
  showMouseCoords: true,
  showCanvasCoords: true,
  coordinateFormat: 'integer',
  coordinatePosition: 'bottom-left',
};

const defaultCanvasSettings: CanvasSettings = {
  backgroundType: 'grid',
  backgroundSize: 20,
  backgroundOpacity: 0.3,
};

const defaultCollaborationSettings: CollaborationSettings = {
  language: 'vi',
};

/**
 * Zustand store for managing application settings with persistence.
 * Handles display, canvas, and collaboration settings with Vietnamese defaults.
 */
export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      // Initial state
      isModalOpen: false,
      activeCategory: 'display',
      display: defaultDisplaySettings,
      canvas: defaultCanvasSettings,
      collaboration: defaultCollaborationSettings,

      // Modal actions
      openModal: () => set({ isModalOpen: true }),
      closeModal: () => set({ isModalOpen: false }),
      setActiveCategory: (category: string) =>
        set({ activeCategory: category }),

      // Settings update actions
      updateDisplaySettings: (settings: Partial<DisplaySettings>) =>
        set(state => ({
          display: { ...state.display, ...settings },
        })),

      updateCanvasSettings: (settings: Partial<CanvasSettings>) =>
        set(state => ({
          canvas: { ...state.canvas, ...settings },
        })),

      updateCollaborationSettings: (settings: Partial<CollaborationSettings>) =>
        set(state => ({
          collaboration: { ...state.collaboration, ...settings },
        })),

      // Reset to defaults
      resetToDefaults: () =>
        set({
          display: defaultDisplaySettings,
          canvas: defaultCanvasSettings,
          collaboration: defaultCollaborationSettings,
        }),
    }),
    {
      name: 'floro-settings',
      partialize: state => ({
        display: state.display,
        canvas: state.canvas,
        collaboration: state.collaboration,
      }),
    }
  )
);

export default useSettingsStore;
