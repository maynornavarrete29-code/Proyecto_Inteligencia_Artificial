/* ==========================================================================
   BeyondDev API - Nodemailer Configuration with Ethereal Test Account
   ========================================================================== */

const nodemailer = require('nodemailer');

let transporter = null;
let etherealUser = null;
let etherealPass = null;
let etherealPreviewBase = 'https://ethereal.email';

/**
 * Initialize Nodemailer transporter with an Ethereal test account.
 * Ethereal is a fake SMTP service — emails are caught and can be
 * previewed at https://ethereal.email (no real emails sent).
 */
async function initMailer() {
    try {
        // Create a test account on Ethereal
        const testAccount = await nodemailer.createTestAccount();
        etherealUser = testAccount.user;
        etherealPass = testAccount.pass;

        transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass
            }
        });

        console.log('\n📧 Nodemailer iniciado con cuenta Ethereal:');
        console.log(`   Usuario: ${testAccount.user}`);
        console.log(`   Contraseña: ${testAccount.pass}`);
        console.log(`   Ver correos en: https://ethereal.email/messages\n`);

        return transporter;
    } catch (error) {
        console.error('❌ Error al inicializar Nodemailer:', error.message);
        throw error;
    }
}

/**
 * Send a verification email to a newly registered user.
 */
async function sendVerificationEmail({ to, name, token, baseUrl }) {
    const verifyUrl = `${baseUrl}/login.html?action=verify&email=${encodeURIComponent(to)}&token=${token}`;

    const info = await transporter.sendMail({
        from: '"BeyondDev Security" <security@beyonddev.com>',
        to,
        subject: 'Verifica tu cuenta de BeyondDev',
        html: buildEmailTemplate({
            title: 'Verifica tu Cuenta',
            preheader: 'Confirma tu dirección de correo electrónico para acceder a BeyondDev.',
            greeting: `Hola, <strong>${name}</strong>`,
            body: `Gracias por registrarte en <strong>BeyondDev</strong>. Por favor verifica tu cuenta para poder ingresar a la plataforma y gestionar tus proyectos activos.`,
            btnText: 'Verificar Cuenta',
            btnUrl: verifyUrl,
            fallbackUrl: verifyUrl,
            type: 'verify'
        })
    });

    const preview = nodemailer.getTestMessageUrl(info);
    console.log(`📬 Correo de verificación enviado → ${preview}`);
    return { messageId: info.messageId, previewUrl: preview };
}

/**
 * Send a password reset email.
 */
async function sendResetEmail({ to, name, token, baseUrl }) {
    const resetUrl = `${baseUrl}/login.html?action=reset&email=${encodeURIComponent(to)}&token=${token}`;

    const info = await transporter.sendMail({
        from: '"BeyondDev Security" <security@beyonddev.com>',
        to,
        subject: 'Restablecer contraseña de BeyondDev',
        html: buildEmailTemplate({
            title: 'Restablecer Contraseña',
            preheader: 'Recibimos una solicitud para restablecer tu contraseña.',
            greeting: `Hola, <strong>${name}</strong>`,
            body: `Recibimos una solicitud para restablecer la contraseña de tu cuenta de desarrollador en <strong>BeyondDev</strong>. Si no realizaste esta solicitud, puedes ignorar este correo.`,
            btnText: 'Restablecer Contraseña',
            btnUrl: resetUrl,
            fallbackUrl: resetUrl,
            type: 'reset'
        })
    });

    const preview = nodemailer.getTestMessageUrl(info);
    console.log(`🔑 Correo de recuperación enviado → ${preview}`);
    return { messageId: info.messageId, previewUrl: preview };
}

/**
 * HTML email template builder.
 */
function buildEmailTemplate({ title, preheader, greeting, body, btnText, btnUrl, fallbackUrl, type }) {
    const color = type === 'verify' ? '#f0b429' : '#a78bfa';
    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>${title} | BeyondDev</title>
</head>
<body style="margin:0;padding:0;background:#0d0d14;font-family:'Inter',Arial,sans-serif;">
  <div style="max-width:580px;margin:40px auto;background:#13131f;border-radius:16px;border:1px solid rgba(255,255,255,0.08);overflow:hidden;">
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#1a1a2e,#16213e);padding:32px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.06);">
      <h1 style="margin:0;color:${color};font-size:24px;font-weight:700;letter-spacing:2px;">Beyond<span style="color:#fff;">Dev</span></h1>
      <p style="margin:8px 0 0;color:#a0aec0;font-size:13px;">${preheader}</p>
    </div>
    <!-- Body -->
    <div style="padding:40px 32px;">
      <p style="color:#e2e8f0;font-size:16px;margin:0 0 16px;">${greeting}.</p>
      <p style="color:#a0aec0;font-size:15px;line-height:1.7;margin:0 0 32px;">${body}</p>
      <div style="text-align:center;margin-bottom:32px;">
        <a href="${btnUrl}" style="display:inline-block;background:${color};color:#0d0d14;font-weight:700;font-size:15px;padding:14px 36px;border-radius:8px;text-decoration:none;letter-spacing:0.5px;">${btnText}</a>
      </div>
      <hr style="border:none;border-top:1px solid rgba(255,255,255,0.06);margin:0 0 24px;">
      <p style="color:#718096;font-size:12px;line-height:1.6;word-break:break-all;">
        Si el botón no funciona, copia y pega este enlace en tu navegador:<br>
        <a href="${fallbackUrl}" style="color:${color};">${fallbackUrl}</a>
      </p>
    </div>
    <!-- Footer -->
    <div style="background:#0d0d14;padding:20px 32px;text-align:center;border-top:1px solid rgba(255,255,255,0.06);">
      <p style="margin:0;color:#4a5568;font-size:12px;">© 2026 BeyondDev · Todos los derechos reservados</p>
    </div>
  </div>
</body>
</html>`;
}

module.exports = { initMailer, sendVerificationEmail, sendResetEmail };
