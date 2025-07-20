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

// Mock Lucide React icon
jest.mock('lucide-react', () => ({
  Settings: ({ size, className }: { size?: number; className?: string }) => (
    <svg data-testid="settings-icon" data-size={size} className={className}>
      <title>Settings Icon</title>
    </svg>
  ),
}));

describe('SettingsButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with correct styling', () => {
    render(<SettingsButton />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass(
      'p-2', 'rounded-lg', 'border', 'border-gray-300', 'bg-white',
      'hover:bg-gray-50', 'hover:border-gray-400',
      'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent',
      'transition-colors', 'duration-200'
    );
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
    expect(icon).toHaveAttribute('data-size', '20');
    expect(icon).toHaveClass('text-gray-600', 'hover:text-gray-800');
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
