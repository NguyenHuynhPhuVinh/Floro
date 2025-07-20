import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { NodeService } from '../services/core/node.service';
import { FileNode, FileNodeCreateData } from '../types';

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
    nodeData: FileNodeCreateData,
    position: { x: number; y: number },
    sessionId?: string
  ) => Promise<FileNode | null>;
}

export const useNodesStore = create<NodesState>()(
  devtools(
    set => ({
      // Initial state
      nodes: [],
      selectedNodeIds: new Set(),
      isLoading: false,
      error: null,

      // Sync actions
      addNode: (node: FileNode): void =>
        set(state => ({
          nodes: [...state.nodes, node],
        })),

      updateNode: (id: string, updates: Partial<FileNode>): void =>
        set(state => ({
          nodes: state.nodes.map(node =>
            node.id === id ? { ...node, ...updates } : node
          ),
        })),

      removeNode: (id: string): void =>
        set(state => ({
          nodes: state.nodes.filter(node => node.id !== id),
          selectedNodeIds: new Set(
            Array.from(state.selectedNodeIds).filter(nodeId => nodeId !== id)
          ),
        })),

      selectNode: (id: string): void =>
        set(state => ({
          selectedNodeIds: new Set([...state.selectedNodeIds, id]),
        })),

      deselectNode: (id: string): void =>
        set(state => {
          const newSelection = new Set(state.selectedNodeIds);
          newSelection.delete(id);
          return { selectedNodeIds: newSelection };
        }),

      clearSelection: (): void =>
        set(() => ({
          selectedNodeIds: new Set(),
        })),

      setNodes: (nodes: FileNode[]): void =>
        set(() => ({
          nodes,
        })),

      setLoading: (loading: boolean): void =>
        set(() => ({
          isLoading: loading,
        })),

      setError: (error: string | null): void =>
        set(() => ({
          error,
        })),

      // Async actions
      loadNodes: async (sessionId: string): Promise<void> => {
        set({ isLoading: true, error: null });
        try {
          const nodes = await NodeService.getNodesBySession(sessionId);
          set({ nodes, isLoading: false });
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Failed to load nodes:', error);
          set({
            error:
              error instanceof Error ? error.message : 'Failed to load nodes',
            isLoading: false,
          });
        }
      },

      createNode: async (
        nodeData: FileNodeCreateData,
        position: { x: number; y: number },
        sessionId = 'public'
      ): Promise<FileNode | null> => {
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
          // eslint-disable-next-line no-console
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
