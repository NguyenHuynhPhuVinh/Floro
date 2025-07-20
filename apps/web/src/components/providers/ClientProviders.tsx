'use client';

import React from 'react';

import { I18nProvider } from './I18nProvider';
import { ThemeProvider } from './ThemeProvider';

interface ClientProvidersProps {
  children: React.ReactNode;
}

/**
 * Client-side providers wrapper to avoid SSR issues
 */
export function ClientProviders({
  children,
}: ClientProvidersProps): React.JSX.Element {
  return (
    <ThemeProvider>
      <I18nProvider>{children}</I18nProvider>
    </ThemeProvider>
  );
}
