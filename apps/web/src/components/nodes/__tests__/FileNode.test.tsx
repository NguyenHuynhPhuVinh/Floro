import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FileNode } from '../FileNode';
import { FileNode as FileNodeType } from '../../../types';

// Mock react-konva components

jest.mock('react-konva', () => {
  // Filter out Konva-specific props that shouldn't be passed to DOM elements
  const filterKonvaProps = (props: any) => {
    const {
      scaleX,
      scaleY,
      ellipsis,
      strokeWidth,
      strokeLinecap,
      strokeLinejoin,
      cornerRadius,
      shadowColor,
      shadowBlur,
      shadowOpacity,
      fontFamily,
      fontStyle,
      fontSize,
      fill,
      stroke,
      data,
      radius,
      ...domProps
    } = props;
    return domProps;
  };

  return {
    Group: jest.fn().mockImplementation(({ children, ...props }) => (
      <div data-testid="konva-group" {...filterKonvaProps(props)}>
        {children}
      </div>
    )),
    Rect: jest
      .fn()
      .mockImplementation(props => (
        <div data-testid="konva-rect" {...filterKonvaProps(props)} />
      )),
    Text: jest.fn().mockImplementation(props => (
      <div
        data-testid="konva-text"
        data-text={props.text}
        {...filterKonvaProps(props)}
      >
        {props.text}
      </div>
    )),
    Circle: jest
      .fn()
      .mockImplementation(props => (
        <div data-testid="konva-circle" {...filterKonvaProps(props)} />
      )),
    Path: jest
      .fn()
      .mockImplementation(props => (
        <div data-testid="konva-path" {...filterKonvaProps(props)} />
      )),
  };
});

// Get the actual mock functions for assertions
const konvaMocks = jest.requireMock('react-konva');
const mockGroup = konvaMocks.Group;
const mockRect = konvaMocks.Rect;
const mockText = konvaMocks.Text;

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

describe.skip('FileNode', () => {
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
      })
    );
  });

  it('should render file name and size as Text components', () => {
    render(<FileNode {...defaultProps} />);

    // Check filename text (first Text call)
    expect(mockText).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        text: 'test-document.pdf',
      })
    );

    // Check file size text (second Text call)
    expect(mockText).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        text: '50 KB',
      })
    );
  });

  it('should truncate long file names', () => {
    const longNameNode = {
      ...mockFileNode,
      fileName: 'this-is-a-very-long-file-name-that-should-be-truncated.pdf',
    };

    render(<FileNode {...defaultProps} node={longNameNode} />);

    expect(mockText).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        text: expect.stringMatching(/this-is-a-very-lon.*\.pdf/),
      })
    );
  });

  it('should render Rect with selection styling when selected', () => {
    render(<FileNode {...defaultProps} isSelected={true} />);

    expect(mockRect).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        stroke: '#3b82f6',
        strokeWidth: 2,
      })
    );
  });

  it('should render Rect with default styling when not selected', () => {
    render(<FileNode {...defaultProps} isSelected={false} />);

    expect(mockRect).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        stroke: '#e5e7eb',
        strokeWidth: 1,
      })
    );
  });

  it('should show hover elements when hovered', async () => {
    const onDownload = jest.fn();
    const onDelete = jest.fn();

    render(
      <FileNode {...defaultProps} onDownload={onDownload} onDelete={onDelete} />
    );

    const nodeElement = screen.getByTestId('konva-group');

    // Simulate hover
    fireEvent.mouseEnter(nodeElement);

    // Check that hover text appears
    await waitFor(() => {
      expect(screen.getByText('Double-click to download')).toBeInTheDocument();
    });
  });

  it('should call onDownload when double-clicked', async () => {
    const onDownload = jest.fn();

    render(<FileNode {...defaultProps} onDownload={onDownload} />);

    const nodeElement = screen.getByTestId('konva-group');

    // Simulate double-click
    fireEvent.doubleClick(nodeElement);

    await waitFor(() => {
      expect(onDownload).toHaveBeenCalledWith(mockFileNode);
    });
  });

  it('should call onSelect when single-clicked', async () => {
    const onSelect = jest.fn();

    render(<FileNode {...defaultProps} onSelect={onSelect} />);

    const nodeElement = screen.getByTestId('konva-group');

    // Simulate single click
    fireEvent.click(nodeElement);

    await waitFor(() => {
      expect(onSelect).toHaveBeenCalledWith('test-node-1');
    });
  });

  it('should not be draggable when locked', () => {
    const lockedNode = { ...mockFileNode, isLocked: true };

    render(<FileNode {...defaultProps} node={lockedNode} />);

    // Check that main Group component was called with draggable=false (first call)
    expect(mockGroup).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        draggable: false,
      })
    );
  });

  it('should show lock indicator for locked nodes', () => {
    const lockedNode = { ...mockFileNode, isLocked: true };

    render(<FileNode {...defaultProps} node={lockedNode} />);

    // Check that lock emoji text is rendered (third text call)
    expect(mockText).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({
        text: '🔒',
      })
    );
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

    // Check that main Group component was called with correct positioning (first call)
    expect(mockGroup).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        x: 100,
        y: 200,
      })
    );

    // Check that Rect component was called with correct sizing (first call is main rect)
    expect(mockRect).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        width: 250,
        height: 80,
      })
    );
  });

  it('should render with scaled dimensions', () => {
    render(<FileNode {...defaultProps} scale={0.5} />);

    // Should render main Rect with minimum dimensions (first call)
    expect(mockRect).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        width: 180, // Math.max(180, node.size.width * 0.5)
        height: 60, // Math.max(60, node.size.height * 0.5)
      })
    );
  });

  it('should render file type badge at small scales', () => {
    render(<FileNode {...defaultProps} scale={0.5} />);

    // Should render file type badge (third text call: filename, size, badge)
    expect(mockText).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({
        text: 'PDF',
      })
    );
  });

  it('should not render file type badge at normal scales', () => {
    render(<FileNode {...defaultProps} scale={1} />);

    // Should not render file type badge (scale >= 0.6)
    const pdfCalls = mockText.mock.calls.filter(
      (call: any) => call[0].text === 'PDF'
    );
    expect(pdfCalls).toHaveLength(0);
  });
});
