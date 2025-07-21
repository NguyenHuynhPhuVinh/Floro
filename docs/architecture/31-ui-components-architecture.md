# 3.1. UI Components Architecture

### 3.1.1 shadcn/ui Component System

The application uses shadcn/ui as the primary component library, providing a modern, accessible, and customizable foundation built on Radix UI primitives.

| Component Type          | Technology                         | Purpose                      | Implementation            |
| :---------------------- | :--------------------------------- | :--------------------------- | :------------------------ |
| **Canvas Components**   | HTML5 Canvas + React               | Node rendering, interactions | Native Canvas API         |
| **UI Shell Components** | shadcn/ui + Tailwind CSS           | Application layout, modals   | Radix UI + custom styling |
| **Form Components**     | shadcn/ui (Button, Input, Select)  | User interactions            | Accessible, keyboard nav  |
| **Layout Components**   | shadcn/ui (Dialog, Sheet, Popover) | Overlays and containers      | Portal-based, focus mgmt  |
| **Icon System**         | Lucide React                       | Professional icons           | SVG-based, tree-shakeable |
| **Animation System**    | CSS transitions + Framer Motion    | Smooth UX                    | Hardware-accelerated      |

### 3.1.2 shadcn/ui Integration Architecture

**Component Installation Strategy for Tailwind v4:**

```bash
# Initialize shadcn/ui with Tailwind v4 support
npx shadcn@latest init --tailwind-v4

# Core components for Story 2.4
npx shadcn@latest add button
npx shadcn@latest add dialog
npx shadcn@latest add select
npx shadcn@latest add switch
npx shadcn@latest add tabs
npx shadcn@latest add tooltip
npx shadcn@latest add dropdown-menu
npx shadcn@latest add separator
```

**Tailwind CSS v4 Configuration for shadcn/ui:**

```css
/* app/globals.css - Tailwind v4 with @theme directive */
@import "tailwindcss";

@theme {
  --color-border: oklch(0.2 0 0);
  --color-input: oklch(0.2 0 0);
  --color-ring: oklch(0.2 0 0);
  --color-background: oklch(1 0 0);
  --color-foreground: oklch(0.09 0 0);
  --color-primary: oklch(0.09 0 0);
  --color-primary-foreground: oklch(0.98 0 0);
  --color-secondary: oklch(0.96 0 0);
  --color-secondary-foreground: oklch(0.09 0 0);
  /* ... other shadcn/ui color variables in OKLCH */
}

/* Dark mode using class-based approach */
.dark {
  --color-border: oklch(0.27 0 0);
  --color-input: oklch(0.27 0 0);
  --color-ring: oklch(0.83 0 0);
  --color-background: oklch(0.09 0 0);
  --color-foreground: oklch(0.98 0 0);
  --color-primary: oklch(0.98 0 0);
  --color-primary-foreground: oklch(0.09 0 0);
  --color-secondary: oklch(0.15 0 0);
  --color-secondary-foreground: oklch(0.98 0 0);
  /* ... other dark mode colors in OKLCH */
}
```

**No tailwind.config.js needed** - Tailwind v4 uses CSS-based configuration with the `@theme` directive.

### 3.1.3 Component Architecture Patterns

**shadcn/ui Component Patterns:**

```typescript
// shadcn/ui Button Component Usage
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Settings Button with shadcn/ui
const SettingsButton: React.FC = () => {
  return (
    <Button variant="outline" size="icon">
      <Settings className="h-4 w-4" />
    </Button>
  );
};

// Settings Modal with shadcn/ui Dialog
const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("settings.title")}</DialogTitle>
        </DialogHeader>
        {/* Settings content */}
      </DialogContent>
    </Dialog>
  );
};
```

**Canvas Component Pattern (unchanged):**

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
```

**Tailwind v4 + shadcn/ui Integration:**

```css
/* Tailwind v4 @theme directive replaces traditional CSS variables */
@theme {
  /* Light mode colors in OKLCH format */
  --color-background: oklch(1 0 0);
  --color-foreground: oklch(0.09 0 0);
  --color-primary: oklch(0.09 0 0);
  --color-primary-foreground: oklch(0.98 0 0);
  /* ... other colors */
}

/* Dark mode using class-based approach */
.dark {
  --color-background: oklch(0.09 0 0);
  --color-foreground: oklch(0.98 0 0);
  --color-primary: oklch(0.98 0 0);
  --color-primary-foreground: oklch(0.09 0 0);
  /* ... other dark mode colors */
}

/* Usage in components - same as before */
.bg-background {
  background-color: var(--color-background);
}
.text-foreground {
  color: var(--color-foreground);
}
```

### 3.1.4 Icon System Architecture

- **File Type Icons**: Lucide icons with category-based mapping
- **Color Coding**: Semantic colors for different file categories
- **Canvas Rendering**: Icons rendered directly on canvas for performance
- **Caching**: Optimized icon caching and reuse strategies
- **shadcn/ui Integration**: Consistent icon sizing and styling with shadcn/ui components

### 3.1.5 Theme and Localization System

**Theme Management với next-themes + Tailwind v4:**

```typescript
// Theme Provider Configuration for Tailwind v4 class-based theming
interface ThemeProviderProps {
  attribute: "class"; // Always use class for Tailwind v4
  defaultTheme?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}

// Theme Hook Usage with class-based approach
const { theme, setTheme, systemTheme } = useTheme();

// Tailwind v4 Theme Classes (class-based, no CSS variables needed)
const themeClasses = {
  light: "bg-background text-foreground",
  dark: "bg-background text-foreground", // .dark class handles the styling
  system: "bg-background text-foreground",
};

// shadcn/ui Theme Toggle Component for Tailwind v4
const ThemeToggle: React.FC = () => {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          {t("theme.light")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          {t("theme.dark")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          {t("theme.system")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
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
