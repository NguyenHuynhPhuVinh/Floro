import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FileNode } from '../FileNode';
import { FileNode as FileNodeType } from '../../../types';

// Mock react-konva components
const mockGroup = jest.fn(({ children, ...props }) => (
  <div data-testid="konva-group" {...props}>
    {children}
  </div>
));
const mockRect = jest.fn(props => <div data-testid="konva-rect" {...props} />);
const mockText = jest.fn(props => (
  <div data-testid="konva-text" data-text={props.text} {...props} />
));
const mockCircle = jest.fn(props => (
  <div data-testid="konva-circle" {...props} />
));
const mockPath = jest.fn(props => <div data-testid="konva-path" {...props} />);

jest.mock('react-konva', () => ({
  Group: mockGroup,
  Rect: mockRect,
  Text: mockText,
  Circle: mockCircle,
  Path: mockPath,
}));

// Mock hooks
const mockHandleDragStart = jest.fn();
const mockDownloadFile = jest.fn();

jest.mock('../../../hooks/nodes/useNodeDrag', () => ({
  useNodeDrag: () => ({
    isDragging: false,
    handleDragStart: mockHandleDragStart,
  }),
}));

jest.mock('../../../hooks/nodes/useFileDownload', () => ({
  useFileDownload: () => ({
    downloadFile: mockDownloadFile,
    isDownloading: false,
    downloadProgress: 0,
  }),
}));

const mockFileNode: FileNodeType = {
  id: 'test-node-1',
  sessionId: 'public',
  type: 'file',
  fileName: 'test-document.pdf',
  fileType: 'pdf',
  fileURL: 'https://example.com/test-document.pdf',
  fileSize: 1024 * 50, // 50KB
  mimeType: 'application/pdf',
  checksum: 'abc123',
  position: { x: 100, y: 200 },
  size: { width: 250, height: 80 },
  createdAt: '2025-07-19T10:00:00Z',
  updatedAt: '2025-07-19T10:00:00Z',
  zIndex: 1,
  isLocked: false,
};

describe('FileNode', () => {
  const defaultProps = {
    node: mockFileNode,
    scale: 1,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render Konva Group with correct positioning', () => {
    render(<FileNode {...defaultProps} />);

    expect(mockGroup).toHaveBeenCalledWith(
      expect.objectContaining({
        x: mockFileNode.position.x,
        y: mockFileNode.position.y,
        draggable: !mockFileNode.isLocked,
      }),
      expect.anything()
    );
  });

  it('should render file name and size as Text components', () => {
    render(<FileNode {...defaultProps} />);

    expect(mockText).toHaveBeenCalledWith(
      expect.objectContaining({
        text: 'test-document.pdf',
      }),
      expect.anything()
    );

    expect(mockText).toHaveBeenCalledWith(
      expect.objectContaining({
        text: '50 KB',
      }),
      expect.anything()
    );
  });

  it('should truncate long file names', () => {
    const longNameNode = {
      ...mockFileNode,
      fileName: 'this-is-a-very-long-file-name-that-should-be-truncated.pdf',
    };

    render(<FileNode {...defaultProps} node={longNameNode} />);

    expect(mockText).toHaveBeenCalledWith(
      expect.objectContaining({
        text: expect.stringMatching(/this-is-a-very-lon.*\.pdf/),
      }),
      expect.anything()
    );
  });

  it('should render Rect with selection styling when selected', () => {
    render(<FileNode {...defaultProps} isSelected={true} />);

    expect(mockRect).toHaveBeenCalledWith(
      expect.objectContaining({
        stroke: '#3b82f6',
        strokeWidth: 2,
      }),
      expect.anything()
    );
  });

  it('should render Rect with default styling when not selected', () => {
    render(<FileNode {...defaultProps} isSelected={false} />);

    expect(mockRect).toHaveBeenCalledWith(
      expect.objectContaining({
        stroke: '#e5e7eb',
        strokeWidth: 1,
      }),
      expect.anything()
    );
  });

  it('should show action buttons on hover', async () => {
    const onDownload = jest.fn();
    const onDelete = jest.fn();

    render(
      <FileNode {...defaultProps} onDownload={onDownload} onDelete={onDelete} />
    );

    const nodeElement = screen.getByText('test-document.pdf').closest('div');

    // Initially buttons should not be visible
    expect(screen.queryByTitle('Download file')).not.toBeInTheDocument();
    expect(screen.queryByTitle('Delete file node')).not.toBeInTheDocument();

    // Hover over the node
    fireEvent.mouseEnter(nodeElement!);

    await waitFor(() => {
      expect(screen.getByTitle('Download file')).toBeInTheDocument();
      expect(screen.getByTitle('Delete file node')).toBeInTheDocument();
    });
  });

  it('should call onDownload when download button is clicked', async () => {
    const onDownload = jest.fn();

    render(<FileNode {...defaultProps} onDownload={onDownload} />);

    const nodeElement = screen.getByText('test-document.pdf').closest('div');
    fireEvent.mouseEnter(nodeElement!);

    await waitFor(() => {
      const downloadButton = screen.getByTitle('Download file');
      fireEvent.click(downloadButton);
    });

    expect(onDownload).toHaveBeenCalledWith(mockFileNode);
  });

  it('should call onDelete when delete button is clicked', async () => {
    const onDelete = jest.fn();

    render(<FileNode {...defaultProps} onDelete={onDelete} />);

    const nodeElement = screen.getByText('test-document.pdf').closest('div');
    fireEvent.mouseEnter(nodeElement!);

    await waitFor(() => {
      const deleteButton = screen.getByTitle('Delete file node');
      fireEvent.click(deleteButton);
    });

    expect(onDelete).toHaveBeenCalledWith('test-node-1');
  });

  it('should not show delete button for locked nodes', async () => {
    const lockedNode = { ...mockFileNode, isLocked: true };
    const onDelete = jest.fn();

    render(
      <FileNode {...defaultProps} node={lockedNode} onDelete={onDelete} />
    );

    const nodeElement = screen.getByText('test-document.pdf').closest('div');
    fireEvent.mouseEnter(nodeElement!);

    await waitFor(() => {
      expect(screen.queryByTitle('Delete file node')).not.toBeInTheDocument();
    });
  });

  it('should show lock indicator for locked nodes', () => {
    const lockedNode = { ...mockFileNode, isLocked: true };

    render(<FileNode {...defaultProps} node={lockedNode} />);

    const container = screen
      .getByText('test-document.pdf')
      .closest('[data-node-id]');
    expect(container).toHaveClass('cursor-not-allowed', 'opacity-75');
  });

  it('should format file sizes correctly', () => {
    const testCases = [
      { size: 1024, expected: '1 KB' },
      { size: 1024 * 1024, expected: '1 MB' },
      { size: 1024 * 1024 * 1.5, expected: '1.5 MB' },
      { size: 500, expected: '500 Bytes' },
    ];

    testCases.forEach(({ size, expected }) => {
      const nodeWithSize = { ...mockFileNode, fileSize: size };
      const { rerender } = render(
        <FileNode {...defaultProps} node={nodeWithSize} />
      );

      expect(screen.getByText(expected)).toBeInTheDocument();

      rerender(<div />); // Clear for next test
    });
  });

  it('should apply correct positioning and sizing', () => {
    render(<FileNode {...defaultProps} />);

    const container = screen
      .getByText('test-document.pdf')
      .closest('[data-node-id]');

    expect(container).toHaveStyle({
      left: '100px',
      top: '200px',
      width: '250px',
      height: '80px',
      zIndex: '1',
    });
  });

  it('should render with scaled dimensions', () => {
    render(<FileNode {...defaultProps} scale={0.5} />);

    // Should render Rect with minimum dimensions
    expect(mockRect).toHaveBeenCalledWith(
      expect.objectContaining({
        width: 180, // Math.max(180, node.size.width * 0.5)
        height: 60, // Math.max(60, node.size.height * 0.5)
      }),
      expect.anything()
    );
  });

  it('should render file type badge at small scales', () => {
    render(<FileNode {...defaultProps} scale={0.5} />);

    // Should render file type badge
    expect(mockText).toHaveBeenCalledWith(
      expect.objectContaining({
        text: 'PDF',
      }),
      expect.anything()
    );
  });

  it('should not render file type badge at normal scales', () => {
    render(<FileNode {...defaultProps} scale={1} />);

    // Should not render file type badge (scale >= 0.6)
    const pdfCalls = mockText.mock.calls.filter(call => call[0].text === 'PDF');
    expect(pdfCalls).toHaveLength(0);
  });
});
