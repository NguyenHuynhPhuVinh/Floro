'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, X, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { FileUploadProgress as FileUploadProgressType } from '../../types';

interface FileUploadProgressProps {
  uploads: Record<string, FileUploadProgressType>;
  onCancel?: (fileId: string) => void;
  onClose?: () => void;
  position?: 'top-right' | 'bottom-right' | 'center';
}

export function FileUploadProgress({
  uploads,
  onCancel,
  onClose,
  position = 'top-right',
}: FileUploadProgressProps): React.JSX.Element | null {
  const [isVisible, setIsVisible] = useState(true);
  const { t } = useTranslation('fileUpload');
  const uploadList = Object.values(uploads);

  // Reset visibility when there are new uploads
  useEffect(() => {
    if (uploadList.length > 0) {
      setIsVisible(true);
    }
  }, [uploadList.length]);

  if (uploadList.length === 0 || !isVisible) {
    return null;
  }

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'bottom-right': 'bottom-4 right-4',
    center: 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
  };

  return (
    <div
      className={cn(
        'fixed z-50 w-80 max-h-96 overflow-y-auto',
        positionClasses[position]
      )}
    >
      <div className="bg-background rounded-lg shadow-lg border border-border p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-foreground">
            {t('progress.title')} ({uploadList.length})
          </h3>
          <div className="flex items-center gap-2">
            <div className="text-xs text-muted-foreground">
              {uploadList.filter(u => u.status === 'completed').length}{' '}
              {t('progress.completedCount')}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-6 w-6"
              title={t('progress.close')}
            >
              <X className="h-4 w-4" />
            </Button>
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
  const { t } = useTranslation('fileUpload');
  const getStatusIcon = (): React.JSX.Element | null => {
    switch (upload.status) {
      case 'uploading':
        return <Loader2 className="h-4 w-4 animate-spin text-primary" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-muted-foreground" />;
      default:
        return null;
    }
  };

  const getProgressColor = (): string => {
    switch (upload.status) {
      case 'uploading':
        return 'bg-primary';
      case 'completed':
        return 'bg-green-500';
      case 'error':
        return 'bg-destructive';
      case 'cancelled':
        return 'bg-muted';
      default:
        return 'bg-muted';
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
    <div className="border border-border rounded-lg p-3 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground truncate">
              {upload.fileName}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatFileSize(upload.loaded)} / {formatFileSize(upload.total)}
            </p>
          </div>
        </div>

        {upload.status === 'uploading' && onCancel && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onCancel(upload.fileId)}
            className="h-6 w-6"
            title={t('progress.cancel')}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Progress bar */}
      <Progress
        value={upload.progress}
        className="w-full"
        style={
          {
            '--progress-background': getProgressColor(),
          } as React.CSSProperties
        }
      />

      {/* Error message */}
      {upload.status === 'error' && upload.error && (
        <p className="text-xs text-destructive mt-1">
          {upload.error.includes('cancelled')
            ? t('errors.cancelled')
            : upload.error}
        </p>
      )}
    </div>
  );
}
