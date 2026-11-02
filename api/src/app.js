import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { env } from './config/env.js';
import { apiLimiter, notFound, errorHandler } from './middleware/common.js';
import authRoutes from './routes/auth.js';
import publicRoutes from './routes/public.js';
import adminRoutes from './routes/admin.js';

export function createApp() {
  const app = express();

  if (env.TRUST_PROXY > 0) app.set('trust proxy', env.TRUST_PROXY);
  app.disable('x-powered-by');
  app.set('etag', false); // API data is per-user — never let browsers/CDNs revalidate with 304s

  app.use(helmet());
  app.use(
    cors({
      origin(origin, cb) {
        // Allow server-to-server / curl (no origin) and whitelisted browser origins.
        if (!origin || env.corsOrigins.includes(origin)) return cb(null, true);
        return cb(Object.assign(new Error(`Origin ${origin} not allowed by CORS`), { status: 403 }));
      },
      credentials: true,
    }),
  );
  app.use(compression());
  app.use(express.json({ limit: '100kb' }));
  app.use(cookieParser());
  app.use(morgan(env.isProd ? 'combined' : 'dev', { skip: (req) => req.path === '/health' }));

  app.get('/health', (_req, res) => {
    const dbUp = mongoose.connection.readyState === 1;
    res.status(dbUp ? 200 : 503).json({ status: dbUp ? 'ok' : 'degraded', db: dbUp, env: env.NODE_ENV, uptime: process.uptime() });
  });
  app.get('/', (_req, res) => res.json({ name: 'StartupHealer api', version: '1.0.0', docs: '/api/v1' }));

  const v1 = express.Router();
  v1.use((_req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
  });
  v1.use(apiLimiter);
  v1.get('/', (_req, res) => res.json({ ok: true, version: 'v1' }));
  v1.use('/auth', authRoutes);
  v1.use('/admin', adminRoutes);
  v1.use('/', publicRoutes);
  app.use('/api/v1', v1);

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
