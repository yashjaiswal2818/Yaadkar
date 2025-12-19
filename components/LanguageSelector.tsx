'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/language-context';
import { LANGUAGES } from '@/types';
import { FaGlobe, FaCheck } from 'react-icons/fa';

export default function LanguageSelector() {
  const { language, setLanguage, languageName } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
      >
        <FaGlobe className="text-indigo-600" />
        <span className="text-sm font-medium">{languageName}</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border z-50 py-2">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-2 hover:bg-gray-50 transition-colors ${language === lang.code ? 'text-indigo-600 bg-indigo-50' : 'text-gray-700'
                  }`}
              >
                <div>
                  <span className="font-medium">{lang.nativeName}</span>
                  <span className="text-gray-400 text-sm ml-2">({lang.name})</span>
                </div>
                {language === lang.code && <FaCheck className="text-indigo-600" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}






