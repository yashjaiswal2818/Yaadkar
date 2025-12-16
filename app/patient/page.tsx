'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isPatientMode, getPatientModeData, PatientModeData } from '@/lib/patient-mode';
import { Camera, ShieldAlert, Users, Brain, Sun, Sunrise, Sunset, Moon, MapPin } from 'lucide-react';
import Icon from '@/components/ui/Icon';

export default function PatientHomePage() {
    const router = useRouter();
    const [patientData, setPatientData] = useState<PatientModeData | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        // Check if patient mode is enabled
        if (!isPatientMode()) {
            router.push('/');
            return;
        }

        const data = getPatientModeData();
        if (!data) {
            router.push('/');
            return;
        }

        setPatientData(data);
        setLoading(false);

        // Update time every minute
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);

        return () => clearInterval(interval);
    }, [router]);

    // Update time on mount
    useEffect(() => {
        setCurrentTime(new Date());
    }, []);

    // Get greeting based on time
    const getGreeting = () => {
        const hour = currentTime.getHours();
        if (hour < 12) return { text: 'Good Morning', Icon: Sunrise };
        if (hour < 17) return { text: 'Good Afternoon', Icon: Sun };
        if (hour < 21) return { text: 'Good Evening', Icon: Sunset };
        return { text: 'Good Night', Icon: Moon };
    };

    const { text: greetingText, Icon: GreetingIcon } = getGreeting();

    // Format date
    const formatDate = () => {
        return currentTime.toLocaleDateString('en-IN', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    // Format time
    const formatTime = () => {
        return currentTime.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 px-6 py-4">
                <div className="flex justify-between items-center max-w-2xl mx-auto">
                    <div className="flex items-center gap-2">
                        <Brain className="w-6 h-6 text-blue-600" />
                        <span className="font-semibold text-gray-800">YaadKar</span>
                    </div>
                    <span className="text-2xl font-bold text-gray-800">{formatTime()}</span>
                </div>
            </header>

            {/* Main Content */}
            <main className="px-6 py-8 max-w-2xl mx-auto">
                {/* Greeting Section */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <GreetingIcon className="w-8 h-8 text-amber-500" />
                        <h1 className="text-2xl font-semibold text-gray-700">{greetingText}</h1>
                    </div>
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        {patientData?.patientName || 'Friend'}
                    </h2>
                </div>

                {/* Today Card */}
                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 mb-8">
                    <h3 className="text-lg font-medium text-gray-500 mb-2">Today is</h3>
                    <p className="text-3xl font-bold text-blue-600 mb-4">{formatDate()}</p>

                    <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-5 h-5 text-green-500" />
                        <span className="text-lg">You are at Home</span>
                    </div>
                </div>

                {/* Main Action - WHO IS THIS */}
                <button
                    onClick={() => router.push('/patient/camera')}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-3xl p-8 shadow-xl shadow-blue-500/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] mb-6"
                >
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                            <Camera className="w-10 h-10" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">Who Is This?</p>
                            <p className="text-blue-100 text-lg mt-1">Tap to recognize someone</p>
                        </div>
                    </div>
                </button>

                {/* Secondary Actions */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <button
                        onClick={() => router.push('/patient/family')}
                        className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
                                <Users className="w-7 h-7 text-purple-600" />
                            </div>
                            <p className="font-semibold text-gray-800">My Family</p>
                        </div>
                    </button>

                    <button
                        onClick={() => router.push('/patient/games')}
                        className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                                <Brain className="w-7 h-7 text-green-600" />
                            </div>
                            <p className="font-semibold text-gray-800">Brain Game</p>
                        </div>
                    </button>
                </div>
            </main>

            {/* SOS Button - Fixed */}
            <button
                onClick={() => router.push('/patient/sos')}
                className="fixed bottom-8 right-8 w-20 h-20 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-xl shadow-red-500/30 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
            >
                <div className="text-center">
                    <ShieldAlert className="w-8 h-8 mx-auto" />
                    <span className="text-xs font-bold mt-1">SOS</span>
                </div>
            </button>
        </div>
    );
}

