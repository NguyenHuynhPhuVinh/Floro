'use client';

import React, { useState, useCallback } from 'react';
import { FileNode as FileNodeType } from '../../types';
import { FileNodeIcon } from './FileNodeIcon';
import { useNodeDrag } from '../../hooks/nodes/useNodeDrag';
import { useFileDownload } from '../../hooks/nodes/useFileDownload';

interface FileNodeProps {
  node: FileNodeType;
  isSelected?: boolean;
  onSelect?: (nodeId: string) => void;
  onDownload?: (node: FileNodeType) => void;
  onDelete?: (nodeId: string) => void;
  onPositionUpdate?: (
    nodeId: string,
    position: { x: number; y: number }
  ) => void;
  scale: number; // Canvas zoom level
}

export function FileNode({
  node,
  isSelected = false,
  onSelect,
  onDownload,
  onDelete,
  onPositionUpdate,
  scale,
}: FileNodeProps): React.JSX.Element {
  const [isHovered, setIsHovered] = useState(false);

  // Drag functionality
  const { isDragging, handleDragStart } = useNodeDrag(onPositionUpdate);

  // Download functionality
  const { downloadFile, isDownloading, downloadProgress } = useFileDownload();

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onSelect) {
        onSelect(node.id);
      }
    },
    [node.id, onSelect]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!node.isLocked && e.button === 0) {
        // Left mouse button only
        handleDragStart(e, node.id);
      }
    },
    [node.isLocked, node.id, handleDragStart]
  );

  const handleDownload = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      try {
        await downloadFile(node);
        if (onDownload) {
          onDownload(node);
        }
      } catch (error) {
        console.error('Download failed:', error);
        // You might want to show a toast notification here
      }
    },
    [node, onDownload, downloadFile]
  );

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onDelete) {
        onDelete(node.id);
      }
    },
    [node.id, onDelete]
  );

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const truncateFileName = (
    fileName: string,
    maxLength: number = 25
  ): string => {
    if (fileName.length <= maxLength) return fileName;

    const extension = fileName.split('.').pop();
    const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));
    const truncatedName =
      nameWithoutExt.substring(0, maxLength - extension!.length - 4) + '...';

    return `${truncatedName}.${extension}`;
  };

  // Calculate responsive sizing based on scale
  const scaledWidth = Math.max(180, node.size.width * scale);
  const scaledHeight = Math.max(60, node.size.height * scale);
  const fontSize = Math.max(12, 14 * scale);
  const iconSize = scale > 0.8 ? 'medium' : 'small';

  return (
    <div
      className={`
        absolute bg-white rounded-lg border-2 shadow-lg transition-all duration-200
        ${isSelected ? 'border-blue-500 shadow-blue-200' : 'border-gray-200 hover:border-gray-300'}
        ${isHovered ? 'shadow-xl' : ''}
        ${isDragging ? 'cursor-grabbing shadow-2xl scale-105' : node.isLocked ? 'cursor-not-allowed opacity-75' : 'cursor-grab'}
      `}
      style={{
        left: node.position.x,
        top: node.position.y,
        width: scaledWidth,
        height: scaledHeight,
        zIndex: isDragging ? 9999 : node.zIndex,
      }}
      data-node-id={node.id}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main content */}
      <div className="flex items-center p-3 h-full">
        {/* File icon */}
        <div className="flex-shrink-0 mr-3">
          <FileNodeIcon
            fileType={node.fileType}
            mimeType={node.mimeType}
            size={iconSize}
          />
        </div>

        {/* File info */}
        <div className="flex-1 min-w-0">
          <div
            className="font-medium text-gray-900 truncate"
            style={{ fontSize }}
            title={node.fileName}
          >
            {truncateFileName(node.fileName)}
          </div>
          <div
            className="text-gray-500 text-xs mt-1"
            style={{ fontSize: Math.max(10, fontSize - 2) }}
          >
            {formatFileSize(node.fileSize)}
          </div>
        </div>

        {/* Action buttons (visible on hover or selection) */}
        {(isHovered || isSelected) && (
          <div className="flex-shrink-0 ml-2 flex space-x-1">
            {/* Download button */}
            {onDownload && (
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className={`p-1 rounded transition-colors ${
                  isDownloading
                    ? 'text-blue-500 cursor-not-allowed'
                    : 'hover:bg-gray-100 text-gray-600 hover:text-blue-600'
                }`}
                title={
                  isDownloading
                    ? `Downloading... ${downloadProgress}%`
                    : 'Download file'
                }
              >
                {isDownloading ? (
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                )}
              </button>
            )}

            {/* Delete button */}
            {onDelete && !node.isLocked && (
              <button
                onClick={handleDelete}
                className="p-1 rounded hover:bg-red-50 text-gray-600 hover:text-red-600 transition-colors"
                title="Delete file node"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white" />
      )}

      {/* Lock indicator */}
      {node.isLocked && (
        <div className="absolute top-1 right-1">
          <svg
            className="w-3 h-3 text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}

      {/* File type badge (visible at smaller scales) */}
      {scale < 0.6 && (
        <div className="absolute bottom-1 right-1 bg-gray-800 text-white text-xs px-1 py-0.5 rounded">
          {node.fileType.toUpperCase()}
        </div>
      )}
    </div>
  );
}
