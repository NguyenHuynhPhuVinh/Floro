# 6.1. State Management Architecture

### 6.1.1 Zustand Store Architecture

The application uses Zustand for client-side state management with a modular store approach.

```typescript
// Canvas Store (Epic 2.2, 2.3)
interface CanvasState {
  // Viewport state
  viewport: {
    x: number;
    y: number;
    scale: number;
    width: number;
    height: number;
  };

  // UI state
  ui: {
    showGrid: boolean;
    showCoordinates: boolean;
    gridSize: number;
    theme: "light" | "dark";
    language: "vi" | "en";
  };

  // Performance tracking
  performance: PerformanceMetrics;

  // Actions
  updateViewport: (viewport: Partial<CanvasState["viewport"]>) => void;
  updateUI: (ui: Partial<CanvasState["ui"]>) => void;
  resetCanvas: () => void;
}

// Nodes Store (Epic 2.2)
interface NodesState {
  // Node data
  nodes: FloroNode[];

  // Selection state
  selection: NodeSelectionState;

  // Operation history for undo/redo
  history: NodeOperation[];
  historyIndex: number;

  // Loading states
  isLoading: boolean;
  error: string | null;

  // Actions
  addNode: (node: FloroNode) => void;
  updateNode: (id: string, updates: Partial<FloroNode>) => void;
  deleteNode: (id: string) => void;
  selectNode: (id: string, multiSelect?: boolean) => void;
  clearSelection: () => void;
  undo: () => void;
  redo: () => void;
}

// Settings Store (Epic 2.3)
interface SettingsState {
  config: SettingsConfig;
  isModalOpen: boolean;

  // Actions
  updateSettings: (updates: Partial<SettingsConfig>) => void;
  resetSettings: () => void;
  openModal: () => void;
  closeModal: () => void;
}
```

### 6.1.2 State Synchronization Patterns

- **Local-First**: UI state changes immediately, then sync to database
- **Optimistic Updates**: Show changes instantly, rollback on error
- **Real-time Sync**: Supabase Realtime for collaborative updates
- **Conflict Resolution**: Last-write-wins with timestamp comparison

### 6.1.3 Command Pattern for Undo/Redo

```typescript
interface Command {
  execute(): Promise<void>;
  undo(): Promise<void>;
  canUndo(): boolean;
  description: string;
}

class MoveNodeCommand implements Command {
  constructor(
    private nodeId: string,
    private oldPosition: { x: number; y: number },
    private newPosition: { x: number; y: number }
  ) {}

  async execute(): Promise<void> {
    // Move node to new position
  }

  async undo(): Promise<void> {
    // Move node back to old position
  }
}
```
