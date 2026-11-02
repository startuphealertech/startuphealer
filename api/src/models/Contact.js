import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, lowercase: true, trim: true, maxlength: 160 },
    phone: { type: String, trim: true, maxlength: 15 },
    service: { type: String, trim: true, maxlength: 120 },
    message: { type: String, required: true, trim: true, maxlength: 4000 },
    status: { type: String, enum: ['new', 'read', 'replied', 'archived'], default: 'new', index: true },
    ip: { type: String, maxlength: 64 },
  },
  { timestamps: true },
);

contactSchema.index({ createdAt: -1 });

export const Contact = mongoose.model('Contact', contactSchema);
