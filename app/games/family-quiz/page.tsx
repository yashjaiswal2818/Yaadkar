'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useLanguage } from '@/lib/language-context';
import { getPatient, getPeople, speakText } from '@/lib/api';
import { buildSpeechTextForLanguage } from '@/lib/speech-messages';
import { Patient, Person } from '@/types';
import Navbar from '@/components/Navbar';
import QuizOption from '@/components/games/QuizOption';
import ScoreDisplay from '@/components/games/ScoreDisplay';
import { FaSpinner, FaArrowLeft, FaVolumeUp, FaRedo, FaHome, FaFire } from 'react-icons/fa';

type GameState = 'ready' | 'playing' | 'correct' | 'wrong' | 'finished';

const QUESTIONS_PER_GAME = 5;
const GENERIC_NAMES = ['Friend', 'Neighbor', 'Doctor', 'Caregiver'];

export default function FamilyQuizPage() {
    const { user, loading: authLoading } = useAuth();
    const { language } = useLanguage();
    const router = useRouter();
    const [patient, setPatient] = useState<Patient | null>(null);
    const [people, setPeople] = useState<Person[]>([]);
    const [loading, setLoading] = useState(true);
    const [gameState, setGameState] = useState<GameState>('ready');
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [shuffledPeople, setShuffledPeople] = useState<Person[]>([]);
    const [currentPerson, setCurrentPerson] = useState<Person | null>(null);
    const [options, setOptions] = useState<string[]>([]);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [bestScore, setBestScore] = useState(0);
    const [bestStreak, setBestStreak] = useState(0);

    // Redirect if not logged in
    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/');
        }
    }, [user, authLoading, router]);

    // Fetch data
    useEffect(() => {
        if (user) {
            fetchData();
            loadStats();
        }
    }, [user]);

    const fetchData = async () => {
        if (!user) return;

        setLoading(true);
        try {
            const patientResponse = await getPatient(user.uid);
            let patientData: Patient | null = null;

            if (Array.isArray(patientResponse.data) && patientResponse.data.length > 0) {
                patientData = patientResponse.data[0];
            } else if (patientResponse.data && typeof patientResponse.data === 'object') {
                patientData = patientResponse.data as Patient;
            }

            if (patientData?.id) {
                setPatient(patientData);
                const peopleResponse = await getPeople(user.uid, patientData.id);
                let peopleArray: Person[] = [];

                if (Array.isArray(peopleResponse.data)) {
                    peopleArray = peopleResponse.data;
                } else if (peopleResponse.data && typeof peopleResponse.data === 'object') {
                    peopleArray = [peopleResponse.data as Person];
                }

                setPeople(peopleArray);
            }
        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    const loadStats = () => {
        const savedBestScore = localStorage.getItem('yaadkar-family-quiz-best-score');
        const savedBestStreak = localStorage.getItem('yaadkar-family-quiz-best-streak');

        if (savedBestScore) setBestScore(parseInt(savedBestScore));
        if (savedBestStreak) setBestStreak(parseInt(savedBestStreak));
    };

    const shuffleArray = <T,>(array: T[]): T[] => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    const startGame = useCallback(() => {
        if (people.length < 1) return;

        const shuffled = shuffleArray(people).slice(0, QUESTIONS_PER_GAME);
        setShuffledPeople(shuffled);
        setCurrentQuestion(0);
        setScore(0);
        setStreak(0);
        setGameState('playing');
        loadQuestion(shuffled, 0);
    }, [people]);

    const loadQuestion = useCallback((peopleList: Person[], questionIndex: number) => {
        if (questionIndex >= peopleList.length) {
            endGame();
            return;
        }

        const person = peopleList[questionIndex];
        setCurrentPerson(person);

        // Generate wrong answers
        const wrongPeople = peopleList.filter(p => p.id !== person.id);
        const wrongNames = wrongPeople.map(p => p.name);

        // If we need more wrong answers, add generic names
        let allWrongNames = [...wrongNames];
        while (allWrongNames.length < 3) {
            const generic = GENERIC_NAMES[allWrongNames.length % GENERIC_NAMES.length];
            if (!allWrongNames.includes(generic)) {
                allWrongNames.push(generic);
            } else {
                break;
            }
        }

        const wrongOptions = shuffleArray(allWrongNames).slice(0, 3);
        const allOptions = shuffleArray([person.name, ...wrongOptions]);

        setOptions(allOptions);
        setSelectedAnswer(null);
    }, []);

    const handleAnswer = useCallback((answer: string) => {
        if (!currentPerson || selectedAnswer) return;

        setSelectedAnswer(answer);
        const isCorrect = answer === currentPerson.name;

        if (isCorrect) {
            setScore(prev => prev + 1);
            setStreak(prev => {
                const newStreak = prev + 1;
                if (newStreak > bestStreak) {
                    const newBestStreak = newStreak;
                    setBestStreak(newBestStreak);
                    localStorage.setItem('yaadkar-family-quiz-best-streak', newBestStreak.toString());
                }
                return newStreak;
            });
            setGameState('correct');
        } else {
            setStreak(0);
            setGameState('wrong');
        }
    }, [currentPerson, selectedAnswer, bestStreak]);

    const nextQuestion = useCallback(() => {
        const nextIndex = currentQuestion + 1;
        if (nextIndex >= shuffledPeople.length) {
            endGame();
        } else {
            setCurrentQuestion(nextIndex);
            loadQuestion(shuffledPeople, nextIndex);
            setGameState('playing');
        }
    }, [currentQuestion, shuffledPeople, loadQuestion]);

    const endGame = useCallback(() => {
        setGameState('finished');

        // Update best score
        if (score > bestScore) {
            const newBestScore = score;
            setBestScore(newBestScore);
            localStorage.setItem('yaadkar-family-quiz-best-score', newBestScore.toString());
        }

        // Update stats
        const gamesPlayed = parseInt(localStorage.getItem('yaadkar-family-quiz-games-played') || '0') + 1;
        localStorage.setItem('yaadkar-family-quiz-games-played', gamesPlayed.toString());
        localStorage.setItem('yaadkar-family-quiz-last-played', new Date().toISOString());

        // Update daily streak
        const lastPlayed = localStorage.getItem('yaadkar-family-quiz-last-played');
        if (lastPlayed) {
            const lastDate = new Date(lastPlayed);
            const today = new Date();
            if (lastDate.toDateString() === today.toDateString()) {
                const currentStreak = parseInt(localStorage.getItem('yaadkar-daily-streak') || '0');
                localStorage.setItem('yaadkar-daily-streak', (currentStreak + 1).toString());
            }
        }
    }, [score, bestScore]);

    const playAgain = useCallback(() => {
        startGame();
    }, [startGame]);

    const speakPersonInfo = useCallback(() => {
        if (!currentPerson) return;
        const text = buildSpeechTextForLanguage(currentPerson, language);
        speakText(text, language);
    }, [currentPerson, language]);

    // Confetti component
    const Confetti = () => (
        <div className="fixed inset-0 pointer-events-none z-50">
            {[...Array(50)].map((_, i) => (
                <div
                    key={i}
                    className="absolute w-2 h-2 rounded-full animate-confetti"
                    style={{
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 2}s`,
                        backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'][Math.floor(Math.random() * 5)],
                    }}
                />
            ))}
        </div>
    );

    // Translations
    const translations: Record<string, Record<string, string>> = {
        'en-IN': {
            back: 'Back',
            practice: 'Practice recognizing your family members!',
            questions: '5 questions',
            yourBest: 'Your Best',
            startGame: '🎮 Start Game',
            question: 'Question',
            of: 'of',
            whoIsThis: 'Who is this person?',
            correct: 'Correct!',
            thisIs: 'This is',
            your: 'Your',
            next: 'Next',
            letMeHelp: "Let me help you remember...",
            tellMeMore: '🔊 Tell Me More',
            greatPractice: 'Great Practice!',
            youGot: 'You got',
            outOf: 'out of',
            playAgain: '🔄 Play Again',
            backToGames: '🏠 Back to Games',
        },
        'hi-IN': {
            back: 'वापस',
            practice: 'अपने परिवार के सदस्यों को पहचानने का अभ्यास करें!',
            questions: '5 प्रश्न',
            yourBest: 'आपका सर्वश्रेष्ठ',
            startGame: '🎮 खेल शुरू करें',
            question: 'प्रश्न',
            of: 'का',
            whoIsThis: 'यह व्यक्ति कौन है?',
            correct: 'सही!',
            thisIs: 'यह है',
            your: 'आपका/आपकी',
            next: 'अगला',
            letMeHelp: 'मुझे आपको याद दिलाने में मदद करने दें...',
            tellMeMore: '🔊 और बताएं',
            greatPractice: 'बहुत बढ़िया अभ्यास!',
            youGot: 'आपको मिला',
            outOf: 'में से',
            playAgain: '🔄 फिर से खेलें',
            backToGames: '🏠 गेम्स पर वापस',
        },
    };

    const t = translations[language] || translations['en-IN'];

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

    if (people.length < 1) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="container mx-auto px-4 py-8">
                    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto text-center">
                        <div className="text-6xl mb-4">👥</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Add Family Members</h2>
                        <p className="text-gray-600 mb-6">You need at least 1 family member to play.</p>
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                        >
                            {t.backToGames}
                        </button>
                    </div>
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
                        👨‍👩‍👧 Family Quiz
                    </h1>
                </div>

                {/* Ready State */}
                {gameState === 'ready' && (
                    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
                        <div className="text-6xl mb-4">🧠</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.practice}</h2>
                        <p className="text-gray-600 mb-6">{t.questions}</p>
                        {bestScore > 0 && (
                            <div className="bg-indigo-50 rounded-lg p-4 mb-6">
                                <div className="flex items-center justify-center gap-2 text-indigo-700">
                                    <FaFire className="text-xl" />
                                    <span className="font-semibold">{t.yourBest}: {bestScore}/5</span>
                                </div>
                            </div>
                        )}
                        <button
                            onClick={startGame}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all text-lg shadow-lg"
                        >
                            {t.startGame}
                        </button>
                    </div>
                )}

                {/* Playing State */}
                {gameState === 'playing' && currentPerson && (
                    <div className="max-w-2xl mx-auto">
                        {/* Progress Header */}
                        <div className="bg-white rounded-xl shadow-lg p-4 mb-6 flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600">
                                {t.question} {currentQuestion + 1} {t.of} {QUESTIONS_PER_GAME}
                            </span>
                            {streak > 0 && (
                                <div className="flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-lg">
                                    <FaFire className="text-lg" />
                                    <span className="font-bold">Streak: {streak}</span>
                                </div>
                            )}
                        </div>

                        {/* Question Card */}
                        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                            {/* Person Photo */}
                            <div className="mb-6">
                                <div className="w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-indigo-200 shadow-lg bg-gray-100">
                                    {currentPerson.photo_url || currentPerson.photo_base64 ? (
                                        <img
                                            src={currentPerson.photo_url || currentPerson.photo_base64}
                                            alt={currentPerson.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-6xl text-gray-400">
                                            {currentPerson.name.charAt(0)}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold text-gray-900 mb-8">{t.whoIsThis}</h2>

                            {/* Answer Options */}
                            <div className="grid grid-cols-2 gap-4">
                                {options.map((option, index) => (
                                    <QuizOption
                                        key={index}
                                        text={option}
                                        onClick={() => handleAnswer(option)}
                                        state={
                                            selectedAnswer === option
                                                ? option === currentPerson.name
                                                    ? 'correct'
                                                    : 'wrong'
                                                : selectedAnswer && option === currentPerson.name
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
                {gameState === 'correct' && currentPerson && (
                    <>
                        {score >= 4 && <Confetti />}
                        <div className="max-w-md mx-auto bg-green-50 border-2 border-green-200 rounded-2xl shadow-xl p-8 text-center">
                            <div className="text-6xl mb-4 animate-bounce">🎉</div>
                            <h2 className="text-3xl font-bold text-green-700 mb-6">{t.correct}</h2>

                            {/* Person Photo */}
                            <div className="mb-4">
                                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-green-300 shadow-lg bg-white">
                                    {currentPerson.photo_url || currentPerson.photo_base64 ? (
                                        <img
                                            src={currentPerson.photo_url || currentPerson.photo_base64}
                                            alt={currentPerson.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400">
                                            {currentPerson.name.charAt(0)}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <p className="text-xl font-semibold text-gray-900 mb-2">
                                {t.thisIs} {currentPerson.name}
                            </p>
                            {currentPerson.relationship && (
                                <p className="text-lg text-gray-700 mb-1">
                                    {t.your} {currentPerson.relationship}
                                </p>
                            )}
                            {currentPerson.nickname && (
                                <p className="text-lg text-indigo-600 mb-6">"{currentPerson.nickname}"</p>
                            )}

                            {streak > 0 && (
                                <div className="inline-flex items-center justify-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-lg mb-6">
                                    <FaFire className="text-lg" />
                                    <span className="font-bold">Streak: {streak}</span>
                                </div>
                            )}

                            <button
                                onClick={nextQuestion}
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl transition-colors text-lg"
                            >
                                {t.next} →
                            </button>
                        </div>
                    </>
                )}

                {/* Wrong Answer */}
                {gameState === 'wrong' && currentPerson && (
                    <div className="max-w-md mx-auto bg-purple-50 border-2 border-purple-200 rounded-2xl shadow-xl p-8 text-center">
                        <div className="text-6xl mb-4">💜</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">{t.letMeHelp}</h2>

                        {/* Person Photo */}
                        <div className="mb-4">
                            <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-purple-300 shadow-lg bg-white">
                                {currentPerson.photo_url || currentPerson.photo_base64 ? (
                                    <img
                                        src={currentPerson.photo_url || currentPerson.photo_base64}
                                        alt={currentPerson.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400">
                                        {currentPerson.name.charAt(0)}
                                    </div>
                                )}
                            </div>
                        </div>

                        <p className="text-xl font-semibold text-gray-900 mb-2">
                            {t.thisIs} {currentPerson.name}
                        </p>
                        {currentPerson.relationship && (
                            <p className="text-lg text-gray-700 mb-1">
                                {t.your} {currentPerson.relationship}
                            </p>
                        )}
                        {currentPerson.nickname && (
                            <p className="text-lg text-indigo-600 mb-2">"{currentPerson.nickname}"</p>
                        )}
                        {currentPerson.details && (
                            <p className="text-base text-gray-600 mb-6">{currentPerson.details}</p>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={speakPersonInfo}
                                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                <FaVolumeUp />
                                {t.tellMeMore}
                            </button>
                            <button
                                onClick={nextQuestion}
                                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                            >
                                {t.next} →
                            </button>
                        </div>
                    </div>
                )}

                {/* Finished State */}
                {gameState === 'finished' && (
                    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
                        <div className="text-6xl mb-4">🏆</div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">{t.greatPractice}</h2>

                        <p className="text-2xl font-semibold text-indigo-600 mb-4">
                            {t.youGot} {score} {t.outOf} {QUESTIONS_PER_GAME}
                        </p>

                        <ScoreDisplay
                            score={score}
                            total={QUESTIONS_PER_GAME}
                            bestStreak={bestStreak}
                            showStars={true}
                        />

                        <div className="flex gap-3 mt-8">
                            <button
                                onClick={playAgain}
                                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                <FaRedo />
                                {t.playAgain}
                            </button>
                            <button
                                onClick={() => router.push('/games')}
                                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                <FaHome />
                                {t.backToGames}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

