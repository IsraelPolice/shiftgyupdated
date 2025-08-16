import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useCurrency } from './CurrencyContext';

type Language = 'he' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, options?: any) => string;
  isRTL: boolean;
  direction: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { t, i18n } = useTranslation();
  const [language, setLanguageState] = useState<Language>('en');

  const isRTL = language === 'he';
  const direction = isRTL ? 'rtl' : 'ltr';

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem('shiftgy_language', lang);
    
    // Update document direction and lang attribute
    document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    
    // Update body class for RTL styling
    if (lang === 'he') {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
  };

  useEffect(() => {
    // Initialize language from localStorage or browser
    const savedLanguage = localStorage.getItem('shiftgy_language') as Language;
    const browserLanguage = navigator.language.startsWith('he') ? 'he' : 'en';
    const initialLanguage = savedLanguage || browserLanguage;
    
    setLanguage(initialLanguage);
  }, []);

  useEffect(() => {
    // Update language state when i18n language changes
    setLanguageState(i18n.language as Language);
  }, [i18n.language]);

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      t,
      isRTL,
      direction
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}