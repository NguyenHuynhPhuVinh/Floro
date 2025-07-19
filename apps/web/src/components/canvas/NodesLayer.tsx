import React from 'react';
import { Layer } from 'react-konva';
import { FileNode } from '../../components/nodes/FileNode';
import { useNodes } from '../../hooks/nodes/useNodes';
import { useCanvasStore } from '../../store/canvas.store';

interface NodesLayerProps {
  sessionId?: string;
}

/**
 * Layer component that renders all nodes on the canvas
 */
export const NodesLayer: React.FC<NodesLayerProps> = ({
  sessionId = 'public',
}) => {
  const { nodes, isLoading, error, selectNode } = useNodes(sessionId);
  const { viewport } = useCanvasStore();

  if (isLoading) {
    console.log('Loading nodes...');
    return null;
  }

  if (error) {
    console.error('Error loading nodes:', error);
    return null;
  }

  console.log('Rendering nodes:', nodes.length);

  return (
    <Layer>
      {nodes.map(node => (
        <FileNode
          key={node.id}
          node={node}
          isSelected={false} // TODO: implement selection
          onSelect={nodeId => selectNode(nodeId)}
          scale={viewport.scale}
        />
      ))}
    </Layer>
  );
};
