'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Navbar from '@/components/Navbar';
import { FaSpinner, FaArrowLeft, FaRedo, FaHome } from 'react-icons/fa';

type GameState = 'ready' | 'playing' | 'won';
type Difficulty = 'easy' | 'medium' | 'hard';

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const CARD_EMOJIS = [
  '🍎', '🍌', '🍊', '🍇', '🍓', '🍒', // Fruits
  '🌸', '🌻', '🌺', '🌹', '🌷', '💐', // Flowers
  '⭐', '🌙', '☀️', '❤️', '💜', '💙', // Symbols
  '🐱', '🐶', '🐦', '🦋', '🐢', '🐰', // Animals
];

const DIFFICULTY_CONFIG = {
  easy: { pairs: 3, cols: 2, rows: 3 },
  medium: { pairs: 6, cols: 3, rows: 4 },
  hard: { pairs: 8, cols: 4, rows: 4 },
};

export default function PicturePairsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [gameState, setGameState] = useState<GameState>('ready');
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [gameStartTime, setGameStartTime] = useState<Date | null>(null);
  const [gameTime, setGameTime] = useState(0);
  const [bestScores, setBestScores] = useState<Record<Difficulty, number>>({
    easy: 0,
    medium: 0,
    hard: 0,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    } else if (user) {
      setLoading(false);
      loadStats();
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState === 'playing' && gameStartTime) {
      interval = setInterval(() => {
        setGameTime(Math.floor((new Date().getTime() - gameStartTime.getTime()) / 1000));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameState, gameStartTime]);

  const loadStats = () => {
    const easyBest = localStorage.getItem('yaadkar-pairs-easy-best');
    const mediumBest = localStorage.getItem('yaadkar-pairs-medium-best');
    const hardBest = localStorage.getItem('yaadkar-pairs-hard-best');

    if (easyBest) setBestScores(prev => ({ ...prev, easy: parseInt(easyBest) }));
    if (mediumBest) setBestScores(prev => ({ ...prev, medium: parseInt(mediumBest) }));
    if (hardBest) setBestScores(prev => ({ ...prev, hard: parseInt(hardBest) }));
  };

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const setupCards = useCallback((pairCount: number): Card[] => {
    const selected = shuffleArray(CARD_EMOJIS).slice(0, pairCount);
    const cardPairs = [...selected, ...selected];
    const cardsWithIds = cardPairs.map((emoji, index) => ({
      id: index,
      emoji,
      isFlipped: false,
      isMatched: false,
    }));
    return shuffleArray(cardsWithIds);
  }, []);

  const startGame = useCallback((diff: Difficulty) => {
    setDifficulty(diff);
    const config = DIFFICULTY_CONFIG[diff];
    const newCards = setupCards(config.pairs);
    setCards(newCards);
    setFlippedCards([]);
    setMoves(0);
    setMatchedPairs(0);
    setGameStartTime(new Date());
    setGameTime(0);
    setGameState('playing');
  }, [setupCards]);

  const handleCardTap = useCallback((cardId: number) => {
    if (gameState !== 'playing') return;
    if (flippedCards.length === 2) return;

    const card = cards.find(c => c.id === cardId);
    if (!card || card.isMatched || flippedCards.includes(cardId)) return;

    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);

    // Update card to show it's flipped
    setCards(prev => prev.map(c =>
      c.id === cardId ? { ...c, isFlipped: true } : c
    ));

    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      checkMatch(newFlipped);
    }
  }, [gameState, flippedCards, cards]);

  const checkMatch = useCallback((flipped: number[]) => {
    const [id1, id2] = flipped;
    const card1 = cards.find(c => c.id === id1);
    const card2 = cards.find(c => c.id === id2);

    if (card1 && card2 && card1.emoji === card2.emoji) {
      // Match found!
      setTimeout(() => {
        setCards(prev => prev.map(c =>
          flipped.includes(c.id) ? { ...c, isMatched: true, isFlipped: true } : c
        ));
        setMatchedPairs(prev => {
          const newCount = prev + 1;
          const config = difficulty ? DIFFICULTY_CONFIG[difficulty] : null;
          if (config && newCount === config.pairs) {
            // Game won!
            setTimeout(() => {
              setGameState('won');
              updateBestScore();
            }, 500);
          }
          return newCount;
        });
        setFlippedCards([]);
      }, 500);
    } else {
      // No match - flip back
      setTimeout(() => {
        setCards(prev => prev.map(c =>
          flipped.includes(c.id) ? { ...c, isFlipped: false } : c
        ));
        setFlippedCards([]);
      }, 1000);
    }
  }, [cards, difficulty]);

  const updateBestScore = () => {
    if (!difficulty) return;

    const currentBest = bestScores[difficulty];
    if (currentBest === 0 || moves < currentBest) {
      const newBest = moves;
      setBestScores(prev => ({ ...prev, [difficulty]: newBest }));
      localStorage.setItem(`yaadkar-pairs-${difficulty}-best`, newBest.toString());
    }

    const gamesPlayed = parseInt(localStorage.getItem('yaadkar-pairs-games-played') || '0') + 1;
    localStorage.setItem('yaadkar-pairs-games-played', gamesPlayed.toString());
  };

  const getStars = (movesCount: number, diff: Difficulty): number => {
    const config = DIFFICULTY_CONFIG[diff];
    if (diff === 'easy') {
      if (movesCount <= 8) return 5;
      if (movesCount <= 12) return 4;
      if (movesCount <= 16) return 3;
      return 2;
    } else if (diff === 'medium') {
      if (movesCount <= 12) return 5;
      if (movesCount <= 18) return 4;
      if (movesCount <= 24) return 3;
      return 2;
    } else {
      if (movesCount <= 16) return 5;
      if (movesCount <= 24) return 4;
      if (movesCount <= 32) return 3;
      return 2;
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const playAgain = useCallback(() => {
    if (difficulty) {
      startGame(difficulty);
    }
  }, [difficulty, startGame]);

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
            🖼️ Picture Match
          </h1>
        </div>

        {/* Ready State */}
        {gameState === 'ready' && (
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-6xl mb-4">🖼️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Find the matching pairs!
            </h2>
            <p className="text-gray-600 mb-6">Choose difficulty:</p>

            <div className="space-y-3 mb-6">
              <button
                onClick={() => startGame('easy')}
                className="w-full bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-semibold py-4 px-6 rounded-xl transition-all text-lg"
              >
                😊 Easy - 3 pairs
              </button>
              <button
                onClick={() => startGame('medium')}
                className="w-full bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-semibold py-4 px-6 rounded-xl transition-all text-lg"
              >
                🤔 Medium - 6 pairs
              </button>
              <button
                onClick={() => startGame('hard')}
                className="w-full bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-semibold py-4 px-6 rounded-xl transition-all text-lg"
              >
                🧠 Hard - 8 pairs
              </button>
            </div>

            {bestScores.easy > 0 && (
              <div className="bg-indigo-50 rounded-lg p-4">
                <div className="text-sm font-semibold text-indigo-700">
                  🏆 Best: {bestScores.easy} moves (Easy)
                </div>
              </div>
            )}
          </div>
        )}

        {/* Playing State */}
        {gameState === 'playing' && difficulty && (
          <div className="max-w-2xl mx-auto">
            {/* Stats Header */}
            <div className="bg-white rounded-xl shadow-lg p-4 mb-6 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">
                Moves: {moves}
              </span>
              <span className="text-sm font-medium text-gray-600">
                Pairs: {matchedPairs}/{DIFFICULTY_CONFIG[difficulty].pairs}
              </span>
              <span className="text-sm font-medium text-gray-600">
                Time: {formatTime(gameTime)}
              </span>
            </div>

            {/* Cards Grid */}
            <div
              className="bg-white rounded-2xl shadow-xl p-6"
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${DIFFICULTY_CONFIG[difficulty].cols}, 1fr)`,
                gap: '1rem',
              }}
            >
              {cards.map((card) => (
                <button
                  key={card.id}
                  onClick={() => handleCardTap(card.id)}
                  disabled={flippedCards.length === 2 && !flippedCards.includes(card.id)}
                  className={`aspect-square rounded-xl flex items-center justify-center text-4xl transition-all duration-300 ${card.isMatched
                      ? 'bg-green-100 border-4 border-green-400 scale-105'
                      : card.isFlipped
                        ? 'bg-indigo-100 border-4 border-indigo-400 scale-105'
                        : 'bg-gray-200 border-4 border-gray-300 hover:scale-105 active:scale-95'
                    } ${flippedCards.length === 2 && !flippedCards.includes(card.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  style={{
                    minHeight: '80px',
                  }}
                >
                  {card.isFlipped || card.isMatched ? (
                    <span>{card.emoji}</span>
                  ) : (
                    <span className="text-3xl">❓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Won State */}
        {gameState === 'won' && difficulty && (
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-6xl mb-4 animate-bounce">🎉</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">You found all pairs!</h2>
            <p className="text-xl font-semibold text-indigo-600 mb-2">Moves: {moves}</p>
            <p className="text-lg text-gray-700 mb-6">Time: {formatTime(gameTime)}</p>

            {bestScores[difficulty] > 0 && moves <= bestScores[difficulty] && (
              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 mb-6">
                <p className="text-lg font-bold text-yellow-700">🏆 New Best Score!</p>
              </div>
            )}

            <div className="text-3xl mb-6">
              {'⭐'.repeat(getStars(moves, difficulty))}
              {'☆'.repeat(5 - getStars(moves, difficulty))}
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={playAgain}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <FaRedo />
                🔄 Play Again
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


