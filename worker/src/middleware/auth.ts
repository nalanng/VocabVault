import { createMiddleware } from 'hono/factory';
import { jwtVerify } from 'jose';
import type { Env } from '../index';

type Variables = { userId: string };

export const authMiddleware = createMiddleware<{
  Bindings: Env;
  Variables: Variables;
}>(async (c, next) => {
  const header = c.req.header('Authorization');
  if (!header?.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const token = header.slice(7);
  try {
    const secret = new TextEncoder().encode(c.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    if (!payload.sub) {
      return c.json({ error: 'Invalid token' }, 401);
    }
    c.set('userId', payload.sub);
    await next();
  } catch {
    return c.json({ error: 'Invalid token' }, 401);
  }
});
