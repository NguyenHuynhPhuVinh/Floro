# 6.2. Application Shell Architecture

### 6.2.1 Layout System (Epic 2.3)

The application uses a layered layout approach with clear separation between UI shell and canvas content.

```typescript
// Application Layout Structure
interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => (
  <div className="h-screen w-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
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

const AppHeader: React.FC<AppHeaderProps> = ({ className }) => {
  const { t } = useTranslation("common");

  return (
    <header
      className={`bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 ${className}`}
    >
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left: Navigation or breadcrumbs (future) */}
        <div className="flex-1" />

        {/* Center: Logo */}
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t("appTitle", "Floro")}
          </h1>
        </div>

        {/* Right: Settings and actions */}
        <div className="flex-1 flex justify-end space-x-2">
          <ThemeToggle />
          <SettingsButton />
        </div>
      </div>
    </header>
  );
};
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

// Settings categories with i18n support
const useSettingsCategories = () => {
  const { t } = useTranslation("settings");

  return [
    {
      id: "display",
      title: t("display"),
      icon: Monitor,
      component: DisplaySettings,
    },
    {
      id: "canvas",
      title: t("canvas"),
      icon: Grid,
      component: CanvasSettings,
    },
    {
      id: "collaboration",
      title: t("collaboration"),
      icon: Users,
      component: CollaborationSettings,
    },
  ];
};
```

### 6.2.4 Canvas Background System

```typescript
// Canvas Background Types
type CanvasBackgroundType = "none" | "grid" | "dots";

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
  const { t } = useTranslation("canvas");

  return (
    <div
      className={`fixed ${positionClasses[position]} bg-black/75 dark:bg-gray-800/90 text-white px-2 py-1 rounded text-xs font-mono`}
    >
      {showCanvasCoords && (
        <div>
          {t("coordinates.canvas")}: {formatCoordinate(viewport.x, format)},{" "}
          {formatCoordinate(viewport.y, format)}
        </div>
      )}
      {showMouseCoords && (
        <div>
          {t("coordinates.mouse")}: {formatCoordinate(mousePosition.x, format)},{" "}
          {formatCoordinate(mousePosition.y, format)}
        </div>
      )}
    </div>
  );
};
```

### 6.2.6 Provider Architecture

**Theme Provider Setup for Tailwind v4:**

```typescript
// components/providers/ThemeProvider.tsx
import { ThemeProvider as NextThemesProvider } from "next-themes";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => (
  <NextThemesProvider
    attribute="class" // Required for Tailwind v4 class-based theming
    defaultTheme="system"
    enableSystem
    disableTransitionOnChange={false}
  >
    {children}
  </NextThemesProvider>
);
```

**I18n Provider Setup:**

```typescript
// components/providers/I18nProvider.tsx
import { I18nextProvider } from "react-i18next";
import i18n from "@/lib/i18n";

interface I18nProviderProps {
  children: React.ReactNode;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => (
  <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
);
```

**Client Providers Wrapper:**

```typescript
// components/providers/ClientProviders.tsx
"use client";

interface ClientProvidersProps {
  children: React.ReactNode;
}

export const ClientProviders: React.FC<ClientProvidersProps> = ({
  children,
}) => (
  <ThemeProvider>
    <I18nProvider>{children}</I18nProvider>
  </ThemeProvider>
);
```

**Theme Toggle Component:**

```typescript
// components/layout/ThemeToggle.tsx
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation("settings");

  return (
    <select
      value={theme}
      onChange={(e) => setTheme(e.target.value)}
      className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-2 py-1"
    >
      <option value="light">{t("theme.light")}</option>
      <option value="dark">{t("theme.dark")}</option>
      <option value="system">{t("theme.system")}</option>
    </select>
  );
};
```
