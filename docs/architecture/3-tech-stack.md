# 3. Tech Stack

This table lists the technologies chosen for the Floro project. Development will adhere to the latest stable versions of these technologies.

| Category               | Technology                   | Purpose                                | Rationale                                                  |
| :--------------------- | :--------------------------- | :------------------------------------- | :--------------------------------------------------------- |
| **Language**           | TypeScript                   | Ngôn ngữ phát triển chính              | An toàn kiểu dữ liệu, dễ dàng chia sẻ types.               |
| **Frontend Framework** | Next.js 14+                  | Xây dựng giao diện người dùng          | Framework React mạnh mẽ, App Router, tích hợp Vercel.      |
| **Backend Service**    | Firebase                     | Backend-as-a-Service                   | Tối ưu cho real-time, cung cấp các dịch vụ cần thiết.      |
| **State Database**     | Cloud Firestore              | Lưu trữ metadata và trạng thái node    | NoSQL, real-time, truy vấn mạnh mẽ, khả năng mở rộng lớn.  |
| **Real-time Bus**      | Realtime Database            | Đồng bộ dữ liệu tần suất cao (con trỏ) | Độ trễ cực thấp, tối ưu chi phí cho các ghi đè liên tục.   |
| **File Storage**       | Firebase Storage             | Lưu trữ file                           | Tối ưu lưu trữ và phân phối file dung lượng lớn.           |
| **UI Library**         | Tailwind CSS                 | Styling                                | Xây dựng giao diện nhanh chóng và nhất quán.               |
| **UI Components**      | Shadcn/ui                    | Thư viện component                     | Cung cấp component đẹp, dễ tùy chỉnh, tái sử dụng.         |
| **State Management**   | Zustand                      | Quản lý trạng thái client              | Nhẹ, đơn giản, hiệu quả cho nhu cầu dự án.                 |
| **2D Canvas Library**  | Konva.js                     | Xử lý không gian 2D                    | Thư viện canvas hiệu suất cao, hỗ trợ tốt.                 |
| **Spatial Indexing**   | Custom Quadtree              | Tối ưu truy vấn không gian             | Hiệu suất cao cho viewport queries và collision detection. |
| **Error Handling**     | React Error Boundary         | Xử lý lỗi graceful                     | Ngăn crash toàn bộ app, user experience tốt hơn.           |
| **Performance**        | React.memo, useMemo          | Tối ưu re-rendering                    | Giảm unnecessary renders, cải thiện performance.           |
| **Testing**            | Jest & React Testing Library | Unit & Integration tests               | Bộ công cụ tiêu chuẩn trong hệ sinh thái React.            |
| **E2E Testing**        | Playwright                   | End-to-end testing                     | Modern, reliable, cross-browser testing.                   |
| **Monitoring**         | Vercel Analytics             | Performance monitoring                 | Built-in analytics, Core Web Vitals tracking.              |
| **Deployment**         | Vercel                       | Nền tảng hosting                       | Tích hợp CI/CD tự động, mạng lưới toàn cầu.                |
