'use client';

import { useEffect, useState } from 'react';
import { Person } from '@/types';
import { useLanguage } from '@/lib/language-context';
import { buildSpeechTextForLanguage } from '@/lib/speech-messages';
import SpeakButton from './SpeakButton';
import { FaTimes, FaPhone, FaComments, FaHeart, FaCheckCircle } from 'react-icons/fa';

interface ResultCardProps {
  person: Person;
  onClose: () => void;
}

export default function ResultCard({ person, onClose }: ResultCardProps) {
  const { language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const speechText = buildSpeechTextForLanguage(person, language);

  // Animate in on mount
  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div 
      className={`fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div 
        className={`bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl transition-all duration-500 ${
          isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'
        }`}
      >
        {/* Header with Photo */}
        <div className="relative">
          <div className="h-52 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-t-3xl overflow-hidden">
            {(person.photo_url || person.photo_base64) && (
              <img
                src={person.photo_url || person.photo_base64}
                alt={person.name}
                className="w-full h-full object-cover opacity-80"
              />
            )}
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          </div>
          
          {/* Match Badge */}
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-green-500 text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-lg">
            <FaCheckCircle />
            <span>Match Found!</span>
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2.5 bg-black/30 hover:bg-black/50 rounded-full text-white transition-colors"
          >
            <FaTimes />
          </button>

          {/* Profile Circle */}
          <div className="absolute -bottom-14 left-1/2 transform -translate-x-1/2">
            <div className="w-28 h-28 rounded-full border-4 border-white shadow-xl overflow-hidden bg-indigo-100 ring-4 ring-indigo-100">
              {(person.photo_url || person.photo_base64) ? (
                <img
                  src={person.photo_url || person.photo_base64}
                  alt={person.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-5xl text-indigo-400 font-bold">
                  {person.name.charAt(0)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="pt-18 pb-8 px-6" style={{ paddingTop: '4.5rem' }}>
          {/* Name & Relationship */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-1">{person.name}</h2>
            {person.nickname && (
              <p className="text-indigo-600 text-xl font-medium">"{person.nickname}"</p>
            )}
            <div className="inline-block mt-3 bg-gray-100 px-4 py-1.5 rounded-full">
              <p className="text-gray-600 font-medium">Your {person.relationship}</p>
            </div>
          </div>

          {/* Speak Button - Auto speaks! */}
          <SpeakButton 
            text={speechText} 
            autoSpeak={true}
            className="w-full mb-6 shadow-lg"
          />

          {/* Details */}
          {person.details && (
            <div className="mb-5 p-4 bg-gray-50 rounded-xl">
              <p className="text-gray-700 leading-relaxed">{person.details}</p>
            </div>
          )}

          {/* Conversation Topics */}
          {person.conversation_topics && person.conversation_topics.length > 0 && (
            <div className="mb-5 bg-blue-50 rounded-xl p-5 border border-blue-100">
              <div className="flex items-center gap-2 text-blue-700 font-semibold mb-3">
                <FaComments className="text-lg" />
                <span>You Can Ask About:</span>
              </div>
              <ul className="space-y-2.5">
                {person.conversation_topics.map((topic, index) => (
                  <li key={index} className="flex items-start gap-3 text-gray-700">
                    <span className="w-6 h-6 bg-blue-200 text-blue-700 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                      {index + 1}
                    </span>
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Important Memories */}
          {person.important_memories && (
            <div className="mb-5 bg-gradient-to-br from-pink-50 to-red-50 rounded-xl p-5 border border-pink-100">
              <div className="flex items-center gap-2 text-pink-700 font-semibold mb-3">
                <FaHeart className="text-lg" />
                <span>Special Memories:</span>
              </div>
              <p className="text-gray-700 leading-relaxed">{person.important_memories}</p>
            </div>
          )}

          {/* Phone */}
          {person.phone && (
            <a
              href={`tel:${person.phone}`}
              className="flex items-center justify-center gap-3 bg-gray-100 hover:bg-green-100 hover:text-green-700 text-gray-700 font-semibold py-4 rounded-xl transition-all border-2 border-transparent hover:border-green-200"
            >
              <FaPhone />
              Call {person.name}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
