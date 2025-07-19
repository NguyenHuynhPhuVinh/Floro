# Epic 4: Performance Optimization và Security (Performance & Security)

**Mục tiêu Epic:** Đảm bảo hệ thống hoạt động mượt mà với nhiều người dùng và bảo vệ khỏi các hành vi lạm dụng.

### Story 4.1: Canvas Virtualization và Spatial Partitioning

- **As a** user, **I want** the canvas to remain smooth even with hundreds of nodes, **so that** I can work efficiently in large workspaces.
  **Acceptance Criteria:**

1.  Chỉ render nodes trong viewport hiện tại.
2.  Implement spatial indexing để query nodes hiệu quả.
3.  Level-of-detail rendering khi zoom out.
4.  Maintain 60 FPS với >1000 nodes.

### Story 4.2: Rate Limiting và Abuse Prevention

- **As a** system administrator, **I want** to prevent abuse and spam, **so that** the service remains available for legitimate users.
  **Acceptance Criteria:**

1.  Implement rate limiting theo IP address.
2.  File upload restrictions (size, type, frequency).
3.  Content sanitization cho text inputs.
4.  Automatic cleanup cho inactive sessions.
5.  Basic monitoring và alerting cho unusual activities.
