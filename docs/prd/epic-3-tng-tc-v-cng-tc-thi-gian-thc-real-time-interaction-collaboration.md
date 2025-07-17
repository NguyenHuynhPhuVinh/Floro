# Epic 3: Tương tác và Cộng tác Thời gian thực (Real-time Interaction & Collaboration)

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
