import { useEffect } from 'react';

import { useNodesStore } from '../../store/nodes.store';
import { FileNode, FileNodeCreateData } from '../../types';

/**
 * Hook to manage nodes loading and state
 */
export const useNodes = (
  sessionId: string = 'public'
): {
  nodes: FileNode[];
  selectedNodeIds: Set<string>;
  isLoading: boolean;
  error: string | null;
  selectNode: (nodeId: string) => void;
  deselectNode: (nodeId: string) => void;
  clearSelection: () => void;
  addNode: (node: FileNode) => void;
  updateNode: (id: string, updates: Partial<FileNode>) => void;
  removeNode: (id: string) => void;
  createNode: (
    nodeData: FileNodeCreateData,
    position: { x: number; y: number },
    sessionId?: string
  ) => Promise<FileNode | null>;
  refreshNodes: () => Promise<void>;
} => {
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
    refreshNodes: (): Promise<void> => loadNodes(sessionId),
  };
};
