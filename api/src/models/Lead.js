import mongoose from 'mongoose';

export const LEAD_SOURCES = ['lead-magnet', 'chatbot', 'contact', 'service-enquiry', 'other'];
export const LEAD_STATUSES = ['new', 'contacted', 'qualified', 'converted', 'lost'];

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, lowercase: true, trim: true, maxlength: 160, index: true },
    phone: { type: String, trim: true, maxlength: 15 },
    stage: { type: String, trim: true, maxlength: 60 }, // Idea / Registered / Revenue / Funded
    interest: { type: String, trim: true, maxlength: 120 }, // service they care about
    message: { type: String, trim: true, maxlength: 2000 },
    source: { type: String, enum: LEAD_SOURCES, default: 'lead-magnet', index: true },
    resource: { type: String, trim: true, maxlength: 120 }, // which freebie they downloaded
    status: { type: String, enum: LEAD_STATUSES, default: 'new', index: true },
    notes: { type: String, trim: true, maxlength: 2000 },
    consent: { type: Boolean, default: true },
    meta: {
      page: { type: String, maxlength: 300 },
      referrer: { type: String, maxlength: 500 },
      utmSource: { type: String, maxlength: 120 },
      utmMedium: { type: String, maxlength: 120 },
      utmCampaign: { type: String, maxlength: 120 },
      ip: { type: String, maxlength: 64 },
      userAgent: { type: String, maxlength: 400 },
    },
  },
  { timestamps: true },
);

leadSchema.index({ createdAt: -1 });

export const Lead = mongoose.model('Lead', leadSchema);
