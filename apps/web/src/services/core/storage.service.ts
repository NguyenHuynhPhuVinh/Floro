import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
  getMetadata,
  updateMetadata,
  UploadTask,
  StorageReference,
} from 'firebase/storage';

import { storage } from '@/lib/firebase';

export interface UploadProgress {
  bytesTransferred: number;
  totalBytes: number;
  progress: number;
}

export interface FileMetadata {
  name: string;
  size: number;
  contentType: string;
  timeCreated: string;
  updated: string;
  downloadURL: string;
}

export class StorageService {
  /**
   * Upload a file to Firebase Storage
   */
  static async uploadFile(
    path: string,
    file: File | Blob,
    metadata?: Record<string, string>
  ): Promise<string> {
    try {
      const storageRef = ref(storage, path);
      const uploadResult = await uploadBytes(storageRef, file, {
        customMetadata: metadata,
      });

      return await getDownloadURL(uploadResult.ref);
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  /**
   * Upload a file with progress tracking
   */
  static uploadFileWithProgress(
    path: string,
    file: File | Blob,
    onProgress?: (progress: UploadProgress) => void,
    metadata?: Record<string, string>
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, path);
      const uploadTask = uploadBytesResumable(storageRef, file, {
        customMetadata: metadata,
      });

      uploadTask.on(
        'state_changed',
        snapshot => {
          if (onProgress) {
            const progress = {
              bytesTransferred: snapshot.bytesTransferred,
              totalBytes: snapshot.totalBytes,
              progress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
            };
            onProgress(progress);
          }
        },
        error => {
          console.error('Error uploading file:', error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  }

  /**
   * Get download URL for a file
   */
  static async getFileURL(path: string): Promise<string> {
    try {
      const storageRef = ref(storage, path);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error('Error getting file URL:', error);
      throw error;
    }
  }

  /**
   * Delete a file from Firebase Storage
   */
  static async deleteFile(path: string): Promise<void> {
    try {
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }

  /**
   * List all files in a directory
   */
  static async listFiles(path: string): Promise<FileMetadata[]> {
    try {
      const storageRef = ref(storage, path);
      const result = await listAll(storageRef);

      const filePromises = result.items.map(async itemRef => {
        const metadata = await getMetadata(itemRef);
        const downloadURL = await getDownloadURL(itemRef);

        return {
          name: metadata.name,
          size: metadata.size,
          contentType: metadata.contentType || 'unknown',
          timeCreated: metadata.timeCreated,
          updated: metadata.updated,
          downloadURL,
        };
      });

      return await Promise.all(filePromises);
    } catch (error) {
      console.error('Error listing files:', error);
      throw error;
    }
  }

  /**
   * Get file metadata
   */
  static async getFileMetadata(path: string): Promise<FileMetadata> {
    try {
      const storageRef = ref(storage, path);
      const metadata = await getMetadata(storageRef);
      const downloadURL = await getDownloadURL(storageRef);

      return {
        name: metadata.name,
        size: metadata.size,
        contentType: metadata.contentType || 'unknown',
        timeCreated: metadata.timeCreated,
        updated: metadata.updated,
        downloadURL,
      };
    } catch (error) {
      console.error('Error getting file metadata:', error);
      throw error;
    }
  }

  /**
   * Update file metadata
   */
  static async updateFileMetadata(
    path: string,
    metadata: Record<string, string>
  ): Promise<void> {
    try {
      const storageRef = ref(storage, path);
      await updateMetadata(storageRef, {
        customMetadata: metadata,
      });
    } catch (error) {
      console.error('Error updating file metadata:', error);
      throw error;
    }
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
