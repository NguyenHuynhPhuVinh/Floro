'use client';

import type Konva from 'konva';
import React from 'react';
import { Stage } from 'react-konva';

import { NodesLayer } from './NodesLayer';

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
  sessionId?: string;
  onDeleteNode?: (nodeId: string) => void;
}

export const KonvaCanvas: React.FC<KonvaCanvasProps> = ({
  width,
  height,
  stageProps,
  sessionId = 'public',
  onDeleteNode,
}) => {
  return (
    <Stage width={width} height={height} {...stageProps}>
      <NodesLayer sessionId={sessionId} onDeleteNode={onDeleteNode} />
    </Stage>
  );
};

export default KonvaCanvas;
