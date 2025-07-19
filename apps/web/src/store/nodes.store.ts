import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { FileNode } from '../types';
import { NodeService } from '../services/core/node.service';

interface NodesState {
  // State
  nodes: FileNode[];
  selectedNodeIds: Set<string>;
  isLoading: boolean;
  error: string | null;

  // Actions
  addNode: (node: FileNode) => void;
  updateNode: (id: string, updates: Partial<FileNode>) => void;
  removeNode: (id: string) => void;
  selectNode: (id: string) => void;
  deselectNode: (id: string) => void;
  clearSelection: () => void;
  setNodes: (nodes: FileNode[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Async actions
  loadNodes: (sessionId: string) => Promise<void>;
  createNode: (
    nodeData: any,
    position: { x: number; y: number },
    sessionId?: string
  ) => Promise<FileNode | null>;
}

export const useNodesStore = create<NodesState>()(
  devtools(
    (set, get) => ({
      // Initial state
      nodes: [],
      selectedNodeIds: new Set(),
      isLoading: false,
      error: null,

      // Sync actions
      addNode: node =>
        set(state => ({
          nodes: [...state.nodes, node],
        })),

      updateNode: (id, updates) =>
        set(state => ({
          nodes: state.nodes.map(node =>
            node.id === id ? { ...node, ...updates } : node
          ),
        })),

      removeNode: id =>
        set(state => ({
          nodes: state.nodes.filter(node => node.id !== id),
          selectedNodeIds: new Set(
            Array.from(state.selectedNodeIds).filter(nodeId => nodeId !== id)
          ),
        })),

      selectNode: id =>
        set(state => ({
          selectedNodeIds: new Set([...state.selectedNodeIds, id]),
        })),

      deselectNode: id =>
        set(state => {
          const newSelection = new Set(state.selectedNodeIds);
          newSelection.delete(id);
          return { selectedNodeIds: newSelection };
        }),

      clearSelection: () =>
        set(() => ({
          selectedNodeIds: new Set(),
        })),

      setNodes: nodes =>
        set(() => ({
          nodes,
        })),

      setLoading: loading =>
        set(() => ({
          isLoading: loading,
        })),

      setError: error =>
        set(() => ({
          error,
        })),

      // Async actions
      loadNodes: async sessionId => {
        set({ isLoading: true, error: null });
        try {
          const nodes = await NodeService.getNodesBySession(sessionId);
          set({ nodes, isLoading: false });
        } catch (error) {
          console.error('Failed to load nodes:', error);
          set({
            error:
              error instanceof Error ? error.message : 'Failed to load nodes',
            isLoading: false,
          });
        }
      },

      createNode: async (nodeData, position, sessionId = 'public') => {
        set({ isLoading: true, error: null });
        try {
          const node = await NodeService.createFileNode(
            nodeData,
            position,
            sessionId
          );
          set(state => ({
            nodes: [...state.nodes, node],
            isLoading: false,
          }));
          return node;
        } catch (error) {
          console.error('Failed to create node:', error);
          set({
            error:
              error instanceof Error ? error.message : 'Failed to create node',
            isLoading: false,
          });
          return null;
        }
      },
    }),
    {
      name: 'nodes-store',
    }
  )
);
