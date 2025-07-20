# 3.1. UI Components Architecture

### 3.1.1 Canvas-Based Component System

The application uses a simplified approach focusing on core functionality with HTML5 Canvas for 2D rendering and React components for UI shell.

| Component Type          | Technology                          | Purpose                      | Implementation            |
| :---------------------- | :---------------------------------- | :--------------------------- | :------------------------ |
| **Canvas Components**   | HTML5 Canvas + React                | Node rendering, interactions | Native Canvas API         |
| **UI Shell Components** | React + Tailwind CSS                | Application layout, modals   | Traditional HTML/CSS      |
| **Icon System**         | Lucide React                        | Professional icons           | SVG-based, tree-shakeable |
| **Animation System**    | CSS transitions + Canvas animations | Smooth UX                    | Hardware-accelerated      |

### 3.1.2 Component Architecture Patterns

```typescript
// Canvas Component Pattern
interface CanvasComponentProps {
  x: number;
  y: number;
  scale: number;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  context: CanvasRenderingContext2D;
}

// UI Shell Component Pattern
interface UIComponentProps {
  className?: string;
  children?: React.ReactNode;
  variant?: "primary" | "secondary";
}
```

### 3.1.3 Icon System Architecture

- **File Type Icons**: Lucide icons with category-based mapping
- **Color Coding**: Semantic colors for different file categories
- **Canvas Rendering**: Icons rendered directly on canvas for performance
- **Caching**: Optimized icon caching and reuse strategies

### 3.1.4 Theme and Localization System

**Theme Management với next-themes:**

```typescript
// Theme Provider Configuration
interface ThemeProviderProps {
  attribute?: string;
  defaultTheme?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}

// Theme Hook Usage
const { theme, setTheme, systemTheme } = useTheme();

// Tailwind Dark Mode Classes
const themeClasses = {
  light: "bg-white text-gray-900",
  dark: "dark:bg-gray-900 dark:text-white",
  system: "bg-white dark:bg-gray-900 text-gray-900 dark:text-white",
};
```

**Internationalization với react-i18next:**

```typescript
// i18n Configuration
interface I18nConfig {
  lng: "vi" | "en";
  fallbackLng: "vi";
  defaultNS: "common";
  resources: {
    vi: {
      common: Record<string, string>;
      settings: Record<string, string>;
      canvas: Record<string, string>;
    };
    en: {
      common: Record<string, string>;
      settings: Record<string, string>;
      canvas: Record<string, string>;
    };
  };
}

// Translation Hook Usage
const { t, i18n } = useTranslation("settings");
const changeLanguage = (lng: string) => i18n.changeLanguage(lng);
```

**JSON-based Translation Structure:**

```typescript
// locales/vi/settings.json
{
  "title": "Cài đặt",
  "display": "Hiển thị",
  "canvas": "Canvas",
  "collaboration": "Cộng tác",
  "theme": {
    "label": "Giao diện",
    "light": "Sáng",
    "dark": "Tối",
    "system": "Hệ thống"
  },
  "language": {
    "label": "Ngôn ngữ",
    "vietnamese": "Tiếng Việt",
    "english": "Tiếng Anh"
  }
}
```
