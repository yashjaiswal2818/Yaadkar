'use client';

import { useEffect, useState } from 'react';
import { FaCheck } from 'react-icons/fa';

interface SuccessAnimationProps {
  message?: string;
  onComplete?: () => void;
  duration?: number;
}

export default function SuccessAnimation({ 
  message = 'Success!', 
  onComplete,
  duration = 2000 
}: SuccessAnimationProps) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      onComplete?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center animate-fade-in">
      <div className="bg-white rounded-2xl p-8 text-center animate-bounce-in">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaCheck className="text-4xl text-green-600" />
        </div>
        <p className="text-xl font-semibold text-gray-800">{message}</p>
      </div>
    </div>
  );
}



