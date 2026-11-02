import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { Lead } from '../models/Lead.js';
import { Contact } from '../models/Contact.js';
import { ChatSession } from '../models/ChatSession.js';
import { validate, strictLimiter } from '../middleware/common.js';
import { requireAuth } from '../middleware/auth.js';
import { leadSchema, contactSchema, chatMessageSchema, chatLeadSchema, profileSchema } from '../validators.js';
import { getReply } from '../chatbot/knowledge.js';
import { ok } from '../utils/http.js';

const router = Router();

const clientMeta = (req) => ({
  ip: req.ip,
  userAgent: req.get('user-agent')?.slice(0, 400),
});

/* ---------- Lead magnet ---------- */
router.post('/leads', strictLimiter, validate(leadSchema), async (req, res) => {
  const { website: _hp, meta, ...data } = req.body;
  // De-duplicate: same email + same source within 24h updates the existing lead instead of creating a new one.
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const existing = await Lead.findOne({ email: data.email, source: data.source, createdAt: { $gte: since } });
  if (existing) {
    Object.assign(existing, data);
    await existing.save();
    return ok(res, { id: existing._id, duplicate: true });
  }
  const lead = await Lead.create({ ...data, meta: { ...meta, ...clientMeta(req) } });
  ok(res, { id: lead._id }, 201);
});

/* ---------- Contact form ---------- */
router.post('/contact', strictLimiter, validate(contactSchema), async (req, res) => {
  const { website: _hp, ...data } = req.body;
  const contact = await Contact.create({ ...data, ip: req.ip });
  ok(res, { id: contact._id }, 201);
});

/* ---------- Chatbot ---------- */
router.post('/chatbot/session', (_req, res) => ok(res, { sessionId: randomUUID() }));

router.post('/chatbot/message', validate(chatMessageSchema), async (req, res) => {
  const { sessionId, message, page } = req.body;
  const answer = getReply(message);
  const now = new Date();
  await ChatSession.updateOne(
    { sessionId },
    {
      $setOnInsert: { sessionId, page },
      $push: {
        messages: {
          $each: [
            { from: 'user', text: message, at: now },
            { from: 'bot', text: answer.reply, at: now },
          ],
          $slice: -200,
        },
      },
    },
    { upsert: true },
  );
  ok(res, answer);
});

router.post('/chatbot/lead', strictLimiter, validate(chatLeadSchema), async (req, res) => {
  const { sessionId, ...data } = req.body;
  const lead = await Lead.create({ ...data, source: 'chatbot', meta: clientMeta(req) });
  await ChatSession.updateOne({ sessionId }, { $set: { lead: lead._id } });
  ok(res, { id: lead._id }, 201);
});

/* ---------- Logged-in user profile ---------- */
router.get('/profile', requireAuth, (req, res) => ok(res, { user: req.user.toPublic() }));

router.put('/profile', requireAuth, validate(profileSchema), async (req, res) => {
  const { profile, ...rest } = req.body;
  const user = req.user;
  Object.assign(user, rest);
  if (profile) user.profile = { ...(user.profile?.toObject?.() ?? user.profile ?? {}), ...profile };
  await user.save();
  ok(res, { user: user.toPublic() });
});

export default router;
