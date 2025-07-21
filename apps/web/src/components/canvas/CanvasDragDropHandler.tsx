'use client';

import React, { useCallback, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';

interface CanvasDragDropHandlerProps {
  onFileDrop: (files: File[], position: { x: number; y: number }) => void;
  onDragOver?: (e: DragEvent) => void;
  onDragLeave?: (e: DragEvent) => void;
  children: React.ReactNode;
  className?: string;
}

export function CanvasDragDropHandler({
  onFileDrop,
  onDragOver,
  onDragLeave,
  children,
  className = '',
}: CanvasDragDropHandlerProps): React.JSX.Element {
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation('fileUpload');

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setDragCounter(prev => prev + 1);

    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragOver(true);
    }
  }, []);

  const handleDragLeave = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      setDragCounter(prev => prev - 1);

      if (dragCounter <= 1) {
        setIsDragOver(false);
      }

      if (onDragLeave) {
        onDragLeave(e.nativeEvent);
      }
    },
    [dragCounter, onDragLeave]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      // Set the drop effect to copy
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'copy';
      }

      if (onDragOver) {
        onDragOver(e.nativeEvent);
      }
    },
    [onDragOver]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      setIsDragOver(false);
      setDragCounter(0);

      const files = Array.from(e.dataTransfer.files);

      if (files.length === 0) {
        return;
      }

      // Get drop position relative to the container
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) {
        return;
      }

      const position = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };

      onFileDrop(files, position);
    },
    [onFileDrop]
  );

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {children}

      {/* Drag overlay */}
      {isDragOver && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-primary/20 border-2 border-dashed border-primary pointer-events-none">
          <div className="bg-background/90 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-border">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-primary-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {t('dragDrop.title')}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t('dragDrop.subtitle')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
