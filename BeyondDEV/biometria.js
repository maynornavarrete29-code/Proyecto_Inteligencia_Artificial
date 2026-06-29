/* ==========================================================================
   BeyondDev Biometric Face ID Authentication System
   Advanced face recognition using face-api.js and TensorFlow.js
   ========================================================================== */

class BiometricFaceAuth {
    constructor() {
        this.isModelLoaded = false;
        this.videoStream = null;
        this.detectionOptions = null;
        this.currentDescriptor = null;
        this.capturedImage = null;
        this.isCapturing = false;
    }

    // ─── Initialize Models ─────────────────────────────────────────────────────
    async initialize() {
        console.log('🔐 Inicializando modelos de Face ID...');
        try {
            // Use GitHub raw CDN which serves complete binary files properly
            const MODEL_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/';
            
            console.log('Cargando modelos desde GitHub...');
            
            // Load essential models first (these are REQUIRED)
            const essentialModels = await Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
            ]);

            console.log('✓ Modelos esenciales cargados');

            // Load expression model (optional - don't block if it fails)
            try {
                await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
                console.log('✓ Modelo de expresiones cargado');
            } catch (e) {
                console.warn('⚠️  Modelo de expresiones no disponible (opcional)');
            }

            this.isModelLoaded = true;
            this.detectionOptions = new faceapi.TinyFaceDetectorOptions({ inputSize: 416, scoreThreshold: 0.5 });
            
            console.log('✅ Modelos de Face ID cargados exitosamente.');
            return true;
        } catch (err) {
            console.error('❌ Error cargando modelos de Face ID:', err);
            throw new Error('No se pudieron cargar los modelos de reconocimiento facial. Verifica tu conexión a internet.');
        }
    }

    // ─── Start Video Stream ────────────────────────────────────────────────────
    async startVideoStream(videoElement) {
        try {
            const constraints = {
                video: {
                    facingMode: 'user',
                    width: { ideal: 640 },
                    height: { ideal: 480 }
                },
                audio: false
            };

            this.videoStream = await navigator.mediaDevices.getUserMedia(constraints);
            videoElement.srcObject = this.videoStream;

            return new Promise((resolve) => {
                videoElement.onloadedmetadata = () => {
                    videoElement.play();
                    resolve(true);
                };
            });
        } catch (err) {
            console.error('❌ Error accediendo a la cámara:', err);
            throw new Error('No se pudo acceder a la cámara. Verifica los permisos.');
        }
    }

    // ─── Stop Video Stream ─────────────────────────────────────────────────────
    stopVideoStream() {
        if (this.videoStream) {
            this.videoStream.getTracks().forEach(track => track.stop());
            this.videoStream = null;
        }
    }

    // ─── Detect Face in Frame ──────────────────────────────────────────────────
    async detectFace(videoElement) {
        if (!this.isModelLoaded) {
            throw new Error('Los modelos no están cargados.');
        }

        try {
            const detections = await faceapi
                .detectAllFaces(videoElement, this.detectionOptions)
                .withFaceLandmarks()
                .withFaceDescriptors()
                .withFaceExpressions();

            return detections;
        } catch (err) {
            console.error('Error detectando rostro:', err);
            return [];
        }
    }

    // ─── Assess Face Quality ──────────────────────────────────────────────────
    assessFaceQuality(detection, videoElement) {
        if (!detection) return { quality: 0, issues: ['No face detected'] };

        const { detection: box, landmarks, descriptor } = detection;
        const issues = [];
        const videoWidth = videoElement.videoWidth;
        const videoHeight = videoElement.videoHeight;

        // Check face size (should be at least 20% of frame)
        const faceArea = (box.width * box.height) / (videoWidth * videoHeight);
        if (faceArea < 0.05) issues.push('Face too small');
        if (faceArea > 0.9) issues.push('Face too close');

        // Check face position (should be centered)
        const faceX = (box.x + box.width / 2) / videoWidth;
        const faceY = (box.y + box.height / 2) / videoHeight;
        if (faceX < 0.25 || faceX > 0.75) issues.push('Face not centered horizontally');
        if (faceY < 0.2 || faceY > 0.8) issues.push('Face not centered vertically');

        // Check if face is looking at camera (using landmarks)
        if (landmarks && landmarks.positions.length > 0) {
            // Simple check: distance between eyes
            const leftEye = landmarks.getLeftEye();
            const rightEye = landmarks.getRightEye();
            const eyeDistance = Math.hypot(rightEye[0].x - leftEye[0].x, rightEye[0].y - leftEye[0].y);
            const expectedEyeDistance = box.width * 0.3;
            
            if (Math.abs(eyeDistance - expectedEyeDistance) > expectedEyeDistance * 0.5) {
                issues.push('Face not facing camera');
            }
        }

        // Check for good lighting (based on descriptor variance)
        if (descriptor && descriptor.length > 0) {
            const variance = Math.sqrt(
                descriptor.reduce((sum, val) => sum + val * val, 0) / descriptor.length
            );
            if (variance < 0.1) issues.push('Poor lighting detected');
        }

        // Calculate quality score
        let quality = 100;
        if (faceArea < 0.05 || faceArea > 0.9) quality -= 30;
        if (faceX < 0.25 || faceX > 0.75 || faceY < 0.2 || faceY > 0.8) quality -= 20;
        if (issues.some(i => i.includes('Face not'))) quality -= 15;

        return {
            quality: Math.max(0, Math.min(100, quality)),
            issues,
            detection: box,
            descriptor
        };
    }

    // ─── Capture Face Snapshot ────────────────────────────────────────────────
    captureFaceSnapshot(videoElement, canvasElement) {
        const ctx = canvasElement.getContext('2d');
        canvasElement.width = videoElement.videoWidth;
        canvasElement.height = videoElement.videoHeight;
        ctx.drawImage(videoElement, 0, 0);
        
        this.capturedImage = canvasElement.toDataURL('image/jpeg', 0.9);
        return this.capturedImage;
    }

    // ─── Extract Face Descriptor ──────────────────────────────────────────────
    async extractFaceDescriptor(videoElement) {
        if (!this.isModelLoaded) {
            throw new Error('Los modelos no están cargados.');
        }

        try {
            const detections = await this.detectFace(videoElement);
            
            if (detections.length === 0) {
                throw new Error('No se detectó un rostro en la imagen.');
            }

            if (detections.length > 1) {
                throw new Error('Se detectaron múltiples rostros. Asegúrate de estar solo.');
            }

            const detection = detections[0];
            const quality = this.assessFaceQuality(detection, videoElement);

            if (quality.quality < 60) {
                throw new Error(`Calidad de cara insuficiente (${Math.round(quality.quality)}%). ${quality.issues.join(', ')}`);
            }

            this.currentDescriptor = {
                descriptor: Array.from(detection.descriptor),
                quality: quality.quality,
                timestamp: new Date().toISOString(),
                imageData: this.capturedImage
            };

            return this.currentDescriptor;
        } catch (err) {
            console.error('Error extrayendo descriptor:', err);
            throw err;
        }
    }

    // ─── Compare Face Descriptors ─────────────────────────────────────────────
    compareFaceDescriptors(descriptor1, descriptor2, threshold = 0.6) {
        if (!Array.isArray(descriptor1) || !Array.isArray(descriptor2)) {
            throw new Error('Invalid descriptor format');
        }

        if (descriptor1.length !== descriptor2.length) {
            throw new Error('Descriptor dimensions do not match');
        }

        // Calculate Euclidean distance
        let distance = 0;
        for (let i = 0; i < descriptor1.length; i++) {
            const diff = descriptor1[i] - descriptor2[i];
            distance += diff * diff;
        }
        distance = Math.sqrt(distance);

        // Convert distance to similarity score (0-100)
        const maxDistance = 1.0;
        const similarity = Math.max(0, 100 * (1 - distance / maxDistance));

        return {
            distance,
            similarity: Math.round(similarity),
            isMatch: distance < threshold,
            confidence: Math.min(100, Math.round(similarity))
        };
    }

    // ─── Validate Face for Registration ────────────────────────────────────────
    async validateFaceForRegistration(videoElement) {
        const attempts = [];
        let validCaptures = 0;
        const requiredCaptures = 3; // Multiple captures for better accuracy

        for (let i = 0; i < requiredCaptures; i++) {
            try {
                const detections = await this.detectFace(videoElement);
                
                if (detections.length === 0) {
                    attempts.push({
                        attempt: i + 1,
                        success: false,
                        error: 'No face detected'
                    });
                    continue;
                }

                const quality = this.assessFaceQuality(detections[0], videoElement);
                
                if (quality.quality >= 75) {
                    validCaptures++;
                    attempts.push({
                        attempt: i + 1,
                        success: true,
                        quality: quality.quality,
                        descriptor: detections[0].descriptor
                    });
                } else {
                    attempts.push({
                        attempt: i + 1,
                        success: false,
                        quality: quality.quality,
                        error: quality.issues[0]
                    });
                }

                // Wait before next attempt
                if (i < requiredCaptures - 1) {
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
            } catch (err) {
                attempts.push({
                    attempt: i + 1,
                    success: false,
                    error: err.message
                });
            }
        }

        return {
            isValid: validCaptures >= Math.ceil(requiredCaptures / 2),
            validCaptures,
            totalAttempts: requiredCaptures,
            attempts,
            averageQuality: Math.round(
                attempts
                    .filter(a => a.success)
                    .reduce((sum, a) => sum + a.quality, 0) / 
                Math.max(1, validCaptures)
            )
        };
    }

    // ─── Get Current Descriptor ───────────────────────────────────────────────
    getCurrentDescriptor() {
        return this.currentDescriptor;
    }

    // ─── Clear Session ────────────────────────────────────────────────────────
    clearSession() {
        this.currentDescriptor = null;
        this.capturedImage = null;
        this.stopVideoStream();
    }
}

// ─── Global Instance ──────────────────────────────────────────────────────────
const biometricAuth = new BiometricFaceAuth();

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    try {
        if (window.location.pathname.includes('login')) {
            // Only initialize on login page
            console.log('Inicializando Face ID en página de login...');
            // Will be initialized when needed to avoid delays
        }
    } catch (err) {
        console.error('Error en inicialización:', err);
    }
});
