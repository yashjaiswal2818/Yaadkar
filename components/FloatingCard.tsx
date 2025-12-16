'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { Person, LANGUAGES } from '@/types';
import { speakText } from '@/lib/api';
import { useLanguage } from '@/lib/language-context';
import { buildSpeechTextForLanguage } from '@/lib/speech-messages';
import { FaVolumeUp, FaTimes, FaComments, FaHeart, FaGlobe, FaCheck, FaStop } from 'react-icons/fa';

interface FloatingCardProps {
  person: Person;
  position: { x: number; y: number; width: number; height: number };
  videoWidth: number;
  videoHeight: number;
  onClose: () => void;
  onScanAgain: () => void;
}

export default function FloatingCard({
  person,
  position,
  videoWidth,
  videoHeight,
  onClose,
  onScanAgain
}: FloatingCardProps) {
  const { language, setLanguage, languageName } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  const handleSpeak = useCallback(() => {
    const text = buildSpeechTextForLanguage(person, language);

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
  }, [person, language]);

  const handleStop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);

    // Auto-speak when card appears
    const text = buildSpeechTextForLanguage(person, language);
    const speakTimeout = setTimeout(() => speakText(text, language), 500);

    // Cleanup speech on unmount
    return () => {
      clearTimeout(speakTimeout);
      window.speechSynthesis?.cancel();
    };
  }, [person, language]);

  // Calculate card position (to the right of face, or left if no space)
  // Recalculate whenever position changes (for face tracking)
  const cardPosition = useMemo(() => {
    const cardWidth = 360;
    const cardHeight = 350;
    const padding = 20;

    // Position relative to video container (percentage based)
    let left = position.x + position.width + padding;
    let top = position.y;

    // If card would go off right edge, put it on left of face
    if (left + cardWidth > videoWidth) {
      left = position.x - cardWidth - padding;
    }

    // Keep card on screen
    if (left < padding) left = padding;
    if (top < padding) top = padding;
    if (top + cardHeight > videoHeight - padding) {
      top = videoHeight - cardHeight - padding;
    }

    // Convert to percentage
    const leftPercent = (left / videoWidth) * 100;
    const topPercent = (top / videoHeight) * 100;

    return { left: `${leftPercent}%`, top: `${topPercent}%` };
  }, [position, videoWidth, videoHeight]);

  return (
    <div
      className={`fixed z-50 transition-all duration-300 ease-out ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
        }`}
      style={{
        left: cardPosition.left,
        top: cardPosition.top,
        maxWidth: '360px',
        width: '360px',
        pointerEvents: 'auto',
        transform: `translate(0, 0) scale(${isVisible ? 1 : 0.9})`,
        transition: 'left 0.2s ease-out, top 0.2s ease-out, opacity 0.3s ease-out, transform 0.3s ease-out'
      }}
    >
      <div className="bg-white rounded-2xl shadow-soft-lg overflow-hidden border border-primary-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-accent-600 p-4 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 p-1.5 bg-white/20 rounded-full hover:bg-white/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500"
          >
            <FaTimes className="text-sm" />
          </button>

          <div className="flex items-center gap-3">
            {/* Mini photo */}
            <div className="w-14 h-14 rounded-full border-2 border-white overflow-hidden bg-white/20 flex-shrink-0">
              {(person.photo_url || person.photo_base64) ? (
                <img
                  src={person.photo_url || person.photo_base64}
                  alt={person.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl">
                  {person.name.charAt(0)}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-xl font-bold">{person.name}</h3>
              {person.nickname && (
                <p className="text-white/80 text-sm">"{person.nickname}"</p>
              )}
              <p className="text-white/90 text-sm">{person.relationship}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 max-h-48 overflow-y-auto">
          {/* Language Selector & Speak Button Row */}
          <div className="flex gap-2 mb-3">
            {/* Language Selector */}
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="flex items-center gap-1.5 px-3 py-2.5 bg-primary-50 hover:bg-primary-100 border border-primary-200 rounded-lg transition-colors text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500"
                title="Change Language / भाषा बदलें"
              >
                <FaGlobe className="text-primary-600 text-sm" />
                <span className="font-semibold text-primary-700">{languageName}</span>
              </button>

              {isLanguageOpen && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsLanguageOpen(false)}
                  />

                  {/* Dropdown */}
                  <div className="absolute left-0 mt-2 w-52 bg-white rounded-xl shadow-soft border border-neutral-100 z-50 py-2 max-h-80 overflow-y-auto">
                    <div className="px-3 py-1.5 border-b border-neutral-100">
                      <p className="text-xs font-semibold text-neutral-500 uppercase">Select Language</p>
                    </div>
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setIsLanguageOpen(false);
                          // Stop any ongoing speech
                          window.speechSynthesis.cancel();
                          setIsSpeaking(false);
                          // Re-speak in new language after a short delay
                          setTimeout(() => {
                            const text = buildSpeechTextForLanguage(person, lang.code);
                            const utterance = new SpeechSynthesisUtterance(text);
                            utterance.lang = lang.code;
                            utterance.rate = 0.85;
                            utterance.pitch = 1;
                            utterance.volume = 1;

                            // Try to find voice for selected language
                            const voices = window.speechSynthesis.getVoices();
                            const languageVoice = voices.find(v => v.lang.startsWith(lang.code.split('-')[0]));
                            if (languageVoice) {
                              utterance.voice = languageVoice;
                            }

                            utterance.onstart = () => setIsSpeaking(true);
                            utterance.onend = () => setIsSpeaking(false);
                            utterance.onerror = () => setIsSpeaking(false);

                            window.speechSynthesis.speak(utterance);
                          }, 300);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-2.5 hover:bg-primary-50 transition-colors text-left ${language === lang.code ? 'text-primary-600 bg-primary-50 font-semibold' : 'text-neutral-700'
                          }`}
                      >
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">{lang.nativeName}</span>
                          <span className="text-neutral-400 text-xs">{lang.name}</span>
                        </div>
                        {language === lang.code && <FaCheck className="text-primary-600 text-sm" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Speak Button */}
            <button
              onClick={handleSpeak}
              disabled={isSpeaking}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition-colors ${isSpeaking
                  ? 'bg-red-50 text-red-600'
                  : 'bg-primary-600 text-white hover:bg-primary-700'
                }`}
            >
              <FaVolumeUp className={isSpeaking ? 'animate-pulse' : ''} />
              <span className="text-sm">{isSpeaking ? 'Speaking...' : 'Speak'}</span>
            </button>

            {/* Stop Button */}
            <button
              onClick={handleStop}
              disabled={!isSpeaking}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors ${isSpeaking
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                }`}
              title="Stop Speech"
            >
              <FaStop className="text-sm" />
              <span className="text-sm">STOP</span>
            </button>
          </div>

          {/* Details */}
          {person.details && (
            <p className="text-neutral-600 text-sm mb-3">{person.details}</p>
          )}

          {/* Topics */}
          {person.conversation_topics && person.conversation_topics.length > 0 && (
            <div className="mb-3">
              <div className="flex items-center gap-1 text-primary-600 text-xs font-semibold mb-1">
                <FaComments />
                <span>Ask about:</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {person.conversation_topics.slice(0, 3).map((topic, i) => (
                  <span key={i} className="bg-primary-50 text-primary-700 text-xs px-2 py-1 rounded-full">
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Memories */}
          {person.important_memories && (
            <div className="bg-accent-50 rounded-lg p-2">
              <div className="flex items-center gap-1 text-accent-600 text-xs font-semibold mb-1">
                <FaHeart />
                <span>Remember:</span>
              </div>
              <p className="text-neutral-600 text-xs line-clamp-2">{person.important_memories}</p>
            </div>
          )}
        </div>

        {/* Scan Again Button */}
        <div className="p-3 bg-neutral-50 border-t border-neutral-100">
          <button
            onClick={onScanAgain}
            className="w-full py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500"
          >
            Scan Another Person
          </button>
        </div>
      </div>
    </div>
  );
}

