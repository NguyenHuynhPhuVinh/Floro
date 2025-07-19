# 2. Requirements

### 2.1 Functional Requirements (FR)

**Không gian làm việc (Canvas):**

- **FR1:** Hệ thống phải cung cấp một không gian làm việc 2D gần như vô hạn.
- **FR2:** Người dùng phải có thể di chuyển (pan) và phóng to/thu nhỏ (zoom) không gian làm việc một cách mượt mà.
- **FR3:** Mọi người dùng truy cập cùng một URL sẽ thấy cùng một không gian làm việc và nội dung trong đó.

**Quản lý Node:**

- **FR4:** Người dùng phải có thể tạo "Node File" bằng cách kéo và thả một hoặc nhiều file từ máy tính vào không gian làm việc. Tên node sẽ mặc định là tên file gốc.
- **FR5:** Người dùng phải có thể tạo "Node Văn bản" bằng cách dán văn bản từ clipboard trực tiếp lên không gian làm việc.
- **FR6:** Người dùng phải có thể tạo "Node Link" bằng cách dán một URL từ clipboard.
- **FR7:** Người dùng phải có thể tạo "Node Ảnh" bằng cách dán một hình ảnh từ clipboard.
- **FR8:** Người dùng phải có thể di chuyển bất kỳ node nào đến một vị trí mới trên không gian làm việc.
- **FR9:** Người dùng phải có thể tải về một file từ "Node File" hoặc một ảnh từ "Node Ảnh".
- **FR10:** Người dùng phải có thể sao chép nội dung từ "Node Văn bản", "Node Code", hoặc "Node Link".

**Tương tác thời gian thực:**

- **FR11:** Mọi hành động tạo hoặc di chuyển node phải được cập nhật và hiển thị cho tất cả người dùng khác trong phiên gần như ngay lập tức.
- **FR12:** Hệ thống phải hiển thị vị trí con trỏ chuột của những người dùng khác đang hoạt động trong phiên.

### 2.2 Non-Functional Requirements (NFR)

- **NFR1:** **Công nghệ:** Dự án phải được xây dựng bằng Next.js (Frontend) và Supabase (Backend, Database, Storage), và được host trên Vercel.
- **NFR2:** **Lưu trữ:** Tất cả các node được tạo ra phải được lưu trữ vĩnh viễn và không tự động bị xóa.
- **NFR3:** **Truy cập:** Hệ thống phải cho phép truy cập mà không yêu cầu người dùng đăng ký hoặc đăng nhập.
- **NFR4:** **Hiệu suất:**
  - Thời gian tải ban đầu của không gian làm việc phải dưới 3 giây trên kết nối mạng trung bình.
  - Các thao tác di chuyển, phóng to/thu nhỏ phải đạt được 60 FPS.
  - Độ trễ khi cập nhật real-time phải dưới 500ms.
  - Canvas phải hỗ trợ viewport virtualization để xử lý >1000 nodes mà không giảm performance.
- **NFR5:** **Bảo mật và Chống lạm dụng:**
  - Rate limiting: Tối đa 10 nodes/phút/IP, 100 nodes/giờ/IP.
  - File upload giới hạn: 10MB/file, chỉ cho phép các định dạng an toàn.
  - Content sanitization cho tất cả text inputs để ngăn XSS.
  - Automatic cleanup cho các sessions không hoạt động >24h.
- **NFR6:** **Mã nguồn mở:** Toàn bộ mã nguồn của dự án phải được công khai trên một nền tảng như GitHub.
- **NFR7:** **Kiến trúc cơ sở dữ liệu:** Hệ thống sẽ sử dụng **Supabase PostgreSQL** để lưu trữ dữ liệu node bền vững và **Supabase Realtime** cho các cập nhật real-time (như vị trí con trỏ và thay đổi node) để tối ưu hóa hiệu suất và đảm bảo tính nhất quán dữ liệu.
- **NFR8:** **Khả năng mở rộng:**
  - Hỗ trợ tối thiểu 50 concurrent users/workspace.
  - Database queries phải được optimize với proper indexing.
  - CDN caching cho static assets và uploaded files.
- **NFR9:** **Mobile Responsiveness:**
  - Touch gestures cho pan/zoom trên mobile devices.
  - Responsive UI components cho màn hình từ 320px trở lên.
  - Touch-friendly node manipulation với minimum 44px touch targets.
