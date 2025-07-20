'use client';

import React from 'react';
import { ThemeProvider } from './ThemeProvider';
import { I18nProvider } from './I18nProvider';

interface ClientProvidersProps {
  children: React.ReactNode;
}

/**
 * Client-side providers wrapper to avoid SSR issues
 */
export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <ThemeProvider>
      <I18nProvider>
        {children}
      </I18nProvider>
    </ThemeProvider>
  );
}
