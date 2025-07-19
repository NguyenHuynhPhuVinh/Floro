import type { RealtimeChannel } from '@supabase/supabase-js';

import { supabase } from '@/lib/supabase';

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
}
