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
// Actual NodeService implementation using Supabase
interface NodeService {
  // CRUD operations
  createNode(input: {
    type: string;
    position: { x: number; y: number };
    data: Record<string, unknown>;
    canvas_id: string;
  }): Promise<FloroNode>;

  updateNode(
    nodeId: string,
    updates: {
      type?: string;
      position?: { x: number; y: number };
      data?: Record<string, unknown>;
    }
  ): Promise<FloroNode>;

  deleteNode(nodeId: string): Promise<void>;
  getNode(nodeId: string): Promise<FloroNode | null>;

  // Canvas-based queries
  getNodesByCanvas(canvasId: string): Promise<FloroNode[]>;
  getNodesBySession(sessionId: string): Promise<FloroNode[]>; // Handles "public" session

  // Spatial queries using JSONB operators
  getNodesInViewport(
    canvasId: string,
    bounds: { minX: number; minY: number; maxX: number; maxY: number }
  ): Promise<FloroNode[]>;

  // Real-time subscriptions using Supabase Realtime
  subscribeToNodes(
    canvasId: string,
    callbacks: {
      onInsert?: (node: FloroNode) => void;
      onUpdate?: (node: FloroNode) => void;
      onDelete?: (nodeId: string) => void;
    }
  ): () => void; // Returns unsubscribe function
}
```

### 5.4 Session Management Implementation

The application uses a hybrid approach for session management to support both public collaboration and future private workspaces:

```typescript
// Session Management Strategy
interface SessionConfig {
  sessionId: string; // User-facing session identifier ("public", UUID, etc.)
  canvasId: string; // Database canvas_id (always UUID)
  isPublic: boolean; // Whether this is a public collaboration session
}

// Public Session Handling
class SessionManager {
  static async resolveCanvasId(sessionId: string): Promise<string> {
    if (sessionId === "public") {
      // For public sessions, generate or reuse a UUID
      // Current implementation: generate new UUID for each upload
      return crypto.randomUUID();
    }

    // For private sessions, use sessionId as canvasId
    return sessionId;
  }

  static async getSessionNodes(sessionId: string): Promise<FloroNode[]> {
    if (sessionId === "public") {
      // Get all nodes for public collaboration
      return NodeService.getNodesByCanvas(""); // Empty filter = all nodes
    }

    // Get nodes for specific canvas
    return NodeService.getNodesByCanvas(sessionId);
  }
}
```

**Current Implementation Notes:**

- Public sessions generate new UUIDs for each file upload
- This creates isolated nodes rather than shared public workspace
- Future Epic will implement proper public session management
- Private sessions will use UUID-based canvas identification
