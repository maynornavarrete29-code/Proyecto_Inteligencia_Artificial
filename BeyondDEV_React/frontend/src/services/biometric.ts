/**
 * Face Detection and Recognition Service
 */
import * as faceapi from 'face-api.js';
import { DetectionResult, QualityAssessment } from '@/types';

const MODEL_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/';

export class BiometricAuthService {
  isModelLoaded = false;
  detectionOptions?: faceapi.TinyFaceDetectorOptions;

  async initialize() {
    try {
      console.log('🔐 Loading Face ID models...');
      
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      ]);

      try {
        await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
        console.log('✓ Expression model loaded');
      } catch (e) {
        console.warn('⚠️ Expression model not available (optional)');
      }

      this.isModelLoaded = true;
      this.detectionOptions = new faceapi.TinyFaceDetectorOptions({
        inputSize: 416,
        scoreThreshold: 0.5,
      });

      console.log('✅ Models loaded successfully');
      return true;
    } catch (err) {
      console.error('❌ Error loading models:', err);
      throw new Error('Failed to load Face ID models. Check your internet connection.');
    }
  }

  async startVideoStream(videoElement: HTMLVideoElement) {
    try {
      const constraints = {
        video: {
          facingMode: 'user' as const,
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      videoElement.srcObject = stream;

      return new Promise<boolean>((resolve) => {
        videoElement.onloadedmetadata = () => {
          videoElement.play();
          resolve(true);
        };
      });
    } catch (err) {
      console.error('❌ Camera error:', err);
      throw new Error('Could not access camera. Check permissions.');
    }
  }

  stopVideoStream(stream: MediaStream) {
    stream.getTracks().forEach((track) => track.stop());
  }

  async detectFace(videoElement: HTMLVideoElement): Promise<DetectionResult[]> {
    if (!this.isModelLoaded) {
      throw new Error('Los modelos no están cargados.');
    }

    try {
      const detections = await faceapi
        .detectAllFaces(videoElement, this.detectionOptions)
        .withFaceLandmarks()
        .withFaceDescriptors()
        .withFaceExpressions();

      return detections as DetectionResult[];
    } catch (err) {
      console.error('Error detecting face:', err);
      return [];
    }
  }

  assessFaceQuality(detection: DetectionResult, videoElement: HTMLVideoElement): QualityAssessment {
    if (!detection) {
      return {
        quality: 0,
        issues: ['No face detected'],
        detection: null,
        descriptor: [],
        details: { areaQuality: 0, positionQuality: 0, rotationQuality: 0, lightingQuality: 0 },
      };
    }

    const { detection: box, landmarks, descriptor } = detection;
    const issues: string[] = [];
    const videoWidth = videoElement.videoWidth;
    const videoHeight = videoElement.videoHeight;

    // Check face size
    const faceArea = (box.width * box.height) / (videoWidth * videoHeight);
    let areaQuality = 100;
    if (faceArea < 0.05) {
      issues.push('Face too small');
      areaQuality = 50;
    } else if (faceArea > 0.8) {
      issues.push('Face too close');
      areaQuality = 75;
    }

    // Check face position
    const faceX = (box.x + box.width / 2) / videoWidth;
    const faceY = (box.y + box.height / 2) / videoHeight;
    let positionQuality = 100;
    if (faceX < 0.15 || faceX > 0.85 || faceY < 0.1 || faceY > 0.9) {
      issues.push('Face not centered');
      positionQuality = 75;
    }

    // Check rotation
    let rotationQuality = 100;
    if (landmarks && landmarks.getPositions) {
      try {
        const leftEye = landmarks.getLeftEye();
        const rightEye = landmarks.getRightEye();
        if (leftEye && rightEye) {
          const eyeDistance = Math.hypot(
            rightEye[0].x - leftEye[0].x,
            rightEye[0].y - leftEye[0].y
          );
          const expectedDistance = box.width * 0.3;
          const variance = Math.abs(eyeDistance - expectedDistance) / expectedDistance;

          if (variance > 0.5) {
            issues.push('Not facing camera');
            rotationQuality = 70;
          }
        }
      } catch (e) {
        console.warn('Error checking rotation');
      }
    }

    // Check lighting
    let lightingQuality = 100;
    if (descriptor && descriptor.length > 0) {
      const variance = Math.sqrt(
        descriptor.reduce((sum, val) => sum + val * val, 0) / descriptor.length
      );
      if (variance < 0.05) {
        issues.push('Poor lighting');
        lightingQuality = 70;
      }
    }

    // Calculate overall quality
    const quality = Math.round(
      areaQuality * 0.3 +
      positionQuality * 0.3 +
      rotationQuality * 0.2 +
      lightingQuality * 0.2
    );

    return {
      quality: Math.max(0, Math.min(100, quality)),
      issues,
      detection: box,
      descriptor: Array.from(descriptor),
      details: {
        areaQuality,
        positionQuality,
        rotationQuality,
        lightingQuality,
      },
    };
  }

  captureSnapshot(videoElement: HTMLVideoElement, canvasElement: HTMLCanvasElement): string {
    const ctx = canvasElement.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    canvasElement.width = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;
    ctx.drawImage(videoElement, 0, 0);

    return canvasElement.toDataURL('image/jpeg', 0.9);
  }

  async extractDescriptor(videoElement: HTMLVideoElement) {
    if (!this.isModelLoaded) {
      throw new Error('Models not loaded');
    }

    const detections = await this.detectFace(videoElement);

    if (detections.length === 0) {
      throw new Error('No face detected');
    }

    if (detections.length > 1) {
      throw new Error('Multiple faces detected');
    }

    const detection = detections[0];
    const quality = this.assessFaceQuality(detection, videoElement);

    if (quality.quality < 60) {
      throw new Error(`Quality too low: ${quality.quality}%. Issues: ${quality.issues.join(', ')}`);
    }

    return {
      descriptor: quality.descriptor,
      quality: quality.quality,
      timestamp: new Date().toISOString(),
    };
  }
}

export const biometricAuth = new BiometricAuthService();
