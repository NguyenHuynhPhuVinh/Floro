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

- **Structure:** Monorepo.
- **Monorepo Tool:** `pnpm workspaces` will be used for dependency and script management.
- **Package Organization:**
  - `apps/web`: The main Next.js application.
  - `packages/shared-types`: A shared package for TypeScript type definitions (interfaces) used by both frontend and potentially future backend functions.

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

- **Component-Based UI:** The frontend will be built using reusable React components.
- **Repository Pattern (Client-Side):** An abstraction layer (`services`) will be created to handle all communication with Firebase, decoupling UI components from the data source.
- **Observer Pattern (Real-time):** The application will utilize Firestore's `onSnapshot` and Realtime Database's `onValue` listeners to reactively update the UI based on data changes from the backend.

## 3. Tech Stack

This table lists the technologies chosen for the Floro project. Development will adhere to the latest stable versions of these technologies.

| Category               | Technology                   | Purpose                                | Rationale                                                 |
| :--------------------- | :--------------------------- | :------------------------------------- | :-------------------------------------------------------- |
| **Language**           | TypeScript                   | Ngôn ngữ phát triển chính              | An toàn kiểu dữ liệu, dễ dàng chia sẻ types.              |
| **Frontend Framework** | Next.js                      | Xây dựng giao diện người dùng          | Framework React mạnh mẽ, tích hợp tốt với Vercel.         |
| **Backend Service**    | Firebase                     | Backend-as-a-Service                   | Tối ưu cho real-time, cung cấp các dịch vụ cần thiết.     |
| **State Database**     | Cloud Firestore              | Lưu trữ metadata và trạng thái node    | NoSQL, real-time, truy vấn mạnh mẽ, khả năng mở rộng lớn. |
| **Real-time Bus**      | Realtime Database            | Đồng bộ dữ liệu tần suất cao (con trỏ) | Độ trễ cực thấp, tối ưu chi phí cho các ghi đè liên tục.  |
| **File Storage**       | Firebase Storage             | Lưu trữ file                           | Tối ưu lưu trữ và phân phối file dung lượng lớn.          |
| **UI Library**         | Tailwind CSS                 | Styling                                | Xây dựng giao diện nhanh chóng và nhất quán.              |
| **UI Components**      | Shadcn/ui                    | Thư viện component                     | Cung cấp component đẹp, dễ tùy chỉnh, tái sử dụng.        |
| **State Management**   | Zustand                      | Quản lý trạng thái client              | Nhẹ, đơn giản, hiệu quả cho nhu cầu dự án.                |
| **2D Canvas Library**  | Konva.js                     | Xử lý không gian 2D                    | Thư viện canvas hiệu suất cao, hỗ trợ tốt.                |
| **Testing**            | Jest & React Testing Library | Unit & Integration tests               | Bộ công cụ tiêu chuẩn trong hệ sinh thái React.           |
| **Deployment**         | Vercel                       | Nền tảng hosting                       | Tích hợp CI/CD tự động, mạng lưới toàn cầu.               |

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
}

export interface FileNode extends BaseNode {
  type: "file";
  fileName: string;
  fileType: string;
  fileURL: string;
  fileSize: number;
}
export interface TextNode extends BaseNode {
  type: "text";
  content: string;
}
export interface LinkNode extends BaseNode {
  type: "link";
  url: string;
  title?: string;
}
export interface ImageNode extends BaseNode {
  type: "image";
  imageURL: string;
}

export type FloroNode = FileNode | TextNode | LinkNode | ImageNode;

// Transient data for cursors, stored in Realtime Database
export interface Cursor {
  id: string; // Anonymous user session ID
  position: { x: number; y: number };
  lastUpdate: number; // Using serverTimestamp
}
```

## 5. API Specification (Client-Side Service Layer)

All Firebase interactions from the Next.js app will be managed through a dedicated service layer located in `apps/web/src/services/`.

- **`firebase.ts`:** Centralized initialization of Firebase services (Firestore, Realtime DB, Storage).
- **`node.service.ts`:** Manages CRUD operations and real-time listeners for `FloroNode` data in **Firestore**.
- **`storage.service.ts`:** Manages file uploads and retrievals from **Firebase Storage**.
- **`realtime.service.ts`:** Manages high-frequency updates, like cursor positions, using **Realtime Database**.

## 6. Unified Project Structure

The project will use a monorepo structure managed by `pnpm workspaces`.

```plaintext
floro/
├── apps/
│   └── web/
│       ├── src/
│       │   ├── app/
│       │   ├── components/
│       │   ├── services/
│       │   ├── hooks/
│       │   └── store/
├── packages/
│   └── shared-types/
└── ... (root configuration files)
```

## 7. Development Workflow

- **Setup:** `pnpm install`, configure `.env.local` with Firebase credentials.
- **Commands:** `pnpm dev`, `pnpm lint`, `pnpm test`.

## 8. Deployment Architecture

- **Frontend:** The Next.js app is automatically deployed to Vercel upon pushes to the `main` branch.
- **Backend:** Firebase Security Rules and configurations are deployed via the Firebase CLI.
- **Environments:**
  - **Development:** Local machine.
  - **Preview:** Vercel automatically creates a preview deployment for each Pull Request.
  - **Production:** Live environment on the main domain.

## 9. Security and Performance

- **Security:**
  - **Firebase Security Rules:** Enforce data validation and access control on the backend.
  - **Rate Limiting:** Implement basic rate limiting on node creation to prevent abuse.
  - **Input Sanitization:** Sanitize all user-generated content to prevent XSS attacks.
- **Performance:**
  - **Canvas Virtualization:** Only render nodes currently within the user's viewport.
  - **Level of Detail (LOD):** Render simplified versions of nodes when zoomed out.
  - **Spatial Partitioning:** Query Firestore for nodes only within the current viewable area.
  - **Lazy Loading:** Defer loading of images and other assets until they are needed.

## 10. Testing Strategy

The project will follow the Testing Pyramid model, with a strong emphasis on automated tests.

- **Unit Tests (Jest):** For utility functions and business logic in services/hooks. Firebase services will be mocked.
- **Integration Tests (React Testing Library):** For testing interactions between UI components.
- **E2E Tests (Post-MVP):** Using Cypress or Playwright for critical user flows.

## 11. Coding Standards

- **TypeScript:** `strict` mode is mandatory. The `any` type is forbidden.
- **Code Style:** Managed by Prettier and ESLint, enforced via pre-commit hooks using `husky` and `lint-staged`.
- **Naming Conventions:** Adhere to the defined conventions (e.g., `PascalCase` for components, `camelCase` for hooks).
- **Logic Separation:** UI components are for presentation only. All state and data-fetching logic must be in hooks or services.
