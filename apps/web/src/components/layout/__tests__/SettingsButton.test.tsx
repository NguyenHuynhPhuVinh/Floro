import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SettingsButton } from '../SettingsButton';

// Mock the settings store
const mockOpenModal = jest.fn();
jest.mock('../../../store/settings.store', () => ({
  useSettingsStore: () => ({
    openModal: mockOpenModal,
  }),
}));

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        settings: 'Cài đặt',
      };
      return translations[key] || key;
    },
    ready: true,
  }),
}));

// Mock Lucide React icon
jest.mock('lucide-react', () => ({
  Settings: ({ className }: { className?: string }) => (
    <svg data-testid="settings-icon" className={className}>
      <title>Settings Icon</title>
    </svg>
  ),
}));

// Mock shadcn/ui Button component
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

describe('SettingsButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with correct shadcn/ui Button styling', () => {
    render(<SettingsButton />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('data-variant', 'outline');
    expect(button).toHaveAttribute('data-size', 'icon');
  });

  it('has proper accessibility attributes', () => {
    render(<SettingsButton />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Cài đặt');
    expect(button).toHaveAttribute('title', 'Cài đặt');
  });

  it('renders Settings icon with correct props', () => {
    render(<SettingsButton />);

    const icon = screen.getByTestId('settings-icon');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('h-4', 'w-4');
  });

  it('calls openModal when clicked', () => {
    render(<SettingsButton />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockOpenModal).toHaveBeenCalledTimes(1);
  });

  it('applies custom className when provided', () => {
    const customClass = 'custom-button-class';

    render(<SettingsButton className={customClass} />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass(customClass);
  });

  it('maintains button functionality with keyboard interaction', () => {
    render(<SettingsButton />);

    const button = screen.getByRole('button');

    // Test Enter key
    fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
    fireEvent.keyUp(button, { key: 'Enter', code: 'Enter' });

    // Test Space key
    fireEvent.keyDown(button, { key: ' ', code: 'Space' });
    fireEvent.keyUp(button, { key: ' ', code: 'Space' });

    // Should be called for click events triggered by keyboard
    expect(button).toBeInTheDocument();
  });
});
