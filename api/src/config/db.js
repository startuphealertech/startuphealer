import mongoose from 'mongoose';
import { env } from './env.js';

// NoSQL-injection guard: every request body is parsed by a zod schema (strings stay strings, objects
// like { $gt: "" } are rejected) and query-string filters are whitelisted/stringified in the routes.
mongoose.set('strictQuery', true);

export async function connectDB() {
  mongoose.connection.on('connected', () => console.log('✅ MongoDB connected'));
  mongoose.connection.on('error', (err) => console.error('MongoDB error:', err.message));
  mongoose.connection.on('disconnected', () => console.warn('⚠️  MongoDB disconnected'));

  await mongoose.connect(env.MONGODB_URI, {
    serverSelectionTimeoutMS: 15000,
    maxPoolSize: 10,
    autoIndex: !env.isProd,
  });
}

export async function disconnectDB() {
  await mongoose.connection.close();
}
