import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  onSnapshot,
  Timestamp,
  DocumentData,
  QueryConstraint,
} from 'firebase/firestore';

import { db } from '@/lib/firebase';

export interface FirebaseDocument {
  id: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export class FirebaseService {
  /**
   * Get a document by ID
   */
  static async getDocument<T extends DocumentData>(
    collectionName: string,
    documentId: string
  ): Promise<(T & FirebaseDocument) | null> {
    try {
      const docRef = doc(db, collectionName, documentId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        } as T & FirebaseDocument;
      }

      return null;
    } catch (error) {
      console.error('Error getting document:', error);
      throw error;
    }
  }

  /**
   * Create a new document
   */
  static async createDocument<T extends DocumentData>(
    collectionName: string,
    documentId: string,
    data: T
  ): Promise<void> {
    try {
      const docRef = doc(db, collectionName, documentId);
      const timestamp = Timestamp.now();

      await setDoc(docRef, {
        ...data,
        createdAt: timestamp,
        updatedAt: timestamp,
      });
    } catch (error) {
      console.error('Error creating document:', error);
      throw error;
    }
  }

  /**
   * Update a document
   */
  static async updateDocument<T extends Partial<DocumentData>>(
    collectionName: string,
    documentId: string,
    data: T
  ): Promise<void> {
    try {
      const docRef = doc(db, collectionName, documentId);

      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  }

  /**
   * Delete a document
   */
  static async deleteDocument(
    collectionName: string,
    documentId: string
  ): Promise<void> {
    try {
      const docRef = doc(db, collectionName, documentId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }

  /**
   * Query documents with constraints
   */
  static async queryDocuments<T extends DocumentData>(
    collectionName: string,
    constraints: QueryConstraint[] = []
  ): Promise<(T & FirebaseDocument)[]> {
    try {
      const collectionRef = collection(db, collectionName);
      const q = query(collectionRef, ...constraints);
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as (T & FirebaseDocument)[];
    } catch (error) {
      console.error('Error querying documents:', error);
      throw error;
    }
  }

  /**
   * Subscribe to document changes
   */
  static subscribeToDocument<T extends DocumentData>(
    collectionName: string,
    documentId: string,
    callback: (data: (T & FirebaseDocument) | null) => void
  ): () => void {
    const docRef = doc(db, collectionName, documentId);

    return onSnapshot(docRef, docSnap => {
      if (docSnap.exists()) {
        callback({
          id: docSnap.id,
          ...docSnap.data(),
        } as T & FirebaseDocument);
      } else {
        callback(null);
      }
    });
  }

  /**
   * Subscribe to collection changes
   */
  static subscribeToCollection<T extends DocumentData>(
    collectionName: string,
    constraints: QueryConstraint[] = [],
    callback: (data: (T & FirebaseDocument)[]) => void
  ): () => void {
    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, ...constraints);

    return onSnapshot(q, querySnapshot => {
      const documents = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as (T & FirebaseDocument)[];

      callback(documents);
    });
  }
}

// Export commonly used Firestore functions for convenience
export { where, orderBy, limit, Timestamp };
