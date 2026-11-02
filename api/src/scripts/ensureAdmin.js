import { env } from '../config/env.js';
import { User } from '../models/User.js';

// Creates the first admin from ADMIN_EMAIL / ADMIN_PASSWORD if it doesn't exist yet.
// Existing accounts are only promoted to admin — their password is never overwritten.
export async function ensureAdmin() {
  if (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD) return;
  const email = env.ADMIN_EMAIL.toLowerCase();
  const user = await User.findOne({ email });
  if (!user) {
    const [firstName, ...rest] = env.ADMIN_NAME.split(' ');
    await User.create({
      firstName,
      lastName: rest.join(' '),
      email,
      password: env.ADMIN_PASSWORD,
      role: 'admin',
      emailVerified: true,
    });
    console.log(`👤 Admin user created: ${email}`);
  } else if (user.role !== 'admin') {
    user.role = 'admin';
    await user.save();
    console.log(`👤 Existing user promoted to admin: ${email}`);
  }
}
