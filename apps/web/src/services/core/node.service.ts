import type { RealtimeChannel } from '@supabase/supabase-js';

import { supabase } from '../../lib/supabase';
import { FileNode, FileNodeCreateData } from '../../types';

export interface FloroNode {
  id: string;
  type: string;
  position: {
    x: number;
    y: number;
  };
  data: Record<string, unknown>;
  metadata: {
    created_at: string;
    updated_at: string;
    created_by: string;
    version: number;
  };
  canvas_id: string;
}

export interface NodeCreateInput {
  type: string;
  position: { x: number; y: number };
  data: Record<string, unknown>;
  canvas_id: string;
}

export interface NodeUpdateInput {
  type?: string;
  position?: { x: number; y: number };
  data?: Record<string, unknown>;
}

export class NodeService {
  private static realtimeChannel: RealtimeChannel | null = null;

  private static handleError(operation: string, error: unknown): never {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`${operation}: ${message}`);
  }

  /**
   * Create a new node
   */
  static async createNode(input: NodeCreateInput): Promise<FloroNode> {
    const { data, error } = await supabase
      .from('floro_nodes')
      .insert({
        type: input.type,
        position: input.position,
        data: input.data,
        canvas_id: input.canvas_id,
        metadata: {
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          created_by: `anonymous_${Date.now()}_${Math.random().toString(36).substring(2)}`, // Unique anonymous ID for public collaboration
          version: 1,
        },
      })
      .select()
      .single();

    if (error) {
      this.handleError('Failed to create node', error);
    }

    return data as FloroNode;
  }

  /**
   * Get a node by ID
   */
  static async getNode(nodeId: string): Promise<FloroNode | null> {
    const { data, error } = await supabase
      .from('floro_nodes')
      .select('*')
      .eq('id', nodeId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Node not found
      }
      this.handleError('Failed to get node', error);
    }

    return data as FloroNode;
  }

  /**
   * Update a node
   */
  static async updateNode(
    nodeId: string,
    updates: NodeUpdateInput
  ): Promise<FloroNode> {
    // First get current node to increment version
    const currentNode = await this.getNode(nodeId);
    if (!currentNode) {
      throw new Error(`Node with ID ${nodeId} not found`);
    }

    const { data, error } = await supabase
      .from('floro_nodes')
      .update({
        ...updates,
        metadata: {
          ...currentNode.metadata,
          updated_at: new Date().toISOString(),
          version: currentNode.metadata.version + 1,
        },
      })
      .eq('id', nodeId)
      .select()
      .single();

    if (error) {
      this.handleError('Failed to update node', error);
    }

    return data as FloroNode;
  }

  /**
   * Delete a node
   */
  static async deleteNode(nodeId: string): Promise<void> {
    const { error } = await supabase
      .from('floro_nodes')
      .delete()
      .eq('id', nodeId);

    if (error) {
      this.handleError('Failed to delete node', error);
    }
  }

  /**
   * Get nodes by canvas ID
   */
  static async getNodesByCanvas(canvasId: string): Promise<FloroNode[]> {
    const { data, error } = await supabase
      .from('floro_nodes')
      .select('*')
      .eq('canvas_id', canvasId)
      .order('metadata->created_at', { ascending: true });

    if (error) {
      this.handleError('Failed to get nodes by canvas', error);
    }

    return data as FloroNode[];
  }

  /**
   * Get nodes within viewport bounds (spatial query)
   */
  static async getNodesInViewport(
    canvasId: string,
    bounds: {
      minX: number;
      minY: number;
      maxX: number;
      maxY: number;
    }
  ): Promise<FloroNode[]> {
    const { data, error } = await supabase
      .from('floro_nodes')
      .select('*')
      .eq('canvas_id', canvasId)
      .gte('position->x', bounds.minX)
      .lte('position->x', bounds.maxX)
      .gte('position->y', bounds.minY)
      .lte('position->y', bounds.maxY);

    if (error) {
      this.handleError('Failed to get nodes in viewport', error);
    }

    return data as FloroNode[];
  }

  /**
   * Subscribe to real-time node changes
   */
  static subscribeToNodes(
    canvasId: string,
    callbacks: {
      onInsert?: (node: FloroNode) => void;
      onUpdate?: (node: FloroNode) => void;
      onDelete?: (nodeId: string) => void;
    }
  ): () => void {
    this.realtimeChannel = supabase
      .channel(`nodes:${canvasId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'floro_nodes',
          filter: `canvas_id=eq.${canvasId}`,
        },
        payload => {
          if (callbacks.onInsert) {
            callbacks.onInsert(payload.new as FloroNode);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'floro_nodes',
          filter: `canvas_id=eq.${canvasId}`,
        },
        payload => {
          if (callbacks.onUpdate) {
            callbacks.onUpdate(payload.new as FloroNode);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'floro_nodes',
          filter: `canvas_id=eq.${canvasId}`,
        },
        payload => {
          if (callbacks.onDelete) {
            callbacks.onDelete(payload.old.id);
          }
        }
      )
      .subscribe();

    // Return unsubscribe function
    return () => {
      if (this.realtimeChannel) {
        supabase.removeChannel(this.realtimeChannel);
        this.realtimeChannel = null;
      }
    };
  }

  /**
   * Batch update multiple nodes
   */
  static async batchUpdateNodes(
    updates: Array<{ id: string; updates: NodeUpdateInput }>
  ): Promise<FloroNode[]> {
    const promises = updates.map(({ id, updates: nodeUpdates }) =>
      this.updateNode(id, nodeUpdates)
    );

    try {
      const results = await Promise.all(promises);
      return results;
    } catch (error) {
      this.handleError('Failed to batch update nodes', error);
    }
  }

  /**
   * NEW: Update multiple nodes with batch operation for multi-select
   */
  static async updateMultipleNodes(
    updates: Array<{ nodeId: string; data: Partial<FileNode> }>
  ): Promise<FloroNode[]> {
    const promises = updates.map(({ nodeId, data }) =>
      this.updateNode(nodeId, {
        position: data.position,
        data: data as Record<string, unknown>,
      })
    );

    try {
      const results = await Promise.all(promises);
      return results;
    } catch (error) {
      this.handleError('Failed to update multiple nodes', error);
    }
  }

  /**
   * NEW: Delete multiple nodes for batch operations with file cleanup
   */
  static async deleteMultipleNodes(nodeIds: string[]): Promise<void> {
    try {
      // First get all nodes to access file information
      const { data: nodes, error: fetchError } = await supabase
        .from('floro_nodes')
        .select('*')
        .in('id', nodeIds);

      if (fetchError) {
        this.handleError('Failed to fetch nodes for deletion', fetchError);
      }

      // Clean up files from storage for FileNodes
      if (nodes && nodes.length > 0) {
        const fileCleanupPromises = nodes
          .filter(node => node.type === 'file' && node.data.fileURL)
          .map(async node => {
            try {
              const fileURL = node.data.fileURL as string;
              const filePath = this.extractFilePathFromURL(fileURL);
              if (filePath) {
                await this.deleteFileFromStorage(filePath);
              }
            } catch (storageError) {
              // eslint-disable-next-line no-console
              console.warn(
                `Failed to delete file from storage for node ${node.id}:`,
                storageError
              );
              // Continue with other files even if one fails
            }
          });

        // Wait for all file cleanup operations to complete (or fail)
        await Promise.allSettled(fileCleanupPromises);
      }

      // Delete nodes from database
      const { error } = await supabase
        .from('floro_nodes')
        .delete()
        .in('id', nodeIds);

      if (error) {
        this.handleError('Failed to delete multiple nodes', error);
      }
    } catch (error) {
      this.handleError(
        'Failed to delete multiple nodes with file cleanup',
        error
      );
    }
  }

  /**
   * Helper method to extract file path from Supabase Storage URL
   */
  private static extractFilePathFromURL(fileURL: string): string | null {
    try {
      // URL format: https://[project].supabase.co/storage/v1/object/public/floro-assets/files/filename
      // We need to extract everything after the bucket name

      const urlParts = fileURL.split('/');
      const publicIndex = urlParts.findIndex(part => part === 'public');

      if (publicIndex === -1 || publicIndex + 2 >= urlParts.length) {
        return null;
      }

      // Skip 'public' and bucket name (floro-assets), get the rest as file path
      const encodedFilePath = urlParts.slice(publicIndex + 2).join('/');

      // Decode URL to handle spaces and special characters
      const filePath = decodeURIComponent(encodedFilePath);

      return filePath || null;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Failed to parse file URL:', error);
      return null;
    }
  }

  /**
   * Helper method to delete file from Supabase Storage
   */
  private static async deleteFileFromStorage(filePath: string): Promise<void> {
    const { error } = await supabase.storage
      .from('floro-assets') // Use the correct bucket name
      .remove([filePath]);

    if (error) {
      throw new Error(`Failed to delete file from storage: ${error.message}`);
    }
  }

  /**
   * NEW: Delete a FileNode with file cleanup in Supabase Storage
   */
  static async deleteFileNode(nodeId: string): Promise<void> {
    try {
      // First get the node to access file information
      const node = await this.getNode(nodeId);
      if (!node) {
        throw new Error(`Node with ID ${nodeId} not found`);
      }

      // Clean up file from storage if it's a FileNode
      if (node.type === 'file' && node.data.fileURL) {
        try {
          const fileURL = node.data.fileURL as string;
          const filePath = this.extractFilePathFromURL(fileURL);
          if (filePath) {
            await this.deleteFileFromStorage(filePath);
          }
        } catch (storageError) {
          // eslint-disable-next-line no-console
          console.warn('Failed to delete file from storage:', storageError);
          // Continue with node deletion even if file cleanup fails
        }
      }

      // Delete the node from database
      await this.deleteNode(nodeId);
    } catch (error) {
      this.handleError('Failed to delete file node', error);
    }
  }

  /**
   * Get all nodes for a session
   */
  static async getNodesBySession(sessionId: string): Promise<FileNode[]> {
    try {
      // For "public" session, we need to get all nodes since we generate UUIDs
      // This is a temporary solution until we implement proper session management
      let query = supabase.from('floro_nodes').select('*');

      if (sessionId !== 'public') {
        query = query.eq('canvas_id', sessionId);
      }

      const { data, error } = await query;

      if (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch nodes:', error);
        return [];
      }

      if (!data || data.length === 0) {
        return [];
      }

      // Transform database results to FileNode interface
      const nodes: FileNode[] = data.map(dbNode => ({
        id: dbNode.id,
        sessionId: dbNode.canvas_id,
        type: 'file',
        fileName: dbNode.data.fileName,
        fileType: dbNode.data.fileType,
        fileURL: dbNode.data.fileURL,
        fileSize: dbNode.data.fileSize,
        mimeType: dbNode.data.mimeType,
        checksum: dbNode.data.checksum,
        position: dbNode.position,
        size: dbNode.data.size || { width: 200, height: 80 },
        createdAt: dbNode.created_at,
        updatedAt: dbNode.updated_at,
        zIndex: dbNode.data.zIndex || 1,
        isLocked: dbNode.data.isLocked || false,
        metadata: dbNode.metadata,
      }));

      return nodes;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to get nodes by session:', error);
      return [];
    }
  }

  /**
   * Ensures canvas exists, creates if not found
   */
  private static async ensureCanvasExists(canvasId: string): Promise<void> {
    try {
      // eslint-disable-next-line no-console
      console.log('Checking if canvas exists:', canvasId);

      // Check if canvas exists
      const { data: existingCanvas, error: selectError } = await supabase
        .from('canvas')
        .select('id')
        .eq('id', canvasId)
        .single();

      // eslint-disable-next-line no-console
      console.log('Canvas check result:', { existingCanvas, selectError });

      if (!existingCanvas) {
        // eslint-disable-next-line no-console
        console.log('Creating new canvas:', canvasId);

        // Create canvas if it doesn't exist
        const { data: newCanvas, error: insertError } = await supabase
          .from('canvas')
          .insert({
            id: canvasId,
            name:
              canvasId === 'public' ? 'Public Canvas' : `Canvas ${canvasId}`,
            description: 'Auto-created canvas for file uploads',
            settings: {},
          })
          .select()
          .single();

        // eslint-disable-next-line no-console
        console.log('Canvas creation result:', { newCanvas, insertError });

        if (insertError) {
          // eslint-disable-next-line no-console
          console.warn(
            'Failed to create canvas, continuing anyway:',
            insertError
          );
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Canvas check/creation failed, continuing anyway:', error);
    }
  }

  /**
   * Create a FileNode with file-specific data
   */
  static async createFileNode(
    fileData: FileNodeCreateData,
    position: { x: number; y: number },
    sessionId: string = 'public'
  ): Promise<FileNode> {
    try {
      // Generate UUID for sessionId if it's "public"
      const canvasId = sessionId === 'public' ? crypto.randomUUID() : sessionId;

      // Skip canvas creation for now since table doesn't exist
      // await this.ensureCanvasExists(canvasId);

      // Calculate default size based on file name length
      const defaultWidth = Math.max(
        200,
        Math.min(300, fileData.fileName.length * 8 + 100)
      );
      const defaultHeight = 80;

      const nodeData = {
        fileName: fileData.fileName,
        fileType: fileData.fileType,
        fileURL: fileData.fileURL,
        fileSize: fileData.fileSize,
        mimeType: fileData.mimeType,
        checksum: fileData.checksum,
        size: { width: defaultWidth, height: defaultHeight },
        zIndex: 1,
        isLocked: false,
      };

      const insertData = {
        type: 'file',
        position,
        data: nodeData,
        canvas_id: canvasId,
        metadata: {
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          created_by: `anonymous_${Date.now()}_${Math.random().toString(36).substring(2)}`,
          version: 1,
        },
      };

      // eslint-disable-next-line no-console
      console.log('Inserting node data:', JSON.stringify(insertData, null, 2));

      const { data, error } = await supabase
        .from('floro_nodes')
        .insert(insertData)
        .select()
        .single();

      // eslint-disable-next-line no-console
      console.log('Insert result:', { data, error });

      if (error) {
        this.handleError('Failed to create file node', error);
      }

      // Transform the database result to FileNode interface
      const fileNode: FileNode = {
        id: data.id,
        sessionId: canvasId,
        type: 'file',
        fileName: data.data.fileName,
        fileType: data.data.fileType,
        fileURL: data.data.fileURL,
        fileSize: data.data.fileSize,
        mimeType: data.data.mimeType,
        checksum: data.data.checksum,
        position: data.position,
        size: data.data.size || { width: defaultWidth, height: defaultHeight },
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        zIndex: data.data.zIndex || 1,
        isLocked: data.data.isLocked || false,
        metadata: data.metadata,
      };

      return fileNode;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to create file node:', error);
      throw new Error(
        `Failed to create file node: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}
