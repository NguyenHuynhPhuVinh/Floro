import { FILE_ERROR_MESSAGES } from '../../../types';
import { StorageService } from '../storage.service';

// Mock Supabase
jest.mock('../../../lib/supabase', () => ({
  supabase: {
    storage: {
      from: jest.fn(() => ({
        upload: jest.fn(),
        getPublicUrl: jest.fn(),
        remove: jest.fn(),
        list: jest.fn(),
      })),
    },
  },
}));

// Mock crypto.subtle for checksum calculation
Object.defineProperty(global, 'crypto', {
  value: {
    subtle: {
      digest: jest.fn(() => Promise.resolve(new ArrayBuffer(32))),
    },
  },
});

describe('StorageService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('validateFile', () => {
    it('should validate a valid PDF file', () => {
      const file = new File(['test content'], 'test.pdf', {
        type: 'application/pdf',
        lastModified: Date.now(),
      });
      Object.defineProperty(file, 'size', { value: 1024 * 10 }); // 10KB

      const result = StorageService.validateFile(file);

      expect(result.isValid).toBe(true);
      expect(result.fileType).toBe('pdf');
      expect(result.mimeType).toBe('application/pdf');
    });

    it('should reject files that are too large', () => {
      const file = new File(['test content'], 'large.pdf', {
        type: 'application/pdf',
        lastModified: Date.now(),
      });
      Object.defineProperty(file, 'size', { value: 60 * 1024 * 1024 }); // 60MB

      const result = StorageService.validateFile(file);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe(FILE_ERROR_MESSAGES.FILE_TOO_LARGE);
    });

    it('should reject files that are too small', () => {
      const file = new File([''], 'tiny.pdf', {
        type: 'application/pdf',
        lastModified: Date.now(),
      });
      Object.defineProperty(file, 'size', { value: 500 }); // 500 bytes

      const result = StorageService.validateFile(file);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('File is too small. Minimum size is 1KB.');
    });

    it('should reject media files', () => {
      const file = new File(['test content'], 'video.mp4', {
        type: 'video/mp4',
        lastModified: Date.now(),
      });
      Object.defineProperty(file, 'size', { value: 1024 * 10 }); // 10KB

      const result = StorageService.validateFile(file);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe(FILE_ERROR_MESSAGES.MEDIA_FILES_BLOCKED);
    });

    it('should reject unsupported file types', () => {
      const file = new File(['test content'], 'test.exe', {
        type: 'application/octet-stream',
        lastModified: Date.now(),
      });
      Object.defineProperty(file, 'size', { value: 1024 * 10 }); // 10KB

      const result = StorageService.validateFile(file);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe(FILE_ERROR_MESSAGES.UNSUPPORTED_TYPE);
    });

    it('should reject files without extension', () => {
      const file = new File(['test content'], 'noextension', {
        type: 'text/plain',
        lastModified: Date.now(),
      });
      Object.defineProperty(file, 'size', { value: 1024 * 10 }); // 10KB

      const result = StorageService.validateFile(file);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('File must have an extension.');
    });
  });

  describe('getFileCategory', () => {
    it('should categorize document files correctly', () => {
      expect(StorageService.getFileCategory('document.pdf')).toBe('document');
      expect(StorageService.getFileCategory('text.docx')).toBe('document');
      expect(StorageService.getFileCategory('readme.txt')).toBe('document');
    });

    it('should categorize image files correctly', () => {
      expect(StorageService.getFileCategory('photo.jpg')).toBe('image');
      expect(StorageService.getFileCategory('icon.png')).toBe('image');
      expect(StorageService.getFileCategory('vector.svg')).toBe('image');
    });

    it('should categorize code files correctly', () => {
      expect(StorageService.getFileCategory('component.tsx')).toBe('web-code');
      expect(StorageService.getFileCategory('server.py')).toBe('backend-code');
      expect(StorageService.getFileCategory('app.swift')).toBe('mobile-code');
      expect(StorageService.getFileCategory('main.cpp')).toBe('system-code');
      expect(StorageService.getFileCategory('deploy.sh')).toBe('script-code');
      expect(StorageService.getFileCategory('config.toml')).toBe('config-code');
    });

    it('should categorize data files correctly', () => {
      expect(StorageService.getFileCategory('data.json')).toBe('data-file');
      expect(StorageService.getFileCategory('config.yaml')).toBe('data-file');
      expect(StorageService.getFileCategory('export.csv')).toBe('data-file');
    });

    it('should default to text-file for unknown extensions', () => {
      expect(StorageService.getFileCategory('unknown.xyz')).toBe('text-file');
      expect(StorageService.getFileCategory('noextension')).toBe('text-file');
    });
  });

  describe('isCodeFile', () => {
    it('should identify code files correctly', () => {
      expect(StorageService.isCodeFile('component.tsx')).toBe(true);
      expect(StorageService.isCodeFile('server.py')).toBe(true);
      expect(StorageService.isCodeFile('config.json')).toBe(true);
      expect(StorageService.isCodeFile('deploy.sh')).toBe(true);
    });

    it('should identify non-code files correctly', () => {
      expect(StorageService.isCodeFile('document.pdf')).toBe(false);
      expect(StorageService.isCodeFile('photo.jpg')).toBe(false);
      expect(StorageService.isCodeFile('archive.zip')).toBe(false);
    });
  });

  describe('generateFilePath', () => {
    it('should generate unique file paths', () => {
      const path1 = StorageService.generateFilePath('uploads', 'test.pdf');
      const path2 = StorageService.generateFilePath('uploads', 'test.pdf');

      expect(path1).toMatch(/^uploads\/test_\d+_[a-z0-9]+\.pdf$/);
      expect(path2).toMatch(/^uploads\/test_\d+_[a-z0-9]+\.pdf$/);
      expect(path1).not.toBe(path2);
    });

    it('should preserve file extension', () => {
      const path = StorageService.generateFilePath('uploads', 'document.docx');
      expect(path).toMatch(/\.docx$/);
    });
  });

  describe('getSupportedExtensions', () => {
    it('should return all supported extensions', () => {
      const extensions = StorageService.getSupportedExtensions();

      expect(extensions).toContain('pdf');
      expect(extensions).toContain('jpg');
      expect(extensions).toContain('tsx');
      expect(extensions).toContain('py');
      expect(extensions).toContain('json');
      expect(extensions).not.toContain('mp4'); // Media files should not be included
    });
  });

  describe('getStandardizedErrorMessage', () => {
    it('should return network error message for network errors', () => {
      const error = new Error('Network connection failed');
      const message = StorageService.getStandardizedErrorMessage(error);
      expect(message).toBe(FILE_ERROR_MESSAGES.NETWORK_ERROR);
    });

    it('should return file size error for size-related errors', () => {
      const error = new Error('File too large');
      const message = StorageService.getStandardizedErrorMessage(error);
      expect(message).toBe(FILE_ERROR_MESSAGES.FILE_TOO_LARGE);
    });

    it('should return generic upload failed message for unknown errors', () => {
      const error = new Error('Unknown error');
      const message = StorageService.getStandardizedErrorMessage(error);
      expect(message).toBe(FILE_ERROR_MESSAGES.UPLOAD_FAILED);
    });
  });
});
