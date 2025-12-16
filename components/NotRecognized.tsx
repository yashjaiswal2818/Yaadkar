'use client';

import { useState, useEffect } from 'react';
import { FaUserPlus, FaRedo, FaTimes, FaQuestionCircle } from 'react-icons/fa';

interface NotRecognizedProps {
  onRetry: () => void;
  onAddPerson: () => void;
  onClose: () => void;
}

export default function NotRecognized({ onRetry, onAddPerson, onClose }: NotRecognizedProps) {
  const [isVisible, setIsVisible] = useState(false);

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
        className={`bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl text-center relative transition-all duration-500 ${
          isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <FaTimes />
        </button>

        {/* Animated Icon */}
        <div className="relative w-28 h-28 mx-auto mb-6">
          <div className="absolute inset-0 bg-amber-100 rounded-full animate-pulse"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <FaQuestionCircle className="text-6xl text-amber-500" />
          </div>
        </div>

        {/* Message */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Hmm, I Don't Recognize Them
        </h2>
        <p className="text-gray-600 mb-8">
          This person hasn't been added to the family list yet.
        </p>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={onAddPerson}
            className="w-full flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-[1.02]"
          >
            <FaUserPlus className="text-lg" />
            Add This Person
          </button>
          
          <button
            onClick={onRetry}
            className="w-full flex items-center justify-center gap-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 rounded-xl transition-all"
          >
            <FaRedo />
            Try Again
          </button>

          <button
            onClick={handleClose}
            className="w-full text-gray-500 hover:text-gray-700 font-medium py-2 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
