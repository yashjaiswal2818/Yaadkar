import { Patient, Person, ApiResponse, RecognizeResponse } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_N8N_API_URL || 'http://localhost:5678/webhook/api';
const RECOGNIZE_URL = process.env.NEXT_PUBLIC_N8N_RECOGNIZE_URL || 'http://localhost:5678/webhook/recognize';
const CONVERSATION_URL = process.env.NEXT_PUBLIC_N8N_CONVERSATION_URL || 'http://localhost:5678/webhook/generate-conversation';

// Generic API call to n8n /api endpoint
async function callApi<T>(action: string, userId: string, data: Record<string, any> = {}): Promise<ApiResponse<T>> {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            action,
            user_id: userId,
            data,
        }),
    });

    if (!response.ok) {
        throw new Error(`API call failed: ${response.statusText}`);
    }

    // Handle empty response
    const text = await response.text();

    if (!text || text.trim() === '') {
        return { success: true, data: null as T };
    }

    try {
        const parsed = JSON.parse(text);

        // If n8n returns { success, data } format, use it
        if (parsed && typeof parsed === 'object' && 'success' in parsed) {
            return parsed;
        }

        // If n8n returns raw data (array or object), wrap it
        return { success: true, data: parsed as T };
    } catch (e) {
        console.error('Failed to parse response:', text);
        return { success: false, data: null as T };
    }
}

// ============ PATIENT FUNCTIONS ============

export async function createPatient(
    userId: string,
    name: string,
    photoUrl?: string,
    age?: number,
    notes?: string,
    emergencyContactName?: string,
    emergencyContactPhone?: string
): Promise<ApiResponse<Patient>> {
    return callApi<Patient>('create-patient', userId, {
        name,
        photo_url: photoUrl,
        age,
        notes,
        emergency_contact_name: emergencyContactName,
        emergency_contact_phone: emergencyContactPhone,
    });
}

export async function getPatient(userId: string): Promise<ApiResponse<Patient>> {
    return callApi<Patient>('get-patient', userId);
}

export async function updatePatient(
    userId: string,
    data: {
        name: string;
        age?: number;
        notes?: string;
        photo_url?: string;
        emergency_contact_name?: string;
        emergency_contact_phone?: string;
    }
): Promise<ApiResponse<Patient>> {
    return callApi<Patient>('update-patient', userId, data);
}

// ============ PEOPLE FUNCTIONS ============

export async function addPerson(
    userId: string,
    patientId: number,
    personData: {
        name: string;
        nickname?: string;
        relationship: string;
        photo_base64: string;
        photo_url?: string;
        details?: string;
        conversation_topics?: string[];
        important_memories?: string;
        phone?: string;
    }
): Promise<ApiResponse<Person>> {
    return callApi<Person>('add-person', userId, {
        patient_id: patientId,
        ...personData,
    });
}

export async function getPeople(userId: string, patientId: number): Promise<ApiResponse<Person[]>> {
    return callApi<Person[]>('get-people', userId, {
        patient_id: patientId,
    });
}

export async function updatePerson(
    userId: string,
    personId: number,
    updates: Partial<Person>
): Promise<ApiResponse<Person>> {
    return callApi<Person>('update-person', userId, {
        person_id: personId,
        ...updates,
    });
}

export async function deletePerson(userId: string, personId: number): Promise<ApiResponse<null>> {
    return callApi<null>('delete-person', userId, {
        person_id: personId,
    });
}

// ============ RECOGNITION FUNCTION ============

export async function recognizeFace(
    userId: string,
    patientId: number,
    photoBase64: string
): Promise<RecognizeResponse> {
    // Strip data:image prefix if present (n8n expects raw base64)
    let cleanBase64 = photoBase64;
    if (photoBase64.includes(',')) {
        cleanBase64 = photoBase64.split(',')[1];
    }

    console.log('Sending recognition request:', {
        patient_id: patientId,
        photo_base64_length: cleanBase64.length
    });

    const response = await fetch(RECOGNIZE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            patient_id: String(patientId), // n8n expects string
            photo_base64: cleanBase64, // Raw base64 without prefix
        }),
    });

    console.log('Recognition response status:', response.status);

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Recognition failed:', response.status, errorText);
        throw new Error(`Recognition failed: ${response.statusText}`);
    }

    const text = await response.text();
    console.log('Recognition response text:', text);

    if (!text || text.trim() === '') {
        console.warn('Empty response from server');
        return { matched: false, message: 'Empty response from server' };
    }

    try {
        const result = JSON.parse(text);
        console.log('Parsed recognition result:', result);
        return result;
    } catch (e) {
        console.error('Failed to parse recognition response:', text, e);
        return { matched: false, message: 'Failed to parse response' };
    }
}

// ============ UTILITY FUNCTIONS ============

// Convert file to base64
export function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
}


// Speak text using Web Speech API (with Chrome fix + language support)
export function speakText(text: string, language: string = 'en-IN'): void {
    if (!('speechSynthesis' in window)) {
        console.log('Speech synthesis not supported');
        return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Wait a moment, then speak (Chrome bug fix)
    setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language;
        utterance.rate = 0.85;
        utterance.pitch = 1;
        utterance.volume = 1;

        // Try to find voice for selected language
        const voices = window.speechSynthesis.getVoices();
        const languageVoice = voices.find(v => v.lang.startsWith(language.split('-')[0]));
        if (languageVoice) {
            utterance.voice = languageVoice;
        }

        // Force resume (Chrome bug fix)
        window.speechSynthesis.resume();

        window.speechSynthesis.speak(utterance);

        // Chrome pause/resume hack
        setTimeout(() => {
            window.speechSynthesis.pause();
            window.speechSynthesis.resume();
        }, 100);
    }, 100);
}

// Build speech text from person data
export function buildSpeechText(person: Person): string {
    let speech = `This is ${person.name}`;

    if (person.nickname) {
        speech += `, you call them ${person.nickname}`;
    }

    speech += `. They are your ${person.relationship}.`;

    if (person.details) {
        speech += ` ${person.details}.`;
    }

    if (person.conversation_topics && person.conversation_topics.length > 0) {
        speech += ` You can ask about: ${person.conversation_topics.join(', ')}.`;
    }

    if (person.important_memories) {
        speech += ` Remember: ${person.important_memories}.`;
    }

    return speech;
}

// ============ CONVERSATION GENERATION ============

export interface ConversationResponse {
    success: boolean;
    conversation?: string;
    message?: string;
}

// Build context string from person data for AI conversation generation
export function buildConversationContext(person: Person): string {
    let context = `Name: ${person.name}\n`;
    
    if (person.nickname) {
        context += `Nickname: ${person.nickname}\n`;
    }
    
    context += `Relationship: ${person.relationship}\n`;
    
    if (person.details) {
        context += `About: ${person.details}\n`;
    }
    
    if (person.conversation_topics && person.conversation_topics.length > 0) {
        context += `Topics: ${person.conversation_topics.join(', ')}\n`;
    }
    
    if (person.important_memories) {
        context += `Memories: ${person.important_memories}\n`;
    }
    
    return context;
}

// Generate conversation starter using AI
export async function generateConversation(
    context: string,
    language?: string
): Promise<ConversationResponse> {
    try {
        const response = await fetch(CONVERSATION_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                context,
                language: language || 'en-IN',
            }),
        });

        if (!response.ok) {
            throw new Error(`Conversation generation failed: ${response.statusText}`);
        }

        const text = await response.text();
        
        if (!text || text.trim() === '') {
            return { success: false, message: 'Empty response from server' };
        }

        try {
            const result = JSON.parse(text);
            
            // Handle different response formats
            if (result.conversation) {
                return { success: true, conversation: result.conversation };
            } else if (result.success && result.data) {
                return { success: true, conversation: result.data };
            } else if (typeof result === 'string') {
                return { success: true, conversation: result };
            } else {
                return { success: false, message: 'Unexpected response format' };
            }
        } catch (e) {
            // If response is plain text, use it as conversation
            return { success: true, conversation: text.trim() };
        }
    } catch (err: any) {
        console.error('Error generating conversation:', err);
        return { 
            success: false, 
            message: err.message || 'Failed to generate conversation' 
        };
    }
}