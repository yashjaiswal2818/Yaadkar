'use client';

import { useRef, useState, useEffect } from 'react';
import { loadFaceDetectionModels, detectFace, captureFrame, FaceBox } from '@/lib/face-detection';
import { FaSyncAlt, FaTimes, FaSpinner, FaUser } from 'react-icons/fa';

interface LiveCameraProps {
    onFaceRecognized: (photoBase64: string, faceBox: FaceBox) => void;
    onClose: () => void;
    isProcessing: boolean;
    isPaused?: boolean; // Pause API calls when result is shown, but keep tracking
    onFacePositionUpdate?: (faceBox: FaceBox | null) => void; // Continuously report face position
    onStatusChange?: (status: 'loading' | 'detecting' | 'stable' | 'capturing') => void; // Report status changes
}

export default function LiveCamera({ onFaceRecognized, onClose, isProcessing, isPaused = false, onFacePositionUpdate, onStatusChange }: LiveCameraProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
    const [error, setError] = useState<string | null>(null);
    const [modelsReady, setModelsReady] = useState(false);
    const [faceBox, setFaceBox] = useState<FaceBox | null>(null);
    const [faceStableCount, setFaceStableCount] = useState(0);
    const [status, setStatus] = useState<'loading' | 'detecting' | 'stable' | 'capturing'>('loading');
    const [shouldCapture, setShouldCapture] = useState(false);

    const STABLE_THRESHOLD = 5;

    // Report face position updates to parent (for tracking)
    useEffect(() => {
        if (onFacePositionUpdate) {
            onFacePositionUpdate(faceBox);
        }
    }, [faceBox, onFacePositionUpdate]);

    // Load face detection models
    useEffect(() => {
        loadFaceDetectionModels().then(success => {
            setModelsReady(success);
            if (!success) {
                setError('Failed to load face detection. Try refreshing.');
            }
        });
    }, []);

    // Start camera
    const startCamera = async () => {
        try {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }

            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: facingMode,
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                },
                audio: false
            });

            setStream(mediaStream);

            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }

            setError(null);
            setStatus('detecting');
            onStatusChange?.('detecting');
        } catch (err) {
            console.error('Camera error:', err);
            setError('Could not access camera. Please allow permission.');
        }
    };

    // Initialize camera when models are ready
    useEffect(() => {
        if (modelsReady) {
            startCamera();
        }

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [modelsReady]);

    // Restart camera when facing mode changes
    useEffect(() => {
        if (stream && modelsReady) {
            startCamera();
        }
    }, [facingMode]);

    // Handle capture trigger separately (fixes the setState during render issue)
    useEffect(() => {
        if (shouldCapture && videoRef.current && faceBox && !isProcessing) {
            setStatus('capturing');
            onStatusChange?.('capturing');
            const photo = captureFrame(videoRef.current);
            onFaceRecognized(photo, faceBox);
            setShouldCapture(false);
            setFaceStableCount(0);
        }
    }, [shouldCapture, faceBox, isProcessing, onFaceRecognized, onStatusChange]);

    // Face detection loop - continues tracking even when paused (for face following)
    useEffect(() => {
        if (!modelsReady || !videoRef.current || isProcessing) return;

        let animationId: number;
        let lastDetectionTime = 0;
        const DETECTION_INTERVAL = 200;

        const detectLoop = async (timestamp: number) => {
            if (timestamp - lastDetectionTime >= DETECTION_INTERVAL) {
                lastDetectionTime = timestamp;

                // Add null check here
                if (!videoRef.current || videoRef.current.readyState !== 4) {
                    animationId = requestAnimationFrame(detectLoop);
                    return;
                }

                const face = await detectFace(videoRef.current);

                if (face) {
                    const video = videoRef.current;

                    // Double check video exists
                    if (!video || !video.clientWidth || !video.videoWidth) {
                        animationId = requestAnimationFrame(detectLoop);
                        return;
                    }

                    const scaleX = video.clientWidth / video.videoWidth;
                    const scaleY = video.clientHeight / video.videoHeight;

                    const scaledFace: FaceBox = {
                        x: face.x * scaleX,
                        y: face.y * scaleY,
                        width: face.width * scaleX,
                        height: face.height * scaleY
                    };

                    setFaceBox(scaledFace);

                    // Only trigger capture if not paused (paused = result already shown)
                    if (!isPaused) {
                        setFaceStableCount(prev => {
                            const newCount = prev + 1;

                            if (newCount >= STABLE_THRESHOLD) {
                                setShouldCapture(true);
                                return prev;
                            }

                            if (prev === 0) {
                                setStatus('stable');
                                onStatusChange?.('stable');
                            }
                            return newCount;
                        });
                    }
                } else {
                    setFaceBox(null);
                    if (!isPaused) {
                        setFaceStableCount(0);
                        setStatus('detecting');
                        onStatusChange?.('detecting');
                    }
                }
            }

            animationId = requestAnimationFrame(detectLoop);
        };

        animationId = requestAnimationFrame(detectLoop);

        return () => {
            cancelAnimationFrame(animationId);
        };
    }, [modelsReady, isProcessing, isPaused]);

    const switchCamera = () => {
        setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
        setFaceBox(null);
        setFaceStableCount(0);
    };

    const handleClose = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        window.speechSynthesis?.cancel();
        onClose();
    };

    return (
        <div ref={containerRef} className="fixed inset-0 bg-black z-40 flex flex-col">
            {/* Header - Hidden when custom overlay is used */}
            <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/70 to-transparent opacity-0 pointer-events-none">
                <button
                    onClick={handleClose}
                    className="p-3 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors"
                >
                    <FaTimes className="text-xl" />
                </button>

                <div className="text-center">
                    <h1 className="text-white font-semibold text-lg">
                        {isPaused && '⏸️ Scanning paused'}
                        {!isPaused && status === 'loading' && 'Loading...'}
                        {!isPaused && status === 'detecting' && '🔍 Looking for face...'}
                        {!isPaused && status === 'stable' && '✅ Face detected! Hold still...'}
                        {!isPaused && status === 'capturing' && '📸 Recognizing...'}
                    </h1>
                    {status === 'stable' && (
                        <div className="flex justify-center gap-1 mt-2">
                            {[...Array(STABLE_THRESHOLD)].map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-2 h-2 rounded-full transition-colors ${i < faceStableCount ? 'bg-green-400' : 'bg-white/30'
                                        }`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <button
                    onClick={switchCamera}
                    className="p-3 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors"
                >
                    <FaSyncAlt className="text-xl" />
                </button>
            </div>

            {/* Camera View */}
            <div className="flex-1 flex items-center justify-center relative">
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
                ) : !modelsReady ? (
                    <div className="text-center text-white">
                        <FaSpinner className="animate-spin text-4xl mx-auto mb-4" />
                        <p>Loading face detection...</p>
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

                {/* Face Box Overlay - show when face detected (even if paused for tracking) */}
                {faceBox && !isProcessing && (
                    <div
                        className="absolute border-4 border-green-400 rounded-lg transition-all duration-100 pointer-events-none"
                        style={{
                            left: faceBox.x,
                            top: faceBox.y,
                            width: faceBox.width,
                            height: faceBox.height,
                            boxShadow: '0 0 20px rgba(74, 222, 128, 0.5)'
                        }}
                    >
                        <div className="absolute -top-1 -left-1 w-4 h-4 border-t-4 border-l-4 border-green-400 rounded-tl-lg" />
                        <div className="absolute -top-1 -right-1 w-4 h-4 border-t-4 border-r-4 border-green-400 rounded-tr-lg" />
                        <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-4 border-l-4 border-green-400 rounded-bl-lg" />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-4 border-r-4 border-green-400 rounded-br-lg" />
                    </div>
                )}

                {/* Processing Overlay */}
                {isProcessing && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <div className="text-center text-white">
                            <div className="w-20 h-20 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
                            <p className="text-xl font-semibold">Recognizing...</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Hint - Hidden when custom overlay is used */}
            <div className="absolute bottom-0 left-0 right-0 z-10 p-6 bg-gradient-to-t from-black/70 to-transparent opacity-0 pointer-events-none">
                <div className="flex items-center justify-center gap-3 text-white/80">
                    <FaUser />
                    <span>Position face in the frame</span>
                </div>
            </div>
        </div>
    );
}
