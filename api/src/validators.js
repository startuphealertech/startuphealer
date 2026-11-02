import { z } from 'zod';
import { LEAD_SOURCES, LEAD_STATUSES } from './models/Lead.js';

const email = z.string().trim().toLowerCase().email('Please enter a valid email address').max(160);
const phone = z
  .string()
  .trim()
  .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit contact number');
const optionalPhone = z.union([phone, z.literal('')]).optional();
const text = (max) => z.string().trim().max(max);

export const registerSchema = z
  .object({
    firstName: text(60).min(1, 'Please enter your full name'),
    lastName: text(60).optional().default(''),
    email,
    contactNumber: phone,
    password: z.string().min(6, 'Password must be at least 6 characters long').max(128),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Please fill in all fields').max(128),
  remember: z.boolean().optional(),
});

export const profileSchema = z.object({
  firstName: text(60).min(1).optional(),
  lastName: text(60).optional(),
  contactNumber: optionalPhone,
  profile: z
    .object({
      role: text(60).optional(),
      hasCoFounder: z.boolean().optional(),
      coFounderName: text(120).optional(),
      startupName: text(160).optional(),
      industry: text(120).optional(),
      sector: text(160).optional(),
      businessDescription: text(2000).optional(),
      state: text(60).optional(),
      city: text(80).optional(),
      address: text(300).optional(),
    })
    .optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6, 'Password must be at least 6 characters long').max(128),
});

const metaSchema = z
  .object({
    page: text(300).optional(),
    referrer: text(500).optional(),
    utmSource: text(120).optional(),
    utmMedium: text(120).optional(),
    utmCampaign: text(120).optional(),
  })
  .optional();

export const leadSchema = z.object({
  name: text(120).min(2, 'Please enter your name'),
  email,
  phone: optionalPhone,
  stage: text(60).optional(),
  interest: text(120).optional(),
  message: text(2000).optional(),
  source: z.enum(LEAD_SOURCES).default('lead-magnet'),
  resource: text(120).optional(),
  consent: z.boolean().default(true),
  meta: metaSchema,
  // Honeypot field — real users never fill this in.
  website: z.string().max(0, 'Spam detected').optional(),
});

export const contactSchema = z.object({
  name: text(120).min(2, 'Please enter your name'),
  email,
  phone: optionalPhone,
  service: text(120).optional(),
  message: text(4000).min(5, 'Please tell us a little about your requirement'),
  website: z.string().max(0, 'Spam detected').optional(),
});

export const chatMessageSchema = z.object({
  sessionId: z.string().trim().min(8).max(64),
  message: text(1000).min(1),
  page: text(300).optional(),
});

export const chatLeadSchema = z.object({
  sessionId: z.string().trim().min(8).max(64),
  name: text(120).min(2, 'Please enter your name'),
  email,
  phone: optionalPhone,
  interest: text(120).optional(),
});

export const leadUpdateSchema = z.object({
  status: z.enum(LEAD_STATUSES).optional(),
  notes: text(2000).optional(),
});

export const contactUpdateSchema = z.object({
  status: z.enum(['new', 'read', 'replied', 'archived']),
});

export const userUpdateSchema = z.object({
  role: z.enum(['user', 'admin']).optional(),
  isActive: z.boolean().optional(),
});
