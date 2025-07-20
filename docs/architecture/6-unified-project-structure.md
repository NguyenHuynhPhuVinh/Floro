# 6. Unified Project Structure

The project will use a monorepo structure managed by `pnpm workspaces`.

```plaintext
floro/
├── apps/
│   └── web/                            # Main Next.js application
│       ├── src/
│       │   ├── app/                    # Next.js App Router
│       │   ├── components/             # React components
│       │   │   ├── ui/                 # Shadcn/ui components
│       │   │   ├── canvas/             # Canvas-specific components
│       │   │   │   ├── CanvasContainer.tsx
│       │   │   │   ├── Canvas2D.tsx
│       │   │   │   ├── NodesRenderer.tsx
│       │   │   │   ├── CanvasDragDropHandler.tsx
│       │   │   │   └── CanvasBackground.tsx
│       │   │   ├── nodes/              # Node type components
│       │   │   │   ├── FileNode.tsx
│       │   │   │   ├── FileNodeIcon.tsx
│       │   │   │   ├── TextNode.tsx
│       │   │   │   ├── LinkNode.tsx
│       │   │   │   ├── ImageNode.tsx
│       │   │   │   └── FileUploadProgress.tsx
│       │   │   ├── layout/             # Application shell components
│       │   │   │   ├── AppLayout.tsx
│       │   │   │   ├── AppHeader.tsx
│       │   │   │   ├── SettingsModal.tsx
│       │   │   │   ├── SettingsButton.tsx
│       │   │   │   ├── CoordinateDisplay.tsx
│       │   │   │   ├── ThemeToggle.tsx
│       │   │   │   └── settings/
│       │   │   │       ├── DisplaySettings.tsx
│       │   │   │       ├── CanvasSettings.tsx
│       │   │   │       └── CollaborationSettings.tsx
│       │   │   ├── providers/          # Context providers
│       │   │   │   ├── ThemeProvider.tsx
│       │   │   │   ├── I18nProvider.tsx
│       │   │   │   └── ClientProviders.tsx
│       │   │   └── common/             # Shared components
│       │   ├── services/               # Supabase service layer
│       │   │   ├── core/               # Core services (supabase, node, storage)
│       │   │   ├── advanced/           # Advanced services (spatial, cache, performance)
│       │   │   └── utils/              # Service utilities
│       │   ├── hooks/                  # Custom React hooks
│       │   │   ├── canvas/             # Canvas-related hooks
│       │   │   │   ├── useCanvasPan.ts
│       │   │   │   ├── useCanvasZoom.ts
│       │   │   │   ├── useCanvasViewport.ts
│       │   │   │   └── useMousePosition.ts
│       │   │   ├── nodes/              # Node management hooks
│       │   │   │   ├── useNodes.ts
│       │   │   │   ├── useFileUpload.ts
│       │   │   │   ├── useFileDownload.ts
│       │   │   │   ├── useNodeDrag.ts
│       │   │   │   ├── useNodeSelection.ts
│       │   │   │   └── useClipboard.ts
│       │   │   ├── ui/                 # UI-related hooks
│       │   │   │   ├── useSettings.ts
│       │   │   │   └── useMousePosition.ts
│       │   │   └── realtime/           # Real-time data hooks
│       │   ├── store/                  # Zustand stores
│       │   │   ├── canvas.store.ts     # Canvas state (zoom, pan, viewport, UI)
│       │   │   ├── nodes.store.ts      # Node management state (selection, history)
│       │   │   ├── settings.store.ts   # Application settings state
│       │   │   └── realtime.store.ts   # Real-time collaboration state
│       │   ├── lib/                    # Utility libraries
│       │   │   ├── spatial/            # Quadtree and spatial indexing
│       │   │   ├── performance/        # Performance monitoring
│       │   │   ├── security/           # Input sanitization, validation
│       │   │   └── i18n.ts             # i18next configuration
│       │   ├── locales/                # Translation files
│       │   │   ├── vi/                 # Vietnamese translations
│       │   │   │   ├── common.json
│       │   │   │   ├── settings.json
│       │   │   │   └── canvas.json
│       │   │   └── en/                 # English translations
│       │   │       ├── common.json
│       │   │       ├── settings.json
│       │   │       └── canvas.json
│       │   └── types/                  # App-specific types
│       ├── package.json                # Web app dependencies
│       ├── next.config.js              # Next.js configuration
│       ├── tailwind.config.js          # Tailwind configuration
│       └── tsconfig.json               # TypeScript configuration
├── packages/
│   ├── shared-types/                   # Shared TypeScript types
│   │   ├── src/
│   │   │   └── index.ts                # Core type definitions
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── eslint-config/                  # Shared ESLint configuration
│       ├── index.js                    # ESLint rules
│       └── package.json
├── docs/                               # Project documentation
│   ├── architecture.md
│   └── prd.md
├── tests/                              # E2E tests (Playwright)
├── package.json                        # Root package.json
├── pnpm-workspace.yaml                 # Workspace configuration
├── pnpm-lock.yaml                      # Lock file
├── .gitignore
├── README.md
└── LICENSE
```
