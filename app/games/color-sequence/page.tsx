'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Navbar from '@/components/Navbar';
import { FaSpinner, FaArrowLeft, FaRedo, FaHome } from 'react-icons/fa';

type GameState = 'ready' | 'watching' | 'playing' | 'levelComplete' | 'gameOver';

const COLORS = [
  { id: 'red', color: '#EF4444', emoji: '🔴' },
  { id: 'blue', color: '#3B82F6', emoji: '🔵' },
  { id: 'green', color: '#22C55E', emoji: '🟢' },
  { id: 'yellow', color: '#EAB308', emoji: '🟡' },
  { id: 'purple', color: '#A855F7', emoji: '🟣' },
  { id: 'orange', color: '#F97316', emoji: '🟠' },
];

export default function ColorSequencePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [gameState, setGameState] = useState<GameState>('ready');
  const [level, setLevel] = useState(1);
  const [sequence, setSequence] = useState<string[]>([]);
  const [currentSequenceIndex, setCurrentSequenceIndex] = useState(0);
  const [playerSequence, setPlayerSequence] = useState<string[]>([]);
  const [bestLevel, setBestLevel] = useState(0);
  const [isColorLit, setIsColorLit] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    } else if (user) {
      setLoading(false);
      loadStats();
    }
  }, [user, authLoading, router]);

  const loadStats = () => {
    const savedBestLevel = localStorage.getItem('yaadkar-colors-best-level');
    if (savedBestLevel) setBestLevel(parseInt(savedBestLevel));
  };

  const generateSequence = useCallback((levelNum: number): string[] => {
    const length = levelNum + 1; // Level 1: 2 colors, Level 2: 3 colors, etc.
    const newSequence: string[] = [];
    for (let i = 0; i < length; i++) {
      const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
      newSequence.push(randomColor.id);
    }
    return newSequence;
  }, []);

  const startGame = useCallback(() => {
    const newLevel = 1;
    setLevel(newLevel);
    const newSequence = generateSequence(newLevel);
    setSequence(newSequence);
    setCurrentSequenceIndex(0);
    setPlayerSequence([]);
    setGameState('watching');
    playSequence(newSequence);
  }, [generateSequence]);

  const playSequence = useCallback(async (seq: string[]) => {
    setGameState('watching');
    setCurrentSequenceIndex(0);

    for (let i = 0; i < seq.length; i++) {
      setCurrentSequenceIndex(i);
      setIsColorLit(seq[i]);
      await new Promise(resolve => setTimeout(resolve, 800));
      setIsColorLit(null);
      await new Promise(resolve => setTimeout(resolve, 400));
    }

    setCurrentSequenceIndex(0);
    setGameState('playing');
  }, []);

  const handleColorTap = useCallback((colorId: string) => {
    if (gameState !== 'playing') return;

    const newPlayerSequence = [...playerSequence, colorId];
    setPlayerSequence(newPlayerSequence);

    // Brief visual feedback
    setIsColorLit(colorId);
    setTimeout(() => setIsColorLit(null), 200);

    // Check if correct
    const expectedColor = sequence[newPlayerSequence.length - 1];
    if (colorId !== expectedColor) {
      // Wrong answer
      setTimeout(() => {
        setGameState('gameOver');
        updateBestLevel();
      }, 500);
      return;
    }

    // Check if sequence complete
    if (newPlayerSequence.length === sequence.length) {
      // Level complete!
      setTimeout(() => {
        setGameState('levelComplete');
      }, 500);
    }
  }, [gameState, playerSequence, sequence]);

  const nextLevel = useCallback(() => {
    const newLevel = level + 1;
    setLevel(newLevel);
    const newSequence = generateSequence(newLevel);
    setSequence(newSequence);
    setCurrentSequenceIndex(0);
    setPlayerSequence([]);
    playSequence(newSequence);
  }, [level, generateSequence, playSequence]);

  const updateBestLevel = () => {
    if (level > bestLevel) {
      const newBestLevel = level;
      setBestLevel(newBestLevel);
      localStorage.setItem('yaadkar-colors-best-level', newBestLevel.toString());
    }
    const gamesPlayed = parseInt(localStorage.getItem('yaadkar-colors-games-played') || '0') + 1;
    localStorage.setItem('yaadkar-colors-games-played', gamesPlayed.toString());
  };

  const playAgain = useCallback(() => {
    startGame();
  }, [startGame]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh]">
          <FaSpinner className="animate-spin text-4xl text-indigo-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <Navbar />

      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.push('/games')}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            <FaArrowLeft className="text-xl text-gray-700" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            🎨 Color Memory
          </h1>
        </div>

        {/* Ready State */}
        {gameState === 'ready' && (
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-6xl mb-4">🎨</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Watch the colors
            </h2>
            <p className="text-gray-600 mb-6">Then repeat the pattern!</p>
            {bestLevel > 0 && (
              <div className="bg-indigo-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center gap-2 text-indigo-700">
                  <span className="text-xl">🏆</span>
                  <span className="font-semibold">Best Level: {bestLevel}</span>
                </div>
              </div>
            )}
            <button
              onClick={startGame}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all text-lg shadow-lg"
            >
              🎮 Start Game
            </button>
          </div>
        )}

        {/* Watching Phase */}
        {gameState === 'watching' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-4 mb-6 text-center">
              <span className="text-lg font-semibold text-gray-700">Level {level}</span>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="text-2xl font-bold text-gray-900 mb-6">👀 Watch carefully!</div>
              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                {COLORS.map((color) => (
                  <div
                    key={color.id}
                    className={`aspect-square rounded-xl flex items-center justify-center text-4xl transition-all duration-300 ${isColorLit === color.id
                        ? 'scale-125 shadow-2xl ring-4 ring-offset-2 ring-indigo-300'
                        : 'opacity-60'
                      }`}
                    style={{
                      backgroundColor: isColorLit === color.id ? color.color : `${color.color}40`,
                    }}
                  >
                    {color.emoji}
                  </div>
                ))}
              </div>
              <p className="mt-6 text-gray-600">
                Color {currentSequenceIndex + 1} of {sequence.length}...
              </p>
            </div>
          </div>
        )}

        {/* Playing Phase */}
        {gameState === 'playing' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-4 mb-6 text-center">
              <span className="text-lg font-semibold text-gray-700">Level {level}</span>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="text-2xl font-bold text-gray-900 mb-6">👆 Your turn! Tap the colors</div>
              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                {COLORS.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => handleColorTap(color.id)}
                    className={`aspect-square rounded-xl flex items-center justify-center text-4xl transition-all duration-200 hover:scale-110 active:scale-95 ${isColorLit === color.id
                        ? 'scale-125 shadow-2xl ring-4 ring-offset-2 ring-indigo-300'
                        : 'hover:shadow-lg'
                      }`}
                    style={{
                      backgroundColor: color.color,
                    }}
                  >
                    {color.emoji}
                  </button>
                ))}
              </div>
              <p className="mt-6 text-gray-600">
                Tap {playerSequence.length + 1} of {sequence.length}
              </p>
            </div>
          </div>
        )}

        {/* Level Complete */}
        {gameState === 'levelComplete' && (
          <div className="max-w-md mx-auto bg-green-50 border-2 border-green-200 rounded-2xl shadow-xl p-8 text-center">
            <div className="text-6xl mb-4 animate-bounce">🎉</div>
            <h2 className="text-3xl font-bold text-green-700 mb-6">Perfect!</h2>
            <p className="text-xl font-semibold text-gray-900 mb-6">Level {level} Complete</p>
            <button
              onClick={nextLevel}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl transition-colors text-lg"
            >
              Next Level →
            </button>
          </div>
        )}

        {/* Game Over */}
        {gameState === 'gameOver' && (
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-6xl mb-4">🎨</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Great effort!</h2>
            <p className="text-2xl font-semibold text-indigo-600 mb-4">
              You reached Level {level}
            </p>
            {bestLevel > 0 && (
              <div className="bg-indigo-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center gap-2 text-indigo-700">
                  <span className="text-xl">🏆</span>
                  <span className="font-semibold">Your Best: Level {bestLevel}</span>
                </div>
              </div>
            )}
            <div className="flex gap-3 mt-8">
              <button
                onClick={playAgain}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <FaRedo />
                🔄 Try Again
              </button>
              <button
                onClick={() => router.push('/games')}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <FaHome />
                🏠 Back to Games
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



