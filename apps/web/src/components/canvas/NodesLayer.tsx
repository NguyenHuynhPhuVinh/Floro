import React from 'react';
import { Layer } from 'react-konva';

import { FileNode } from '../../components/nodes/FileNode';
import { useNodes } from '../../hooks/nodes/useNodes';
import { useNodeSelection } from '../../hooks/nodes/useNodeSelection';
import { useKeyboardShortcuts } from '../../hooks/nodes/useKeyboardShortcuts';
import { useNodeDelete } from '../../hooks/nodes/useNodeDelete';
import { useCanvasStore } from '../../store/canvas.store';
import { ConfirmDialog } from '../ui/ConfirmDialog';

interface NodesLayerProps {
  sessionId?: string;
}

/**
 * Layer component that renders all nodes on the canvas
 */
export const NodesLayer: React.FC<NodesLayerProps> = ({
  sessionId = 'public',
}) => {
  const { nodes, isLoading, error } = useNodes(sessionId);
  const { viewport } = useCanvasStore();

  // Node selection functionality
  const { isSelected, selectNode, selectAll, clearSelection } =
    useNodeSelection();

  // Node deletion functionality
  const {
    deleteNode,
    deleteSelectedNodes,
    showConfirmDialog,
    confirmDelete,
    cancelDelete,
  } = useNodeDelete();

  // Keyboard shortcuts for selection and deletion
  useKeyboardShortcuts({
    onSelectAll: selectAll,
    onClearSelection: clearSelection,
    onDeleteSelected: deleteSelectedNodes,
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

  // eslint-disable-next-line no-console
  console.log('Rendering nodes:', nodes.length);

  return (
    <>
      <Layer>
        {nodes.map(node => (
          <FileNode
            key={node.id}
            node={node}
            isSelected={isSelected(node.id)}
            onSelect={(nodeId, multiSelect) => selectNode(nodeId, multiSelect)}
            onDelete={deleteNode}
            scale={viewport.scale}
          />
        ))}
      </Layer>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        title="Delete Node(s)"
        message="Are you sure you want to delete the selected node(s)? This action cannot be undone and will also remove associated files from storage."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        destructive={true}
      />
    </>
  );
};
