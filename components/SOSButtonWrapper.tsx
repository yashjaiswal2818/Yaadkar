'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { getPatient } from '@/lib/api';
import { Patient } from '@/types';
import SOSButton from './SOSButton';

export default function SOSButtonWrapper() {
  const { user, loading: authLoading } = useAuth();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && user) {
      fetchPatient();
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [user, authLoading]);

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

  // Only show SOS button if user is logged in, patient exists, and has emergency contact info
  if (loading || authLoading || !user || !patient) {
    return null;
  }

  if (!patient.emergency_contact_name || !patient.emergency_contact_phone) {
    return null;
  }

  return (
    <SOSButton
      contactName={patient.emergency_contact_name}
      contactPhone={patient.emergency_contact_phone}
    />
  );
}




