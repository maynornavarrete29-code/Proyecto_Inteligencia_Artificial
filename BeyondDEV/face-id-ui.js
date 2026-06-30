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
                try {
                    console.log('🔄 Cargando modelos de Face ID para login...');
                    await window.biometricAuth.initialize();
                    console.log('✅ Modelos cargados para login');
                    
                    // Verify models are loaded
                    if (!window.biometricAuth.isModelLoaded) {
                        throw new Error('Los modelos no se cargaron correctamente');
                    }
                    
                    this.showFaceLoginElement('select');
                } catch (initErr) {
                    console.error('❌ Error cargando modelos:', initErr);
                    this.showToast('Error cargando Face ID. Verifica tu conexión.', 'error');
                    modal.classList.remove('active');
                    return;
                }
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

            // Initialize biometric auth with error handling
            try {
                if (!window.biometricAuth.isModelLoaded) {
                    console.log('🔄 Cargando modelos de Face ID...');
                    await window.biometricAuth.initialize();
                    console.log('✅ Modelos cargados correctamente');
                }
            } catch (initErr) {
                console.error('❌ Error cargando modelos:', initErr);
                this.showToast('Error cargando Face ID. Verifica tu conexión.', 'error');
                modal.classList.remove('active');
                return;
            }

            // Verify models are loaded before proceeding
            if (!window.biometricAuth.isModelLoaded) {
                this.showToast('Los modelos no se cargaron correctamente. Intenta de nuevo.', 'error');
                modal.classList.remove('active');
                return;
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
            const videoElement = document.getElementById('face-register-video');

            // Stop detection while processing
            this.clearFaceDetectionInterval();

            console.log(`✓ Se capturaron ${this.faceDescriptors.length} rostros. Procesando...`);

            // Validate all captures
            if (this.faceDescriptors.length === 0) {
                this.showFaceRegisterResult(
                    'error',
                    'Error de captura',
                    'No se capturaron datos faciales válidos. Intenta de nuevo.'
                );
                // Reset for retry
                this.captureCount = 0;
                this.faceDescriptors = [];
                await new Promise(resolve => setTimeout(resolve, 2000));
                this.closeFaceRegisterModal();
                return;
            }

            const averageQuality = Math.round(
                this.faceDescriptors.reduce((sum, fd) => sum + (fd.quality || 75), 0) / this.faceDescriptors.length
            );

            if (averageQuality < 75) {
                this.showFaceRegisterResult(
                    'error',
                    'Calidad insuficiente',
                    `La calidad promedio es ${averageQuality}%. Se requiere al menos 75%. Intenta de nuevo.`
                );
                // Reset for retry
                this.captureCount = 0;
                this.faceDescriptors = [];
                return;
            }

            // Proceed with registration
            console.log(`✓ Calidad validada: ${averageQuality}%. Registrando Face ID...`);
            this.showFaceRegisterResult(
                'success',
                'Escaneo Completado',
                `Tu rostro ha sido capturado exitosamente (Calidad: ${averageQuality}%). Registrando...`
            );

            // Auto-register after showing success
            await new Promise(resolve => setTimeout(resolve, 1500));
            await this.completeFaceRegistration();

        } catch (err) {
            console.error('Error en completeRegisterCapture:', err);
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
    async completeFaceRegistration() {
        if (this.faceDescriptors.length === 0) {
            this.showFaceRegisterResult('error', 'No hay datos faciales', 'Captura al menos un rostro antes de completar el registro.');
            return;
        }

        // Get email - try multiple sources
        let email = null;

        // 1. Try to get from logged-in user
        const currentUser = window.AuthAPI.getCurrentUser();
        if (currentUser && currentUser.email) {
            email = currentUser.email;
        }

        // 2. If not logged in, try register form email input
        if (!email) {
            const registerEmailInput = document.getElementById('register-email');
            if (registerEmailInput) {
                email = registerEmailInput.value.trim();
            }
        }

        // 3. If still no email, ask user
        if (!email) {
            this.showFaceRegisterResult(
                'error',
                'Email requerido',
                'Por favor inicia sesión o ingresa tu correo electrónico en el formulario de registro.'
            );
            return;
        }

        if (!this.isValidEmail(email)) {
            this.showFaceRegisterResult('error', 'Email inválido', 'Por favor verifica tu dirección de correo electrónico.');
            return;
        }

        this.showFaceRegisterElement('processing');

        try {
            // Extract descriptor arrays AND quality from the complex objects
            const descriptorData = this.faceDescriptors.map(fd => {
                if (fd && fd.descriptor) {
                    return {
                        descriptor: Array.isArray(fd.descriptor) ? fd.descriptor : Array.from(fd.descriptor),
                        quality: fd.quality || 75
                    };
                }
                return null;
            }).filter(d => d !== null);

            if (descriptorData.length === 0) {
                throw new Error('No se pudieron procesar los descriptores faciales.');
            }

            console.log(`📤 Registrando ${descriptorData.length} descriptores faciales para ${email}...`);
            const result = await window.AuthAPI.registerFace(email, descriptorData);

            if (result.success) {
                // Clear session data
                sessionStorage.removeItem('faceDescriptors');
                this.faceDescriptors = [];
                this.captureCount = 0;

                this.showFaceRegisterResult(
                    'success',
                    '✓ Face ID Registrado',
                    `Tu perfil facial ha sido asociado exitosamente a ${email}. Ya puedes usar Face ID para acceder.`
                );

                // Auto-close after success
                setTimeout(() => {
                    this.closeFaceRegisterModal();
                }, 3000);
            } else {
                throw new Error(result.message || 'Error registrando Face ID');
            }
        } catch (err) {
            console.error('❌ Error registrando Face ID:', err);
            this.showFaceRegisterResult(
                'error',
                'Error registrando Face ID',
                err.message || 'No se pudo asociar tu perfil facial. Intenta de nuevo.'
            );
        }
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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

        // Verificar que los modelos están cargados antes de empezar
        if (!window.biometricAuth || !window.biometricAuth.isModelLoaded) {
            if (statusElement) {
                statusText.textContent = 'Inicializando modelos... Por favor espera.';
                statusElement.style.display = 'flex';
            }
            // Reintentar después de un delay
            setTimeout(() => this.startFaceDetection(mode), 1000);
            return;
        }

        this.detectionInterval = setInterval(async () => {
            try {
                // Double-check que los modelos sigan cargados
                if (!window.biometricAuth || !window.biometricAuth.isModelLoaded) {
                    console.warn('⚠️ Modelos no están listos todavía');
                    if (statusText) statusText.textContent = 'Modelos cargando... Por favor espera.';
                    return;
                }

                const detections = await window.biometricAuth.detectFace(videoElement);

                if (detections.length === 0) {
                    if (statusElement) statusElement.style.display = 'flex';
                    if (statusText) statusText.textContent = 'Rostro no detectado. Acércate a la cámara.';
                    if (qualityBar) qualityBar.style.width = '0%';
                    if (qualityPercent) qualityPercent.textContent = '0%';
                    if (captureBtn) captureBtn.disabled = true;
                } else if (detections.length > 1) {
                    if (statusElement) statusElement.style.display = 'flex';
                    if (statusText) statusText.textContent = 'Se detectaron múltiples rostros. Asegúrate de estar solo.';
                    if (qualityBar) qualityBar.style.width = '0%';
                    if (qualityPercent) qualityPercent.textContent = '0%';
                    if (captureBtn) captureBtn.disabled = true;
                } else {
                    const quality = window.biometricAuth.assessFaceQuality(detections[0], videoElement);
                    
                    // Update quality display
                    if (qualityBar) qualityBar.style.width = `${quality.quality}%`;
                    if (qualityPercent) qualityPercent.textContent = `${Math.round(quality.quality)}%`;

                    if (quality.quality >= 75) {
                        if (statusText) statusText.textContent = '✓ Rostro detectado. Calidad excelente. Listo para capturar.';
                        if (statusElement) {
                            statusElement.classList.remove('detecting', 'error');
                            statusElement.classList.add('success');
                        }
                        if (captureBtn) captureBtn.disabled = false;
                    } else if (quality.quality >= 50) {
                        if (statusText) statusText.textContent = `✓ Rostro detectado. Calidad aceptable (${quality.issues[0] || ''})`;
                        if (statusElement) {
                            statusElement.classList.remove('error', 'success');
                            statusElement.classList.add('detecting');
                        }
                        if (captureBtn) captureBtn.disabled = false;
                    } else {
                        if (statusText) statusText.textContent = `✗ Calidad baja: ${quality.issues[0]}`;
                        if (statusElement) {
                            statusElement.classList.remove('detecting', 'success');
                            statusElement.classList.add('error');
                        }
                        if (captureBtn) captureBtn.disabled = true;
                    }

                    if (statusElement) statusElement.style.display = 'flex';
                }
            } catch (err) {
                console.error('❌ Error en detección:', err);
                if (statusText) statusText.textContent = `Error: ${err.message}`;
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
