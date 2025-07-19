'use client';
import type Konva from 'konva';
import React from 'react';
import { Stage, Layer } from 'react-konva';

interface StageProps {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  onMouseDown: (e: Konva.KonvaEventObject<MouseEvent>) => void;
  onMouseMove: (e: Konva.KonvaEventObject<MouseEvent>) => void;
  onMouseUp: () => void;
  onWheel: (e: Konva.KonvaEventObject<WheelEvent>) => void;
  onTouchStart: (e: Konva.KonvaEventObject<TouchEvent>) => void;
  onTouchMove: (e: Konva.KonvaEventObject<TouchEvent>) => void;
  onTouchEnd: (e: Konva.KonvaEventObject<TouchEvent>) => void;
}

interface KonvaCanvasProps {
  width: number;
  height: number;
  stageProps: StageProps;
}

export const KonvaCanvas: React.FC<KonvaCanvasProps> = ({
  width,
  height,
  stageProps,
}) => {
  return (
    <Stage width={width} height={height} {...stageProps}>
      <Layer>{/* Canvas content will be added here */}</Layer>
    </Stage>
  );
};

export default KonvaCanvas;
