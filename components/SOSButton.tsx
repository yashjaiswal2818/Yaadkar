'use client';

import { useRouter } from 'next/navigation';
import { FaExclamationTriangle } from 'react-icons/fa';

interface SOSButtonProps {
  contactName: string;
  contactPhone: string;
}

export default function SOSButton({ contactName, contactPhone }: SOSButtonProps) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push('/sos')}
      className="fixed bottom-6 right-6 w-16 h-16 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg flex items-center justify-center z-[100] transition-all hover:scale-110 touch-target"
      style={{
        animation: 'sosPulse 2s ease-in-out infinite'
      }}
      title="Emergency SOS"
      aria-label="Emergency SOS Button"
    >
      <FaExclamationTriangle className="text-2xl relative z-10" />
    </button>
  );
}

