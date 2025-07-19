'use client';

import Konva from 'konva';
import { useCallback, useRef } from 'react';

import { useCanvasStore } from '../../store/canvas.store';

interface PanState {
  isDragging: boolean;
  lastPointerPosition: { x: number; y: number } | null;
}

export const useCanvasPan = (): {
  isDragging: boolean;
  panHandlers: {
    onMouseDown: (e: Konva.KonvaEventObject<MouseEvent>) => void;
    onMouseMove: (e: Konva.KonvaEventObject<MouseEvent>) => void;
    onMouseUp: () => void;
    onTouchStart: (e: Konva.KonvaEventObject<TouchEvent>) => void;
    onTouchMove: (e: Konva.KonvaEventObject<TouchEvent>) => void;
    onTouchEnd: () => void;
  };
} => {
  const { viewport, isDragging, setDragging, updatePosition } =
    useCanvasStore();
  const panStateRef = useRef<PanState>({
    isDragging: false,
    lastPointerPosition: null,
  });

  const handleMouseDown = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      // Only start panning if clicking on empty space (stage)
      if (e.target === e.target.getStage()) {
        const stage = e.target.getStage();
        if (!stage) return;

        const pos = stage.getPointerPosition();
        if (!pos) return;

        panStateRef.current = {
          isDragging: true,
          lastPointerPosition: pos,
        };
        setDragging(true);
      }
    },
    [setDragging]
  );

  const handleMouseMove = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (
        !panStateRef.current.isDragging ||
        !panStateRef.current.lastPointerPosition
      ) {
        return;
      }

      const stage = e.target.getStage();
      if (!stage) return;

      const pos = stage.getPointerPosition();
      if (!pos) return;

      const dx = pos.x - panStateRef.current.lastPointerPosition.x;
      const dy = pos.y - panStateRef.current.lastPointerPosition.y;

      const newX = viewport.x + dx;
      const newY = viewport.y + dy;

      updatePosition(newX, newY);
      panStateRef.current.lastPointerPosition = pos;
    },
    [viewport.x, viewport.y, updatePosition]
  );

  const handleMouseUp = useCallback(() => {
    panStateRef.current = {
      isDragging: false,
      lastPointerPosition: null,
    };
    setDragging(false);
  }, [setDragging]);

  // Touch events for mobile support
  const handleTouchStart = useCallback(
    (e: Konva.KonvaEventObject<TouchEvent>) => {
      if (e.evt.touches.length === 1) {
        // Single touch - treat as pan
        if (e.target === e.target.getStage()) {
          const stage = e.target.getStage();
          if (!stage) return;

          const pos = stage.getPointerPosition();
          if (!pos) return;

          panStateRef.current = {
            isDragging: true,
            lastPointerPosition: pos,
          };
          setDragging(true);
        }
      }
    },
    [setDragging]
  );

  const handleTouchMove = useCallback(
    (e: Konva.KonvaEventObject<TouchEvent>) => {
      if (
        e.evt.touches.length === 1 &&
        panStateRef.current.isDragging &&
        panStateRef.current.lastPointerPosition
      ) {
        const stage = e.target.getStage();
        if (!stage) return;

        const pos = stage.getPointerPosition();
        if (!pos) return;

        const dx = pos.x - panStateRef.current.lastPointerPosition.x;
        const dy = pos.y - panStateRef.current.lastPointerPosition.y;

        const newX = viewport.x + dx;
        const newY = viewport.y + dy;

        updatePosition(newX, newY);
        panStateRef.current.lastPointerPosition = pos;
      }
    },
    [viewport.x, viewport.y, updatePosition]
  );

  const handleTouchEnd = useCallback(() => {
    panStateRef.current = {
      isDragging: false,
      lastPointerPosition: null,
    };
    setDragging(false);
  }, [setDragging]);

  return {
    isDragging,
    panHandlers: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
  };
};
