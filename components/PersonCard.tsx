'use client';

import { useCallback, useRef, useState } from 'react';
import { Person } from '@/types';
import { useLanguage } from '@/lib/language-context';
import { relationships } from '@/lib/speech-messages';
import { getDashboardTranslation } from '@/lib/dashboard-translations';
import Icon from './ui/Icon';
import Badge from './ui/Badge';

interface PersonCardProps {
  person: Person;
  onEdit: (person: Person) => void;
  onDelete: (personId: number) => void;
}

export default function PersonCard({ person, onEdit, onDelete }: PersonCardProps) {
  const { language } = useLanguage();
  const relationshipMap = relationships[language] || relationships['en-IN'];
  const translatedRelationship = relationshipMap[person.relationship] || person.relationship;

  const [menuOpen, setMenuOpen] = useState(false);
  const [isLongPress, setIsLongPress] = useState(false);
  const longPressTimeoutRef = useRef<number | null>(null);

  const handlePressStart = useCallback(() => {
    if (typeof window === 'undefined') return;
    setIsLongPress(false);
    longPressTimeoutRef.current = window.setTimeout(() => {
      setIsLongPress(true);
      setMenuOpen(true);
    }, 500);
  }, []);

  const handlePressEnd = useCallback(() => {
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }
  }, []);

  const handleCardClick = useCallback(() => {
    if (isLongPress) return;
    onEdit(person);
  }, [isLongPress, onEdit, person]);

  const handleCall = useCallback(() => {
    if (!person.phone) return;
    window.location.href = `tel:${person.phone}`;
  }, [person.phone]);

  const conversationTopics = (person.conversation_topics || []).slice(0, 3);

  return (
    <div
      className="group relative rounded-2xl bg-white border border-neutral-200/70 shadow-soft overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg hover:border-primary-100/80"
      onClick={handleCardClick}
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      onMouseLeave={handlePressEnd}
      onTouchStart={handlePressStart}
      onTouchEnd={handlePressEnd}
      onTouchCancel={handlePressEnd}
    >
      {/* Hover gradient ring */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-transparent group-hover:border-primary-200" />

      <div className="relative flex flex-col md:flex-row h-full">
        {/* Photo */}
        <div className="relative w-full md:w-40 flex-shrink-0">
          <div className="relative aspect-square md:aspect-[4/5] bg-gradient-to-br from-primary-50 via-primary-100 to-accent-50 overflow-hidden">
            {person.photo_url || person.photo_base64 ? (
              <img
                src={person.photo_url || person.photo_base64}
                alt={person.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-200 via-primary-300 to-accent-200">
                <span className="text-4xl sm:text-5xl font-bold text-primary-600 drop-shadow-sm">
                  {person.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}

            {/* Bottom overlay */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

            {/* Relationship badge */}
            <div className="absolute bottom-2 left-2">
              <Badge
                variant="primary"
                size="sm"
                className="backdrop-blur-sm bg-white/85 text-primary-700 shadow-soft px-2.5 py-1 text-xs"
              >
                {translatedRelationship}
              </Badge>
            </div>
          </div>
        </div>

        {/* Info + actions */}
        <div className="flex-1 min-w-0 px-4 py-3 sm:px-5 sm:py-4 flex flex-col gap-2">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-semibold text-neutral-900 truncate group-hover:text-primary-700 transition-colors">
                {person.name}
              </h3>
              {person.nickname && (
                <p className="text-xs sm:text-sm text-neutral-500 italic truncate mt-0.5">
                  &ldquo;{person.nickname}&rdquo;
                </p>
              )}
            </div>

            {/* Actions menu trigger */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen((prev) => !prev);
                }}
                className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors touch-target focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                aria-label="Open actions"
              >
                <Icon name="menu" size={18} />
              </button>

              {menuOpen && (
                <div
                  className="absolute right-0 mt-2 w-40 rounded-xl bg-white border border-neutral-200 shadow-soft-lg z-20 py-1 text-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    className="w-full px-3 py-2 flex items-center gap-2 text-neutral-700 hover:bg-neutral-50"
                    onClick={() => {
                      setMenuOpen(false);
                      onEdit(person);
                    }}
                  >
                    <Icon name="edit" size={16} className="text-neutral-500" />
                    <span>{getDashboardTranslation(language, 'edit')}</span>
                  </button>

                  {person.phone && (
                    <button
                      type="button"
                      className="w-full px-3 py-2 flex items-center gap-2 text-neutral-700 hover:bg-neutral-50"
                      onClick={() => {
                        setMenuOpen(false);
                        handleCall();
                      }}
                    >
                      <Icon name="phone" size={16} className="text-emerald-600" />
                      <span>{getDashboardTranslation(language, 'call')}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    className="w-full px-3 py-2 flex items-center gap-2 text-red-600 hover:bg-red-50"
                    onClick={() => {
                      setMenuOpen(false);
                      if (person.id != null) {
                        onDelete(person.id);
                      }
                    }}
                  >
                    <Icon name="trash" size={16} className="text-red-500" />
                    <span>{getDashboardTranslation(language, 'delete')}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          {person.details && (
            <p className="text-xs sm:text-sm text-neutral-600 line-clamp-2">
              {person.details}
            </p>
          )}

          {/* Tags */}
          {conversationTopics.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1.5">
              {conversationTopics.map((topic, index) => (
                <span
                  key={`${topic}-${index}`}
                  className="inline-flex items-center rounded-full bg-primary-50 text-primary-700 border border-primary-100 px-2 py-0.5 text-[11px] font-medium"
                >
                  {topic}
                </span>
              ))}
              {person.conversation_topics &&
                person.conversation_topics.length > conversationTopics.length && (
                  <span className="text-[11px] text-neutral-500">
                    +{person.conversation_topics.length - conversationTopics.length} more
                  </span>
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function PersonCardSkeleton() {
  return (
    <div className="relative rounded-2xl bg-white border border-neutral-100 shadow-soft overflow-hidden">
      <div className="flex flex-col md:flex-row h-full">
        <div className="relative w-full md:w-40 flex-shrink-0">
          <div className="aspect-square md:aspect-[4/5] skeleton" />
        </div>
        <div className="flex-1 min-w-0 px-4 py-3 sm:px-5 sm:py-4 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="h-4 w-32 skeleton rounded-full mb-2" />
              <div className="h-3 w-24 skeleton rounded-full" />
            </div>
            <div className="h-7 w-7 rounded-full skeleton" />
          </div>
          <div className="h-3 w-full skeleton rounded-full" />
          <div className="h-3 w-4/5 skeleton rounded-full" />
          <div className="flex gap-2 mt-1">
            <div className="h-5 w-16 skeleton rounded-full" />
            <div className="h-5 w-12 skeleton rounded-full" />
            <div className="h-5 w-20 skeleton rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
