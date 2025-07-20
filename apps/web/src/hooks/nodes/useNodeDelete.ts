// eslint-disable-next-line import/order
import { useState, useCallback } from 'react';
// eslint-disable-next-line import/order
import { NodeService } from '../../services/core/node.service';
// eslint-disable-next-line import/order
import { useNodesStore } from '../../store/nodes.store';
// eslint-disable-next-line import/order
import { useToast } from '../ui/useToast';
// eslint-disable-next-line import/order
import { useNodeSelection } from './useNodeSelection';

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
  pendingDeletionCount: number;
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

  const { removeNode, clearLastDeletedAt } = useNodesStore();
  const { getSelectedNodes, clearSelection } = useNodeSelection();
  const { showSuccess, showError } = useToast();

  /**
   * Delete a single node or batch of nodes with confirmation
   * @param nodeId - ID of the node to delete, or "BATCH:id1,id2,id3" for multiple nodes
   */
  const deleteNode = useCallback(async (nodeId: string): Promise<void> => {
    // Check if this is a batch deletion
    if (nodeId.startsWith('BATCH:')) {
      const nodeIds = nodeId.substring(6).split(','); // Remove "BATCH:" prefix
      setPendingDeletion({ type: 'multiple', nodeIds });
    } else {
      setPendingDeletion({ type: 'single', nodeIds: [nodeId] });
    }
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

      // First delete from database
      if (nodeIds.length === 1) {
        // Single node deletion
        await NodeService.deleteFileNode(nodeIds[0]);
      } else {
        // Multiple nodes deletion
        await NodeService.deleteMultipleNodes(nodeIds);
      }

      // Only remove from UI after successful database deletion
      nodeIds.forEach(nodeId => removeNode(nodeId));

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

      // Clear the deletion flag after a delay to allow normal loading again
      setTimeout(() => {
        clearLastDeletedAt();
      }, 3000);
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
  }, [
    pendingDeletion,
    removeNode,
    clearSelection,
    clearLastDeletedAt,
    showError,
    showSuccess,
  ]);

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
    pendingDeletionCount: pendingDeletion?.nodeIds.length || 0,
  };
};
