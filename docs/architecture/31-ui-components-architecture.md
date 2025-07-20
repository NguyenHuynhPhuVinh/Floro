# 3.1. UI Components Architecture

### 3.1.1 Konva-Based Component System

The application uses a hybrid approach combining HTML components for UI shell and Konva components for canvas elements.

| Component Type          | Technology                         | Purpose                      | Implementation               |
| :---------------------- | :--------------------------------- | :--------------------------- | :--------------------------- |
| **Canvas Components**   | Konva.js + react-konva             | Node rendering, interactions | High-performance 2D graphics |
| **UI Shell Components** | React + Tailwind CSS               | Application layout, modals   | Traditional HTML/CSS         |
| **Icon System**         | Lucide React                       | Professional icons           | SVG-based, tree-shakeable    |
| **Animation System**    | Konva animations + CSS transitions | Smooth UX                    | Hardware-accelerated         |

### 3.1.2 Component Architecture Patterns

```typescript
// Canvas Component Pattern
interface KonvaComponentProps {
  x: number;
  y: number;
  scale: number;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
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
- **Scalable Rendering**: Vector-based icons that scale with canvas zoom
- **Performance**: Optimized icon caching and reuse

### 3.1.4 Theme and Localization System

```typescript
interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  typography: {
    fontFamily: string;
    fontSize: Record<string, number>;
  };
  spacing: Record<string, number>;
}

interface LocalizationConfig {
  language: "vi" | "en";
  messages: Record<string, string>;
  dateFormat: string;
  numberFormat: Intl.NumberFormatOptions;
}
```
