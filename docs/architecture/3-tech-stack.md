# 3. Tech Stack

This table lists the technologies chosen for the Floro project. Development will adhere to the latest stable versions of these technologies.

| Category                 | Technology                     | Purpose                             | Rationale                                                                |
| :----------------------- | :----------------------------- | :---------------------------------- | :----------------------------------------------------------------------- |
| **Language**             | TypeScript                     | Ngôn ngữ phát triển chính           | An toàn kiểu dữ liệu, dễ dàng chia sẻ types.                             |
| **Frontend Framework**   | Next.js 14+                    | Xây dựng giao diện người dùng       | Framework React mạnh mẽ, App Router, tích hợp Vercel.                    |
| **Backend Service**      | Supabase                       | Backend-as-a-Service                | Open source, PostgreSQL, real-time, tích hợp đầy đủ.                     |
| **Database**             | Supabase Database (PostgreSQL) | Lưu trữ metadata và trạng thái node | SQL database mạnh mẽ, ACID compliance, complex queries.                  |
| **Real-time Engine**     | Supabase Realtime              | Đồng bộ dữ liệu real-time           | WebSocket-based, low latency, built-in subscriptions.                    |
| **File Storage**         | Supabase Storage               | Lưu trữ file                        | S3-compatible, CDN tích hợp, policy-based access control.                |
| **Authentication**       | Supabase Auth                  | Xác thực người dùng (future)        | Multiple providers, JWT tokens, row-level security.                      |
| **UI Library**           | Tailwind CSS v4                | Styling framework                   | CSS-based config, @theme directive, OKLCH colors, class-based dark mode. |
| **UI Components**        | shadcn/ui                      | Component library                   | Modern, accessible, customizable components built on Radix UI.           |
| **Component Base**       | Radix UI                       | Headless UI primitives              | Accessible, unstyled components with full keyboard navigation.           |
| **State Management**     | Zustand                        | Quản lý trạng thái client           | Nhẹ, đơn giản, hiệu quả cho nhu cầu dự án.                               |
| **Theme Management**     | next-themes                    | Quản lý theme và dark mode          | Professional theme switching, SSR-safe, Tailwind integration.            |
| **Internationalization** | react-i18next                  | Hệ thống đa ngôn ngữ                | Industry-standard i18n, JSON-based translations, namespace support.      |
| **2D Canvas Library**    | HTML5 Canvas + React           | Xử lý không gian 2D                 | Canvas API native, tích hợp tốt với React ecosystem.                     |
| **Spatial Indexing**     | Custom Quadtree                | Tối ưu truy vấn không gian          | Hiệu suất cao cho viewport queries và collision detection.               |
| **Error Handling**       | React Error Boundary           | Xử lý lỗi graceful                  | Ngăn crash toàn bộ app, user experience tốt hơn.                         |
| **Performance**          | React.memo, useMemo            | Tối ưu re-rendering                 | Giảm unnecessary renders, cải thiện performance.                         |
| **Testing**              | Jest & React Testing Library   | Unit & Integration tests            | Bộ công cụ tiêu chuẩn trong hệ sinh thái React.                          |
| **E2E Testing**          | Playwright                     | End-to-end testing                  | Modern, reliable, cross-browser testing.                                 |
| **Monitoring**           | Vercel Analytics               | Performance monitoring              | Built-in analytics, Core Web Vitals tracking.                            |
| **Deployment**           | Vercel                         | Nền tảng hosting                    | Tích hợp CI/CD tự động, mạng lưới toàn cầu.                              |
