'use client';

interface QuizOptionProps {
  text: string;
  onClick: () => void;
  state: 'default' | 'selected' | 'correct' | 'wrong';
  disabled?: boolean;
}

export default function QuizOption({
  text,
  onClick,
  state,
  disabled = false,
}: QuizOptionProps) {
  const getStyles = () => {
    switch (state) {
      case 'correct':
        return 'bg-green-500 text-white scale-105 border-2 border-green-600';
      case 'wrong':
        return 'bg-red-500 text-white scale-105 border-2 border-red-600';
      case 'selected':
        return 'bg-indigo-600 text-white border-2 border-indigo-700';
      default:
        return 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700 border-2 border-transparent hover:scale-105';
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || state !== 'default'}
      className={`py-4 px-6 rounded-xl font-semibold text-lg transition-all min-h-[60px] w-full ${getStyles()} ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'
      }`}
    >
      {text}
    </button>
  );
}



