'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/language-context';
import { speakText } from '@/lib/api';
import { FaVolumeUp, FaVolumeMute, FaSpinner } from 'react-icons/fa';

interface SpeakButtonProps {
  text: string;
  autoSpeak?: boolean;
  className?: string;
}

export default function SpeakButton({ text, autoSpeak = false, className = '' }: SpeakButtonProps) {
  const { language } = useLanguage();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    // Check if speech synthesis is supported
    if (!('speechSynthesis' in window)) {
      setIsSupported(false);
      return;
    }

    // Auto-speak on mount if enabled
    if (autoSpeak) {
      setTimeout(() => speak(), 500);
    }

    // Cleanup on unmount
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, [autoSpeak, language]);

  const speak = () => {
    if (!isSupported) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    setIsSpeaking(false);

    // Wait a moment, then speak (Chrome bug fix)
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.rate = 0.85;
      utterance.pitch = 1;
      utterance.volume = 1;

      // Try to find voice for selected language
      const voices = window.speechSynthesis.getVoices();
      const languageVoice = voices.find(v => v.lang.startsWith(language.split('-')[0]));
      if (languageVoice) {
        utterance.voice = languageVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      // Force resume (Chrome bug fix)
      window.speechSynthesis.resume();
      window.speechSynthesis.speak(utterance);

      // Chrome pause/resume hack
      setTimeout(() => {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }, 100);
    }, 100);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  if (!isSupported) {
    return null;
  }

  return (
    <button
      onClick={isSpeaking ? stop : speak}
      className={`flex items-center justify-center gap-3 font-semibold py-4 px-6 rounded-xl transition-all duration-300 ${
        isSpeaking 
          ? 'bg-red-500 hover:bg-red-600 text-white' 
          : 'bg-green-500 hover:bg-green-600 text-white'
      } ${className}`}
    >
      {isSpeaking ? (
        <>
          <FaVolumeMute className="text-xl" />
          Stop Speaking
        </>
      ) : (
        <>
          <FaVolumeUp className="text-xl animate-pulse" />
          Speak Who This Is
        </>
      )}
    </button>
  );
}


