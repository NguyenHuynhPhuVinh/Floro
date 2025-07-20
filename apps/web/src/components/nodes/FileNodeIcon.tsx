'use client';

import React from 'react';
import { Group, Circle, Path } from 'react-konva';

import { FileCategory } from '../../types';

interface FileNodeIconProps {
  fileType: string | undefined | null;
  size?: 'small' | 'medium' | 'large';
  x?: number;
  y?: number;
}

export function FileNodeIcon({
  fileType,
  size = 'medium',
  x = 0,
  y = 0,
}: FileNodeIconProps): React.JSX.Element {
  const sizeMap = {
    small: 16,
    medium: 24,
    large: 32,
  };

  const iconSize = sizeMap[size];

  const getFileCategory = (
    fileType: string | undefined | null
  ): FileCategory => {
    if (!fileType || typeof fileType !== 'string') {
      return 'text-file';
    }
    const extension = fileType.toLowerCase();

    // Documents
    if (['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt'].includes(extension))
      return 'document';

    // Images
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension))
      return 'image';

    // Archives
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension)) return 'archive';

    // Code files
    if (
      [
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
      ].includes(extension)
    )
      return 'web-code';
    if (
      [
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
      ].includes(extension)
    )
      return 'backend-code';
    if (['swift', 'm', 'dart', 'xaml'].includes(extension))
      return 'mobile-code';
    if (['c', 'cpp', 'h', 'hpp', 'cc', 'cxx'].includes(extension))
      return 'system-code';
    if (['sh', 'bat', 'ps1', 'cmd', 'zsh', 'fish'].includes(extension))
      return 'script-code';
    if (['ini', 'conf', 'cfg', 'toml', 'properties', 'env'].includes(extension))
      return 'config-code';

    // Data files
    if (['json', 'xml', 'yaml', 'yml', 'csv', 'sql'].includes(extension))
      return 'data-file';

    // Spreadsheets
    if (['xls', 'xlsx', 'ods'].includes(extension)) return 'spreadsheet';

    // Presentations
    if (['ppt', 'pptx', 'odp'].includes(extension)) return 'presentation';

    // Text files
    if (['md', 'txt', 'rtf', 'log'].includes(extension)) return 'text-file';

    return 'text-file';
  };

  const getIconAndColor = (
    category: FileCategory
  ): { pathData: string; color: string } => {
    switch (category) {
      case 'document':
        return {
          // Lucide File-Text icon
          pathData:
            'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM14 2v6h6M16 13H8M16 17H8M10 9H8',
          color: '#ef4444',
        };

      case 'image':
        return {
          // Lucide Image icon
          pathData:
            'M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2zM8.5 8.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM3 21l6-6 4 4 6-6',
          color: '#22c55e',
        };

      case 'archive':
        return {
          // Lucide Archive icon
          pathData: 'M21 8v13H3V8M1 3h22v5H1zM10 12h4',
          color: '#eab308',
        };

      case 'spreadsheet':
        return {
          // Lucide Table icon
          pathData: 'M3 3h18v18H3zM21 9H3M21 15H3M12 3v18',
          color: '#10b981',
        };

      case 'presentation':
        return {
          // Lucide Presentation icon
          pathData: 'M2 3h20v14H2zM2 17l4 4M22 17l-4 4M12 9v4M9 11h6',
          color: '#f97316',
        };

      case 'web-code':
        return {
          // Lucide Code icon
          pathData: 'M16 18l6-6-6-6M8 6l-6 6 6 6',
          color: '#3b82f6',
        };

      case 'backend-code':
        return {
          // Lucide Server icon
          pathData:
            'M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM6 7h.01M6 10h.01M6 13h.01',
          color: '#a855f7',
        };

      case 'mobile-code':
        return {
          // Lucide Smartphone icon
          pathData:
            'M5 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM9 18h.01',
          color: '#ec4899',
        };

      case 'system-code':
        return {
          // Lucide Terminal icon
          pathData: 'M4 17l6-6-6-6M12 19h8',
          color: '#4b5563',
        };

      case 'script-code':
        return {
          // Lucide FileCode icon
          pathData:
            'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM14 2v6h6M10 13l-2 2 2 2M14 13l2 2-2 2',
          color: '#6366f1',
        };

      case 'config-code':
        return {
          // Lucide Settings icon
          pathData:
            'M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2zM12 15a3 3 0 1 1 0-6 3 3 0 0 1 0 6z',
          color: '#64748b',
        };

      case 'data-file':
        return {
          // Lucide Database icon
          pathData:
            'M4 6c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2v2c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V6zM4 14c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2v2c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2v-2z',
          color: '#06b6d4',
        };

      case 'text-file':
      default:
        return {
          // Lucide FileText icon
          pathData:
            'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM14 2v6h6M16 13H8M16 17H8M10 9H8',
          color: '#6b7280',
        };
    }
  };

  const category = getFileCategory(fileType);
  const { pathData, color } = getIconAndColor(category);

  return (
    <Group x={x} y={y}>
      {/* Background circle */}
      <Circle
        x={iconSize / 2}
        y={iconSize / 2}
        radius={iconSize / 2}
        fill="#ffffff"
        stroke="#e5e7eb"
        strokeWidth={1}
      />
      {/* Lucide icon path */}
      <Path
        x={iconSize * 0.15}
        y={iconSize * 0.15}
        data={pathData}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        scaleX={iconSize / 24}
        scaleY={iconSize / 24}
      />
    </Group>
  );
}
