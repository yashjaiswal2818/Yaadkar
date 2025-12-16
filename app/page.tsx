'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/Icon';
import Button from '@/components/ui/Button';

export default function LandingPage() {
  const { user, loading, signInWithGoogle, logout } = useAuth();
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      // Redirect after successful sign in
      router.push('/dashboard');
    } catch (error) {
      console.error('Sign in failed:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <Icon name="loader" size={32} className="text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Prototype Badge */}
      <div className="fixed top-20 right-4 z-50 hidden md:block">
        <span className="bg-amber-500 text-white text-xs px-3 py-1.5 rounded-full shadow-lg font-medium inline-flex items-center gap-1.5">
          <Icon name="award" size={14} />
          <span>Hackathon Prototype</span>
        </span>
      </div>

      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-50 glass border-b border-neutral-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                <Icon name="heart" size={18} className="text-white" />
              </div>
              <span className="text-lg font-bold text-neutral-900">YaadKar</span>
            </div>
            {user ? (
              <div className="flex items-center gap-3">
                <Button onClick={() => router.push('/dashboard')} size="md">
                  Dashboard
                  <Icon name="arrowRight" size={16} />
                </Button>
              </div>
            ) : (
              <Button onClick={handleSignIn} size="md">
                Sign In
                <Icon name="arrowRight" size={16} />
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-hero-gradient animate-hero-gradient" />

        {/* Decorative floating blobs */}
        <div className="pointer-events-none">
          <div className="blob blob-blue" />
          <div className="blob blob-purple" />
          <div className="blob blob-indigo" />
        </div>

        {/* Hero content */}
        <div className="relative min-h-screen pt-32 pb-24 px-4 flex items-center justify-center">
          <div className="max-w-4xl mx-auto text-center text-white stagger-children">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass border border-white/20 text-xs sm:text-sm font-semibold text-white/90 shadow-soft animate-fade-in-up">
              <Icon name="award" size={18} className="text-white" />
              <span>TechSprint AI Hack &apos;25</span>
            </div>

            {/* Headline */}
            <div className="mt-6 animate-fade-in-up">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight">
                <span className="bg-gradient-to-r from-primary-200 via-accent-100 to-secondary-200 bg-clip-text text-transparent">
                  YaadKar
                </span>
              </h1>
              <p className="mt-2 text-2xl sm:text-3xl text-white/80">
                याद कर
              </p>
            </div>

            {/* Tagline */}
            <p className="mt-6 text-lg sm:text-xl text-neutral-100/80 max-w-2xl mx-auto animate-fade-in-up">
              Helping dementia patients recognize loved ones and feel connected,
              one familiar face at a time.
            </p>

            {/* Icon illustration */}
            <div className="mt-10 flex justify-center animate-scale-in">
              <div className="relative w-40 h-40 sm:w-52 sm:h-52 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl shadow-soft-lg flex items-center justify-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/10 flex items-center justify-center animate-float">
                  <Icon name="heart" size={32} className="text-white" />
                </div>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center animate-float" style={{ animationDelay: '0.1s' }}>
                  <Icon name="user" size={20} className="text-white" />
                </div>
                <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center animate-float" style={{ animationDelay: '0.2s' }}>
                  <Icon name="user" size={20} className="text-white" />
                </div>
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center animate-float" style={{ animationDelay: '0.3s' }}>
                  <Icon name="users" size={20} className="text-white" />
                </div>
                <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center animate-float" style={{ animationDelay: '0.4s' }}>
                  <Icon name="heart" size={20} className="text-white" />
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-10 flex flex-col items-center gap-4 animate-fade-in-up">
              <p className="text-lg text-neutral-100/90 mb-6 text-center max-w-2xl">
                A working prototype solving a real problem for 8.8 million patients
              </p>

              {user ? (
                <Button
                  onClick={() => router.push('/dashboard')}
                  size="xl"
                  icon="arrowRight"
                  iconPosition="right"
                  className="bg-gradient-to-r from-primary-500 via-accent-500 to-secondary-500 text-white shadow-soft-lg hover:shadow-glow hover:brightness-110 border border-white/10"
                >
                  Go to Dashboard
                </Button>
              ) : (
                <Button
                  onClick={handleSignIn}
                  size="xl"
                  icon="arrowRight"
                  iconPosition="right"
                  className="bg-gradient-to-r from-primary-500 via-accent-500 to-secondary-500 text-white shadow-soft-lg hover:shadow-glow hover:brightness-110 border border-white/10"
                >
                  Try Live Demo
                </Button>
              )}

              <p className="text-sm text-neutral-100/70 mt-4 flex items-center justify-center gap-2">
                <Icon name="award" size={14} className="text-neutral-100/70" />
                <span>TechSprint AI Hack &apos;25 | Team 200</span>
              </p>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 inset-x-0 flex justify-center">
            <div className="flex flex-col items-center gap-2 text-neutral-100/80 text-xs sm:text-sm">
              <span>Scroll to learn more</span>
              <div className="w-7 h-12 rounded-full border border-white/40 flex items-start justify-center p-1">
                <div className="w-1.5 h-3 rounded-full bg-white/80 animate-bounce-arrow" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <p className="text-xs sm:text-sm font-semibold tracking-[0.2em] text-primary-600 mb-2">
              FEATURES
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-3">
              Everything You Need
            </h2>
            <p className="text-base sm:text-lg text-neutral-500">
              Simple tools for complex challenges
            </p>
          </div>

          <div className="space-y-10 md:space-y-16">
            {/* Card 1 - Face Recognition */}
            <div className="grid md:grid-cols-2 gap-10 items-center animate-fade-in-up">
              <div className="order-1">
                <div className="group relative rounded-3xl p-[1px] bg-gradient-to-br from-primary-200/60 via-accent-200/40 to-primary-100/60 hover:from-primary-300/80 hover:via-accent-200/70 hover:to-primary-200/80 transition-all duration-300">
                  <div className="card rounded-3xl p-8 h-full bg-white/90 backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-soft-lg">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-soft text-white group-hover:shadow-soft-lg transform group-hover:scale-105 transition-all duration-300 group-hover:animate-pulse">
                        <Icon name="camera" size={28} />
                      </div>
                      <div className="text-left">
                        <h3 className="text-xl font-bold text-neutral-900">
                          Instant Recognition
                        </h3>
                        <p className="text-sm text-neutral-500">
                          Face Recognition
                        </p>
                      </div>
                    </div>
                    <p className="text-neutral-600 leading-relaxed mb-4">
                      Point the camera at anyone. YaadKar&apos;s AI identifies them in seconds and shows exactly who they are.
                    </p>
                  </div>
                </div>
              </div>

              {/* Illustration: face with scanning effect */}
              <div className="order-2">
                <div className="relative mx-auto w-64 h-56 sm:w-72 sm:h-64 rounded-3xl bg-gradient-to-br from-primary-50 via-accent-50 to-white border border-primary-100/70 shadow-soft overflow-hidden flex items-center justify-center">
                  <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-3xl bg-white shadow-soft flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-3xl text-white">
                      👵
                    </div>
                    <div className="absolute inset-3 rounded-2xl border border-primary-200/70" />
                    <div className="absolute inset-x-3 h-1.5 bg-gradient-to-r from-transparent via-primary-400/70 to-transparent rounded-full scan-line" />
                  </div>
                  <div className="absolute -bottom-6 right-4 w-32 h-16 rounded-2xl bg-white/90 border border-primary-100 shadow-soft flex items-center gap-3 px-3">
                    <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-lg">
                      <Icon name="user" size={18} className="text-primary-600" />
                    </div>
                    <div className="text-xs text-left">
                      <p className="font-semibold text-neutral-900">Grandma Sita</p>
                      <p className="text-neutral-500">Last visited: 2 days ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2 - Voice Assistant (zigzag layout) */}
            <div className="grid md:grid-cols-2 gap-10 items-center animate-fade-in-up">
              {/* Illustration: sound wave */}
              <div className="order-1 md:order-2">
                <div className="relative mx-auto w-64 h-56 sm:w-72 sm:h-64 rounded-3xl bg-gradient-to-br from-secondary-50 via-accent-50 to-white border border-secondary-100/70 shadow-soft overflow-hidden flex items-center justify-center">
                  <div className="absolute top-6 left-6 inline-flex items-center gap-2 rounded-full bg-white/90 border border-secondary-100 px-3 py-1 text-xs text-neutral-700 shadow-soft">
                    <Icon name="volume" size={14} className="text-secondary-600" />
                    <span>Speaking...</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 sm:gap-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-2 sm:w-2.5 rounded-full bg-gradient-to-t from-secondary-500 to-accent-400 sound-bar"
                        style={{
                          height: `${18 + i * 6}px`,
                          animationDelay: `${i * 0.1}s`,
                        }}
                      />
                    ))}
                  </div>
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-xs text-neutral-600 px-4">
                    &ldquo;This is your daughter Meera. Ask her about her new job.&rdquo;
                  </div>
                </div>
              </div>

              <div className="order-2 md:order-1">
                <div className="group relative rounded-3xl p-[1px] bg-gradient-to-br from-secondary-200/60 via-accent-200/40 to-secondary-100/60 hover:from-secondary-300/80 hover:via-accent-200/70 hover:to-secondary-200/80 transition-all duration-300">
                  <div className="card rounded-3xl p-8 h-full bg-white/90 backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-soft-lg">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary-500 to-secondary-700 flex items-center justify-center shadow-soft text-white group-hover:shadow-soft-lg transform group-hover:scale-105 transition-all duration-300 group-hover:animate-pulse">
                        <Icon name="volume" size={28} />
                      </div>
                      <div className="text-left">
                        <h3 className="text-xl font-bold text-neutral-900">
                          Voice Guidance
                        </h3>
                        <p className="text-sm text-neutral-500">
                          Voice Assistant
                        </p>
                      </div>
                    </div>
                    <p className="text-neutral-600 leading-relaxed mb-4">
                      Hear clear, friendly prompts about who is in front of you and what to talk about next.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3 - Family Network */}
            <div className="grid md:grid-cols-2 gap-10 items-center animate-fade-in-up">
              <div className="order-1">
                <div className="group relative rounded-3xl p-[1px] bg-gradient-to-br from-emerald-200/60 via-primary-100/40 to-emerald-100/60 hover:from-emerald-300/80 hover:via-primary-100/70 hover:to-emerald-200/80 transition-all duration-300">
                  <div className="card rounded-3xl p-8 h-full bg-white/90 backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-soft-lg">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-soft text-white group-hover:shadow-soft-lg transform group-hover:scale-105 transition-all duration-300 group-hover:animate-pulse">
                        <Icon name="users" size={28} />
                      </div>
                      <div className="text-left">
                        <h3 className="text-xl font-bold text-neutral-900">
                          Family Connected
                        </h3>
                        <p className="text-sm text-neutral-500">
                          Family Network
                        </p>
                      </div>
                    </div>
                    <p className="text-neutral-600 leading-relaxed mb-4">
                      Add unlimited family members and caregivers so that every familiar face is always remembered.
                    </p>
                  </div>
                </div>
              </div>

              {/* Illustration: connected dots */}
              <div className="order-2">
                <div className="relative mx-auto w-64 h-56 sm:w-72 sm:h-64 rounded-3xl bg-gradient-to-br from-emerald-50 via-primary-50 to-white border border-emerald-100/70 shadow-soft overflow-hidden flex items-center justify-center">
                  <div className="relative w-40 h-40 sm:w-44 sm:h-44">
                    <div className="absolute inset-0 rounded-full border border-emerald-200/80" />
                    <div className="absolute inset-4 rounded-full border border-primary-100/70" />
                    <div className="absolute inset-8 rounded-full border border-emerald-100/60" />

                    {[
                      { top: '0%', left: '50%' },
                      { top: '18%', left: '85%' },
                      { top: '55%', left: '100%' },
                      { top: '85%', left: '65%' },
                      { top: '80%', left: '20%' },
                      { top: '35%', left: '0%' },
                      { top: '50%', left: '50%' },
                    ].map((pos, i) => (
                      <div
                        key={i}
                        className="network-dot"
                        style={{
                          top: pos.top,
                          left: pos.left,
                          animationDelay: `${i * 0.15}s`,
                        }}
                      />
                    ))}
                  </div>
                  <div className="absolute bottom-6 left-6 rounded-xl bg-white/90 border border-emerald-100 px-3 py-2 text-xs shadow-soft">
                    <p className="font-semibold text-neutral-900">
                      12 family members added
                    </p>
                    <p className="text-neutral-500">
                      Shared securely with caregivers
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: The Crisis - Statistics */}
      <section className="py-20 px-4 bg-gradient-to-br from-red-50 via-orange-50 to-red-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <p className="text-xs sm:text-sm font-semibold tracking-[0.2em] text-red-600 mb-2 uppercase">
              THE CRISIS
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 mb-3">
              India&apos;s Dementia Emergency
            </h2>
            <p className="text-base sm:text-lg text-neutral-600 mb-4">
              Latest data from WHO, Lancet & ARDSI (2024)
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 rounded-full border border-red-300">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm font-semibold text-red-700">LIVE DATA - Updated January 2025</span>
            </div>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[
              {
                number: '8.8',
                suffix: 'Million',
                label: 'People living with dementia in India',
                description: 'Up from 5.3 million in 2020 - growing rapidly',
                source: 'Lancet Neurology',
                sourceUrl: 'https://www.thelancet.com/journals/laneur/article/PIIS1474-4422(23)00169-0/fulltext',
                year: '2024',
                trend: 'increasing'
              },
              {
                number: '22',
                suffix: 'Million+',
                label: 'Projected patients by 2050',
                description: 'India will have world\'s largest dementia population',
                source: 'Alzheimer\'s Disease International',
                sourceUrl: 'https://www.alzint.org/resource/world-alzheimer-report-2024/',
                year: '2024',
                trend: 'critical'
              },
              {
                number: '₹2.1',
                suffix: 'Lakh Crore',
                label: 'Annual economic burden',
                description: 'Cost of care, lost wages, and healthcare',
                source: 'Dementia India Alliance',
                sourceUrl: 'https://www.dementiaindia.org/',
                year: '2024',
                trend: 'increasing'
              },
              {
                number: '90',
                suffix: '%',
                label: 'Cases go undiagnosed',
                description: 'Families don\'t know their loved one has dementia',
                source: 'ARDSI India',
                sourceUrl: 'https://ardsi.org/',
                year: '2024',
                trend: 'critical'
              },
              {
                number: '16',
                suffix: 'Million+',
                label: 'Family caregivers affected',
                description: 'Each patient impacts 2-3 family members',
                source: 'ARDSI Caregiver Report',
                sourceUrl: 'https://ardsi.org/caregiver-support/',
                year: '2024',
                trend: 'increasing'
              },
              {
                number: '70',
                suffix: '%',
                label: 'Caregivers are women',
                description: 'Daughters and wives bear the burden',
                source: 'Lancet Commission on Dementia',
                sourceUrl: 'https://www.thelancet.com/commissions/dementia2024',
                year: '2024',
                trend: 'unchanged'
              }
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-neutral-100 animate-fade-in-up"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {stat.number}
                  </span>
                  <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {stat.suffix}
                  </span>
                  {stat.trend === 'increasing' && (
                    <Icon name="trendingUp" size={18} className="text-red-500" />
                  )}
                  {stat.trend === 'critical' && (
                    <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  )}
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                  {stat.label}
                </h3>
                <p className="text-sm text-neutral-600 mb-4">
                  {stat.description}
                </p>
                <a
                  href={stat.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1 bg-neutral-100 hover:bg-neutral-200 rounded-full text-xs font-medium text-neutral-700 transition-colors"
                >
                  {stat.source} {stat.year}
                  <Icon name="externalLink" size={12} className="text-blue-600" />
                </a>
              </div>
            ))}
          </div>

          {/* Impact Quote Box */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 p-6 md:p-8 rounded-r-2xl">
            <p className="text-lg md:text-xl italic text-neutral-700 leading-relaxed mb-4">
              &ldquo;Every 3 seconds, someone in the world develops dementia. By the time you finish reading this sentence, another family has begun their journey with this disease.&rdquo;
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <span className="text-sm font-medium text-neutral-600">
                — World Alzheimer Report 2024
              </span>
              <a
                href="https://www.alzint.org/resource/world-alzheimer-report-2024/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1"
              >
                Read Report
                <Icon name="externalLink" size={12} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: The Real Problem */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <p className="text-xs sm:text-sm font-semibold tracking-[0.2em] text-amber-600 mb-2 uppercase">
              THE HUMAN IMPACT
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-3">
              More Than Just Memory Loss
            </h2>
            <p className="text-base sm:text-lg text-neutral-500">
              What families actually face every day
            </p>
          </div>

          {/* Problem Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                iconName: 'alertTriangle' as const,
                title: 'Patients Don\'t Recognize Family',
                description: 'A mother looks at her son and sees a stranger. She becomes scared, confused, sometimes aggressive.',
                stat: '60% of patients forget close family members',
                source: 'Alzheimer\'s Association',
                sourceUrl: 'https://www.alz.org/alzheimers-dementia/what-is-dementia/symptoms'
              },
              {
                iconName: 'heart' as const,
                title: 'Families Feel Helpless',
                description: 'Children must re-introduce themselves daily. The emotional trauma affects entire families.',
                stat: '80% of caregivers report depression or anxiety',
                source: 'WHO Caregiver Guidelines',
                sourceUrl: 'https://www.who.int/publications/i/item/9789240030435'
              },
              {
                iconName: 'user' as const,
                title: 'Women Leave Jobs to Caregiving',
                description: 'Daughters and wives become unpaid full-time caregivers, sacrificing careers and income.',
                stat: '70% of caregivers are women',
                source: 'Lancet Commission 2024',
                sourceUrl: 'https://www.thelancet.com/commissions/dementia2024'
              },
              {
                iconName: 'trendingUp' as const,
                title: 'Families Go Into Debt',
                description: 'Quality care costs ₹50,000 - ₹2,00,000 per month. Most families can\'t afford it.',
                stat: 'Average family spends ₹2.5 Lakh/year',
                source: 'Dementia India Report',
                sourceUrl: 'https://www.dementiaindia.org/'
              }
            ].map((problem, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-neutral-100 animate-fade-in-up"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mb-4">
                  <Icon name={problem.iconName} size={32} className="text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-3">
                  {problem.title}
                </h3>
                <p className="text-neutral-600 mb-4 leading-relaxed">
                  {problem.description}
                </p>
                <div className="text-lg font-semibold text-red-600 mb-3">
                  {problem.stat}
                </div>
                <a
                  href={problem.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-500 hover:underline inline-flex items-center gap-1"
                >
                  Source: {problem.source}
                  <Icon name="externalLink" size={12} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: The Gap */}
      <section className="py-20 px-4 bg-neutral-50">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <p className="text-xs sm:text-sm font-semibold tracking-[0.2em] text-yellow-600 mb-2 uppercase">
              THE GAP
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-3">
              Why Nothing Works Today
            </h2>
          </div>

          {/* Gap Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                solution: 'Photo Albums',
                iconName: 'camera' as const,
                problem: 'Can\'t help in real-time',
                detail: 'When someone visits, patient can\'t connect photo to person standing in front of them',
                effectiveness: '10%'
              },
              {
                solution: 'Verbal Introduction',
                iconName: 'message' as const,
                problem: 'Patient doesn\'t trust strangers',
                detail: '\'I\'m your son\' sounds like a lie when they don\'t recognize you',
                effectiveness: '20%'
              },
              {
                solution: 'Memory Care Facilities',
                iconName: 'building' as const,
                problem: 'Costs ₹50K-2L per month',
                detail: 'Only 1% of Indian families can afford professional care',
                effectiveness: '70% (but unaffordable)'
              },
              {
                solution: 'Existing Apps',
                iconName: 'smartphone' as const,
                problem: 'Built for caregivers, not patients',
                detail: 'Complex UI, require login, no voice, no Indian languages',
                effectiveness: '15%'
              }
            ].map((gap, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg border-2 border-red-200 relative overflow-hidden animate-fade-in-up"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <div className="absolute top-4 right-4">
                  <Icon name="x" size={24} className="text-red-300 opacity-50" />
                </div>
                <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center mb-3">
                  <Icon name={gap.iconName} size={24} className="text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-neutral-900 mb-2">
                  {gap.solution}
                </h3>
                <div className="text-sm font-semibold text-red-600 mb-2">
                  {gap.problem}
                </div>
                <p className="text-sm text-neutral-600 mb-3">
                  {gap.detail}
                </p>
                <div className="text-xs font-semibold text-neutral-500">
                  Effectiveness: {gap.effectiveness}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Our Solution */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <p className="text-xs sm:text-sm font-semibold tracking-[0.2em] text-green-600 mb-2 uppercase">
              THE SOLUTION
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                YaadKar (याद कर)
              </span>
            </h2>
            <p className="text-base sm:text-lg text-neutral-600 mb-2">
              &ldquo;Remember&rdquo; - in Hindi
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full border border-green-300">
              <span className="text-lg">🤖</span>
              <span className="text-sm font-semibold text-green-700">Powered by AI</span>
            </div>
          </div>

          {/* How It Works - 3 Steps */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-center text-neutral-900 mb-8">
              How It Works
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connecting Arrow (Desktop) */}
              <div className="hidden md:block absolute top-1/2 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transform -translate-y-1/2" />
              <div className="hidden md:block absolute top-1/2 left-2/3 right-1/3 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transform -translate-y-1/2" />

              {[
                {
                  step: 1,
                  icon: '📷',
                  title: 'Point',
                  description: 'Patient points camera at visitor',
                  detail: 'No login, no navigation - just one tap',
                  tech: 'face-api.js (Privacy-first, runs locally)'
                },
                {
                  step: 2,
                  icon: '🤖',
                  title: 'Recognize',
                  description: 'AI identifies the person instantly',
                  detail: 'Works in 2 seconds, even with poor lighting',
                  tech: 'Groq LLaMA Vision + Google Gemini'
                },
                {
                  step: 3,
                  icon: '🔊',
                  title: 'Hear',
                  description: '\'This is Rahul, your son!\'',
                  detail: 'Speaks in Hindi, English, Tamil, Telugu...',
                  tech: 'Google Web Speech API'
                }
              ].map((step, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200 relative z-10 animate-fade-in-up"
                  style={{ animationDelay: `${0.2 * index}s` }}
                >
                  <div className="text-5xl mb-4 text-center">{step.icon}</div>
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold mb-2">
                      {step.step}
                    </div>
                    <h4 className="text-xl font-bold text-neutral-900 mb-2">
                      {step.title}
                    </h4>
                  </div>
                  <p className="text-neutral-700 font-medium mb-2 text-center">
                    {step.description}
                  </p>
                  <p className="text-sm text-neutral-600 mb-3 text-center">
                    {step.detail}
                  </p>
                  <div className="text-xs text-neutral-500 text-center bg-white/50 rounded-lg p-2">
                    {step.tech}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Differentiators Table */}
          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8 border-2 border-green-200">
            <h3 className="text-2xl font-bold text-center text-neutral-900 mb-8">
              Why YaadKar is Different
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-neutral-300">
                    <th className="text-left py-3 px-4 font-semibold text-neutral-900">Feature</th>
                    <th className="text-center py-3 px-4 font-semibold text-red-600">Others</th>
                    <th className="text-center py-3 px-4 font-semibold text-green-600">YaadKar</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: 'Who uses it', others: 'Caregivers', yaadkar: 'Patients themselves' },
                    { feature: 'Login required', others: 'Every time', yaadkar: 'Never (Patient Mode)' },
                    { feature: 'Interface', others: 'Complex menus', yaadkar: 'ONE button' },
                    { feature: 'Languages', others: 'English only', yaadkar: 'Hindi, Tamil, Telugu, Marathi...' },
                    { feature: 'Output', others: 'Text on screen', yaadkar: 'Voice output' },
                    { feature: 'Cost', others: '₹500-5000/month', yaadkar: 'FREE forever' },
                    { feature: 'Works offline', others: 'No', yaadkar: 'Yes (face detection)' }
                  ].map((row, index) => (
                    <tr key={index} className="border-b border-neutral-200 hover:bg-white/50 transition-colors">
                      <td className="py-3 px-4 font-medium text-neutral-900">{row.feature}</td>
                      <td className="py-3 px-4 text-center text-neutral-600">{row.others}</td>
                      <td className="py-3 px-4 text-center font-semibold text-green-700">{row.yaadkar}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Sources & References */}
      <section className="py-12 px-4 bg-neutral-100">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-xl font-bold text-neutral-900 mb-6 text-center">
            Sources & References
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              {
                name: 'WHO',
                fullName: 'World Health Organization',
                url: 'https://www.who.int/news-room/fact-sheets/detail/dementia',
                dataUsed: 'Global statistics, growth projections'
              },
              {
                name: 'Lancet',
                fullName: 'Lancet Neurology & Commission',
                url: 'https://www.thelancet.com/commissions/dementia2024',
                dataUsed: 'India-specific numbers, caregiver data'
              },
              {
                name: 'ARDSI',
                fullName: 'Alzheimer\'s & Related Disorders Society of India',
                url: 'https://ardsi.org/',
                dataUsed: 'India prevalence, diagnosis rates'
              },
              {
                name: 'ADI',
                fullName: 'Alzheimer\'s Disease International',
                url: 'https://www.alzint.org/resource/world-alzheimer-report-2024/',
                dataUsed: 'World Alzheimer Report 2024'
              },
              {
                name: 'Dementia India',
                fullName: 'Dementia India Alliance',
                url: 'https://www.dementiaindia.org/',
                dataUsed: 'Economic burden, care costs'
              }
            ].map((source, index) => (
              <a
                key={index}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 border border-neutral-200 text-center group"
              >
                <div className="font-bold text-blue-600 mb-1 group-hover:text-blue-700">
                  {source.name}
                </div>
                <div className="text-xs text-neutral-600 mb-2">
                  {source.fullName}
                </div>
                <div className="text-xs text-neutral-500 italic">
                  {source.dataUsed}
                </div>
                <div className="text-xs text-blue-500 mt-2 inline-flex items-center gap-1">
                  View Report
                  <Icon name="externalLink" size={12} />
                </div>
              </a>
            ))}
          </div>
          <p className="text-xs text-neutral-500 text-center mt-6">
            Last updated: January 2025
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-neutral-900 text-neutral-400">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
              <Icon name="heart" size={16} className="text-white" />
            </div>
            <span className="text-white font-semibold text-lg">YaadKar (याद कर)</span>
          </div>
          <p className="text-neutral-300 mt-2">
            AI-powered face recognition for dementia care
          </p>
          <p className="text-sm text-neutral-400 mt-4 flex items-center justify-center gap-2">
            <Icon name="award" size={14} />
            <span>Hackathon Project | TechSprint AI Hack &apos;25 | Team 200</span>
          </p>
          <p className="text-xs text-neutral-500 mt-2">
            Built with Next.js, Firebase, Groq AI & Google Gemini
          </p>
        </div>
      </footer>
    </div>
  );
}
