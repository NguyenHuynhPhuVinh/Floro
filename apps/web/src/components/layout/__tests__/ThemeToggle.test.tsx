import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from '../ThemeToggle';

// Mock next-themes
const mockSetTheme = jest.fn();
jest.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: mockSetTheme,
  }),
}));

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'canvas.theme': 'Giao diện',
        'canvas.themes.light': 'Sáng',
        'canvas.themes.dark': 'Tối',
        'canvas.themes.system': 'Theo hệ thống',
      };
      return translations[key] || key;
    },
    ready: true,
  }),
}));

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  Sun: ({ className }: { className?: string }) => (
    <svg data-testid="sun-icon" className={className}>
      <title>Sun Icon</title>
    </svg>
  ),
  Moon: ({ className }: { className?: string }) => (
    <svg data-testid="moon-icon" className={className}>
      <title>Moon Icon</title>
    </svg>
  ),
  Monitor: ({ className }: { className?: string }) => (
    <svg data-testid="monitor-icon" className={className}>
      <title>Monitor Icon</title>
    </svg>
  ),
}));

// Mock shadcn/ui components
jest.mock('../../ui/button', () => ({
  Button: ({ children, onClick, className, variant, size, ...props }: any) => (
    <button
      onClick={onClick}
      className={className}
      data-variant={variant}
      data-size={size}
      {...props}
    >
      {children}
    </button>
  ),
}));

jest.mock('../../ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: any) => (
    <div data-testid="dropdown-menu">{children}</div>
  ),
  DropdownMenuTrigger: ({ children, asChild }: any) =>
    asChild ? children : <div data-testid="dropdown-trigger">{children}</div>,
  DropdownMenuContent: ({ children }: any) => (
    <div data-testid="dropdown-content">{children}</div>
  ),
  DropdownMenuItem: ({ children, onClick }: any) => (
    <div data-testid="dropdown-item" onClick={onClick}>
      {children}
    </div>
  ),
}));

describe('ThemeToggle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders dropdown menu structure', () => {
    render(<ThemeToggle />);

    expect(screen.getByTestId('dropdown-menu')).toBeInTheDocument();
    expect(screen.getByTestId('dropdown-content')).toBeInTheDocument();
    expect(screen.getAllByTestId('dropdown-item')).toHaveLength(3);
  });

  it('renders current theme icon in trigger', () => {
    render(<ThemeToggle />);

    // Should show sun icon for light theme (there are multiple, so use getAllBy)
    const sunIcons = screen.getAllByTestId('sun-icon');
    expect(sunIcons.length).toBeGreaterThan(0);
    expect(sunIcons[0]).toBeInTheDocument();
  });

  it('renders all theme options in dropdown', () => {
    render(<ThemeToggle />);

    expect(screen.getByText('Sáng')).toBeInTheDocument();
    expect(screen.getByText('Tối')).toBeInTheDocument();
    expect(screen.getByText('Theo hệ thống')).toBeInTheDocument();
  });

  it('calls setTheme when dropdown item is clicked', () => {
    render(<ThemeToggle />);

    const dropdownItems = screen.getAllByTestId('dropdown-item');

    // Click dark theme (second item)
    fireEvent.click(dropdownItems[1]);
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('has proper trigger button', () => {
    render(<ThemeToggle />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('data-variant', 'outline');
    expect(button).toHaveAttribute('data-size', 'icon');
  });

  it('applies custom className when provided', () => {
    const customClass = 'custom-theme-toggle';

    render(<ThemeToggle className={customClass} />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass(customClass);
  });

  it('has proper accessibility attributes', () => {
    render(<ThemeToggle />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();

    // Check screen reader text
    expect(screen.getByText('Giao diện')).toBeInTheDocument();
  });

  it('shows all theme icons in dropdown items', () => {
    render(<ThemeToggle />);

    // All icons should be present (some may appear multiple times)
    expect(screen.getAllByTestId('sun-icon').length).toBeGreaterThan(0);
    expect(screen.getAllByTestId('moon-icon').length).toBeGreaterThan(0);
    expect(screen.getAllByTestId('monitor-icon').length).toBeGreaterThan(0);
  });

  it('handles theme switching correctly', () => {
    render(<ThemeToggle />);

    const dropdownItems = screen.getAllByTestId('dropdown-item');
    const themes = ['light', 'dark', 'system'];

    dropdownItems.forEach((item, index) => {
      fireEvent.click(item);
      expect(mockSetTheme).toHaveBeenCalledWith(themes[index]);
    });
  });
});
