'use client';

import dynamic from 'next/dynamic';
import React, { useRef, useEffect, useState, useMemo } from 'react';

import { useCanvasViewport } from '../../hooks/canvas/useCanvasViewport';
import { useFileUpload } from '../../hooks/nodes/useFileUpload';
import { FileUploadProgress } from '../nodes/FileUploadProgress';
import { CanvasDragDropHandler } from './CanvasDragDropHandler';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { useNodeDelete } from '../../hooks/nodes/useNodeDelete';
import { CanvasBackground } from './CanvasBackground';

// Dynamically import Konva wrapper to avoid SSR issues
const KonvaCanvas = dynamic(() => import('./KonvaCanvas'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-gray-800">
      <div className="text-gray-500 dark:text-gray-400">Loading Canvas...</div>
    </div>
  ),
});

interface CanvasContainerProps {
  className?: string;
}

const CanvasContainerComponent: React.FC<CanvasContainerProps> = ({
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const { stageProps, updateStageDimensions } = useCanvasViewport();
  const { uploadMultipleFiles, uploadProgress, cancelUpload } = useFileUpload();

  // Node deletion functionality
  const {
    deleteNode,
    showConfirmDialog,
    confirmDelete,
    cancelDelete,
    pendingDeletionCount,
  } = useNodeDelete();

  // Memoize stage dimensions to prevent unnecessary re-renders
  const stageDimensions = useMemo(
    () => ({
      width: dimensions.width,
      height: dimensions.height,
    }),
    [dimensions.width, dimensions.height]
  );

  useEffect(() => {
    const updateDimensions = (): void => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        const newDimensions = {
          width: clientWidth || 800,
          height: clientHeight || 600,
        };
        setDimensions(newDimensions);
        updateStageDimensions(newDimensions.width, newDimensions.height);
      }
    };

    // Initial size
    updateDimensions();

    // Listen for window resize
    window.addEventListener('resize', updateDimensions);

    return (): void => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, [updateStageDimensions]);

  const handleFileDrop = async (
    files: File[],
    position: { x: number; y: number }
  ): Promise<void> => {
    try {
      await uploadMultipleFiles(files, position);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to upload files:', error);
    }
  };

  return (
    <>
      <CanvasDragDropHandler
        onFileDrop={handleFileDrop}
        className={`w-full h-full ${className}`}
      >
        <div
          ref={containerRef}
          className="w-full h-full relative"
          style={{ minHeight: '400px' }}
        >
          {/* Canvas Background */}
          <CanvasBackground />

          {/* Main Canvas */}
          <KonvaCanvas
            width={stageDimensions.width}
            height={stageDimensions.height}
            stageProps={stageProps}
            sessionId="public"
            onDeleteNode={deleteNode}
          />
        </div>
      </CanvasDragDropHandler>

      {/* File Upload Progress */}
      <FileUploadProgress
        uploads={uploadProgress}
        onCancel={cancelUpload}
        position="top-right"
      />

      {/* Confirmation Dialog - Outside Konva context */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        title={`Delete ${pendingDeletionCount} Node${pendingDeletionCount > 1 ? 's' : ''}`}
        message={`Are you sure you want to delete ${pendingDeletionCount} node${pendingDeletionCount > 1 ? 's' : ''}? This action cannot be undone and will also remove associated files from storage.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        destructive={true}
      />
    </>
  );
};

// Memoize the component to prevent unnecessary re-renders
export const CanvasContainer = React.memo(CanvasContainerComponent);

export default CanvasContainer;
