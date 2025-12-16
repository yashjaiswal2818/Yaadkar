// User who sets up the app (family member)
export interface User {
  id?: number;
  firebase_uid: string;
  email: string | null;
  name: string | null;
  created_at?: string;
}

// The dementia patient being helped
export interface Patient {
  id?: number;
  user_id: string;
  name: string;
  photo_url?: string;
  age?: number;
  notes?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  created_at?: string;
}

// Family member the patient needs to recognize
export interface Person {
  id?: number;
  user_id: string;
  patient_id: number;
  name: string;
  nickname?: string;
  relationship: string;
  photo_url?: string;
  photo_base64: string;
  details?: string;
  conversation_topics?: string[];
  important_memories?: string;
  phone?: string;
  created_at?: string;
}

// API request to n8n /api endpoint
export interface ApiRequest {
  action: 'create-patient' | 'get-patient' | 'add-person' | 'get-people' | 'update-person' | 'delete-person';
  user_id: string;
  data: Record<string, any>;
}

// API response from n8n
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
}

// Recognition request
export interface RecognizeRequest {
  user_id: string;
  patient_id: number;
  photo_base64: string;
}

// Recognition response
export interface RecognizeResponse {
  matched: boolean;
  confidence?: 'high' | 'medium' | 'low' | null;
  person?: Person | null;
  message?: string;
}

// Relationship options for dropdown
export type Relationship =
  | 'Father'
  | 'Mother'
  | 'Son'
  | 'Daughter'
  | 'Grandfather'
  | 'Grandmother'
  | 'Grandson'
  | 'Granddaughter'
  | 'Spouse'
  | 'Husband'
  | 'Wife'
  | 'Brother'
  | 'Sister'
  | 'Uncle'
  | 'Aunt'
  | 'Cousin'
  | 'Nephew'
  | 'Niece'
  | 'Son-in-law'
  | 'Daughter-in-law'
  | 'Brother-in-law'
  | 'Sister-in-law'
  | 'Father-in-law'
  | 'Mother-in-law'
  | 'Friend'
  | 'Best Friend'
  | 'Caregiver'
  | 'Nurse'
  | 'Doctor'
  | 'Neighbor'
  | 'Teacher'
  | 'Colleague'
  | 'Other';

export const RELATIONSHIPS: Relationship[] = [
  'Father',
  'Mother',
  'Son',
  'Daughter',
  'Grandfather',
  'Grandmother',
  'Grandson',
  'Granddaughter',
  'Spouse',
  'Husband',
  'Wife',
  'Brother',
  'Sister',
  'Uncle',
  'Aunt',
  'Cousin',
  'Nephew',
  'Niece',
  'Son-in-law',
  'Daughter-in-law',
  'Brother-in-law',
  'Sister-in-law',
  'Father-in-law',
  'Mother-in-law',
  'Friend',
  'Best Friend',
  'Caregiver',
  'Nurse',
  'Doctor',
  'Neighbor',
  'Teacher',
  'Colleague',
  'Other'
];

// Supported languages for speech
export type Language = 'en-IN' | 'hi-IN' | 'ta-IN' | 'te-IN' | 'mr-IN' | 'bn-IN' | 'gu-IN';

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'en-IN', name: 'English', nativeName: 'English' },
  { code: 'hi-IN', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'ta-IN', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te-IN', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'mr-IN', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'bn-IN', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'gu-IN', name: 'Gujarati', nativeName: 'ગુજરાતી' },
];
