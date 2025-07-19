'use client';

import Konva from 'konva';
import { useCallback, useRef } from 'react';

import { useCanvasStore } from '../../store/canvas.store';

const ZOOM_SPEED = 0.1;
const MIN_ZOOM = 0.1;
const MAX_ZOOM = 5;

interface TouchState {
  lastDistance: number | null;
  lastCenter: { x: number; y: number } | null;
}

export const useCanvasZoom = (): {
  isZooming: boolean;
  zoomHandlers: {
    onWheel: (e: Konva.KonvaEventObject<WheelEvent>) => void;
    onTouchStart: (e: Konva.KonvaEventObject<TouchEvent>) => void;
    onTouchMove: (e: Konva.KonvaEventObject<TouchEvent>) => void;
    onTouchEnd: (e: Konva.KonvaEventObject<TouchEvent>) => void;
  };
  zoomAtPoint: (point: { x: number; y: number }, scaleBy: number) => void;
} => {
  const { viewport, isZooming, setZooming, updateScale, updatePosition } =
    useCanvasStore();
  const touchStateRef = useRef<TouchState>({
    lastDistance: null,
    lastCenter: null,
  });

  const getDistance = (touch1: Touch, touch2: Touch): number => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const getCenter = (
    touch1: Touch,
    touch2: Touch
  ): { x: number; y: number } => {
    return {
      x: (touch1.clientX + touch2.clientX) / 2,
      y: (touch1.clientY + touch2.clientY) / 2,
    };
  };

  const zoomAtPoint = useCallback(
    (pointer: { x: number; y: number }, scaleBy: number) => {
      const stage = {
        x: viewport.x,
        y: viewport.y,
        scaleX: viewport.scale,
        scaleY: viewport.scale,
      };

      const oldScale = stage.scaleX;
      const newScale = Math.max(
        MIN_ZOOM,
        Math.min(MAX_ZOOM, oldScale * scaleBy)
      );

      if (newScale === oldScale) return; // No change needed

      const mousePointTo = {
        x: (pointer.x - stage.x) / oldScale,
        y: (pointer.y - stage.y) / oldScale,
      };

      const newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
      };

      updateScale(newScale);
      updatePosition(newPos.x, newPos.y);
    },
    [viewport.x, viewport.y, viewport.scale, updateScale, updatePosition]
  );

  const handleWheel = useCallback(
    (e: Konva.KonvaEventObject<WheelEvent>) => {
      e.evt.preventDefault();

      const stage = e.target.getStage();
      if (!stage) return;

      const pointer = stage.getPointerPosition();
      if (!pointer) return;

      const scaleBy = e.evt.deltaY > 0 ? 1 - ZOOM_SPEED : 1 + ZOOM_SPEED;
      zoomAtPoint(pointer, scaleBy);
    },
    [zoomAtPoint]
  );

  // Touch events for pinch-to-zoom
  const handleTouchStart = useCallback(
    (e: Konva.KonvaEventObject<TouchEvent>) => {
      if (e.evt.touches.length === 2) {
        // Two touches - start pinch zoom
        const touch1 = e.evt.touches[0];
        const touch2 = e.evt.touches[1];

        touchStateRef.current = {
          lastDistance: getDistance(touch1, touch2),
          lastCenter: getCenter(touch1, touch2),
        };
        setZooming(true);
      }
    },
    [setZooming]
  );

  const handleTouchMove = useCallback(
    (e: Konva.KonvaEventObject<TouchEvent>) => {
      if (
        e.evt.touches.length === 2 &&
        touchStateRef.current.lastDistance &&
        touchStateRef.current.lastCenter
      ) {
        const touch1 = e.evt.touches[0];
        const touch2 = e.evt.touches[1];

        const newDistance = getDistance(touch1, touch2);
        const newCenter = getCenter(touch1, touch2);

        const scaleBy = newDistance / touchStateRef.current.lastDistance;

        // Convert screen coordinates to stage coordinates
        const stage = e.target.getStage();
        if (!stage) return;

        const stageBox = stage.container().getBoundingClientRect();
        const stagePointer = {
          x: newCenter.x - stageBox.left,
          y: newCenter.y - stageBox.top,
        };

        zoomAtPoint(stagePointer, scaleBy);

        touchStateRef.current = {
          lastDistance: newDistance,
          lastCenter: newCenter,
        };
      }
    },
    [zoomAtPoint]
  );

  const handleTouchEnd = useCallback(
    (e: Konva.KonvaEventObject<TouchEvent>) => {
      if (e.evt.touches.length < 2) {
        touchStateRef.current = {
          lastDistance: null,
          lastCenter: null,
        };
        setZooming(false);
      }
    },
    [setZooming]
  );

  return {
    isZooming,
    zoomHandlers: {
      onWheel: handleWheel,
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
    zoomAtPoint,
  };
};
