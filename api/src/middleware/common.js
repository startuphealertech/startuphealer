import rateLimit from 'express-rate-limit';
import { ZodError } from 'zod';
import { ApiError } from '../utils/http.js';
import { env } from '../config/env.js';

// Validate req.body with a zod schema and replace it with the parsed (trimmed, typed) value.
export const validate = (schema) => (req, _res, next) => {
  req.body = schema.parse(req.body ?? {});
  next();
};

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
});

// Stricter limit for auth & public form endpoints (brute force / spam protection).
export const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again in a few minutes.' },
});

export function notFound(req, _res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: err.issues[0]?.message || 'Invalid input',
      errors: err.issues.map((i) => ({ field: i.path.join('.'), message: i.message })),
    });
  }
  if (err?.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(409).json({ success: false, message: `An account with this ${field} already exists` });
  }
  if (err?.name === 'CastError') {
    return res.status(400).json({ success: false, message: 'Invalid id' });
  }
  const status = err.status || err.statusCode || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({
    success: false,
    message: status >= 500 && env.isProd ? 'Something went wrong' : err.message,
    ...(err.details ? { details: err.details } : {}),
  });
}
