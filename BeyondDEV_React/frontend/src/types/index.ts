/**
 * Application Type Definitions
 */

export interface User {
  id: string;
  name: string;
  email: string;
  verified: boolean;
  faceProfile?: FaceProfile;
  createdAt: string;
}

export interface FaceProfile {
  descriptors: number[][];
  quality: number;
  registeredAt: string;
  lastVerifiedAt?: string;
  verificationCount: number;
}

export interface FaceDescriptor {
  descriptor: number[];
  quality: number;
  timestamp: string;
  imageData?: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface BiometricModels {
  tinyFaceDetector: boolean;
  faceLandmark68Net: boolean;
  faceRecognitionNet: boolean;
  faceExpressionNet: boolean;
}

export interface DetectionResult {
  detection: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  landmarks: any;
  descriptor: number[];
  expressions: any;
}

export interface QualityAssessment {
  quality: number;
  issues: string[];
  detection: any;
  descriptor: number[];
  details: {
    areaQuality: number;
    positionQuality: number;
    rotationQuality: number;
    lightingQuality: number;
  };
}

export interface ComparisonResult {
  isMatch: boolean;
  confidence: number;
  distance: number;
}
