import { useState, useCallback } from 'react';
import { StorageService } from '../../services/core/storage.service';
import { NodeService } from '../../services/core/node.service';
import { useNodesStore } from '../../store/nodes.store';
import {
  FileNode,
  FileUploadProgress,
  FileValidationResult,
  FILE_ERROR_MESSAGES,
} from '../../types';

export interface UseFileUploadReturn {
  uploadFile: (
    file: File,
    position: { x: number; y: number }
  ) => Promise<FileNode>;
  uploadProgress: Record<string, FileUploadProgress>;
  isUploading: boolean;
  cancelUpload: (fileId: string) => void;
  uploadMultipleFiles: (
    files: File[],
    position: { x: number; y: number }
  ) => Promise<FileNode[]>;
}

export function useFileUpload(): UseFileUploadReturn {
  const [uploadProgress, setUploadProgress] = useState<
    Record<string, FileUploadProgress>
  >({});
  const [isUploading, setIsUploading] = useState(false);
  const [cancelledUploads, setCancelledUploads] = useState<Set<string>>(
    new Set()
  );

  const { addNode } = useNodesStore();

  const generateFileId = useCallback(() => {
    return `file_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  }, []);

  const updateProgress = useCallback(
    (fileId: string, progress: Partial<FileUploadProgress>) => {
      setUploadProgress(prev => ({
        ...prev,
        [fileId]: { ...prev[fileId], ...progress } as FileUploadProgress,
      }));
    },
    []
  );

  const cancelUpload = useCallback(
    (fileId: string) => {
      setCancelledUploads(prev => new Set(prev).add(fileId));
      updateProgress(fileId, {
        status: 'cancelled',
        error: 'Upload cancelled by user',
      });
    },
    [updateProgress]
  );

  const uploadFile = useCallback(
    async (
      file: File,
      position: { x: number; y: number }
    ): Promise<FileNode> => {
      const fileId = generateFileId();

      // Initialize progress
      updateProgress(fileId, {
        fileId,
        fileName: file.name,
        loaded: 0,
        total: file.size,
        progress: 0,
        status: 'uploading',
      });

      setIsUploading(true);

      try {
        // Validate file
        const validation: FileValidationResult =
          StorageService.validateFile(file);
        if (!validation.isValid) {
          updateProgress(fileId, {
            status: 'error',
            error: validation.error,
          });
          throw new Error(validation.error);
        }

        // Check if upload was cancelled
        if (cancelledUploads.has(fileId)) {
          throw new Error('Upload cancelled');
        }

        // Generate unique file path
        const filePath = StorageService.generateFilePath('files', file.name);

        // Upload file with integrity verification and progress tracking
        const { url: fileURL, checksum } =
          await StorageService.uploadFileWithIntegrityCheck(
            filePath,
            file,
            progress => {
              if (cancelledUploads.has(fileId)) {
                return; // Don't update progress for cancelled uploads
              }

              updateProgress(fileId, {
                loaded: progress.loaded,
                total: progress.total,
                progress: progress.progress,
              });
            }
          );

        // Check if upload was cancelled during upload
        if (cancelledUploads.has(fileId)) {
          // Clean up uploaded file
          await StorageService.deleteFile(filePath);
          throw new Error('Upload cancelled');
        }

        // Create FileNode in database
        const fileNode = await NodeService.createFileNode(
          {
            fileName: file.name,
            fileType:
              validation.fileType || file.name.split('.').pop() || 'unknown',
            fileURL,
            fileSize: file.size,
            mimeType: validation.mimeType || file.type,
            checksum,
          },
          position
        );

        // Add node to store for immediate UI update
        addNode(fileNode);

        // Mark upload as completed
        updateProgress(fileId, {
          status: 'completed',
          progress: 100,
          loaded: file.size,
        });

        return fileNode;
      } catch (error) {
        const errorMessage = StorageService.getStandardizedErrorMessage(error);

        updateProgress(fileId, {
          status: 'error',
          error: errorMessage,
        });

        throw error;
      } finally {
        setIsUploading(false);
        // Clean up cancelled uploads from state
        setCancelledUploads(prev => {
          const newSet = new Set(prev);
          newSet.delete(fileId);
          return newSet;
        });
      }
    },
    [generateFileId, updateProgress, cancelledUploads]
  );

  const uploadMultipleFiles = useCallback(
    async (
      files: File[],
      position: { x: number; y: number }
    ): Promise<FileNode[]> => {
      const results: FileNode[] = [];
      const errors: string[] = [];

      setIsUploading(true);

      try {
        // Upload files sequentially to avoid overwhelming the server
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          // Offset position for each file to avoid overlap
          const filePosition = {
            x: position.x + i * 20,
            y: position.y + i * 20,
          };

          try {
            const fileNode = await uploadFile(file, filePosition);
            results.push(fileNode);
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : 'Unknown error';
            errors.push(`${file.name}: ${errorMessage}`);
          }
        }

        if (errors.length > 0) {
          const successCount = results.length;
          const failCount = errors.length;
          const errorMessage = `Uploading ${files.length} files. ${successCount} completed, ${failCount} failed.`;

          // You might want to show this error to the user
          console.warn(errorMessage, errors);
        }

        return results;
      } finally {
        setIsUploading(false);
      }
    },
    [uploadFile]
  );

  return {
    uploadFile,
    uploadProgress,
    isUploading,
    cancelUpload,
    uploadMultipleFiles,
  };
}
