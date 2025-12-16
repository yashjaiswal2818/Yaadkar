'use client';

import { useState, useEffect, useCallback } from 'react';
import { Person } from '@/types';
import { generateConversation, buildConversationContext, speakText } from '@/lib/api';
import { useLanguage } from '@/lib/language-context';
import DraggableCard from './DraggableCard';
import { FaVolumeUp, FaSync, FaSpinner, FaGripLines, FaStop } from 'react-icons/fa';

interface ConversationCardProps {
  person: Person;
}

export default function ConversationCard({
  person
}: ConversationCardProps) {
  const { language } = useLanguage();
  const [conversation, setConversation] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fixed initial position - set once on mount, independent of face movement
  const [initialPosition] = useState(() => {
    // Default position (right side of screen, slightly below top)
    const cardWidth = 360;
    const padding = 20;

    return {
      x: Math.max(padding, window.innerWidth - cardWidth - padding),
      y: 120,
    };
  });

  const fetchConversation = useCallback(async (isRegenerate = false) => {
    if (isRegenerate) {
      setIsRegenerating(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const context = buildConversationContext(person);
      const response = await generateConversation(context, language);

      if (response.success && response.conversation) {
        setConversation(response.conversation);
      } else {
        // Fallback conversation
        setConversation(`Hello! Nice to see you!`);
        setError(response.message || 'Using fallback conversation');
      }
    } catch (err: any) {
      console.error('Error generating conversation:', err);
      setConversation(`Hello! Nice to see you!`);
      setError('Failed to generate conversation. Using fallback.');
    } finally {
      setIsLoading(false);
      setIsRegenerating(false);
    }
  }, [person, language]);

  useEffect(() => {
    fetchConversation(false);
  }, [fetchConversation]);

  const handleSpeak = useCallback(() => {
    if (!conversation) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    setIsSpeaking(false);

    // Wait a moment, then speak (Chrome bug fix)
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(conversation);
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
  }, [conversation, language]);

  const handleRegenerate = () => {
    fetchConversation(true);
  };

  const handleStop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  return (
    <DraggableCard initialX={initialPosition.x} initialY={initialPosition.y}>
      <div className="bg-white rounded-2xl shadow-soft-lg overflow-hidden border border-primary-200 max-w-sm w-[360px]">
        {/* Drag Handle */}
        <div className="bg-gradient-to-r from-primary-600 to-accent-600 p-3 text-white flex items-center justify-center cursor-grab active:cursor-grabbing">
          <FaGripLines className="text-lg opacity-80" />
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-primary-600 text-lg">💬</span>
            </div>
            <h3 className="text-lg font-bold text-neutral-900">Say This:</h3>
          </div>

          {/* Loading State */}
          {(isLoading || isRegenerating) && (
            <div className="flex items-center justify-center py-8">
              <FaSpinner className="animate-spin text-2xl text-primary-600" />
              <span className="ml-3 text-neutral-600">
                {isRegenerating ? 'Generating new suggestion...' : 'Generating conversation...'}
              </span>
            </div>
          )}

          {/* Error Message */}
          {error && !isLoading && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 mb-3">
              <p className="text-xs text-amber-800">{error}</p>
            </div>
          )}

          {/* Conversation Text */}
          {!isLoading && conversation && (
            <div className="mb-4">
              <p className="text-neutral-700 text-base leading-relaxed whitespace-pre-wrap">
                "{conversation}"
              </p>
            </div>
          )}

          {/* Fallback if no conversation yet */}
          {!isLoading && !conversation && !error && (
            <div className="mb-4">
              <p className="text-neutral-700 text-base leading-relaxed">
                "Hello! Nice to see you!"
              </p>
            </div>
          )}

          {/* Action Buttons */}
          {!isLoading && conversation && (
            <div className="flex gap-2">
              <button
                onClick={handleSpeak}
                disabled={isSpeaking}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-colors ${isSpeaking
                    ? 'bg-red-50 text-red-600'
                    : 'bg-primary-600 hover:bg-primary-700 text-white'
                  }`}
              >
                {isSpeaking ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    <span>Speaking...</span>
                  </>
                ) : (
                  <>
                    <FaVolumeUp />
                    <span>Speak This</span>
                  </>
                )}
              </button>

              <button
                onClick={handleStop}
                disabled={!isSpeaking}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-colors ${isSpeaking
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                  }`}
                title="Stop Speech"
              >
                <FaStop />
                <span className="hidden sm:inline">STOP</span>
              </button>

              <button
                onClick={handleRegenerate}
                disabled={isRegenerating}
                className="flex items-center justify-center gap-2 py-3 px-4 bg-accent-600 hover:bg-accent-700 disabled:bg-accent-300 text-white rounded-lg font-semibold transition-colors"
                title="Get another suggestion"
              >
                {isRegenerating ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <>
                    <FaSync />
                    <span className="hidden sm:inline">New</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </DraggableCard>
  );
}

