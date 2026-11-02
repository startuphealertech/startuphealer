import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const profileSchema = new mongoose.Schema(
  {
    role: { type: String, trim: true, maxlength: 60 }, // Founder, Mentor, Investor...
    hasCoFounder: { type: Boolean, default: false },
    coFounderName: { type: String, trim: true, maxlength: 120 },
    startupName: { type: String, trim: true, maxlength: 160 },
    industry: { type: String, trim: true, maxlength: 120 },
    sector: { type: String, trim: true, maxlength: 160 },
    businessDescription: { type: String, trim: true, maxlength: 2000 },
    state: { type: String, trim: true, maxlength: 60 },
    city: { type: String, trim: true, maxlength: 80 },
    address: { type: String, trim: true, maxlength: 300 },
  },
  { _id: false },
);

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true, maxlength: 60 },
    lastName: { type: String, trim: true, maxlength: 60, default: '' },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 160 },
    contactNumber: { type: String, trim: true, maxlength: 15 },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user', index: true },
    emailVerified: { type: Boolean, default: false }, // reserved for Brevo OTP flow (coming soon)
    isActive: { type: Boolean, default: true },
    lastLoginAt: Date,
    profile: { type: profileSchema, default: () => ({}) },
  },
  { timestamps: true },
);

userSchema.pre('save', async function hashPassword() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = function comparePassword(plain) {
  return bcrypt.compare(plain, this.password);
};

userSchema.methods.toPublic = function toPublic() {
  return {
    id: this._id.toString(),
    firstName: this.firstName,
    lastName: this.lastName,
    email: this.email,
    contactNumber: this.contactNumber,
    role: this.role,
    emailVerified: this.emailVerified,
    profile: this.profile,
    createdAt: this.createdAt,
  };
};

export const User = mongoose.model('User', userSchema);
