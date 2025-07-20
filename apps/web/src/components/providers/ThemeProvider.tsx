'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ComponentProps } from 'react';

type ThemeProviderProps = ComponentProps<typeof NextThemesProvider>;

export function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps): React.JSX.Element {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange={false}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
