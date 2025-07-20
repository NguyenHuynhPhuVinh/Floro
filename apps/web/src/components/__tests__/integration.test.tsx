import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AppLayout } from '../layout/AppLayout';
import { ClientProviders } from '../providers/ClientProviders';

// Mock all the stores and hooks
jest.mock('../../store/settings.store', () => ({
  useSettingsStore: () => ({
    isModalOpen: false,
    activeCategory: 'display',
    openModal: jest.fn(),
    closeModal: jest.fn(),
    setActiveCategory: jest.fn(),
    display: {
      showCoordinates: true,
      showMouseCoords: true,
      showCanvasCoords: true,
      coordinateFormat: 'integer',
      coordinatePosition: 'bottom-left',
    },
    canvas: {
      backgroundType: 'grid',
      backgroundSize: 20,
      backgroundOpacity: 0.3,
    },
    collaboration: {
      language: 'vi',
    },
    updateDisplaySettings: jest.fn(),
    updateCanvasSettings: jest.fn(),
    updateCollaborationSettings: jest.fn(),
  }),
}));

jest.mock('../../store/canvas.store', () => ({
  useCanvasStore: () => ({
    viewport: { x: 0, y: 0, scale: 1 },
  }),
}));

jest.mock('../../hooks/ui/useMousePosition', () => ({
  useMousePosition: () => ({ x: 100, y: 200 }),
}));

// Mock next-themes
jest.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: jest.fn(),
  }),
}));

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        appTitle: 'Floro',
        settings: 'Cài đặt',
        'coordinates.mouse': 'Chuột',
        'coordinates.canvas': 'Canvas',
      };
      return translations[key] || key;
    },
    ready: true,
  }),
  I18nextProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="i18next-provider">{children}</div>
  ),
}));

// Mock i18n
jest.mock('../../lib/i18n', () => ({
  __esModule: true,
  default: {
    language: 'vi',
    changeLanguage: jest.fn(),
  },
}));

// Mock ThemeProvider
jest.mock('../providers/ThemeProvider', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="theme-provider">{children}</div>
  ),
}));

// Mock I18nProvider
jest.mock('../providers/I18nProvider', () => ({
  I18nProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="i18n-provider">{children}</div>
  ),
}));

describe('Integration Tests', () => {
  it('renders complete app layout with providers', async () => {
    const testContent = <div data-testid="test-content">App Content</div>;

    render(
      <ClientProviders>
        <AppLayout>{testContent}</AppLayout>
      </ClientProviders>
    );

    // Check theme provider is rendered
    expect(screen.getByTestId('theme-provider')).toBeInTheDocument();

    // Check app layout components
    expect(screen.getByText('Floro')).toBeInTheDocument();
    expect(screen.getByTestId('test-content')).toBeInTheDocument();

    // Check coordinate display
    await waitFor(() => {
      expect(screen.getByText(/Chuột: 100, 200/)).toBeInTheDocument();
      expect(screen.getByText(/Canvas: 0, 0/)).toBeInTheDocument();
    });
  });

  it('handles theme and language switching together', () => {
    render(
      <ClientProviders>
        <AppLayout>
          <div>Content</div>
        </AppLayout>
      </ClientProviders>
    );

    // Both theme and i18n should be working
    expect(screen.getByText('Floro')).toBeInTheDocument();
    expect(screen.getByTestId('theme-provider')).toBeInTheDocument();
    // I18n functionality is tested through aria-label
    expect(screen.getByLabelText('Cài đặt')).toBeInTheDocument();
  });

  it('maintains proper provider hierarchy', () => {
    render(
      <ClientProviders>
        <AppLayout>
          <div data-testid="app-content">Content</div>
        </AppLayout>
      </ClientProviders>
    );

    const themeProvider = screen.getByTestId('theme-provider');
    const appContent = screen.getByTestId('app-content');

    // Check hierarchy: ThemeProvider contains the app content
    expect(themeProvider).toContainElement(appContent);

    // Verify providers are working through functional tests
    expect(screen.getByText('Floro')).toBeInTheDocument(); // i18n working
    expect(themeProvider).toBeInTheDocument(); // theme provider working
  });

  it('handles settings modal integration', () => {
    render(
      <ClientProviders>
        <AppLayout>
          <div>Content</div>
        </AppLayout>
      </ClientProviders>
    );

    // Settings button should be present with proper aria-label
    const settingsButton = screen.getByLabelText('Cài đặt');
    expect(settingsButton).toBeInTheDocument();
    expect(settingsButton).toHaveAttribute('title', 'Cài đặt');

    // Button should be clickable
    expect(settingsButton).not.toBeDisabled();
  });

  it('renders all layout components with proper styling', () => {
    render(
      <ClientProviders>
        <AppLayout>
          <div data-testid="main-content">Main Content</div>
        </AppLayout>
      </ClientProviders>
    );

    // Check main layout structure
    const mainElement = screen.getByRole('main');
    expect(mainElement).toHaveClass('flex-1', 'relative', 'overflow-hidden');

    // Check header
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('bg-white', 'dark:bg-gray-800');

    // Check content is rendered
    expect(screen.getByTestId('main-content')).toBeInTheDocument();
  });

  it('handles coordinate display with proper formatting', async () => {
    render(
      <ClientProviders>
        <AppLayout>
          <div>Content</div>
        </AppLayout>
      </ClientProviders>
    );

    await waitFor(() => {
      // Check coordinate display with Vietnamese labels
      expect(screen.getByText(/Chuột: 100, 200/)).toBeInTheDocument();
      expect(screen.getByText(/Canvas: 0, 0/)).toBeInTheDocument();
    });
  });
});
