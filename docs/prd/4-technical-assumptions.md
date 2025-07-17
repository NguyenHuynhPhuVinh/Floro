# 4. Technical Assumptions

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
