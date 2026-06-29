/* ==========================================================================
   BeyondDev Auth API Server - Express REST + SSE Real-time Emails
   ========================================================================== */

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const { initMailer, sendVerificationEmail, sendResetEmail } = require('./mailer');

// ─── Config ─────────────────────────────────────────────────────────────────
const app = express();
const PORT = 3000;
const JWT_SECRET = 'beyonddev_jwt_secret_2026_change_in_production';
const DB_PATH = path.join(__dirname, 'db.json');
const STATIC_PATH = path.join(__dirname, '..'); // serve parent folder for login.html links
const BASE_URL = `http://localhost:${PORT}`;

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'] }));
app.use(express.json());
app.use(express.static(STATIC_PATH)); // Serve the frontend static files

// ─── SSE Clients Registry (for real-time email notifications) ────────────────
let sseClients = [];

function sendSSEToAll(eventName, data) {
    const payload = `event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`;
    sseClients = sseClients.filter(client => {
        try {
            client.write(payload);
            return true;
        } catch {
            return false;
        }
    });
}

// ─── DB Helpers ──────────────────────────────────────────────────────────────
function readDB() {
    try {
        return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    } catch {
        return { users: [], emails: [], projects: [], tasks: [] };
    }
}

function writeDB(data) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

// ─── Auth Middleware ─────────────────────────────────────────────────────────
function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'No autorizado. Token requerido.' });
    }
    try {
        const token = authHeader.split(' ')[1];
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch {
        return res.status(401).json({ success: false, message: 'Token inválido o expirado.' });
    }
}

// ─── ROUTES ─────────────────────────────────────────────────────────────────

// Health check
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'BeyondDev API funcionando correctamente.', timestamp: new Date().toISOString() });
});

// ── POST /api/auth/register ──────────────────────────────────────────────────
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Nombre, correo y contraseña son requeridos.' });
        }

        const db = readDB();
        const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (existing) {
            return res.status(409).json({ success: false, message: 'El correo electrónico ya está registrado.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = uuidv4().replace(/-/g, '');

        const newUser = {
            id: 'user-' + uuidv4(),
            name,
            email,
            password: hashedPassword,
            verified: false,
            verificationToken,
            resetToken: null,
            resetTokenExpiry: null,
            createdAt: new Date().toISOString()
        };

        db.users.push(newUser);

        // Send verification email
        const mailResult = await sendVerificationEmail({ to: email, name, token: verificationToken, baseUrl: BASE_URL });

        // Add to DevMail inbox (SSE notification)
        const devMailEntry = {
            id: 'email-' + Date.now(),
            type: 'verify',
            to: email,
            name,
            subject: 'Verifica tu cuenta de BeyondDev',
            token: verificationToken,
            timestamp: new Date().toLocaleTimeString('es'),
            previewUrl: mailResult.previewUrl
        };
        db.emails.unshift(devMailEntry);
        writeDB(db);

        // Notify SSE clients
        sendSSEToAll('new-email', devMailEntry);

        res.status(201).json({
            success: true,
            message: 'Registro exitoso. Se ha enviado un correo de verificación.',
            devMail: devMailEntry
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
});

// ── POST /api/auth/login ─────────────────────────────────────────────────────
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Correo y contraseña son requeridos.' });
        }

        const db = readDB();
        const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ success: false, message: 'Correo electrónico o contraseña incorrectos.' });
        }

        if (!user.verified) {
            // Re-send verification email
            if (!user.verificationToken) {
                user.verificationToken = uuidv4().replace(/-/g, '');
                writeDB(db);
            }

            const mailResult = await sendVerificationEmail({
                to: user.email, name: user.name,
                token: user.verificationToken, baseUrl: BASE_URL
            });

            const devMailEntry = {
                id: 'email-' + Date.now(),
                type: 'verify',
                to: user.email,
                name: user.name,
                subject: 'Verifica tu cuenta de BeyondDev',
                token: user.verificationToken,
                timestamp: new Date().toLocaleTimeString('es'),
                previewUrl: mailResult.previewUrl
            };
            db.emails.unshift(devMailEntry);
            writeDB(db);
            sendSSEToAll('new-email', devMailEntry);

            return res.status(403).json({
                success: false,
                unverified: true,
                message: 'Tu cuenta no está verificada. Te hemos enviado un nuevo correo de verificación.',
                devMail: devMailEntry
            });
        }

        const token = jwt.sign(
            { id: user.id, name: user.name, email: user.email },
            JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({
            success: true,
            message: 'Inicio de sesión exitoso.',
            token,
            user: { id: user.id, name: user.name, email: user.email }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
});

// ── GET /api/auth/verify ─────────────────────────────────────────────────────
app.get('/api/auth/verify', (req, res) => {
    try {
        const { email, token } = req.query;

        if (!email || !token) {
            return res.status(400).json({ success: false, message: 'Email y token son requeridos.' });
        }

        const db = readDB();
        const user = db.users.find(u =>
            u.email.toLowerCase() === email.toLowerCase() &&
            u.verificationToken === token
        );

        if (!user) {
            return res.status(400).json({ success: false, message: 'Enlace de verificación inválido o expirado.' });
        }

        user.verified = true;
        user.verificationToken = null;
        writeDB(db);

        // Auto-login: generate token
        const jwtToken = jwt.sign(
            { id: user.id, name: user.name, email: user.email },
            JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({
            success: true,
            message: '¡Cuenta verificada exitosamente! Bienvenido.',
            token: jwtToken,
            user: { id: user.id, name: user.name, email: user.email }
        });
    } catch (error) {
        console.error('Verify error:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
});

// ── POST /api/auth/forgot-password ───────────────────────────────────────────
app.post('/api/auth/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: 'El correo electrónico es requerido.' });
        }

        const db = readDB();
        const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (!user) {
            return res.status(404).json({ success: false, message: 'El correo electrónico no se encuentra registrado.' });
        }

        const resetToken = uuidv4().replace(/-/g, '');
        const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour
        user.resetToken = resetToken;
        user.resetTokenExpiry = resetTokenExpiry;

        const mailResult = await sendResetEmail({ to: email, name: user.name, token: resetToken, baseUrl: BASE_URL });

        const devMailEntry = {
            id: 'email-' + Date.now(),
            type: 'reset',
            to: email,
            name: user.name,
            subject: 'Restablecer contraseña de BeyondDev',
            token: resetToken,
            timestamp: new Date().toLocaleTimeString('es'),
            previewUrl: mailResult.previewUrl
        };
        db.emails.unshift(devMailEntry);
        writeDB(db);
        sendSSEToAll('new-email', devMailEntry);

        res.json({
            success: true,
            message: 'Se ha enviado un enlace para restablecer la contraseña a tu correo.',
            devMail: devMailEntry
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
});

// ── POST /api/auth/reset-password ────────────────────────────────────────────
app.post('/api/auth/reset-password', async (req, res) => {
    try {
        const { email, token, newPassword } = req.body;

        if (!email || !token || !newPassword) {
            return res.status(400).json({ success: false, message: 'Email, token y nueva contraseña son requeridos.' });
        }

        const db = readDB();
        const user = db.users.find(u =>
            u.email.toLowerCase() === email.toLowerCase() &&
            u.resetToken === token
        );

        if (!user) {
            return res.status(400).json({ success: false, message: 'El enlace de restablecimiento es inválido o ha expirado.' });
        }

        if (user.resetTokenExpiry && new Date() > new Date(user.resetTokenExpiry)) {
            user.resetToken = null;
            user.resetTokenExpiry = null;
            writeDB(db);
            return res.status(400).json({ success: false, message: 'El enlace de restablecimiento ha expirado. Solicita uno nuevo.' });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetToken = null;
        user.resetTokenExpiry = null;
        user.verified = true;
        writeDB(db);

        res.json({ success: true, message: 'Contraseña restablecida con éxito. Ya puedes iniciar sesión.' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
});

// ── GET /api/auth/me ─────────────────────────────────────────────────────────
app.get('/api/auth/me', requireAuth, (req, res) => {
    res.json({ success: true, user: req.user });
});

// ── POST /api/auth/logout ─────────────────────────────────────────────────────
app.post('/api/auth/logout', requireAuth, (req, res) => {
    res.json({ success: true, message: 'Sesión cerrada exitosamente.' });
});

// ── GET /api/emails ───────────────────────────────────────────────────────────
app.get('/api/emails', (req, res) => {
    const db = readDB();
    res.json({ success: true, emails: db.emails });
});

// ── DELETE /api/emails ────────────────────────────────────────────────────────
app.delete('/api/emails', (req, res) => {
    const db = readDB();
    db.emails = [];
    writeDB(db);
    sendSSEToAll('emails-cleared', {});
    res.json({ success: true, message: 'Bandeja de entrada limpiada.' });
});

// ── GET /api/projects ─────────────────────────────────────────────────────────
app.get('/api/projects', requireAuth, (req, res) => {
    const db = readDB();
    res.json({ success: true, projects: db.projects });
});

// ── POST /api/projects ────────────────────────────────────────────────────────
app.post('/api/projects', requireAuth, (req, res) => {
    const db = readDB();
    const project = { id: 'proj-' + uuidv4(), ...req.body };
    db.projects.push(project);
    writeDB(db);
    res.status(201).json({ success: true, project });
});

// ── PUT /api/projects/:id ─────────────────────────────────────────────────────
app.put('/api/projects/:id', requireAuth, (req, res) => {
    const db = readDB();
    const idx = db.projects.findIndex(p => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Proyecto no encontrado.' });
    db.projects[idx] = { ...db.projects[idx], ...req.body };
    writeDB(db);
    res.json({ success: true, project: db.projects[idx] });
});

// ── DELETE /api/projects/:id ──────────────────────────────────────────────────
app.delete('/api/projects/:id', requireAuth, (req, res) => {
    const db = readDB();
    const idx = db.projects.findIndex(p => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Proyecto no encontrado.' });
    db.projects.splice(idx, 1);
    writeDB(db);
    res.json({ success: true, message: 'Proyecto eliminado.' });
});

// ── GET /api/tasks ────────────────────────────────────────────────────────────
app.get('/api/tasks', requireAuth, (req, res) => {
    const db = readDB();
    res.json({ success: true, tasks: db.tasks });
});

// ── POST /api/tasks ───────────────────────────────────────────────────────────
app.post('/api/tasks', requireAuth, (req, res) => {
    const db = readDB();
    const task = { id: 'task-' + uuidv4(), ...req.body };
    db.tasks.push(task);
    writeDB(db);
    res.status(201).json({ success: true, task });
});

// ── PUT /api/tasks/:id ────────────────────────────────────────────────────────
app.put('/api/tasks/:id', requireAuth, (req, res) => {
    const db = readDB();
    const idx = db.tasks.findIndex(t => t.id === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Tarea no encontrada.' });
    db.tasks[idx] = { ...db.tasks[idx], ...req.body };
    writeDB(db);
    res.json({ success: true, task: db.tasks[idx] });
});

// ── DELETE /api/tasks/:id ─────────────────────────────────────────────────────
app.delete('/api/tasks/:id', requireAuth, (req, res) => {
    const db = readDB();
    const idx = db.tasks.findIndex(t => t.id === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Tarea no encontrada.' });
    db.tasks.splice(idx, 1);
    writeDB(db);
    res.json({ success: true, message: 'Tarea eliminada.' });
});

// ═════════════════════════════════════════════════════════════════════════════
// BIOMETRIC FACE ID AUTHENTICATION ENDPOINTS
// ═════════════════════════════════════════════════════════════════════════════

// ── POST /api/auth/check-face-email ────────────────────────────────────────
app.post('/api/auth/check-face-email', (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: 'Correo es requerido.' });
        }

        const db = readDB();
        const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (!user) {
            return res.status(404).json({ success: false, message: 'Correo no registrado.' });
        }

        if (!user.faceProfile || !user.faceProfile.descriptors || user.faceProfile.descriptors.length === 0) {
            return res.status(404).json({ success: false, message: 'Face ID no registrado para este correo.' });
        }

        res.json({
            success: true,
            message: 'Usuario tiene Face ID registrado.',
            user: { id: user.id, name: user.name, email: user.email }
        });
    } catch (error) {
        console.error('Check face email error:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
});

// ── POST /api/auth/register-face ───────────────────────────────────────────
app.post('/api/auth/register-face', async (req, res) => {
    try {
        const { email, descriptors } = req.body;

        if (!email || !descriptors || !Array.isArray(descriptors)) {
            return res.status(400).json({ success: false, message: 'Email y descriptores faciales son requeridos.' });
        }

        const db = readDB();
        const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (!user) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado.' });
        }

        // Store face profile with all descriptors
        user.faceProfile = {
            descriptors: descriptors,
            registeredAt: new Date().toISOString(),
            lastVerifiedAt: null,
            verificationCount: 0,
            quality: calculateAverageQuality(descriptors)
        };

        writeDB(db);

        // Send confirmation email
        const mailResult = await sendVerificationEmail({
            to: email,
            name: user.name,
            token: 'faceid-registered',
            baseUrl: BASE_URL
        });

        const devMailEntry = {
            id: 'email-' + Date.now(),
            type: 'faceid',
            to: email,
            name: user.name,
            subject: 'Face ID Registrado en BeyondDev',
            message: 'Tu perfil facial ha sido registrado exitosamente. Puedes usar Face ID para acceder.',
            timestamp: new Date().toLocaleTimeString('es'),
            previewUrl: mailResult.previewUrl
        };

        db.emails.unshift(devMailEntry);
        writeDB(db);
        sendSSEToAll('new-email', devMailEntry);

        res.json({
            success: true,
            message: 'Face ID registrado exitosamente.',
            devMail: devMailEntry
        });
    } catch (error) {
        console.error('Register face error:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
});

// ── POST /api/auth/verify-face-login ───────────────────────────────────────
app.post('/api/auth/verify-face-login', (req, res) => {
    try {
        const { email, descriptor } = req.body;

        if (!email || !descriptor) {
            return res.status(400).json({ success: false, message: 'Email y descriptor facial son requeridos.' });
        }

        const db = readDB();
        const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (!user) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado.' });
        }

        if (!user.faceProfile || !user.faceProfile.descriptors) {
            return res.status(403).json({ success: false, message: 'Usuario no tiene Face ID registrado.' });
        }

        if (!user.verified) {
            return res.status(403).json({
                success: false,
                message: 'Cuenta no verificada. Por favor verifica tu correo primero.'
            });
        }

        // Compare face descriptors
        const match = compareFaceDescriptors(descriptor, user.faceProfile.descriptors);

        if (match.isMatch && match.confidence >= 60) {
            // Face matched
            user.faceProfile.lastVerifiedAt = new Date().toISOString();
            user.faceProfile.verificationCount = (user.faceProfile.verificationCount || 0) + 1;
            writeDB(db);

            const token = jwt.sign(
                { id: user.id, name: user.name, email: user.email },
                JWT_SECRET,
                { expiresIn: '8h' }
            );

            res.json({
                success: true,
                message: 'Acceso verificado mediante Face ID.',
                token,
                user: { id: user.id, name: user.name, email: user.email }
            });
        } else {
            // Face not matched
            res.status(401).json({
                success: false,
                message: 'El rostro no coincide. Intenta de nuevo.',
                confidence: match.confidence
            });
        }
    } catch (error) {
        console.error('Verify face login error:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
});

// ── GET /api/auth/face-profile ─────────────────────────────────────────────
app.get('/api/auth/face-profile', requireAuth, (req, res) => {
    try {
        const db = readDB();
        const user = db.users.find(u => u.id === req.user.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado.' });
        }

        const hasProfile = !!(user.faceProfile && user.faceProfile.descriptors && user.faceProfile.descriptors.length > 0);

        res.json({
            success: true,
            hasFaceProfile: hasProfile,
            profile: hasProfile ? {
                registeredAt: user.faceProfile.registeredAt,
                lastVerifiedAt: user.faceProfile.lastVerifiedAt,
                verificationCount: user.faceProfile.verificationCount,
                quality: user.faceProfile.quality
            } : null
        });
    } catch (error) {
        console.error('Get face profile error:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
});

// ── DELETE /api/auth/face-profile ──────────────────────────────────────────
app.delete('/api/auth/face-profile', requireAuth, (req, res) => {
    try {
        const db = readDB();
        const user = db.users.find(u => u.id === req.user.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado.' });
        }

        delete user.faceProfile;
        writeDB(db);

        res.json({
            success: true,
            message: 'Face ID eliminado exitosamente.'
        });
    } catch (error) {
        console.error('Delete face profile error:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
});

// ─── Face Descriptor Comparison Helper ────────────────────────────────────────
function compareFaceDescriptors(newDescriptor, storedDescriptors, threshold = 0.6) {
    if (!Array.isArray(newDescriptor.descriptor || newDescriptor)) {
        return { isMatch: false, confidence: 0, distance: Infinity };
    }

    const descriptor = newDescriptor.descriptor || newDescriptor;
    const distances = [];

    // Compare against all stored descriptors
    for (const storedDesc of storedDescriptors) {
        const stored = Array.isArray(storedDesc) ? storedDesc : storedDesc.descriptor;
        
        if (!Array.isArray(stored)) continue;

        // Euclidean distance
        let distance = 0;
        for (let i = 0; i < Math.min(descriptor.length, stored.length); i++) {
            const diff = descriptor[i] - stored[i];
            distance += diff * diff;
        }
        distance = Math.sqrt(distance);
        distances.push(distance);
    }

    if (distances.length === 0) {
        return { isMatch: false, confidence: 0, distance: Infinity };
    }

    // Use minimum distance
    const minDistance = Math.min(...distances);
    const maxDistance = 1.0;
    const confidence = Math.max(0, 100 * (1 - minDistance / maxDistance));

    return {
        isMatch: minDistance < threshold,
        confidence: Math.round(confidence),
        distance: minDistance
    };
}

// ─── Calculate Average Quality ────────────────────────────────────────────────
function calculateAverageQuality(descriptors) {
    if (!Array.isArray(descriptors) || descriptors.length === 0) return 0;

    let totalQuality = 0;
    for (const desc of descriptors) {
        if (desc.quality) {
            totalQuality += desc.quality;
        }
    }

    return Math.round(totalQuality / descriptors.length);
}

// ── GET /api/events (SSE) ─────────────────────────────────────────────────────
app.get('/api/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.flushHeaders();

    // Send a heartbeat every 25 seconds to keep the connection alive
    const heartbeat = setInterval(() => {
        try {
            res.write(': heartbeat\n\n');
        } catch {
            clearInterval(heartbeat);
        }
    }, 25000);

    sseClients.push(res);
    console.log(`📡 SSE client connected. Total: ${sseClients.length}`);

    req.on('close', () => {
        clearInterval(heartbeat);
        sseClients = sseClients.filter(c => c !== res);
        console.log(`📡 SSE client disconnected. Total: ${sseClients.length}`);
    });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
async function startServer() {
    try {
        await initMailer();
        app.listen(PORT, () => {
            console.log('═══════════════════════════════════════════════════');
            console.log('  🚀 BeyondDev Auth API corriendo en:');
            console.log(`     http://localhost:${PORT}`);
            console.log('');
            console.log('  📋 Endpoints disponibles:');
            console.log(`     POST  /api/auth/register`);
            console.log(`     POST  /api/auth/login`);
            console.log(`     GET   /api/auth/verify?email=&token=`);
            console.log(`     POST  /api/auth/forgot-password`);
            console.log(`     POST  /api/auth/reset-password`);
            console.log(`     GET   /api/auth/me`);
            console.log(`     POST  /api/auth/logout`);
            console.log('');
            console.log('  🔐 Face ID Endpoints:');
            console.log(`     POST  /api/auth/check-face-email`);
            console.log(`     POST  /api/auth/register-face`);
            console.log(`     POST  /api/auth/verify-face-login`);
            console.log(`     GET   /api/auth/face-profile`);
            console.log(`     DELETE /api/auth/face-profile`);
            console.log('');
            console.log('  📧 Email & Projects:');
            console.log(`     GET   /api/emails`);
            console.log(`     DELETE /api/emails`);
            console.log(`     GET   /api/projects (auth)`);
            console.log(`     POST  /api/projects (auth)`);
            console.log(`     GET   /api/tasks (auth)`);
            console.log(`     POST  /api/tasks (auth)`);
            console.log('');
            console.log('  🔄 Real-time:');
            console.log(`     GET   /api/events  (SSE)`);
            console.log('');
            console.log('  🌐 Frontend:');
            console.log(`     http://localhost:${PORT}/login.html`);
            console.log(`     http://localhost:${PORT}/backend.html`);
            console.log('═══════════════════════════════════════════════════');
        });
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
        process.exit(1);
    }
}

startServer();
