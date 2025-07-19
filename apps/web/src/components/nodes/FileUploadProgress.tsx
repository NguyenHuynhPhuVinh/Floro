'use client';

import React from 'react';
import { FileUploadProgress as FileUploadProgressType } from '../../types';

interface FileUploadProgressProps {
  uploads: Record<string, FileUploadProgressType>;
  onCancel?: (fileId: string) => void;
  position?: 'top-right' | 'bottom-right' | 'center';
}

export function FileUploadProgress({
  uploads,
  onCancel,
  position = 'top-right',
}: FileUploadProgressProps): React.JSX.Element | null {
  const uploadList = Object.values(uploads);

  if (uploadList.length === 0) {
    return null;
  }

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'bottom-right': 'bottom-4 right-4',
    center: 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
  };

  return (
    <div
      className={`fixed ${positionClasses[position]} z-50 w-80 max-h-96 overflow-y-auto`}
    >
      <div className="bg-white rounded-lg shadow-lg border p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900">
            File Uploads ({uploadList.length})
          </h3>
          <div className="text-xs text-gray-500">
            {uploadList.filter(u => u.status === 'completed').length} completed
          </div>
        </div>

        <div className="space-y-2">
          {uploadList.map(upload => (
            <FileUploadItem
              key={upload.fileId}
              upload={upload}
              onCancel={onCancel}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface FileUploadItemProps {
  upload: FileUploadProgressType;
  onCancel?: (fileId: string) => void;
}

function FileUploadItem({
  upload,
  onCancel,
}: FileUploadItemProps): React.JSX.Element {
  const getStatusIcon = () => {
    switch (upload.status) {
      case 'uploading':
        return (
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        );
      case 'completed':
        return (
          <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
            <svg
              className="w-2.5 h-2.5 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
            <svg
              className="w-2.5 h-2.5 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        );
      case 'cancelled':
        return (
          <div className="w-4 h-4 rounded-full bg-gray-500 flex items-center justify-center">
            <svg
              className="w-2.5 h-2.5 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (upload.status) {
      case 'uploading':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'cancelled':
        return 'bg-gray-500';
      default:
        return 'bg-gray-300';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="border rounded-lg p-3 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900 truncate">
              {upload.fileName}
            </p>
            <p className="text-xs text-gray-500">
              {formatFileSize(upload.loaded)} / {formatFileSize(upload.total)}
            </p>
          </div>
        </div>

        {upload.status === 'uploading' && onCancel && (
          <button
            onClick={() => onCancel(upload.fileId)}
            className="text-gray-400 hover:text-gray-600 p-1"
            title="Cancel upload"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${getStatusColor()}`}
          style={{ width: `${upload.progress}%` }}
        />
      </div>

      {/* Error message */}
      {upload.status === 'error' && upload.error && (
        <p className="text-xs text-red-600 mt-1">{upload.error}</p>
      )}
    </div>
  );
}
