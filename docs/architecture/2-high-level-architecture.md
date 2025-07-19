# 2. High-Level Architecture

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
