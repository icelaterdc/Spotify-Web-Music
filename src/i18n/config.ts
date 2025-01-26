import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    resources: {
      en: {
        translation: {
          welcome: 'Welcome to Lyra Music',
          login: 'Login with Spotify',
          search: 'Search',
          library: 'Your Library',
          playlists: 'Playlists',
          home: 'Home'
        }
      },
      tr: {
        translation: {
          welcome: 'Lyra Music\'e Hoş Geldiniz',
          login: 'Spotify ile Giriş Yap',
          search: 'Ara',
          library: 'Kütüphanen',
          playlists: 'Çalma Listeleri',
          home: 'Ana Sayfa'
        }
      }
      // Other languages will be added similarly
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;