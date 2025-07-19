# Epic 3: Tương tác và Cộng tác Thời gian thực (Real-time Interaction & Collaboration)

**Mục tiêu Epic:** Kích hoạt cập nhật thời gian thực để tạo môi trường làm việc nhóm thực sự.

### Story 3.1: Đồng bộ hóa Trạng thái Không gian làm việc

- **As a** user, **I want** to see any changes made by other users appear on my screen instantly, **so that** we can collaborate seamlessly.
  **Acceptance Criteria:**

1.  Khi một node được tạo, nó xuất hiện cho mọi người.
2.  Khi một node được di chuyển, vị trí của nó được cập nhật cho mọi người.
3.  Khi một node bị xóa, nó biến mất khỏi màn hình của mọi người.
4.  Đồng bộ hóa diễn ra mượt mà, không cần refresh.
5.  Sử dụng cơ chế lắng nghe sự kiện của Firestore.

### Story 3.2: Hiển thị Con trỏ của Người dùng khác

- **As a** user, **I want** to see the cursors of other users moving on the canvas, **so that** I know where they are focusing.
  **Acceptance Criteria:**

1.  Vị trí con trỏ của người dùng được gửi đến server.
2.  Những người dùng khác thấy một biểu tượng con trỏ di chuyển theo thời gian thực.
3.  Con trỏ biến mất khi người dùng không hoạt động.
4.  Cơ chế cập nhật được tối ưu hóa với debouncing (50ms).
