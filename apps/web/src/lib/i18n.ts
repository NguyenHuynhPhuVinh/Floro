import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import all translation files directly to avoid dynamic imports
import enCanvas from '../locales/en/canvas.json';
import enCommon from '../locales/en/common.json';
import enSettings from '../locales/en/settings.json';
import viCanvas from '../locales/vi/canvas.json';
import viCommon from '../locales/vi/common.json';
import viSettings from '../locales/vi/settings.json';

const resources = {
  vi: {
    common: viCommon,
    settings: viSettings,
    canvas: viCanvas,
  },
  en: {
    common: enCommon,
    settings: enSettings,
    canvas: enCanvas,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'vi', // Default language
  fallbackLng: 'vi',
  debug: false, // Disable debug in production

  interpolation: {
    escapeValue: false, // React already does escaping
  },

  defaultNS: 'common',
  ns: ['common', 'settings', 'canvas'],

  react: {
    useSuspense: false,
  },
});

export default i18n;
