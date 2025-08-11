import nodemailer from 'nodemailer';

type Quote = { name: string; email: string; message: string };

function getSmtpConfig() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = process.env.SMTP_SECURE === 'true' || (port === 465);
  const url = process.env.SMTP_URL;
  const to = process.env.QUOTE_TO_EMAIL || process.env.ADMIN_EMAIL;
  return { host, port, user, pass, secure, url, to };
}

let _transporter: nodemailer.Transporter | null = null;
function getTransporter(): nodemailer.Transporter | null {
  if (_transporter) return _transporter;
  const cfg = getSmtpConfig();
  try {
    if (cfg.url) {
      _transporter = nodemailer.createTransport(cfg.url);
      return _transporter;
    }
    if (cfg.host && cfg.port && cfg.user && cfg.pass) {
      _transporter = nodemailer.createTransport({
        host: cfg.host,
        port: cfg.port,
        secure: cfg.secure,
        auth: { user: cfg.user, pass: cfg.pass }
      });
      return _transporter;
    }
  } catch (e) {
    console.error('Failed to init mail transporter:', e);
  }
  return null;
}

export async function sendQuoteEmail(data: Quote): Promise<boolean> {
  const cfg = getSmtpConfig();
  const transporter = getTransporter();
  const to = cfg.to;
  if (!transporter || !to) {
    console.warn('Email not sent: SMTP or recipient not configured.');
    return false;
  }
  const subject = `New Quote Request — ${data.name}`;
  const text = `New quote received\n\nName: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}\n`;
  const html = `
    <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; line-height:1.5;">
      <h2>New Quote Request</h2>
      <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
      <p><strong>Message:</strong></p>
      <pre style="white-space:pre-wrap;background:#f6f8fa;padding:12px;border-radius:6px;">${escapeHtml(data.message)}</pre>
    </div>
  `;
  try {
    await transporter.sendMail({
      from: cfg.user || 'no-reply@sight-tech.local',
      to,
      subject,
      text,
      html
    });
    return true;
  } catch (e) {
    console.error('Failed to send quote email:', e);
    return false;
  }
}

export async function sendQuoteAutoReply(data: Quote): Promise<boolean> {
  const cfg = getSmtpConfig();
  const transporter = getTransporter();
  if (!transporter) {
    console.warn('Auto-reply not sent: SMTP not configured.');
    return false;
  }
  const to = data.email;
  const brand = process.env.BUSINESS_NAME || 'Sight Tech';
  const subject = `We received your request — ${brand}`;
  const text = `Hi ${data.name},\n\nThanks for contacting ${brand}!\n\nWe received your message and will get back to you shortly.\n\nYour message:\n${data.message}\n\n— ${brand}`;
  const html = `
    <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; line-height:1.6;">
      <p>Hi ${escapeHtml(data.name)},</p>
      <p>Thanks for contacting <strong>${escapeHtml(brand)}</strong>! We received your message and will get back to you shortly.</p>
      <p><strong>Your message:</strong></p>
      <pre style="white-space:pre-wrap;background:#f6f8fa;padding:12px;border-radius:6px;">${escapeHtml(data.message)}</pre>
      <p style="margin-top:12px;">— ${escapeHtml(brand)}</p>
    </div>
  `;
  try {
    await transporter.sendMail({
      from: cfg.user || 'no-reply@sight-tech.local',
      to,
      subject,
      text,
      html
    });
    return true;
  } catch (e) {
    console.error('Failed to send auto-reply:', e);
    return false;
  }
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// --- Auth Emails ---
export async function sendWelcomeEmail(opts: { name: string; email: string }): Promise<boolean> {
  const cfg = getSmtpConfig();
  const transporter = getTransporter();
  if (!transporter) {
    console.warn('Welcome email not sent: SMTP not configured.');
    return false;
  }
  const brand = process.env.BUSINESS_NAME || 'Sight Tech';
  const subject = `Welcome to ${brand}`;
  const text = `Hi ${opts.name},\n\nWelcome to ${brand}! Your account has been created successfully.\n\n— ${brand}`;
  const html = `
    <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; line-height:1.6;">
      <p>Hi ${escapeHtml(opts.name)},</p>
      <p>Welcome to <strong>${escapeHtml(brand)}</strong>! Your account has been created successfully.</p>
      <p style="margin-top:12px;">— ${escapeHtml(brand)}</p>
    </div>
  `;
  try {
    await transporter.sendMail({
      from: cfg.user || 'no-reply@sight-tech.local',
      to: opts.email,
      subject,
      text,
      html
    });
    return true;
  } catch (e) {
    console.error('Failed to send welcome email:', e);
    return false;
  }
}

export async function sendPasswordResetOtp(opts: { name?: string; email: string; otp: string }): Promise<boolean> {
  const cfg = getSmtpConfig();
  const transporter = getTransporter();
  if (!transporter) {
    console.warn('Password reset OTP not sent: SMTP not configured.');
    return false;
  }
  const brand = process.env.BUSINESS_NAME || 'Sight Tech';
  const subject = `${brand} password reset code`;
  const greeting = opts.name ? `Hi ${opts.name},` : 'Hi,';
  const text = `${greeting}\n\nYour ${brand} password reset code is: ${opts.otp}\nThis code expires in 15 minutes. If you did not request this, you can ignore this email.\n\n— ${brand}`;
  const html = `
    <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; line-height:1.6;">
      <p>${escapeHtml(greeting)}</p>
      <p>Your <strong>${escapeHtml(brand)}</strong> password reset code is:</p>
      <p style="font-size:22px; font-weight:600; letter-spacing:3px;">${escapeHtml(opts.otp)}</p>
      <p>This code expires in 15 minutes. If you did not request this, you can ignore this email.</p>
      <p style="margin-top:12px;">— ${escapeHtml(brand)}</p>
    </div>
  `;
  try {
    await transporter.sendMail({
      from: cfg.user || 'no-reply@sight-tech.local',
      to: opts.email,
      subject,
      text,
      html
    });
    return true;
  } catch (e) {
    console.error('Failed to send password reset OTP:', e);
    return false;
  }
}
