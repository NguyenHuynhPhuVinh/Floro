# Epic 2: Quản lý Node Cơ bản (Basic Node Management)

**Mục tiêu Epic:** Cho phép người dùng tạo ra các loại node khác nhau (file, văn bản, link, ảnh) và thực hiện các thao tác cơ bản như di chuyển và xem nội dung. Các node này phải được lưu trữ vĩnh viễn trong Firebase.

### Story 2.1: Tạo Node File bằng cách Kéo-thả

- **As a** user,
- **I want** to drag and drop a file from my computer onto the canvas,
- **so that** a new "File Node" is created and stored permanently.

**Acceptance Criteria:**

1.  Khi một file được kéo và thả vào không gian làm việc, một node mới sẽ xuất hiện tại vị trí thả.
2.  Node hiển thị tên file và một icon đại diện cho loại file.
3.  File được tải lên Firebase Storage.
4.  Metadata của node (vị trí, tên, link tới file trong Storage) được lưu vào Firestore/Realtime DB.
5.  Node có thể được di chuyển tự do trên canvas sau khi tạo.
6.  Người dùng khác có thể nhấp vào node để tải file về máy.

### Story 2.2: Tạo Node từ Clipboard (Văn bản, Link, Ảnh)

- **As a** user,
- **I want** to paste content from my clipboard directly onto the canvas,
- **so that** a corresponding node (Text, Link, or Image) is created instantly.

**Acceptance Criteria:**

1.  Khi người dùng nhấn `Ctrl+V` (hoặc `Cmd+V`), hệ thống sẽ kiểm tra nội dung clipboard.
2.  Nếu là văn bản, một "Node Văn bản" sẽ được tạo, hiển thị nội dung văn bản đó.
3.  Nếu là một URL, một "Node Link" sẽ được tạo, hiển thị URL và có thể nhấp vào được.
4.  Nếu là một hình ảnh, một "Node Ảnh" sẽ được tạo, hiển thị hình ảnh đó. Ảnh phải được tải lên Firebase Storage.
5.  Tất cả các loại node mới tạo phải được lưu trữ vĩnh viễn và có thể di chuyển được.
6.  Người dùng khác có thể sao chép nội dung từ Node Văn bản và Node Link.
