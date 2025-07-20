# Floro Product Requirements Document (PRD)

## 1. Goals and Background Context

### 1.1 Goals

- Cung cấp một công cụ chia sẻ tức thì, hiệu quả và được yêu thích, giúp giải quyết các vấn đề cộng tác trong môi trường học tập CNTT.
- Xây dựng nền tảng kỹ thuật vững chắc trên Vercel và Supabase, cho phép mở rộng các tính năng cộng tác cao cấp trong tương lai một cách dễ dàng.
- Tối ưu hóa trải nghiệm người dùng, giảm thiểu mọi rào cản để việc chia sẻ tài nguyên học tập diễn ra một cách liền mạch và tức thời.
- Tạo ra một dự án mã nguồn mở, miễn phí và có giá trị cho cộng đồng.

### 1.2 Background Context

Trong các môi trường học tập và làm việc nhóm tốc độ cao, việc chia sẻ tài nguyên giữa các thành viên thường gặp nhiều trở ngại, từ việc phải đăng nhập vào các dịch vụ đám mây đến quản lý quyền truy cập phức tạp. Floro ra đời để giải quyết vấn đề này bằng cách cung cấp một không gian làm việc 2D trực quan, bền vững và truy cập công khai qua một đường link duy nhất. Giải pháp này loại bỏ hoàn toàn các bước không cần thiết, cho phép người dùng chia sẻ file, code, link và các nội dung khác một cách tức thì, biến việc cộng tác trở thành một trải nghiệm liền mạch và tự nhiên.

### 1.3 Change Log

| Date             | Version | Description       | Author    |
| :--------------- | :------ | :---------------- | :-------- |
| {{current_date}} | 1.0     | Initial PRD Draft | John (PM) |

## 2. Requirements

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

## 3. User Interface Design Goals

### 3.1 Overall UX Vision (Tầm nhìn UX tổng thể)

Giao diện của Floro phải mang lại cảm giác **tức thì, trực quan và không bị cản trở**. Người dùng nên cảm thấy như họ đang làm việc trên một chiếc bảng trắng kỹ thuật số thông minh, nơi mọi thao tác đều diễn ra một cách tự nhiên. Trọng tâm là loại bỏ các bước thừa, cho phép người dùng tập trung vào nội dung thay vì phải học cách sử dụng công cụ.

### 3.2 Key Interaction Paradigms (Mô hình tương tác chính)

- **Kéo và thả (Drag-and-Drop):** Là hành động chính để đưa nội dung từ bên ngoài vào không gian làm việc.
- **Tương tác trực tiếp (Direct Manipulation):** Người dùng có thể trực tiếp nhấp và kéo các node để sắp xếp chúng.
- **Sao chép và dán (Copy-Paste):** Một cách cực nhanh để tạo ra các node văn bản, link và ảnh.
- **Điều hướng không gian (Spatial Navigation):** Dùng chuột hoặc trackpad để pan (giữ và kéo) và zoom (cuộn chuột/chụm ngón tay).

### 3.3 Core Screens and Views (Các màn hình và giao diện chính)

- **Không gian làm việc (The Canvas):** Giao diện cốt lõi, chiếm gần như toàn bộ màn hình, hiển thị tất cả các node.

### 3.4 Accessibility (Khả năng tiếp cận)

- **WCAG AA:** Hướng tới tiêu chuẩn WCAG 2.1 Mức AA.

### 3.5 Branding (Thương hiệu)

- Phong cách thiết kế **sạch sẽ, tối giản và hiện đại**.

### 3.6 Target Device and Platforms (Thiết bị và nền tảng mục tiêu)

- **Web Responsive:** Hoạt động tốt trên cả máy tính để bàn và thiết bị di động.

## 4. Technical Assumptions

### 4.1 Repository Structure (Cấu trúc Repository)

- **Monorepo:** Quản lý trong một monorepo duy nhất để dễ dàng chia sẻ code.

### 4.2 Service Architecture (Kiến trúc Dịch vụ)

- **Serverless-oriented:** Tận dụng tối đa hệ sinh thái Supabase (PostgreSQL, Storage, Edge Functions, Realtime) và Vercel.

### 4.3 Testing Requirements (Yêu cầu về Kiểm thử)

- **Unit Test là bắt buộc.**
- Cần có Integration Test cho sự tương tác giữa frontend và Supabase.
- E2E Test sẽ được xem xét sau MVP.

### 4.4 Additional Technical Assumptions and Requests (Các giả định và yêu cầu kỹ thuật khác)

- **Real-time Communication:** Sử dụng Supabase Realtime với WebSocket connections cho live collaboration.
- **Error Handling:** Implement comprehensive error boundaries và graceful degradation.
- **Offline Support:** Basic offline caching cho read-only operations.
- **Analytics:** Integrate basic usage analytics để track user engagement và performance metrics.

## 6. Success Metrics và KPIs

### 6.1 User Engagement Metrics

- **Daily Active Users (DAU):** Target 100+ DAU trong 3 tháng đầu.
- **Session Duration:** Trung bình >5 phút/session.
- **Node Creation Rate:** Trung bình >3 nodes/session.
- **Collaboration Rate:** >30% sessions có >1 concurrent user.

### 6.2 Technical Performance Metrics

- **Page Load Time:** <3s cho 95% requests.
- **Real-time Latency:** <500ms cho 99% updates.
- **Uptime:** >99.5% availability.
- **Error Rate:** <1% của tất cả operations.

### 6.3 Content Quality Metrics

- **File Upload Success Rate:** >98%.
- **Content Retention:** >90% nodes được giữ lại sau 24h.
- **Abuse Reports:** <0.1% của total content.

## 7. Epic List

- **Epic 1: Nền tảng và Không gian làm việc cốt lõi (Foundation & Core Canvas)**
- **Epic 2: Quản lý Node Cơ bản (Basic Node Management)**
- **Epic 3: Tương tác và Cộng tác Thời gian thực (Real-time Interaction & Collaboration)**
- **Epic 4: Performance Optimization và Security (Performance & Security)**
- **Epic 5 (Post-MVP): Tổ chức Không gian Nâng cao (Advanced Spatial Organization)**
- **Epic 6 (Post-MVP): Chỉnh sửa và Tương tác Nâng cao (Advanced Editing & Interactions)**
- **Epic 7 (Post-MVP): Analytics và Monitoring (Analytics & Monitoring)**

## Epic 1: Nền tảng và Không gian làm việc cốt lõi (Foundation & Core Canvas)

**Mục tiêu Epic:** Thiết lập dự án, hạ tầng và tạo ra một không gian làm việc 2D mà người dùng có thể truy cập, di chuyển và phóng to/thu nhỏ.

### Story 1.1: Thiết lập Dự án và Hạ tầng

- **As a** developer, **I want** to set up a new Next.js project with Supabase integration and continuous deployment via Vercel, **so that** we have a solid and automated foundation.
  **Acceptance Criteria:**

1.  Repository mã nguồn mở mới được tạo trên GitHub.
2.  Dự án Next.js (TypeScript) được khởi tạo trong monorepo.
3.  Dự án Supabase mới được tạo và kết nối.
4.  Database schema được thiết lập với tables cho nodes và cursors.
5.  Dự án được kết nối với Vercel và tự động triển khai.
6.  Trang chủ hiển thị một trang chào mừng với Supabase connection test.

### Story 1.2: Triển khai Không gian làm việc 2D

- **As a** user, **I want** to see an infinite 2D canvas when I open the application, **so that** I have a space to start sharing.
  **Acceptance Criteria:**

1.  Giao diện chính hiển thị một không gian 2D.
2.  Người dùng có thể pan (giữ và kéo).
3.  Người dùng có thể zoom (cuộn chuột/chụm ngón tay).
4.  Các thao tác pan và zoom phải mượt mà.

## Epic 2: Quản lý Node Cơ bản (Basic Node Management)

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

### Story 2.3: Cải thiện Giao diện Node với Konva

- **As a** user, **I want** to see beautiful, intuitive Vietnamese interface for nodes, **so that** I have a pleasant and familiar user experience.
  **Acceptance Criteria:**

1.  Node hiển thị với thiết kế đẹp, professional sử dụng Konva components.
2.  Icon file types được cải thiện với màu sắc và design phù hợp.
3.  Hover effects mượt mà với shadow, scale, và color transitions.
4.  Tooltip hiển thị thông tin chi tiết bằng tiếng Việt khi hover.
5.  Visual feedback rõ ràng cho các trạng thái: normal, hover, selected, dragging.
6.  Animation mượt mà cho các transitions và state changes.

### Story 2.4: Xây dựng Giao diện Hỗ trợ Canvas

- **As a** user, **I want** to see a complete application interface with Vietnamese branding and helpful controls, **so that** I understand the application and can configure it easily.
  **Acceptance Criteria:**

1.  Logo "Floro" hiển thị ở vị trí trung tâm phía trên canvas.
2.  Nút cài đặt (Settings) với icon gear ở góc phải trên.
3.  Modal cài đặt hiển thị khi nhấp nút Settings với nội dung tiếng Việt.
4.  Cài đặt bao gồm: hiển thị tọa độ chuột, theme, ngôn ngữ.
5.  Canvas có background pattern hoặc grid để tạo cảm giác không gian làm việc.
6.  Tất cả text trong UI sử dụng tiếng Việt.

### Story 2.5: Tạo Node từ Clipboard (Văn bản, Link, Ảnh)

- **As a** user, **I want** to paste content from my clipboard directly onto the canvas, **so that** a corresponding node is created instantly.
  **Acceptance Criteria:**

1.  Khi nhấn `Ctrl+V`, hệ thống kiểm tra clipboard.
2.  Nếu là văn bản, tạo Node Văn bản.
3.  Nếu là URL, tạo Node Link.
4.  Nếu là ảnh, tạo Node Ảnh và tải ảnh lên Supabase Storage.
5.  Tất cả node mới tạo phải được lưu trữ trong PostgreSQL và di chuyển được.
6.  Người dùng có thể sao chép nội dung từ Node Văn bản và Link.

## Epic 3: Tương tác và Cộng tác Thời gian thực (Real-time Interaction & Collaboration)

**Mục tiêu Epic:** Kích hoạt cập nhật thời gian thực để tạo môi trường làm việc nhóm thực sự.

### Story 3.1: Đồng bộ hóa Trạng thái Không gian làm việc

- **As a** user, **I want** to see any changes made by other users appear on my screen instantly, **so that** we can collaborate seamlessly.
  **Acceptance Criteria:**

1.  Khi một node được tạo, nó xuất hiện cho mọi người.
2.  Khi một node được di chuyển, vị trí của nó được cập nhật cho mọi người.
3.  Khi một node bị xóa, nó biến mất khỏi màn hình của mọi người.
4.  Đồng bộ hóa diễn ra mượt mà, không cần refresh.
5.  Sử dụng Supabase Realtime subscriptions cho live updates.

### Story 3.2: Hiển thị Con trỏ của Người dùng khác

- **As a** user, **I want** to see the cursors of other users moving on the canvas, **so that** I know where they are focusing.
  **Acceptance Criteria:**

1.  Vị trí con trỏ của người dùng được gửi đến server.
2.  Những người dùng khác thấy một biểu tượng con trỏ di chuyển theo thời gian thực.
3.  Con trỏ biến mất khi người dùng không hoạt động.
4.  Cơ chế cập nhật được tối ưu hóa với debouncing (50ms).

## Epic 4: Performance Optimization và Security (Performance & Security)

**Mục tiêu Epic:** Đảm bảo hệ thống hoạt động mượt mà với nhiều người dùng và bảo vệ khỏi các hành vi lạm dụng.

### Story 4.1: Canvas Virtualization và Spatial Partitioning

- **As a** user, **I want** the canvas to remain smooth even with hundreds of nodes, **so that** I can work efficiently in large workspaces.
  **Acceptance Criteria:**

1.  Chỉ render nodes trong viewport hiện tại.
2.  Implement spatial indexing để query nodes hiệu quả.
3.  Level-of-detail rendering khi zoom out.
4.  Maintain 60 FPS với >1000 nodes.

### Story 4.2: Rate Limiting và Abuse Prevention

- **As a** system administrator, **I want** to prevent abuse and spam, **so that** the service remains available for legitimate users.
  **Acceptance Criteria:**

1.  Implement rate limiting theo IP address.
2.  File upload restrictions (size, type, frequency).
3.  Content sanitization cho text inputs.
4.  Automatic cleanup cho inactive sessions.
5.  Basic monitoring và alerting cho unusual activities.
