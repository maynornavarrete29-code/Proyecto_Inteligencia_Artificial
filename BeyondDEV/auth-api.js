/* ==========================================================================
   BeyondDev Auth API Client
   Reemplaza auth.js — conecta con el servidor REST local (localhost:3000)
   ========================================================================== */

const API_BASE = 'http://localhost:3000/api';
const TOKEN_KEY = 'beyonddev_token';
const USER_KEY = 'beyonddev_user';

// ─── API Helper ───────────────────────────────────────────────────────────────
async function apiRequest(method, path, body = null, requiresAuth = false) {
    const headers = { 'Content-Type': 'application/json' };

    if (requiresAuth) {
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) headers['Authorization'] = `Bearer ${token}`;
    }

    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);

    const response = await fetch(`${API_BASE}${path}`, options);
    const data = await response.json();
    return data;
}

// ─── Auth Service API ─────────────────────────────────────────────────────────
const AuthAPI = {

    // Register a new user
    async register(name, email, password) {
        try {
            const result = await apiRequest('POST', '/auth/register', { name, email, password });
            if (result.success && result.devMail) {
                // Fire the local email event so DevMail widget updates instantly
                window.dispatchEvent(new CustomEvent('beyonddev-new-email', { detail: result.devMail }));
            }
            return result;
        } catch (err) {
            return { success: false, message: 'No se pudo conectar con el servidor. ¿Está corriendo la API?' };
        }
    },

    // Login user
    async login(email, password) {
        try {
            const result = await apiRequest('POST', '/auth/login', { email, password });
            if (result.success && result.token) {
                localStorage.setItem(TOKEN_KEY, result.token);
                localStorage.setItem(USER_KEY, JSON.stringify(result.user));
            }
            if (!result.success && result.devMail) {
                window.dispatchEvent(new CustomEvent('beyonddev-new-email', { detail: result.devMail }));
            }
            return result;
        } catch (err) {
            return { success: false, message: 'No se pudo conectar con el servidor. ¿Está corriendo la API?' };
        }
    },

    async registerFace(identifier, name) {
        try {
            return await apiRequest('POST', '/face/register', { identifier, name });
        } catch (err) {
            return { success: false, message: 'No se pudo conectar con el servidor FaceID.' };
        }
    },

    async verifyFace() {
        try {
            const result = await apiRequest('POST', '/face/verify');
            if (result.success && result.token) {
                localStorage.setItem(TOKEN_KEY, result.token);
                localStorage.setItem(USER_KEY, JSON.stringify(result.user));
            }
            return result;
        } catch (err) {
            return { success: false, message: 'No se pudo conectar con el servidor FaceID.' };
        }
    },

    // Verify account via email link
    async verifyAccount(email, token) {
        try {
            const result = await apiRequest('GET', `/auth/verify?email=${encodeURIComponent(email)}&token=${token}`);
            if (result.success && result.token) {
                localStorage.setItem(TOKEN_KEY, result.token);
                localStorage.setItem(USER_KEY, JSON.stringify(result.user));
            }
            return result;
        } catch (err) {
            return { success: false, message: 'No se pudo conectar con el servidor.' };
        }
    },

    // Send forgot-password email
    async forgotPassword(email) {
        try {
            const result = await apiRequest('POST', '/auth/forgot-password', { email });
            if (result.success && result.devMail) {
                window.dispatchEvent(new CustomEvent('beyonddev-new-email', { detail: result.devMail }));
            }
            return result;
        } catch (err) {
            return { success: false, message: 'No se pudo conectar con el servidor.' };
        }
    },

    // Reset password
    async resetPassword(email, token, newPassword) {
        try {
            return await apiRequest('POST', '/auth/reset-password', { email, token, newPassword });
        } catch (err) {
            return { success: false, message: 'No se pudo conectar con el servidor.' };
        }
    },

    // Session helpers
    isAuthenticated() {
        return !!localStorage.getItem(TOKEN_KEY);
    },

    getCurrentUser() {
        try {
            return JSON.parse(localStorage.getItem(USER_KEY));
        } catch {
            return null;
        }
    },

    getToken() {
        return localStorage.getItem(TOKEN_KEY);
    },

    logout() {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        window.location.href = 'login.html';
    },

    // ── DevMail API Methods ───────────────────────────────────────────────────
    async getMockEmails() {
        try {
            const result = await apiRequest('GET', '/emails');
            return result.emails || [];
        } catch {
            return [];
        }
    },

    async clearMockEmails() {
        try {
            await apiRequest('DELETE', '/emails');
            window.dispatchEvent(new CustomEvent('beyonddev-new-email', { detail: null }));
        } catch (err) {
            console.error('Error al limpiar bandeja:', err);
        }
    },

    // ── Projects & Tasks (pass-through to API) ────────────────────────────────
    async getProjects() {
        const result = await apiRequest('GET', '/projects', null, true);
        return result.projects || [];
    },

    async createProject(projectData) {
        return await apiRequest('POST', '/projects', projectData, true);
    },

    async updateProject(id, projectData) {
        return await apiRequest('PUT', `/projects/${id}`, projectData, true);
    },

    async deleteProject(id) {
        return await apiRequest('DELETE', `/projects/${id}`, null, true);
    },

    async getTasks() {
        const result = await apiRequest('GET', '/tasks', null, true);
        return result.tasks || [];
    },

    async createTask(taskData) {
        return await apiRequest('POST', '/tasks', taskData, true);
    },

    async updateTask(id, taskData) {
        return await apiRequest('PUT', `/tasks/${id}`, taskData, true);
    },

    async deleteTask(id) {
        return await apiRequest('DELETE', `/tasks/${id}`, null, true);
    }
};

// ─── SSE Listener — Real-time emails from server ──────────────────────────────
(function initSSE() {
    const eventSource = new EventSource(`${API_BASE}/events`);

    eventSource.addEventListener('new-email', (e) => {
        const emailData = JSON.parse(e.data);
        // Re-dispatch locally so DevMail widget renders it
        window.dispatchEvent(new CustomEvent('beyonddev-new-email', { detail: emailData }));
        console.log('📬 Nuevo correo recibido via SSE:', emailData.subject);
    });

    eventSource.addEventListener('emails-cleared', () => {
        window.dispatchEvent(new CustomEvent('beyonddev-new-email', { detail: null }));
    });

    eventSource.onerror = () => {
        // SSE will auto-reconnect; suppress console noise
    };
})();

// ─── Expose globally ──────────────────────────────────────────────────────────
window.AuthAPI = AuthAPI;

// Backwards compatibility: also expose as AuthService so existing code works
window.AuthService = {
    isAuthenticated: () => AuthAPI.isAuthenticated(),
    getCurrentUser: () => AuthAPI.getCurrentUser(),
    logout: () => AuthAPI.logout(),
    getMockEmails: async () => await AuthAPI.getMockEmails(),
    clearMockEmails: async () => await AuthAPI.clearMockEmails(),
    // These are async now — login.js handles them correctly
    register: (n, e, p) => AuthAPI.register(n, e, p),
    login: (e, p) => AuthAPI.login(e, p),
    registerFace: (id, n) => AuthAPI.registerFace(id, n),
    verifyFace: () => AuthAPI.verifyFace(),
    verifyAccount: (e, t) => AuthAPI.verifyAccount(e, t),
    forgotPassword: (e) => AuthAPI.forgotPassword(e),
    resetPassword: (e, t, p) => AuthAPI.resetPassword(e, t, p)
};
