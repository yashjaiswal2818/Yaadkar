'use client';

import { useState, useEffect, useCallback } from 'react';
import { Person } from '@/types';
import { generateConversation, buildConversationContext } from '@/lib/api';
import { useLanguage } from '@/lib/language-context';
import DraggableCard from './DraggableCard';
import Icon from './ui/Icon';

interface ConversationCardNewProps {
  person: Person;
  isOpen: boolean;
  onClose: () => void;
  onGenerateNew: () => void;
}

export default function ConversationCardNew({
  person,
  isOpen,
  onClose,
  onGenerateNew,
}: ConversationCardNewProps) {
  const { language } = useLanguage();
  const [conversation, setConversation] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Initial position: bottom-right
  const [initialPosition] = useState(() => {
    const cardWidth = 320;
    const padding = 20;
    return {
      x: window.innerWidth - cardWidth - padding,
      y: window.innerHeight - 400 - padding,
    };
  });

  const fetchConversation = useCallback(async (isRegenerate = false) => {
    if (isRegenerate) {
      setIsRegenerating(true);
    } else {
      setIsLoading(true);
    }

    try {
      const context = buildConversationContext(person);
      const response = await generateConversation(context, language);

      if (response.success && response.conversation) {
        setConversation(response.conversation);
      } else {
        setConversation('Hello! Nice to see you!');
      }
    } catch (err) {
      console.error('Error generating conversation:', err);
      setConversation('Hello! Nice to see you!');
    } finally {
      setIsLoading(false);
      setIsRegenerating(false);
    }
  }, [person, language]);

  useEffect(() => {
    if (isOpen) {
      fetchConversation(false);
    }
  }, [isOpen, fetchConversation]);

  const handleSpeak = useCallback(() => {
    if (!conversation) return;

    window.speechSynthesis?.cancel();
    setIsSpeaking(false);

    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(conversation);
      utterance.lang = language;
      utterance.rate = 0.85;

      const voices = window.speechSynthesis.getVoices();
      const languageVoice = voices.find(v => v.lang.startsWith(language.split('-')[0]));
      if (languageVoice) {
        utterance.voice = languageVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.resume();
      window.speechSynthesis.speak(utterance);
    }, 100);
  }, [conversation, language]);

  const handleStop = useCallback(() => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  }, []);

  const handleGenerateNew = () => {
    fetchConversation(true);
    onGenerateNew();
  };

  if (!isOpen) return null;

  return (
    <DraggableCard initialX={initialPosition.x} initialY={initialPosition.y}>
      <div className="bg-white rounded-2xl shadow-2xl border border-accent-200 overflow-hidden w-[320px]">
        {/* Header with Drag Handle */}
        <div
          className="bg-gradient-to-r from-accent-600 to-accent-700 p-3 text-white flex items-center justify-between cursor-grab active:cursor-grabbing"
          onMouseDown={(e) => {
            // Allow dragging from header
          }}
        >
          <div className="flex items-center gap-2 flex-1">
            <Icon name="menu" size={16} className="opacity-80" />
            <span className="text-xs font-medium opacity-80">Drag to move</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
              aria-label={isCollapsed ? 'Expand' : 'Collapse'}
            >
              <Icon
                name={isCollapsed ? 'chevronRight' : 'chevronLeft'}
                size={16}
                className="opacity-80"
              />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Close"
            >
              <Icon name="x" size={16} className="opacity-80" />
            </button>
          </div>
        </div>

        {/* Title */}
        <div className="px-4 py-3 border-b border-neutral-200 bg-accent-50/50">
          <h3 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
            <span className="text-xl">💬</span>
            <span>Conversation Starter</span>
          </h3>
        </div>

        {/* Body - Collapsible */}
        {!isCollapsed && (
          <div className="p-4">
            {/* Loading State */}
            {(isLoading || isRegenerating) && (
              <div className="flex items-center justify-center py-8">
                <Icon name="loader" size={24} className="animate-spin text-accent-600" />
                <span className="ml-3 text-neutral-600 text-sm">
                  {isRegenerating ? 'Generating...' : 'Loading...'}
                </span>
              </div>
            )}

            {/* Conversation Text */}
            {!isLoading && conversation && (
              <div className="mb-4">
                <p className="text-base text-neutral-700 leading-relaxed whitespace-pre-wrap">
                  {conversation}
                </p>
              </div>
            )}

            {/* Footer Actions */}
            {!isLoading && conversation && (
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleSpeak}
                  disabled={isSpeaking}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all ${
                    isSpeaking
                      ? 'bg-red-50 text-red-600'
                      : 'bg-accent-600 hover:bg-accent-700 text-white shadow-soft'
                  }`}
                >
                  {isSpeaking ? (
                    <>
                      <Icon name="loader" size={18} className="animate-spin" />
                      <span>Speaking...</span>
                    </>
                  ) : (
                    <>
                      <Icon name="volume" size={18} />
                      <span>Speak This</span>
                    </>
                  )}
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={handleGenerateNew}
                    disabled={isRegenerating}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 border-2 border-accent-300 text-accent-700 hover:bg-accent-50 rounded-xl font-semibold text-sm transition-all"
                  >
                    {isRegenerating ? (
                      <Icon name="loader" size={16} className="animate-spin" />
                    ) : (
                      <>
                        <Icon name="refresh" size={16} />
                        <span>New Suggestion</span>
                      </>
                    )}
                  </button>

                  {isSpeaking && (
                    <button
                      onClick={handleStop}
                      className="flex items-center justify-center gap-2 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold text-sm transition-all"
                    >
                      <Icon name="x" size={16} />
                      <span>Stop</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </DraggableCard>
  );
}


