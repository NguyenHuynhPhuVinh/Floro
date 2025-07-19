# 5. API Specification (Client-Side Service Layer)

All Firebase interactions from the Next.js app will be managed through a dedicated service layer located in `apps/web/src/services/`.

### 5.1 Core Services

- **`firebase.ts`:** Centralized initialization of Firebase services (Firestore, Realtime DB, Storage).
- **`node.service.ts`:** Manages CRUD operations and real-time listeners for `FloroNode` data in **Firestore**.
- **`storage.service.ts`:** Manages file uploads and retrievals from **Firebase Storage**.
- **`realtime.service.ts`:** Manages high-frequency updates, like cursor positions, using **Realtime Database**.

### 5.2 Advanced Services

- **`spatial.service.ts`:** Handles spatial indexing and viewport-based queries using quadtree implementation.
- **`cache.service.ts`:** Manages client-side caching strategies for nodes and assets.
- **`performance.service.ts`:** Tracks and reports performance metrics.
- **`error.service.ts`:** Centralized error handling and reporting.
- **`security.service.ts`:** Input sanitization and rate limiting logic.

### 5.3 Service Layer Architecture

```typescript
// Example service interface
interface NodeService {
  // CRUD operations
  createNode(
    node: Omit<FloroNode, "id" | "createdAt" | "updatedAt">
  ): Promise<FloroNode>;
  updateNode(id: string, updates: Partial<FloroNode>): Promise<void>;
  deleteNode(id: string): Promise<void>;

  // Spatial queries
  getNodesInViewport(bounds: SpatialBounds): Promise<FloroNode[]>;

  // Real-time subscriptions
  subscribeToNodes(
    sessionId: string,
    callback: (nodes: FloroNode[]) => void
  ): () => void;

  // Batch operations
  batchUpdateNodes(
    updates: Array<{ id: string; updates: Partial<FloroNode> }>
  ): Promise<void>;
}
```
