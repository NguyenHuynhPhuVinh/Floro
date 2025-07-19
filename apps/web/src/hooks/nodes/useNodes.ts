import { useEffect } from 'react';
import { useNodesStore } from '../../store/nodes.store';

/**
 * Hook to manage nodes loading and state
 */
export const useNodes = (sessionId: string = 'public') => {
  const {
    nodes,
    selectedNodeIds,
    isLoading,
    error,
    loadNodes,
    addNode,
    updateNode,
    removeNode,
    selectNode,
    deselectNode,
    clearSelection,
    createNode,
  } = useNodesStore();

  // Load nodes on mount or when sessionId changes
  useEffect(() => {
    loadNodes(sessionId);
  }, [sessionId, loadNodes]);

  return {
    // State
    nodes,
    selectedNodeIds,
    isLoading,
    error,

    // Actions
    addNode,
    updateNode,
    removeNode,
    selectNode,
    deselectNode,
    clearSelection,
    createNode,
    refreshNodes: () => loadNodes(sessionId),
  };
};
