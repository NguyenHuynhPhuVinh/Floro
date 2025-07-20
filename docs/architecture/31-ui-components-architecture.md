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
