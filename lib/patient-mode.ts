// Patient Mode Storage Keys
const PATIENT_MODE_KEY = 'yaadkar_patient_mode';
const PATIENT_DATA_KEY = 'yaadkar_patient_data';

// Types
export interface PatientModeData {
    enabled: boolean;
    patientId: number;
    patientName: string;
    userId: string; // Caregiver's Firebase UID (for API calls)
    emergencyContact?: {
        name: string;
        phone: string;
        relationship: string;
    };
    setupDate: string;
}

// Check if running in browser
const isBrowser = typeof window !== 'undefined';

// Check if patient mode is enabled
export function isPatientMode(): boolean {
    if (!isBrowser) return false;

    try {
        const data = localStorage.getItem(PATIENT_MODE_KEY);
        return data === 'true';
    } catch {
        return false;
    }
}

// Get patient mode data
export function getPatientModeData(): PatientModeData | null {
    if (!isBrowser) return null;

    try {
        const data = localStorage.getItem(PATIENT_DATA_KEY);
        if (!data) return null;
        return JSON.parse(data);
    } catch {
        return null;
    }
}

// Enable patient mode (called during setup)
export function enablePatientMode(data: Omit<PatientModeData, 'enabled' | 'setupDate'>): void {
    if (!isBrowser) return;

    const fullData: PatientModeData = {
        ...data,
        enabled: true,
        setupDate: new Date().toISOString(),
    };

    localStorage.setItem(PATIENT_MODE_KEY, 'true');
    localStorage.setItem(PATIENT_DATA_KEY, JSON.stringify(fullData));
}

// Disable patient mode
export function disablePatientMode(): void {
    if (!isBrowser) return;

    localStorage.removeItem(PATIENT_MODE_KEY);
    localStorage.removeItem(PATIENT_DATA_KEY);
}

// Update emergency contact
export function updateEmergencyContact(contact: PatientModeData['emergencyContact']): void {
    if (!isBrowser) return;

    const data = getPatientModeData();
    if (!data) return;

    data.emergencyContact = contact;
    localStorage.setItem(PATIENT_DATA_KEY, JSON.stringify(data));
}

// Generate setup URL (for caregiver to share)
export function generatePatientSetupUrl(patientId: number, userId: string, patientName: string): string {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const params = new URLSearchParams({
        pid: patientId.toString(),
        uid: userId,
        name: encodeURIComponent(patientName),
    });

    return `${baseUrl}/patient/setup?${params.toString()}`;
}

