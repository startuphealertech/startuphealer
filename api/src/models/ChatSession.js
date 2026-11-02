import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    from: { type: String, enum: ['user', 'bot'], required: true },
    text: { type: String, required: true, maxlength: 2000 },
    at: { type: Date, default: Date.now },
  },
  { _id: false },
);

const chatSessionSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, unique: true, maxlength: 64 },
    messages: { type: [messageSchema], default: [] },
    lead: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead' },
    page: { type: String, maxlength: 300 },
  },
  { timestamps: true },
);

export const ChatSession = mongoose.model('ChatSession', chatSessionSchema);
