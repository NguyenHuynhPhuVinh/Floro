import { renderHook, act } from '@testing-library/react';
import { useNodeSelection } from '../useNodeSelection';
import { useNodesStore } from '../../../store/nodes.store';
import { FileNode } from '../../../types';

// Mock the nodes store
jest.mock('../../../store/nodes.store');

const mockUseNodesStore = useNodesStore as jest.MockedFunction<typeof useNodesStore>;

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
  {
    id: 'node-3',
    sessionId: 'public',
    type: 'file',
    fileName: 'test3.txt',
    fileType: 'txt',
    fileURL: 'https://example.com/test3.txt',
    fileSize: 512,
    mimeType: 'text/plain',
    position: { x: 300, y: 300 },
    size: { width: 180, height: 60 },
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
    zIndex: 3,
  },
];

describe('useNodeSelection', () => {
  let mockStoreActions: {
    selectNode: jest.Mock;
    deselectNode: jest.Mock;
    clearSelection: jest.Mock;
    setSelectedNodeIds: jest.Mock;
  };

  beforeEach(() => {
    mockStoreActions = {
      selectNode: jest.fn(),
      deselectNode: jest.fn(),
      clearSelection: jest.fn(),
      setSelectedNodeIds: jest.fn(),
    };

    mockUseNodesStore.mockReturnValue({
      nodes: mockNodes,
      selectedNodeIds: new Set(),
      isLoading: false,
      error: null,
      addNode: jest.fn(),
      updateNode: jest.fn(),
      removeNode: jest.fn(),
      setNodes: jest.fn(),
      setLoading: jest.fn(),
      setError: jest.fn(),
      loadNodes: jest.fn(),
      createNode: jest.fn(),
      ...mockStoreActions,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('isSelected', () => {
    it('should return false for unselected node', () => {
      const { result } = renderHook(() => useNodeSelection());
      
      expect(result.current.isSelected('node-1')).toBe(false);
    });

    it('should return true for selected node', () => {
      mockUseNodesStore.mockReturnValue({
        ...mockUseNodesStore(),
        selectedNodeIds: new Set(['node-1']),
      });

      const { result } = renderHook(() => useNodeSelection());
      
      expect(result.current.isSelected('node-1')).toBe(true);
      expect(result.current.isSelected('node-2')).toBe(false);
    });
  });

  describe('selectNode', () => {
    it('should select single node (clear existing selection)', () => {
      const { result } = renderHook(() => useNodeSelection());

      act(() => {
        result.current.selectNode('node-1', false);
      });

      expect(mockStoreActions.setSelectedNodeIds).toHaveBeenCalledWith(
        new Set(['node-1'])
      );
    });

    it('should toggle node selection in multi-select mode', () => {
      // Test adding to selection
      const { result } = renderHook(() => useNodeSelection());

      act(() => {
        result.current.selectNode('node-1', true);
      });

      expect(mockStoreActions.selectNode).toHaveBeenCalledWith('node-1');

      // Test removing from selection
      mockUseNodesStore.mockReturnValue({
        ...mockUseNodesStore(),
        selectedNodeIds: new Set(['node-1']),
      });

      const { result: result2 } = renderHook(() => useNodeSelection());

      act(() => {
        result2.current.selectNode('node-1', true);
      });

      expect(mockStoreActions.deselectNode).toHaveBeenCalledWith('node-1');
    });
  });

  describe('selectMultiple', () => {
    it('should select multiple nodes', () => {
      const { result } = renderHook(() => useNodeSelection());

      act(() => {
        result.current.selectMultiple(['node-1', 'node-2']);
      });

      expect(mockStoreActions.setSelectedNodeIds).toHaveBeenCalledWith(
        new Set(['node-1', 'node-2'])
      );
    });
  });

  describe('clearSelection', () => {
    it('should clear all selections', () => {
      const { result } = renderHook(() => useNodeSelection());

      act(() => {
        result.current.clearSelection();
      });

      expect(mockStoreActions.clearSelection).toHaveBeenCalled();
    });
  });

  describe('selectAll', () => {
    it('should select all nodes', () => {
      const { result } = renderHook(() => useNodeSelection());

      act(() => {
        result.current.selectAll();
      });

      expect(mockStoreActions.setSelectedNodeIds).toHaveBeenCalledWith(
        new Set(['node-1', 'node-2', 'node-3'])
      );
    });
  });

  describe('getSelectedNodes', () => {
    it('should return empty array when no nodes selected', () => {
      const { result } = renderHook(() => useNodeSelection());
      
      expect(result.current.getSelectedNodes()).toEqual([]);
    });

    it('should return selected nodes', () => {
      mockUseNodesStore.mockReturnValue({
        ...mockUseNodesStore(),
        selectedNodeIds: new Set(['node-1', 'node-3']),
      });

      const { result } = renderHook(() => useNodeSelection());
      
      const selectedNodes = result.current.getSelectedNodes();
      expect(selectedNodes).toHaveLength(2);
      expect(selectedNodes[0].id).toBe('node-1');
      expect(selectedNodes[1].id).toBe('node-3');
    });
  });
});
