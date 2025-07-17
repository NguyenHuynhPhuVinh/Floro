# 8. Deployment Architecture

- **Frontend:** Host trên Vercel, kết nối với GitHub để CI/CD tự động.
- **Backend:** Sử dụng các dịch vụ của Firebase, triển khai Security Rules qua Firebase CLI.
- **Environments:** Development (local), Preview (cho mỗi PR), và Production (nhánh main).
