'use client';

let faceapi: any = null;
let modelsLoaded = false;

export async function loadFaceDetectionModels(): Promise<boolean> {
  if (modelsLoaded) return true;

  try {
    // Dynamic import - only loads in browser
    if (typeof window === 'undefined') return false;
    
    const faceApiModule = await import('face-api.js');
    faceapi = faceApiModule;
    
    await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
    modelsLoaded = true;
    console.log('Face detection models loaded');
    return true;
  } catch (error) {
    console.error('Failed to load face detection models:', error);
    return false;
  }
}

export interface FaceBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export async function detectFace(video: HTMLVideoElement): Promise<FaceBox | null> {
  if (!faceapi || !modelsLoaded) {
    const loaded = await loadFaceDetectionModels();
    if (!loaded) return null;
  }

  try {
    const detection = await faceapi.detectSingleFace(
      video,
      new faceapi.TinyFaceDetectorOptions({
        inputSize: 320,
        scoreThreshold: 0.5
      })
    );

    if (detection) {
      return {
        x: detection.box.x,
        y: detection.box.y,
        width: detection.box.width,
        height: detection.box.height
      };
    }

    return null;
  } catch (error) {
    console.error('Face detection error:', error);
    return null;
  }
}

export function captureFrame(video: HTMLVideoElement): string {
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.drawImage(video, 0, 0);
  // Return full data URL (will be stripped in API function)
  return canvas.toDataURL('image/jpeg', 0.8);
}
