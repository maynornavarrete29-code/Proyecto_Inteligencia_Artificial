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
const { spawn } = require('child_process');
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
const PYTHON_EXEC = process.env.PYTHON || 'python';

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

function runFaceScript(args) {
    return new Promise((resolve, reject) => {
        const faceDir = path.join(__dirname, '..', 'face_id');
        const scriptPath = path.join(faceDir, 'face_biometric.py');
        const child = spawn(PYTHON_EXEC, [scriptPath, '--db', path.join(faceDir, 'base_datos.json'), ...args], { cwd: faceDir });

        let stdout = '';
        let stderr = '';

        child.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        child.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        child.on('error', (err) => reject(err));

        child.on('close', (code) => {
            const resultLine = stdout.trim().split('\n').filter(Boolean).pop();
            if (resultLine) {
                try {
                    return resolve(JSON.parse(resultLine));
                } catch (err) {
                    return reject(new Error(`No se pudo parsear la salida de FaceID. stdout=${stdout} stderr=${stderr}`));
                }
            }
            reject(new Error(`FaceID falló. Código: ${code}. stderr=${stderr}`));
        });
    });
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

// ── POST /api/face/register ─────────────────────────────────────────────────
app.post('/api/face/register', async (req, res) => {
    try {
        const { identifier, name } = req.body;

        if (!identifier || !name) {
            return res.status(400).json({ success: false, message: 'El correo y el nombre son requeridos para registrar FaceID.' });
        }

        const result = await runFaceScript(['register', '--id', identifier, '--name', name]);
        if (result.success) {
            return res.json({ success: true, message: `FaceID registrado para ${result.name}.`, data: result });
        }

        return res.status(400).json({ success: false, message: result.message || 'No se pudo registrar el FaceID.' });
    } catch (error) {
        console.error('Face register error:', error);
        res.status(500).json({ success: false, message: 'Error al ejecutar el registro de FaceID.' });
    }
});

// ── POST /api/face/verify ───────────────────────────────────────────────────
app.post('/api/face/verify', async (req, res) => {
    try {
        const result = await runFaceScript(['verify']);
        if (!result.success) {
            return res.status(401).json({ success: false, message: result.message || 'No se reconoció el rostro.' });
        }

        const db = readDB();
        const user = db.users.find(u => u.email.toLowerCase() === result.id.toLowerCase());
        if (!user) {
            return res.status(404).json({ success: false, message: 'Rostro reconocido, pero no existe una cuenta vinculada a ese correo.' });
        }

        if (!user.verified) {
            return res.status(403).json({ success: false, unverified: true, message: 'Tu cuenta está registrada pero aún no ha sido verificada.' });
        }

        const token = jwt.sign(
            { id: user.id, name: user.name, email: user.email },
            JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({
            success: true,
            message: `Inicio de sesión FaceID exitoso. Bienvenido, ${user.name}.`,
            token,
            user: { id: user.id, name: user.name, email: user.email }
        });
    } catch (error) {
        console.error('Face verify error:', error);
        res.status(500).json({ success: false, message: 'Error al ejecutar la verificación de FaceID.' });
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
            console.log(`     GET   /api/emails`);
            console.log(`     DELETE /api/emails`);
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
