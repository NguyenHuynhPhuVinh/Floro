import { useState, useCallback, useRef } from 'react';

import { NodeService } from '../../services/core/node.service';

export interface UseNodeDragReturn {
  isDragging: boolean;
  dragOffset: { x: number; y: number };
  handleDragStart: (e: React.MouseEvent, nodeId: string) => void;
  handleDragEnd: () => void;
  handleDragMove: (e: React.MouseEvent) => void;
}

export interface DragState {
  nodeId: string;
  startPosition: { x: number; y: number };
  offset: { x: number; y: number };
}

export function useNodeDrag(
  onPositionUpdate?: (
    nodeId: string,
    position: { x: number; y: number }
  ) => void
): UseNodeDragReturn {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const dragStateRef = useRef<DragState | null>(null);

  const handleDragStart = useCallback(
    (e: React.MouseEvent, nodeId: string) => {
      e.preventDefault();
      e.stopPropagation();

      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const offset = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };

      dragStateRef.current = {
        nodeId,
        startPosition: { x: e.clientX, y: e.clientY },
        offset,
      };

      setIsDragging(true);
      setDragOffset(offset);

      // Add global mouse event listeners
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      // Prevent text selection during drag
      document.body.style.userSelect = 'none';
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragStateRef.current) return;

      const { nodeId, offset } = dragStateRef.current;
      const newPosition = {
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      };

      // Update position immediately for smooth dragging
      if (onPositionUpdate) {
        onPositionUpdate(nodeId, newPosition);
      }
    },
    [onPositionUpdate]
  );

  const handleMouseUp = useCallback(async () => {
    if (!dragStateRef.current) return;

    const { nodeId } = dragStateRef.current;

    try {
      // Get the final position from the DOM element
      const element = document.querySelector(
        `[data-node-id="${nodeId}"]`
      ) as HTMLElement;
      if (element) {
        const rect = element.getBoundingClientRect();
        const finalPosition = {
          x: rect.left,
          y: rect.top,
        };

        // Update position in database
        await NodeService.updateNode(nodeId, {
          position: finalPosition,
        });
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to update node position:', error);
      // You might want to show an error message to the user
    }

    // Clean up
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
    dragStateRef.current = null;

    // Remove global event listeners
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);

    // Restore text selection
    document.body.style.userSelect = '';
  }, [handleMouseMove]);

  const handleDragEnd = useCallback(() => {
    handleMouseUp();
  }, [handleMouseUp]);

  const handleDragMove = useCallback((e: React.MouseEvent) => {
    // This is for compatibility with other drag systems
    // The actual drag handling is done through global mouse events
    e.preventDefault();
  }, []);

  return {
    isDragging,
    dragOffset,
    handleDragStart,
    handleDragEnd,
    handleDragMove,
  };
}
