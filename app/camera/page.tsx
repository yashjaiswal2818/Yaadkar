'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { getPatient, recognizeFace, generateConversation, buildConversationContext } from '@/lib/api';
import { Person } from '@/types';
import { FaceBox } from '@/lib/face-detection';
import LiveCamera from '@/components/LiveCamera';
import FloatingPersonCard from '@/components/FloatingPersonCard';
import ConversationCardNew from '@/components/ConversationCardNew';
import Icon from '@/components/ui/Icon';
import { useLanguage } from '@/lib/language-context';
import { buildSpeechTextForLanguage } from '@/lib/speech-messages';
import { FaSpinner } from 'react-icons/fa';

export default function CameraPage() {
  const { user, loading: authLoading } = useAuth();
  const { language } = useLanguage();
  const router = useRouter();

  const [patientId, setPatientId] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recognizedPerson, setRecognizedPerson] = useState<Person | null>(null);
  const [facePosition, setFacePosition] = useState<FaceBox | null>(null);
  const [currentFaceBox, setCurrentFaceBox] = useState<FaceBox | null>(null);
  const [smoothedFacePosition, setSmoothedFacePosition] = useState<FaceBox | null>(null);
  const [showNotFound, setShowNotFound] = useState(false);
  const [videoSize, setVideoSize] = useState({ width: 0, height: 0 });
  const [cameraStatus, setCameraStatus] = useState<'loading' | 'detecting' | 'stable' | 'capturing'>('loading');
  const [showConversationCard, setShowConversationCard] = useState(false);
  const positionHistoryRef = useRef<FaceBox[]>([]);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  // Get patient ID
  useEffect(() => {
    if (user) {
      fetchPatient();
    }
  }, [user]);

  // Get video container size
  useEffect(() => {
    const updateSize = () => {
      setVideoSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Smooth face position (average last 5 frames)
  useEffect(() => {
    if (!currentFaceBox) {
      setSmoothedFacePosition(null);
      positionHistoryRef.current = [];
      return;
    }

    // Add to history
    positionHistoryRef.current.push(currentFaceBox);
    if (positionHistoryRef.current.length > 5) {
      positionHistoryRef.current.shift();
    }

    // Calculate average
    const avgX = positionHistoryRef.current.reduce((sum, pos) => sum + pos.x, 0) / positionHistoryRef.current.length;
    const avgY = positionHistoryRef.current.reduce((sum, pos) => sum + pos.y, 0) / positionHistoryRef.current.length;
    const avgWidth = positionHistoryRef.current.reduce((sum, pos) => sum + pos.width, 0) / positionHistoryRef.current.length;
    const avgHeight = positionHistoryRef.current.reduce((sum, pos) => sum + pos.height, 0) / positionHistoryRef.current.length;

    setSmoothedFacePosition({
      x: avgX,
      y: avgY,
      width: avgWidth,
      height: avgHeight,
    });
  }, [currentFaceBox]);

  const fetchPatient = async () => {
    if (!user) return;

    try {
      const response = await getPatient(user.uid);
      let patient = response.data;

      if (Array.isArray(patient)) {
        patient = patient[0];
      }

      if (patient?.id) {
        setPatientId(patient.id);
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      console.error('Error fetching patient:', err);
      router.push('/dashboard');
    }
  };

  const handleFaceRecognized = async (photoBase64: string, faceBox: FaceBox) => {
    if (!user || !patientId || isProcessing) return;

    setIsProcessing(true);
    setFacePosition(faceBox);
    setRecognizedPerson(null);
    setShowNotFound(false);
    setCameraStatus('capturing');

    try {
      console.log('Recognizing face...', {
        patientId,
        photoBase64Length: photoBase64.length,
        faceBox
      });

      const result = await recognizeFace(user.uid, patientId, photoBase64);
      console.log('Recognition result:', result);

      if (result.matched && result.person) {
        console.log('Person matched:', result.person);
        setRecognizedPerson(result.person);
        setShowNotFound(false);
        setShowConversationCard(true);
      } else {
        console.log('No match found');
        setRecognizedPerson(null);
        setShowNotFound(true);
      }
    } catch (err: any) {
      console.error('Recognition error:', err);
      if (err.message?.includes('CORS') || err.message?.includes('Failed to fetch')) {
        console.error('CORS error detected. Make sure n8n allows requests from your domain.');
      }
      setRecognizedPerson(null);
      setShowNotFound(true);
    } finally {
      setIsProcessing(false);
    }
  };


  const handleClose = () => {
    window.speechSynthesis?.cancel();
    router.push('/dashboard');
  };

  const handleScanAgain = () => {
    window.speechSynthesis?.cancel();
    setRecognizedPerson(null);
    setShowNotFound(false);
    setFacePosition(null);
    setCurrentFaceBox(null);
    setSmoothedFacePosition(null);
    setShowConversationCard(false);
    positionHistoryRef.current = [];
  };

  const handleClosePersonCard = () => {
    handleScanAgain();
  };

  const handleSpeak = () => {
    if (!recognizedPerson) return;
    const text = buildSpeechTextForLanguage(recognizedPerson, language);
    window.speechSynthesis?.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = 0.85;
    window.speechSynthesis?.speak(utterance);
  };

  const handleAddPerson = () => {
    router.push('/add-person');
  };

  // Handle live face position updates and status
  const handleFacePositionUpdate = (faceBox: FaceBox | null) => {
    setCurrentFaceBox(faceBox);
  };

  const handleCameraStatusChange = (status: 'loading' | 'detecting' | 'stable' | 'capturing') => {
    setCameraStatus(status);
  };

  // Loading state
  if (authLoading || !patientId) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-white" />
      </div>
    );
  }

  // Pause recognition API calls when a result is shown, but keep tracking face
  const isPaused = recognizedPerson !== null || showNotFound;

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Live Camera with custom overlay */}
      <LiveCamera
        onFaceRecognized={handleFaceRecognized}
        onClose={handleClose}
        isProcessing={isProcessing}
        isPaused={isPaused}
        onFacePositionUpdate={handleFacePositionUpdate}
        onStatusChange={handleCameraStatusChange}
      />

      {/* Custom Camera Overlay UI */}
      <div className="absolute inset-0 pointer-events-none z-50">
        {/* Dark vignette */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/40" />

        {/* Rounded overlay frame */}
        <div className="absolute inset-4 md:inset-8 rounded-3xl border-2 border-white/20 pointer-events-none" />

        {/* Scanning animation line */}
        {cameraStatus === 'detecting' && (
          <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary-400 to-transparent animate-scan-line pointer-events-none" />
        )}

        {/* Top Bar - Glass Effect */}
        <div className="absolute top-0 left-0 right-0 pointer-events-none">
          <div className="glass backdrop-blur-xl bg-white/10 border-b border-white/10 px-4 py-3 flex items-center justify-between pointer-events-auto">
            {/* Back Button */}
            <button
              onClick={handleClose}
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all flex items-center justify-center touch-target"
              aria-label="Close"
            >
              <Icon name="chevronLeft" size={20} className="text-white" />
            </button>

            {/* Status Text */}
            <div className="flex items-center gap-2 text-white">
              {cameraStatus === 'loading' && (
                <>
                  <Icon name="loader" size={18} className="animate-spin" />
                  <span className="text-sm font-medium">Loading camera...</span>
                </>
              )}
              {cameraStatus === 'detecting' && (
                <>
                  <Icon name="eye" size={18} className="animate-pulse" />
                  <span className="text-sm font-medium">Looking for face...</span>
                </>
              )}
              {cameraStatus === 'stable' && (
                <>
                  <Icon name="check" size={18} className="text-green-400" />
                  <span className="text-sm font-medium">Face detected!</span>
                </>
              )}
              {cameraStatus === 'capturing' && (
                <>
                  <Icon name="loader" size={18} className="animate-spin" />
                  <span className="text-sm font-medium">Recognizing...</span>
                </>
              )}
            </div>

            {/* Flash Toggle (placeholder - can be implemented later) */}
            <div className="w-10 h-10" />
          </div>
        </div>

        {/* Face Detection Feedback */}
        {currentFaceBox && !isProcessing && (
          <div
            className="absolute pointer-events-none transition-all duration-200"
            style={{
              left: `${currentFaceBox.x}px`,
              top: `${currentFaceBox.y}px`,
              width: `${currentFaceBox.width}px`,
              height: `${currentFaceBox.height}px`,
            }}
          >
            {/* Rounded rectangle border */}
            <div
              className={`absolute inset-0 rounded-2xl border-2 transition-all ${cameraStatus === 'stable'
                ? 'border-green-400 shadow-[0_0_20px_rgba(74,222,128,0.6)]'
                : 'border-primary-400 border-dashed animate-pulse'
                }`}
            />

            {/* Corner brackets */}
            <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-primary-400 rounded-tl-lg" />
            <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-primary-400 rounded-tr-lg" />
            <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-primary-400 rounded-bl-lg" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-primary-400 rounded-br-lg" />

            {/* Glow effect when stable */}
            {cameraStatus === 'stable' && (
              <div className="absolute inset-0 rounded-2xl bg-green-400/20 animate-pulse" />
            )}
          </div>
        )}

        {/* Bottom Section - Glass Overlay */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <div className="glass backdrop-blur-xl bg-white/10 border-t border-white/10 px-4 py-4 flex items-center justify-between pointer-events-auto">
            {/* Tip Text */}
            <p className="text-white/80 text-xs md:text-sm flex-1 text-center">
              Hold steady • Good lighting helps
            </p>

            {/* Manual Capture Button */}
            <button
              onClick={() => {
                if (currentFaceBox && !isProcessing && !isPaused) {
                  // Trigger capture manually
                  const video = document.querySelector('video');
                  if (video) {
                    const canvas = document.createElement('canvas');
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                      ctx.drawImage(video, 0, 0);
                      const photoBase64 = canvas.toDataURL('image/jpeg', 0.8);
                      handleFaceRecognized(photoBase64, currentFaceBox);
                    }
                  }
                }
              }}
              disabled={!currentFaceBox || isProcessing || isPaused}
              className="w-16 h-16 rounded-full bg-white hover:bg-white/90 transition-all flex items-center justify-center shadow-lg disabled:opacity-50 disabled:cursor-not-allowed touch-target mx-4"
              aria-label="Capture"
            >
              <div className="w-12 h-12 rounded-full border-4 border-neutral-800" />
            </button>

            {/* Settings Button */}
            <button
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all flex items-center justify-center touch-target"
              aria-label="Settings"
            >
              <Icon name="settings" size={18} className="text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Person Card - Follows Face */}
      {recognizedPerson && smoothedFacePosition && (
        <FloatingPersonCard
          person={recognizedPerson}
          facePosition={smoothedFacePosition}
          videoWidth={videoSize.width}
          videoHeight={videoSize.height}
          onClose={handleClosePersonCard}
          onSpeak={handleSpeak}
        />
      )}

      {/* Conversation Card - Draggable */}
      {recognizedPerson && (
        <ConversationCardNew
          person={recognizedPerson}
          isOpen={showConversationCard}
          onClose={() => setShowConversationCard(false)}
          onGenerateNew={() => {
            // Conversation card handles its own regeneration
          }}
        />
      )}
    </div>
  );
}
