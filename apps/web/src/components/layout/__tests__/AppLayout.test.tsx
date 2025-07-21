import React from 'react';
import { render, screen } from '@testing-library/react';
import { AppLayout } from '../AppLayout';

// Mock the child components
jest.mock('../AppHeader', () => ({
  AppHeader: () => <div data-testid="app-header">App Header</div>,
}));

jest.mock('../CoordinateDisplay', () => ({
  CoordinateDisplay: () => (
    <div data-testid="coordinate-display">Coordinate Display</div>
  ),
}));

jest.mock('../SettingsModal', () => ({
  SettingsModal: () => <div data-testid="settings-modal">Settings Modal</div>,
}));

// Mock cn utility function
jest.mock('../../../lib/utils', () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(' '),
}));

describe('AppLayout', () => {
  it('renders with correct structure', () => {
    const testContent = <div data-testid="test-content">Test Content</div>;

    render(<AppLayout>{testContent}</AppLayout>);

    // Check main layout structure with shadcn/ui classes
    const layoutContainer = screen.getByRole('main').parentElement;
    expect(layoutContainer).toHaveClass(
      'h-screen',
      'w-screen',
      'flex',
      'flex-col',
      'bg-background',
      'text-foreground',
      'transition-colors',
      'duration-300'
    );

    // Check that all components are rendered
    expect(screen.getByTestId('app-header')).toBeInTheDocument();
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
    expect(screen.getByTestId('coordinate-display')).toBeInTheDocument();
    expect(screen.getByTestId('settings-modal')).toBeInTheDocument();
  });

  it('renders children in main content area', () => {
    const testContent = <div data-testid="test-content">Test Content</div>;

    render(<AppLayout>{testContent}</AppLayout>);

    const mainElement = screen.getByRole('main');
    expect(mainElement).toHaveClass('flex-1', 'relative', 'overflow-hidden');
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    const customClass = 'custom-layout-class';

    render(
      <AppLayout className={customClass}>
        <div>Content</div>
      </AppLayout>
    );

    const layoutContainer = screen.getByRole('main').parentElement;
    expect(layoutContainer).toHaveClass(customClass);
  });

  it('maintains proper layout hierarchy', () => {
    render(
      <AppLayout>
        <div data-testid="content">Content</div>
      </AppLayout>
    );

    const layoutContainer = screen.getByRole('main').parentElement;
    const children = Array.from(layoutContainer?.children || []);

    // Should have header, main, coordinate display, and settings modal
    expect(children).toHaveLength(4);

    // Check order: header first, main second
    expect(children[0]).toContainElement(screen.getByTestId('app-header'));
    expect(children[1]).toBe(screen.getByRole('main'));
  });
});
