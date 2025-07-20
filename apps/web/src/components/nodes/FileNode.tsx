'use client';

import { KonvaEventObject } from 'konva/lib/Node';
import React, { useState, useCallback } from 'react';
import { Group, Rect, Text, Circle, Path } from 'react-konva';

import { useFileDownload } from '../../hooks/nodes/useFileDownload';
import { useNodeDrag } from '../../hooks/nodes/useNodeDrag';
import { FileNode as FileNodeType } from '../../types';

import { FileNodeIcon } from './FileNodeIcon';

interface FileNodeProps {
  node: FileNodeType | null | undefined;
  isSelected?: boolean;
  isLoading?: boolean; // NEW: For operation feedback
  onSelect?: (nodeId: string, multiSelect?: boolean) => void;
  onDownload?: (node: FileNodeType) => void;
  onDelete?: (nodeId: string) => void;
  onContextMenu?: (nodeId: string, position: { x: number; y: number }) => void; // NEW
  scale: number; // Canvas zoom level
}

export function FileNode({
  node,
  isSelected = false,
  isLoading = false,
  onSelect,
  onDownload,
  onDelete,
  onContextMenu,
  scale,
}: FileNodeProps): React.JSX.Element {
  // Early return if node is null/undefined (during deletion)
  if (!node) {
    return <></>;
  }

  const [isHovered, setIsHovered] = useState(false);

  // Download functionality
  const { downloadFile } = useFileDownload();

  // Drag functionality
  const {
    handleDragStart,
    handleDragEnd,
    isLoading: isDragLoading,
  } = useNodeDrag();

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
    if (!fileName || typeof fileName !== 'string') return '';
    if (fileName.length <= maxLength) return fileName;

    const extension = fileName.split('.').pop();
    const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));
    const truncatedName =
      nameWithoutExt.substring(0, maxLength - (extension?.length || 0) - 4) +
      '...';

    return `${truncatedName}.${extension || ''}`;
  };

  // Calculate responsive sizing based on scale
  const scaledWidth = Math.max(180, node.size.width * scale);
  const scaledHeight = Math.max(60, node.size.height * scale);
  const fontSize = Math.max(12, 14 * scale);
  const iconSize = scale > 0.8 ? 'medium' : 'small';

  const handleKonvaClick = useCallback(
    async (e: KonvaEventObject<MouseEvent>): Promise<void> => {
      // Stop event propagation to prevent canvas interactions
      e.cancelBubble = true;

      // Check for platform-specific multi-select modifier
      const isMac =
        typeof navigator !== 'undefined' &&
        navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const isMultiSelect = isMac ? e.evt.metaKey : e.evt.ctrlKey;

      // If it's a double-click, trigger download
      if (e.evt.detail === 2) {
        try {
          await downloadFile(node);
          if (onDownload) {
            onDownload(node);
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Download failed:', error);
        }
      } else if (e.evt.button === 2) {
        // Right-click - context menu
        if (onContextMenu) {
          const stage = e.target.getStage();
          const pointerPosition = stage?.getPointerPosition();
          if (pointerPosition) {
            onContextMenu(node.id, pointerPosition);
          }
        }
      } else {
        // Single click - select node with multi-select support
        if (onSelect) {
          onSelect(node.id, isMultiSelect);
        }
      }
    },
    [node, onSelect, onDownload, onContextMenu, downloadFile]
  );

  const handleKonvaMouseDown = useCallback(() => {
    if (!node.isLocked) {
      // Konva drag will be handled by the Group's draggable prop
    }
  }, [node.isLocked]);

  return (
    <Group
      x={node.position.x}
      y={node.position.y}
      draggable={!node.isLocked}
      onClick={handleKonvaClick}
      onMouseDown={handleKonvaMouseDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      nodeId={node.id} // Custom attribute for drag system
    >
      {/* Main background */}
      <Rect
        width={scaledWidth}
        height={scaledHeight}
        fill={isLoading || isDragLoading ? '#f9fafb' : '#ffffff'}
        stroke={isSelected ? '#3b82f6' : '#e5e7eb'}
        strokeWidth={isSelected ? 2 : 1}
        cornerRadius={8}
        shadowColor="#000000"
        shadowBlur={isHovered ? 10 : 4}
        shadowOpacity={isHovered ? 0.15 : 0.1}
        shadowOffsetY={2}
        opacity={isLoading || isDragLoading ? 0.7 : 1}
      />

      {/* Selection highlight */}
      {isSelected && (
        <Rect
          x={-2}
          y={-2}
          width={scaledWidth + 4}
          height={scaledHeight + 4}
          fill="transparent"
          stroke="#3b82f6"
          strokeWidth={2}
          cornerRadius={10}
          shadowColor="#3b82f6"
          shadowBlur={8}
          shadowOpacity={0.2}
        />
      )}

      {/* File icon */}
      <FileNodeIcon
        fileType={node.fileType}
        size={iconSize}
        x={12}
        y={scaledHeight / 2 - 12}
      />

      {/* File name */}
      <Text
        text={truncateFileName(node.fileName)}
        x={48}
        y={scaledHeight / 2 - fontSize}
        fontSize={fontSize}
        fontFamily="Arial, sans-serif"
        fontStyle="bold"
        fill="#111827"
        width={scaledWidth - 80}
        ellipsis={true}
      />

      {/* File size */}
      <Text
        text={formatFileSize(node.fileSize)}
        x={48}
        y={scaledHeight / 2 + 4}
        fontSize={Math.max(10, fontSize - 2)}
        fontFamily="Arial, sans-serif"
        fill="#6b7280"
        width={scaledWidth - 80}
      />

      {/* Download icon (visible on hover) */}
      {isHovered && (
        <>
          <Circle
            x={scaledWidth - 20}
            y={scaledHeight / 2}
            radius={8}
            fill="#3b82f6"
            opacity={0.8}
          />
          <Path
            x={scaledWidth - 24}
            y={scaledHeight / 2 - 4}
            data="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"
            fill="none"
            stroke="#ffffff"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            scaleX={0.33}
            scaleY={0.33}
          />
          <Text
            text="Double-click to download"
            x={48}
            y={scaledHeight - 16}
            fontSize={Math.max(8, fontSize - 4)}
            fontFamily="Arial, sans-serif"
            fill="#9ca3af"
            width={scaledWidth - 60}
          />
        </>
      )}

      {/* Loading spinner */}
      {(isLoading || isDragLoading) && (
        <Circle
          x={scaledWidth - 20}
          y={20}
          radius={8}
          fill="#3b82f6"
          opacity={0.8}
        />
      )}

      {/* Lock indicator */}
      {node.isLocked && (
        <Text text="🔒" x={scaledWidth - 20} y={4} fontSize={12} />
      )}

      {/* File type badge for small scales */}
      {scale < 0.6 && (
        <>
          <Rect
            x={scaledWidth - 40}
            y={scaledHeight - 20}
            width={36}
            height={16}
            fill="#1f2937"
            cornerRadius={4}
          />
          <Text
            text={node.fileType.toUpperCase()}
            x={scaledWidth - 38}
            y={scaledHeight - 16}
            fontSize={10}
            fontFamily="Arial, sans-serif"
            fill="#ffffff"
          />
        </>
      )}
    </Group>
  );
}
