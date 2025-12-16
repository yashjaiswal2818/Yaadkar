'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isPatientMode, getPatientModeData, PatientModeData } from '@/lib/patient-mode';
import { ArrowLeft, Phone, ShieldAlert, User, AlertTriangle } from 'lucide-react';

export default function PatientSOSPage() {
  const router = useRouter();
  const [patientData, setPatientData] = useState<PatientModeData | null>(null);

  useEffect(() => {
    if (!isPatientMode()) {
      router.push('/');
      return;
    }
    
    const data = getPatientModeData();
    setPatientData(data);
  }, [router]);

  const handleCall = (number: string) => {
    window.open(`tel:${number}`, '_self');
  };

  const emergencyNumbers = [
    { name: 'Police', number: '100', color: 'blue' },
    { name: 'Ambulance', number: '102', color: 'green' },
    { name: 'Emergency', number: '108', color: 'red' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      {/* Header */}
      <header className="bg-red-600 text-white px-6 py-6">
        <div className="flex items-center gap-4 max-w-2xl mx-auto">
          <button
            onClick={() => router.push('/patient')}
            className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-8 h-8" />
            <h1 className="text-2xl font-bold">Emergency SOS</h1>
          </div>
        </div>
      </header>

      <main className="px-6 py-8 max-w-2xl mx-auto">
        {/* Emergency Contact */}
        {patientData?.emergencyContact && (
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 mb-8">
            <p className="text-sm font-medium text-gray-500 mb-4">Your Emergency Contact</p>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {patientData.emergencyContact.name}
                </h2>
                <p className="text-lg text-gray-500">
                  {patientData.emergencyContact.relationship}
                </p>
              </div>
            </div>

            <button
              onClick={() => handleCall(patientData.emergencyContact!.phone)}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 transition-colors"
            >
              <Phone className="w-6 h-6" />
              Call {patientData.emergencyContact.name}
            </button>
          </div>
        )}

        {/* Emergency Services */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
          <p className="text-sm font-medium text-gray-500 mb-6">Emergency Services</p>
          
          <div className="space-y-4">
            {emergencyNumbers.map((service) => (
              <button
                key={service.number}
                onClick={() => handleCall(service.number)}
                className={`w-full p-6 rounded-2xl border-2 flex items-center justify-between transition-all hover:scale-[1.02] active:scale-[0.98] ${
                  service.color === 'blue' 
                    ? 'border-blue-200 hover:bg-blue-50'
                    : service.color === 'green'
                    ? 'border-green-200 hover:bg-green-50'
                    : 'border-red-200 hover:bg-red-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    service.color === 'blue'
                      ? 'bg-blue-100'
                      : service.color === 'green'
                      ? 'bg-green-100'
                      : 'bg-red-100'
                  }`}>
                    <Phone className={`w-6 h-6 ${
                      service.color === 'blue'
                        ? 'text-blue-600'
                        : service.color === 'green'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`} />
                  </div>
                  <span className="text-xl font-semibold text-gray-800">{service.name}</span>
                </div>
                <span className={`text-2xl font-bold ${
                  service.color === 'blue'
                    ? 'text-blue-600'
                    : service.color === 'green'
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}>
                  {service.number}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Info Note */}
        <div className="mt-8 p-6 bg-amber-50 border border-amber-200 rounded-2xl flex gap-4">
          <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0" />
          <p className="text-amber-800">
            If you need help, tap any button above to call. Someone will help you.
          </p>
        </div>

        {/* I'm OK Button */}
        <button
          onClick={() => router.push('/patient')}
          className="w-full mt-8 bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 rounded-2xl font-semibold transition-colors"
        >
          I&apos;m OK - Go Back Home
        </button>
      </main>
    </div>
  );
}

