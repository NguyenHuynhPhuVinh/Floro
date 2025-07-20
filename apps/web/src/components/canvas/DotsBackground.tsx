import React from 'react';
import type { CanvasBackgroundProps } from './CanvasBackground';

/**
 * Dots background component that renders a dot pattern for the canvas.
 * Supports configurable dot size, spacing, color, and opacity with viewport awareness.
 */
export const DotsBackground: React.FC<CanvasBackgroundProps> = ({
  size,
  color,
  opacity,
  viewport,
  width,
  height,
}) => {
  // Calculate dot offset based on viewport position
  const offsetX = (-viewport.x * viewport.scale) % (size * viewport.scale);
  const offsetY = (-viewport.y * viewport.scale) % (size * viewport.scale);

  // Calculate scaled values
  const scaledSize = size * viewport.scale;
  const dotRadius = Math.max(1, viewport.scale * 1.5); // Minimum 1px, scales with zoom
  
  // Calculate visible area
  const visibleWidth = width * viewport.scale;
  const visibleHeight = height * viewport.scale;
  
  const dotsX = Math.ceil(visibleWidth / scaledSize) + 2;
  const dotsY = Math.ceil(visibleHeight / scaledSize) + 2;

  // Generate dots
  const dots = [];
  for (let i = 0; i < dotsX; i++) {
    for (let j = 0; j < dotsY; j++) {
      const x = offsetX + i * scaledSize;
      const y = offsetY + j * scaledSize;
      
      dots.push(
        <circle
          key={`dot-${i}-${j}`}
          cx={x}
          cy={y}
          r={dotRadius}
          fill={color}
          opacity={opacity}
        />
      );
    }
  }

  return (
    <svg
      className="absolute inset-0 w-full h-full"
      style={{
        overflow: 'visible',
      }}
    >
      <defs>
        <pattern
          id="dots-pattern"
          width={scaledSize}
          height={scaledSize}
          patternUnits="userSpaceOnUse"
          x={offsetX}
          y={offsetY}
        >
          <circle
            cx={scaledSize / 2}
            cy={scaledSize / 2}
            r={dotRadius}
            fill={color}
            opacity={opacity}
          />
        </pattern>
      </defs>
      
      {/* Use pattern for better performance */}
      <rect
        width="100%"
        height="100%"
        fill="url(#dots-pattern)"
      />
      
      {/* Fallback: individual dots for better control */}
      <g style={{ display: 'none' }}>
        {dots}
      </g>
    </svg>
  );
};

export default DotsBackground;
