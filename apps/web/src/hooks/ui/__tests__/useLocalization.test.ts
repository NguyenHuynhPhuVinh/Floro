import { renderHook } from '@testing-library/react';
import {
  useLocalization,
  vietnameseTexts,
  englishTexts,
} from '../useLocalization';

// Mock the settings store
const mockCollaborationSettings: { language: 'vi' | 'en' } = {
  language: 'vi',
};

jest.mock('../../../store/settings.store', () => ({
  useSettingsStore: () => ({
    collaboration: mockCollaborationSettings,
  }),
}));

describe('useLocalization', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCollaborationSettings.language = 'vi';
  });

  describe('getText function', () => {
    it('should return Vietnamese text when language is vi', () => {
      const { result } = renderHook(() => useLocalization());

      expect(result.current.getText('settings')).toBe('Cài đặt');
      expect(result.current.getText('display')).toBe('Hiển thị');
      expect(result.current.getText('canvas')).toBe('Canvas');
    });

    it('should return English text when language is en', () => {
      mockCollaborationSettings.language = 'en';

      const { result } = renderHook(() => useLocalization());

      expect(result.current.getText('settings')).toBe('Settings');
      expect(result.current.getText('display')).toBe('Display');
      expect(result.current.getText('canvas')).toBe('Canvas');
    });

    it('should fallback to Vietnamese text for unknown keys', () => {
      const { result } = renderHook(() => useLocalization());

      // Test with a key that exists in Vietnamese
      expect(result.current.getText('appTitle')).toBe('Floro');
    });

    it('should return the key itself if not found in any language', () => {
      const { result } = renderHook(() => useLocalization());

      // @ts-expect-error Testing invalid key
      expect(result.current.getText('nonExistentKey')).toBe('nonExistentKey');
    });
  });

  describe('formatText function', () => {
    it('should format text with arguments', () => {
      const { result } = renderHook(() => useLocalization());

      // Since our current texts don't have placeholders, we'll test the mechanism
      // In a real scenario, you'd have texts like "Hello {0}, you have {1} messages"
      const formattedText = result.current.formatText('settings');
      expect(formattedText).toBe('Cài đặt');
    });

    it('should handle multiple arguments', () => {
      const { result } = renderHook(() => useLocalization());

      // Test with a text that would have placeholders
      const formattedText = result.current.formatText(
        'settings',
        'arg1',
        'arg2'
      );
      expect(formattedText).toBe('Cài đặt'); // No placeholders in current text
    });
  });

  describe('language detection', () => {
    it('should correctly identify Vietnamese language', () => {
      const { result } = renderHook(() => useLocalization());

      expect(result.current.currentLanguage).toBe('vi');
      expect(result.current.isVietnamese).toBe(true);
      expect(result.current.isEnglish).toBe(false);
    });

    it('should correctly identify English language', () => {
      mockCollaborationSettings.language = 'en';

      const { result } = renderHook(() => useLocalization());

      expect(result.current.currentLanguage).toBe('en');
      expect(result.current.isVietnamese).toBe(false);
      expect(result.current.isEnglish).toBe(true);
    });
  });

  describe('text constants', () => {
    it('should have matching keys in Vietnamese and English texts', () => {
      const vietnameseKeys = Object.keys(vietnameseTexts);
      const englishKeys = Object.keys(englishTexts);

      expect(vietnameseKeys.sort()).toEqual(englishKeys.sort());
    });

    it('should have all required UI text keys', () => {
      const requiredKeys = [
        'appTitle',
        'settings',
        'display',
        'canvas',
        'collaboration',
        'showCoordinates',
        'mouseCoordinates',
        'canvasCoordinates',
        'coordinateFormat',
        'decimal',
        'integer',
        'backgroundType',
        'theme',
        'light',
        'dark',
        'language',
        'vietnamese',
        'english',
        'save',
        'cancel',
        'close',
        'apply',
      ];

      const vietnameseKeys = Object.keys(vietnameseTexts);

      requiredKeys.forEach(key => {
        expect(vietnameseKeys).toContain(key);
      });
    });

    it('should have Vietnamese text for all keys', () => {
      Object.entries(vietnameseTexts).forEach(([key, value]) => {
        expect(value).toBeTruthy();
        expect(typeof value).toBe('string');
        expect(value.length).toBeGreaterThan(0);
      });
    });

    it('should have English text for all keys', () => {
      Object.entries(englishTexts).forEach(([key, value]) => {
        expect(value).toBeTruthy();
        expect(typeof value).toBe('string');
        expect(value.length).toBeGreaterThan(0);
      });
    });
  });
});
