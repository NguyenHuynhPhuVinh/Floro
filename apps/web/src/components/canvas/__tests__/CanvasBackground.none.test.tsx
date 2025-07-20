import React from 'react';
import { render } from '@testing-library/react';
import { CanvasBackground } from '../CanvasBackground';

// Mock the settings store with 'none' background type
const mockCanvasSettings = {
  backgroundType: 'none' as const,
  backgroundSize: 20,
  backgroundOpacity: 0.3,
};

jest.mock('../../../store/settings.store', () => ({
  useSettingsStore: () => ({
    canvas: mockCanvasSettings,
  }),
}));

// Mock next-themes
jest.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
  }),
}));

// Mock the canvas store
const mockViewport = {
  x: 0,
  y: 0,
  scale: 1,
};

jest.mock('../../../store/canvas.store', () => ({
  useCanvasStore: () => ({
    viewport: mockViewport,
  }),
}));

// Mock background components
jest.mock('../GridBackground', () => ({
  GridBackground: () => (
    <div data-testid="grid-background">Grid Background</div>
  ),
}));

jest.mock('../DotsBackground', () => ({
  DotsBackground: () => (
    <div data-testid="dots-background">Dots Background</div>
  ),
}));

describe('CanvasBackground with none type', () => {
  it('does not render when background type is none', () => {
    const { container } = render(<CanvasBackground />);
    expect(container.firstChild).toBeNull();
  });

  it('returns null early when backgroundType is none', () => {
    const { container } = render(<CanvasBackground />);

    // Should not render any background components
    expect(
      container.querySelector('[data-testid="grid-background"]')
    ).toBeNull();
    expect(
      container.querySelector('[data-testid="dots-background"]')
    ).toBeNull();

    // Container should be empty (component returns null)
    expect(container.innerHTML).toBe('');
  });
});
