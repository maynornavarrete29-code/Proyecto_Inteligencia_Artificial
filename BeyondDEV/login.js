/* ==========================================================================
   BeyondDev Authentication Portal - Interactive JavaScript
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. DOM Elements ---
    const authCard = document.getElementById('auth-card');
    
    // Views
    const viewMain = document.getElementById('view-main');
    const viewForgot = document.getElementById('view-forgot');
    const viewReset = document.getElementById('view-reset');
    
    // Tab toggles
    const tabBtns = document.querySelectorAll('.auth-tab-btn');
    const tabContents = document.querySelectorAll('.auth-tab-content');
    
    // Forms
    const formLogin = document.getElementById('form-login');
    const formRegister = document.getElementById('form-register');
    const formForgot = document.getElementById('form-forgot');
    const formReset = document.getElementById('form-reset');
    
    // View Switch Links
    const gotoForgot = document.getElementById('goto-forgot');
    const backToLoginForgot = document.getElementById('back-to-login-forgot');
    
    // Feedbacks
    const loginFeedback = document.getElementById('login-feedback');
    const registerFeedback = document.getElementById('register-feedback');
    const forgotFeedback = document.getElementById('forgot-feedback');
    const resetFeedback = document.getElementById('reset-feedback');
    
    // DevMail Simulator Elements
    const devMailWidget = document.getElementById('devmail-simulator');
    const devMailToggleBtn = document.getElementById('devmail-toggle-btn');
    const mailBadge = document.getElementById('mail-badge');
    const mailListContainer = document.getElementById('mail-list-container');
    const mailViewerContainer = document.getElementById('mail-viewer-container');
    const mailDisplayArea = document.getElementById('mail-display-area');
    const btnBackToMails = document.getElementById('btn-back-to-mails');
    const btnClearInbox = document.getElementById('btn-clear-inbox');
    const emptyInboxText = document.getElementById('empty-inbox-text');
    
    // Toast Container
    const toastContainer = document.getElementById('toast-container');

    // Global Action State
    let currentResetParams = null; // Store temp email and token during password reset

    // Check if user is already logged in
    if (window.AuthAPI && window.AuthAPI.isAuthenticated()) {
        window.location.href = 'backend.html';
        return;
    }

    // --- 2. URL Routing / Parameter Handling ---
    function handleUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const action = urlParams.get('action');
        const email = urlParams.get('email');
        const token = urlParams.get('token');

        if (action === 'verify' && email && token) {
            setTimeout(async () => {
                const result = await window.AuthAPI.verifyAccount(email, token);
                if (result.success) {
                    showToast(result.message, 'success');
                    // Remove url search params clean url
                    window.history.replaceState({}, document.title, window.location.pathname);
                    setTimeout(() => {
                        window.location.href = 'backend.html';
                    }, 1500);
                } else {
                    showToast(result.message, 'error');
                    window.history.replaceState({}, document.title, window.location.pathname);
                }
            }, 1000);
        } else if (action === 'reset' && email && token) {
            currentResetParams = { email, token };
            switchView('reset');
            // Clean url params
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }

    // Run parameter checks
    handleUrlParams();

    // --- 3. View / Tab Navigation ---
    function switchView(viewName) {
        // Hide all views
        viewMain.classList.remove('active');
        viewForgot.classList.remove('active');
        viewReset.classList.remove('active');

        // Reset feedbacks
        loginFeedback.style.display = 'none';
        registerFeedback.style.display = 'none';
        forgotFeedback.style.display = 'none';
        resetFeedback.style.display = 'none';

        // Show targets
        if (viewName === 'main') {
            viewMain.classList.add('active');
        } else if (viewName === 'forgot') {
            viewForgot.classList.add('active');
        } else if (viewName === 'reset') {
            viewReset.classList.add('active');
        }
    }

    // Desktop tabs switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(`tab-${targetTab}`).classList.add('active');
        });
    });

    // Forgot password navigation
    gotoForgot.addEventListener('click', (e) => {
        e.preventDefault();
        switchView('forgot');
    });

    backToLoginForgot.addEventListener('click', (e) => {
        e.preventDefault();
        switchView('main');
    });

    // --- 4. Passwords Visibility Toggles ---
    document.querySelectorAll('.pwd-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.parentElement.querySelector('input');
            const icon = btn.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    // --- 5. Form Validation & Submissions ---
    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validateField = (group, isValid) => {
        if (isValid) {
            group.classList.remove('invalid');
            return true;
        } else {
            group.classList.add('invalid');
            return false;
        }
    };

    // Live validation for input boxes
    document.querySelectorAll('.form-group input').forEach(input => {
        input.addEventListener('input', () => {
            const group = input.closest('.form-group');
            if (input.id === 'login-email' || input.id === 'register-email' || input.id === 'forgot-email') {
                validateField(group, isValidEmail(input.value.trim()));
            } else if (input.id === 'register-password' || input.id === 'reset-password') {
                const val = input.value;
                const hasCapital = /[A-Z]/.test(val);
                const hasDigit = /[0-9]/.test(val);
                const isLongEnough = val.length >= 6;
                validateField(group, isLongEnough && hasCapital && hasDigit);
            } else if (input.id === 'register-confirm' || input.id === 'reset-confirm') {
                const parentForm = input.closest('form');
                const pswInput = parentForm.querySelector('input[type="password"]');
                validateField(group, input.value === pswInput.value);
            } else if (input.required) {
                validateField(group, input.value.trim() !== '');
            }
        });
    });

    // Handle Form loading animations
    function toggleFormLoading(form, isLoading) {
        const btn = form.querySelector('.btn-submit');
        if (isLoading) {
            btn.classList.add('loading');
            btn.disabled = true;
        } else {
            btn.classList.remove('loading');
            btn.disabled = false;
        }
    }

    // A. Login Submission
    formLogin.addEventListener('submit', async (e) => {
        e.preventDefault();
        loginFeedback.style.display = 'none';

        const emailInput = document.getElementById('login-email');
        const pwdInput = document.getElementById('login-password');

        const emailValid = validateField(emailInput.closest('.form-group'), isValidEmail(emailInput.value.trim()));
        const pwdValid = validateField(pwdInput.closest('.form-group'), pwdInput.value.trim() !== '');

        if (emailValid && pwdValid) {
            toggleFormLoading(formLogin, true);

            const result = await window.AuthAPI.login(emailInput.value.trim(), pwdInput.value);
            toggleFormLoading(formLogin, false);

            if (result.success) {
                showToast(result.message, 'success');
                setTimeout(() => {
                    window.location.href = 'backend.html';
                }, 1200);
            } else {
                loginFeedback.textContent = result.message;
                loginFeedback.style.display = 'block';
                if (result.unverified) {
                    loginFeedback.className = 'form-feedback success'; // styled as a positive info box so they read the resend notice
                } else {
                    loginFeedback.className = 'form-feedback error';
                }
            }
        }
    });

    // B. Register Submission
    formRegister.addEventListener('submit', async (e) => {
        e.preventDefault();
        registerFeedback.style.display = 'none';

        const nameInput = document.getElementById('register-name');
        const emailInput = document.getElementById('register-email');
        const pwdInput = document.getElementById('register-password');
        const confirmInput = document.getElementById('register-confirm');

        const nameValid = validateField(nameInput.closest('.form-group'), nameInput.value.trim().length >= 3);
        const emailValid = validateField(emailInput.closest('.form-group'), isValidEmail(emailInput.value.trim()));
        
        // Passwords rules
        const pwdVal = pwdInput.value;
        const pswRulesValid = pwdVal.length >= 6 && /[A-Z]/.test(pwdVal) && /[0-9]/.test(pwdVal);
        const pwdValid = validateField(pwdInput.closest('.form-group'), pswRulesValid);
        const confirmValid = validateField(confirmInput.closest('.form-group'), confirmInput.value === pwdInput.value);

        if (nameValid && emailValid && pwdValid && confirmValid) {
            toggleFormLoading(formRegister, true);

            const result = await window.AuthAPI.register(
                nameInput.value.trim(),
                emailInput.value.trim(),
                pwdInput.value
            );
            toggleFormLoading(formRegister, false);

            if (result.success) {
                const pendingFaceDescriptors = sessionStorage.getItem('faceDescriptors');
                if (pendingFaceDescriptors) {
                    try {
                        const faceDescriptors = JSON.parse(pendingFaceDescriptors);
                        if (Array.isArray(faceDescriptors) && faceDescriptors.length > 0) {
                            const faceResult = await registerPendingFaceProfile(emailInput.value.trim(), faceDescriptors);
                            if (faceResult) {
                                showToast('Face ID fue registrado junto a tu cuenta.', 'success');
                            }
                        }
                    } catch (err) {
                        console.error('Error al procesar Face ID pendiente:', err);
                    }
                }

                showToast('Se envió un correo de verificación. Revisa la bandeja DevMail abajo.', 'info');
                registerFeedback.textContent = result.message;
                registerFeedback.className = 'form-feedback success';
                registerFeedback.style.display = 'block';
                formRegister.reset();
            } else {
                registerFeedback.textContent = result.message;
                registerFeedback.className = 'form-feedback error';
                registerFeedback.style.display = 'block';
            }
        }
    });

    async function registerPendingFaceProfile(email, faceDescriptors) {
        try {
            const result = await window.AuthAPI.registerFace(email, faceDescriptors);
            if (result.success) {
                sessionStorage.removeItem('faceDescriptors');
                return true;
            }
        } catch (err) {
            console.error('Error registrando Face ID pendiente con el servidor:', err);
        }
        return false;
    }

    // C. Forgot Password Submission
    formForgot.addEventListener('submit', async (e) => {
        e.preventDefault();
        forgotFeedback.style.display = 'none';

        const emailInput = document.getElementById('forgot-email');
        const emailValid = validateField(emailInput.closest('.form-group'), isValidEmail(emailInput.value.trim()));

        if (emailValid) {
            toggleFormLoading(formForgot, true);

            const result = await window.AuthAPI.forgotPassword(emailInput.value.trim());
            toggleFormLoading(formForgot, false);

            if (result.success) {
                showToast('Enlace de recuperación enviado. Revisa DevMail.', 'info');
                forgotFeedback.textContent = result.message;
                forgotFeedback.className = 'form-feedback success';
                forgotFeedback.style.display = 'block';
                formForgot.reset();
            } else {
                forgotFeedback.textContent = result.message;
                forgotFeedback.className = 'form-feedback error';
                forgotFeedback.style.display = 'block';
            }
        }
    });

    // D. Reset Password Submission
    formReset.addEventListener('submit', async (e) => {
        e.preventDefault();
        resetFeedback.style.display = 'none';

        const pwdInput = document.getElementById('reset-password');
        const confirmInput = document.getElementById('reset-confirm');

        const pwdVal = pwdInput.value;
        const pswRulesValid = pwdVal.length >= 6 && /[A-Z]/.test(pwdVal) && /[0-9]/.test(pwdVal);
        const pwdValid = validateField(pwdInput.closest('.form-group'), pswRulesValid);
        const confirmValid = validateField(confirmInput.closest('.form-group'), confirmInput.value === pwdInput.value);

        if (pwdValid && confirmValid && currentResetParams) {
            toggleFormLoading(formReset, true);

            const result = await window.AuthAPI.resetPassword(
                currentResetParams.email,
                currentResetParams.token,
                pwdInput.value
            );
            toggleFormLoading(formReset, false);

            if (result.success) {
                showToast(result.message, 'success');
                formReset.reset();
                currentResetParams = null;
                setTimeout(() => {
                    switchView('main');
                    // switch to login tab
                    document.querySelector('.auth-tab-btn[data-tab="login"]').click();
                }, 1500);
            } else {
                resetFeedback.textContent = result.message;
                resetFeedback.className = 'form-feedback error';
                resetFeedback.style.display = 'block';
            }
        }
    });

    // --- 6. DevMail Inbox Simulator Widget Logic ---
    
    // Toggle minimized/maximized state
    devMailToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDevMail();
    });
    
    document.querySelector('.devmail-header').addEventListener('click', () => {
        toggleDevMail();
    });

    function toggleDevMail(forceState = null) {
        if (forceState === 'open') {
            devMailWidget.classList.remove('minimized');
        } else if (forceState === 'close') {
            devMailWidget.classList.add('minimized');
        } else {
            devMailWidget.classList.toggle('minimized');
        }
    }

    // Refresh email list view
    async function renderEmailList() {
        const emails = await window.AuthAPI.getMockEmails();
        
        // Update badge count
        mailBadge.textContent = emails.length;
        if (emails.length === 0) {
            mailBadge.className = 'badge zero';
            emptyInboxText.style.display = 'flex';
            
            // Remove existing email items
            document.querySelectorAll('.mail-item').forEach(el => el.remove());
        } else {
            mailBadge.className = 'badge';
            emptyInboxText.style.display = 'none';
            
            // Remove existing email items
            document.querySelectorAll('.mail-item').forEach(el => el.remove());

            emails.forEach(email => {
                const item = document.createElement('div');
                item.className = 'mail-item unread';
                item.setAttribute('data-id', email.id);
                item.innerHTML = `
                    <div class="mail-item-header">
                        <span class="mail-item-from"><i class="fa-solid fa-server"></i> BeyondDev</span>
                        <span class="mail-item-time">${email.timestamp}</span>
                    </div>
                    <div class="mail-item-subject">${email.subject}</div>
                    <div class="mail-item-preview">Para: ${email.to} - Haz clic para abrir y realizar la acción...</div>
                `;

                item.addEventListener('click', () => {
                    openEmailDetails(email);
                });

                mailListContainer.appendChild(item);
            });
        }
    }

    // Open detailed email content
    function openEmailDetails(email) {
        mailListContainer.style.display = 'none';
        mailViewerContainer.style.display = 'flex';
        
        let actionBtnText = 'Acción';
        let actionUrl = '#';

        if (email.type === 'verify') {
            actionBtnText = 'Verificar Cuenta';
            actionUrl = `http://localhost:3000/login.html?action=verify&email=${encodeURIComponent(email.to)}&token=${email.token}`;
        } else if (email.type === 'reset') {
            actionBtnText = 'Restablecer Contraseña';
            actionUrl = `http://localhost:3000/login.html?action=reset&email=${encodeURIComponent(email.to)}&token=${email.token}`;
        }

        const etherealLink = email.previewUrl
            ? `<div class="mail-body-text" style="margin-top:12px;">
                <a href="${email.previewUrl}" target="_blank" class="mail-btn" style="background:rgba(167,139,250,0.15);color:#a78bfa;border:1px solid rgba(167,139,250,0.3);font-size:0.8rem;padding:8px 16px;">
                    <i class="fa-solid fa-envelope-open"></i> Ver en Ethereal.email
                </a>
               </div>`
            : '';

        mailDisplayArea.innerHTML = `
            <div class="mail-title">${email.subject}</div>
            <div class="mail-meta">
                <div class="mail-meta-row"><strong>De:</strong> BeyondDev Security &lt;security@beyonddev.com&gt;</div>
                <div class="mail-meta-row"><strong>Para:</strong> ${email.to}</div>
                <div class="mail-meta-row"><strong>Enviado:</strong> ${email.timestamp}</div>
            </div>
            <div class="mail-body-text">
                Hola, <strong>${email.name}</strong>.<br><br>
                ${email.type === 'verify' 
                    ? 'Gracias por registrarte en BeyondDev. Por favor verifica tu cuenta para poder ingresar a la plataforma y gestionar tus proyectos activos.' 
                    : 'Recibimos una solicitud para restablecer la contraseña de tu cuenta de desarrollador.'}
                <br><br>
                Por favor, haz clic en el siguiente botón para continuar el proceso:
            </div>
            <div class="mail-action-area">
                <a href="${actionUrl}" class="mail-btn" id="mail-action-btn">${actionBtnText}</a>
            </div>
            ${etherealLink}
            <div class="mail-body-text" style="font-size: 0.75rem; color: #718096; word-break: break-all; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 1rem;">
                Enlace directo:<br>
                <span style="color:#f0b429;">${actionUrl}</span>
            </div>
        `;

        // Action button click action directly inside email
        const actionBtn = document.getElementById('mail-action-btn');
        actionBtn.addEventListener('click', () => {
            // Close the widget drawer to see redirection animations
            toggleDevMail('close');
        });
    }

    // Go back to email lists
    btnBackToMails.addEventListener('click', () => {
        mailViewerContainer.style.display = 'none';
        mailListContainer.style.display = 'flex';
    });

    // Clear simulated inbox
    btnClearInbox.addEventListener('click', async (e) => {
        e.stopPropagation();
        await window.AuthAPI.clearMockEmails();
        showToast('Bandeja de entrada limpia', 'info');
        // Back to list if in viewer
        mailViewerContainer.style.display = 'none';
        mailListContainer.style.display = 'flex';
    });

    // Listen to real-time incoming mock emails
    window.addEventListener('beyonddev-new-email', (e) => {
        renderEmailList();
        if (e.detail) {
            // Auto expand simulator when a new email arrives
            toggleDevMail('open');
            // Play a notification sound or flash
            devMailWidget.style.animation = 'none';
            setTimeout(() => {
                devMailWidget.style.animation = 'floatGlow 0.5s ease';
            }, 10);
        }
    });

    // Render initially (async)
    renderEmailList();

    // --- 7. Toast Notification Helper ---
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast-item ${type}`;
        
        let icon = 'fa-circle-info';
        if (type === 'success') icon = 'fa-circle-check';
        if (type === 'error') icon = 'fa-triangle-exclamation';

        toast.innerHTML = `
            <i class="fa-solid ${icon}"></i>
            <span class="toast-msg">${message}</span>
        `;

        toastContainer.appendChild(toast);

        // Slide in
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        // Slide out & remove
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 4000);
    }
});
