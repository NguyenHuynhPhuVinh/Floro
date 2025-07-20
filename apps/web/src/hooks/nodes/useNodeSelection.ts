import { useCallback } from 'react';

import { useNodesStore } from '../../store/nodes.store';
import { FileNode } from '../../types';

/**
 * Hook for managing node selection state and operations
 * Supports single-click selection and multi-select with Ctrl/Cmd + click
 */
export interface UseNodeSelectionReturn {
  selectedNodeIds: Set<string>;
  isSelected: (nodeId: string) => boolean;
  selectNode: (nodeId: string, multiSelect?: boolean) => void;
  selectMultiple: (nodeIds: string[]) => void;
  clearSelection: () => void;
  selectAll: () => void;
  getSelectedNodes: () => FileNode[];
}

export const useNodeSelection = (): UseNodeSelectionReturn => {
  const {
    nodes,
    selectedNodeIds,
    selectNode: storeSelectNode,
    deselectNode,
    clearSelection: storeClearSelection,
    setSelectedNodeIds,
  } = useNodesStore();

  /**
   * Check if a node is currently selected
   */
  const isSelected = useCallback(
    (nodeId: string): boolean => {
      return selectedNodeIds.has(nodeId);
    },
    [selectedNodeIds]
  );

  /**
   * Select a node with optional multi-select support
   * @param nodeId - ID of the node to select
   * @param multiSelect - Whether to add to existing selection (Ctrl/Cmd + click)
   */
  const selectNode = useCallback(
    (nodeId: string, multiSelect = false): void => {
      if (multiSelect) {
        // Multi-select: toggle the node selection
        if (selectedNodeIds.has(nodeId)) {
          deselectNode(nodeId);
        } else {
          storeSelectNode(nodeId);
        }
      } else {
        // Single select: clear existing selection and select this node
        const newSelection = new Set([nodeId]);
        setSelectedNodeIds(newSelection);
      }
    },
    [selectedNodeIds, storeSelectNode, deselectNode, setSelectedNodeIds]
  );

  /**
   * Select multiple nodes at once
   * @param nodeIds - Array of node IDs to select
   */
  const selectMultiple = useCallback(
    (nodeIds: string[]): void => {
      const newSelection = new Set(nodeIds);
      setSelectedNodeIds(newSelection);
    },
    [setSelectedNodeIds]
  );

  /**
   * Clear all node selections
   */
  const clearSelection = useCallback((): void => {
    storeClearSelection();
  }, [storeClearSelection]);

  /**
   * Select all nodes in the current session
   */
  const selectAll = useCallback((): void => {
    const allNodeIds = nodes.map(node => node.id);
    const newSelection = new Set(allNodeIds);
    setSelectedNodeIds(newSelection);
  }, [nodes, setSelectedNodeIds]);

  /**
   * Get all currently selected nodes
   * @returns Array of selected FileNode objects
   */
  const getSelectedNodes = useCallback((): FileNode[] => {
    return nodes.filter(node => selectedNodeIds.has(node.id));
  }, [nodes, selectedNodeIds]);

  return {
    selectedNodeIds,
    isSelected,
    selectNode,
    selectMultiple,
    clearSelection,
    selectAll,
    getSelectedNodes,
  };
};
