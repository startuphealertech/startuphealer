import { Router } from 'express';
import { User } from '../models/User.js';
import { validate, strictLimiter } from '../middleware/common.js';
import { requireAuth, signToken, setAuthCookie, clearAuthCookie, AUTH_COOKIE } from '../middleware/auth.js';
import { registerSchema, loginSchema, changePasswordSchema } from '../validators.js';
import { ApiError, ok } from '../utils/http.js';

const router = Router();

// NOTE: Email OTP verification (via Brevo) is planned — "coming soon". For now registration is
// email + password and `emailVerified` stays false until that flow is added.

router.post('/register', strictLimiter, validate(registerSchema), async (req, res) => {
  const { firstName, lastName, email, contactNumber, password } = req.body;
  const exists = await User.exists({ email });
  if (exists) throw new ApiError(409, 'An account with this email already exists. Please log in.');
  const user = await User.create({ firstName, lastName, email, contactNumber, password });
  const token = signToken(user);
  setAuthCookie(res, token);
  ok(res, { user: user.toPublic(), token }, 201);
});

router.post('/login', strictLimiter, validate(loginSchema), async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }
  if (!user.isActive) throw new ApiError(403, 'Your account has been disabled. Please contact support.');
  user.lastLoginAt = new Date();
  await user.save();
  const token = signToken(user);
  setAuthCookie(res, token);
  ok(res, { user: user.toPublic(), token });
});

router.post('/logout', (_req, res) => {
  clearAuthCookie(res);
  ok(res, { loggedOut: true });
});

// Session check used by the website on every page load: logged-out visitors get { user: null } (no 401 noise).
router.get('/me', async (req, res, next) => {
  if (!req.headers.authorization && !req.cookies?.[AUTH_COOKIE]) return ok(res, { user: null });
  try {
    await requireAuth(req, res, () => {});
    ok(res, { user: req.user.toPublic() });
  } catch {
    clearAuthCookie(res);
    ok(res, { user: null });
  }
});

router.post('/change-password', requireAuth, validate(changePasswordSchema), async (req, res) => {
  const user = await User.findById(req.user._id).select('+password');
  if (!(await user.comparePassword(req.body.currentPassword))) {
    throw new ApiError(400, 'Current password is incorrect');
  }
  user.password = req.body.newPassword;
  await user.save();
  ok(res, { updated: true });
});

export default router;
