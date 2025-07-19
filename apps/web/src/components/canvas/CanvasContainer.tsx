'use client';

import dynamic from 'next/dynamic';
import React, { useRef, useEffect, useState, useMemo } from 'react';

import { useCanvasViewport } from '../../hooks/canvas/useCanvasViewport';

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

  return (
    <div
      ref={containerRef}
      className={`w-full h-full ${className}`}
      style={{ minHeight: '400px' }}
    >
      <KonvaCanvas
        width={stageDimensions.width}
        height={stageDimensions.height}
        stageProps={stageProps}
      />
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export const CanvasContainer = React.memo(CanvasContainerComponent);

export default CanvasContainer;
