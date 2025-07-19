'use client';

import React from 'react';
import { FileCategory } from '../../types';

interface FileNodeIconProps {
  fileType: string;
  mimeType: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export function FileNodeIcon({
  fileType,
  mimeType,
  size = 'medium',
  className = '',
}: FileNodeIconProps): React.JSX.Element {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8',
  };

  const getFileCategory = (fileType: string): FileCategory => {
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
  ): { icon: React.JSX.Element; color: string } => {
    switch (category) {
      case 'document':
        return {
          icon: (
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                clipRule="evenodd"
              />
            </svg>
          ),
          color: 'text-red-500',
        };

      case 'image':
        return {
          icon: (
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                clipRule="evenodd"
              />
            </svg>
          ),
          color: 'text-green-500',
        };

      case 'archive':
        return {
          icon: (
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
          ),
          color: 'text-yellow-500',
        };

      case 'spreadsheet':
        return {
          icon: (
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z"
                clipRule="evenodd"
              />
            </svg>
          ),
          color: 'text-emerald-500',
        };

      case 'presentation':
        return {
          icon: (
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3 4a1 1 0 011-1h12a1 1 0 011 1v8a1 1 0 01-1 1h-5v2a1 1 0 01-1.707.707L7.586 14H4a1 1 0 01-1-1V4z"
                clipRule="evenodd"
              />
            </svg>
          ),
          color: 'text-orange-500',
        };

      case 'web-code':
        return {
          icon: (
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          ),
          color: 'text-blue-500',
        };

      case 'backend-code':
        return {
          icon: (
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z"
                clipRule="evenodd"
              />
              <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V9a1 1 0 00-1-1h-1v4a2 2 0 01-2 2H4.828a2 2 0 01-1.414-.586l-.828-.828A2 2 0 012 12.172V6a2 2 0 012-2h2V3a1 1 0 011-1h1a1 1 0 011 1v1h2a2 2 0 012 2v1z" />
            </svg>
          ),
          color: 'text-purple-500',
        };

      case 'mobile-code':
        return {
          icon: (
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zM8 5a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1zm1 9a1 1 0 100 2h2a1 1 0 100-2H9z"
                clipRule="evenodd"
              />
            </svg>
          ),
          color: 'text-pink-500',
        };

      case 'system-code':
        return {
          icon: (
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          ),
          color: 'text-gray-600',
        };

      case 'script-code':
        return {
          icon: (
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
          ),
          color: 'text-indigo-500',
        };

      case 'config-code':
        return {
          icon: (
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                clipRule="evenodd"
              />
            </svg>
          ),
          color: 'text-slate-500',
        };

      case 'data-file':
        return {
          icon: (
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15.586 13H14a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          ),
          color: 'text-cyan-500',
        };

      case 'text-file':
      default:
        return {
          icon: (
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                clipRule="evenodd"
              />
            </svg>
          ),
          color: 'text-gray-500',
        };
    }
  };

  const category = getFileCategory(fileType);
  const { icon, color } = getIconAndColor(category);

  return (
    <div className={`${sizeClasses[size]} ${color} ${className}`}>{icon}</div>
  );
}
