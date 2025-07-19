# 4. Technical Assumptions

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
