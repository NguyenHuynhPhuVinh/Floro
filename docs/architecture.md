# Floro Fullstack Architecture Document

## 1. Introduction

### 1.1 Introduction

This document outlines the complete fullstack architecture for **Floro**, including the Next.js frontend, Supabase backend, and the integration between them. It serves as the single source of truth for AI-driven development, ensuring consistency across the entire technology stack. This unified approach is designed to streamline development for modern fullstack applications where frontend and backend concerns are increasingly intertwined.

### 1.2 Starter Template or Existing Project

- **N/A - Greenfield project:** This project will be built from scratch, following the best practices outlined in this document.

### 1.3 Change Log

| Date             | Version | Description                                                                                                                           | Author              |
| :--------------- | :------ | :------------------------------------------------------------------------------------------------------------------------------------ | :------------------ |
| {{current_date}} | 1.0     | Initial Architecture Draft                                                                                                            | Winston (Architect) |
| {{current_date}} | 1.1     | Epic 2 Updates: Core Node Management, State Management, Application Shell                                                             | Winston (Architect) |
| {{current_date}} | 1.2     | Architecture-Implementation Alignment: Updated data models, database schema, and service interfaces to match Story 2.1 implementation | Winston (Architect) |
| {{current_date}} | 1.3     | PRD Alignment Update: Removed advanced UI components architecture following Story 2.3 removal                                         | Winston (Architect) |
| {{current_date}} | 1.4     | Story 2.3 Integration: Updated theme and localization architecture with next-themes and react-i18next implementation                  | Winston (Architect) |
| {{current_date}} | 1.5     | Story 2.4 Integration: Added shadcn/ui component library architecture and updated UI system design                                    | Winston (Architect) |

## 2. High-Level Architecture

### 2.1 Technical Summary

The Floro system will be built using a **modern Jamstack architecture combined with a serverless backend**, leveraging the strengths of Next.js for the frontend and the Supabase ecosystem for the backend. Users will interact with a highly performant Next.js application hosted on Vercel. All workspace state data (node positions, metadata) and real-time updates will be managed through **Supabase Database (PostgreSQL)**. Large file assets, such as images and documents, will be stored in **Supabase Storage**. This architecture is designed to optimize page load speeds, provide seamless scalability, and minimize operational costs while maintaining open-source principles, directly aligning with the goals set forth in the PRD.

### 2.2 Platform and Infrastructure Choice

- **Platform:** Vercel + Supabase.
- **Key Services:**
  - **Vercel:** Primary hosting for the Next.js application, providing CI/CD, and a global Edge Network.
  - **Supabase:**
    - **Supabase Database:** PostgreSQL database for storing node metadata and managing application state with ACID compliance.
    - **Supabase Realtime:** WebSocket-based real-time subscriptions for live collaboration features like cursor positions and node updates.
    - **Supabase Storage:** Handles storage and delivery of user-uploaded file objects (images, documents, etc.) with built-in CDN.
    - **Supabase Auth:** Authentication system for future user management features.
- **Deployment Regions:** Infrastructure will be configured to serve users globally with low latency, leveraging the distributed networks of Vercel and Supabase's global infrastructure.

### 2.3 Repository Structure

- **Structure:** Simplified Monorepo.
- **Monorepo Tool:** `pnpm workspaces` will be used for dependency and script management.
- **Package Organization:**
  - `apps/web`: The main Next.js application.
  - `packages/shared-types`: TypeScript type definitions shared across the application and future extensions.
  - `packages/eslint-config`: Shared ESLint configuration for consistent code style.
- **Rationale:** While currently single-app, monorepo structure provides future-proofing for potential Supabase Edge Functions, mobile apps, or admin dashboards while maintaining minimal overhead.

### 2.4 High-Level Architecture Diagram

```mermaid
graph TD
    subgraph "User's Browser"
        A[Next.js Frontend on Vercel]
    end

    subgraph "Supabase Backend"
        B[PostgreSQL Database<br><i>(Node Data & Metadata)</i>]
        C[Supabase Storage<br><i>(File Content)</i>]
        F[Realtime Subscriptions<br><i>(Live Collaboration)</i>]
        D[Supabase Edge Functions<br><i>(Optional Server Logic)</i>]
        G[Supabase Auth<br><i>(Future User Management)</i>]
    end

    E((User)) --> A
    A -- SQL Queries & Real-time Subscriptions --> B
    A -- File Upload/Download --> C
    A -- WebSocket Connections --> F
    A -- Server-side Logic --> D
    A -- Authentication (Future) --> G
```

### 2.5 Architectural Patterns

- **Component-Based UI:** The frontend will be built using reusable React components with clear separation of concerns.
- **Repository Pattern (Client-Side):** An abstraction layer (`services`) will be created to handle all communication with Supabase, decoupling UI components from the data source.
- **Observer Pattern (Real-time):** The application will utilize Supabase's real-time subscriptions to reactively update the UI based on data changes from the PostgreSQL database.
- **Command Pattern:** For undo/redo functionality and action tracking.
- **Strategy Pattern:** For different node rendering strategies based on zoom level and viewport.
- **Facade Pattern:** Simplified interfaces for complex Supabase operations.

### 2.6 Performance Architecture

- **Viewport Virtualization:** Only render nodes within the current viewport plus a buffer zone.
- **Spatial Indexing:** Use quadtree or similar structure for efficient spatial queries.
- **Level of Detail (LOD):** Render simplified versions of nodes when zoomed out.
- **Debounced Updates:** Batch and debounce high-frequency updates (cursor positions, node movements).
- **Lazy Loading:** Load node content (images, files) only when needed.
- **Caching Strategy:** Multi-layer caching (browser cache, CDN, Supabase cache).

## 3. Tech Stack

This table lists the technologies chosen for the Floro project. Development will adhere to the latest stable versions of these technologies.

| Category                 | Technology                     | Purpose                             | Rationale                                                                |
| :----------------------- | :----------------------------- | :---------------------------------- | :----------------------------------------------------------------------- |
| **Language**             | TypeScript                     | Ngôn ngữ phát triển chính           | An toàn kiểu dữ liệu, dễ dàng chia sẻ types.                             |
| **Frontend Framework**   | Next.js 14+                    | Xây dựng giao diện người dùng       | Framework React mạnh mẽ, App Router, tích hợp Vercel.                    |
| **Backend Service**      | Supabase                       | Backend-as-a-Service                | Open source, PostgreSQL, real-time, tích hợp đầy đủ.                     |
| **Database**             | Supabase Database (PostgreSQL) | Lưu trữ metadata và trạng thái node | SQL database mạnh mẽ, ACID compliance, complex queries.                  |
| **Real-time Engine**     | Supabase Realtime              | Đồng bộ dữ liệu real-time           | WebSocket-based, low latency, built-in subscriptions.                    |
| **File Storage**         | Supabase Storage               | Lưu trữ file                        | S3-compatible, CDN tích hợp, policy-based access control.                |
| **Authentication**       | Supabase Auth                  | Xác thực người dùng (future)        | Multiple providers, JWT tokens, row-level security.                      |
| **UI Library**           | Tailwind CSS v4                | Styling framework                   | CSS-based config, @theme directive, OKLCH colors, class-based dark mode. |
| **UI Components**        | shadcn/ui                      | Component library                   | Modern, accessible, customizable components built on Radix UI.           |
| **Component Base**       | Radix UI                       | Headless UI primitives              | Accessible, unstyled components with full keyboard navigation.           |
| **State Management**     | Zustand                        | Quản lý trạng thái client           | Nhẹ, đơn giản, hiệu quả cho nhu cầu dự án.                               |
| **Theme Management**     | next-themes                    | Quản lý theme và dark mode          | Professional theme switching, SSR-safe, Tailwind integration.            |
| **Internationalization** | react-i18next                  | Hệ thống đa ngôn ngữ                | Industry-standard i18n, JSON-based translations, namespace support.      |
| **2D Canvas Library**    | HTML5 Canvas + React           | Xử lý không gian 2D                 | Canvas API native, tích hợp tốt với React ecosystem.                     |
| **Spatial Indexing**     | Custom Quadtree                | Tối ưu truy vấn không gian          | Hiệu suất cao cho viewport queries và collision detection.               |
| **Error Handling**       | React Error Boundary           | Xử lý lỗi graceful                  | Ngăn crash toàn bộ app, user experience tốt hơn.                         |
| **Performance**          | React.memo, useMemo            | Tối ưu re-rendering                 | Giảm unnecessary renders, cải thiện performance.                         |
| **Testing**              | Jest & React Testing Library   | Unit & Integration tests            | Bộ công cụ tiêu chuẩn trong hệ sinh thái React.                          |
| **E2E Testing**          | Playwright                     | End-to-end testing                  | Modern, reliable, cross-browser testing.                                 |
| **Monitoring**           | Vercel Analytics               | Performance monitoring              | Built-in analytics, Core Web Vitals tracking.                            |
| **Deployment**           | Vercel                         | Nền tảng hosting                    | Tích hợp CI/CD tự động, mạng lưới toàn cầu.                              |

## 3.1. UI Components Architecture

### 3.1.1 shadcn/ui Component System

The application uses shadcn/ui as the primary component library, providing a modern, accessible, and customizable foundation built on Radix UI primitives.

| Component Type          | Technology                         | Purpose                      | Implementation            |
| :---------------------- | :--------------------------------- | :--------------------------- | :------------------------ |
| **Canvas Components**   | HTML5 Canvas + React               | Node rendering, interactions | Native Canvas API         |
| **UI Shell Components** | shadcn/ui + Tailwind CSS           | Application layout, modals   | Radix UI + custom styling |
| **Form Components**     | shadcn/ui (Button, Input, Select)  | User interactions            | Accessible, keyboard nav  |
| **Layout Components**   | shadcn/ui (Dialog, Sheet, Popover) | Overlays and containers      | Portal-based, focus mgmt  |
| **Icon System**         | Lucide React                       | Professional icons           | SVG-based, tree-shakeable |
| **Animation System**    | CSS transitions + Framer Motion    | Smooth UX                    | Hardware-accelerated      |

### 3.1.2 shadcn/ui Integration Architecture

**Component Installation Strategy for Tailwind v4:**

```bash
# Initialize shadcn/ui with Tailwind v4 support
npx shadcn@latest init --tailwind-v4

# Core components for Story 2.4
npx shadcn@latest add button
npx shadcn@latest add dialog
npx shadcn@latest add select
npx shadcn@latest add switch
npx shadcn@latest add tabs
npx shadcn@latest add tooltip
npx shadcn@latest add dropdown-menu
npx shadcn@latest add separator
```

**Tailwind CSS v4 Configuration for shadcn/ui:**

```css
/* app/globals.css - Tailwind v4 with @theme directive */
@import "tailwindcss";

@theme {
  --color-border: oklch(0.2 0 0);
  --color-input: oklch(0.2 0 0);
  --color-ring: oklch(0.2 0 0);
  --color-background: oklch(1 0 0);
  --color-foreground: oklch(0.09 0 0);
  --color-primary: oklch(0.09 0 0);
  --color-primary-foreground: oklch(0.98 0 0);
  --color-secondary: oklch(0.96 0 0);
  --color-secondary-foreground: oklch(0.09 0 0);
  /* ... other shadcn/ui color variables in OKLCH */
}

/* Dark mode using class-based approach */
.dark {
  --color-border: oklch(0.27 0 0);
  --color-input: oklch(0.27 0 0);
  --color-ring: oklch(0.83 0 0);
  --color-background: oklch(0.09 0 0);
  --color-foreground: oklch(0.98 0 0);
  --color-primary: oklch(0.98 0 0);
  --color-primary-foreground: oklch(0.09 0 0);
  --color-secondary: oklch(0.15 0 0);
  --color-secondary-foreground: oklch(0.98 0 0);
  /* ... other dark mode colors in OKLCH */
}
```

**No tailwind.config.js needed** - Tailwind v4 uses CSS-based configuration with the `@theme` directive.

### 3.1.3 Component Architecture Patterns

**shadcn/ui Component Patterns:**

```typescript
// shadcn/ui Button Component Usage
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Settings Button with shadcn/ui
const SettingsButton: React.FC = () => {
  return (
    <Button variant="outline" size="icon">
      <Settings className="h-4 w-4" />
    </Button>
  );
};

// Settings Modal with shadcn/ui Dialog
const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("settings.title")}</DialogTitle>
        </DialogHeader>
        {/* Settings content */}
      </DialogContent>
    </Dialog>
  );
};
```

**Canvas Component Pattern (unchanged):**

```typescript
// Canvas Component Pattern
interface CanvasComponentProps {
  x: number;
  y: number;
  scale: number;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  context: CanvasRenderingContext2D;
}
```

**Tailwind v4 + shadcn/ui Integration:**

```css
/* Tailwind v4 @theme directive replaces traditional CSS variables */
@theme {
  /* Light mode colors in OKLCH format */
  --color-background: oklch(1 0 0);
  --color-foreground: oklch(0.09 0 0);
  --color-primary: oklch(0.09 0 0);
  --color-primary-foreground: oklch(0.98 0 0);
  /* ... other colors */
}

/* Dark mode using class-based approach */
.dark {
  --color-background: oklch(0.09 0 0);
  --color-foreground: oklch(0.98 0 0);
  --color-primary: oklch(0.98 0 0);
  --color-primary-foreground: oklch(0.09 0 0);
  /* ... other dark mode colors */
}

/* Usage in components - same as before */
.bg-background {
  background-color: var(--color-background);
}
.text-foreground {
  color: var(--color-foreground);
}
```

### 3.1.4 Icon System Architecture

- **File Type Icons**: Lucide icons with category-based mapping
- **Color Coding**: Semantic colors for different file categories
- **Canvas Rendering**: Icons rendered directly on canvas for performance
- **Caching**: Optimized icon caching and reuse strategies
- **shadcn/ui Integration**: Consistent icon sizing and styling with shadcn/ui components

### 3.1.5 Theme and Localization System

**Theme Management với next-themes + Tailwind v4:**

```typescript
// Theme Provider Configuration for Tailwind v4 class-based theming
interface ThemeProviderProps {
  attribute: "class"; // Always use class for Tailwind v4
  defaultTheme?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}

// Theme Hook Usage with class-based approach
const { theme, setTheme, systemTheme } = useTheme();

// Tailwind v4 Theme Classes (class-based, no CSS variables needed)
const themeClasses = {
  light: "bg-background text-foreground",
  dark: "bg-background text-foreground", // .dark class handles the styling
  system: "bg-background text-foreground",
};

// shadcn/ui Theme Toggle Component for Tailwind v4
const ThemeToggle: React.FC = () => {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          {t("theme.light")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          {t("theme.dark")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          {t("theme.system")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
```

**Internationalization với react-i18next:**

```typescript
// i18n Configuration
interface I18nConfig {
  lng: "vi" | "en";
  fallbackLng: "vi";
  defaultNS: "common";
  resources: {
    vi: {
      common: Record<string, string>;
      settings: Record<string, string>;
      canvas: Record<string, string>;
    };
    en: {
      common: Record<string, string>;
      settings: Record<string, string>;
      canvas: Record<string, string>;
    };
  };
}

// Translation Hook Usage
const { t, i18n } = useTranslation("settings");
const changeLanguage = (lng: string) => i18n.changeLanguage(lng);
```

**JSON-based Translation Structure:**

```typescript
// locales/vi/settings.json
{
  "title": "Cài đặt",
  "display": "Hiển thị",
  "canvas": "Canvas",
  "collaboration": "Cộng tác",
  "theme": {
    "label": "Giao diện",
    "light": "Sáng",
    "dark": "Tối",
    "system": "Hệ thống"
  },
  "language": {
    "label": "Ngôn ngữ",
    "vietnamese": "Tiếng Việt",
    "english": "Tiếng Anh"
  }
}
```

## 4. Data Models

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

// UI State Management (Epic 2.3, 2.4) - Updated for next-themes integration
export interface UIState {
  // Theme is now managed by next-themes, not in settings store
  language: "vi" | "en";
  showCoordinates: boolean;
  showGrid: boolean;
  gridSize: number;
  canvasBackground: "none" | "grid" | "dots";
  coordinatePosition: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  coordinateFormat: "decimal" | "integer";
}

export interface SettingsConfig {
  ui: UIState;
  canvas: {
    defaultZoom: number;
    minZoom: number;
    maxZoom: number;
    panSensitivity: number;
    zoomSensitivity: number;
    backgroundType: "none" | "grid" | "dots";
    backgroundSize: number;
    backgroundOpacity: number;
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

## 5. API Specification (Client-Side Service Layer)

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

## 6. Unified Project Structure

The project will use a monorepo structure managed by `pnpm workspaces`.

```plaintext
floro/
├── apps/
│   └── web/                            # Main Next.js application
│       ├── src/
│       │   ├── app/                    # Next.js App Router
│       │   ├── components/             # React components
│       │   │   ├── ui/                 # shadcn/ui components (auto-generated)
│       │   │   │   ├── button.tsx      # shadcn/ui Button component
│       │   │   │   ├── dialog.tsx      # shadcn/ui Dialog component
│       │   │   │   ├── select.tsx      # shadcn/ui Select component
│       │   │   │   ├── switch.tsx      # shadcn/ui Switch component
│       │   │   │   ├── tabs.tsx        # shadcn/ui Tabs component
│       │   │   │   ├── tooltip.tsx     # shadcn/ui Tooltip component
│       │   │   │   ├── dropdown-menu.tsx # shadcn/ui DropdownMenu component
│       │   │   │   └── separator.tsx   # shadcn/ui Separator component
│       │   │   ├── canvas/             # Canvas-specific components
│       │   │   │   ├── CanvasContainer.tsx
│       │   │   │   ├── Canvas2D.tsx
│       │   │   │   ├── NodesRenderer.tsx
│       │   │   │   ├── CanvasDragDropHandler.tsx
│       │   │   │   └── CanvasBackground.tsx
│       │   │   ├── nodes/              # Node type components
│       │   │   │   ├── FileNode.tsx
│       │   │   │   ├── FileNodeIcon.tsx
│       │   │   │   ├── TextNode.tsx
│       │   │   │   ├── LinkNode.tsx
│       │   │   │   ├── ImageNode.tsx
│       │   │   │   └── FileUploadProgress.tsx
│       │   │   ├── layout/             # Application shell components
│       │   │   │   ├── AppLayout.tsx
│       │   │   │   ├── AppHeader.tsx
│       │   │   │   ├── SettingsModal.tsx
│       │   │   │   ├── SettingsButton.tsx
│       │   │   │   ├── CoordinateDisplay.tsx
│       │   │   │   ├── ThemeToggle.tsx
│       │   │   │   └── settings/
│       │   │   │       ├── DisplaySettings.tsx
│       │   │   │       ├── CanvasSettings.tsx
│       │   │   │       └── CollaborationSettings.tsx
│       │   │   ├── providers/          # Context providers
│       │   │   │   ├── ThemeProvider.tsx
│       │   │   │   ├── I18nProvider.tsx
│       │   │   │   └── ClientProviders.tsx
│       │   │   └── common/             # Shared components
│       │   ├── services/               # Supabase service layer
│       │   │   ├── core/               # Core services (supabase, node, storage)
│       │   │   ├── advanced/           # Advanced services (spatial, cache, performance)
│       │   │   └── utils/              # Service utilities
│       │   ├── hooks/                  # Custom React hooks
│       │   │   ├── canvas/             # Canvas-related hooks
│       │   │   │   ├── useCanvasPan.ts
│       │   │   │   ├── useCanvasZoom.ts
│       │   │   │   ├── useCanvasViewport.ts
│       │   │   │   └── useMousePosition.ts
│       │   │   ├── nodes/              # Node management hooks
│       │   │   │   ├── useNodes.ts
│       │   │   │   ├── useFileUpload.ts
│       │   │   │   ├── useFileDownload.ts
│       │   │   │   ├── useNodeDrag.ts
│       │   │   │   ├── useNodeSelection.ts
│       │   │   │   └── useClipboard.ts
│       │   │   ├── ui/                 # UI-related hooks
│       │   │   │   ├── useSettings.ts
│       │   │   │   └── useMousePosition.ts
│       │   │   └── realtime/           # Real-time data hooks
│       │   ├── store/                  # Zustand stores
│       │   │   ├── canvas.store.ts     # Canvas state (zoom, pan, viewport, UI)
│       │   │   ├── nodes.store.ts      # Node management state (selection, history)
│       │   │   ├── settings.store.ts   # Application settings state
│       │   │   └── realtime.store.ts   # Real-time collaboration state
│       │   ├── lib/                    # Utility libraries
│       │   │   ├── spatial/            # Quadtree and spatial indexing
│       │   │   ├── performance/        # Performance monitoring
│       │   │   ├── security/           # Input sanitization, validation
│       │   │   └── i18n.ts             # i18next configuration
│       │   ├── locales/                # Translation files
│       │   │   ├── vi/                 # Vietnamese translations
│       │   │   │   ├── common.json
│       │   │   │   ├── settings.json
│       │   │   │   └── canvas.json
│       │   │   └── en/                 # English translations
│       │   │       ├── common.json
│       │   │       ├── settings.json
│       │   │       └── canvas.json
│       │   └── types/                  # App-specific types
│       ├── package.json                # Web app dependencies
│       ├── next.config.js              # Next.js configuration
│       ├── tailwind.config.js          # Tailwind configuration
│       └── tsconfig.json               # TypeScript configuration
├── packages/
│   ├── shared-types/                   # Shared TypeScript types
│   │   ├── src/
│   │   │   └── index.ts                # Core type definitions
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── eslint-config/                  # Shared ESLint configuration
│       ├── index.js                    # ESLint rules
│       └── package.json
├── docs/                               # Project documentation
│   ├── architecture.md
│   └── prd.md
├── tests/                              # E2E tests (Playwright)
├── package.json                        # Root package.json
├── pnpm-workspace.yaml                 # Workspace configuration
├── pnpm-lock.yaml                      # Lock file
├── .gitignore
├── README.md
└── LICENSE
```

## 6.1. State Management Architecture

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

  // UI state (theme now managed by next-themes)
  ui: {
    showGrid: boolean;
    showCoordinates: boolean;
    gridSize: number;
    language: "vi" | "en";
    coordinatePosition:
      | "top-left"
      | "top-right"
      | "bottom-left"
      | "bottom-right";
    coordinateFormat: "decimal" | "integer";
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

// Settings Store (Epic 2.3) - Updated for next-themes integration
interface SettingsState {
  config: SettingsConfig;
  isModalOpen: boolean;

  // Actions
  updateSettings: (updates: Partial<SettingsConfig>) => void;
  resetSettings: () => void;
  openModal: () => void;
  closeModal: () => void;

  // Note: Theme management is now handled by next-themes provider
  // Language management is handled by react-i18next
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

## 6.2. Application Shell Architecture

### 6.2.1 Layout System (Epic 2.3)

The application uses a layered layout approach with clear separation between UI shell and canvas content.

```typescript
// Application Layout Structure
interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => (
  <div className="h-screen w-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
    {/* Header with Logo and Settings */}
    <AppHeader />

    {/* Main Canvas Area */}
    <main className="flex-1 relative overflow-hidden">{children}</main>

    {/* Floating UI Elements */}
    <CoordinateDisplay />
    <SettingsModal />
  </div>
);
```

### 6.2.2 Header Component Architecture

```typescript
interface AppHeaderProps {
  className?: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({ className }) => {
  const { t } = useTranslation("common");

  return (
    <header
      className={`bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 ${className}`}
    >
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left: Navigation or breadcrumbs (future) */}
        <div className="flex-1" />

        {/* Center: Logo */}
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t("appTitle", "Floro")}
          </h1>
        </div>

        {/* Right: Settings and actions */}
        <div className="flex-1 flex justify-end space-x-2">
          <ThemeToggle />
          <SettingsButton />
        </div>
      </div>
    </header>
  );
};
```

### 6.2.3 Settings System Architecture

```typescript
// Settings Modal Component
interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Settings Categories
interface SettingsCategory {
  id: string;
  title: string;
  icon: React.ComponentType;
  component: React.ComponentType<SettingsCategoryProps>;
}

// Settings categories with i18n support
const useSettingsCategories = () => {
  const { t } = useTranslation("settings");

  return [
    {
      id: "display",
      title: t("display"),
      icon: Monitor,
      component: DisplaySettings,
    },
    {
      id: "canvas",
      title: t("canvas"),
      icon: Grid,
      component: CanvasSettings,
    },
    {
      id: "collaboration",
      title: t("collaboration"),
      icon: Users,
      component: CollaborationSettings,
    },
  ];
};
```

### 6.2.4 Canvas Background System

```typescript
// Canvas Background Types
type CanvasBackgroundType = "none" | "grid" | "dots" | "lines";

interface CanvasBackgroundProps {
  type: CanvasBackgroundType;
  size: number;
  color: string;
  opacity: number;
  viewport: CanvasViewport;
}

// Background Rendering Strategies
const backgroundRenderers = {
  grid: (props: CanvasBackgroundProps) => <GridBackground {...props} />,
  dots: (props: CanvasBackgroundProps) => <DotsBackground {...props} />,
  lines: (props: CanvasBackgroundProps) => <LinesBackground {...props} />,
  none: () => null,
};
```

### 6.2.5 Coordinate Display System

```typescript
interface CoordinateDisplayProps {
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  showCanvasCoords: boolean;
  showMouseCoords: boolean;
  format: "decimal" | "integer";
}

const CoordinateDisplay: React.FC<CoordinateDisplayProps> = ({
  position,
  showCanvasCoords,
  showMouseCoords,
  format,
}) => {
  const { viewport } = useCanvasStore();
  const mousePosition = useMousePosition();
  const { t } = useTranslation("canvas");

  return (
    <div
      className={`fixed ${positionClasses[position]} bg-black/75 dark:bg-gray-800/90 text-white px-2 py-1 rounded text-xs font-mono`}
    >
      {showCanvasCoords && (
        <div>
          {t("coordinates.canvas")}: {formatCoordinate(viewport.x, format)},{" "}
          {formatCoordinate(viewport.y, format)}
        </div>
      )}
      {showMouseCoords && (
        <div>
          {t("coordinates.mouse")}: {formatCoordinate(mousePosition.x, format)},{" "}
          {formatCoordinate(mousePosition.y, format)}
        </div>
      )}
    </div>
  );
};
```

### 6.2.6 Provider Architecture

**Theme Provider Setup for Tailwind v4:**

```typescript
// components/providers/ThemeProvider.tsx
import { ThemeProvider as NextThemesProvider } from "next-themes";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => (
  <NextThemesProvider
    attribute="class" // Required for Tailwind v4 class-based theming
    defaultTheme="system"
    enableSystem
    disableTransitionOnChange={false}
  >
    {children}
  </NextThemesProvider>
);
```

**I18n Provider Setup:**

```typescript
// components/providers/I18nProvider.tsx
import { I18nextProvider } from "react-i18next";
import i18n from "@/lib/i18n";

interface I18nProviderProps {
  children: React.ReactNode;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => (
  <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
);
```

**Client Providers Wrapper:**

```typescript
// components/providers/ClientProviders.tsx
"use client";

interface ClientProvidersProps {
  children: React.ReactNode;
}

export const ClientProviders: React.FC<ClientProvidersProps> = ({
  children,
}) => (
  <ThemeProvider>
    <I18nProvider>{children}</I18nProvider>
  </ThemeProvider>
);
```

**Theme Toggle Component:**

```typescript
// components/layout/ThemeToggle.tsx
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation("settings");

  return (
    <select
      value={theme}
      onChange={(e) => setTheme(e.target.value)}
      className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-2 py-1"
    >
      <option value="light">{t("theme.light")}</option>
      <option value="dark">{t("theme.dark")}</option>
      <option value="system">{t("theme.system")}</option>
    </select>
  );
};
```

## 7. Development Workflow

### 7.1 Initial Setup

```bash
# Clone repository
git clone <repository-url>
cd floro

# Install dependencies (root and all workspaces)
pnpm install

# Configure environment
cp apps/web/.env.example apps/web/.env.local
# Edit .env.local with Supabase credentials

# Setup i18n and theme providers
# Ensure next-themes and react-i18next are properly configured
```

### 7.2 Development Commands

```bash
# Start development server
pnpm dev                    # Runs apps/web in dev mode

# Code quality
pnpm lint                   # Lint all packages
pnpm lint:fix              # Fix linting issues
pnpm type-check            # TypeScript type checking

# Testing
pnpm test                   # Run unit tests
pnpm test:watch            # Run tests in watch mode
pnpm test:e2e              # Run E2E tests

# Build
pnpm build                 # Build for production
pnpm build:packages        # Build shared packages only
```

### 7.3 Workspace Management

```bash
# Add dependency to specific workspace
pnpm add <package> --filter web
pnpm add <package> --filter shared-types

# Run commands in specific workspace
pnpm --filter web dev
pnpm --filter shared-types build
```

## 8. Deployment Architecture

- **Frontend:** The Next.js app is automatically deployed to Vercel upon pushes to the `main` branch.
- **Backend:** Supabase database migrations and Row Level Security policies are deployed via the Supabase CLI.
- **Environments:**
  - **Development:** Local machine.
  - **Preview:** Vercel automatically creates a preview deployment for each Pull Request.
  - **Production:** Live environment on the main domain.

## 9. Security and Performance

### 9.1 Security Architecture

- **Supabase Row Level Security (RLS):**
  - Enforce data validation and access control at the database level
  - Rate limiting policies for database operations
  - File type and size restrictions via storage policies
- **Client-Side Security:**
  - Input sanitization for all user-generated content to prevent XSS attacks
  - Content Security Policy (CSP) headers
  - File upload validation (type, size, content scanning)
- **Rate Limiting Strategy:**
  - IP-based rate limiting: 10 nodes/minute, 100 nodes/hour
  - Session-based limits for high-frequency operations
  - Exponential backoff for repeated violations
- **Data Protection:**
  - No personal data collection (anonymous sessions)
  - Automatic cleanup of inactive sessions
  - Content moderation hooks for inappropriate content

### 9.2 Performance Optimization

- **Canvas Performance:**
  - **Viewport Virtualization:** Only render nodes within viewport + buffer zone
  - **Level of Detail (LOD):** Simplified rendering when zoomed out
  - **Spatial Partitioning:** Quadtree-based spatial indexing for efficient queries
  - **Batch Rendering:** Group similar operations to reduce draw calls
- **Data Loading:**
  - **Lazy Loading:** Defer loading of images and files until needed
  - **Progressive Loading:** Load thumbnails first, full resolution on demand
  - **Caching Strategy:** Multi-layer caching (browser, CDN, Supabase)
- **Real-time Optimization:**
  - **Debounced Updates:** Batch high-frequency updates (cursor, drag)
  - **Connection Management:** Automatic reconnection with exponential backoff
  - **Selective Subscriptions:** Only subscribe to data in current viewport
- **Memory Management:**
  - **Object Pooling:** Reuse canvas objects to reduce GC pressure
  - **Cleanup Strategies:** Automatic cleanup of off-screen resources
  - **Memory Monitoring:** Track and alert on memory usage patterns
- **Background Rendering Optimization (Story 2.3):**
  - **SVG Pattern Optimization:** DotsBackground uses SVG patterns instead of DOM manipulation
  - **Hardware Acceleration:** CSS transforms and transitions for smooth theme switching
  - **Reduced Paint Operations:** Optimized background rendering to eliminate lag
  - **Theme Transition Performance:** next-themes provides CSS-only theme switching

## 10. Testing Strategy

The project will follow the Testing Pyramid model, with a strong emphasis on automated tests and performance validation.

### 10.1 Unit Testing (Jest)

- **Services Layer:** Mock Supabase services, test business logic
- **Utility Functions:** Spatial indexing, performance calculations, validation
- **Custom Hooks:** Canvas interactions, state management, real-time subscriptions
- **Components:** Isolated component testing with mocked dependencies

### 10.2 Integration Testing (React Testing Library)

- **Canvas Interactions:** Pan, zoom, node creation/manipulation
- **Real-time Features:** Multi-user collaboration scenarios
- **File Operations:** Upload, download, drag-and-drop workflows
- **Error Handling:** Network failures, invalid inputs, edge cases

### 10.3 End-to-End Testing (Playwright)

- **Critical User Flows:** Complete workflows from entry to collaboration
- **Cross-browser Testing:** Chrome, Firefox, Safari compatibility
- **Performance Testing:** Load times, FPS measurements, memory usage
- **Mobile Testing:** Touch interactions, responsive behavior

### 10.4 Performance Testing

- **Load Testing:** Simulate multiple concurrent users
- **Stress Testing:** Large numbers of nodes, heavy file uploads
- **Memory Profiling:** Memory leaks, garbage collection patterns
- **Real-time Latency:** Measure and validate collaboration delays

### 10.5 Security Testing

- **Input Validation:** XSS prevention, file upload security
- **Rate Limiting:** Verify abuse prevention mechanisms
- **Supabase RLS Policies:** Test Row Level Security policy enforcement

## 11. Coding Standards

### 11.1 TypeScript Standards

- **Strict Mode:** `strict` mode is mandatory. The `any` type is forbidden.
- **Type Safety:** All functions must have explicit return types
- **Interface Design:** Prefer interfaces over types for object shapes
- **Generic Usage:** Use generics for reusable components and utilities

### 11.2 Code Style and Formatting

- **Prettier:** Automatic code formatting with consistent configuration
- **ESLint:** Strict linting rules with custom rules for performance
- **Pre-commit Hooks:** Enforced via `husky` and `lint-staged`
- **Import Organization:** Absolute imports, grouped by type (external, internal, relative)

### 11.3 Naming Conventions

- **Components:** `PascalCase` (e.g., `CanvasNode`, `FileUploader`)
- **Hooks:** `camelCase` with `use` prefix (e.g., `useCanvasZoom`, `useNodeDrag`)
- **Services:** `camelCase` with `.service.ts` suffix
- **Constants:** `SCREAMING_SNAKE_CASE` for module-level constants
- **Files:** `kebab-case` for file names, `PascalCase` for component files

### 11.4 Architecture Principles

- **Separation of Concerns:** UI components are for presentation only
- **Single Responsibility:** Each module/function has one clear purpose
- **Dependency Injection:** Services injected via hooks, not imported directly
- **Error Boundaries:** Every major feature wrapped in error boundaries
- **Performance First:** Consider performance implications in every decision

### 11.5 Documentation Standards

- **JSDoc:** All public functions and complex logic must be documented
- **README:** Each package must have comprehensive README
- **Architecture Decision Records (ADRs):** Document major technical decisions
- **Code Comments:** Explain "why" not "what", focus on business logic
