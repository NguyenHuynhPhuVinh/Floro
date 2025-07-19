import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FileNode } from '../FileNode';
import { FileNode as FileNodeType } from '../../../types';

// Mock hooks
jest.mock('../../../hooks/nodes/useNodeDrag', () => ({
  useNodeDrag: () => ({
    isDragging: false,
    handleDragStart: jest.fn(),
  }),
}));

jest.mock('../../../hooks/nodes/useFileDownload', () => ({
  useFileDownload: () => ({
    downloadFile: jest.fn(),
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

  it('should render file node with correct information', () => {
    render(<FileNode {...defaultProps} />);

    expect(screen.getByText('test-document.pdf')).toBeInTheDocument();
    expect(screen.getByText('50 KB')).toBeInTheDocument();
  });

  it('should truncate long file names', () => {
    const longNameNode = {
      ...mockFileNode,
      fileName: 'this-is-a-very-long-file-name-that-should-be-truncated.pdf',
    };

    render(<FileNode {...defaultProps} node={longNameNode} />);

    const fileName = screen.getByText(/this-is-a-very-lon.*\.pdf/);
    expect(fileName.textContent).toMatch(/\.\.\..*\.pdf$/);
  });

  it('should show selection indicator when selected', () => {
    render(<FileNode {...defaultProps} isSelected={true} />);

    const container = screen
      .getByText('test-document.pdf')
      .closest('[data-node-id]');
    expect(container).toHaveClass('border-blue-500');
  });

  it('should call onSelect when clicked', () => {
    const onSelect = jest.fn();
    render(<FileNode {...defaultProps} onSelect={onSelect} />);

    fireEvent.click(screen.getByText('test-document.pdf'));

    expect(onSelect).toHaveBeenCalledWith('test-node-1');
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

  it('should scale correctly based on scale prop', () => {
    render(<FileNode {...defaultProps} scale={0.5} />);

    const container = screen
      .getByText('test-document.pdf')
      .closest('[data-node-id]');

    // Should use minimum width when scaled down
    expect(container).toHaveStyle({
      width: '180px', // Math.max(180, 250 * 0.5)
      height: '60px', // Math.max(60, 80 * 0.5)
    });
  });

  it('should show file type badge at small scales', () => {
    render(<FileNode {...defaultProps} scale={0.5} />);

    expect(screen.getByText('PDF')).toBeInTheDocument();
  });

  it('should not show file type badge at normal scales', () => {
    render(<FileNode {...defaultProps} scale={1} />);

    expect(screen.queryByText('PDF')).not.toBeInTheDocument();
  });
});
