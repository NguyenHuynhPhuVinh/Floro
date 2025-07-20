import { useState, useCallback } from 'react';
import { NodeService } from '../../services/core/node.service';
import { useNodesStore } from '../../store/nodes.store';
import { useNodeSelection } from './useNodeSelection';
import { useToast } from '../ui/useToast';

/**
 * Hook return interface for node deletion operations
 */
export interface UseNodeDeleteReturn {
  deleteNode: (nodeId: string) => Promise<void>;
  deleteSelectedNodes: () => Promise<void>;
  isDeleting: boolean;
  showConfirmDialog: boolean;
  confirmDelete: () => void;
  cancelDelete: () => void;
}

/**
 * Hook for managing node deletion operations
 * Supports single node deletion and batch deletion of selected nodes
 * Includes confirmation dialog and file cleanup for FileNodes
 */
export const useNodeDelete = (): UseNodeDeleteReturn => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingDeletion, setPendingDeletion] = useState<{
    type: 'single' | 'multiple';
    nodeIds: string[];
  } | null>(null);

  const { removeNode } = useNodesStore();
  const { getSelectedNodes, clearSelection } = useNodeSelection();
  const { showSuccess, showError } = useToast();

  /**
   * Delete a single node with confirmation
   * @param nodeId - ID of the node to delete
   */
  const deleteNode = useCallback(async (nodeId: string): Promise<void> => {
    setPendingDeletion({ type: 'single', nodeIds: [nodeId] });
    setShowConfirmDialog(true);
  }, []);

  /**
   * Delete all selected nodes with confirmation
   */
  const deleteSelectedNodes = useCallback(async (): Promise<void> => {
    const selectedNodes = getSelectedNodes();
    if (selectedNodes.length === 0) return;

    const nodeIds = selectedNodes.map(node => node.id);
    setPendingDeletion({ type: 'multiple', nodeIds });
    setShowConfirmDialog(true);
  }, [getSelectedNodes]);

  /**
   * Confirm and execute the pending deletion
   */
  const confirmDelete = useCallback(async (): Promise<void> => {
    if (!pendingDeletion) return;

    setIsDeleting(true);
    setShowConfirmDialog(false);

    try {
      const { nodeIds } = pendingDeletion;

      if (nodeIds.length === 1) {
        // Single node deletion
        await NodeService.deleteFileNode(nodeIds[0]);
        removeNode(nodeIds[0]);
      } else {
        // Multiple nodes deletion
        await NodeService.deleteMultipleNodes(nodeIds);
        nodeIds.forEach(nodeId => removeNode(nodeId));
      }

      // Clear selection if we deleted selected nodes
      if (pendingDeletion.type === 'multiple') {
        clearSelection();
      }

      // Show success notification
      const nodeCount = nodeIds.length;
      showSuccess(
        `Deleted ${nodeCount} node${nodeCount > 1 ? 's' : ''}`,
        nodeCount === 1
          ? 'Node and associated file removed successfully'
          : 'Nodes and associated files removed successfully'
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to delete nodes:', error);

      // Show error notification
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      showError(
        'Failed to delete node(s)',
        `Could not delete the selected node(s): ${errorMessage}`
      );
    } finally {
      setIsDeleting(false);
      setPendingDeletion(null);
    }
  }, [pendingDeletion, removeNode, clearSelection]);

  /**
   * Cancel the pending deletion
   */
  const cancelDelete = useCallback((): void => {
    setShowConfirmDialog(false);
    setPendingDeletion(null);
  }, []);

  return {
    deleteNode,
    deleteSelectedNodes,
    isDeleting,
    showConfirmDialog,
    confirmDelete,
    cancelDelete,
  };
};
