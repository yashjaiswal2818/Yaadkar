'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { isPatientMode, getPatientModeData } from '@/lib/patient-mode';
import { ArrowLeft, Camera, Volume2, RotateCcw, X, User, Loader2 } from 'lucide-react';
import { recognizeFace, speakText, buildSpeechText } from '@/lib/api';
import { Person } from '@/types';

interface RecognizedPerson extends Person {
  id: number;
  name: string;
  relationship: string;
  nickname?: string;
  details?: string;
  photo_base64?: string;
  conversation_topics?: string[];
}

export default function PatientCameraPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [status, setStatus] = useState<'initializing' | 'scanning' | 'processing' | 'recognized' | 'not-found'>('initializing');
  const [recognizedPerson, setRecognizedPerson] = useState<RecognizedPerson | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Check patient mode and start camera
  useEffect(() => {
    if (!isPatientMode()) {
      router.push('/');
      return;
    }
    
    startCamera();
    
    // Cleanup on unmount
    return () => {
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  // Start camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 1280, height: 720 }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStatus('scanning');
      }
    } catch (err) {
      setError('Could not access camera. Please allow camera permission.');
      console.error('Camera error:', err);
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  // Capture and recognize
  const captureAndRecognize = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setStatus('processing');

    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.drawImage(video, 0, 0);
    const imageBase64 = canvas.toDataURL('image/jpeg', 0.8);

    try {
      const patientData = getPatientModeData();
      if (!patientData) {
        setError('Patient data not found');
        return;
      }

      const result = await recognizeFace(
        patientData.userId,
        patientData.patientId,
        imageBase64
      );

      if (result.matched && result.person) {
        setRecognizedPerson(result.person as RecognizedPerson);
        setStatus('recognized');
        
        // Auto-speak
        const speechText = buildSpeechText(result.person);
        speakText(speechText);
        setIsSpeaking(true);
        
        // Reset speaking state after estimated duration
        setTimeout(() => setIsSpeaking(false), 5000);
      } else {
        setStatus('not-found');
      }
    } catch (err) {
      console.error('Recognition error:', err);
      setStatus('not-found');
    }
  };

  // Speak person info
  const handleSpeak = () => {
    if (!recognizedPerson) return;
    
    const speechText = buildSpeechText(recognizedPerson);
    speakText(speechText);
    setIsSpeaking(true);
    setTimeout(() => setIsSpeaking(false), 5000);
  };

  // Reset and scan again
  const handleScanAgain = () => {
    setRecognizedPerson(null);
    setStatus('scanning');
    setIsSpeaking(false);
    window.speechSynthesis.cancel();
  };

  // Go back
  const handleBack = () => {
    stopCamera();
    window.speechSynthesis.cancel();
    router.push('/patient');
  };

  return (
    <div className="min-h-screen bg-black relative">
      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Video feed */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-screen object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center pointer-events-auto">
          <button
            onClick={handleBack}
            className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>

          <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
            <p className="text-white font-medium">
              {status === 'initializing' && 'Starting camera...'}
              {status === 'scanning' && 'Point at a person'}
              {status === 'processing' && 'Recognizing...'}
              {status === 'recognized' && 'Person found!'}
              {status === 'not-found' && 'Not recognized'}
            </p>
          </div>

          <div className="w-14 h-14" /> {/* Spacer */}
        </div>

        {/* Scanning frame */}
        {status === 'scanning' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-80 border-4 border-white/50 rounded-3xl relative">
              <div className="absolute inset-0 border-4 border-white rounded-3xl animate-pulse" />
            </div>
          </div>
        )}

        {/* Processing spinner */}
        {status === 'processing' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-3xl p-8 flex flex-col items-center gap-4">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
              <p className="text-xl font-semibold text-gray-800">Recognizing...</p>
            </div>
          </div>
        )}

        {/* Capture button */}
        {status === 'scanning' && (
          <div className="absolute bottom-12 left-0 right-0 flex justify-center pointer-events-auto">
            <button
              onClick={captureAndRecognize}
              className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-transform"
            >
              <Camera className="w-10 h-10 text-blue-600" />
            </button>
          </div>
        )}
      </div>

      {/* Recognition Result - Bottom Sheet */}
      {status === 'recognized' && recognizedPerson && (
        <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-8 shadow-2xl animate-slide-up pointer-events-auto">
          <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6" />
          
          <div className="flex items-center gap-6 mb-6">
            {recognizedPerson.photo_base64 ? (
              <img
                src={recognizedPerson.photo_base64}
                alt={recognizedPerson.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="w-12 h-12 text-blue-600" />
              </div>
            )}
            
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{recognizedPerson.name}</h2>
              <p className="text-xl text-blue-600 font-medium mt-1">
                Your {recognizedPerson.relationship}
              </p>
              {recognizedPerson.nickname && (
                <p className="text-gray-500 mt-1">Also called &quot;{recognizedPerson.nickname}&quot;</p>
              )}
            </div>
          </div>

          {recognizedPerson.details && (
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              {recognizedPerson.details}
            </p>
          )}

          {recognizedPerson.conversation_topics && recognizedPerson.conversation_topics.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-500 mb-2">Talk about:</p>
              <div className="flex flex-wrap gap-2">
                {recognizedPerson.conversation_topics.slice(0, 3).map((topic, i) => (
                  <span key={i} className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm">
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={handleSpeak}
              disabled={isSpeaking}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Volume2 className={`w-5 h-5 ${isSpeaking ? 'animate-pulse' : ''}`} />
              {isSpeaking ? 'Speaking...' : 'Hear Again'}
            </button>
            
            <button
              onClick={handleScanAgain}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              Scan Another
            </button>
          </div>
        </div>
      )}

      {/* Not Found - Bottom Sheet */}
      {status === 'not-found' && (
        <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-8 shadow-2xl animate-slide-up pointer-events-auto">
          <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6" />
          
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Person Not Recognized</h2>
            <p className="text-gray-500">Ask them to introduce themselves</p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleScanAgain}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              Try Again
            </button>
            
            <button
              onClick={handleBack}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <X className="w-5 h-5" />
              Go Back
            </button>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-8 pointer-events-auto">
          <div className="bg-white rounded-3xl p-8 max-w-md text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Camera Error</h2>
            <p className="text-gray-500 mb-6">{error}</p>
            <button
              onClick={handleBack}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold"
            >
              Go Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

