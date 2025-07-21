'use client';

import React, { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';

import i18n from '../../lib/i18n';
import { useSettingsStore } from '../../store/settings.store';

interface I18nProviderProps {
  children: React.ReactNode;
}

export function I18nProvider({
  children,
}: I18nProviderProps): React.JSX.Element {
  const [isI18nReady, setIsI18nReady] = useState(false);
  const { collaboration } = useSettingsStore();

  useEffect(() => {
    // Initialize i18n and mark as ready
    if (i18n.isInitialized) {
      setIsI18nReady(true);
    } else {
      // Wait for i18n to be initialized
      i18n.on('initialized', () => {
        setIsI18nReady(true);
      });
    }

    return () => {
      i18n.off('initialized');
    };
  }, []);

  useEffect(() => {
    // Change language when settings change
    if (isI18nReady && i18n.language !== collaboration.language) {
      i18n.changeLanguage(collaboration.language);
    }
  }, [collaboration.language, isI18nReady]);

  // Always provide i18n instance, even if not ready yet
  // This prevents the "NO_I18NEXT_INSTANCE" error
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
