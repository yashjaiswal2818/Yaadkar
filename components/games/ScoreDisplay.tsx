'use client';

import { FaFire, FaTrophy } from 'react-icons/fa';

interface ScoreDisplayProps {
  score: number;
  total: number;
  bestStreak?: number;
  showStars?: boolean;
}

export default function ScoreDisplay({
  score,
  total,
  bestStreak,
  showStars = true,
}: ScoreDisplayProps) {
  const stars = Math.round((score / total) * 5);
  const percentage = Math.round((score / total) * 100);

  return (
    <div className="text-center">
      {showStars && (
        <div className="text-3xl mb-4">
          {'⭐'.repeat(stars)}{'☆'.repeat(5 - stars)}
        </div>
      )}

      <div className="text-2xl font-semibold text-indigo-600 mb-2">
        {score} out of {total}
      </div>

      {bestStreak !== undefined && bestStreak > 0 && (
        <div className="inline-flex items-center justify-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-lg mt-4">
          <FaFire className="text-lg" />
          <span className="font-bold">Best Streak: {bestStreak}</span>
        </div>
      )}
    </div>
  );
}



