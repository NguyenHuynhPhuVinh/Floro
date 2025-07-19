# 11. Coding Standards

### 11.1 TypeScript Standards

- **Strict Mode:** `strict` mode is mandatory. The `any` type is forbidden.
- **Type Safety:** All functions must have explicit return types
- **Interface Design:** Prefer interfaces over types for object shapes
- **Generic Usage:** Use generics for reusable components and utilities

### 11.2 Code Style and Formatting

- **Prettier:** Automatic code formatting with consistent configuration
- **ESLint:** Strict linting rules with custom rules for performance
- **Pre-commit Hooks:** Enforced via `husky` and `lint-staged`
- **Import Organization:** Absolute imports, grouped by type (external, internal, relative)

### 11.3 Naming Conventions

- **Components:** `PascalCase` (e.g., `CanvasNode`, `FileUploader`)
- **Hooks:** `camelCase` with `use` prefix (e.g., `useCanvasZoom`, `useNodeDrag`)
- **Services:** `camelCase` with `.service.ts` suffix
- **Constants:** `SCREAMING_SNAKE_CASE` for module-level constants
- **Files:** `kebab-case` for file names, `PascalCase` for component files

### 11.4 Architecture Principles

- **Separation of Concerns:** UI components are for presentation only
- **Single Responsibility:** Each module/function has one clear purpose
- **Dependency Injection:** Services injected via hooks, not imported directly
- **Error Boundaries:** Every major feature wrapped in error boundaries
- **Performance First:** Consider performance implications in every decision

### 11.5 Documentation Standards

- **JSDoc:** All public functions and complex logic must be documented
- **README:** Each package must have comprehensive README
- **Architecture Decision Records (ADRs):** Document major technical decisions
- **Code Comments:** Explain "why" not "what", focus on business logic
