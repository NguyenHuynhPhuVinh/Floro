# 5. API Specification (Client-Side Service Layer)

Logic giao tiếp với Firebase sẽ được đóng gói trong các file dịch vụ tại `apps/web/src/services/`.

- **`firebase.ts`:** Khởi tạo Firebase.
- **`node.service.ts`:**
  - `listenToNodes()`: Lắng nghe cập nhật node từ Firestore.
  - `addNode()`: Thêm node mới.
  - `updateNodePosition()`: Cập nhật vị trí node.
- **`storage.service.ts`:**
  - `uploadFile()`: Tải file lên Firebase Storage.
  - `uploadImageFromBlob()`: Tải ảnh từ clipboard.
- **`realtime.service.ts`:**
  - `updateCursorPosition()`: Cập nhật vị trí con trỏ (dùng Realtime DB).
  - `listenToCursors()`: Lắng nghe vị trí các con trỏ khác.
