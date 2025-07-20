import { renderHook, act } from '@testing-library/react';

import { NodeService } from '../../../services/core/node.service';
import { StorageService } from '../../../services/core/storage.service';
import { useFileUpload } from '../useFileUpload';

// Mock services
jest.mock('../../../services/core/storage.service');
jest.mock('../../../services/core/node.service');

const mockStorageService = StorageService as jest.Mocked<typeof StorageService>;
const mockNodeService = NodeService as jest.Mocked<typeof NodeService>;

describe('useFileUpload', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Setup default mocks
    mockStorageService.validateFile.mockReturnValue({
      isValid: true,
      fileType: 'pdf',
      mimeType: 'application/pdf',
    });

    mockStorageService.uploadFileWithIntegrityCheck.mockResolvedValue({
      url: 'https://example.com/file.pdf',
      checksum: 'abc123',
    });

    mockNodeService.createFileNode.mockResolvedValue({
      id: 'node-1',
      sessionId: 'public',
      type: 'file',
      fileName: 'test.pdf',
      fileType: 'pdf',
      fileURL: 'https://example.com/file.pdf',
      fileSize: 1024,
      mimeType: 'application/pdf',
      checksum: 'abc123',
      position: { x: 100, y: 200 },
      size: { width: 250, height: 80 },
      createdAt: '2025-07-19T10:00:00Z',
      updatedAt: '2025-07-19T10:00:00Z',
      zIndex: 1,
      isLocked: false,
    });
  });

  it('should initialize with empty state', () => {
    const { result } = renderHook(() => useFileUpload());

    expect(result.current.uploadProgress).toEqual({});
    expect(result.current.isUploading).toBe(false);
  });

  it('should upload a file successfully', async () => {
    const { result } = renderHook(() => useFileUpload());

    const file = new File(['test content'], 'test.pdf', {
      type: 'application/pdf',
    });

    let uploadResult;
    await act(async () => {
      uploadResult = await result.current.uploadFile(file, { x: 100, y: 200 });
    });

    expect(mockStorageService.validateFile).toHaveBeenCalledWith(file);
    expect(mockStorageService.uploadFileWithIntegrityCheck).toHaveBeenCalled();
    expect(mockNodeService.createFileNode).toHaveBeenCalled();
    expect(uploadResult).toBeDefined();
  });

  it('should track upload progress', async () => {
    const { result } = renderHook(() => useFileUpload());

    const file = new File(['test content'], 'test.pdf', {
      type: 'application/pdf',
    });

    // Mock progress callback
    mockStorageService.uploadFileWithIntegrityCheck.mockImplementation(
      (path, file, onProgress) => {
        if (onProgress) {
          onProgress({ loaded: 0, total: file.size, progress: 0 });
          onProgress({ loaded: file.size / 2, total: file.size, progress: 50 });
          onProgress({ loaded: file.size, total: file.size, progress: 100 });
        }
        return Promise.resolve({
          url: 'https://example.com/file.pdf',
          checksum: 'abc123',
        });
      }
    );

    await act(async () => {
      await result.current.uploadFile(file, { x: 100, y: 200 });
    });

    // Check that progress was tracked
    const progressEntries = Object.values(result.current.uploadProgress);
    expect(progressEntries.length).toBeGreaterThan(0);

    const finalProgress = progressEntries[0];
    expect(finalProgress.status).toBe('completed');
    expect(finalProgress.progress).toBe(100);
  });

  it('should handle validation errors', async () => {
    const { result } = renderHook(() => useFileUpload());

    mockStorageService.validateFile.mockReturnValue({
      isValid: false,
      error: 'File too large',
    });

    const file = new File(['test content'], 'large.pdf', {
      type: 'application/pdf',
    });

    await act(async () => {
      try {
        await result.current.uploadFile(file, { x: 100, y: 200 });
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });

    expect(
      mockStorageService.uploadFileWithIntegrityCheck
    ).not.toHaveBeenCalled();
    expect(mockNodeService.createFileNode).not.toHaveBeenCalled();
  });

  it('should handle upload errors', async () => {
    const { result } = renderHook(() => useFileUpload());

    mockStorageService.uploadFileWithIntegrityCheck.mockRejectedValue(
      new Error('Upload failed')
    );

    const file = new File(['test content'], 'test.pdf', {
      type: 'application/pdf',
    });

    await act(async () => {
      try {
        await result.current.uploadFile(file, { x: 100, y: 200 });
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });

    const progressEntries = Object.values(result.current.uploadProgress);
    expect(progressEntries[0].status).toBe('error');
  });

  it('should cancel upload', async () => {
    const { result } = renderHook(() => useFileUpload());

    const file = new File(['test content'], 'test.pdf', {
      type: 'application/pdf',
    });

    // Start upload
    act(() => {
      result.current.uploadFile(file, { x: 100, y: 200 });
    });

    // Get the file ID from progress
    const fileId = Object.keys(result.current.uploadProgress)[0];

    // Cancel upload
    act(() => {
      result.current.cancelUpload(fileId);
    });

    expect(result.current.uploadProgress[fileId].status).toBe('cancelled');
  });

  it('should upload multiple files', async () => {
    const { result } = renderHook(() => useFileUpload());

    const files = [
      new File(['content 1'], 'file1.pdf', { type: 'application/pdf' }),
      new File(['content 2'], 'file2.pdf', { type: 'application/pdf' }),
    ];

    let uploadResults;
    await act(async () => {
      uploadResults = await result.current.uploadMultipleFiles(files, {
        x: 100,
        y: 200,
      });
    });

    expect(uploadResults).toHaveLength(2);
    expect(
      mockStorageService.uploadFileWithIntegrityCheck
    ).toHaveBeenCalledTimes(2);
    expect(mockNodeService.createFileNode).toHaveBeenCalledTimes(2);
  });

  it('should handle partial failures in multiple file upload', async () => {
    const { result } = renderHook(() => useFileUpload());

    // Mock first file to succeed, second to fail
    mockStorageService.uploadFileWithIntegrityCheck
      .mockResolvedValueOnce({
        url: 'https://example.com/file1.pdf',
        checksum: 'abc123',
      })
      .mockRejectedValueOnce(new Error('Upload failed'));

    const files = [
      new File(['content 1'], 'file1.pdf', { type: 'application/pdf' }),
      new File(['content 2'], 'file2.pdf', { type: 'application/pdf' }),
    ];

    let uploadResults;
    await act(async () => {
      uploadResults = await result.current.uploadMultipleFiles(files, {
        x: 100,
        y: 200,
      });
    });

    // Should return only successful uploads
    expect(uploadResults).toHaveLength(1);
    expect(mockNodeService.createFileNode).toHaveBeenCalledTimes(1);
  });

  it('should set isUploading state correctly', async () => {
    const { result } = renderHook(() => useFileUpload());

    const file = new File(['test content'], 'test.pdf', {
      type: 'application/pdf',
    });

    // Mock services to return promises we can control
    let resolveUpload: (value: { url: string; checksum: string }) => void;
    const uploadPromise = new Promise<{
      url: string;
      checksum: string;
    }>(resolve => {
      resolveUpload = resolve;
    });

    mockStorageService.uploadFileWithIntegrityCheck.mockReturnValue(
      uploadPromise
    );
    mockNodeService.createFileNode.mockResolvedValue({
      id: 'test-node-id',
      sessionId: 'public',
      type: 'file',
      position: { x: 100, y: 200 },
      size: { width: 250, height: 80 },
      fileName: 'test.pdf',
      fileSize: 12,
      fileType: 'application/pdf',
      fileURL: 'https://test-url.com',
      mimeType: 'application/pdf',
      checksum: 'test-checksum',
      zIndex: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    expect(result.current.isUploading).toBe(false);

    // Start upload
    let fileUploadPromise: Promise<unknown>;
    await act(async () => {
      fileUploadPromise = result.current.uploadFile(file, { x: 100, y: 200 });
    });

    // Should be uploading now
    expect(result.current.isUploading).toBe(true);

    // Complete the upload
    await act(async () => {
      resolveUpload!({
        url: 'https://test-url.com',
        checksum: 'test-checksum',
      });
      await fileUploadPromise!;
    });

    // Should not be uploading after completion
    expect(result.current.isUploading).toBe(false);
  });
});
