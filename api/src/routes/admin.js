import { Router } from 'express';
import { Lead, LEAD_SOURCES, LEAD_STATUSES } from '../models/Lead.js';
import { Contact } from '../models/Contact.js';
import { User } from '../models/User.js';
import { ChatSession } from '../models/ChatSession.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/common.js';
import { leadUpdateSchema, contactUpdateSchema, userUpdateSchema } from '../validators.js';
import { ApiError, ok, paginate, escapeRegex } from '../utils/http.js';

const router = Router();
router.use(requireAuth, requireAdmin);

const searchFilter = (q, fields) =>
  q ? { $or: fields.map((f) => ({ [f]: { $regex: escapeRegex(String(q).slice(0, 80)), $options: 'i' } })) } : {};

/* ---------- Dashboard ---------- */
router.get('/stats', async (_req, res) => {
  const since7 = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const since30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const [leads, leads7, users, contactsNew, chats, bySource, byStatus, daily] = await Promise.all([
    Lead.countDocuments(),
    Lead.countDocuments({ createdAt: { $gte: since7 } }),
    User.countDocuments({ role: 'user' }),
    Contact.countDocuments({ status: 'new' }),
    ChatSession.countDocuments(),
    Lead.aggregate([{ $group: { _id: '$source', count: { $sum: 1 } } }]),
    Lead.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Lead.aggregate([
      { $match: { createdAt: { $gte: since30 } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),
  ]);
  ok(res, { leads, leads7, users, contactsNew, chats, bySource, byStatus, daily });
});

/* ---------- Leads ---------- */
function leadQuery(q) {
  const filter = searchFilter(q.q, ['name', 'email', 'phone', 'interest']);
  if (LEAD_SOURCES.includes(q.source)) filter.source = q.source;
  if (LEAD_STATUSES.includes(q.status)) filter.status = q.status;
  return filter;
}

router.get('/leads', async (req, res) => {
  const { page, limit, skip } = paginate(req.query);
  const filter = leadQuery(req.query);
  const [items, total] = await Promise.all([
    Lead.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Lead.countDocuments(filter),
  ]);
  ok(res, { items, total, page, pages: Math.ceil(total / limit) });
});

const csvCell = (v) => {
  let s = v == null ? '' : String(v);
  if (/^[=+\-@]/.test(s)) s = `'${s}`; // prevent CSV formula injection in Excel
  return `"${s.replace(/"/g, '""')}"`;
};

router.get('/leads/export.csv', async (req, res) => {
  const items = await Lead.find(leadQuery(req.query)).sort({ createdAt: -1 }).limit(10000).lean();
  const cols = ['createdAt', 'name', 'email', 'phone', 'stage', 'interest', 'source', 'resource', 'status', 'notes'];
  const rows = [cols.join(','), ...items.map((l) => cols.map((c) => csvCell(c === 'createdAt' ? l[c]?.toISOString() : l[c])).join(','))];
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="startuphealer-leads-${Date.now()}.csv"`);
  res.send('﻿' + rows.join('\n'));
});

router.patch('/leads/:id', validate(leadUpdateSchema), async (req, res) => {
  const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!lead) throw new ApiError(404, 'Lead not found');
  ok(res, lead);
});

router.delete('/leads/:id', async (req, res) => {
  const lead = await Lead.findByIdAndDelete(req.params.id);
  if (!lead) throw new ApiError(404, 'Lead not found');
  ok(res, { deleted: true });
});

/* ---------- Contact messages ---------- */
router.get('/contacts', async (req, res) => {
  const { page, limit, skip } = paginate(req.query);
  const filter = searchFilter(req.query.q, ['name', 'email', 'phone', 'message']);
  if (['new', 'read', 'replied', 'archived'].includes(req.query.status)) filter.status = req.query.status;
  const [items, total] = await Promise.all([
    Contact.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Contact.countDocuments(filter),
  ]);
  ok(res, { items, total, page, pages: Math.ceil(total / limit) });
});

router.patch('/contacts/:id', validate(contactUpdateSchema), async (req, res) => {
  const c = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!c) throw new ApiError(404, 'Message not found');
  ok(res, c);
});

router.delete('/contacts/:id', async (req, res) => {
  const c = await Contact.findByIdAndDelete(req.params.id);
  if (!c) throw new ApiError(404, 'Message not found');
  ok(res, { deleted: true });
});

/* ---------- Users ---------- */
router.get('/users', async (req, res) => {
  const { page, limit, skip } = paginate(req.query);
  const filter = searchFilter(req.query.q, ['firstName', 'lastName', 'email', 'contactNumber']);
  const [items, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);
  ok(res, { items: items.map((u) => ({ ...u.toPublic(), isActive: u.isActive, lastLoginAt: u.lastLoginAt })), total, page, pages: Math.ceil(total / limit) });
});

router.patch('/users/:id', validate(userUpdateSchema), async (req, res) => {
  if (req.params.id === req.user._id.toString()) throw new ApiError(400, 'You cannot change your own role/status');
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!user) throw new ApiError(404, 'User not found');
  ok(res, { ...user.toPublic(), isActive: user.isActive });
});

/* ---------- Chat transcripts ---------- */
router.get('/chats', async (req, res) => {
  const { page, limit, skip } = paginate(req.query);
  const [items, total] = await Promise.all([
    ChatSession.find().sort({ updatedAt: -1 }).skip(skip).limit(limit).populate('lead', 'name email phone').lean(),
    ChatSession.countDocuments(),
  ]);
  ok(res, { items, total, page, pages: Math.ceil(total / limit) });
});

export default router;
