# 3. User Interface Design Goals

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
