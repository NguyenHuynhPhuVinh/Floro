# 3. Tech Stack

### 3.1 Technology Stack Table

| Category               | Technology                   | Version | Purpose                        | Rationale                                                                                     |
| :--------------------- | :--------------------------- | :------ | :----------------------------- | :-------------------------------------------------------------------------------------------- |
| **Language**           | TypeScript                   | `~5.x`  | Ngôn ngữ phát triển chính      | An toàn kiểu dữ liệu, dễ dàng chia sẻ types giữa các gói trong monorepo.                      |
| **Frontend Framework** | Next.js                      | `~14.x` | Xây dựng giao diện người dùng  | Framework React mạnh mẽ, tích hợp tốt với Vercel, hỗ trợ SSR/SSG.                             |
| **Backend Service**    | Firebase                     | `~10.x` | Backend-as-a-Service           | Cung cấp Firestore, Storage, và Functions, tối ưu cho real-time và chi phí.                   |
| **Database**           | Cloud Firestore              | N/A     | Lưu trữ metadata và trạng thái | Cơ sở dữ liệu NoSQL, real-time, có khả năng mở rộng tốt và tích hợp sâu với Firebase.         |
| **File Storage**       | Firebase Storage             | N/A     | Lưu trữ file                   | Tối ưu hóa cho việc lưu trữ và phân phối file dung lượng lớn, bảo mật và hiệu quả.            |
| **UI Library**         | Tailwind CSS                 | `~3.x`  | Styling                        | Cung cấp các lớp tiện ích (utility classes) giúp xây dựng giao diện nhanh chóng và nhất quán. |
| **UI Components**      | Shadcn/ui                    | Latest  | Thư viện component             | Cung cấp các component có thể tái sử dụng, đẹp và dễ tùy chỉnh, xây dựng trên Tailwind.       |
| **State Management**   | Zustand                      | `~4.x`  | Quản lý trạng thái client      | Nhẹ, đơn giản, hiệu quả hơn so với Redux cho các nhu cầu của dự án này.                       |
| **2D Canvas Library**  | Konva.js                     | `~9.x`  | Xử lý không gian 2D            | Thư viện canvas hiệu suất cao, hỗ trợ tốt cho các đối tượng, lớp và sự kiện phức tạp.         |
| **Testing**            | Jest & React Testing Library | Latest  | Unit & Integration tests       | Bộ công cụ tiêu chuẩn trong hệ sinh thái React để kiểm thử component và logic.                |
| **Deployment**         | Vercel                       | N/A     | Nền tảng hosting               | Tích hợp liền mạch với Next.js, cung cấp CI/CD tự động và mạng lưới toàn cầu.                 |
