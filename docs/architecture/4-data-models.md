# 4. Data Models

These TypeScript interfaces, located in `packages/shared-types`, define the core data structures.

```typescript
// packages/shared-types/src/index.ts

// The base for all node types, stored in Supabase PostgreSQL
interface BaseNode {
  id: string;
  sessionId: string; // e.g., "public"
  type: "file" | "text" | "link" | "image";
  position: { x: number; y: number };
  size: { width: number; height: number };
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  zIndex: number; // For layering
  isLocked?: boolean; // Prevent accidental moves
  metadata?: Record<string, any>; // JSONB column for extensible metadata
}

export interface FileNode extends BaseNode {
  type: "file";
  fileName: string;
  fileType: string;
  fileURL: string;
  fileSize: number;
  mimeType: string;
  checksum?: string; // For integrity verification
}

export interface TextNode extends BaseNode {
  type: "text";
  content: string;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  backgroundColor?: string;
}

export interface LinkNode extends BaseNode {
  type: "link";
  url: string;
  title?: string;
  description?: string;
  favicon?: string;
  previewImage?: string;
}

export interface ImageNode extends BaseNode {
  type: "image";
  imageURL: string;
  thumbnailURL?: string;
  alt?: string;
  originalWidth?: number;
  originalHeight?: number;
}

export type FloroNode = FileNode | TextNode | LinkNode | ImageNode;

// Real-time cursor data, managed via Supabase Realtime
export interface Cursor {
  id: string; // Anonymous user session ID
  sessionId: string; // Workspace session
  position: { x: number; y: number };
  lastUpdate: string; // ISO timestamp
  color?: string; // User-specific cursor color
  name?: string; // Optional display name
}

// Spatial indexing structure
export interface SpatialBounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

// Performance monitoring
export interface PerformanceMetrics {
  renderTime: number;
  nodeCount: number;
  visibleNodeCount: number;
  fps: number;
  memoryUsage?: number;
}

// Error tracking
export interface ErrorLog {
  id: string;
  timestamp: string; // ISO timestamp
  error: string;
  stack?: string;
  userAgent: string;
  sessionId: string;
  context?: Record<string, any>; // JSONB column
}

// Database schema types for Supabase
export interface Database {
  public: {
    Tables: {
      nodes: {
        Row: FloroNode;
        Insert: Omit<FloroNode, "id" | "createdAt" | "updatedAt">;
        Update: Partial<Omit<FloroNode, "id">>;
      };
      cursors: {
        Row: Cursor;
        Insert: Omit<Cursor, "lastUpdate">;
        Update: Partial<Omit<Cursor, "id">>;
      };
      error_logs: {
        Row: ErrorLog;
        Insert: Omit<ErrorLog, "id" | "timestamp">;
        Update: Partial<Omit<ErrorLog, "id">>;
      };
    };
  };
}
```
