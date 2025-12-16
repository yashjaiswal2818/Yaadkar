'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { FaCamera, FaSyncAlt, FaTimes } from 'react-icons/fa';

interface CameraViewProps {
  onCapture: (photoBase64: string) => void;
  onClose: () => void;
}

export default function CameraView({ onCapture, onClose }: CameraViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  // Start camera
  const startCamera = useCallback(async () => {
    try {
      // Stop existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      streamRef.current = mediaStream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          setReady(true);
        };
      }
      
      setError(null);
    } catch (err) {
      console.error('Camera error:', err);
      setError('Could not access camera. Please allow camera permission.');
    }
  }, [facingMode]);

  // Initialize camera on mount
  useEffect(() => {
    startCamera();

    // Cleanup on unmount
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, [startCamera]);

  // Restart camera when facing mode changes
  useEffect(() => {
    startCamera();
  }, [facingMode, startCamera]);

  // Switch between front and back camera
  const switchCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  // Capture photo
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current || !ready) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame to canvas
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.drawImage(video, 0, 0);
    
    // Convert to base64
    const photoBase64 = canvas.toDataURL('image/jpeg', 0.8);
    
    // Stop camera
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    // Send to parent
    onCapture(photoBase64);
  };

  // Handle close
  const handleClose = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/70 to-transparent">
        <button
          onClick={handleClose}
          className="p-3 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors"
        >
          <FaTimes className="text-xl" />
        </button>
        
        <h1 className="text-white font-semibold text-lg">Point at Person's Face</h1>
        
        <button
          onClick={switchCamera}
          className="p-3 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors"
        >
          <FaSyncAlt className="text-xl" />
        </button>
      </div>

      {/* Camera View */}
      <div className="flex-1 flex items-center justify-center">
        {error ? (
          <div className="text-center text-white p-8">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={startCamera}
              className="bg-white text-black px-6 py-3 rounded-lg font-medium"
            >
              Try Again
            </button>
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Face Guide Overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-64 h-80 border-4 border-white/50 rounded-3xl"></div>
      </div>

      {/* Capture Button */}
      <div className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-center p-8 bg-gradient-to-t from-black/70 to-transparent">
        <button
          onClick={capturePhoto}
          disabled={!ready}
          className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform disabled:opacity-50"
        >
          <FaCamera className="text-3xl text-gray-800" />
        </button>
      </div>

      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

