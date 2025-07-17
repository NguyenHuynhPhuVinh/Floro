# 4. Data Models

_Các mô hình dữ liệu này sẽ được định nghĩa trong `packages/shared-types/src/index.ts`_

**BaseNode:**

```typescript
interface BaseNode {
  id: string;
  sessionId: string;
  type: "file" | "text" | "link" | "image";
  position: { x: number; y: number };
  size: { width: number; height: number };
  createdAt: Timestamp;
}
```

**FloroNode (Union Type):**

```typescript
export type FloroNode = FileNode | TextNode | LinkNode | ImageNode;
```

**Cursor:**

```typescript
interface Cursor {
  id: string;
  position: { x: number; y: number };
  lastUpdate: Timestamp;
}
```
