# 5. API Specification (Client-Side Service Layer)

All Supabase interactions from the Next.js app will be managed through a dedicated service layer located in `apps/web/src/services/`.

### 5.1 Core Services

- **`supabase.ts`:** Centralized initialization of Supabase client with TypeScript types.
- **`node.service.ts`:** Manages CRUD operations and real-time subscriptions for `FloroNode` data in **PostgreSQL**.
- **`storage.service.ts`:** Manages file uploads and retrievals from **Supabase Storage**.
- **`realtime.service.ts`:** Manages real-time subscriptions for live collaboration features.

### 5.2 Advanced Services

- **`spatial.service.ts`:** Handles spatial indexing and viewport-based queries using PostGIS extensions.
- **`cache.service.ts`:** Manages client-side caching strategies for nodes and assets.
- **`performance.service.ts`:** Tracks and reports performance metrics.
- **`error.service.ts`:** Centralized error handling and reporting.
- **`security.service.ts`:** Input sanitization and Row Level Security (RLS) policies.

### 5.3 Service Layer Architecture

```typescript
// Example service interface using Supabase
interface NodeService {
  // CRUD operations
  createNode(
    node: Omit<FloroNode, "id" | "createdAt" | "updatedAt">
  ): Promise<FloroNode>;
  updateNode(id: string, updates: Partial<FloroNode>): Promise<void>;
  deleteNode(id: string): Promise<void>;

  // Spatial queries using PostGIS
  getNodesInViewport(bounds: SpatialBounds): Promise<FloroNode[]>;

  // Real-time subscriptions using Supabase Realtime
  subscribeToNodes(
    sessionId: string,
    callback: (nodes: FloroNode[]) => void
  ): RealtimeChannel;

  // Batch operations using PostgreSQL transactions
  batchUpdateNodes(
    updates: Array<{ id: string; updates: Partial<FloroNode> }>
  ): Promise<void>;

  // Advanced PostgreSQL features
  searchNodes(query: string, sessionId: string): Promise<FloroNode[]>;
  getNodeHistory(nodeId: string): Promise<FloroNode[]>;
}
```
