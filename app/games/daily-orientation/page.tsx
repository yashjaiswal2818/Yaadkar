'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useLanguage } from '@/lib/language-context';
import Navbar from '@/components/Navbar';
import QuizOption from '@/components/games/QuizOption';
import ScoreDisplay from '@/components/games/ScoreDisplay';
import { FaSpinner, FaArrowLeft, FaRedo, FaHome } from 'react-icons/fa';

type GameState = 'ready' | 'playing' | 'correct' | 'wrong' | 'finished';

const QUESTIONS_PER_GAME = 5;

interface Question {
  id: string;
  question: string;
  correctAnswer: string;
  options: string[];
  type: 'day' | 'month' | 'year' | 'season' | 'timeOfDay' | 'timeOfYear';
}

export default function DailyOrientationPage() {
  const { user, loading: authLoading } = useAuth();
  const { language } = useLanguage();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [gameState, setGameState] = useState<GameState>('ready');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    } else if (user) {
      setLoading(false);
      loadStats();
    }
  }, [user, authLoading, router]);

  const loadStats = () => {
    const savedBestScore = localStorage.getItem('yaadkar-orientation-best-score');
    if (savedBestScore) setBestScore(parseInt(savedBestScore));
  };

  const getCurrentDateInfo = () => {
    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }); // "Tuesday"
    const currentMonth = now.toLocaleDateString('en-US', { month: 'long' }); // "June"
    const currentYear = now.getFullYear(); // 2025
    const currentHour = now.getHours();
    const timeOfDay = currentHour < 12 ? 'Morning' : currentHour < 17 ? 'Afternoon' : 'Evening';

    // Season based on month
    const month = now.getMonth(); // 0-11
    const season = month < 2 || month === 11 ? 'Winter' : month < 5 ? 'Spring' : month < 8 ? 'Summer' : 'Autumn';

    // Time of year
    const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
    const daysInYear = (now.getFullYear() % 4 === 0 && now.getFullYear() % 100 !== 0) || now.getFullYear() % 400 === 0 ? 366 : 365;
    let timeOfYear = 'Middle';
    if (dayOfYear < daysInYear / 3) timeOfYear = 'Beginning';
    else if (dayOfYear > (daysInYear * 2) / 3) timeOfYear = 'End';

    return { currentDay, currentMonth, currentYear, timeOfDay, season, timeOfYear, currentHour };
  };

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const generateQuestions = useCallback((): Question[] => {
    const dateInfo = getCurrentDateInfo();
    const allQuestions: Question[] = [];

    // Question 1: What day is today?
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const wrongDays = days.filter(d => d !== dateInfo.currentDay);
    const dayOptions = shuffleArray([dateInfo.currentDay, ...shuffleArray(wrongDays).slice(0, 3)]);
    allQuestions.push({
      id: 'day',
      question: "What day is today?",
      correctAnswer: dateInfo.currentDay,
      options: shuffleArray(dayOptions),
      type: 'day',
    });

    // Question 2: What month is it?
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const currentMonthIndex = months.indexOf(dateInfo.currentMonth);
    const nearbyMonths = [
      months[(currentMonthIndex - 1 + 12) % 12],
      months[(currentMonthIndex + 1) % 12],
      months[(currentMonthIndex + 2) % 12],
    ];
    const monthOptions = shuffleArray([dateInfo.currentMonth, ...nearbyMonths]);
    allQuestions.push({
      id: 'month',
      question: "What month is it?",
      correctAnswer: dateInfo.currentMonth,
      options: shuffleArray(monthOptions),
      type: 'month',
    });

    // Question 3: What year is it?
    const yearOptions = [
      dateInfo.currentYear.toString(),
      (dateInfo.currentYear - 1).toString(),
      (dateInfo.currentYear + 1).toString(),
      (dateInfo.currentYear - 2).toString(),
    ];
    allQuestions.push({
      id: 'year',
      question: "What year is it?",
      correctAnswer: dateInfo.currentYear.toString(),
      options: shuffleArray(yearOptions),
      type: 'year',
    });

    // Question 4: What season is it?
    const seasons = ['Spring', 'Summer', 'Autumn', 'Winter'];
    const seasonEmojis: Record<string, string> = {
      'Spring': '🌸 Spring',
      'Summer': '☀️ Summer',
      'Autumn': '🍂 Autumn',
      'Winter': '❄️ Winter',
    };
    const wrongSeasons = seasons.filter(s => s !== dateInfo.season);
    const seasonOptions = shuffleArray([
      seasonEmojis[dateInfo.season],
      ...wrongSeasons.map(s => seasonEmojis[s]),
    ]);
    allQuestions.push({
      id: 'season',
      question: "What season is it?",
      correctAnswer: seasonEmojis[dateInfo.season],
      options: shuffleArray(seasonOptions),
      type: 'season',
    });

    // Question 5: Time of day
    const timeOptions = ['Morning', 'Afternoon', 'Evening'];
    allQuestions.push({
      id: 'timeOfDay',
      question: "Is it morning, afternoon, or evening?",
      correctAnswer: dateInfo.timeOfDay,
      options: shuffleArray(timeOptions),
      type: 'timeOfDay',
    });

    // Question 6: Time of year
    const timeOfYearOptions = ['Beginning', 'Middle', 'End'];
    allQuestions.push({
      id: 'timeOfYear',
      question: "What time of year is it?",
      correctAnswer: dateInfo.timeOfYear,
      options: shuffleArray(timeOfYearOptions),
      type: 'timeOfYear',
    });

    // Pick 5 random questions
    return shuffleArray(allQuestions).slice(0, QUESTIONS_PER_GAME);
  }, []);

  const startGame = useCallback(() => {
    const generatedQuestions = generateQuestions();
    setQuestions(generatedQuestions);
    setCurrentQuestionIndex(0);
    setCurrentQuestion(generatedQuestions[0]);
    setScore(0);
    setGameState('playing');
    setSelectedAnswer(null);
  }, [generateQuestions]);

  const handleAnswer = useCallback((answer: string) => {
    if (!currentQuestion || selectedAnswer) return;

    setSelectedAnswer(answer);
    const isCorrect = answer === currentQuestion.correctAnswer;

    if (isCorrect) {
      setScore(prev => prev + 1);
      setGameState('correct');
    } else {
      setGameState('wrong');
    }
  }, [currentQuestion, selectedAnswer]);

  const nextQuestion = useCallback(() => {
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex >= questions.length) {
      endGame();
    } else {
      setCurrentQuestionIndex(nextIndex);
      setCurrentQuestion(questions[nextIndex]);
      setGameState('playing');
      setSelectedAnswer(null);
    }
  }, [currentQuestionIndex, questions]);

  const endGame = useCallback(() => {
    setGameState('finished');

    // Update best score
    if (score > bestScore) {
      const newBestScore = score;
      setBestScore(newBestScore);
      localStorage.setItem('yaadkar-orientation-best-score', newBestScore.toString());
    }

    // Update stats
    localStorage.setItem('yaadkar-orientation-last-played', new Date().toISOString());

    // Update daily streak
    updateDailyStreak();
  }, [score, bestScore]);

  const updateDailyStreak = () => {
    const lastPlayed = localStorage.getItem('yaadkar-games-last-played');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (lastPlayed) {
      const lastDate = new Date(lastPlayed);
      lastDate.setHours(0, 0, 0, 0);

      const daysDiff = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDiff === 0) {
        // Already played today, don't increment
        return;
      } else if (daysDiff === 1) {
        // Consecutive day, increment streak
        const currentStreak = parseInt(localStorage.getItem('yaadkar-games-streak') || '0');
        localStorage.setItem('yaadkar-games-streak', (currentStreak + 1).toString());
      } else {
        // Streak broken, reset to 1
        localStorage.setItem('yaadkar-games-streak', '1');
      }
    } else {
      // First time playing
      localStorage.setItem('yaadkar-games-streak', '1');
    }

    localStorage.setItem('yaadkar-games-last-played', today.toISOString());
  };

  const playAgain = useCallback(() => {
    startGame();
  }, [startGame]);

  const getDateDisplay = () => {
    const dateInfo = getCurrentDateInfo();
    return `${dateInfo.currentDay}, ${dateInfo.currentMonth} ${new Date().getDate()}, ${dateInfo.currentYear}`;
  };

  const getSeasonDisplay = () => {
    const dateInfo = getCurrentDateInfo();
    const seasonEmojis: Record<string, string> = {
      'Spring': '🌸',
      'Summer': '☀️',
      'Autumn': '🍂',
      'Winter': '❄️',
    };
    return `${seasonEmojis[dateInfo.season]} ${dateInfo.season.toLowerCase()}`;
  };

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
            📅 Daily Orientation
          </h1>
        </div>

        {/* Ready State */}
        {gameState === 'ready' && (
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-6xl mb-4">📅</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Do you know what day it is today?
            </h2>
            <p className="text-gray-600 mb-6">Let's find out!</p>
            {bestScore > 0 && (
              <div className="bg-indigo-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center gap-2 text-indigo-700">
                  <span className="text-xl">🏆</span>
                  <span className="font-semibold">Your Best: {bestScore}/5</span>
                </div>
              </div>
            )}
            <button
              onClick={startGame}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all text-lg shadow-lg"
            >
              🎮 Start Quiz
            </button>
          </div>
        )}

        {/* Playing State */}
        {gameState === 'playing' && currentQuestion && (
          <div className="max-w-2xl mx-auto">
            {/* Progress Header */}
            <div className="bg-white rounded-xl shadow-lg p-4 mb-6 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">
                Question {currentQuestionIndex + 1} of {QUESTIONS_PER_GAME}
              </span>
            </div>

            {/* Question Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="text-5xl mb-6">📅</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">{currentQuestion.question}</h2>

              {/* Answer Options */}
              <div className="grid grid-cols-2 gap-4">
                {currentQuestion.options.map((option, index) => (
                  <QuizOption
                    key={index}
                    text={option}
                    onClick={() => handleAnswer(option)}
                    state={
                      selectedAnswer === option
                        ? option === currentQuestion.correctAnswer
                          ? 'correct'
                          : 'wrong'
                        : selectedAnswer && option === currentQuestion.correctAnswer
                          ? 'correct'
                          : 'default'
                    }
                    disabled={!!selectedAnswer}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Correct Answer */}
        {gameState === 'correct' && currentQuestion && (
          <div className="max-w-md mx-auto bg-green-50 border-2 border-green-200 rounded-2xl shadow-xl p-8 text-center">
            <div className="text-6xl mb-4 animate-bounce">🎉</div>
            <h2 className="text-3xl font-bold text-green-700 mb-6">That's right!</h2>
            <p className="text-xl font-semibold text-gray-900 mb-2">
              Today is {getDateDisplay()}
            </p>
            <button
              onClick={nextQuestion}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl transition-colors text-lg mt-6"
            >
              Next →
            </button>
          </div>
        )}

        {/* Wrong Answer */}
        {gameState === 'wrong' && currentQuestion && (
          <div className="max-w-md mx-auto bg-purple-50 border-2 border-purple-200 rounded-2xl shadow-xl p-8 text-center">
            <div className="text-6xl mb-4">💜</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Today is actually {currentQuestion.correctAnswer}
            </h2>
            <p className="text-lg text-gray-700 mb-2">📅 {getDateDisplay()}</p>
            <p className="text-base text-gray-600 mb-6">
              It's a beautiful {getSeasonDisplay()} day!
            </p>
            <button
              onClick={nextQuestion}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-colors text-lg"
            >
              Next →
            </button>
          </div>
        )}

        {/* Finished State */}
        {gameState === 'finished' && (
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Great job staying oriented!</h2>
            <p className="text-2xl font-semibold text-indigo-600 mb-4">
              You got {score} out of {QUESTIONS_PER_GAME}
            </p>
            <ScoreDisplay score={score} total={QUESTIONS_PER_GAME} showStars={true} />
            <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
              <p className="text-lg text-gray-700 mb-1">{getDateDisplay()}</p>
              <p className="text-base text-gray-600">It's a {getSeasonDisplay()} {getCurrentDateInfo().timeOfDay.toLowerCase()} {getCurrentDateInfo().timeOfDay === 'Morning' ? '🌅' : getCurrentDateInfo().timeOfDay === 'Afternoon' ? '☀️' : '🌙'}</p>
            </div>
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


