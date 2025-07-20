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
  Sun: ({ size }: { size?: number }) => (
    <svg data-testid="sun-icon" data-size={size}>
      <title>Sun Icon</title>
    </svg>
  ),
  Moon: ({ size }: { size?: number }) => (
    <svg data-testid="moon-icon" data-size={size}>
      <title>Moon Icon</title>
    </svg>
  ),
  Monitor: ({ size }: { size?: number }) => (
    <svg data-testid="monitor-icon" data-size={size}>
      <title>Monitor Icon</title>
    </svg>
  ),
}));

describe('ThemeToggle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders theme toggle with all options', () => {
    render(<ThemeToggle />);

    expect(screen.getByText('Giao diện:')).toBeInTheDocument();
    expect(screen.getByText('Sáng')).toBeInTheDocument();
    expect(screen.getByText('Tối')).toBeInTheDocument();
    expect(screen.getByText('Theo hệ thống')).toBeInTheDocument();
  });

  it('renders all theme icons', () => {
    render(<ThemeToggle />);

    expect(screen.getByTestId('sun-icon')).toBeInTheDocument();
    expect(screen.getByTestId('moon-icon')).toBeInTheDocument();
    expect(screen.getByTestId('monitor-icon')).toBeInTheDocument();
  });

  it('highlights active theme', () => {
    render(<ThemeToggle />);

    const lightButton = screen.getByText('Sáng').closest('button');
    expect(lightButton).toHaveClass('bg-blue-100', 'text-blue-700');
  });

  it('calls setTheme when theme button is clicked', () => {
    render(<ThemeToggle />);

    const darkButton = screen.getByText('Tối');
    fireEvent.click(darkButton);

    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('calls setTheme for system theme', () => {
    render(<ThemeToggle />);

    const systemButton = screen.getByText('Theo hệ thống');
    fireEvent.click(systemButton);

    expect(mockSetTheme).toHaveBeenCalledWith('system');
  });

  it('has proper button styling', () => {
    render(<ThemeToggle />);

    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toHaveClass(
        'px-3',
        'py-2',
        'text-sm',
        'font-medium',
        'transition-colors'
      );
    });
  });

  it('applies custom className when provided', () => {
    const customClass = 'custom-theme-toggle';

    render(<ThemeToggle className={customClass} />);

    const container = screen.getByText('Giao diện:').closest('div');
    expect(container).toHaveClass(customClass);
  });

  it('has proper accessibility attributes', () => {
    render(<ThemeToggle />);

    const lightButton = screen.getByText('Sáng').closest('button');
    expect(lightButton).toHaveAttribute('title', 'Sáng');
  });

  it('shows icons on all screen sizes', () => {
    render(<ThemeToggle />);

    // Icons should always be visible
    expect(screen.getByTestId('sun-icon')).toBeInTheDocument();
    expect(screen.getByTestId('moon-icon')).toBeInTheDocument();
    expect(screen.getByTestId('monitor-icon')).toBeInTheDocument();
  });

  it('handles theme switching correctly', () => {
    render(<ThemeToggle />);

    // Test all theme options
    const themes = ['light', 'dark', 'system'];
    const buttons = [
      screen.getByText('Sáng'),
      screen.getByText('Tối'),
      screen.getByText('Theo hệ thống'),
    ];

    buttons.forEach((button, index) => {
      fireEvent.click(button);
      expect(mockSetTheme).toHaveBeenCalledWith(themes[index]);
    });
  });
});
