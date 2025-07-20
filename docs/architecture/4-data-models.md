# 4. Data Models

These TypeScript interfaces, located in `packages/shared-types`, define the core data structures.

```typescript
// packages/shared-types/src/index.ts

// The base for all node types, stored in Supabase PostgreSQL table "floro_nodes"
interface BaseNode {
  id: string;
  canvas_id: string; // Canvas/session identifier (UUID for private, generated UUID for "public")
  type: string; // "file" | "text" | "link" | "image"
  position: { x: number; y: number };
  data: Record<string, unknown>; // Node-specific data (fileName, fileURL, etc.)
  metadata: {
    created_at: string; // ISO timestamp
    updated_at: string; // ISO timestamp
    created_by: string; // Anonymous user identifier
    version: number; // Version for optimistic locking
  };
}

export interface FileNode extends BaseNode {
  type: "file";
  data: {
    fileName: string;
    fileType: string;
    fileURL: string;
    fileSize: number;
    mimeType: string;
    checksum?: string; // For integrity verification
  };
}

export interface TextNode extends BaseNode {
  type: "text";
  data: {
    content: string;
    fontSize?: number;
    fontFamily?: string;
    color?: string;
    backgroundColor?: string;
  };
}

export interface LinkNode extends BaseNode {
  type: "link";
  data: {
    url: string;
    title?: string;
    description?: string;
    favicon?: string;
    previewImage?: string;
  };
}

export interface ImageNode extends BaseNode {
  type: "image";
  data: {
    imageURL: string;
    thumbnailURL?: string;
    alt?: string;
    originalWidth?: number;
    originalHeight?: number;
  };
}

export type FloroNode = FileNode | TextNode | LinkNode | ImageNode;

// Real-time cursor data, managed via Supabase Realtime
export interface Cursor {
  id: string; // Anonymous user session ID
  canvas_id: string; // Canvas/workspace identifier
  position: { x: number; y: number };
  last_update: string; // ISO timestamp (snake_case for database consistency)
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

// Node Selection and Management (Epic 2.2)
export interface NodeSelectionState {
  selectedNodeIds: Set<string>;
  lastSelectedId?: string;
  selectionBounds?: SpatialBounds;
  isMultiSelect: boolean;
}

export interface NodeOperation {
  type: "create" | "update" | "delete" | "move";
  nodeId: string;
  timestamp: string;
  data?: Partial<FloroNode>;
  previousData?: Partial<FloroNode>;
}

// UI State Management (Epic 2.3, 2.4)
export interface UIState {
  theme: "light" | "dark" | "auto";
  language: "vi" | "en";
  showCoordinates: boolean;
  showGrid: boolean;
  gridSize: number;
  canvasBackground: "none" | "grid" | "dots";
}

export interface SettingsConfig {
  ui: UIState;
  canvas: {
    defaultZoom: number;
    minZoom: number;
    maxZoom: number;
    panSensitivity: number;
    zoomSensitivity: number;
  };
  collaboration: {
    showCursors: boolean;
    cursorUpdateInterval: number;
    enableRealtime: boolean;
  };
}

// Clipboard Integration (Epic 2.4)
export interface ClipboardContent {
  type: "text" | "url" | "image" | "file";
  data: string | File | Blob;
  mimeType?: string;
  metadata?: Record<string, any>;
}

export interface ClipboardOperation {
  content: ClipboardContent;
  position: { x: number; y: number };
  timestamp: string;
}

// Basic Interaction States
export interface NodeInteractionState {
  isHovered: boolean;
  isDragging: boolean;
  isSelected: boolean;
  isLoading: boolean;
  dragOffset?: { x: number; y: number };
}

export interface BasicAnimationConfig {
  duration: number;
  easing: "linear" | "ease-in" | "ease-out" | "ease-in-out";
}

// Database schema types for Supabase (actual table names and structure)
export interface Database {
  public: {
    Tables: {
      floro_nodes: {
        Row: FloroNode;
        Insert: Omit<FloroNode, "id" | "metadata">;
        Update: Partial<Omit<FloroNode, "id">>;
      };
      floro_cursors: {
        Row: Cursor;
        Insert: Omit<Cursor, "last_update">;
        Update: Partial<Omit<Cursor, "id">>;
      };
      floro_error_logs: {
        Row: ErrorLog;
        Insert: Omit<ErrorLog, "id" | "timestamp">;
        Update: Partial<Omit<ErrorLog, "id">>;
      };
    };
  };
}
```
