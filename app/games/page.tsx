'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Navbar from '@/components/Navbar';
import GameCard from '@/components/games/GameCard';
import { FaArrowLeft, FaSpinner } from 'react-icons/fa';

interface GameStats {
    bestScore: string;
    bestScoreKey: string;
}

export default function GamesPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [dailyStreak, setDailyStreak] = useState(0);
    const [gameStats, setGameStats] = useState<Record<string, GameStats>>({});

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        // Load game stats for all games
        const stats: Record<string, GameStats> = {};

        // Family Quiz
        const familyQuizBest = localStorage.getItem('yaadkar-family-quiz-best-score');
        if (familyQuizBest) {
            stats['family-quiz'] = {
                bestScore: `${familyQuizBest}/5`,
                bestScoreKey: 'yaadkar-family-quiz-best-score',
            };
        }

        // Daily Orientation
        const orientationBest = localStorage.getItem('yaadkar-orientation-best-score');
        if (orientationBest) {
            stats['daily-orientation'] = {
                bestScore: `${orientationBest}/5`,
                bestScoreKey: 'yaadkar-orientation-best-score',
            };
        }

        // Color Sequence
        const colorsBest = localStorage.getItem('yaadkar-colors-best-level');
        if (colorsBest) {
            stats['color-sequence'] = {
                bestScore: `Level ${colorsBest}`,
                bestScoreKey: 'yaadkar-colors-best-level',
            };
        }

        // Picture Pairs (show best from easy difficulty)
        const pairsEasyBest = localStorage.getItem('yaadkar-pairs-easy-best');
        if (pairsEasyBest) {
            stats['picture-pairs'] = {
                bestScore: `${pairsEasyBest} moves`,
                bestScoreKey: 'yaadkar-pairs-easy-best',
            };
        }

        setGameStats(stats);

        // Calculate daily streak - check if any game was played today
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const lastPlayed = localStorage.getItem('yaadkar-games-last-played');
        if (lastPlayed) {
            const lastDate = new Date(lastPlayed);
            lastDate.setHours(0, 0, 0, 0);

            const daysDiff = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

            if (daysDiff === 0) {
                // Played today, show current streak
                const streak = parseInt(localStorage.getItem('yaadkar-games-streak') || '0');
                setDailyStreak(streak);
            }
        }
    }, []);

    if (authLoading) {
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
                        onClick={() => router.push('/dashboard')}
                        className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                    >
                        <FaArrowLeft className="text-xl text-gray-700" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                            🧠 Brain Training
                        </h1>
                        <p className="text-gray-600">Daily practice to keep your mind sharp!</p>
                    </div>
                </div>

                {/* Daily Streak */}
                {dailyStreak > 0 && (
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl p-4 mb-6 text-center shadow-lg">
                        <div className="flex items-center justify-center gap-2">
                            <span className="text-2xl">🔥</span>
                            <span className="text-lg font-bold">Daily Streak: {dailyStreak} days</span>
                        </div>
                    </div>
                )}

                {/* Games Grid */}
                <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
                    {/* Family Quiz */}
                    <GameCard
                        icon="👨‍👩‍👧"
                        title="Family Quiz"
                        subtitle="Recognize family members"
                        bestScore={gameStats['family-quiz']?.bestScore}
                        onClick={() => router.push('/games/family-quiz')}
                    />

                    {/* Daily Orientation */}
                    <GameCard
                        icon="📅"
                        title="Daily Quiz"
                        subtitle="Know today's date"
                        bestScore={gameStats['daily-orientation']?.bestScore}
                        onClick={() => router.push('/games/daily-orientation')}
                    />

                    {/* Color Memory */}
                    <GameCard
                        icon="🎨"
                        title="Color Memory"
                        subtitle="Remember the pattern"
                        bestScore={gameStats['color-sequence']?.bestScore}
                        onClick={() => router.push('/games/color-sequence')}
                    />

                    {/* Picture Match */}
                    <GameCard
                        icon="🖼️"
                        title="Picture Match"
                        subtitle="Find matching pairs"
                        bestScore={gameStats['picture-pairs']?.bestScore}
                        onClick={() => router.push('/games/picture-pairs')}
                    />
                </div>
            </div>
        </div>
    );
}




