import {
  ref,
  set,
  get,
  update,
  remove,
  onValue,
  off,
  push,
  serverTimestamp,
  DataSnapshot,
} from 'firebase/database';

import { realtimeDb } from '@/lib/firebase';

export class RealtimeService {
  /**
   * Set data at a specific path
   */
  static async setValue(path: string, value: any): Promise<void> {
    try {
      const dbRef = ref(realtimeDb, path);
      await set(dbRef, {
        ...value,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error setting value:', error);
      throw error;
    }
  }

  /**
   * Get data from a specific path
   */
  static async getValue<T = any>(path: string): Promise<T | null> {
    try {
      const dbRef = ref(realtimeDb, path);
      const snapshot = await get(dbRef);

      if (snapshot.exists()) {
        return snapshot.val() as T;
      }

      return null;
    } catch (error) {
      console.error('Error getting value:', error);
      throw error;
    }
  }

  /**
   * Update data at a specific path
   */
  static async updateValue(path: string, updates: Record<string, any>): Promise<void> {
    try {
      const dbRef = ref(realtimeDb, path);
      await update(dbRef, {
        ...updates,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating value:', error);
      throw error;
    }
  }

  /**
   * Remove data at a specific path
   */
  static async removeValue(path: string): Promise<void> {
    try {
      const dbRef = ref(realtimeDb, path);
      await remove(dbRef);
    } catch (error) {
      console.error('Error removing value:', error);
      throw error;
    }
  }

  /**
   * Push data to a list
   */
  static async pushValue(path: string, value: any): Promise<string> {
    try {
      const dbRef = ref(realtimeDb, path);
      const newRef = push(dbRef, {
        ...value,
        timestamp: serverTimestamp(),
      });

      return newRef.key!;
    } catch (error) {
      console.error('Error pushing value:', error);
      throw error;
    }
  }

  /**
   * Subscribe to data changes at a specific path
   */
  static subscribeToValue<T = any>(
    path: string,
    callback: (data: T | null) => void
  ): () => void {
    const dbRef = ref(realtimeDb, path);

    const unsubscribe = onValue(dbRef, (snapshot: DataSnapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.val() as T);
      } else {
        callback(null);
      }
    });

    return () => off(dbRef, 'value', unsubscribe);
  }

  /**
   * Subscribe to child events (added, changed, removed)
   */
  static subscribeToChildEvents<T = any>(
    path: string,
    callbacks: {
      onChildAdded?: (data: T, key: string) => void;
      onChildChanged?: (data: T, key: string) => void;
      onChildRemoved?: (key: string) => void;
    }
  ): () => void {
    const dbRef = ref(realtimeDb, path);
    const unsubscribeFunctions: (() => void)[] = [];

    if (callbacks.onChildAdded) {
      const unsubscribeAdded = onValue(dbRef, (snapshot: DataSnapshot) => {
        snapshot.forEach(childSnapshot => {
          callbacks.onChildAdded!(childSnapshot.val() as T, childSnapshot.key!);
        });
      });
      unsubscribeFunctions.push(() => off(dbRef, 'value', unsubscribeAdded));
    }

    // Return function to unsubscribe from all events
    return () => {
      unsubscribeFunctions.forEach(unsubscribe => unsubscribe());
    };
  }

  /**
   * Batch update multiple paths
   */
  static async batchUpdate(updates: Record<string, any>): Promise<void> {
    try {
      const timestampedUpdates: Record<string, any> = {};

      Object.keys(updates).forEach(path => {
        timestampedUpdates[path] = {
          ...updates[path],
          timestamp: serverTimestamp(),
        };
      });

      const dbRef = ref(realtimeDb);
      await update(dbRef, timestampedUpdates);
    } catch (error) {
      console.error('Error batch updating:', error);
      throw error;
    }
  }
}
