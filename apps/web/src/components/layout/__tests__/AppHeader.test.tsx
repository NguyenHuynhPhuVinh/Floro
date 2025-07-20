import { render, screen } from '@testing-library/react';
import React from 'react';

import { AppHeader } from '../AppHeader';

// Mock SettingsButton component
jest.mock('../SettingsButton', () => ({
  SettingsButton: (): React.JSX.Element => (
    <button data-testid="settings-button">Settings</button>
  ),
}));

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: (): object => ({
    t: (key: string): string => {
      const translations: Record<string, string> = {
        appTitle: 'Floro',
      };
      return translations[key] || key;
    },
    ready: true,
  }),
}));

describe('AppHeader', (): void => {
  it('renders with correct structure', (): void => {
    render(<AppHeader />);

    const header = screen.getByRole('banner');
    expect(header).toHaveClass(
      'bg-white',
      'border-b',
      'border-gray-200',
      'shadow-sm'
    );

    // Check flex container structure
    const container = header.firstChild;
    expect(container).toHaveClass(
      'flex',
      'items-center',
      'justify-between',
      'px-6',
      'py-3'
    );
  });

  it('displays Floro logo in center with i18n support', () => {
    render(<AppHeader />);

    const logo = screen.getByRole('heading', { level: 1 });
    expect(logo).toHaveTextContent('Floro');
    expect(logo).toHaveClass(
      'text-2xl',
      'font-bold',
      'text-gray-900',
      'dark:text-white',
      'tracking-wide'
    );
  });

  it('includes settings button on the right', () => {
    render(<AppHeader />);

    const settingsButton = screen.getByTestId('settings-button');
    expect(settingsButton).toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    const customClass = 'custom-header-class';

    render(<AppHeader className={customClass} />);

    const header = screen.getByRole('banner');
    expect(header).toHaveClass(customClass);
  });

  it('maintains proper layout with spacers for centering', () => {
    render(<AppHeader />);

    const header = screen.getByRole('banner');
    const container = header.firstChild as HTMLElement;
    const children = Array.from(container.children);

    // Should have 3 children: left spacer, center logo, right section
    expect(children).toHaveLength(3);

    // Check spacer classes
    expect(children[0]).toHaveClass('flex-1'); // Left spacer
    expect(children[2]).toHaveClass('flex-1', 'flex', 'justify-end'); // Right section
  });

  it('has proper semantic structure', () => {
    render(<AppHeader />);

    // Should be a header element
    const header = screen.getByRole('banner');
    expect(header.tagName).toBe('HEADER');

    // Should contain h1 for logo
    const logo = screen.getByRole('heading', { level: 1 });
    expect(logo.tagName).toBe('H1');
  });
});
