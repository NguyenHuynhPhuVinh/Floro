import { renderHook, act } from '@testing-library/react';

import { NodeService } from '../../../services/core/node.service';
import { useNodesStore } from '../../../store/nodes.store';
import { FileNode } from '../../../types';
import { useToast } from '../../ui/useToast';
import { useNodeDelete } from '../useNodeDelete';
import { useNodeSelection } from '../useNodeSelection';

// Mock dependencies
jest.mock('../../../store/nodes.store');
jest.mock('../useNodeSelection');
jest.mock('../../../services/core/node.service');
jest.mock('../../ui/useToast');

const mockUseNodesStore = useNodesStore as jest.MockedFunction<
  typeof useNodesStore
>;
const mockUseNodeSelection = useNodeSelection as jest.MockedFunction<
  typeof useNodeSelection
>;
const mockNodeService = NodeService as jest.Mocked<typeof NodeService>;
const mockUseToast = useToast as jest.MockedFunction<typeof useToast>;

// Mock nodes data
const mockNodes: FileNode[] = [
  {
    id: 'node-1',
    sessionId: 'public',
    type: 'file',
    fileName: 'test1.pdf',
    fileType: 'pdf',
    fileURL: 'https://example.com/test1.pdf',
    fileSize: 1024,
    mimeType: 'application/pdf',
    position: { x: 100, y: 100 },
    size: { width: 180, height: 60 },
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
    zIndex: 1,
  },
  {
    id: 'node-2',
    sessionId: 'public',
    type: 'file',
    fileName: 'test2.jpg',
    fileType: 'jpg',
    fileURL: 'https://example.com/test2.jpg',
    fileSize: 2048,
    mimeType: 'image/jpeg',
    position: { x: 200, y: 200 },
    size: { width: 180, height: 60 },
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
    zIndex: 2,
  },
];

describe('useNodeDelete', () => {
  let mockStoreActions: {
    removeNode: jest.Mock;
  };
  let mockSelectionActions: {
    getSelectedNodes: jest.Mock;
    clearSelection: jest.Mock;
  };
  let mockToastActions: {
    showSuccess: jest.Mock;
    showError: jest.Mock;
  };

  beforeEach(() => {
    mockStoreActions = {
      removeNode: jest.fn(),
    };

    mockSelectionActions = {
      getSelectedNodes: jest.fn(() => []),
      clearSelection: jest.fn(),
    };

    mockToastActions = {
      showSuccess: jest.fn(),
      showError: jest.fn(),
    };

    mockUseNodesStore.mockReturnValue({
      nodes: mockNodes,
      selectedNodeIds: new Set(),
      isLoading: false,
      error: null,
      addNode: jest.fn(),
      updateNode: jest.fn(),
      selectNode: jest.fn(),
      deselectNode: jest.fn(),
      setSelectedNodeIds: jest.fn(),
      setNodes: jest.fn(),
      setLoading: jest.fn(),
      setError: jest.fn(),
      loadNodes: jest.fn(),
      createNode: jest.fn(),
      ...mockStoreActions,
    });

    mockUseNodeSelection.mockReturnValue({
      selectedNodeIds: new Set(),
      isSelected: jest.fn(),
      selectNode: jest.fn(),
      selectMultiple: jest.fn(),
      selectAll: jest.fn(),
      ...mockSelectionActions,
    });

    mockUseToast.mockReturnValue({
      toasts: [],
      addToast: jest.fn(),
      removeToast: jest.fn(),
      clearAllToasts: jest.fn(),
      showInfo: jest.fn(),
      showWarning: jest.fn(),
      ...mockToastActions,
    });

    // Mock NodeService methods
    mockNodeService.deleteFileNode.mockResolvedValue();
    mockNodeService.deleteMultipleNodes.mockResolvedValue();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useNodeDelete());

      expect(result.current.isDeleting).toBe(false);
      expect(result.current.showConfirmDialog).toBe(false);
    });
  });

  describe('deleteNode', () => {
    it('should show confirmation dialog for single node deletion', async () => {
      const { result } = renderHook(() => useNodeDelete());

      await act(async () => {
        await result.current.deleteNode('node-1');
      });

      expect(result.current.showConfirmDialog).toBe(true);
    });
  });

  describe('deleteSelectedNodes', () => {
    it('should show confirmation dialog for multiple nodes deletion', async () => {
      mockSelectionActions.getSelectedNodes.mockReturnValue([
        mockNodes[0],
        mockNodes[1],
      ]);

      const { result } = renderHook(() => useNodeDelete());

      await act(async () => {
        await result.current.deleteSelectedNodes();
      });

      expect(result.current.showConfirmDialog).toBe(true);
    });

    it('should do nothing if no nodes are selected', async () => {
      mockSelectionActions.getSelectedNodes.mockReturnValue([]);

      const { result } = renderHook(() => useNodeDelete());

      await act(async () => {
        await result.current.deleteSelectedNodes();
      });

      expect(result.current.showConfirmDialog).toBe(false);
    });
  });

  describe('confirmDelete', () => {
    it('should delete single node when confirmed', async () => {
      const { result } = renderHook(() => useNodeDelete());

      // Start deletion process
      await act(async () => {
        await result.current.deleteNode('node-1');
      });

      expect(result.current.showConfirmDialog).toBe(true);

      // Confirm deletion
      await act(async () => {
        await result.current.confirmDelete();
      });

      expect(mockNodeService.deleteFileNode).toHaveBeenCalledWith('node-1');
      expect(mockStoreActions.removeNode).toHaveBeenCalledWith('node-1');
      expect(result.current.showConfirmDialog).toBe(false);
      expect(result.current.isDeleting).toBe(false);
    });

    it('should delete multiple nodes when confirmed', async () => {
      mockSelectionActions.getSelectedNodes.mockReturnValue([
        mockNodes[0],
        mockNodes[1],
      ]);

      const { result } = renderHook(() => useNodeDelete());

      // Start deletion process
      await act(async () => {
        await result.current.deleteSelectedNodes();
      });

      expect(result.current.showConfirmDialog).toBe(true);

      // Confirm deletion
      await act(async () => {
        await result.current.confirmDelete();
      });

      expect(mockNodeService.deleteMultipleNodes).toHaveBeenCalledWith([
        'node-1',
        'node-2',
      ]);
      expect(mockStoreActions.removeNode).toHaveBeenCalledWith('node-1');
      expect(mockStoreActions.removeNode).toHaveBeenCalledWith('node-2');
      expect(mockSelectionActions.clearSelection).toHaveBeenCalled();
      expect(result.current.showConfirmDialog).toBe(false);
      expect(result.current.isDeleting).toBe(false);
    });

    it('should handle deletion errors gracefully', async () => {
      mockNodeService.deleteFileNode.mockRejectedValue(
        new Error('Database error')
      );

      // Mock console.error to avoid test output
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const { result } = renderHook(() => useNodeDelete());

      // Start deletion process
      await act(async () => {
        await result.current.deleteNode('node-1');
      });

      // Confirm deletion
      await act(async () => {
        await result.current.confirmDelete();
      });

      expect(mockNodeService.deleteFileNode).toHaveBeenCalledWith('node-1');
      expect(mockStoreActions.removeNode).not.toHaveBeenCalled();
      expect(result.current.isDeleting).toBe(false);

      // Restore console.error
      consoleSpy.mockRestore();
    });

    it('should show loading state during deletion', async () => {
      // Make deleteFileNode take some time
      let resolveDelete: () => void;
      const deletePromise = new Promise<void>(resolve => {
        resolveDelete = resolve;
      });
      mockNodeService.deleteFileNode.mockReturnValue(deletePromise);

      const { result } = renderHook(() => useNodeDelete());

      // Start deletion process
      await act(async () => {
        await result.current.deleteNode('node-1');
      });

      // Start confirm deletion
      act(() => {
        result.current.confirmDelete();
      });

      // Should be deleting
      expect(result.current.isDeleting).toBe(true);
      expect(result.current.showConfirmDialog).toBe(false);

      // Resolve the deletion
      resolveDelete!();
      await act(async () => {
        // Wait for deletion to complete
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      // Should not be deleting anymore
      expect(result.current.isDeleting).toBe(false);
    });

    it('should do nothing if no pending deletion', async () => {
      const { result } = renderHook(() => useNodeDelete());

      act(() => {
        result.current.confirmDelete();
      });

      expect(mockNodeService.deleteFileNode).not.toHaveBeenCalled();
      expect(mockNodeService.deleteMultipleNodes).not.toHaveBeenCalled();
    });
  });

  describe('cancelDelete', () => {
    it('should cancel pending deletion', async () => {
      const { result } = renderHook(() => useNodeDelete());

      // Start deletion process
      await act(async () => {
        await result.current.deleteNode('node-1');
      });

      expect(result.current.showConfirmDialog).toBe(true);

      // Cancel deletion
      act(() => {
        result.current.cancelDelete();
      });

      expect(result.current.showConfirmDialog).toBe(false);

      // Confirm should do nothing now
      act(() => {
        result.current.confirmDelete();
      });

      expect(mockNodeService.deleteFileNode).not.toHaveBeenCalled();
    });
  });
});
