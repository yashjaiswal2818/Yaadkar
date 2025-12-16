'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { Brain, Award, Camera, Volume2, Users, ArrowRight, ExternalLink, Sparkles, Heart } from 'lucide-react';
import Icon from '@/components/ui/Icon';

export default function LandingPage() {
  const { user, loading, signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      router.push('/dashboard');
    } catch (error) {
      console.error('Sign in failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-md">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold text-gray-900">YaadKar</span>
                <span className="text-xs text-gray-500 ml-2">याद कर</span>
              </div>
            </div>
            {user ? (
              <button
                onClick={() => router.push('/dashboard')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
              >
                Dashboard
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSignIn}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
              >
                Sign In
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen pt-32 pb-24 px-4 flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center text-white relative z-10">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-semibold mb-6 hover:bg-white/15 transition-colors">
            <Award className="w-4 h-4" />
            <span>TechSprint AI Hack &apos;25</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight mb-4">
            <span className="bg-gradient-to-r from-blue-200 via-white to-purple-200 bg-clip-text text-transparent">
              YaadKar
            </span>
          </h1>
          <p className="mt-2 text-2xl sm:text-3xl text-white/90 font-medium">याद कर</p>

          <p className="mt-6 text-lg sm:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            Helping dementia patients recognize loved ones and feel connected, one familiar face at a time.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4">
            <p className="text-lg text-white/90 mb-2 font-medium">
              A working prototype solving a real problem for 8.8 million patients
            </p>

            {user ? (
              <button
                onClick={() => router.push('/dashboard')}
                className="px-8 py-4 text-lg font-semibold bg-white text-blue-600 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                Go to Dashboard
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSignIn}
                className="px-8 py-4 text-lg font-semibold bg-white text-blue-600 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                Try Live Demo
                <ArrowRight className="w-5 h-5" />
              </button>
            )}

            <div className="flex items-center gap-2 text-sm text-white/70 mt-2">
              <Award className="w-4 h-4" />
              <span>TechSprint AI Hack &apos;25 | Team 200</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs sm:text-sm font-semibold tracking-[0.2em] text-blue-600 mb-2 uppercase">Features</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Everything You Need</h2>
            <p className="text-lg text-gray-500">Simple tools for complex challenges</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 border border-blue-100 hover:border-blue-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-6 shadow-md">
                <Camera className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Instant Recognition</h3>
              <p className="text-gray-600 leading-relaxed">Point the camera at anyone. AI identifies them in seconds with advanced face recognition technology.</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-8 border border-purple-100 hover:border-purple-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-6 shadow-md">
                <Volume2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Voice Guidance</h3>
              <p className="text-gray-600 leading-relaxed">Hear clear, natural prompts about who is in front of you in multiple languages.</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-8 border border-green-100 hover:border-green-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-6 shadow-md">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Family Connected</h3>
              <p className="text-gray-600 leading-relaxed">Add unlimited family members so every face is remembered and recognized instantly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-red-50 via-orange-50 to-red-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs sm:text-sm font-semibold tracking-[0.2em] text-red-600 mb-2 uppercase">The Crisis</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">India&apos;s Dementia Emergency</h2>
            <p className="text-lg text-gray-600">Latest data from WHO, Lancet & ARDSI (2024)</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mb-3">8.8 Million</div>
              <p className="text-gray-700 font-medium mb-3 text-lg">People living with dementia in India</p>
              <a
                href="https://www.thelancet.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 font-medium transition-colors"
              >
                Source: Lancet
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent mb-3">90%</div>
              <p className="text-gray-700 font-medium mb-3 text-lg">Cases go undiagnosed</p>
              <a
                href="https://ardsi.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 font-medium transition-colors"
              >
                Source: ARDSI
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent mb-3">₹2.1 Lakh Cr</div>
              <p className="text-gray-700 font-medium mb-3 text-lg">Annual economic burden</p>
              <a
                href="https://www.dementiaindia.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 font-medium transition-colors"
              >
                Source: Dementia India
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs sm:text-sm font-semibold tracking-[0.2em] text-green-600 mb-2 uppercase">The Solution</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                YaadKar (याद कर)
              </span>
            </h2>
            <p className="text-lg text-gray-600">&ldquo;Remember&rdquo; - in Hindi</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border-2 border-blue-200 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-md">
                <Camera className="w-8 h-8 text-white" />
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center mx-auto mb-4 shadow-md">1</div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Point</h4>
              <p className="text-gray-600">Patient points camera at visitor</p>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-8 border-2 border-indigo-200 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-md">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center mx-auto mb-4 shadow-md">2</div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Recognize</h4>
              <p className="text-gray-600">AI identifies the person instantly</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 border-2 border-green-200 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mx-auto mb-4 shadow-md">
                <Volume2 className="w-8 h-8 text-white" />
              </div>
              <div className="w-10 h-10 rounded-full bg-green-600 text-white font-bold flex items-center justify-center mx-auto mb-4 shadow-md">3</div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Hear</h4>
              <p className="text-gray-600">&ldquo;This is Rahul, your son!&rdquo;</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-gray-400">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-md">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-white font-semibold text-lg block">YaadKar (याद कर)</span>
            </div>
          </div>
          <p className="text-gray-300 mt-2 text-base">AI-powered face recognition for dementia care</p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mt-4">
            <Award className="w-4 h-4" />
            <span>Hackathon Project | TechSprint AI Hack &apos;25 | Team 200</span>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Built with Next.js, Firebase, Groq AI & Google Gemini
          </p>
        </div>
      </footer>
    </div>
  );
}
