# Floro Fullstack Architecture Document

## 1. Introduction

### 1.1 Introduction

This document outlines the complete fullstack architecture for **Floro**, including the Next.js frontend, Firebase backend, and the integration between them. It serves as the single source of truth for AI-driven development, ensuring consistency across the entire technology stack. This unified approach is designed to streamline development for modern fullstack applications where frontend and backend concerns are increasingly intertwined.

### 1.2 Starter Template or Existing Project

- **N/A - Greenfield project:** This project will be built from scratch, following the best practices outlined in this document.

### 1.3 Change Log

| Date             | Version | Description                | Author              |
| :--------------- | :------ | :------------------------- | :------------------ |
| {{current_date}} | 1.0     | Initial Architecture Draft | Winston (Architect) |

## 2. High-Level Architecture

### 2.1 Technical Summary

The Floro system will be built using a **modern Jamstack architecture combined with a serverless backend**, leveraging the strengths of Next.js for the frontend and the Firebase ecosystem for the backend. Users will interact with a highly performant Next.js application hosted on Vercel. All workspace state data (node positions, metadata) and real-time updates will be managed through **Cloud Firestore**. Large file assets, such as images and documents, will be stored in **Firebase Storage**. This architecture is designed to optimize page load speeds, provide seamless scalability, and minimize operational costs, directly aligning with the goals set forth in the PRD.

### 2.2 Platform and Infrastructure Choice

- **Platform:** Vercel + Firebase.
- **Key Services:**
  - **Vercel:** Primary hosting for the Next.js application, providing CI/CD, and a global Edge Network.
  - **Firebase:**
    - **Cloud Firestore:** The primary NoSQL database for storing node metadata and managing real-time state synchronization.
    - **Realtime Database:** Used as a high-frequency message bus for transient data like cursor positions to optimize performance and cost.
    - **Firebase Storage:** Handles storage and delivery of user-uploaded file objects (images, documents, etc.).
- **Deployment Regions:** Infrastructure will be configured to serve users globally with low latency, leveraging the distributed networks of Vercel and Google Cloud.

### 2.3 Repository Structure

- **Structure:** Simplified Monorepo.
- **Monorepo Tool:** `pnpm workspaces` will be used for dependency and script management.
- **Package Organization:**
  - `apps/web`: The main Next.js application.
  - `packages/shared-types`: TypeScript type definitions shared across the application and future extensions.
  - `packages/eslint-config`: Shared ESLint configuration for consistent code style.
- **Rationale:** While currently single-app, monorepo structure provides future-proofing for potential Firebase Functions, mobile apps, or admin dashboards while maintaining minimal overhead.

### 2.4 High-Level Architecture Diagram

```mermaid
graph TD
    subgraph "User's Browser"
        A[Next.js Frontend on Vercel]
    end

    subgraph "Firebase Backend"
        B[Cloud Firestore<br><i>(Node Data)</i>]
        C[Firebase Storage<br><i>(File Content)</i>]
        F[Realtime Database<br><i>(Cursor Positions)</i>]
        D[Firebase Functions - Optional]
    end

    E((User)) --> A
    A -- Reads/Writes Metadata & Real-time Updates --> B
    A -- Uploads/Downloads Files --> C
    A -- Sends/Receives Cursor Positions --> F
    A -- Calls for complex logic --> D
```

### 2.5 Architectural Patterns

- **Component-Based UI:** The frontend will be built using reusable React components with clear separation of concerns.
- **Repository Pattern (Client-Side):** An abstraction layer (`services`) will be created to handle all communication with Firebase, decoupling UI components from the data source.
- **Observer Pattern (Real-time):** The application will utilize Firestore's `onSnapshot` and Realtime Database's `onValue` listeners to reactively update the UI based on data changes from the backend.
- **Command Pattern:** For undo/redo functionality and action tracking.
- **Strategy Pattern:** For different node rendering strategies based on zoom level and viewport.
- **Facade Pattern:** Simplified interfaces for complex Firebase operations.

### 2.6 Performance Architecture

- **Viewport Virtualization:** Only render nodes within the current viewport plus a buffer zone.
- **Spatial Indexing:** Use quadtree or similar structure for efficient spatial queries.
- **Level of Detail (LOD):** Render simplified versions of nodes when zoomed out.
- **Debounced Updates:** Batch and debounce high-frequency updates (cursor positions, node movements).
- **Lazy Loading:** Load node content (images, files) only when needed.
- **Caching Strategy:** Multi-layer caching (browser cache, CDN, Firebase cache).

## 3. Tech Stack

This table lists the technologies chosen for the Floro project. Development will adhere to the latest stable versions of these technologies.

| Category               | Technology                   | Purpose                                | Rationale                                                  |
| :--------------------- | :--------------------------- | :------------------------------------- | :--------------------------------------------------------- |
| **Language**           | TypeScript                   | Ngôn ngữ phát triển chính              | An toàn kiểu dữ liệu, dễ dàng chia sẻ types.               |
| **Frontend Framework** | Next.js 14+                  | Xây dựng giao diện người dùng          | Framework React mạnh mẽ, App Router, tích hợp Vercel.      |
| **Backend Service**    | Firebase                     | Backend-as-a-Service                   | Tối ưu cho real-time, cung cấp các dịch vụ cần thiết.      |
| **State Database**     | Cloud Firestore              | Lưu trữ metadata và trạng thái node    | NoSQL, real-time, truy vấn mạnh mẽ, khả năng mở rộng lớn.  |
| **Real-time Bus**      | Realtime Database            | Đồng bộ dữ liệu tần suất cao (con trỏ) | Độ trễ cực thấp, tối ưu chi phí cho các ghi đè liên tục.   |
| **File Storage**       | Firebase Storage             | Lưu trữ file                           | Tối ưu lưu trữ và phân phối file dung lượng lớn.           |
| **UI Library**         | Tailwind CSS                 | Styling                                | Xây dựng giao diện nhanh chóng và nhất quán.               |
| **UI Components**      | Shadcn/ui                    | Thư viện component                     | Cung cấp component đẹp, dễ tùy chỉnh, tái sử dụng.         |
| **State Management**   | Zustand                      | Quản lý trạng thái client              | Nhẹ, đơn giản, hiệu quả cho nhu cầu dự án.                 |
| **2D Canvas Library**  | Konva.js                     | Xử lý không gian 2D                    | Thư viện canvas hiệu suất cao, hỗ trợ tốt.                 |
| **Spatial Indexing**   | Custom Quadtree              | Tối ưu truy vấn không gian             | Hiệu suất cao cho viewport queries và collision detection. |
| **Error Handling**     | React Error Boundary         | Xử lý lỗi graceful                     | Ngăn crash toàn bộ app, user experience tốt hơn.           |
| **Performance**        | React.memo, useMemo          | Tối ưu re-rendering                    | Giảm unnecessary renders, cải thiện performance.           |
| **Testing**            | Jest & React Testing Library | Unit & Integration tests               | Bộ công cụ tiêu chuẩn trong hệ sinh thái React.            |
| **E2E Testing**        | Playwright                   | End-to-end testing                     | Modern, reliable, cross-browser testing.                   |
| **Monitoring**         | Vercel Analytics             | Performance monitoring                 | Built-in analytics, Core Web Vitals tracking.              |
| **Deployment**         | Vercel                       | Nền tảng hosting                       | Tích hợp CI/CD tự động, mạng lưới toàn cầu.                |

## 4. Data Models

These TypeScript interfaces, located in `packages/shared-types`, define the core data structures.

```typescript
// packages/shared-types/src/index.ts
import { Timestamp } from "firebase/firestore";

// The base for all node types, stored in Firestore
interface BaseNode {
  id: string;
  sessionId: string; // e.g., "public"
  type: "file" | "text" | "link" | "image";
  position: { x: number; y: number };
  size: { width: number; height: number };
  createdAt: Timestamp;
  updatedAt: Timestamp;
  zIndex: number; // For layering
  isLocked?: boolean; // Prevent accidental moves
  metadata?: Record<string, any>; // Extensible metadata
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

// Transient data for cursors, stored in Realtime Database
export interface Cursor {
  id: string; // Anonymous user session ID
  position: { x: number; y: number };
  lastUpdate: number; // Using serverTimestamp
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
  timestamp: Timestamp;
  error: string;
  stack?: string;
  userAgent: string;
  sessionId: string;
  context?: Record<string, any>;
}
```

## 5. API Specification (Client-Side Service Layer)

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

## 6. Unified Project Structure

The project will use a monorepo structure managed by `pnpm workspaces`.

```plaintext
floro/
├── apps/
│   └── web/                            # Main Next.js application
│       ├── src/
│       │   ├── app/                    # Next.js App Router
│       │   ├── components/             # React components
│       │   │   ├── ui/                 # Shadcn/ui components
│       │   │   ├── canvas/             # Canvas-specific components
│       │   │   ├── nodes/              # Node type components
│       │   │   └── common/             # Shared components
│       │   ├── services/               # Firebase service layer
│       │   │   ├── core/               # Core services (firebase, node, storage)
│       │   │   ├── advanced/           # Advanced services (spatial, cache, performance)
│       │   │   └── utils/              # Service utilities
│       │   ├── hooks/                  # Custom React hooks
│       │   │   ├── canvas/             # Canvas-related hooks
│       │   │   ├── nodes/              # Node management hooks
│       │   │   └── realtime/           # Real-time data hooks
│       │   ├── store/                  # Zustand stores
│       │   │   ├── canvas.store.ts     # Canvas state (zoom, pan, viewport)
│       │   │   ├── nodes.store.ts      # Node management state
│       │   │   └── realtime.store.ts   # Real-time collaboration state
│       │   ├── lib/                    # Utility libraries
│       │   │   ├── spatial/            # Quadtree and spatial indexing
│       │   │   ├── performance/        # Performance monitoring
│       │   │   └── security/           # Input sanitization, validation
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
# Edit .env.local with Firebase credentials
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
- **Backend:** Firebase Security Rules and configurations are deployed via the Firebase CLI.
- **Environments:**
  - **Development:** Local machine.
  - **Preview:** Vercel automatically creates a preview deployment for each Pull Request.
  - **Production:** Live environment on the main domain.

## 9. Security and Performance

### 9.1 Security Architecture

- **Firebase Security Rules:**
  - Enforce data validation and access control on the backend
  - Rate limiting rules at database level
  - File type and size restrictions
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
  - **Caching Strategy:** Multi-layer caching (browser, CDN, Firebase)
- **Real-time Optimization:**
  - **Debounced Updates:** Batch high-frequency updates (cursor, drag)
  - **Connection Management:** Automatic reconnection with exponential backoff
  - **Selective Subscriptions:** Only subscribe to data in current viewport
- **Memory Management:**
  - **Object Pooling:** Reuse canvas objects to reduce GC pressure
  - **Cleanup Strategies:** Automatic cleanup of off-screen resources
  - **Memory Monitoring:** Track and alert on memory usage patterns

## 10. Testing Strategy

The project will follow the Testing Pyramid model, with a strong emphasis on automated tests and performance validation.

### 10.1 Unit Testing (Jest)

- **Services Layer:** Mock Firebase services, test business logic
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
- **Firebase Rules:** Test security rule enforcement

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
