/**
 * GET/PUT gameplay config: puppy count, timer, wrong tap limit, points, overrides
 */

import { Router } from 'express';
import { requireAdmin, requirePermission } from '../middleware/rbac.js';
import { GameConfig } from '../schemas.js';
import { audit } from '../middleware/audit.js';

const router = Router();

router.get('/config', requireAdmin, requirePermission('gameplay:read'), async (req, res) => {
  try {
    let config = await GameConfig.findOne({ configKey: 'default' });
    if (!config) {
      config = await GameConfig.create({ configKey: 'default' });
    }
    res.json({ success: true, config: config.toObject() });
  } catch (err) {
    console.error('Admin gameplay config get error:', err);
    res.status(500).json({ success: false, message: 'Failed to get config.' });
  }
});

router.put('/config', requireAdmin, requirePermission('gameplay:write'), async (req, res) => {
  try {
    const updates = req.body || {};
    const allowed = [
      'puppyCountEasy', 'puppyCountMedium', 'puppyCountHard',
      'timerMediumSeconds', 'timerHardSeconds', 'wrongTapLimit',
      'pointsPerLevelEasy', 'pointsPerLevelMedium', 'pointsPerLevelHard',
      'levelsEnabled', 'difficultiesEnabled', 'timerEnabled',
    ];
    const set = {};
    allowed.forEach((k) => { if (updates[k] !== undefined) set[k] = updates[k]; });
    set.updatedAt = new Date();
    set.updatedBy = req.admin._id;
    const config = await GameConfig.findOneAndUpdate(
      { configKey: 'default' },
      { $set: set },
      { new: true, upsert: true }
    );
    await audit(req, 'gameplay.config.update', 'gameConfig', set);
    res.json({ success: true, config: config.toObject() });
  } catch (err) {
    console.error('Admin gameplay config update error:', err);
    res.status(500).json({ success: false, message: 'Failed to update config.' });
  }
});

router.put('/overrides', requireAdmin, requirePermission('gameplay:write'), async (req, res) => {
  try {
    const liveOverrides = req.body?.liveOverrides ?? null;
    const config = await GameConfig.findOneAndUpdate(
      { configKey: 'default' },
      { $set: { liveOverrides, updatedAt: new Date(), updatedBy: req.admin._id } },
      { new: true, upsert: true }
    );
    await audit(req, 'gameplay.overrides.update', 'gameConfig', { liveOverrides });
    res.json({ success: true, liveOverrides: config.liveOverrides });
  } catch (err) {
    console.error('Admin gameplay overrides error:', err);
    res.status(500).json({ success: false, message: 'Failed to update overrides.' });
  }
});

export default router;
