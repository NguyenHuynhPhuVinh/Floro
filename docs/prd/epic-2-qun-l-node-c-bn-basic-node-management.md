# Epic 2: Quản lý Node Cơ bản (Basic Node Management)

**Mục tiêu Epic:** Cho phép người dùng tạo, di chuyển và xem các loại node, lưu trữ vĩnh viễn trong Firebase.

### Story 2.1: Tạo Node File bằng cách Kéo-thả

- **As a** user, **I want** to drag and drop a file from my computer onto the canvas, **so that** a new "File Node" is created and stored permanently.
  **Acceptance Criteria:**

1.  Node mới xuất hiện tại vị trí thả.
2.  Node hiển thị tên file và icon.
3.  File được tải lên Firebase Storage.
4.  Metadata của node được lưu vào Firestore.
5.  Node có thể di chuyển được.
6.  Người dùng có thể nhấp để tải file về.

### Story 2.2: Tạo Node từ Clipboard (Văn bản, Link, Ảnh)

- **As a** user, **I want** to paste content from my clipboard directly onto the canvas, **so that** a corresponding node is created instantly.
  **Acceptance Criteria:**

1.  Khi nhấn `Ctrl+V`, hệ thống kiểm tra clipboard.
2.  Nếu là văn bản, tạo Node Văn bản.
3.  Nếu là URL, tạo Node Link.
4.  Nếu là ảnh, tạo Node Ảnh và tải ảnh lên Storage.
5.  Tất cả node mới tạo phải được lưu trữ và di chuyển được.
6.  Người dùng có thể sao chép nội dung từ Node Văn bản và Link.
