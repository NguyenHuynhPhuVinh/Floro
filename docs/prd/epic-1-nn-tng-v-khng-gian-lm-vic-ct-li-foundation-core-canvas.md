# Epic 1: Nền tảng và Không gian làm việc cốt lõi (Foundation & Core Canvas)

**Mục tiêu Epic:** Thiết lập dự án Next.js và Firebase, triển khai hạ tầng trên Vercel, và tạo ra một không gian làm việc 2D mà người dùng có thể truy cập, di chuyển và phóng to/thu nhỏ. Đây là khung sườn cho toàn bộ ứng dụng.

### Story 1.1: Thiết lập Dự án và Hạ tầng

- **As a** developer,
- **I want** to set up a new Next.js project with Firebase integration and continuous deployment via Vercel,
- **so that** we have a solid and automated foundation to build the application upon.

**Acceptance Criteria:**

1.  Một repository mã nguồn mở mới được tạo trên GitHub.
2.  Một dự án Next.js (TypeScript) được khởi tạo trong monorepo.
3.  Một dự án Firebase mới được tạo và kết nối với ứng dụng Next.js (bao gồm Firestore/Realtime DB và Firebase Storage).
4.  Dự án được kết nối với Vercel và tự động triển khai khi có commit mới vào nhánh chính (main).
5.  Trang chủ của ứng dụng hiển thị một trang trống hoặc một thông báo "Chào mừng đến với Floro" khi truy cập qua URL của Vercel.

### Story 1.2: Triển khai Không gian làm việc 2D

- **As a** user,
- **I want** to see an infinite 2D canvas when I open the application,
- **so that** I have a space to start sharing and organizing content.

**Acceptance Criteria:**

1.  Khi truy cập trang web, giao diện chính hiển thị một không gian 2D.
2.  Người dùng có thể giữ chuột và kéo (pan) để di chuyển xung quanh không gian 2D.
3.  Người dùng có thể sử dụng bánh xe cuộn chuột hoặc cử chỉ chụm ngón tay (trên trackpad) để phóng to (zoom in) và thu nhỏ (zoom out) không gian làm việc.
4.  Các hành động pan và zoom phải mượt mà, không bị giật lag.
