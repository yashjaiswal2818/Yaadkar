'use client';

import { ReactNode } from 'react';
import { FaLock } from 'react-icons/fa';

interface GameCardProps {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  bestScore?: string;
  isLocked?: boolean;
  onClick?: () => void;
}

export default function GameCard({
  icon,
  title,
  subtitle,
  bestScore,
  isLocked = false,
  onClick,
}: GameCardProps) {
  return (
    <button
      onClick={onClick}
      disabled={isLocked}
      className={`relative w-full aspect-square bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center transition-all ${
        isLocked
          ? 'opacity-60 cursor-not-allowed'
          : 'hover:shadow-xl hover:scale-105 active:scale-95'
      }`}
    >
      {isLocked && (
        <div className="absolute top-3 right-3">
          <FaLock className="text-gray-400 text-lg" />
        </div>
      )}
      
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-1">{title}</h3>
      {subtitle && (
        <p className="text-sm text-gray-600 mb-2">{subtitle}</p>
      )}
      {bestScore && !isLocked && (
        <div className="mt-auto text-sm font-semibold text-indigo-600">
          ⭐ Best: {bestScore}
        </div>
      )}
      {isLocked && (
        <div className="mt-auto text-sm font-semibold text-gray-400">
          🔒 Coming Soon
        </div>
      )}
    </button>
  );
}




