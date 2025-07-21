// File Node Types
export interface FileNode {
  id: string;
  sessionId: string; // e.g., "public"
  type: 'file';
  fileName: string;
  fileType: string;
  fileURL: string;
  fileSize: number;
  mimeType: string;
  checksum?: string; // For integrity verification
  position: { x: number; y: number };
  size: { width: number; height: number };
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  zIndex: number; // For layering
  isLocked?: boolean; // Prevent accidental moves
  metadata?: Record<string, unknown>; // JSONB column for extensible metadata
}

// File Upload Types
export interface FileUploadProgress {
  fileId: string;
  fileName: string;
  loaded: number;
  total: number;
  progress: number;
  status: 'uploading' | 'completed' | 'error' | 'cancelled';
  error?: string;
}

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
  fileType?: string;
  mimeType?: string;
}

export interface DragDropEvent {
  files: File[];
  position: { x: number; y: number };
  canvasPosition: { x: number; y: number };
}

// File Categories
export type FileCategory =
  | 'document'
  | 'image'
  | 'archive'
  | 'spreadsheet'
  | 'presentation'
  | 'web-code'
  | 'backend-code'
  | 'mobile-code'
  | 'system-code'
  | 'script-code'
  | 'config-code'
  | 'data-file'
  | 'text-file';

export interface FileTypeMapping {
  [extension: string]: {
    category: FileCategory;
    icon: string;
    color: string;
  };
}

// File Node Creation Data
export interface FileNodeCreateData {
  fileName: string;
  fileType: string;
  fileURL: string;
  fileSize: number;
  mimeType: string;
  checksum?: string;
}

// Supported file extensions
export const SUPPORTED_EXTENSIONS = {
  DOCUMENTS: ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt'],
  IMAGES: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
  ARCHIVES: ['zip', 'rar', '7z', 'tar', 'gz'],
  WEB_CODE: [
    'js',
    'ts',
    'jsx',
    'tsx',
    'html',
    'css',
    'scss',
    'sass',
    'less',
    'styl',
  ],
  BACKEND_CODE: [
    'php',
    'py',
    'rb',
    'go',
    'rs',
    'java',
    'kt',
    'scala',
    'cs',
    'vb',
  ],
  MOBILE_CODE: ['swift', 'm', 'dart', 'xaml'],
  SYSTEM_CODE: ['c', 'cpp', 'h', 'hpp', 'cc', 'cxx'],
  SCRIPT_CODE: ['sh', 'bat', 'ps1', 'cmd', 'zsh', 'fish'],
  CONFIG_CODE: ['ini', 'conf', 'cfg', 'toml', 'properties', 'env'],
  DATA_FILES: ['json', 'xml', 'yaml', 'yml', 'csv', 'sql'],
  TEXT_FILES: ['md', 'txt', 'rtf', 'log'],
  SPREADSHEETS: ['xls', 'xlsx', 'ods'],
  PRESENTATIONS: ['ppt', 'pptx', 'odp'],
} as const;

// Type helper for supported extensions
export type SupportedExtension =
  (typeof SUPPORTED_EXTENSIONS)[keyof typeof SUPPORTED_EXTENSIONS][number];

// File validation constants
export const FILE_CONSTRAINTS = {
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  MIN_FILE_SIZE: 1024, // 1KB
  MAX_SESSION_SIZE: 500 * 1024 * 1024, // 500MB
} as const;

// Error messages - now using translated messages
export { FILE_ERROR_MESSAGES } from '../lib/errorMessages';
