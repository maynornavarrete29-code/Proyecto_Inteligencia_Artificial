/* ==========================================================================
   BeyondDev Auth & Data Mock Service
   ========================================================================== */

const BEYONDDEV_KEYS = {
    USERS: 'beyonddev_users',
    SESSION: 'beyonddev_session',
    PROJECTS: 'beyonddev_projects',
    TASKS: 'beyonddev_tasks',
    EMAILS: 'beyonddev_emails'
};

// Seed Initial Data if empty
function initDatabase() {
    // 1. Seed Users
    if (!localStorage.getItem(BEYONDDEV_KEYS.USERS)) {
        const defaultUsers = [
            {
                name: 'Administrador BeyondDev',
                email: 'admin@beyonddev.com',
                password: 'Admin123!',
                verified: true,
                verificationToken: null,
                resetToken: null
            }
        ];
        localStorage.setItem(BEYONDDEV_KEYS.USERS, JSON.stringify(defaultUsers));
    }

    // 2. Seed Projects
    if (!localStorage.getItem(BEYONDDEV_KEYS.PROJECTS)) {
        const defaultProjects = [
            {
                id: 'proj-1',
                name: 'Clon de Discord',
                client: 'Gaming Guild Latam',
                type: 'mobile',
                status: 'desarrollo', // idea, desarrollo, pruebas, completado
                progress: 65,
                budget: '12,500',
                hours: '142',
                developer: 'Jeferson Reyes',
                role: 'Mobile Dev',
                priority: 'alta', // baja, media, alta
                startDate: '2026-04-10',
                endDate: '2026-07-15',
                desc: 'Réplica móvil de alta fidelidad con canales de voz WebRTC en tiempo real, chat estructurado y roles dinámicos.'
            },
            {
                id: 'proj-2',
                name: 'Ahorro Inteligente',
                client: 'Fintech Spark',
                type: 'mobile',
                status: 'pruebas',
                progress: 88,
                budget: '8,400',
                hours: '95',
                developer: 'Maynor Padilla',
                role: 'Frontend Dev',
                priority: 'media',
                startDate: '2026-05-01',
                endDate: '2026-06-30',
                desc: 'App financiera de ahorro personal orientada a la salud de presupuestos familiares mediante visualización interactiva y metas.'
            },
            {
                id: 'proj-3',
                name: 'Gestión Hotelera (PMS)',
                client: 'Hotel San Pedro',
                type: 'system',
                status: 'en proceso',
                progress: 100,
                budget: '24,000',
                hours: '320',
                developer: 'Orlando Umanzor',
                role: 'Backend Dev',
                priority: 'alta',
                startDate: '2026-01-15',
                endDate: '2026-05-20',
                desc: 'ERP completo hotelero para reservas automatizadas, tarifas y facturación electrónica integrada.'
            },
            {
                id: 'proj-4',
                name: 'Catastro Inmobiliario',
                client: 'Lotificadora Continental',
                type: 'system',
                status: 'idea',
                progress: 15,
                budget: '18,500',
                hours: '24',
                developer: 'Cristhian Anibal',
                role: 'UI/UX Designer',
                priority: 'media',
                startDate: '2026-06-01',
                endDate: '2026-10-15',
                desc: 'Sistema web integral para visualización catastral de planos de terrenos interactivos de preventa y cuotas automatizadas.'
            }
        ];
        localStorage.setItem(BEYONDDEV_KEYS.PROJECTS, JSON.stringify(defaultProjects));
    }

    // 3. Seed Tasks (Kanban)
    if (!localStorage.getItem(BEYONDDEV_KEYS.TASKS)) {
        const defaultTasks = [
            { id: 'task-1', text: 'Diseñar arquitectura WebSockets', status: 'todo', project: 'Clon de Discord' },
            { id: 'task-2', text: 'Integrar canal de audio WebRTC', status: 'doing', project: 'Clon de Discord' },
            { id: 'task-3', text: 'Testing de base de datos SQLite', status: 'testing', project: 'Ahorro Inteligente' },
            { id: 'task-4', text: 'Crear vistas de presupuesto mensual', status: 'done', project: 'Ahorro Inteligente' },
            { id: 'task-5', text: 'Optimizar queries de base de datos', status: 'doing', project: 'Gestión Hotelera (PMS)' },
            { id: 'task-6', text: 'Maquetado inicial del dashboard', status: 'todo', project: 'Catastro Inmobiliario' }
        ];
        localStorage.setItem(BEYONDDEV_KEYS.TASKS, JSON.stringify(defaultTasks));
    }

    // 4. Seed Mock Email Box
    if (!localStorage.getItem(BEYONDDEV_KEYS.EMAILS)) {
        localStorage.setItem(BEYONDDEV_KEYS.EMAILS, JSON.stringify([]));
    }
}

// Call Database Init immediately
initDatabase();

// --- Auth Service API ---
const AuthService = {
    // Get all users
    getUsers() {
        return JSON.parse(localStorage.getItem(BEYONDDEV_KEYS.USERS)) || [];
    },

    // Save users
    saveUsers(users) {
        localStorage.setItem(BEYONDDEV_KEYS.USERS, JSON.stringify(users));
    },

    // Register a new user
    register(name, email, password) {
        const users = this.getUsers();
        
        // Check if user already exists
        if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
            return { success: false, message: 'El correo electrónico ya está registrado.' };
        }

        // Generate verification token
        const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        
        const newUser = {
            name,
            email,
            password,
            verified: false,
            verificationToken: token,
            resetToken: null
        };

        users.push(newUser);
        this.saveUsers(users);

        // Send mock email
        this.sendMockEmail({
            type: 'verify',
            to: email,
            name: name,
            subject: 'Verifica tu cuenta de BeyondDev',
            token: token
        });

        return { success: true, message: 'Registro exitoso. Se ha enviado un correo de verificación.' };
    },

    // Verify user account
    verifyAccount(email, token) {
        const users = this.getUsers();
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.verificationToken === token);

        if (!user) {
            return { success: false, message: 'Enlace de verificación inválido o expirado.' };
        }

        user.verified = true;
        user.verificationToken = null; // Clear token
        this.saveUsers(users);

        // Auto log in after verification
        this.setSession(user);

        return { success: true, message: '¡Cuenta verificada exitosamente! Bienvenido.' };
    },

    // Login user
    login(email, password) {
        const users = this.getUsers();
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

        if (!user) {
            return { success: false, message: 'Correo electrónico o contraseña incorrectos.' };
        }

        if (!user.verified) {
            // Re-send verification email if not verified
            if (!user.verificationToken) {
                user.verificationToken = Math.random().toString(36).substring(2, 15);
                this.saveUsers(users);
            }
            
            this.sendMockEmail({
                type: 'verify',
                to: user.email,
                name: user.name,
                subject: 'Verifica tu cuenta de BeyondDev',
                token: user.verificationToken
            });

            return { 
                success: false, 
                unverified: true, 
                message: 'Tu cuenta no está verificada. Te hemos enviado un nuevo correo de verificación.' 
            };
        }

        this.setSession(user);
        return { success: true, message: 'Inicio de sesión exitoso.' };
    },

    // Forgot password
    forgotPassword(email) {
        const users = this.getUsers();
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (!user) {
            // Return true anyway for security, so hackers don't harvest emails,
            // but for this demo, we'll indicate if it exists so the user knows what happened.
            return { success: false, message: 'El correo electrónico no se encuentra registrado.' };
        }

        // Generate reset token
        const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        user.resetToken = token;
        this.saveUsers(users);

        // Send mock email
        this.sendMockEmail({
            type: 'reset',
            to: email,
            name: user.name,
            subject: 'Restablecer contraseña de BeyondDev',
            token: token
        });

        return { success: true, message: 'Se ha enviado un enlace para restablecer la contraseña a tu correo.' };
    },

    // Reset password
    resetPassword(email, token, newPassword) {
        const users = this.getUsers();
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.resetToken === token);

        if (!user) {
            return { success: false, message: 'El enlace de restablecimiento es inválido o ha expirado.' };
        }

        user.password = newPassword;
        user.resetToken = null; // Clear token
        user.verified = true; // Auto-verify if they reset password
        this.saveUsers(users);

        return { success: true, message: 'Contraseña restablecida con éxito. Ya puedes iniciar sesión.' };
    },

    // Session Management
    setSession(user) {
        const sessionUser = {
            name: user.name,
            email: user.email
        };
        localStorage.setItem(BEYONDDEV_KEYS.SESSION, JSON.stringify(sessionUser));
    },

    getCurrentUser() {
        return JSON.parse(localStorage.getItem(BEYONDDEV_KEYS.SESSION));
    },

    logout() {
        localStorage.removeItem(BEYONDDEV_KEYS.SESSION);
        window.location.href = 'login.html';
    },

    isAuthenticated() {
        return localStorage.getItem(BEYONDDEV_KEYS.SESSION) !== null;
    },

    // --- Mock Email Helper ---
    sendMockEmail(emailDetails) {
        const emails = JSON.parse(localStorage.getItem(BEYONDDEV_KEYS.EMAILS)) || [];
        
        // Add timestamp and random ID
        const emailObject = {
            id: 'email-' + Date.now(),
            timestamp: new Date().toLocaleTimeString(),
            ...emailDetails
        };

        // Put new emails at the beginning of the list
        emails.unshift(emailObject);
        localStorage.setItem(BEYONDDEV_KEYS.EMAILS, JSON.stringify(emails));

        // Dispatch a custom event to notify the UI (the DevMail Inbox simulator) in real-time
        const event = new CustomEvent('beyonddev-new-email', { detail: emailObject });
        window.dispatchEvent(event);
    },

    getMockEmails() {
        return JSON.parse(localStorage.getItem(BEYONDDEV_KEYS.EMAILS)) || [];
    },

    clearMockEmails() {
        localStorage.setItem(BEYONDDEV_KEYS.EMAILS, JSON.stringify([]));
        window.dispatchEvent(new CustomEvent('beyonddev-new-email', { detail: null }));
    }
};

// Expose to window for global access
window.AuthService = AuthService;
window.BEYONDDEV_KEYS = BEYONDDEV_KEYS;
