'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { enablePatientMode } from '@/lib/patient-mode';
import { Brain, Check, Smartphone, ArrowRight } from 'lucide-react';

export default function PatientSetupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [step, setStep] = useState<'confirm' | 'setting-up' | 'done'>('confirm');
  const [patientName, setPatientName] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const pid = searchParams.get('pid');
    const uid = searchParams.get('uid');
    const name = searchParams.get('name');

    if (!pid || !uid) {
      setError('Invalid setup link. Please ask your caregiver for a new link.');
      return;
    }

    setPatientName(name ? decodeURIComponent(name) : 'Patient');
  }, [searchParams]);

  const handleSetup = async () => {
    const pid = searchParams.get('pid');
    const uid = searchParams.get('uid');
    const name = searchParams.get('name');

    if (!pid || !uid) {
      setError('Invalid setup link');
      return;
    }

    setStep('setting-up');

    // Simulate brief setup delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Enable patient mode
    enablePatientMode({
      patientId: parseInt(pid),
      patientName: name ? decodeURIComponent(name) : 'Patient',
      userId: uid,
    });

    setStep('done');

    // Redirect to patient home after 2 seconds
    setTimeout(() => {
      router.push('/patient');
    }, 2000);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">!</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Setup Error</h1>
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-lg p-8 max-w-md w-full">
        
        {step === 'confirm' && (
          <>
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-10 h-10 text-blue-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Setup YaadKar
              </h1>
              <p className="text-gray-500">
                Setting up for <strong>{patientName}</strong>
              </p>
            </div>

            <div className="bg-blue-50 rounded-2xl p-6 mb-8">
              <h3 className="font-semibold text-gray-800 mb-3">This phone will be used for:</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  Recognizing family members
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  No login required
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  Simple one-button interface
                </li>
              </ul>
            </div>

            <button
              onClick={handleSetup}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              Continue Setup
              <ArrowRight className="w-5 h-5" />
            </button>
          </>
        )}

        {step === 'setting-up' && (
          <div className="text-center py-8">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <h2 className="text-xl font-semibold text-gray-800">Setting up...</h2>
            <p className="text-gray-500 mt-2">Just a moment</p>
          </div>
        )}

        {step === 'done' && (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">All Done!</h2>
            <p className="text-gray-500">Taking you to YaadKar...</p>
          </div>
        )}

        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-2 text-gray-400">
            <Brain className="w-4 h-4" />
            <span className="text-sm">YaadKar</span>
          </div>
        </div>
      </div>
    </div>
  );
}

