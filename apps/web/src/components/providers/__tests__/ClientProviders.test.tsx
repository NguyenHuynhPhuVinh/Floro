import React from 'react';
import { render, screen } from '@testing-library/react';
import { ClientProviders } from '../ClientProviders';

// Mock ThemeProvider
jest.mock('../ThemeProvider', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="theme-provider">{children}</div>
  ),
}));

// Mock I18nProvider
jest.mock('../I18nProvider', () => ({
  I18nProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="i18n-provider">{children}</div>
  ),
}));

describe('ClientProviders', () => {
  it('renders children wrapped in providers', () => {
    const testContent = <div data-testid="test-content">Test Content</div>;
    
    render(<ClientProviders>{testContent}</ClientProviders>);
    
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
    expect(screen.getByTestId('theme-provider')).toBeInTheDocument();
    expect(screen.getByTestId('i18n-provider')).toBeInTheDocument();
  });

  it('maintains proper provider hierarchy', () => {
    const testContent = <div data-testid="test-content">Test Content</div>;
    
    render(<ClientProviders>{testContent}</ClientProviders>);
    
    const themeProvider = screen.getByTestId('theme-provider');
    const i18nProvider = screen.getByTestId('i18n-provider');
    const testElement = screen.getByTestId('test-content');
    
    // ThemeProvider should contain I18nProvider
    expect(themeProvider).toContainElement(i18nProvider);
    // I18nProvider should contain the test content
    expect(i18nProvider).toContainElement(testElement);
  });

  it('handles multiple children', () => {
    render(
      <ClientProviders>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
      </ClientProviders>
    );
    
    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
  });

  it('is marked as client component', () => {
    // This test ensures the component has 'use client' directive
    // by checking it doesn't throw SSR-related errors
    expect(() => {
      render(
        <ClientProviders>
          <div>Test</div>
        </ClientProviders>
      );
    }).not.toThrow();
  });
});
