/**
 * Admin user management: list, get, update, ban, hints, points, referrals, purchases
 */

import { Router } from 'express';
import mongoose from 'mongoose';
import { requireAdmin, requirePermission } from '../middleware/rbac.js';
import { audit } from '../middleware/audit.js';

const router = Router();
const User = () => mongoose.models.User;
const PurchaseHistory = () => mongoose.models.PurchaseHistory;

router.get('/', requireAdmin, requirePermission('users:read'), async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;
    const q = (req.query.q || '').trim();
    const filter = {};
    if (q) {
      filter.$or = [
        { username: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
      ];
    }
    const [users, total] = await Promise.all([
      User().find(filter).sort({ lastLogin: -1 }).skip(skip).limit(limit).lean(),
      User().countDocuments(filter),
    ]);
    res.json({ success: true, users, total, page, limit });
  } catch (err) {
    console.error('Admin users list error:', err);
    res.status(500).json({ success: false, message: 'Failed to list users.' });
  }
});

router.get('/:username', requireAdmin, requirePermission('users:read'), async (req, res) => {
  try {
    const user = await User().findOne({ username: req.params.username }).lean();
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    const { passwordHash, resetPasswordToken, resetPasswordExpires, ...safe } = user;
    res.json({ success: true, user: safe });
  } catch (err) {
    console.error('Admin user get error:', err);
    res.status(500).json({ success: false, message: 'Failed to get user.' });
  }
});

router.put('/:username', requireAdmin, requirePermission('users:write'), async (req, res) => {
  try {
    const user = await User().findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    const { username, email, points, hints, premium, resetProgress, resetDailyCheckIn } = req.body || {};
    if (email !== undefined) user.email = email;
    if (points !== undefined) user.points = Math.max(0, Number(points));
    if (hints !== undefined) user.hints = Math.max(0, Number(hints));
    if (premium !== undefined) user.premium = Boolean(premium);
    if (resetProgress === true) {
      user.levelPassedEasy = 0;
      user.levelPassedMedium = 0;
      user.levelPassedHard = 0;
    }
    if (resetDailyCheckIn === true) {
      user.lastCheckInDate = null;
      user.checkInStreak = 0;
    }
    await user.save();
    await audit(req, 'user.update', `user:${user.username}`, { updates: req.body });
    res.json({ success: true, user: { username: user.username, points: user.points, hints: user.hints, premium: user.premium } });
  } catch (err) {
    console.error('Admin user update error:', err);
    res.status(500).json({ success: false, message: 'Failed to update user.' });
  }
});

router.get('/:username/referrals', requireAdmin, requirePermission('users:read', 'referrals:read'), async (req, res) => {
  try {
    const referred = await User().find({ referredBy: { $regex: new RegExp(`^${req.params.username}`) } })
      .select('username email referredBy createdAt').lean();
    res.json({ success: true, referrals: referred });
  } catch (err) {
    console.error('Admin referrals list error:', err);
    res.status(500).json({ success: false, message: 'Failed to list referrals.' });
  }
});

router.get('/:username/purchases', requireAdmin, requirePermission('users:read', 'shop:read'), async (req, res) => {
  try {
    const purchases = await PurchaseHistory().find({ username: req.params.username }).sort({ purchaseDate: -1 }).limit(100).lean();
    res.json({ success: true, purchases });
  } catch (err) {
    console.error('Admin purchases list error:', err);
    res.status(500).json({ success: false, message: 'Failed to list purchases.' });
  }
});

export default router;
