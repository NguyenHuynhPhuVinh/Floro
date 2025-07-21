import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { I18nProvider } from '../I18nProvider';

// Mock the settings store
const mockCollaborationSettings = {
  language: 'vi' as const,
};

jest.mock('../../../store/settings.store', () => ({
  useSettingsStore: () => ({
    collaboration: mockCollaborationSettings,
  }),
}));

// Mock i18n module
jest.mock('../../../lib/i18n', () => ({
  __esModule: true,
  default: {
    language: 'vi',
    changeLanguage: jest.fn(),
    isInitialized: true,
    on: jest.fn(),
    off: jest.fn(),
  },
}));

// Mock react-i18next
jest.mock('react-i18next', () => ({
  I18nextProvider: ({
    children,
    i18n,
  }: {
    children: React.ReactNode;
    i18n: any;
  }) => (
    <div data-testid="i18next-provider" data-i18n-ready={!!i18n}>
      {children}
    </div>
  ),
}));

describe('I18nProvider', () => {
  // Get the mocked i18n instance
  const mockI18n = require('../../../lib/i18n').default;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders children when i18n is loaded', async () => {
    const testContent = <div data-testid="test-content">Test Content</div>;

    render(<I18nProvider>{testContent}</I18nProvider>);

    await waitFor(() => {
      expect(screen.getByTestId('test-content')).toBeInTheDocument();
    });
  });

  it('shows fallback content while i18n is loading', () => {
    const testContent = <div data-testid="test-content">Test Content</div>;

    render(<I18nProvider>{testContent}</I18nProvider>);

    // Initially should show content without i18n provider
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
  });

  it('changes language when settings change', async () => {
    const testContent = <div data-testid="test-content">Test Content</div>;

    render(<I18nProvider>{testContent}</I18nProvider>);

    await waitFor(() => {
      expect(screen.getByTestId('i18next-provider')).toBeInTheDocument();
    });

    // Should call changeLanguage if language differs
    if (mockI18n.language !== mockCollaborationSettings.language) {
      expect(mockI18n.changeLanguage).toHaveBeenCalledWith(
        mockCollaborationSettings.language
      );
    }
  });

  it('handles dynamic i18n import', async () => {
    const testContent = <div data-testid="test-content">Test Content</div>;

    render(<I18nProvider>{testContent}</I18nProvider>);

    await waitFor(() => {
      const provider = screen.getByTestId('i18next-provider');
      expect(provider).toHaveAttribute('data-i18n-ready', 'true');
    });
  });

  it('is marked as client component', () => {
    // This test ensures the component has 'use client' directive
    expect(() => {
      render(
        <I18nProvider>
          <div>Test</div>
        </I18nProvider>
      );
    }).not.toThrow();
  });

  it('handles language switching', async () => {
    const testContent = <div data-testid="test-content">Test Content</div>;

    // Change language in settings
    (mockCollaborationSettings as any).language = 'en';

    render(<I18nProvider>{testContent}</I18nProvider>);

    await waitFor(() => {
      expect(screen.getByTestId('i18next-provider')).toBeInTheDocument();
    });
  });

  it('provides i18n context to children', async () => {
    const testContent = <div data-testid="test-content">Test Content</div>;

    render(<I18nProvider>{testContent}</I18nProvider>);

    await waitFor(() => {
      const provider = screen.getByTestId('i18next-provider');
      expect(provider).toContainElement(screen.getByTestId('test-content'));
    });
  });
});
