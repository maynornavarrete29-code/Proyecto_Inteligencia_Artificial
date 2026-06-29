/* ==========================================================================
   BeyondDev Face ID Authentication UI Handler
   Manages Face ID login and registration modals and workflows
   ========================================================================== */

class FaceIDAuthUI {
    constructor() {
        this.isInitialized = false;
        this.currentMode = null; // 'login' or 'register'
        this.captureCount = 0;
        this.maxCaptures = 3;
        this.detectionInterval = null;
        this.faceDescriptors = [];
    }

    // ─── Initialize UI ────────────────────────────────────────────────────────
    async initialize() {
        if (this.isInitialized) return;

        try {
            console.log('🔐 Inicializando UI de Face ID...');
            this.setupEventListeners();
            this.isInitialized = true;
        } catch (err) {
            console.error('Error inicializando Face ID UI:', err);
        }
    }

    // ─── Setup Event Listeners ────────────────────────────────────────────────
    setupEventListeners() {
        // Login buttons
        const btnFaceLogin = document.getElementById('btn-face-login');
        if (btnFaceLogin) {
            btnFaceLogin.addEventListener('click', (e) => {
                e.preventDefault();
                this.openFaceLoginModal();
            });
        }

        // Register buttons
        const btnFaceRegister = document.getElementById('btn-face-register');
        if (btnFaceRegister) {
            btnFaceRegister.addEventListener('click', (e) => {
                e.preventDefault();
                this.openFaceRegisterModal();
            });
        }

        // Modal controls - Login
        const btnFaceLoginCapture = document.getElementById('btn-face-login-capture');
        if (btnFaceLoginCapture) {
            btnFaceLoginCapture.addEventListener('click', () => this.captureFaceLogin());
        }

        const btnFaceLoginCancel = document.getElementById('btn-face-login-cancel');
        if (btnFaceLoginCancel) {
            btnFaceLoginCancel.addEventListener('click', () => this.closeFaceLoginModal());
        }

        const btnFaceLoginRetry = document.getElementById('btn-face-login-retry');
        if (btnFaceLoginRetry) {
            btnFaceLoginRetry.addEventListener('click', () => this.resetFaceLoginCapture());
        }

        const btnFaceLoginClose = document.getElementById('btn-face-login-close');
        if (btnFaceLoginClose) {
            btnFaceLoginClose.addEventListener('click', () => this.closeFaceLoginModal());
        }

        const btnFaceLoginProceed = document.getElementById('btn-face-login-proceed');
        if (btnFaceLoginProceed) {
            btnFaceLoginProceed.addEventListener('click', () => this.proceedWithFaceLogin());
        }

        const btnFaceLoginCloseSelect = document.getElementById('btn-face-login-close-select');
        if (btnFaceLoginCloseSelect) {
            btnFaceLoginCloseSelect.addEventListener('click', () => this.closeFaceLoginModal());
        }

        // Modal controls - Register
        const btnFaceRegisterCapture = document.getElementById('btn-face-register-capture');
        if (btnFaceRegisterCapture) {
            btnFaceRegisterCapture.addEventListener('click', () => this.captureFaceRegister());
        }

        const btnFaceRegisterCancel = document.getElementById('btn-face-register-cancel');
        if (btnFaceRegisterCancel) {
            btnFaceRegisterCancel.addEventListener('click', () => this.closeFaceRegisterModal());
        }

        const btnFaceRegisterDone = document.getElementById('btn-face-register-done');
        if (btnFaceRegisterDone) {
            btnFaceRegisterDone.addEventListener('click', () => this.completeFaceRegistration());
        }
    }

    // ─── Open Face Login Modal ────────────────────────────────────────────────
    async openFaceLoginModal() {
        try {
            this.currentMode = 'login';
            const modal = document.getElementById('modal-face-login');
            
            // Check if biometric auth is available
            if (!window.biometricAuth) {
                throw new Error('Sistema biométrico no disponible. Recarga la página.');
            }

            // Show email selection first
            this.showFaceLoginElement('select');
            modal.classList.add('active');

            // Initialize biometric auth if not done
            if (!window.biometricAuth.isModelLoaded) {
                this.showFaceLoginElement('loading');
                await window.biometricAuth.initialize();
                this.showFaceLoginElement('select');
            }

        } catch (err) {
            console.error('Error abriendo modal de login:', err);
            this.showToast(err.message || 'Error abriendo Face ID', 'error');
        }
    }

    // ─── Proceed with Face Login ──────────────────────────────────────────────
    async proceedWithFaceLogin() {
        const emailInput = document.getElementById('face-login-email');
        const email = emailInput.value.trim();

        if (!email) {
            this.showToast('Por favor ingresa tu correo electrónico', 'error');
            return;
        }

        // Verify email exists in system
        try {
            const result = await window.AuthAPI.checkFaceEmail(email);
            if (!result.success) {
                this.showToast('Este correo no tiene Face ID registrado', 'error');
                return;
            }

            // Move to capture
            this.showFaceLoginElement('capture');
            await this.startFaceLoginCapture();

        } catch (err) {
            this.showToast(err.message || 'Error verificando correo', 'error');
        }
    }

    // ─── Start Face Login Capture ────────────────────────────────────────────
    async startFaceLoginCapture() {
        try {
            const videoElement = document.getElementById('face-login-video');
            await window.biometricAuth.startVideoStream(videoElement);
            this.startFaceDetection('login');
        } catch (err) {
            this.showToast(err.message || 'Error accediendo a la cámara', 'error');
            this.closeFaceLoginModal();
        }
    }

    // ─── Capture Face for Login ──────────────────────────────────────────────
    async captureFaceLogin() {
        try {
            const videoElement = document.getElementById('face-login-video');
            const canvasElement = document.getElementById('face-login-canvas');

            this.showFaceLoginElement('processing');

            // Capture snapshot
            biometricAuth.captureFaceSnapshot(videoElement, canvasElement);

            // Extract descriptor
            const descriptor = await biometricAuth.extractFaceDescriptor(videoElement);

            // Prepare for verification
            const email = document.getElementById('face-login-email').value;
            this.verifyFaceLogin(email, descriptor);

        } catch (err) {
            console.error('Error capturando rostro:', err);
            this.showFaceLoginResult('error', 'Error capturando rostro', err.message);
        }
    }

    // ─── Verify Face Login ────────────────────────────────────────────────────
    async verifyFaceLogin(email, descriptor) {
        try {
            const result = await window.AuthAPI.verifyFaceLogin(email, descriptor);

            if (result.success) {
                // Face matched, login successful
                this.showFaceLoginResult(
                    'success',
                    '¡Bienvenido!',
                    `Acceso verificado. Redirigiendo en 2 segundos...`
                );

                setTimeout(() => {
                    this.closeFaceLoginModal();
                    window.location.href = 'backend.html';
                }, 2000);
            } else {
                // Face not matched
                this.showFaceLoginResult(
                    'error',
                    'Acceso Denegado',
                    'El rostro no coincide con los registros. Intenta de nuevo.'
                );
            }
        } catch (err) {
            this.showFaceLoginResult('error', 'Error en verificación', err.message);
        }
    }

    // ─── Show Face Login Result ────────────────────────────────────────────
    showFaceLoginResult(type, title, message) {
        const resultContent = document.getElementById('face-login-result-content');
        const isSuccess = type === 'success';

        resultContent.innerHTML = `
            <div class="face-result ${type}">
                <div class="face-result-icon">
                    ${isSuccess ? 
                        '<i class="fa-solid fa-check-circle"></i>' : 
                        '<i class="fa-solid fa-exclamation-circle"></i>'}
                </div>
                <div class="face-result-message">${title}</div>
                <div class="face-result-details">${message}</div>
            </div>
        `;

        this.showFaceLoginElement('result');
    }

    // ─── Reset Face Login Capture ────────────────────────────────────────────
    async resetFaceLoginCapture() {
        biometricAuth.clearSession();
        this.faceDescriptors = [];
        await this.startFaceLoginCapture();
    }

    // ─── Close Face Login Modal ───────────────────────────────────────────────
    closeFaceLoginModal() {
        biometricAuth.clearSession();
        document.getElementById('modal-face-login').classList.remove('active');
        this.clearFaceDetectionInterval();
    }

    // ─── Open Face Register Modal ─────────────────────────────────────────────
    async openFaceRegisterModal() {
        try {
            this.currentMode = 'register';
            this.captureCount = 0;
            this.faceDescriptors = [];
            const modal = document.getElementById('modal-face-register');

            this.showFaceRegisterElement('loading');
            modal.classList.add('active');

            // Initialize biometric auth
            if (!biometricAuth.isModelLoaded) {
                await biometricAuth.initialize();
            }

            this.showFaceRegisterElement('capture');
            await this.startFaceRegisterCapture();

        } catch (err) {
            console.error('Error abriendo modal de registro:', err);
            this.showToast(err.message || 'Error abriendo Face ID', 'error');
        }
    }

    // ─── Start Face Register Capture ──────────────────────────────────────────
    async startFaceRegisterCapture() {
        try {
            const videoElement = document.getElementById('face-register-video');
            await window.biometricAuth.startVideoStream(videoElement);
            this.startFaceDetection('register');
        } catch (err) {
            this.showToast(err.message || 'Error accediendo a la cámara', 'error');
            this.closeFaceRegisterModal();
        }
    }

    // ─── Capture Face for Registration ────────────────────────────────────────
    async captureFaceRegister() {
        try {
            const videoElement = document.getElementById('face-register-video');
            const canvasElement = document.getElementById('face-register-canvas');

            this.showFaceRegisterElement('processing');

            // Capture snapshot
            biometricAuth.captureFaceSnapshot(videoElement, canvasElement);

            // Extract descriptor
            const descriptor = await biometricAuth.extractFaceDescriptor(videoElement);
            this.faceDescriptors.push(descriptor);

            this.captureCount++;
            const scanCounter = document.getElementById('scan-counter');
            scanCounter.textContent = Math.min(this.captureCount + 1, this.maxCaptures);

            if (this.captureCount >= this.maxCaptures) {
                // All captures done
                this.completeRegisterCapture();
            } else {
                // Continue capturing
                this.showToast(`Escaneo ${this.captureCount}/${this.maxCaptures} completado`, 'success');
                await new Promise(resolve => setTimeout(resolve, 1000));
                this.showFaceRegisterElement('capture');
            }

        } catch (err) {
            console.error('Error capturando rostro:', err);
            this.showFaceRegisterResult('error', 'Error en escaneo', err.message);
        }
    }

    // ─── Complete Register Capture ────────────────────────────────────────────
    async completeRegisterCapture() {
        try {
            this.showFaceRegisterElement('processing');

            // Validate and process all captures
            const validation = await window.biometricAuth.validateFaceForRegistration(
                document.getElementById('face-register-video')
            );

            if (validation.isValid) {
                this.showFaceRegisterResult(
                    'success',
                    'Escaneo Completado',
                    `Tu rostro ha sido capturado exitosamente (Calidad: ${validation.averageQuality}%)`
                );
            } else {
                this.showFaceRegisterResult(
                    'error',
                    'Escaneo Insuficiente',
                    `No se capturó suficiente calidad. Intenta de nuevo. (${validation.validCaptures}/${this.maxCaptures})`
                );
            }

        } catch (err) {
            this.showFaceRegisterResult('error', 'Error procesando', err.message);
        }
    }

    // ─── Show Face Register Result ─────────────────────────────────────────
    showFaceRegisterResult(type, title, message) {
        const resultContent = document.getElementById('face-register-result-content');
        const isSuccess = type === 'success';

        resultContent.innerHTML = `
            <div class="face-result ${type}">
                <div class="face-result-icon">
                    ${isSuccess ? 
                        '<i class="fa-solid fa-check-circle"></i>' : 
                        '<i class="fa-solid fa-exclamation-circle"></i>'}
                </div>
                <div class="face-result-message">${title}</div>
                <div class="face-result-details">${message}</div>
            </div>
        `;

        this.showFaceRegisterElement('result');
    }

    // ─── Complete Face Registration ────────────────────────────────────────────
    completeFaceRegistration() {
        // Store face descriptors in session for registration
        if (this.faceDescriptors.length > 0) {
            sessionStorage.setItem('faceDescriptors', JSON.stringify(this.faceDescriptors));
            this.showToast('Face ID registrado exitosamente', 'success');
        }

        this.closeFaceRegisterModal();
    }

    // ─── Close Face Register Modal ─────────────────────────────────────────────
    closeFaceRegisterModal() {
        biometricAuth.clearSession();
        document.getElementById('modal-face-register').classList.remove('active');
        this.clearFaceDetectionInterval();
    }

    // ─── Start Face Detection (Continuous) ────────────────────────────────────
    startFaceDetection(mode) {
        const videoElement = document.getElementById(`face-${mode}-video`);
        const statusElement = document.getElementById(`face-${mode}-status`);
        const statusText = document.getElementById(`face-${mode}-status-text`);
        const qualityBar = document.getElementById(`face-${mode}-quality-bar`);
        const qualityPercent = document.getElementById(`face-${mode}-quality-percent`);
        const captureBtn = document.getElementById(`btn-face-${mode}-capture`);

        this.clearFaceDetectionInterval();

        this.detectionInterval = setInterval(async () => {
            try {
                const detections = await window.biometricAuth.detectFace(videoElement);

                if (detections.length === 0) {
                    statusElement.style.display = 'flex';
                    statusText.textContent = 'Rostro no detectado. Acércate a la cámara.';
                    qualityBar.style.width = '0%';
                    qualityPercent.textContent = '0%';
                    captureBtn.disabled = true;
                } else if (detections.length > 1) {
                    statusElement.style.display = 'flex';
                    statusText.textContent = 'Se detectaron múltiples rostros. Asegúrate de estar solo.';
                    qualityBar.style.width = '0%';
                    qualityPercent.textContent = '0%';
                    captureBtn.disabled = true;
                } else {
                    const quality = window.biometricAuth.assessFaceQuality(detections[0], videoElement);
                    
                    // Update quality display
                    qualityBar.style.width = `${quality.quality}%`;
                    qualityPercent.textContent = `${Math.round(quality.quality)}%`;

                    if (quality.quality >= 75) {
                        statusText.textContent = '✓ Rostro detectado. Calidad excelente. Listo para capturar.';
                        statusElement.classList.remove('detecting', 'error');
                        statusElement.classList.add('success');
                        captureBtn.disabled = false;
                    } else if (quality.quality >= 50) {
                        statusText.textContent = `✓ Rostro detectado. Calidad aceptable (${quality.issues[0] || ''})`;
                        statusElement.classList.remove('error', 'success');
                        statusElement.classList.add('detecting');
                        captureBtn.disabled = false;
                    } else {
                        statusText.textContent = `✗ Calidad baja: ${quality.issues[0]}`;
                        statusElement.classList.remove('detecting', 'success');
                        statusElement.classList.add('error');
                        captureBtn.disabled = true;
                    }

                    statusElement.style.display = 'flex';
                }
            } catch (err) {
                console.error('Error en detección:', err);
            }
        }, 500);
    }

    // ─── Clear Face Detection Interval ─────────────────────────────────────────
    clearFaceDetectionInterval() {
        if (this.detectionInterval) {
            clearInterval(this.detectionInterval);
            this.detectionInterval = null;
        }
    }

    // ─── Show/Hide Face Elements ──────────────────────────────────────────────
    showFaceLoginElement(element) {
        const elements = ['loading', 'capture', 'processing', 'result', 'select'];
        elements.forEach(el => {
            const el_dom = document.getElementById(`face-login-${el}`);
            if (el_dom) el_dom.style.display = 'none';
        });
        const target = document.getElementById(`face-login-${element}`);
        if (target) target.style.display = 'block';
    }

    showFaceRegisterElement(element) {
        const elements = ['loading', 'capture', 'processing', 'result'];
        elements.forEach(el => {
            const el_dom = document.getElementById(`face-register-${el}`);
            if (el_dom) el_dom.style.display = 'none';
        });
        const target = document.getElementById(`face-register-${element}`);
        if (target) target.style.display = 'block';
    }

    // ─── Show Toast Notification ──────────────────────────────────────────────
    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fa-solid fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        container.appendChild(toast);
        setTimeout(() => toast.remove(), 4000);
    }
}

// ─── Initialize when DOM is ready ────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Create global biometric authentication instance
        if (typeof BiometricFaceAuth !== 'undefined') {
            window.biometricAuth = new BiometricFaceAuth();
            console.log('✅ Sistema biométrico iniciado');
        } else {
            console.warn('⚠️  BiometricFaceAuth no está disponible aún');
        }

        // Create and initialize Face ID UI
        const faceIDUI = new FaceIDAuthUI();
        window.faceIDUI = faceIDUI;
        await faceIDUI.initialize();
        console.log('✅ UI de Face ID inicializado');
    } catch (err) {
        console.error('❌ Error durante inicialización:', err);
    }
});
