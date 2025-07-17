# 6. Unified Project Structure

```plaintext
floro/
├── apps/
│   └── web/                    # Ứng dụng Next.js
│       ├── src/
│       │   ├── app/            # App Router
│       │   ├── components/
│       │   │   ├── canvas/
│       │   │   └── nodes/
│       │   ├── services/
│       │   ├── hooks/
│       │   └── store/
│       └── ...
├── packages/
│   └── shared-types/           # Gói chứa types dùng chung
│       └── src/
│           └── index.ts
├── package.json
└── pnpm-workspace.yaml
```
