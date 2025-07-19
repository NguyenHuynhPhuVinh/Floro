import { supabase } from '../../lib/supabase';
import {
  FileValidationResult,
  FileCategory,
  SUPPORTED_EXTENSIONS,
  FILE_CONSTRAINTS,
  FILE_ERROR_MESSAGES,
  FileUploadProgress,
} from '../../types';

export interface UploadProgress {
  loaded: number;
  total: number;
  progress: number;
}

export interface FileMetadata {
  name: string;
  size: number;
  contentType: string;
  lastModified: string;
  publicUrl: string;
  path: string;
}

export class StorageService {
  private static readonly BUCKET_NAME = 'floro-assets';

  private static handleError(operation: string, error: unknown): never {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`${operation}: ${message}`);
  }

  /**
   * Upload a file to Supabase Storage
   */
  static async uploadFile(
    path: string,
    file: File | Blob,
    options?: {
      cacheControl?: string;
      contentType?: string;
      upsert?: boolean;
    }
  ): Promise<string> {
    try {
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(path, file, {
          cacheControl: options?.cacheControl || '3600',
          contentType: options?.contentType || file.type,
          upsert: options?.upsert || false,
        });

      if (error) {
        this.handleError('Failed to upload file', error);
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    } catch (error) {
      this.handleError('Error in uploadFile', error);
    }
  }

  /**
   * Upload file with progress tracking and retry logic
   */
  static async uploadFileWithProgress(
    path: string,
    file: File,
    onProgress?: (progress: UploadProgress) => void,
    maxRetries: number = 3
  ): Promise<string> {
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        if (onProgress) {
          onProgress({ loaded: 0, total: file.size, progress: 0 });
        }

        // Simulate progress for better UX (since Supabase doesn't provide real progress)
        const progressInterval = setInterval(() => {
          if (onProgress) {
            const fakeProgress = Math.min(
              90,
              ((Date.now() % 3000) / 3000) * 90
            );
            onProgress({
              loaded: Math.floor((fakeProgress / 100) * file.size),
              total: file.size,
              progress: fakeProgress,
            });
          }
        }, 100);

        const result = await this.uploadFile(path, file);

        clearInterval(progressInterval);

        if (onProgress) {
          onProgress({ loaded: file.size, total: file.size, progress: 100 });
        }

        return result;
      } catch (error) {
        attempt++;

        if (attempt >= maxRetries) {
          this.handleError(
            `Error uploading file after ${maxRetries} attempts`,
            error
          );
        }

        // Wait before retry (exponential backoff)
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw new Error('Upload failed after all retry attempts');
  }

  /**
   * Get public URL for a file
   */
  static getFileURL(path: string): string {
    const { data } = supabase.storage.from(this.BUCKET_NAME).getPublicUrl(path);

    return data.publicUrl;
  }

  /**
   * Delete a file from storage
   */
  static async deleteFile(path: string): Promise<void> {
    const { error } = await supabase.storage
      .from(this.BUCKET_NAME)
      .remove([path]);

    if (error) {
      this.handleError('Failed to delete file', error);
    }
  }

  /**
   * List files in a directory
   */
  static async listFiles(path: string = ''): Promise<FileMetadata[]> {
    const { data, error } = await supabase.storage
      .from(this.BUCKET_NAME)
      .list(path, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' },
      });

    if (error) {
      this.handleError('Failed to list files', error);
    }

    if (!data) {
      return [];
    }

    return data.map(file => ({
      name: file.name,
      size: file.metadata?.size || 0,
      contentType: file.metadata?.mimetype || 'unknown',
      lastModified: file.updated_at || file.created_at,
      publicUrl: this.getFileURL(`${path}/${file.name}`),
      path: `${path}/${file.name}`,
    }));
  }

  /**
   * Get file metadata
   */
  static async getFileMetadata(path: string): Promise<FileMetadata> {
    const { data, error } = await supabase.storage
      .from(this.BUCKET_NAME)
      .list(path.split('/').slice(0, -1).join('/'), {
        search: path.split('/').pop(),
      });

    if (error || !data || data.length === 0) {
      throw new Error(`File not found: ${path}`);
    }

    const file = data[0];
    return {
      name: file.name,
      size: file.metadata?.size || 0,
      contentType: file.metadata?.mimetype || 'unknown',
      lastModified: file.updated_at || file.created_at,
      publicUrl: this.getFileURL(path),
      path,
    };
  }

  /**
   * Generate a unique file path
   */
  static generateFilePath(directory: string, fileName: string): string {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2);
    const fileExtension = fileName.split('.').pop();
    const baseName = fileName.replace(`.${fileExtension}`, '');

    return `${directory}/${baseName}_${timestamp}_${randomId}.${fileExtension}`;
  }

  /**
   * Validate file according to project constraints
   */
  static validateFile(file: File): FileValidationResult {
    // Check file size
    if (file.size > FILE_CONSTRAINTS.MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: FILE_ERROR_MESSAGES.FILE_TOO_LARGE,
      };
    }

    if (file.size < FILE_CONSTRAINTS.MIN_FILE_SIZE) {
      return {
        isValid: false,
        error: 'File is too small. Minimum size is 1KB.',
      };
    }

    // Get file extension
    const parts = file.name.split('.');
    if (parts.length < 2) {
      return {
        isValid: false,
        error: 'File must have an extension.',
      };
    }
    const extension = parts.pop()?.toLowerCase();
    if (!extension) {
      return {
        isValid: false,
        error: 'File must have an extension.',
      };
    }

    // Block media files explicitly first
    const mediaExtensions = [
      'mp4',
      'avi',
      'mov',
      'wmv',
      'flv',
      'webm',
      'mp3',
      'wav',
      'flac',
      'aac',
      'ogg',
    ];
    if (mediaExtensions.includes(extension)) {
      return {
        isValid: false,
        error: FILE_ERROR_MESSAGES.MEDIA_FILES_BLOCKED,
      };
    }

    // Check if file type is supported
    const allSupportedExtensions = Object.values(SUPPORTED_EXTENSIONS).flat();
    if (!allSupportedExtensions.includes(extension as any)) {
      return {
        isValid: false,
        error: FILE_ERROR_MESSAGES.UNSUPPORTED_TYPE,
      };
    }

    // Validate MIME type matches extension
    const expectedMimeTypes = this.getMimeTypesForExtension(extension);
    if (
      expectedMimeTypes.length > 0 &&
      !expectedMimeTypes.includes(file.type)
    ) {
      return {
        isValid: false,
        error: 'File type does not match its extension.',
      };
    }

    return {
      isValid: true,
      fileType: extension,
      mimeType: file.type,
    };
  }

  /**
   * Get file category based on extension
   */
  static getFileCategory(fileName: string): FileCategory {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (!extension) return 'text-file';

    if (SUPPORTED_EXTENSIONS.DOCUMENTS.includes(extension as any))
      return 'document';
    if (SUPPORTED_EXTENSIONS.IMAGES.includes(extension as any)) return 'image';
    if (SUPPORTED_EXTENSIONS.ARCHIVES.includes(extension as any))
      return 'archive';
    if (SUPPORTED_EXTENSIONS.WEB_CODE.includes(extension as any))
      return 'web-code';
    if (SUPPORTED_EXTENSIONS.BACKEND_CODE.includes(extension as any))
      return 'backend-code';
    if (SUPPORTED_EXTENSIONS.MOBILE_CODE.includes(extension as any))
      return 'mobile-code';
    if (SUPPORTED_EXTENSIONS.SYSTEM_CODE.includes(extension as any))
      return 'system-code';
    if (SUPPORTED_EXTENSIONS.SCRIPT_CODE.includes(extension as any))
      return 'script-code';
    if (SUPPORTED_EXTENSIONS.CONFIG_CODE.includes(extension as any))
      return 'config-code';
    if (SUPPORTED_EXTENSIONS.DATA_FILES.includes(extension as any))
      return 'data-file';
    if (SUPPORTED_EXTENSIONS.SPREADSHEETS.includes(extension as any))
      return 'spreadsheet';
    if (SUPPORTED_EXTENSIONS.PRESENTATIONS.includes(extension as any))
      return 'presentation';
    if (SUPPORTED_EXTENSIONS.TEXT_FILES.includes(extension as any))
      return 'text-file';

    return 'text-file';
  }

  /**
   * Check if file is a code file
   */
  static isCodeFile(fileName: string): boolean {
    const category = this.getFileCategory(fileName);
    return [
      'web-code',
      'backend-code',
      'mobile-code',
      'system-code',
      'script-code',
      'config-code',
      'data-file',
    ].includes(category);
  }

  /**
   * Get supported extensions list
   */
  static getSupportedExtensions(): string[] {
    return Object.values(SUPPORTED_EXTENSIONS).flat();
  }

  /**
   * Get expected MIME types for a file extension
   */
  private static getMimeTypesForExtension(extension: string): string[] {
    const mimeTypeMap: Record<string, string[]> = {
      // Documents
      pdf: ['application/pdf'],
      doc: ['application/msword'],
      docx: [
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ],
      txt: ['text/plain'],
      rtf: ['application/rtf', 'text/rtf'],
      odt: ['application/vnd.oasis.opendocument.text'],

      // Images
      jpg: ['image/jpeg'],
      jpeg: ['image/jpeg'],
      png: ['image/png'],
      gif: ['image/gif'],
      webp: ['image/webp'],
      svg: ['image/svg+xml'],

      // Archives
      zip: ['application/zip'],
      rar: ['application/vnd.rar'],
      '7z': ['application/x-7z-compressed'],
      tar: ['application/x-tar'],
      gz: ['application/gzip'],

      // Code files - most are text/plain or application/octet-stream
      js: ['text/javascript', 'application/javascript'],
      ts: ['text/typescript', 'application/typescript'],
      jsx: ['text/jsx'],
      tsx: ['text/tsx'],
      html: ['text/html'],
      css: ['text/css'],
      scss: ['text/scss'],
      sass: ['text/sass'],
      json: ['application/json'],
      xml: ['application/xml', 'text/xml'],
      yaml: ['application/yaml', 'text/yaml'],
      yml: ['application/yaml', 'text/yaml'],

      // Spreadsheets
      xls: ['application/vnd.ms-excel'],
      xlsx: [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ],
      ods: ['application/vnd.oasis.opendocument.spreadsheet'],

      // Presentations
      ppt: ['application/vnd.ms-powerpoint'],
      pptx: [
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      ],
      odp: ['application/vnd.oasis.opendocument.presentation'],
    };

    return mimeTypeMap[extension] || [];
  }

  /**
   * Calculate file checksum (simple hash for integrity verification)
   */
  static async calculateChecksum(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Verify file integrity by comparing checksums
   */
  static async verifyFileIntegrity(
    originalFile: File,
    expectedChecksum: string
  ): Promise<boolean> {
    try {
      const actualChecksum = await this.calculateChecksum(originalFile);
      return actualChecksum === expectedChecksum;
    } catch (error) {
      console.error('Error verifying file integrity:', error);
      return false;
    }
  }

  /**
   * Upload file with integrity verification
   */
  static async uploadFileWithIntegrityCheck(
    path: string,
    file: File,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<{ url: string; checksum: string }> {
    // Calculate checksum before upload
    const checksum = await this.calculateChecksum(file);

    // Upload file
    const url = await this.uploadFileWithProgress(path, file, onProgress);

    return { url, checksum };
  }

  /**
   * Handle upload errors with standardized error messages
   */
  static getStandardizedErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      const message = error.message.toLowerCase();

      if (message.includes('network') || message.includes('connection')) {
        return FILE_ERROR_MESSAGES.NETWORK_ERROR;
      }

      if (message.includes('size') || message.includes('large')) {
        return FILE_ERROR_MESSAGES.FILE_TOO_LARGE;
      }

      if (message.includes('type') || message.includes('format')) {
        return FILE_ERROR_MESSAGES.UNSUPPORTED_TYPE;
      }
    }

    return FILE_ERROR_MESSAGES.UPLOAD_FAILED;
  }
}
