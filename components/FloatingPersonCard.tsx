'use client';

import { useEffect, useState, useMemo } from 'react';
import { Person } from '@/types';
import { useLanguage } from '@/lib/language-context';
import { relationships } from '@/lib/speech-messages';
import { buildSpeechTextForLanguage } from '@/lib/speech-messages';
import Icon from './ui/Icon';
import Badge from './ui/Badge';

interface FloatingPersonCardProps {
  person: Person;
  facePosition: { x: number; y: number; width: number; height: number };
  videoWidth: number;
  videoHeight: number;
  onClose: () => void;
  onSpeak: () => void;
}

export default function FloatingPersonCard({
  person,
  facePosition,
  videoWidth,
  videoHeight,
  onClose,
  onSpeak,
}: FloatingPersonCardProps) {
  const { language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const relationshipMap = relationships[language] || relationships['en-IN'];
  const translatedRelationship = relationshipMap[person.relationship] || person.relationship;

  // Smooth position calculation
  const cardPosition = useMemo(() => {
    const cardWidth = 280;
    const offset = 20;
    const faceCenterX = facePosition.x + facePosition.width / 2;
    const isOnRight = faceCenterX > videoWidth / 2;

    let x: number;
    if (isOnRight) {
      // Place on left side of face
      x = facePosition.x - cardWidth - offset;
    } else {
      // Place on right side of face
      x = facePosition.x + facePosition.width + offset;
    }

    // Keep within viewport bounds
    x = Math.max(10, Math.min(x, videoWidth - cardWidth - 10));
    const y = Math.max(10, Math.min(facePosition.y, videoHeight - 400 - 10));

    return { x, y };
  }, [facePosition, videoWidth, videoHeight]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      className="fixed z-[60] pointer-events-auto animate-fade-in-up"
      style={{
        left: `${cardPosition.x}px`,
        top: `${cardPosition.y}px`,
        width: '280px',
        transform: `translateY(${isVisible ? 0 : -10}px)`,
        transition: 'transform 0.1s ease-out, opacity 0.3s ease-out',
        opacity: isVisible ? 1 : 0,
      }}
    >
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 overflow-hidden">
        {/* Header Row */}
        <div className="p-4 border-b border-neutral-200/50">
          <div className="flex items-center gap-3">
            {/* Person Photo */}
            <div className="w-[60px] h-[60px] rounded-full border-2 border-white shadow-soft overflow-hidden flex-shrink-0 bg-gradient-to-br from-primary-100 to-accent-100">
              {person.photo_url || person.photo_base64 ? (
                <img
                  src={person.photo_url || person.photo_base64}
                  alt={person.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary-600">
                    {person.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Name and Relationship */}
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-neutral-900 truncate mb-1">
                {person.name}
              </h3>
              <Badge
                variant="primary"
                size="sm"
                className="text-xs"
              >
                {translatedRelationship}
              </Badge>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors text-neutral-400 hover:text-neutral-600"
              aria-label="Close"
            >
              <Icon name="x" size={18} />
            </button>
          </div>
        </div>

        {/* Info Section */}
        <div className="p-4 space-y-3">
          {/* Nickname */}
          {person.nickname && (
            <div className="text-sm text-neutral-600">
              <span className="font-medium">Also called:</span>{' '}
              <span className="italic">"{person.nickname}"</span>
            </div>
          )}

          {/* Phone */}
          {person.phone && (
            <a
              href={`tel:${person.phone}`}
              className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 transition-colors"
            >
              <Icon name="phone" size={16} />
              <span>{person.phone}</span>
            </a>
          )}

          {/* Details */}
          {person.details && (
            <p className="text-sm text-neutral-600 line-clamp-3 leading-relaxed">
              {person.details}
            </p>
          )}

          {/* Divider */}
          {(person.conversation_topics && person.conversation_topics.length > 0) && (
            <div className="h-px bg-neutral-200" />
          )}

          {/* Tags Section */}
          {person.conversation_topics && person.conversation_topics.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-neutral-500 mb-2">Talk about:</p>
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                {person.conversation_topics.slice(0, 5).map((topic, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-primary-50 text-primary-700 text-xs rounded-full whitespace-nowrap flex-shrink-0"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200/50 flex gap-2">
          <button
            onClick={onSpeak}
            className="flex-1 flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-soft hover:shadow-soft-lg"
          >
            <Icon name="volume" size={18} />
            <span>Speak</span>
          </button>
        </div>
      </div>
    </div>
  );
}

