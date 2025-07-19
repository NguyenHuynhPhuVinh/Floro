import { supabase } from '@/lib/supabase';
import type { PostgrestError, RealtimeChannel } from '@supabase/supabase-js';

export interface FloroNode {
  id: string;
  type: string;
  position: {
    x: number;
    y: number;
  };
  data: Record<string, any>;
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
  data: Record<string, any>;
  canvas_id: string;
}

export interface NodeUpdateInput {
  type?: string;
  position?: { x: number; y: number };
  data?: Record<string, any>;
}

export class NodeService {
  private static realtimeChannel: RealtimeChannel | null = null;

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
          created_by: 'anonymous', // TODO: Replace with actual user ID
          version: 1,
        },
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating node:', error);
      throw new Error(`Failed to create node: ${error.message}`);
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
      console.error('Error getting node:', error);
      throw new Error(`Failed to get node: ${error.message}`);
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
    const { data, error } = await supabase
      .from('floro_nodes')
      .update({
        ...updates,
        metadata: {
          updated_at: new Date().toISOString(),
          version: supabase.rpc('increment_version', { node_id: nodeId }),
        },
      })
      .eq('id', nodeId)
      .select()
      .single();

    if (error) {
      console.error('Error updating node:', error);
      throw new Error(`Failed to update node: ${error.message}`);
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
      console.error('Error deleting node:', error);
      throw new Error(`Failed to delete node: ${error.message}`);
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
      console.error('Error getting nodes by canvas:', error);
      throw new Error(`Failed to get nodes: ${error.message}`);
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
      console.error('Error getting nodes in viewport:', error);
      throw new Error(`Failed to get nodes in viewport: ${error.message}`);
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
        (payload) => {
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
        (payload) => {
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
        (payload) => {
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
      console.error('Error in batch update:', error);
      throw new Error('Failed to batch update nodes');
    }
  }
}
