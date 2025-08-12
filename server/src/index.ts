import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { z } from 'zod';
import { initDb, getPool } from './db.js';
import { sendQuoteEmail, sendQuoteAutoReply, sendWelcomeEmail, sendPasswordResetOtp } from './mailer.js';
import { adminOnly, authMiddleware, signToken } from './auth.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
console.log('DB configured:', Boolean(process.env.DATABASE_URL));

// Initialize database (if configured)
initDb().catch(err => {
  console.error('DB init failed:', err);
});

// Basic dynamic content to power the frontend (used as seed/fallback if DB not configured)
const seedServices = [
  { id: 'phone-repair', title: 'Phone Repairs', description: 'Screen, battery, water damage, diagnostics', category: 'repairs' as const },
  { id: 'laptop-repair', title: 'Laptop Repairs', description: 'Hardware fixes, upgrades, cleaning, OS reinstall', category: 'repairs' as const },
  { id: 'sales-new', title: 'Laptops - Brand New', description: 'Curated selection of the latest laptops', category: 'sales' as const },
  { id: 'sales-refurb', title: 'Laptops - Refurbished', description: 'Tested, warrantied refurbished models', category: 'sales' as const },
  { id: 'dev-mobile', title: 'Mobile App Development', description: 'iOS/Android apps tailored to your business', category: 'software' as const },
  { id: 'dev-web', title: 'Website Development', description: 'Modern, fast, SEO-friendly websites', category: 'software' as const }
];

const products = [
  { id: 'nb-001', name: 'Ultrabook X1', price: 1299, condition: 'new', specs: ['13.3\" OLED', '16GB RAM', '512GB SSD'] },
  { id: 'nb-101', name: 'ProBook R5 (Refurb)', price: 699, condition: 'refurbished', specs: ['15.6\" IPS', '16GB RAM', '256GB SSD'] }
];

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'Sight Tech API' });
});

app.get('/api/services', async (_req, res) => {
  try {
    const pool = getPool();
    if (!pool) return res.json(seedServices);
    const { rows } = await pool.query(
      'SELECT id, title, description, category FROM services ORDER BY created_at DESC'
    );
    if (!rows.length) return res.json(seedServices);
    res.json(rows);
  } catch (err) {
    console.error('Failed to fetch services:', err);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

app.get('/api/products', (_req, res) => {
  res.json(products);
});

// Recent quotes for quick verification (no auth; limit 10)
app.get('/api/quotes/recent', async (_req, res) => {
  try {
    const pool = getPool();
    if (!pool) return res.status(503).json({ error: 'Database not configured' });
    const { rows } = await pool.query(
      'SELECT id, name, email, message, created_at FROM quotes ORDER BY created_at DESC LIMIT 10'
    );
    res.json(rows);
  } catch (err) {
    console.error('Failed to fetch recent quotes:', err);
    res.status(500).json({ error: 'Failed to fetch quotes' });
  }
});

// Simple quote/contact endpoint
const quoteSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(5)
});

app.post('/api/quote', async (req, res) => {
  const parse = quoteSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: 'Invalid payload', details: parse.error.flatten() });
  }
  const data = parse.data;
  try {
    const pool = getPool();
    if (pool) {
      await pool.query(
        'INSERT INTO quotes(name, email, message) VALUES($1, $2, $3)',
        [data.name, data.email, data.message]
      );
    } else {
      console.log('New quote request (no DB):', data);
    }
    // Attempt to send email notification
  const mailed = await sendQuoteEmail(data).catch((e)=>{ console.error('Email send error:', e); return false; });
  const auto = await sendQuoteAutoReply(data).catch((e)=>{ console.error('Auto-reply error:', e); return false; });
  res.json({ ok: true, emailed: mailed, autoReply: auto });
  } catch (err) {
    console.error('Failed to save quote:', err);
    res.status(500).json({ error: 'Failed to save quote' });
  }
});

// --- Auth ---
const emailSchema = z.string().email();
const passwordSchema = z.string().min(6);
// Accept legacy {name} or new {firstName,lastName}
const registerSchemaV1 = z.object({ name: z.string().min(1), email: emailSchema, password: passwordSchema });
const registerSchemaV2 = z.object({ firstName: z.string().min(1), lastName: z.string().min(1), email: emailSchema, password: passwordSchema });
const loginSchema = z.object({ email: emailSchema, password: z.string().min(1) });

async function ensureCoreTables() {
  const pool = getPool();
  if (!pool) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS services (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL CHECK (category IN ('repairs','sales','software')),
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      first_name TEXT NOT NULL DEFAULT '',
      last_name TEXT NOT NULL DEFAULT '',
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      price NUMERIC NOT NULL,
      condition TEXT NOT NULL,
      specs TEXT[] NOT NULL DEFAULT '{}',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    -- Add category column if it doesn't exist (defaults to 'laptop')
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name='products' AND column_name='category'
      ) THEN
        ALTER TABLE products ADD COLUMN category TEXT NOT NULL DEFAULT 'laptop';
        UPDATE products SET category = 'laptop' WHERE category IS NULL;
      END IF;
    END $$;
    -- Add image_url column if it doesn't exist
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name='products' AND column_name='image_url'
      ) THEN
        ALTER TABLE products ADD COLUMN image_url TEXT;
      END IF;
    END $$;
    CREATE TABLE IF NOT EXISTS appointments (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      service_id TEXT,
      notes TEXT,
      date DATE,
      time TIME,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS password_resets (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      otp TEXT NOT NULL,
      expires_at TIMESTAMPTZ NOT NULL,
      used_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    -- Migrate from old users.name to users.first_name/last_name if needed
    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='name'
      ) THEN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='first_name'
        ) THEN
          ALTER TABLE users ADD COLUMN first_name TEXT;
        END IF;
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='last_name'
        ) THEN
          ALTER TABLE users ADD COLUMN last_name TEXT;
        END IF;
        UPDATE users SET first_name = COALESCE(name, ''), last_name = COALESCE(last_name, '') WHERE first_name IS NULL;
        ALTER TABLE users DROP COLUMN name;
        ALTER TABLE users ALTER COLUMN first_name SET DEFAULT '';
        ALTER TABLE users ALTER COLUMN last_name SET DEFAULT '';
        UPDATE users SET first_name = COALESCE(first_name, ''), last_name = COALESCE(last_name, '');
        ALTER TABLE users ALTER COLUMN first_name SET NOT NULL;
        ALTER TABLE users ALTER COLUMN last_name SET NOT NULL;
      END IF;
    END $$;
    -- Conditionally add FK for service_id -> services(id)
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'appointments_service_id_fkey'
          AND table_name = 'appointments'
      ) THEN
        ALTER TABLE appointments
          ADD CONSTRAINT appointments_service_id_fkey
          FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL;
      END IF;
    END $$;
  -- Helpful indexes
  CREATE INDEX IF NOT EXISTS idx_products_condition ON products(condition);
  CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);
  CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
  CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
  CREATE INDEX IF NOT EXISTS idx_services_created_at ON services(created_at);
  CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON appointments(user_id);
  CREATE INDEX IF NOT EXISTS idx_appointments_created_at ON appointments(created_at);
  CREATE INDEX IF NOT EXISTS idx_password_resets_user_id ON password_resets(user_id);
  CREATE INDEX IF NOT EXISTS idx_password_resets_expires_at ON password_resets(expires_at);
  `);
}

ensureCoreTables().catch(console.error);

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .replace(/-{2,}/g, '-');
}

async function seedDefaults() {
  const pool = getPool();
  if (!pool) return;
  try {
    const svcCount = await pool.query('SELECT COUNT(*)::int AS count FROM services');
    if ((svcCount.rows[0]?.count ?? 0) === 0) {
      for (const s of seedServices) {
        await pool.query(
          'INSERT INTO services(id, title, description, category) VALUES($1,$2,$3,$4) ON CONFLICT (id) DO NOTHING',
          [s.id, s.title, s.description, s.category]
        );
      }
      console.log('Seeded default services');
    }
    const prodCount = await pool.query('SELECT COUNT(*)::int AS count FROM products');
    if ((prodCount.rows[0]?.count ?? 0) === 0) {
      const defaults = [
        { name: 'Ultrabook X1', price: 1299, condition: 'new', specs: ['13.3" OLED', '16GB RAM', '512GB SSD'] },
        { name: 'ProBook R5 (Refurb)', price: 699, condition: 'refurbished', specs: ['15.6" IPS', '16GB RAM', '256GB SSD'] }
      ] as const;
      for (const p of defaults) {
        await pool.query(
          'INSERT INTO products(name, price, condition, specs) VALUES($1,$2,$3,$4)',
          [p.name, p.price, p.condition, p.specs]
        );
      }
      console.log('Seeded default products');
    }
  } catch (e) {
    console.error('Seeding failed:', e);
  }
}

seedDefaults().catch(console.error);

// Ensure an admin user exists based on environment variables
async function seedAdmin() {
  const pool = getPool();
  if (!pool) return;
  const email = process.env.ADMIN_EMAIL;
  if (!email) return; // nothing to do
  const first = process.env.ADMIN_FIRST_NAME || 'Admin';
  const last = process.env.ADMIN_LAST_NAME || '';
  let password = process.env.ADMIN_PASSWORD || '';
  let generated = false;
  if (!password) {
    generated = true;
    password = crypto.randomBytes(9).toString('base64url');
  }
  const hash = hashPassword(password);
  try {
    const existing = await pool.query('SELECT id, role FROM users WHERE email=$1', [email]);
    if (existing.rows.length) {
      const id = existing.rows[0].id as number;
      // Promote to admin and set name if needed
      if (existing.rows[0].role !== 'admin') {
        await pool.query('UPDATE users SET role=$1 WHERE id=$2', ['admin', id]);
      }
      await pool.query('UPDATE users SET first_name=$1, last_name=$2 WHERE id=$3', [first, last, id]);
      console.log(`Admin user ensured (existing): ${email}`);
      if (process.env.ADMIN_PASSWORD) {
        await pool.query('UPDATE users SET password_hash=$1 WHERE id=$2', [hash, id]);
      }
    } else {
      await pool.query(
        'INSERT INTO users(first_name, last_name, email, password_hash, role) VALUES($1,$2,$3,$4,$5)',
        [first, last, email, hash, 'admin']
      );
      console.log(`Admin user created: ${email}`);
      if (generated) console.log(`Temporary password: ${password}`);
    }
  } catch (e) {
    console.error('Failed to ensure admin user:', e);
  }
}

seedAdmin().catch(console.error);

function hashPassword(pw: string) {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(pw, salt);
}

function verifyPassword(pw: string, hash: string) {
  return bcrypt.compareSync(pw, hash);
}

app.post('/api/auth/register', async (req, res) => {
  const pool = getPool();
  if (!pool) return res.status(503).json({ error: 'Database not configured' });
  const body = req.body;
  let firstName: string;
  let lastName: string;
  let email: string;
  let password: string;
  const v2 = registerSchemaV2.safeParse(body);
  if (v2.success) {
    ({ firstName, lastName, email, password } = v2.data);
  } else {
    const v1 = registerSchemaV1.safeParse(body);
    if (!v1.success) return res.status(400).json({ error: 'Invalid payload', details: v1.error.flatten() });
    const name = v1.data.name.trim();
    const space = name.indexOf(' ');
    firstName = space === -1 ? name : name.slice(0, space);
    lastName = space === -1 ? '' : name.slice(space + 1);
    email = v1.data.email;
    password = v1.data.password;
  }
  email = email.toLowerCase();
  try {
    const hash = hashPassword(password);
    const countRes = await pool.query('SELECT COUNT(*)::int AS count FROM users');
    const makeAdmin = (countRes.rows[0]?.count ?? 0) === 0;
    const { rows } = await pool.query(
      'INSERT INTO users(first_name, last_name, email, password_hash, role) VALUES($1,$2,$3,$4,$5) RETURNING id, first_name, last_name, email, role',
      [firstName, lastName, email, hash, makeAdmin ? 'admin' : 'user']
    );
  const user = rows[0];
    const token = signToken({ id: user.id, role: user.role, email: user.email });
    const apiUser = { id: user.id, name: `${user.first_name} ${user.last_name}`.trim(), email: user.email, role: user.role };
  // Fire-and-forget welcome email
  sendWelcomeEmail({ name: apiUser.name || 'there', email: apiUser.email }).catch(err => console.error('Welcome email error:', err));
    res.json({ user: apiUser, token });
  } catch (err: any) {
    if (err?.code === '23505') return res.status(409).json({ error: 'Email already registered' });
    console.error('Register failed', err);
    res.status(500).json({ error: 'Register failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const pool = getPool();
  if (!pool) return res.status(503).json({ error: 'Database not configured' });
  const parse = loginSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: 'Invalid payload', details: parse.error.flatten() });
  const { email, password } = parse.data;
  const { rows } = await pool.query('SELECT id, first_name, last_name, email, role, password_hash FROM users WHERE email=$1', [email.toLowerCase()]);
  if (!rows.length) return res.status(404).json({ error: 'Email not found' });
  if (!verifyPassword(password, rows[0].password_hash)) return res.status(401).json({ error: 'Incorrect password' });
  const user = rows[0];
  const token = signToken({ id: user.id, role: user.role, email: user.email });
  const apiUser = { id: user.id, name: `${user.first_name} ${user.last_name}`.trim(), email: user.email, role: user.role };
  res.json({ user: apiUser, token });
});

// --- Profile (me) ---
const updateMeSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  email: z.string().email().optional()
});

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  const pool = getPool();
  if (!pool) return res.status(503).json({ error: 'Database not configured' });
  const userId = (req as any).user?.id as number;
  const { rows } = await pool.query('SELECT id, first_name, last_name, email, role FROM users WHERE id=$1', [userId]);
  if (!rows.length) return res.status(404).json({ error: 'Not found' });
  const u = rows[0];
  res.json({ id: u.id, firstName: u.first_name, lastName: u.last_name, email: u.email, role: u.role });
});

app.put('/api/auth/me', authMiddleware, async (req, res) => {
  const pool = getPool();
  if (!pool) return res.status(503).json({ error: 'Database not configured' });
  const parse = updateMeSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: 'Invalid payload', details: parse.error.flatten() });
  const userId = (req as any).user?.id as number;
  const fields = parse.data;
  const setters: string[] = [];
  const values: unknown[] = [];
  let i = 1;
  if (fields.firstName !== undefined) { setters.push(`first_name=$${i++}`); values.push(fields.firstName); }
  if (fields.lastName !== undefined) { setters.push(`last_name=$${i++}`); values.push(fields.lastName); }
  if (fields.email !== undefined) { setters.push(`email=$${i++}`); values.push(fields.email.toLowerCase()); }
  if (!setters.length) return res.status(400).json({ error: 'Nothing to update' });
  values.push(userId);
  try {
    const { rows } = await pool.query(
      `UPDATE users SET ${setters.join(', ')} WHERE id=$${i} RETURNING id, first_name, last_name, email, role`,
      values
    );
    const u = rows[0];
    // Issue a new token in case email changed
    const token = signToken({ id: u.id, role: u.role, email: u.email });
    res.json({ user: { id: u.id, name: `${u.first_name} ${u.last_name}`.trim(), email: u.email, role: u.role }, token });
  } catch (err: any) {
    if (err?.code === '23505') return res.status(409).json({ error: 'Email already in use' });
    console.error('Update profile failed:', err);
    res.status(500).json({ error: 'Update failed' });
  }
});

// --- Forgot Password + Reset with OTP ---
const forgotSchema = z.object({ email: z.string().email() });
// Basic in-memory rate limit: 5 requests per 15 minutes per IP and per email
type RateEntry = { count: number; resetAt: number };
const rlIp = new Map<string, RateEntry>();
const rlEmail = new Map<string, RateEntry>();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 15 * 60 * 1000;

function checkLimit(map: Map<string, RateEntry>, key: string): { ok: boolean; retryAfter?: number } {
  const now = Date.now();
  const entry = map.get(key);
  if (!entry || now > entry.resetAt) {
    map.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return { ok: true };
  }
  if (entry.count >= RATE_LIMIT) {
    return { ok: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }
  entry.count += 1;
  return { ok: true };
}

function rateLimitForgot(req: any, res: any, next: any) {
  const ip = (req.headers['x-forwarded-for']?.toString().split(',')[0] || req.socket.remoteAddress || 'unknown').trim();
  const emailKey = (req.body?.email || '').toLowerCase();
  const r1 = checkLimit(rlIp, ip);
  const r2 = emailKey ? checkLimit(rlEmail, emailKey) : { ok: true };
  if (!r1.ok || !r2.ok) {
    const retrySec = Math.max(r1.retryAfter || 0, r2.retryAfter || 0) || 60;
    res.setHeader('Retry-After', String(retrySec));
    return res.status(429).json({ error: 'Too many requests. Try again later.' });
  }
  next();
}

app.post('/api/auth/forgot', rateLimitForgot, async (req, res) => {
  const pool = getPool();
  if (!pool) return res.status(503).json({ error: 'Database not configured' });
  const parse = forgotSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: 'Invalid payload', details: parse.error.flatten() });
  const email = parse.data.email.toLowerCase();
  const { rows } = await pool.query('SELECT id, first_name, last_name, email FROM users WHERE email=$1', [email]);
  // Respond 200 regardless to avoid user enumeration
  if (!rows.length) return res.json({ ok: true });
  const user = rows[0] as { id: number; first_name: string; last_name: string; email: string };
  // Generate cryptographically-strong 6-digit OTP
  const otp = crypto.randomInt(0, 1000000).toString().padStart(6, '0');
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
  await pool.query('INSERT INTO password_resets(user_id, otp, expires_at) VALUES($1,$2,$3)', [user.id, otp, expiresAt]);
  // Send OTP email (best-effort)
  await sendPasswordResetOtp({ name: `${user.first_name} ${user.last_name}`.trim(), email: user.email, otp }).catch(e => console.error('OTP send error:', e));
  res.json({ ok: true });
});

const resetSchema = z.object({ email: z.string().email(), otp: z.string().min(4), newPassword: z.string().min(6) });
app.post('/api/auth/reset', async (req, res) => {
  const pool = getPool();
  if (!pool) return res.status(503).json({ error: 'Database not configured' });
  const parse = resetSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: 'Invalid payload', details: parse.error.flatten() });
  const { email, otp, newPassword } = parse.data;
  const { rows } = await pool.query('SELECT id FROM users WHERE email=$1', [email.toLowerCase()]);
  if (!rows.length) return res.status(400).json({ error: 'Invalid reset code' });
  const userId = rows[0].id as number;
  // Find latest unused, unexpired OTP for this user
  const pr = await pool.query(
    `SELECT id, otp, expires_at, used_at
     FROM password_resets
     WHERE user_id=$1 AND used_at IS NULL AND expires_at > NOW()
     ORDER BY created_at DESC
     LIMIT 1`,
    [userId]
  );
  if (!pr.rows.length || pr.rows[0].otp !== otp) return res.status(400).json({ error: 'Invalid or expired code' });
  const resetId = pr.rows[0].id as number;
  // Update password and mark OTP used
  const hash = hashPassword(newPassword);
  await pool.query('UPDATE users SET password_hash=$1 WHERE id=$2', [hash, userId]);
  await pool.query('UPDATE password_resets SET used_at=NOW() WHERE id=$1', [resetId]);
  res.json({ ok: true });
});

// --- Admin Products CRUD ---
const productSchema = z.object({
  name: z.string().min(1),
  price: z.number().positive(),
  condition: z.enum(['new', 'refurbished']),
  specs: z.array(z.string()).default([]),
  imageUrl: z.string().url().optional(),
  category: z.enum(['laptop','accessory']).default('laptop')
});

app.get('/api/admin/products', authMiddleware, adminOnly, async (_req, res) => {
  const pool = getPool();
  if (!pool) return res.status(503).json({ error: 'Database not configured' });
  const { rows } = await pool.query('SELECT id, name, price, condition, specs, image_url, created_at, category FROM products ORDER BY id DESC');
  res.json(rows);
});

app.post('/api/admin/products', authMiddleware, adminOnly, async (req, res) => {
  const pool = getPool();
  if (!pool) return res.status(503).json({ error: 'Database not configured' });
  const parse = productSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: 'Invalid payload', details: parse.error.flatten() });
  const { name, price, condition, specs, imageUrl, category } = parse.data;
  const { rows } = await pool.query(
    'INSERT INTO products(name, price, condition, specs, image_url, category) VALUES($1,$2,$3,$4,$5,$6) RETURNING id, name, price, condition, specs, image_url, category',
    [name, price, condition, specs, imageUrl ?? null, category]
  );
  res.json(rows[0]);
});

app.put('/api/admin/products/:id', authMiddleware, adminOnly, async (req, res) => {
  const pool = getPool();
  if (!pool) return res.status(503).json({ error: 'Database not configured' });
  const id = Number(req.params.id);
  const parse = productSchema.partial().safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: 'Invalid payload', details: parse.error.flatten() });
  const raw = parse.data as any;
  // Map camelCase to snake_case for DB columns
  const fields: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(raw)) {
    if (k === 'imageUrl') fields['image_url'] = v;
    else fields[k] = v as unknown;
  }
  const setters: string[] = [];
  const values: any[] = [];
  let idx = 1;
  for (const [k, v] of Object.entries(fields)) {
    setters.push(`${k}=$${idx++}`);
    values.push(v);
  }
  values.push(id);
  const { rows } = await pool.query(
  `UPDATE products SET ${setters.join(', ')} WHERE id=$${idx} RETURNING id, name, price, condition, specs, image_url, category`,
    values
  );
  if (!rows.length) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
});

app.delete('/api/admin/products/:id', authMiddleware, adminOnly, async (req, res) => {
  const pool = getPool();
  if (!pool) return res.status(503).json({ error: 'Database not configured' });
  const id = Number(req.params.id);
  const result = await pool.query('DELETE FROM products WHERE id=$1', [id]);
  res.json({ deleted: result.rowCount });
});

// --- Public products (from DB) ---
app.get('/api/products/db', async (_req, res) => {
  const pool = getPool();
  if (!pool) return res.json([]);
  const { rows } = await pool.query('SELECT id, name, price, condition, specs, image_url, category FROM products ORDER BY id DESC');
  res.json(rows);
});

// Public search with optional category, sorting, and pagination
app.get('/api/products/search', async (req, res) => {
  const pool = getPool();
  if (!pool) return res.json({ items: [], total: 0, page: 1, pageSize: 0 });
  const category = typeof req.query.category === 'string' ? req.query.category : undefined;
  const sort = typeof req.query.sort === 'string' ? req.query.sort : 'newest';
  let page = Number(req.query.page ?? 1);
  let pageSize = Number(req.query.pageSize ?? 12);
  if (!Number.isFinite(page) || page < 1) page = 1;
  if (!Number.isFinite(pageSize) || pageSize < 1 || pageSize > 100) pageSize = 12;

  const where: string[] = [];
  const values: any[] = [];
  let i = 1;
  if (category) { where.push(`category = $${i++}`); values.push(category); }
  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

  let orderBy = 'created_at DESC';
  if (sort === 'price_asc') orderBy = 'price ASC, created_at DESC';
  else if (sort === 'price_desc') orderBy = 'price DESC, created_at DESC';

  const totalRes = await pool.query(`SELECT COUNT(*)::int AS count FROM products ${whereSql}`, values);
  const total = totalRes.rows[0]?.count ?? 0;
  const offset = (page - 1) * pageSize;
  const rows = await pool.query(
    `SELECT id, name, price, condition, specs, image_url, created_at, category
     FROM products
     ${whereSql}
     ORDER BY ${orderBy}
     LIMIT $${i} OFFSET $${i + 1}`,
    [...values, pageSize, offset]
  );
  res.json({ items: rows.rows, total, page, pageSize });
});

// --- Admin Services CRUD ---
const serviceSchema = z.object({
  id: z.string().min(1).regex(/^[a-z0-9-]+$/).optional(),
  title: z.string().min(1),
  description: z.string().min(1),
  category: z.enum(['repairs', 'sales', 'software'])
});

app.get('/api/admin/services', authMiddleware, adminOnly, async (_req, res) => {
  const pool = getPool();
  if (!pool) return res.status(503).json({ error: 'Database not configured' });
  const { rows } = await pool.query('SELECT id, title, description, category, created_at FROM services ORDER BY created_at DESC');
  res.json(rows);
});

app.post('/api/admin/services', authMiddleware, adminOnly, async (req, res) => {
  const pool = getPool();
  if (!pool) return res.status(503).json({ error: 'Database not configured' });
  const parse = serviceSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: 'Invalid payload', details: parse.error.flatten() });
  const { id, title, description, category } = parse.data;
  const slug = id && id.length ? id : slugify(title);
  const { rows } = await pool.query(
    'INSERT INTO services(id, title, description, category) VALUES($1,$2,$3,$4) RETURNING id, title, description, category',
    [slug, title, description, category]
  );
  res.json(rows[0]);
});

app.put('/api/admin/services/:id', authMiddleware, adminOnly, async (req, res) => {
  const pool = getPool();
  if (!pool) return res.status(503).json({ error: 'Database not configured' });
  const id = String(req.params.id);
  const parse = serviceSchema.partial().safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: 'Invalid payload', details: parse.error.flatten() });
  const fields = parse.data;
  const setters: string[] = [];
  const values: any[] = [];
  let idx = 1;
  for (const [k, v] of Object.entries(fields)) {
    if (k === 'id') continue; // do not allow changing primary key via update
    setters.push(`${k}=$${idx++}`);
    values.push(v);
  }
  values.push(id);
  const { rows } = await pool.query(
    `UPDATE services SET ${setters.join(', ')} WHERE id=$${idx} RETURNING id, title, description, category`,
    values
  );
  if (!rows.length) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
});

app.delete('/api/admin/services/:id', authMiddleware, adminOnly, async (req, res) => {
  const pool = getPool();
  if (!pool) return res.status(503).json({ error: 'Database not configured' });
  const id = String(req.params.id);
  const result = await pool.query('DELETE FROM services WHERE id=$1', [id]);
  res.json({ deleted: result.rowCount });
});

// --- Appointments ---
const appointmentSchema = z.object({
  serviceId: z.string().min(1),
  notes: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/)
});

app.post('/api/appointments', authMiddleware, async (req, res) => {
  const pool = getPool();
  if (!pool) return res.status(503).json({ error: 'Database not configured' });
  const parse = appointmentSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: 'Invalid payload', details: parse.error.flatten() });
  const { serviceId, notes, date, time } = parse.data;
  const userId = (req as any).user?.id as number;
  const { rows } = await pool.query(
    'INSERT INTO appointments(user_id, service_id, notes, date, time) VALUES($1,$2,$3,$4,$5) RETURNING id, user_id, service_id, notes, date, time, status',
    [userId, serviceId, notes ?? null, date, time]
  );
  res.json(rows[0]);
});

app.get('/api/appointments/my', authMiddleware, async (req, res) => {
  const pool = getPool();
  if (!pool) return res.status(503).json({ error: 'Database not configured' });
  const userId = (req as any).user?.id as number;
  const { rows } = await pool.query(
    'SELECT id, service_id, notes, date, time, status, created_at FROM appointments WHERE user_id=$1 ORDER BY created_at DESC',
    [userId]
  );
  res.json(rows);
});

// Cancel appointment (soft cancel by setting status)
app.delete('/api/appointments/:id', authMiddleware, async (req, res) => {
  const pool = getPool();
  if (!pool) return res.status(503).json({ error: 'Database not configured' });
  const userId = (req as any).user?.id as number;
  const id = Number(req.params.id);
  const { rowCount } = await pool.query('UPDATE appointments SET status=$1 WHERE id=$2 AND user_id=$3', ['canceled', id, userId]);
  if (!rowCount) return res.status(404).json({ error: 'Not found' });
  res.json({ ok: true });
});

// My quotes (by email)
app.get('/api/quotes/my', authMiddleware, async (req, res) => {
  const pool = getPool();
  if (!pool) return res.status(503).json({ error: 'Database not configured' });
  const email = (req as any).user?.email as string;
  const { rows } = await pool.query(
    'SELECT id, name, email, message, created_at FROM quotes WHERE email=$1 ORDER BY created_at DESC',
    [email]
  );
  res.json(rows);
});

app.listen(PORT, () => {
  console.log(`Sight Tech API listening on http://localhost:${PORT}`);
});
