import React from 'react';
import type { CanvasBackgroundProps } from './CanvasBackground';

/**
 * Grid background component that renders a grid pattern for the canvas.
 * Supports configurable grid size, color, and opacity with viewport awareness.
 */
export const GridBackground: React.FC<CanvasBackgroundProps> = ({
  size,
  color,
  opacity,
  viewport,
  width,
  height,
}) => {
  // Calculate grid offset based on viewport position
  const offsetX = (-viewport.x * viewport.scale) % (size * viewport.scale);
  const offsetY = (-viewport.y * viewport.scale) % (size * viewport.scale);

  // Calculate how many grid lines we need to cover the visible area
  const scaledSize = size * viewport.scale;
  const visibleWidth = width * viewport.scale;
  const visibleHeight = height * viewport.scale;
  
  const gridLinesX = Math.ceil(visibleWidth / scaledSize) + 2;
  const gridLinesY = Math.ceil(visibleHeight / scaledSize) + 2;

  // Generate grid lines
  const verticalLines = Array.from({ length: gridLinesX }, (_, i) => {
    const x = offsetX + i * scaledSize;
    return (
      <line
        key={`v-${i}`}
        x1={x}
        y1={0}
        x2={x}
        y2={visibleHeight}
        stroke={color}
        strokeWidth={1}
        opacity={opacity}
      />
    );
  });

  const horizontalLines = Array.from({ length: gridLinesY }, (_, i) => {
    const y = offsetY + i * scaledSize;
    return (
      <line
        key={`h-${i}`}
        x1={0}
        y1={y}
        x2={visibleWidth}
        y2={y}
        stroke={color}
        strokeWidth={1}
        opacity={opacity}
      />
    );
  });

  return (
    <svg
      className="absolute inset-0 w-full h-full"
      style={{
        overflow: 'visible',
      }}
    >
      <defs>
        <pattern
          id="grid-pattern"
          width={scaledSize}
          height={scaledSize}
          patternUnits="userSpaceOnUse"
          x={offsetX}
          y={offsetY}
        >
          <path
            d={`M ${scaledSize} 0 L 0 0 0 ${scaledSize}`}
            fill="none"
            stroke={color}
            strokeWidth={1}
            opacity={opacity}
          />
        </pattern>
      </defs>
      
      {/* Use pattern for better performance */}
      <rect
        width="100%"
        height="100%"
        fill="url(#grid-pattern)"
      />
      
      {/* Fallback: individual lines for better control */}
      <g style={{ display: 'none' }}>
        {verticalLines}
        {horizontalLines}
      </g>
    </svg>
  );
};

export default GridBackground;
