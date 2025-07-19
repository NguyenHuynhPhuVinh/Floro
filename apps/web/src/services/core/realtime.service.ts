import type {
  RealtimeChannel,
  RealtimePostgresChangesPayload,
} from '@supabase/supabase-js';

import { supabase } from '@/lib/supabase';

export interface CursorPosition {
  id: string;
  user_id: string;
  canvas_id: string;
  position: {
    x: number;
    y: number;
  };
  timestamp: string;
}

interface PostgresChangesConfig {
  event: 'INSERT' | 'UPDATE' | 'DELETE';
  schema: string;
  table: string;
  filter?: string;
}

export interface RealtimeSubscriptionCallbacks<
  T extends Record<string, unknown> = Record<string, unknown>,
> {
  onInsert?: (payload: RealtimePostgresChangesPayload<T>) => void;
  onUpdate?: (payload: RealtimePostgresChangesPayload<T>) => void;
  onDelete?: (payload: RealtimePostgresChangesPayload<T>) => void;
}

export class RealtimeService {
  private static channels: Map<string, RealtimeChannel> = new Map();

  /**
   * Subscribe to real-time changes on a table
   */
  static subscribeToTable<
    T extends Record<string, unknown> = Record<string, unknown>,
  >(
    tableName: string,
    callbacks: RealtimeSubscriptionCallbacks<T>,
    filter?: string
  ): string {
    const channelName = `${tableName}:${filter || 'all'}:${Date.now()}`;

    let channel = supabase.channel(channelName);

    if (callbacks.onInsert) {
      const config: PostgresChangesConfig = {
        event: 'INSERT',
        schema: 'public',
        table: tableName,
        filter,
      };
      channel = channel.on(
        'postgres_changes' as never,
        config as never,
        callbacks.onInsert
      );
    }

    if (callbacks.onUpdate) {
      const config: PostgresChangesConfig = {
        event: 'UPDATE',
        schema: 'public',
        table: tableName,
        filter,
      };
      channel = channel.on(
        'postgres_changes' as never,
        config as never,
        callbacks.onUpdate
      );
    }

    if (callbacks.onDelete) {
      const config: PostgresChangesConfig = {
        event: 'DELETE',
        schema: 'public',
        table: tableName,
        filter,
      };
      channel = channel.on(
        'postgres_changes' as never,
        config as never,
        callbacks.onDelete
      );
    }

    channel.subscribe();
    this.channels.set(channelName, channel);

    return channelName;
  }

  /**
   * Subscribe to cursor movements for real-time collaboration
   */
  static subscribeToCursors(
    canvasId: string,
    onCursorUpdate: (cursor: CursorPosition) => void,
    onCursorRemove: (userId: string) => void
  ): string {
    const channelName = `cursors:${canvasId}`;

    const channel = supabase
      .channel(channelName)
      .on('broadcast', { event: 'cursor_move' }, ({ payload }) => {
        onCursorUpdate(payload as CursorPosition);
      })
      .on('broadcast', { event: 'cursor_leave' }, ({ payload }) => {
        onCursorRemove(payload.user_id);
      })
      .subscribe();

    this.channels.set(channelName, channel);
    return channelName;
  }

  /**
   * Broadcast cursor position to other users
   */
  static async broadcastCursorPosition(
    canvasId: string,
    position: { x: number; y: number },
    userId: string
  ): Promise<void> {
    const channelName = `cursors:${canvasId}`;
    const channel = this.channels.get(channelName);

    if (channel) {
      await channel.send({
        type: 'broadcast',
        event: 'cursor_move',
        payload: {
          id: `${userId}_${Date.now()}`,
          user_id: userId,
          canvas_id: canvasId,
          position,
          timestamp: new Date().toISOString(),
        } as CursorPosition,
      });
    }
  }

  /**
   * Broadcast cursor leave event
   */
  static async broadcastCursorLeave(
    canvasId: string,
    userId: string
  ): Promise<void> {
    const channelName = `cursors:${canvasId}`;
    const channel = this.channels.get(channelName);

    if (channel) {
      await channel.send({
        type: 'broadcast',
        event: 'cursor_leave',
        payload: { user_id: userId },
      });
    }
  }

  /**
   * Subscribe to presence (who's online)
   */
  static subscribeToPresence(
    canvasId: string,
    userId: string,
    onPresenceUpdate: (presences: Record<string, unknown>) => void
  ): string {
    const channelName = `presence:${canvasId}`;

    const channel = supabase
      .channel(channelName)
      .on('presence', { event: 'sync' }, () => {
        const presences = channel.presenceState();
        onPresenceUpdate(presences);
      })
      .on('presence', { event: 'join' }, () => {
        // Handle new users joining
      })
      .on('presence', { event: 'leave' }, () => {
        // Handle users leaving
      })
      .subscribe(async status => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id: userId,
            online_at: new Date().toISOString(),
          });
        }
      });

    this.channels.set(channelName, channel);
    return channelName;
  }

  /**
   * Unsubscribe from a channel
   */
  static unsubscribe(channelName: string): void {
    const channel = this.channels.get(channelName);
    if (channel) {
      supabase.removeChannel(channel);
      this.channels.delete(channelName);
    }
  }

  /**
   * Unsubscribe from all channels
   */
  static unsubscribeAll(): void {
    this.channels.forEach(channel => {
      supabase.removeChannel(channel);
    });
    this.channels.clear();
  }

  /**
   * Get connection status
   */
  static getConnectionStatus(): string {
    // Supabase doesn't expose connection status directly
    // This is a simplified implementation
    return 'connected';
  }

  /**
   * Subscribe to connection status changes
   */
  static subscribeToConnectionStatus(
    onStatusChange: (status: string) => void
  ): () => void {
    // Supabase doesn't have direct connection status events
    // This is a placeholder implementation
    const interval = setInterval(() => {
      onStatusChange(this.getConnectionStatus());
    }, 5000);

    return () => clearInterval(interval);
  }
}
