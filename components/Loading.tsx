'use client';

interface LoadingProps {
  message?: string;
  submessage?: string;
}

export default function Loading({ message = "Loading...", submessage }: LoadingProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 flex items-center justify-center">
      <div className="text-center">
        {/* Animated Logo */}
        <div className="relative w-32 h-32 mx-auto mb-8">
          {/* Outer ring */}
          <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
          {/* Spinning ring */}
          <div className="absolute inset-0 border-4 border-transparent border-t-white rounded-full animate-spin"></div>
          {/* Inner content */}
          <div className="absolute inset-4 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
            <span className="text-4xl">🧠</span>
          </div>
        </div>

        {/* Text */}
        <h2 className="text-2xl font-bold text-white mb-2">{message}</h2>
        {submessage && (
          <p className="text-white/70">{submessage}</p>
        )}

        {/* Animated dots */}
        <div className="flex justify-center gap-2 mt-6">
          <div className="w-3 h-3 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
}





