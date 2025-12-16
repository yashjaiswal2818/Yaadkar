'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { getPatient } from '@/lib/api';
import { Patient } from '@/types';
import { FaPhone, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';
import Navbar from '@/components/Navbar';

export default function SOSPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    } else if (!authLoading && user) {
      fetchPatient();
    }
  }, [user, authLoading, router]);

  const fetchPatient = async () => {
    if (!user) return;

    try {
      const response = await getPatient(user.uid);
      let patientData: Patient | null = null;

      if (Array.isArray(response.data) && response.data.length > 0) {
        patientData = response.data[0];
      } else if (response.data && typeof response.data === 'object') {
        patientData = response.data as Patient;
      }

      setPatient(patientData);
    } catch (err) {
      console.error('Error fetching patient for SOS:', err);
    } finally {
      setLoading(false);
    }
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

  if (!patient) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8 text-center">
            <FaExclamationTriangle className="text-6xl text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Patient Found</h2>
            <p className="text-gray-600 mb-6">Please set up patient information first.</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Header Section */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <FaExclamationTriangle className="text-xl text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Emergency SOS</h1>
              <p className="text-gray-600 text-sm md:text-base">Choose an emergency contact option</p>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          {/* Emergency Contact Card - Prominent */}
          {patient.emergency_contact_name && patient.emergency_contact_phone && (
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-6 md:p-8 text-white">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <FaPhone className="text-3xl" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl md:text-2xl font-bold mb-1">Emergency Contact</h2>
                  <p className="text-indigo-100 text-sm md:text-base">Your registered emergency contact</p>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 mb-6 border border-white/20">
                <div className="mb-4">
                  <p className="text-indigo-200 text-sm mb-1">Contact Name</p>
                  <p className="text-xl md:text-2xl font-bold">{patient.emergency_contact_name}</p>
                </div>
                <div>
                  <p className="text-indigo-200 text-sm mb-1">Phone Number</p>
                  <p className="text-xl md:text-2xl font-bold">{patient.emergency_contact_phone}</p>
                </div>
              </div>

              <a
                href={`tel:${patient.emergency_contact_phone}`}
                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-indigo-600 font-bold py-4 md:py-5 px-6 rounded-xl transition-all text-lg md:text-xl shadow-lg active:scale-95"
              >
                <FaPhone className="text-xl" />
                Call Emergency Contact
              </a>
            </div>
          )}

          {/* Emergency Services Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-200">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FaExclamationTriangle className="text-2xl text-red-600" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">Emergency Services</h2>
                <p className="text-gray-600 text-sm md:text-base">Official emergency services</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Police */}
              <a
                href="tel:100"
                className="flex items-center justify-between p-5 bg-gray-50 hover:bg-blue-50 rounded-xl transition-all border-2 border-transparent hover:border-blue-300 active:scale-98"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FaPhone className="text-xl text-blue-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg">Police</p>
                    <p className="text-sm text-gray-600">Emergency Service</p>
                  </div>
                </div>
                <div className="text-blue-600 font-bold text-2xl md:text-3xl">100</div>
              </a>

              {/* Ambulance */}
              <a
                href="tel:102"
                className="flex items-center justify-between p-5 bg-gray-50 hover:bg-green-50 rounded-xl transition-all border-2 border-transparent hover:border-green-300 active:scale-98"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FaPhone className="text-xl text-green-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg">Ambulance</p>
                    <p className="text-sm text-gray-600">Medical Emergency</p>
                  </div>
                </div>
                <div className="text-green-600 font-bold text-2xl md:text-3xl">102</div>
              </a>

              {/* Emergency Services */}
              <a
                href="tel:108"
                className="flex items-center justify-between p-5 bg-gray-50 hover:bg-red-50 rounded-xl transition-all border-2 border-transparent hover:border-red-300 active:scale-98"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FaPhone className="text-xl text-red-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg">Emergency Services</p>
                    <p className="text-sm text-gray-600">All Emergencies</p>
                  </div>
                </div>
                <div className="text-red-600 font-bold text-2xl md:text-3xl">108</div>
              </a>
            </div>
          </div>

          {/* Info Note */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-xl p-4 md:p-5">
            <div className="flex items-start gap-3">
              <FaExclamationTriangle className="text-yellow-600 text-xl flex-shrink-0 mt-0.5" />
              <p className="text-sm md:text-base text-yellow-800">
                <strong>Important:</strong> In case of a life-threatening emergency, call <strong>108</strong> or <strong>100</strong> immediately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


