# 6.2. Application Shell Architecture

### 6.2.1 Layout System (Epic 2.4)

The application uses a layered layout approach with clear separation between UI shell and canvas content.

```typescript
// Application Layout Structure
interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => (
  <div className="h-screen w-screen flex flex-col">
    {/* Header with Logo and Settings */}
    <AppHeader />

    {/* Main Canvas Area */}
    <main className="flex-1 relative overflow-hidden">{children}</main>

    {/* Floating UI Elements */}
    <CoordinateDisplay />
    <SettingsModal />
  </div>
);
```

### 6.2.2 Header Component Architecture

```typescript
interface AppHeaderProps {
  className?: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({ className }) => (
  <header className={`bg-white border-b border-gray-200 ${className}`}>
    <div className="flex items-center justify-between px-6 py-3">
      {/* Left: Navigation or breadcrumbs (future) */}
      <div className="flex-1" />

      {/* Center: Logo */}
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-gray-900">Floro</h1>
      </div>

      {/* Right: Settings and actions */}
      <div className="flex-1 flex justify-end">
        <SettingsButton />
      </div>
    </div>
  </header>
);
```

### 6.2.3 Settings System Architecture

```typescript
// Settings Modal Component
interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Settings Categories
interface SettingsCategory {
  id: string;
  title: string;
  icon: React.ComponentType;
  component: React.ComponentType<SettingsCategoryProps>;
}

const settingsCategories: SettingsCategory[] = [
  {
    id: "display",
    title: "Hiển thị",
    icon: Monitor,
    component: DisplaySettings,
  },
  {
    id: "canvas",
    title: "Canvas",
    icon: Grid,
    component: CanvasSettings,
  },
  {
    id: "collaboration",
    title: "Cộng tác",
    icon: Users,
    component: CollaborationSettings,
  },
];
```

### 6.2.4 Canvas Background System

```typescript
// Canvas Background Types
type CanvasBackgroundType = "none" | "grid" | "dots" | "lines";

interface CanvasBackgroundProps {
  type: CanvasBackgroundType;
  size: number;
  color: string;
  opacity: number;
  viewport: CanvasViewport;
}

// Background Rendering Strategies
const backgroundRenderers = {
  grid: (props: CanvasBackgroundProps) => <GridBackground {...props} />,
  dots: (props: CanvasBackgroundProps) => <DotsBackground {...props} />,
  lines: (props: CanvasBackgroundProps) => <LinesBackground {...props} />,
  none: () => null,
};
```

### 6.2.5 Coordinate Display System

```typescript
interface CoordinateDisplayProps {
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  showCanvasCoords: boolean;
  showMouseCoords: boolean;
  format: "decimal" | "integer";
}

const CoordinateDisplay: React.FC<CoordinateDisplayProps> = ({
  position,
  showCanvasCoords,
  showMouseCoords,
  format,
}) => {
  const { viewport } = useCanvasStore();
  const mousePosition = useMousePosition();

  return (
    <div
      className={`fixed ${positionClasses[position]} bg-black/75 text-white px-2 py-1 rounded text-xs font-mono`}
    >
      {showCanvasCoords && (
        <div>
          Canvas: {formatCoordinate(viewport.x, format)},{" "}
          {formatCoordinate(viewport.y, format)}
        </div>
      )}
      {showMouseCoords && (
        <div>
          Mouse: {formatCoordinate(mousePosition.x, format)},{" "}
          {formatCoordinate(mousePosition.y, format)}
        </div>
      )}
    </div>
  );
};
```
