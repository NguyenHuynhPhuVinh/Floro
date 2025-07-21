# Epic 2: Quản lý Node Cơ bản (Basic Node Management)

**Mục tiêu Epic:** Cho phép người dùng tạo, quản lý và tương tác với các loại node một cách đầy đủ, lưu trữ vĩnh viễn trong Supabase với giao diện người dùng hoàn chỉnh.

### Story 2.1: Tạo Node File bằng cách Kéo-thả

- **As a** user, **I want** to drag and drop a file from my computer onto the canvas, **so that** a new "File Node" is created and stored permanently.
  **Acceptance Criteria:**

1.  Node mới xuất hiện tại vị trí thả.
2.  Node hiển thị tên file và icon.
3.  File được tải lên Supabase Storage.
4.  Metadata của node được lưu vào PostgreSQL database.
5.  Node có thể di chuyển được.
6.  Người dùng có thể nhấp để tải file về.

### Story 2.2: Hoàn thiện Logic Quản lý Node

- **As a** user, **I want** to have complete control over file nodes (select, update position, delete), **so that** I can manage my workspace effectively.
  **Acceptance Criteria:**

1.  Người dùng có thể chọn một hoặc nhiều node bằng cách nhấp chuột.
2.  Node được chọn hiển thị trạng thái selected rõ ràng (border, highlight).
3.  Người dùng có thể kéo thả node để cập nhật vị trí, lưu vào database.
4.  Người dùng có thể xóa node bằng phím Delete hoặc context menu.
5.  Hệ thống hiển thị loading states khi thực hiện các thao tác.
6.  Tất cả thay đổi được lưu vào database và cập nhật UI ngay lập tức.

### Story 2.3: Xây dựng Giao diện Hỗ trợ Canvas

- **As a** user, **I want** to see a complete application interface with Vietnamese branding and helpful controls, **so that** I understand the application and can configure it easily.
  **Acceptance Criteria:**

1.  Logo "Floro" hiển thị ở vị trí trung tâm phía trên canvas.
2.  Nút cài đặt (Settings) với icon gear ở góc phải trên.
3.  Modal cài đặt hiển thị khi nhấp nút Settings với nội dung tiếng Việt.
4.  Cài đặt bao gồm: hiển thị tọa độ chuột, theme, ngôn ngữ.
5.  Canvas có background pattern hoặc grid để tạo cảm giác không gian làm việc.
6.  Tất cả text trong UI sử dụng tiếng Việt.

### Story 2.4: Tích hợp shadcn/ui và Hoàn thiện Theme UI

- **As a** user, **I want** to experience a consistent, polished Vietnamese interface built with modern UI components, **so that** the application feels professional and provides excellent user experience.
  **Acceptance Criteria:**

1.  Tích hợp shadcn/ui component library vào dự án Next.js.
2.  Setup Tailwind CSS configuration tương thích với shadcn/ui.
3.  Implement theme system với shadcn/ui theming (CSS variables, dark/light mode).
4.  Migrate tất cả UI components hiện tại sang shadcn/ui components (Button, Modal, Dialog, etc.).
5.  Tất cả components UI có text tiếng Việt nhất quán và professional.
6.  Dark/Light mode toggle hoạt động cho toàn bộ ứng dụng (DOM và Canvas).
7.  Responsive design hoàn thiện sử dụng shadcn/ui responsive utilities.
8.  Loading states và error states sử dụng shadcn/ui components với messages tiếng Việt.
9.  Accessibility features được inherit từ shadcn/ui và customize thêm cho tiếng Việt.
10. **Task Dynamic:** Agent dev sẽ hỏi người dùng về các tinh chỉnh UI/UX cần thiết và thực hiện iterative improvements cho đến khi người dùng chấp nhận. Sau đó ghi nhận các tinh chỉnh đã thực hiện và đánh dấu hoàn thành.

### Story 2.5: Tạo Node từ Clipboard (Văn bản, Link, Ảnh)

- **As a** user, **I want** to paste content from my clipboard directly onto the canvas, **so that** a corresponding node is created instantly.
  **Acceptance Criteria:**

1.  Khi nhấn `Ctrl+V`, hệ thống kiểm tra clipboard.
2.  Nếu là văn bản, tạo Node Văn bản.
3.  Nếu là URL, tạo Node Link.
4.  Nếu là ảnh, tạo Node Ảnh và tải ảnh lên Supabase Storage.
5.  Tất cả node mới tạo phải được lưu trữ trong PostgreSQL và di chuyển được.
6.  Người dùng có thể sao chép nội dung từ Node Văn bản và Link.
