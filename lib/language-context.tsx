'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, LANGUAGES } from '@/types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  languageName: string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en-IN');

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('yaadkar-language') as Language;
    if (saved && LANGUAGES.find(l => l.code === saved)) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('yaadkar-language', lang);
  };

  const languageName = LANGUAGES.find(l => l.code === language)?.nativeName || 'English';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, languageName }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}





