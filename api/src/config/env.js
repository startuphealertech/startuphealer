// Centralised, validated environment config. Fails fast on boot if something critical is missing.
import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  // Comma separated list of allowed browser origins, e.g. "https://startuphealer.com,https://www.startuphealer.com"
  CORS_ORIGINS: z.string().default('http://localhost:3000'),
  // Number of proxy hops in front of the API (so rate limiting sees the real client IP).
  // local/staging docker: 0-1 · Render direct: 1 · Vercel rewrite -> Render: 2
  TRUST_PROXY: z.coerce.number().int().min(0).max(5).default(1),
  COOKIE_DOMAIN: z.string().optional(),
  ADMIN_NAME: z.string().default('StartupHealer Admin'),
  ADMIN_EMAIL: z.string().email().optional(),
  ADMIN_PASSWORD: z.string().min(8).optional(),
  WHATSAPP_NUMBER: z.string().default('919610332259'),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  console.error('❌ Invalid environment configuration:');
  for (const issue of parsed.error.issues) console.error(`   - ${issue.path.join('.')}: ${issue.message}`);
  process.exit(1);
}

export const env = {
  ...parsed.data,
  isProd: parsed.data.NODE_ENV === 'production',
  corsOrigins: parsed.data.CORS_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean),
};
