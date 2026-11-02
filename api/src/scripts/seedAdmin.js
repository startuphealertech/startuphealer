// Usage: npm run seed:admin   (reads ADMIN_EMAIL / ADMIN_PASSWORD from api/.env)
import { connectDB, disconnectDB } from '../config/db.js';
import { ensureAdmin } from './ensureAdmin.js';
import { env } from '../config/env.js';

if (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD) {
  console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD in api/.env first.');
  process.exit(1);
}
await connectDB();
await ensureAdmin();
await disconnectDB();
console.log('Done.');
