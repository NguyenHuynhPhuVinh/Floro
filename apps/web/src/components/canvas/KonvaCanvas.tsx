'use client';

import React from 'react';
import { Stage, Layer } from 'react-konva';

interface KonvaCanvasProps {
  width: number;
  height: number;
  stageProps: any;
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
