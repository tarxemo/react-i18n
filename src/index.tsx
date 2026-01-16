import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export interface LocaleContextType {
    language: string;
    setLanguage: (lng: string) => void;
    supportedLanguages: readonly string[];
}

export interface LocaleProviderProps {
    children: React.ReactNode;
    i18n: any; // Use any to avoid i18next version conflicts
    supportedLanguages?: readonly string[];
    fallbackLanguage?: string;
    storageKey?: string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

function normalizeLng(lng: string | undefined, supported: readonly string[], fallback: string): string {
    if (!lng) return fallback;
    const low = lng.toLowerCase();

    // Exact match
    if (supported.includes(low)) return low;

    // Prefix match (e.g., 'en-US' -> 'en')
    for (const s of supported) {
        if (low.startsWith(s)) return s;
    }

    return fallback;
}

export const LocaleProvider = ({
    children,
    i18n,
    supportedLanguages = ['en'],
    fallbackLanguage = 'en',
    storageKey = 'language'
}: LocaleProviderProps) => {

    // Determine initial language from i18n instance or storage
    const initial = normalizeLng(
        i18n.language || (typeof window !== 'undefined' ? localStorage.getItem(storageKey) || undefined : undefined),
        supportedLanguages,
        fallbackLanguage
    );

    const [language, setLanguageState] = useState<string>(initial);

    useEffect(() => {
        if (typeof document !== 'undefined') {
            document.documentElement.lang = language;
        }
    }, [language]);

    const setLanguage = (lng: string) => {
        const norm = normalizeLng(lng, supportedLanguages, fallbackLanguage);
        i18n.changeLanguage(norm);
        setLanguageState(norm);

        if (typeof window !== 'undefined') {
            localStorage.setItem(storageKey, norm);
        }

        if (typeof document !== 'undefined') {
            document.documentElement.lang = norm;
        }
    };

    const value = useMemo(() => ({
        language,
        setLanguage,
        supportedLanguages
    }), [language, supportedLanguages]);

    return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
};

export const useLocale = () => {
    const ctx = useContext(LocaleContext);
    if (!ctx) throw new Error('useLocale must be used within LocaleProvider');
    return ctx;
};

// Alias
export const useLocaleContext = useLocale;
