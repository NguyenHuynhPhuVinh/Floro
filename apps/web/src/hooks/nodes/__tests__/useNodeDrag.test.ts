import { renderHook, act } from '@testing-library/react';
import { useNodeDrag } from '../useNodeDrag';
import { useNodesStore } from '../../../store/nodes.store';
import { useNodeSelection } from '../useNodeSelection';
import { NodeService } from '../../../services/core/node.service';
import { FileNode } from '../../../types';

// Mock dependencies
jest.mock('../../../store/nodes.store');
jest.mock('../useNodeSelection');
jest.mock('../../../services/core/node.service');

const mockUseNodesStore = useNodesStore as jest.MockedFunction<
  typeof useNodesStore
>;
const mockUseNodeSelection = useNodeSelection as jest.MockedFunction<
  typeof useNodeSelection
>;
const mockNodeService = NodeService as jest.Mocked<typeof NodeService>;

// Mock Konva event
const createMockKonvaEvent = (
  nodeId: string,
  position = { x: 100, y: 100 }
) => ({
  target: {
    getAttr: jest.fn((attr: string) =>
      attr === 'nodeId' ? nodeId : undefined
    ),
    position: jest.fn(() => position),
    parent: {
      getAttr: jest.fn((attr: string) =>
        attr === 'nodeId' ? nodeId : undefined
      ),
    },
  },
});

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

describe('useNodeDrag', () => {
  let mockStoreActions: {
    updateNode: jest.Mock;
  };
  let mockSelectionActions: {
    getSelectedNodes: jest.Mock;
    isSelected: jest.Mock;
  };

  beforeEach(() => {
    mockStoreActions = {
      updateNode: jest.fn(),
    };

    mockSelectionActions = {
      getSelectedNodes: jest.fn(() => []),
      isSelected: jest.fn(() => false),
    };

    mockUseNodesStore.mockReturnValue({
      nodes: mockNodes,
      selectedNodeIds: new Set(),
      isLoading: false,
      error: null,
      addNode: jest.fn(),
      removeNode: jest.fn(),
      selectNode: jest.fn(),
      deselectNode: jest.fn(),
      clearSelection: jest.fn(),
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
      selectNode: jest.fn(),
      selectMultiple: jest.fn(),
      clearSelection: jest.fn(),
      selectAll: jest.fn(),
      ...mockSelectionActions,
    });

    // Mock NodeService methods
    mockNodeService.updateNode.mockResolvedValue({} as any);
    mockNodeService.updateMultipleNodes.mockResolvedValue([]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useNodeDrag());

      expect(result.current.isDragging).toBe(false);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.dragOffset).toEqual({ x: 0, y: 0 });
    });
  });

  describe('handleDragStart', () => {
    it('should start dragging single unselected node', () => {
      mockSelectionActions.isSelected.mockReturnValue(false);

      const { result } = renderHook(() => useNodeDrag());
      const mockEvent = createMockKonvaEvent('node-1');

      act(() => {
        result.current.handleDragStart(mockEvent as any);
      });

      expect(result.current.isDragging).toBe(true);
      expect(mockSelectionActions.getSelectedNodes).toHaveBeenCalled();
    });

    it('should start dragging multiple selected nodes', () => {
      mockSelectionActions.isSelected.mockReturnValue(true);
      mockSelectionActions.getSelectedNodes.mockReturnValue([
        mockNodes[0],
        mockNodes[1],
      ]);

      const { result } = renderHook(() => useNodeDrag());
      const mockEvent = createMockKonvaEvent('node-1');

      act(() => {
        result.current.handleDragStart(mockEvent as any);
      });

      expect(result.current.isDragging).toBe(true);
      expect(mockSelectionActions.getSelectedNodes).toHaveBeenCalled();
    });

    it('should handle missing nodeId gracefully', () => {
      const mockEvent = {
        target: {
          getAttr: jest.fn(() => undefined),
          parent: {
            getAttr: jest.fn(() => undefined),
          },
        },
      };

      const { result } = renderHook(() => useNodeDrag());

      act(() => {
        result.current.handleDragStart(mockEvent as any);
      });

      expect(result.current.isDragging).toBe(false);
    });
  });

  describe('handleDragEnd', () => {
    it('should update single node position', async () => {
      mockSelectionActions.isSelected.mockReturnValue(false);

      const { result } = renderHook(() => useNodeDrag());

      // Start drag
      const startEvent = createMockKonvaEvent('node-1', { x: 100, y: 100 });
      act(() => {
        result.current.handleDragStart(startEvent as any);
      });

      // End drag at new position
      const endEvent = createMockKonvaEvent('node-1', { x: 150, y: 150 });

      await act(async () => {
        await result.current.handleDragEnd(endEvent as any);
      });

      expect(mockNodeService.updateNode).toHaveBeenCalledWith('node-1', {
        position: { x: 150, y: 150 },
      });
      expect(mockStoreActions.updateNode).toHaveBeenCalledWith('node-1', {
        position: { x: 150, y: 150 },
      });
      expect(result.current.isDragging).toBe(false);
      expect(result.current.isLoading).toBe(false);
    });

    it('should update multiple selected nodes positions', async () => {
      mockSelectionActions.isSelected.mockReturnValue(true);
      mockSelectionActions.getSelectedNodes.mockReturnValue([
        mockNodes[0],
        mockNodes[1],
      ]);

      const { result } = renderHook(() => useNodeDrag());

      // Start drag
      const startEvent = createMockKonvaEvent('node-1', { x: 100, y: 100 });
      act(() => {
        result.current.handleDragStart(startEvent as any);
      });

      // End drag at new position (moved 50px right, 50px down)
      const endEvent = createMockKonvaEvent('node-1', { x: 150, y: 150 });

      await act(async () => {
        await result.current.handleDragEnd(endEvent as any);
      });

      expect(mockNodeService.updateMultipleNodes).toHaveBeenCalledWith([
        {
          nodeId: 'node-1',
          data: { position: { x: 150, y: 150 } },
        },
        {
          nodeId: 'node-2',
          data: { position: { x: 250, y: 250 } }, // Original (200,200) + delta (50,50)
        },
      ]);
    });

    it('should handle database errors with rollback', async () => {
      mockSelectionActions.isSelected.mockReturnValue(false);
      mockNodeService.updateNode.mockRejectedValue(new Error('Database error'));

      // Mock console.error to avoid test output
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const { result } = renderHook(() => useNodeDrag());

      // Start drag
      const startEvent = createMockKonvaEvent('node-1', { x: 100, y: 100 });
      act(() => {
        result.current.handleDragStart(startEvent as any);
      });

      // End drag
      const endEvent = createMockKonvaEvent('node-1', { x: 150, y: 150 });

      await act(async () => {
        await result.current.handleDragEnd(endEvent as any);
      });

      expect(mockStoreActions.updateNode).toHaveBeenCalledWith('node-1', {
        position: { x: 100, y: 100 }, // Rollback to original position
      });
      expect(result.current.isLoading).toBe(false);

      // Restore console.error
      consoleSpy.mockRestore();
    });

    it('should not update if no drag state', async () => {
      const { result } = renderHook(() => useNodeDrag());
      const mockEvent = createMockKonvaEvent('node-1');

      await act(async () => {
        await result.current.handleDragEnd(mockEvent as any);
      });

      expect(mockNodeService.updateNode).not.toHaveBeenCalled();
      expect(mockStoreActions.updateNode).not.toHaveBeenCalled();
    });
  });

  describe('loading states', () => {
    it('should show loading during database update', async () => {
      mockSelectionActions.isSelected.mockReturnValue(false);

      // Make updateNode take some time
      let resolveUpdate: () => void;
      const updatePromise = new Promise<any>(resolve => {
        resolveUpdate = () => resolve({});
      });
      mockNodeService.updateNode.mockReturnValue(updatePromise);

      const { result } = renderHook(() => useNodeDrag());

      // Start drag
      const startEvent = createMockKonvaEvent('node-1', { x: 100, y: 100 });
      act(() => {
        result.current.handleDragStart(startEvent as any);
      });

      // End drag - start the async operation but don't await it yet
      const endEvent = createMockKonvaEvent('node-1', { x: 150, y: 150 });

      let dragEndPromise: Promise<void>;
      act(() => {
        dragEndPromise = result.current.handleDragEnd(endEvent as any);
      });

      // Should be loading
      expect(result.current.isLoading).toBe(true);

      // Resolve the update
      resolveUpdate!();
      await act(async () => {
        await dragEndPromise!;
      });

      // Should not be loading anymore
      expect(result.current.isLoading).toBe(false);
    });
  });
});
