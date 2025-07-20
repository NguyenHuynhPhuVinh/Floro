import { useState, useCallback } from 'react';

import { FileNode } from '../../types';

export interface UseFileDownloadReturn {
  downloadFile: (fileNode: FileNode) => Promise<void>;
  isDownloading: boolean;
  downloadProgress: number;
  downloadError: string | null;
}

export function useFileDownload(): UseFileDownloadReturn {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const downloadFile = useCallback(
    async (fileNode: FileNode): Promise<void> => {
      setIsDownloading(true);
      setDownloadProgress(0);
      setDownloadError(null);

      try {
        // Create a progress tracking fetch
        const response = await fetch(fileNode.fileURL);

        if (!response.ok) {
          throw new Error(`Failed to download file: ${response.statusText}`);
        }

        const contentLength = response.headers.get('content-length');
        const total = contentLength
          ? parseInt(contentLength, 10)
          : fileNode.fileSize;

        if (!response.body) {
          throw new Error('Response body is not available');
        }

        const reader = response.body.getReader();
        const chunks: Uint8Array[] = [];
        let loaded = 0;

        // Read the response stream with progress tracking
        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          chunks.push(value);
          loaded += value.length;

          // Update progress
          const progress = total > 0 ? Math.round((loaded / total) * 100) : 0;
          setDownloadProgress(progress);
        }

        // Combine all chunks into a single Uint8Array
        const totalLength = chunks.reduce(
          (acc, chunk) => acc + chunk.length,
          0
        );
        const combinedChunks = new Uint8Array(totalLength);
        let offset = 0;

        for (const chunk of chunks) {
          combinedChunks.set(chunk, offset);
          offset += chunk.length;
        }

        // Create blob and download
        const blob = new Blob([combinedChunks], {
          type: fileNode.mimeType || 'application/octet-stream',
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileNode.fileName;

        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up
        URL.revokeObjectURL(url);

        setDownloadProgress(100);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown download error';
        setDownloadError(errorMessage);
        // eslint-disable-next-line no-console
        console.error('Download failed:', error);

        // Fallback: try direct download via window.open
        try {
          const link = document.createElement('a');
          link.href = fileNode.fileURL;
          link.download = fileNode.fileName;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';

          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          setDownloadError(null); // Clear error if fallback works
        } catch (fallbackError) {
          // eslint-disable-next-line no-console
          console.error('Fallback download also failed:', fallbackError);
        }
      } finally {
        setIsDownloading(false);
      }
    },
    []
  );

  return {
    downloadFile,
    isDownloading,
    downloadProgress,
    downloadError,
  };
}
