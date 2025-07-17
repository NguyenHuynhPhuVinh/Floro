# Floro - Product Requirements Document (PRD)

## 1. Goals and Background Context

### 1.1 Goals

- Cung cấp một công cụ chia sẻ tức thì, hiệu quả và được yêu thích, giúp giải quyết các vấn đề cộng tác trong môi trường học tập CNTT.
- Xây dựng nền tảng kỹ thuật vững chắc trên Vercel và Firebase, cho phép mở rộng các tính năng cộng tác cao cấp trong tương lai một cách dễ dàng.
- Tối ưu hóa trải nghiệm người dùng, giảm thiểu mọi rào cản để việc chia sẻ tài nguyên học tập diễn ra một cách liền mạch và tức thời.
- Tạo ra một dự án mã nguồn mở, miễn phí và có giá trị cho cộng đồng.

### 1.2 Background Context

Trong các môi trường học tập và làm việc nhóm tốc độ cao, việc chia sẻ tài nguyên giữa các thành viên thường gặp nhiều trở ngại, từ việc phải đăng nhập vào các dịch vụ đám mây đến quản lý quyền truy cập phức tạp. Floro ra đời để giải quyết vấn đề này bằng cách cung cấp một không gian làm việc 2D trực quan, bền vững và truy cập công khai qua một đường link duy nhất. Giải pháp này loại bỏ hoàn toàn các bước không cần thiết, cho phép người dùng chia sẻ file, code, link và các nội dung khác một cách tức thì, biến việc cộng tác trở thành một trải nghiệm liền mạch và tự nhiên.

### 1.3 Change Log

| Date       | Version | Description       | Author    |
| :--------- | :------ | :---------------- | :-------- |
| 2024-05-24 | 1.0     | Initial PRD Draft | John (PM) |

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

- **NFR1:** **Công nghệ:** Dự án phải được xây dựng bằng Next.js (Frontend) và Firebase (Backend, Storage), và được host trên Vercel.
- **NFR2:** **Lưu trữ:** Tất cả các node được tạo ra phải được lưu trữ vĩnh viễn và không tự động bị xóa.
- **NFR3:** **Truy cập:** Hệ thống phải cho phép truy cập mà không yêu cầu người dùng đăng ký hoặc đăng nhập.
- **NFR4:** **Hiệu suất:**
  - Thời gian tải ban đầu của không gian làm việc phải dưới 3 giây trên kết nối mạng trung bình.
  - Các thao tác di chuyển, phóng to/thu nhỏ phải đạt được 60 FPS.
  - Độ trễ khi cập nhật real-time phải dưới 500ms.
- **NFR5:** **Bảo mật:** Mặc dù không có đăng nhập, hệ thống cần có cơ chế cơ bản để ngăn chặn các hành vi lạm dụng tự động (ví dụ: rate limiting).
- **NFR6:** **Mã nguồn mở:** Toàn bộ mã nguồn của dự án phải được công khai trên một nền tảng như GitHub.

## 3. User Interface Design Goals

### 3.1 Overall UX Vision (Tầm nhìn UX tổng thể)

Giao diện của Floro phải mang lại cảm giác **tức thì, trực quan và không bị cản trở**. Người dùng nên cảm thấy như họ đang làm việc trên một chiếc bảng trắng kỹ thuật số thông minh, nơi mọi thao tác đều diễn ra một cách tự nhiên. Trọng tâm là loại bỏ các bước thừa, cho phép người dùng tập trung vào nội dung thay vì phải học cách sử dụng công cụ.

### 3.2 Key Interaction Paradigms (Mô hình tương tác chính)

- **Kéo và thả (Drag-and-Drop):** Là hành động chính để đưa nội dung từ bên ngoài vào không gian làm việc.
- **Tương tác trực tiếp (Direct Manipulation):** Người dùng có thể trực tiếp nhấp và kéo các node để sắp xếp chúng.
- **Sao chép và dán (Copy-Paste):** Một cách cực nhanh để tạo ra các node văn bản, link và ảnh.
- **Điều hướng không gian (Spatial Navigation):** Dùng chuột hoặc trackpad để pan (giữ và kéo) và zoom (cuộn chuột/chụm ngón tay).

### 3.3 Core Screens and Views (Các màn hình và giao diện chính)

Do tính chất của ứng dụng, Floro chỉ có một màn hình chính duy nhất:

- **Không gian làm việc (The Canvas):** Đây là giao diện cốt lõi, chiếm gần như toàn bộ màn hình. Nó hiển thị tất cả các node và là nơi mọi tương tác diễn ra. Cần có các yếu tố giao diện tối giản, không gây xao nhãng, ví dụ như một thanh công cụ nhỏ hoặc các nút bấm ẩn hiện khi cần thiết.

### 3.4 Accessibility (Khả năng tiếp cận)

- **WCAG AA:** Hướng tới tiêu chuẩn WCAG 2.1 Mức AA. Các yếu tố như độ tương phản màu sắc, điều hướng bằng bàn phím (tab để di chuyển giữa các node), và văn bản thay thế cho hình ảnh cần được cân nhắc.

### 3.5 Branding (Thương hiệu)

- Phong cách thiết kế cần **sạch sẽ, tối giản và hiện đại**. Sử dụng màu sắc trung tính làm chủ đạo với một màu nhấn thương hiệu để làm nổi bật các yếu tố tương tác. Tránh các chi tiết trang trí không cần thiết.

### 3.6 Target Device and Platforms (Thiết bị và nền tảng mục tiêu)

- **Web Responsive:** Giao diện phải hoạt động tốt trên cả máy tính để bàn (desktop) và các thiết bị di động (máy tính bảng, điện thoại). Trên di động, các thao tác kéo-thả sẽ được thay thế bằng các cử chỉ chạm tương ứng.

## 4. Technical Assumptions

### 4.1 Repository Structure (Cấu trúc Repository)

- **Monorepo:** Dự án sẽ được quản lý trong một monorepo duy nhất. Cấu trúc này giúp dễ dàng chia sẻ code (ví dụ: các định nghĩa type TypeScript) giữa frontend và backend, đồng thời đơn giản hóa việc quản lý và triển khai.

### 4.2 Service Architecture (Kiến trúc Dịch vụ)

- **Serverless-oriented:** Kiến trúc sẽ ưu tiên sử dụng các dịch vụ serverless.
  - **Frontend (Next.js):** Sẽ được host trên Vercel.
  - **Backend:** Sẽ tận dụng tối đa hệ sinh thái Firebase, bao gồm:
    - **Cloud Firestore hoặc Realtime Database:** Dùng cho việc lưu trữ metadata của node và đồng bộ hóa trạng thái real-time.
    - **Firebase Storage:** Dùng để lưu trữ nội dung của các file được tải lên.
    - **Firebase Functions (nếu cần):** Dùng để xử lý các logic backend phức tạp hơn mà không thể thực hiện ở phía client.

### 4.3 Testing Requirements (Yêu cầu về Kiểm thử)

- **Unit Test là bắt buộc:** Tất cả các logic nghiệp vụ quan trọng và các hàm tiện ích phải có unit test đi kèm.
- **Integration Test:** Cần có các bài test tích hợp để kiểm tra sự tương tác giữa frontend và các dịch vụ của Firebase.
- **End-to-End (E2E) Test:** Sẽ được xem xét cho các luồng người dùng quan trọng sau giai đoạn MVP.

### 4.4 Additional Technical Assumptions and Requests (Các giả định và yêu cầu kỹ thuật khác)

- **Real-time Communication:** WebSocket sẽ là công nghệ nền tảng cho việc cập nhật real-time. Firestore/Realtime Database cung cấp sẵn tính năng này.
- **Frameworks & Libraries:** Việc lựa chọn các thư viện phụ (ví dụ: thư viện cho canvas 2D, quản lý state...) sẽ do Kiến trúc sư quyết định, nhưng phải ưu tiên các giải pháp nhẹ, hiệu suất cao và có cộng đồng hỗ trợ tốt.

## 5. Epic List

- **Epic 1: Nền tảng và Không gian làm việc cốt lõi (Foundation & Core Canvas)**

  - **Mục tiêu:** Thiết lập dự án, cơ sở hạ tầng trên Vercel/Firebase và triển khai các tính năng cơ bản nhất của không gian làm việc 2D (pan, zoom).

- **Epic 2: Quản lý Node Cơ bản (Basic Node Management)**

  - **Mục tiêu:** Cho phép người dùng tạo, di chuyển và xem các loại node khác nhau (File, Text, Link, Image) trên canvas.

- **Epic 3: Tương tác và Cộng tác Thời gian thực (Real-time Interaction & Collaboration)**

  - **Mục tiêu:** Kích hoạt tính năng cập nhật real-time cho tất cả người dùng và hiển thị con trỏ chuột của nhau.

- **Epic 4 (Post-MVP): Tổ chức Không gian Nâng cao (Advanced Spatial Organization)**

  - **Mục tiêu:** Giới thiệu các công cụ "Frame" để nhóm node và "Dây nối" để tạo liên kết ngữ cảnh.

- **Epic 5 (Post-MVP): Chỉnh sửa và Tương tác Nâng cao (Advanced Editing & Interactions)**
  - **Mục tiêu:** Cho phép người dùng chỉnh sửa trực tiếp nội dung trên các node và triển khai các tính năng như đồng bộ clipboard.

## Epic 1: Nền tảng và Không gian làm việc cốt lõi (Foundation & Core Canvas)

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

## Epic 2: Quản lý Node Cơ bản (Basic Node Management)

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

## Epic 3: Tương tác và Cộng tác Thời gian thực (Real-time Interaction & Collaboration)

**Mục tiêu Epic:** Kích hoạt các tính năng cập nhật theo thời gian thực để tất cả người dùng trong cùng một phiên có thể thấy hành động của nhau ngay lập tức, tạo ra một môi trường làm việc nhóm thực sự.

### Story 3.1: Đồng bộ hóa Trạng thái Không gian làm việc

- **As a** user,
- **I want** to see any changes made by other users appear on my screen instantly,
- **so that** we can collaborate seamlessly as if we are in the same room.

**Acceptance Criteria:**

1.  Khi một người dùng tạo một node mới, node đó phải xuất hiện trên màn hình của tất cả người dùng khác trong phiên.
2.  Khi một người dùng di chuyển một node, vị trí của node đó phải được cập nhật trên màn hình của tất cả người dùng khác.
3.  Khi một người dùng xóa một node (tính năng sẽ có sau này), node đó phải biến mất khỏi màn hình của tất cả người dùng khác.
4.  Việc đồng bộ hóa phải diễn ra mượt mà, không yêu cầu người dùng phải làm mới (refresh) trang.
5.  Hệ thống phải sử dụng cơ chế lắng nghe sự kiện (listeners) của Firestore/Realtime Database để nhận các cập nhật.

### Story 3.2: Hiển thị Con trỏ của Người dùng khác

- **As a** user,
- **I want** to see the cursors of other users moving around on the canvas,
- **so that** I know where they are focusing and can easily point to things during discussions.

**Acceptance Criteria:**

1.  Khi một người dùng di chuyển chuột trên không gian làm việc, vị trí con trỏ của họ (có thể kèm theo tên hoặc một mã định danh) sẽ được gửi đến server.
2.  Tất cả những người dùng khác trong phiên sẽ thấy một biểu tượng con trỏ đại diện di chuyển theo thời gian thực.
3.  Khi một người dùng không hoạt động hoặc rời khỏi trang, con trỏ của họ sẽ biến mất sau một khoảng thời gian ngắn.
4.  Cơ chế cập nhật vị trí con trỏ phải được tối ưu hóa để không gây quá tải cho hệ thống.
