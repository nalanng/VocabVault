import { Hono } from 'hono';
import { SignJWT, jwtVerify } from 'jose';
import type { Env } from '../index';

type Variables = { userId: string };

export const authRoutes = new Hono<{ Bindings: Env; Variables: Variables }>();

function generateId(): string {
  return crypto.randomUUID();
}

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(hash)));
}

async function createToken(userId: string, secret: string): Promise<string> {
  const key = new TextEncoder().encode(secret);
  return new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(key);
}

authRoutes.post('/register', async (c) => {
  const { email, password, first_name, last_name } = await c.req.json<{
    email: string; password: string; first_name: string; last_name: string;
  }>();

  if (!email || !password || !first_name || !last_name) {
    return c.json({ error: 'Tum alanlar gerekli' }, 400);
  }
  if (password.length < 6) {
    return c.json({ error: 'Sifre en az 6 karakter olmali' }, 400);
  }

  const existing = await c.env.DB.prepare('SELECT id FROM users WHERE email = ?')
    .bind(email.toLowerCase())
    .first();

  if (existing) {
    return c.json({ error: 'Bu email zaten kayitli' }, 409);
  }

  const id = generateId();
  const passwordHash = await hashPassword(password);

  await c.env.DB.prepare(
    'INSERT INTO users (id, email, password_hash, first_name, last_name) VALUES (?, ?, ?, ?, ?)'
  )
    .bind(id, email.toLowerCase(), passwordHash, first_name.trim(), last_name.trim())
    .run();

  const token = await createToken(id, c.env.JWT_SECRET);

  return c.json({
    token,
    user: { id, email: email.toLowerCase(), first_name: first_name.trim(), last_name: last_name.trim(), source_lang: 'tr', target_lang: 'en', created_at: new Date().toISOString() },
  }, 201);
});

authRoutes.post('/login', async (c) => {
  const { email, password } = await c.req.json<{ email: string; password: string }>();

  if (!email || !password) {
    return c.json({ error: 'Email ve şifre gerekli' }, 400);
  }

  const user = await c.env.DB.prepare(
    'SELECT id, email, password_hash, first_name, last_name, source_lang, target_lang, created_at FROM users WHERE email = ?'
  )
    .bind(email.toLowerCase())
    .first<{ id: string; email: string; password_hash: string; first_name: string; last_name: string; source_lang: string; target_lang: string; created_at: string }>();

  if (!user) {
    return c.json({ error: 'Email veya şifre hatalı' }, 401);
  }

  const passwordHash = await hashPassword(password);
  if (passwordHash !== user.password_hash) {
    return c.json({ error: 'Email veya şifre hatalı' }, 401);
  }

  const token = await createToken(user.id, c.env.JWT_SECRET);

  return c.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      source_lang: user.source_lang,
      target_lang: user.target_lang,
      created_at: user.created_at,
    },
  });
});

authRoutes.get('/me', async (c) => {
  const header = c.req.header('Authorization');
  if (!header?.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const secret = new TextEncoder().encode(c.env.JWT_SECRET);
    const { payload } = await jwtVerify(header.slice(7), secret);
    const userId = payload.sub;

    const user = await c.env.DB.prepare(
      'SELECT id, email, first_name, last_name, source_lang, target_lang, created_at FROM users WHERE id = ?'
    )
      .bind(userId)
      .first();

    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    return c.json({ user });
  } catch {
    return c.json({ error: 'Invalid token' }, 401);
  }
});
