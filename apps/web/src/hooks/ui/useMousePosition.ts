'use client';
import { useState, useEffect } from 'react';

export interface MousePosition {
  x: number;
  y: number;
}

/**
 * Hook to track mouse position relative to the viewport.
 * Returns current mouse coordinates that update on mouse movement.
 */
export const useMousePosition = (): MousePosition => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({
        x: event.clientX,
        y: event.clientY,
      });
    };

    // Add event listener
    window.addEventListener('mousemove', handleMouseMove);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return mousePosition;
};

export default useMousePosition;
