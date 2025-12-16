'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { getPatient, getPeople, addPerson, updatePerson } from '@/lib/api';
import { fileToBase64 } from '@/lib/api';
import { Person, RELATIONSHIPS } from '@/types';
import Navbar from '@/components/Navbar';
import { 
  FaCamera, 
  FaUpload, 
  FaSpinner, 
  FaTimes, 
  FaPlus,
  FaArrowLeft,
  FaCheck
} from 'react-icons/fa';

function AddPersonForm() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [patientId, setPatientId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [relationship, setRelationship] = useState('');
  const [details, setDetails] = useState('');
  const [phone, setPhone] = useState('');
  const [importantMemories, setImportantMemories] = useState('');
  const [conversationTopics, setConversationTopics] = useState<string[]>([]);
  const [topicInput, setTopicInput] = useState('');
  
  // Photo state
  const [photoBase64, setPhotoBase64] = useState<string>('');
  const [photoPreview, setPhotoPreview] = useState<string>('');
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  // Fetch patient ID and existing person data (if editing)
  useEffect(() => {
    if (user) {
      fetchInitialData();
    }
  }, [user, editId]);

  const fetchInitialData = async () => {
    if (!user) return;
    
    setPageLoading(true);
    try {
      // Get patient
      const patientResponse = await getPatient(user.uid);
      let patient = patientResponse.data;
      
      if (Array.isArray(patient)) {
        patient = patient[0];
      }
      
      if (!patient?.id) {
        router.push('/dashboard');
        return;
      }
      
      setPatientId(patient.id);

      // If editing, fetch person data
      if (editId) {
        const peopleResponse = await getPeople(user.uid, patient.id);
        const people = Array.isArray(peopleResponse.data) ? peopleResponse.data : [];
        const personToEdit = people.find(p => p.id === parseInt(editId));
        
        if (personToEdit) {
          setName(personToEdit.name || '');
          setNickname(personToEdit.nickname || '');
          setRelationship(personToEdit.relationship || '');
          setDetails(personToEdit.details || '');
          setPhone(personToEdit.phone || '');
          setImportantMemories(personToEdit.important_memories || '');
          setConversationTopics(personToEdit.conversation_topics || []);
          setPhotoBase64(personToEdit.photo_base64 || '');
          setPhotoPreview(personToEdit.photo_url || personToEdit.photo_base64 || '');
        }
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data');
    } finally {
      setPageLoading(false);
    }
  };

  // Handle photo upload
  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      setPhotoBase64(base64);
      setPhotoPreview(base64);
      setError(null);
    } catch (err) {
      setError('Failed to process image');
    }
  };

  // Handle adding conversation topic
  const addTopic = () => {
    const topic = topicInput.trim();
    if (topic && !conversationTopics.includes(topic)) {
      setConversationTopics([...conversationTopics, topic]);
      setTopicInput('');
    }
  };

  // Handle removing conversation topic
  const removeTopic = (topicToRemove: string) => {
    setConversationTopics(conversationTopics.filter(t => t !== topicToRemove));
  };

  // Handle topic input keypress
  const handleTopicKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTopic();
    }
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !patientId) return;

    // Validation
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    if (!relationship) {
      setError('Relationship is required');
      return;
    }
    if (!photoBase64 && !editId) {
      setError('Photo is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (editId) {
        // Update existing person
        await updatePerson(user.uid, parseInt(editId), {
          name: name.trim(),
          nickname: nickname.trim() || undefined,
          relationship,
          details: details.trim() || undefined,
          phone: phone.trim() || undefined,
          important_memories: importantMemories.trim() || undefined,
          conversation_topics: conversationTopics.length > 0 ? conversationTopics : undefined,
          ...(photoBase64 && { photo_base64: photoBase64, photo_url: photoBase64 }),
        });
      } else {
        // Add new person
        await addPerson(user.uid, patientId, {
          name: name.trim(),
          nickname: nickname.trim() || undefined,
          relationship,
          photo_base64: photoBase64,
          photo_url: photoBase64,
          details: details.trim() || undefined,
          phone: phone.trim() || undefined,
          important_memories: importantMemories.trim() || undefined,
          conversation_topics: conversationTopics.length > 0 ? conversationTopics : undefined,
        });
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (err) {
      console.error('Error saving person:', err);
      setError('Failed to save. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (authLoading || pageLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh]">
          <FaSpinner className="animate-spin text-4xl text-indigo-600" />
        </div>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCheck className="text-4xl text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {editId ? 'Updated!' : 'Added!'}
            </h2>
            <p className="text-gray-600 mt-2">Redirecting to dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <FaArrowLeft className="text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {editId ? 'Edit Person' : 'Add Family Member'}
          </h1>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)}>
              <FaTimes />
            </button>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photo Upload */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Photo *
            </label>
            
            <div className="flex flex-col items-center">
              {/* Photo Preview */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-40 h-40 rounded-full bg-gray-100 border-4 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-indigo-400 transition-colors overflow-hidden"
              >
                {photoPreview ? (
                  <img 
                    src={photoPreview} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <FaCamera className="text-4xl text-gray-400 mx-auto mb-2" />
                    <span className="text-sm text-gray-500">Add Photo</span>
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-4 flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
              >
                <FaUpload />
                {photoPreview ? 'Change Photo' : 'Upload Photo'}
              </button>
            </div>
          </div>

          {/* Basic Info */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 space-y-4">
            <h3 className="font-semibold text-gray-900 mb-4">Basic Information</h3>
            
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Rahul Kumar"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                required
              />
            </div>

            {/* Nickname */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nickname (what patient calls them)
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="e.g., Chhotu, Beta, Gudiya"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
            </div>

            {/* Relationship */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Relationship *
              </label>
              <select
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
                required
              >
                <option value="">Select relationship...</option>
                {RELATIONSHIPS.map((rel) => (
                  <option key={rel} value={rel}>{rel}</option>
                ))}
              </select>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g., 9876543210"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Details */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 space-y-4">
            <h3 className="font-semibold text-gray-900 mb-4">Details & Memories</h3>
            
            {/* Details */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                About this person
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="e.g., Works at Google in Bangalore. Married to Priya. Has a daughter named Ananya."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
              />
            </div>

            {/* Conversation Topics */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Conversation Topics
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Things the patient can ask about
              </p>
              
              {/* Topic Tags */}
              {conversationTopics.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {conversationTopics.map((topic) => (
                    <span
                      key={topic}
                      className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm"
                    >
                      {topic}
                      <button
                        type="button"
                        onClick={() => removeTopic(topic)}
                        className="hover:text-indigo-900"
                      >
                        <FaTimes className="text-xs" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Add Topic Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  onKeyPress={handleTopicKeyPress}
                  placeholder="e.g., His new job"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={addTopic}
                  className="px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors"
                >
                  <FaPlus />
                </button>
              </div>
            </div>

            {/* Important Memories */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Important Memories
              </label>
              <textarea
                value={importantMemories}
                onChange={(e) => setImportantMemories(e.target.value)}
                placeholder="e.g., He loves your rajma chawal. You taught him how to ride a bicycle. He visits every Sunday."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <FaCheck />
                {editId ? 'Update Person' : 'Add Person'}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AddPersonPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh]">
          <FaSpinner className="animate-spin text-4xl text-indigo-600" />
        </div>
      </div>
    }>
      <AddPersonForm />
    </Suspense>
  );
}
