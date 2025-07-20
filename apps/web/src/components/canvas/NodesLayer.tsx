import React from 'react';
import { Layer } from 'react-konva';

import { FileNode } from '../../components/nodes/FileNode';
import { useKeyboardShortcuts } from '../../hooks/nodes/useKeyboardShortcuts';
import { useNodes } from '../../hooks/nodes/useNodes';
import { useNodeSelection } from '../../hooks/nodes/useNodeSelection';
import { useCanvasStore } from '../../store/canvas.store';

interface NodesLayerProps {
  sessionId?: string;
  onDeleteNode?: (nodeId: string) => void;
}

/**
 * Layer component that renders all nodes on the canvas
 */
export const NodesLayer: React.FC<NodesLayerProps> = ({
  sessionId = 'public',
  onDeleteNode,
}) => {
  const { nodes, isLoading, error } = useNodes(sessionId);
  const { viewport } = useCanvasStore();

  // Node selection functionality
  const {
    isSelected,
    selectNode,
    selectAll,
    clearSelection,
    getSelectedNodes,
  } = useNodeSelection();

  // Handle delete selected nodes
  const handleDeleteSelectedNodes = (): void => {
    const selectedNodes = getSelectedNodes();
    if (selectedNodes.length === 0) return;

    // Delete all selected nodes
    if (onDeleteNode) {
      // For multiple nodes, we need to trigger batch deletion
      // We'll pass a special indicator to distinguish between single and batch deletion
      if (selectedNodes.length === 1) {
        onDeleteNode(selectedNodes[0].id);
      } else {
        // For multiple nodes, we'll use a special format to indicate batch deletion
        const nodeIds = selectedNodes.map(node => node.id);
        onDeleteNode(`BATCH:${nodeIds.join(',')}`);
      }
    }
  };

  // Keyboard shortcuts for selection and deletion
  useKeyboardShortcuts({
    onSelectAll: selectAll,
    onClearSelection: clearSelection,
    onDeleteSelected: handleDeleteSelectedNodes,
  });

  if (isLoading) {
    // eslint-disable-next-line no-console
    console.log('Loading nodes...');
    return null;
  }

  if (error) {
    // eslint-disable-next-line no-console
    console.error('Error loading nodes:', error);
    return null;
  }

  return (
    <Layer>
      {nodes
        .filter(node => node && node.id) // Filter out null/undefined nodes
        .map(node => (
          <FileNode
            key={node.id}
            node={node}
            isSelected={isSelected(node.id)}
            onSelect={(nodeId, multiSelect) => selectNode(nodeId, multiSelect)}
            onDelete={onDeleteNode}
            scale={viewport.scale}
          />
        ))}
    </Layer>
  );
};
