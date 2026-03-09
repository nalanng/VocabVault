import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { authRoutes } from './routes/auth';
import { wordRoutes } from './routes/words';
import { practiceRoutes } from './routes/practice';
import { statsRoutes } from './routes/stats';

export type Env = {
  DB: D1Database;
  JWT_SECRET: string;
};

type Variables = {
  userId: string;
};

const app = new Hono<{ Bindings: Env; Variables: Variables }>();

app.use('/*', cors());

app.route('/api/auth', authRoutes);
app.route('/api/words', wordRoutes);
app.route('/api/practice', practiceRoutes);
app.route('/api/stats', statsRoutes);

app.get('/api/health', (c) => c.json({ status: 'ok' }));

export default app;
