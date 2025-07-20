import { useSettingsStore } from '../../store/settings.store';

// Vietnamese text constants
export const vietnameseTexts = {
  // Header
  appTitle: 'Floro',

  // Settings
  settings: 'Cài đặt',
  display: 'Hiển thị',
  canvas: 'Canvas',
  collaboration: 'Cộng tác',

  // Display Settings
  showCoordinates: 'Hiển thị tọa độ',
  mouseCoordinates: 'Tọa độ chuột',
  canvasCoordinates: 'Tọa độ canvas',
  coordinateFormat: 'Định dạng tọa độ',
  decimal: 'Thập phân',
  integer: 'Số nguyên',
  coordinatePosition: 'Vị trí hiển thị',
  topLeft: 'Trên trái',
  topRight: 'Trên phải',
  bottomLeft: 'Dưới trái',
  bottomRight: 'Dưới phải',

  // Canvas Settings
  backgroundType: 'Loại nền',
  backgroundSize: 'Kích thước nền',
  backgroundOpacity: 'Độ trong suốt',
  theme: 'Giao diện',
  light: 'Sáng',
  dark: 'Tối',
  none: 'Không có',
  grid: 'Lưới',
  dots: 'Chấm',
  lines: 'Đường kẻ',

  // Collaboration Settings
  language: 'Ngôn ngữ',
  vietnamese: 'Tiếng Việt',
  english: 'Tiếng Anh',
  interfaceLanguage: 'Ngôn ngữ giao diện',

  // Common
  save: 'Lưu',
  cancel: 'Hủy',
  close: 'Đóng',
  apply: 'Áp dụng',
  confirm: 'Xác nhận',
  delete: 'Xóa',

  // Coordinate Display
  mouse: 'Chuột',

  // Future features
  collaborationFeatures: 'Tính năng cộng tác (sắp ra mắt)',
  realtimeSharing: 'Chia sẻ canvas theo thời gian thực',
  commentsAndNotes: 'Bình luận và ghi chú',
  accessManagement: 'Quản lý quyền truy cập',
} as const;

// English text constants
export const englishTexts = {
  // Header
  appTitle: 'Floro',

  // Settings
  settings: 'Settings',
  display: 'Display',
  canvas: 'Canvas',
  collaboration: 'Collaboration',

  // Display Settings
  showCoordinates: 'Show Coordinates',
  mouseCoordinates: 'Mouse Coordinates',
  canvasCoordinates: 'Canvas Coordinates',
  coordinateFormat: 'Coordinate Format',
  decimal: 'Decimal',
  integer: 'Integer',
  coordinatePosition: 'Display Position',
  topLeft: 'Top Left',
  topRight: 'Top Right',
  bottomLeft: 'Bottom Left',
  bottomRight: 'Bottom Right',

  // Canvas Settings
  backgroundType: 'Background Type',
  backgroundSize: 'Background Size',
  backgroundOpacity: 'Opacity',
  theme: 'Theme',
  light: 'Light',
  dark: 'Dark',
  none: 'None',
  grid: 'Grid',
  dots: 'Dots',
  lines: 'Lines',

  // Collaboration Settings
  language: 'Language',
  vietnamese: 'Vietnamese',
  english: 'English',
  interfaceLanguage: 'Interface Language',

  // Common
  save: 'Save',
  cancel: 'Cancel',
  close: 'Close',
  apply: 'Apply',
  confirm: 'Confirm',
  delete: 'Delete',

  // Coordinate Display
  mouse: 'Mouse',

  // Future features
  collaborationFeatures: 'Collaboration Features (Coming Soon)',
  realtimeSharing: 'Real-time canvas sharing',
  commentsAndNotes: 'Comments and notes',
  accessManagement: 'Access management',
} as const;

export type TextKey = keyof typeof vietnameseTexts;

/**
 * Hook for accessing localized text based on current language setting.
 * Provides Vietnamese text by default with English fallback.
 */
export const useLocalization = () => {
  const { collaboration } = useSettingsStore();

  const texts =
    collaboration.language === 'vi' ? vietnameseTexts : englishTexts;

  const getText = (key: TextKey): string => {
    return texts[key] || vietnameseTexts[key] || key;
  };

  const formatText = (key: TextKey, ...args: (string | number)[]): string => {
    const text = getText(key);
    return args.reduce((result: string, arg, index) => {
      return result.replace(`{${index}}`, String(arg));
    }, text);
  };

  return {
    getText,
    formatText,
    currentLanguage: collaboration.language,
    isVietnamese: collaboration.language === 'vi',
    isEnglish: collaboration.language === 'en',
  };
};

export default useLocalization;
