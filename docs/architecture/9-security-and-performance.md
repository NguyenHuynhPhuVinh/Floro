# 9. Security and Performance

### 9.1 Security Requirements

- Triển khai Firebase Security Rules để kiểm soát việc đọc/ghi dữ liệu.
- Sử dụng Rate Limiting để chống spam.
- "Làm sạch" (sanitize) mọi nội dung do người dùng tạo ra để chống XSS.

### 9.2 Performance Optimization

- **Canvas Virtualization:** Chỉ render các node trong khung nhìn.
- **Level of Detail (LOD):** Render node với chi tiết thấp hơn khi zoom xa.
- **Lazy Loading:** Chỉ tải ảnh khi chúng xuất hiện trong khung nhìn.
- **Firestore Indexes:** Tối ưu hóa các truy vấn dựa trên vị trí.
