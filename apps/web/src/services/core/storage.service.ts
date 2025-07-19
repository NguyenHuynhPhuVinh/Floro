import { supabase } from '@/lib/supabase';

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
        console.error('Error uploading file:', error);
        throw new Error(`Failed to upload file: ${error.message}`);
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error in uploadFile:', error);
      throw error;
    }
  }

  /**
   * Upload file with progress tracking
   */
  static async uploadFileWithProgress(
    path: string,
    file: File,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<string> {
    // Note: Supabase doesn't have built-in progress tracking
    // This is a simplified implementation
    if (onProgress) {
      onProgress({ loaded: 0, total: file.size, progress: 0 });
    }

    try {
      const result = await this.uploadFile(path, file);

      if (onProgress) {
        onProgress({ loaded: file.size, total: file.size, progress: 100 });
      }

      return result;
    } catch (error) {
      console.error('Error uploading file with progress:', error);
      throw error;
    }
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
      console.error('Error deleting file:', error);
      throw new Error(`Failed to delete file: ${error.message}`);
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
      console.error('Error listing files:', error);
      throw new Error(`Failed to list files: ${error.message}`);
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
}
