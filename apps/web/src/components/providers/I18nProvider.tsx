'use client';

import React, { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';

import { useSettingsStore } from '../../store/settings.store';

interface I18nProviderProps {
  children: React.ReactNode;
}

export function I18nProvider({
  children,
}: I18nProviderProps): React.JSX.Element {
  const [i18n, setI18n] = useState<typeof import('i18next').default | null>(
    null
  );
  const { collaboration } = useSettingsStore();

  useEffect(() => {
    // Dynamic import to avoid SSR issues
    import('../../lib/i18n').then(i18nModule => {
      const i18nInstance = i18nModule.default;
      setI18n(i18nInstance);

      // Change language when settings change
      if (i18nInstance.language !== collaboration.language) {
        i18nInstance.changeLanguage(collaboration.language);
      }
    });
  }, [collaboration.language]);

  useEffect(() => {
    // Change language when settings change
    if (i18n && i18n.language !== collaboration.language) {
      i18n.changeLanguage(collaboration.language);
    }
  }, [collaboration.language, i18n]);

  // Don't render until i18n is loaded
  if (!i18n) {
    return <div>{children}</div>;
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
