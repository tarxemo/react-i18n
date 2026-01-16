# @tarxemo/react-i18n

[![npm version](https://img.shields.io/npm/v/@tarxemo/react-i18n.svg)](https://www.npmjs.com/package/@tarxemo/react-i18n)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A lightweight React wrapper for i18next with automatic language detection, localStorage persistence, and intelligent language normalization.

## Features

✅ **i18next Integration** - Works seamlessly with i18next and react-i18next  
✅ **Language Persistence** - Saves language preference to localStorage  
✅ **Smart Normalization** - Handles language codes intelligently (en-US → en)  
✅ **HTML Lang Attribute** - Automatically updates `<html lang="...">`  
✅ **TypeScript Support** - Full type definitions  
✅ **SSR Safe** - Compatible with server-side rendering  
✅ **Zero Config** - Works out of the box with sensible defaults

## Installation

```bash
npm install @tarxemo/react-i18n i18next react-i18next
```

### Peer Dependencies

```bash
npm install react react-dom i18next react-i18next
```

## Quick Start

### 1. Setup i18next

```tsx
// i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          welcome: "Welcome",
          hello: "Hello {{name}}"
        }
      },
      es: {
        translation: {
          welcome: "Bienvenido",
          hello: "Hola {{name}}"
        }
      },
      fr: {
        translation: {
          welcome: "Bienvenue",
          hello: "Bonjour {{name}}"
        }
      }
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
```

### 2. Wrap Your App

```tsx
import { LocaleProvider } from '@tarxemo/react-i18n';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <LocaleProvider
        i18n={i18n}
        supportedLanguages={['en', 'es', 'fr']}
        fallbackLanguage="en"
      >
        {/* Your app */}
      </LocaleProvider>
    </I18nextProvider>
  );
}
```

### 3. Use Translations

```tsx
import { useTranslation } from 'react-i18next';
import { useLocale } from '@tarxemo/react-i18n';

function Component() {
  const { t } = useTranslation();
  const { language, setLanguage, supportedLanguages } = useLocale();
  
  return (
    <div>
      <h1>{t('welcome')}</h1>
      <p>{t('hello', { name: 'John' })}</p>
      
      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        {supportedLanguages.map(lng => (
          <option key={lng} value={lng}>{lng.toUpperCase()}</option>
        ))}
      </select>
    </div>
  );
}
```

## API Reference

### LocaleProvider

```tsx
interface LocaleProviderProps {
  children: React.ReactNode;
  i18n: any;                              // i18next instance
  supportedLanguages?: readonly string[]; // Default: ['en']
  fallbackLanguage?: string;              // Default: 'en'
  storageKey?: string;                    // Default: 'language'
}
```

**Props:**
- `children` - Your app components
- `i18n` - i18next instance (required)
- `supportedLanguages` - Array of supported language codes
- `fallbackLanguage` - Fallback when language not supported
- `storageKey` - localStorage key for persistence

**Example:**
```tsx
<LocaleProvider
  i18n={i18n}
  supportedLanguages={['en', 'es', 'fr', 'de']}
  fallbackLanguage="en"
  storageKey="app_language"
>
  <App />
</LocaleProvider>
```

### useLocale Hook

```tsx
const {
  language,            // string - Current language code
  setLanguage,         // (lng: string) => void
  supportedLanguages   // readonly string[]
} = useLocale();
```

**Returns:**
- `language` - Current active language code
- `setLanguage` - Function to change language
- `supportedLanguages` - Array of supported languages

## Usage Examples

### Language Selector

```tsx
import { useLocale } from '@tarxemo/react-i18n';

function LanguageSelector() {
  const { language, setLanguage, supportedLanguages } = useLocale();
  
  const languageNames = {
    en: 'English',
    es: 'Español',
    fr: 'Français',
    de: 'Deutsch'
  };
  
  return (
    <select 
      value={language} 
      onChange={(e) => setLanguage(e.target.value)}
    >
      {supportedLanguages.map(lng => (
        <option key={lng} value={lng}>
          {languageNames[lng] || lng}
        </option>
      ))}
    </select>
  );
}
```

### Language Toggle Buttons

```tsx
function LanguageButtons() {
  const { language, setLanguage } = useLocale();
  
  return (
    <div>
      <button 
        onClick={() => setLanguage('en')}
        className={language === 'en' ? 'active' : ''}
      >
        EN
      </button>
      <button 
        onClick={() => setLanguage('es')}
        className={language === 'es' ? 'active' : ''}
      >
        ES
      </button>
      <button 
        onClick={() => setLanguage('fr')}
        className={language === 'fr' ? 'active' : ''}
      >
        FR
      </button>
    </div>
  );
}
```

### With Flags

```tsx
function LanguageSelectorWithFlags() {
  const { language, setLanguage, supportedLanguages } = useLocale();
  
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
  ];
  
  return (
    <div className="language-selector">
      {languages
        .filter(lng => supportedLanguages.includes(lng.code))
        .map(lng => (
          <button
            key={lng.code}
            onClick={() => setLanguage(lng.code)}
            className={language === lng.code ? 'active' : ''}
          >
            <span className="flag">{lng.flag}</span>
            <span className="name">{lng.name}</span>
          </button>
        ))
      }
    </div>
  );
}
```

### Dropdown Menu

```tsx
function LanguageDropdown() {
  const { language, setLanguage } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  
  const languages = {
    en: { name: 'English', flag: '🇺🇸' },
    es: { name: 'Español', flag: '🇪🇸' },
    fr: { name: 'Français', flag: '🇫🇷' }
  };
  
  const current = languages[language];
  
  return (
    <div className="dropdown">
      <button onClick={() => setIsOpen(!isOpen)}>
        {current.flag} {current.name}
      </button>
      
      {isOpen && (
        <div className="dropdown-menu">
          {Object.entries(languages).map(([code, { name, flag }]) => (
            <button
              key={code}
              onClick={() => {
                setLanguage(code);
                setIsOpen(false);
              }}
            >
              {flag} {name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

## Advanced Usage

### Language Normalization

The library automatically normalizes language codes:

```tsx
// Input: 'en-US' → Output: 'en' (if 'en' is supported)
// Input: 'en-GB' → Output: 'en' (if 'en' is supported)
// Input: 'pt-BR' → Output: 'pt' (if 'pt' is supported)

setLanguage('en-US'); // Automatically normalized to 'en'
```

### Browser Language Detection

```tsx
// Detect browser language on first visit
useEffect(() => {
  const browserLang = navigator.language; // e.g., 'en-US'
  setLanguage(browserLang); // Automatically normalized
}, []);
```

### Complete Setup Example

```tsx
// i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: require('./locales/en.json') },
      es: { translation: require('./locales/es.json') },
      fr: { translation: require('./locales/fr.json') }
    },
    fallbackLng: 'en',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;

// App.tsx
import { LocaleProvider } from '@tarxemo/react-i18n';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <LocaleProvider
        i18n={i18n}
        supportedLanguages={['en', 'es', 'fr']}
        fallbackLanguage="en"
        storageKey="app_language"
      >
        <YourApp />
      </LocaleProvider>
    </I18nextProvider>
  );
}
```

### Translation Files Structure

```
src/
  locales/
    en.json
    es.json
    fr.json
```

```json
// en.json
{
  "common": {
    "welcome": "Welcome",
    "logout": "Logout"
  },
  "home": {
    "title": "Home Page",
    "description": "Welcome to our app"
  },
  "errors": {
    "notFound": "Page not found",
    "serverError": "Server error"
  }
}
```

## Best Practices

### 1. Organize Translations by Namespace

```tsx
// i18n.ts
i18n.init({
  resources: {
    en: {
      common: require('./locales/en/common.json'),
      home: require('./locales/en/home.json'),
      auth: require('./locales/en/auth.json')
    }
  },
  defaultNS: 'common'
});

// Component.tsx
const { t } = useTranslation('home');
t('title'); // Uses home namespace
```

### 2. Use Interpolation

```json
{
  "greeting": "Hello {{name}}!",
  "itemCount": "You have {{count}} items"
}
```

```tsx
t('greeting', { name: 'John' }); // "Hello John!"
t('itemCount', { count: 5 }); // "You have 5 items"
```

### 3. Handle Plurals

```json
{
  "item": "item",
  "item_plural": "items",
  "itemWithCount": "{{count}} item",
  "itemWithCount_plural": "{{count}} items"
}
```

```tsx
t('itemWithCount', { count: 1 }); // "1 item"
t('itemWithCount', { count: 5 }); // "5 items"
```

### 4. Lazy Load Translations

```tsx
import i18n from 'i18next';
import Backend from 'i18next-http-backend';

i18n
  .use(Backend)
  .init({
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json'
    }
  });
```

## Troubleshooting

### Issue: Language not persisting

**Cause:** localStorage not available or different storageKey

**Solution:**
```tsx
<LocaleProvider storageKey="language" i18n={i18n}>
```

### Issue: Translations not loading

**Cause:** i18next not initialized or resources missing

**Solution:**
```tsx
// Ensure i18n is initialized before rendering
i18n.init({...}).then(() => {
  ReactDOM.render(<App />, document.getElementById('root'));
});
```

### Issue: HTML lang attribute not updating

**Cause:** Document not available (SSR)

**Solution:** Library handles this automatically in browser environment

## TypeScript

Full TypeScript support:

```tsx
import {
  LocaleProvider,
  useLocale,
  LocaleContextType,
  LocaleProviderProps
} from '@tarxemo/react-i18n';
```

## License

MIT
# react-i18n
