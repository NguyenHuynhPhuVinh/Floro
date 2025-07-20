import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import { CanvasDragDropHandler } from '../CanvasDragDropHandler';

describe('CanvasDragDropHandler', () => {
  const mockOnFileDrop = jest.fn();
  const mockOnDragOver = jest.fn();
  const mockOnDragLeave = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render children correctly', () => {
    render(
      <CanvasDragDropHandler onFileDrop={mockOnFileDrop}>
        <div>Test Content</div>
      </CanvasDragDropHandler>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should show drag overlay when dragging files over', () => {
    render(
      <CanvasDragDropHandler onFileDrop={mockOnFileDrop}>
        <div>Test Content</div>
      </CanvasDragDropHandler>
    );

    const container = screen.getByText('Test Content').parentElement;

    // Create mock drag event with files
    const dragEvent = new Event('dragenter', { bubbles: true });
    Object.defineProperty(dragEvent, 'dataTransfer', {
      value: {
        items: [{ kind: 'file' }],
      },
    });

    fireEvent(container!, dragEvent);

    expect(
      screen.getByText('Drop files here to create File Nodes')
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Supports documents, images, archives, code files, and more'
      )
    ).toBeInTheDocument();
  });

  it('should hide drag overlay when drag leaves', () => {
    render(
      <CanvasDragDropHandler onFileDrop={mockOnFileDrop}>
        <div>Test Content</div>
      </CanvasDragDropHandler>
    );

    const container = screen.getByText('Test Content').parentElement;

    // Enter drag
    const dragEnterEvent = new Event('dragenter', { bubbles: true });
    Object.defineProperty(dragEnterEvent, 'dataTransfer', {
      value: {
        items: [{ kind: 'file' }],
      },
    });
    fireEvent(container!, dragEnterEvent);

    expect(
      screen.getByText('Drop files here to create File Nodes')
    ).toBeInTheDocument();

    // Leave drag - should hide overlay when counter reaches 0
    const dragLeaveEvent = new Event('dragleave', { bubbles: true });
    fireEvent(container!, dragLeaveEvent);

    // Should be hidden now
    expect(
      screen.queryByText('Drop files here to create File Nodes')
    ).not.toBeInTheDocument();
  });

  it('should call onFileDrop when files are dropped', () => {
    render(
      <CanvasDragDropHandler onFileDrop={mockOnFileDrop}>
        <div>Test Content</div>
      </CanvasDragDropHandler>
    );

    const container = screen.getByText('Test Content').parentElement;

    // Mock getBoundingClientRect
    jest.spyOn(container!, 'getBoundingClientRect').mockReturnValue({
      left: 100,
      top: 200,
      width: 500,
      height: 300,
      right: 600,
      bottom: 500,
      x: 100,
      y: 200,
      toJSON: () => {},
    });

    // Create mock files
    const file1 = new File(['content1'], 'file1.pdf', {
      type: 'application/pdf',
    });
    const file2 = new File(['content2'], 'file2.txt', { type: 'text/plain' });

    // Create drop event
    const dropEvent = new Event('drop', { bubbles: true });
    Object.defineProperty(dropEvent, 'dataTransfer', {
      value: {
        files: [file1, file2],
      },
    });
    Object.defineProperty(dropEvent, 'clientX', { value: 150 });
    Object.defineProperty(dropEvent, 'clientY', { value: 250 });

    fireEvent(container!, dropEvent);

    expect(mockOnFileDrop).toHaveBeenCalledWith(
      [file1, file2],
      { x: 50, y: 50 } // clientX - rect.left, clientY - rect.top
    );
  });

  it('should not call onFileDrop when no files are dropped', () => {
    render(
      <CanvasDragDropHandler onFileDrop={mockOnFileDrop}>
        <div>Test Content</div>
      </CanvasDragDropHandler>
    );

    const container = screen.getByText('Test Content').parentElement;

    // Create drop event with no files
    const dropEvent = new Event('drop', { bubbles: true });
    Object.defineProperty(dropEvent, 'dataTransfer', {
      value: {
        files: [],
      },
    });

    fireEvent(container!, dropEvent);

    expect(mockOnFileDrop).not.toHaveBeenCalled();
  });

  it('should call onDragOver callback when provided', () => {
    render(
      <CanvasDragDropHandler
        onFileDrop={mockOnFileDrop}
        onDragOver={mockOnDragOver}
      >
        <div>Test Content</div>
      </CanvasDragDropHandler>
    );

    const container = screen.getByText('Test Content').parentElement;

    const dragOverEvent = new Event('dragover', { bubbles: true });
    Object.defineProperty(dragOverEvent, 'dataTransfer', {
      value: {
        dropEffect: '',
      },
    });

    fireEvent(container!, dragOverEvent);

    expect(mockOnDragOver).toHaveBeenCalled();
  });

  it('should call onDragLeave callback when provided', () => {
    render(
      <CanvasDragDropHandler
        onFileDrop={mockOnFileDrop}
        onDragLeave={mockOnDragLeave}
      >
        <div>Test Content</div>
      </CanvasDragDropHandler>
    );

    const container = screen.getByText('Test Content').parentElement;

    const dragLeaveEvent = new Event('dragleave', { bubbles: true });
    fireEvent(container!, dragLeaveEvent);

    expect(mockOnDragLeave).toHaveBeenCalled();
  });

  it('should set correct drop effect on drag over', () => {
    render(
      <CanvasDragDropHandler onFileDrop={mockOnFileDrop}>
        <div>Test Content</div>
      </CanvasDragDropHandler>
    );

    const container = screen.getByText('Test Content').parentElement;

    const dragOverEvent = new Event('dragover', { bubbles: true });
    const mockDataTransfer = {
      dropEffect: '',
    };
    Object.defineProperty(dragOverEvent, 'dataTransfer', {
      value: mockDataTransfer,
    });

    fireEvent(container!, dragOverEvent);

    expect(mockDataTransfer.dropEffect).toBe('copy');
  });

  it('should apply custom className', () => {
    render(
      <CanvasDragDropHandler
        onFileDrop={mockOnFileDrop}
        className="custom-class"
      >
        <div>Test Content</div>
      </CanvasDragDropHandler>
    );

    const container = screen.getByText('Test Content').parentElement;
    expect(container).toHaveClass('custom-class');
  });

  it('should handle drag counter correctly for nested elements', () => {
    render(
      <CanvasDragDropHandler onFileDrop={mockOnFileDrop}>
        <div>
          <div>Nested Content</div>
        </div>
      </CanvasDragDropHandler>
    );

    const container =
      screen.getByText('Nested Content').parentElement?.parentElement;

    // Multiple drag enters (simulating nested elements)
    const dragEnterEvent1 = new Event('dragenter', { bubbles: true });
    Object.defineProperty(dragEnterEvent1, 'dataTransfer', {
      value: { items: [{ kind: 'file' }] },
    });

    const dragEnterEvent2 = new Event('dragenter', { bubbles: true });
    Object.defineProperty(dragEnterEvent2, 'dataTransfer', {
      value: { items: [{ kind: 'file' }] },
    });

    fireEvent(container!, dragEnterEvent1);
    fireEvent(container!, dragEnterEvent2);

    expect(
      screen.getByText('Drop files here to create File Nodes')
    ).toBeInTheDocument();

    // First drag leave
    const dragLeaveEvent1 = new Event('dragleave', { bubbles: true });
    fireEvent(container!, dragLeaveEvent1);

    // Should still show overlay
    expect(
      screen.getByText('Drop files here to create File Nodes')
    ).toBeInTheDocument();

    // Second drag leave
    const dragLeaveEvent2 = new Event('dragleave', { bubbles: true });
    fireEvent(container!, dragLeaveEvent2);

    // Now overlay should be hidden
    expect(
      screen.queryByText('Drop files here to create File Nodes')
    ).not.toBeInTheDocument();
  });
});
