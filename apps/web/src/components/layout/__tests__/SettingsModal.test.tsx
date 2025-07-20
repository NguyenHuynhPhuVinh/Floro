import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SettingsModal } from '../SettingsModal';

// Mock the settings store
const mockCloseModal = jest.fn();
const mockSetActiveCategory = jest.fn();
jest.mock('../../../store/settings.store', () => ({
  useSettingsStore: () => ({
    isModalOpen: true,
    activeCategory: 'display',
    closeModal: mockCloseModal,
    setActiveCategory: mockSetActiveCategory,
  }),
}));

// Mock the settings components
jest.mock('../settings/DisplaySettings', () => ({
  DisplaySettings: () => <div data-testid="display-settings">Display Settings</div>,
}));

jest.mock('../settings/CanvasSettings', () => ({
  CanvasSettings: () => <div data-testid="canvas-settings">Canvas Settings</div>,
}));

jest.mock('../settings/CollaborationSettings', () => ({
  CollaborationSettings: () => <div data-testid="collaboration-settings">Collaboration Settings</div>,
}));

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  X: () => <svg data-testid="close-icon">X</svg>,
  Monitor: () => <svg data-testid="monitor-icon">Monitor</svg>,
  Grid: () => <svg data-testid="grid-icon">Grid</svg>,
  Users: () => <svg data-testid="users-icon">Users</svg>,
}));

describe('SettingsModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders when modal is open', () => {
    render(<SettingsModal />);
    
    expect(screen.getByText('Cài đặt')).toBeInTheDocument();
    expect(screen.getByTestId('display-settings')).toBeInTheDocument();
  });

  it('does not render when modal is closed', () => {
    // Mock closed state
    jest.doMock('../../../store/settings.store', () => ({
      useSettingsStore: () => ({
        isModalOpen: false,
        activeCategory: 'display',
        closeModal: mockCloseModal,
        setActiveCategory: mockSetActiveCategory,
      }),
    }));

    const { container } = render(<SettingsModal />);
    expect(container.firstChild).toBeNull();
  });

  it('displays all settings categories in sidebar', () => {
    render(<SettingsModal />);
    
    expect(screen.getByText('Hiển thị')).toBeInTheDocument();
    expect(screen.getByText('Canvas')).toBeInTheDocument();
    expect(screen.getByText('Cộng tác')).toBeInTheDocument();
    
    // Check icons are rendered
    expect(screen.getByTestId('monitor-icon')).toBeInTheDocument();
    expect(screen.getByTestId('grid-icon')).toBeInTheDocument();
    expect(screen.getByTestId('users-icon')).toBeInTheDocument();
  });

  it('calls closeModal when close button is clicked', () => {
    render(<SettingsModal />);
    
    const closeButton = screen.getByLabelText('Đóng');
    fireEvent.click(closeButton);
    
    expect(mockCloseModal).toHaveBeenCalledTimes(1);
  });

  it('calls setActiveCategory when category button is clicked', () => {
    render(<SettingsModal />);
    
    const canvasButton = screen.getByText('Canvas');
    fireEvent.click(canvasButton);
    
    expect(mockSetActiveCategory).toHaveBeenCalledWith('canvas');
  });

  it('highlights active category', () => {
    render(<SettingsModal />);
    
    const displayButton = screen.getByText('Hiển thị');
    expect(displayButton).toHaveClass('bg-blue-100', 'text-blue-700', 'border-blue-200');
  });

  it('has proper modal structure and styling', () => {
    render(<SettingsModal />);
    
    // Check backdrop
    const backdrop = screen.getByText('Cài đặt').closest('.fixed');
    expect(backdrop).toHaveClass('inset-0', 'bg-black/50', 'flex', 'items-center', 'justify-center', 'z-50');
    
    // Check modal content
    const modal = screen.getByText('Cài đặt').closest('.bg-white');
    expect(modal).toHaveClass('bg-white', 'rounded-lg', 'shadow-xl', 'w-full', 'max-w-4xl');
  });

  it('has proper accessibility attributes', () => {
    render(<SettingsModal />);
    
    const closeButton = screen.getByLabelText('Đóng');
    expect(closeButton).toHaveAttribute('aria-label', 'Đóng');
    
    const modal = screen.getByRole('dialog', { hidden: true }) || screen.getByText('Cài đặt').closest('.bg-white');
    expect(modal).toBeInTheDocument();
  });
});
