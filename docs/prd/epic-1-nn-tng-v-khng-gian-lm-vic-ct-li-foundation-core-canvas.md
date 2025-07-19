# Epic 1: Nền tảng và Không gian làm việc cốt lõi (Foundation & Core Canvas)

**Mục tiêu Epic:** Thiết lập dự án, hạ tầng và tạo ra một không gian làm việc 2D mà người dùng có thể truy cập, di chuyển và phóng to/thu nhỏ.

### Story 1.1: Thiết lập Dự án và Hạ tầng

- **As a** developer, **I want** to set up a new Next.js project with Firebase integration and continuous deployment via Vercel, **so that** we have a solid and automated foundation.
  **Acceptance Criteria:**

1.  Repository mã nguồn mở mới được tạo trên GitHub.
2.  Dự án Next.js (TypeScript) được khởi tạo trong monorepo.
3.  Dự án Firebase mới được tạo và kết nối.
4.  Dự án được kết nối với Vercel và tự động triển khai.
5.  Trang chủ hiển thị một trang chào mừng.

### Story 1.2: Triển khai Không gian làm việc 2D

- **As a** user, **I want** to see an infinite 2D canvas when I open the application, **so that** I have a space to start sharing.
  **Acceptance Criteria:**

1.  Giao diện chính hiển thị một không gian 2D.
2.  Người dùng có thể pan (giữ và kéo).
3.  Người dùng có thể zoom (cuộn chuột/chụm ngón tay).
4.  Các thao tác pan và zoom phải mượt mà.
