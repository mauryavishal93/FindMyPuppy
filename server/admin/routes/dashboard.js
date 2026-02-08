/**
 * GET /api/admin/dashboard/stats — DAU, MAU, revenue, hints sold, failed payments, etc.
 * Uses User and PurchaseHistory models registered in server.js.
 */

import { Router } from 'express';
import mongoose from 'mongoose';
import { requireAdmin, requirePermission } from '../middleware/rbac.js';

const router = Router();

router.get('/stats', requireAdmin, requirePermission('analytics:read', 'users:read'), async (req, res) => {
  try {
    const UserModel = mongoose.models.User;
    const PurchaseHistoryModel = mongoose.models.PurchaseHistory;
    if (!UserModel || !PurchaseHistoryModel) {
      return res.status(500).json({ success: false, message: 'Models not available.' });
    }

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [totalUsers, todayLogins, monthLogins, lastMonthLogins, revenueToday, revenueMonth, revenueTotal, hintsSold] = await Promise.all([
      UserModel.countDocuments({}),
      UserModel.countDocuments({ lastLogin: { $gte: startOfToday } }),
      UserModel.countDocuments({ lastLogin: { $gte: startOfMonth } }),
      UserModel.countDocuments({ lastLogin: { $gte: startOfLastMonth, $lt: startOfMonth } }),
      PurchaseHistoryModel.aggregate([
        { $match: { purchaseDate: { $gte: startOfToday }, purchaseMode: 'Money', amount: { $gt: 0 } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]).then((r) => (r[0] && r[0].total) || 0),
      PurchaseHistoryModel.aggregate([
        { $match: { purchaseDate: { $gte: startOfMonth }, purchaseMode: 'Money', amount: { $gt: 0 } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]).then((r) => (r[0] && r[0].total) || 0),
      PurchaseHistoryModel.aggregate([
        { $match: { purchaseMode: 'Money', amount: { $gt: 0 } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]).then((r) => (r[0] && r[0].total) || 0),
      PurchaseHistoryModel.countDocuments({ purchaseType: 'Hints' }),
    ]);

    const MAU = monthLogins;
    const DAU = todayLogins;

    res.json({
      success: true,
      stats: {
        dau: DAU,
        mau: MAU,
        totalUsers,
        revenueToday: Math.round(revenueToday * 100) / 100,
        revenueMonth: Math.round(revenueMonth * 100) / 100,
        revenueTotal: Math.round(revenueTotal * 100) / 100,
        hintsSold,
        failedPayments: 0, // optional: track in your payment flow
        serverHealth: 'ok',
      },
    });
  } catch (err) {
    console.error('Dashboard stats error:', err);
    res.status(500).json({ success: false, message: 'Failed to load stats.' });
  }
});

export default router;
