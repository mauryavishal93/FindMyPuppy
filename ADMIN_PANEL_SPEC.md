# Find My Puppy — Admin Panel Specification

## 1. Architecture

| Layer | Stack |
|-------|--------|
| **Frontend** | React 18, Vite, React Router, Material UI (MUI) v5 |
| **Admin path** | `/admin` (same SPA; route-based) |
| **Backend** | Existing Node.js + Express |
| **Admin API** | `/api/admin/*` |
| **Database** | MongoDB (existing + new admin/analytics collections) |
| **Auth** | Separate admin auth (JWT or session); not player auth |

### Folder structure

```
server/
  admin/
    middleware/
      rbac.js          # RBAC & requireAdmin
      audit.js         # Audit log injector
    routes/
      index.js         # Mounts all admin routes
      auth.js          # POST login, GET me, POST logout
      dashboard.js     # GET stats (DAU, MAU, revenue, etc.)
      users.js        # CRUD, ban, hints, points, reset progress
      gameplay.js     # Level/difficulty config, overrides
      scenes.js       # Background images, scene assignment
      hints.js        # Free/premium hint config, grant/revoke
      shop.js         # Hint packs, offers, Razorpay list
      referrals.js    # Bonus config, track, revoke
      dailyCheckin.js # Reward rules, streak, reset
      leaderboard.js  # Ranking type, reset, recalc
      themes.js       # Enable/disable themes, default
      notifications.js# Broadcast, maintenance
      analytics.js    # Drop-off, play time, funnel
      security.js     # Audit logs, rate limit, maintenance mode
    schemas.js        # AdminUser, AdminAuditLog, GameConfig, ...
  server.js            # Mount /api/admin
```

```
admin/                 # Frontend admin UI
  AdminApp.tsx         # Router, layout, auth guard
  layout/
    AdminLayout.tsx
    AdminSidebar.tsx
  pages/
    Dashboard.tsx
    Users.tsx
    Gameplay.tsx
    Scenes.tsx
    Hints.tsx
    Shop.tsx
    Referrals.tsx
    DailyCheckIn.tsx
    Leaderboard.tsx
    Themes.tsx
    Notifications.tsx
    Analytics.tsx
    Security.tsx
  api/
    client.ts         # Axios/fetch wrapper with admin token
  hooks/
    useAdminAuth.ts
```

---

## 2. Admin Roles & RBAC

| Role | Scope | Permissions |
|------|--------|-------------|
| **super_admin** | Full | All permissions |
| **game_admin** | Gameplay | Levels, difficulties, timers, points, enable/disable |
| **content_admin** | Content | Scenes, assets, themes, preview |
| **support_admin** | Users | View/edit users, hints/points, reset progress, ban, referral history |
| **finance_admin** | Money | Payments, offers, refunds, revenue, transaction logs |

### Permission flags (granular)

- `users:read`, `users:write`, `users:ban`
- `gameplay:read`, `gameplay:write`
- `scenes:read`, `scenes:write`
- `hints:read`, `hints:write`, `hints:grant`
- `shop:read`, `shop:write`, `payments:refund`
- `referrals:read`, `referrals:write`, `referrals:revoke`
- `dailycheckin:read`, `dailycheckin:write`
- `leaderboard:read`, `leaderboard:write`
- `themes:read`, `themes:write`
- `notifications:write`
- `analytics:read`
- `security:read`, `security:maintenance`, `security:audit`

Super admin has all. Other roles get a subset (see `server/admin/middleware/rbac.js`).

---

## 3. MongoDB Schema Additions

### Collection: `adminUsers`

- `email` (String, unique, required)
- `passwordHash` (String, required)
- `name` (String)
- `role` (String, enum: super_admin, game_admin, content_admin, support_admin, finance_admin)
- `permissions` (Array of String) — optional override
- `isActive` (Boolean, default true)
- `lastLoginAt` (Date)
- `lastLoginIp` (String)
- `createdAt`, `updatedAt`

### Collection: `adminAuditLogs`

- `adminId` (ObjectId ref adminUsers)
- `adminEmail` (String)
- `action` (String) e.g. `user.ban`, `hints.grant`, `offer.update`
- `resource` (String) e.g. `user:john`, `offer:100-hints`
- `details` (Mixed) — payload before/after if needed
- `ip` (String)
- `userAgent` (String)
- `createdAt`

### Collection: `gameConfig`

- Single-doc or keyed by `configKey`.
- Fields: `puppyCountEasy`, `puppyCountMedium`, `puppyCountHard`, `timerMediumSeconds`, `timerHardSeconds`, `wrongTapLimit`, `pointsPerLevelEasy`, `pointsPerLevelMedium`, `pointsPerLevelHard`, `levelsEnabled`, `difficultiesEnabled` (object or array), `timerEnabled`, `liveOverrides` (Mixed), `updatedAt`, `updatedBy` (adminId).

### Collection: `sceneAssets`

- `sceneId` (String, unique)
- `name` (String)
- `imageUrl` (String) — path or URL
- `theme` (String)
- `difficulty` (Array or String)
- `levelRange` (e.g. `{ min: 1, max: 100 }`)
- `isEnabled` (Boolean)
- `metadata` (Mixed) — e.g. puppy placement hints
- `createdAt`, `updatedAt`

### Collection: `hintConfig`

- Single-doc: `freeHintsPerLevel`, `highlightDurationMs`, `premiumPacks` (array), `abuseThreshold` (optional).

### Collection: `referralConfig`

- Single-doc: `signupBonusHints`, `referrerRewardHints`, `enabled`, `maxReferralsPerUser` (optional).

### Collection: `dailyCheckInConfig`

- Single-doc: `rewardType` (points/hints), `rewardAmount`, `streakBonus`, `maxStreak`, `allowMissedReward` (boolean).

### Collection: `leaderboardConfig`

- Single-doc: `rankingType` (score / progress), `resetMode` (none / monthly / seasonal), `seasonEndDate` (optional).

### Collection: `themeFlags`

- `themeId` (String), `enabled` (Boolean), `isDefault` (Boolean), `eventOnly` (Boolean).

### Collection: `broadcastMessages`

- `id`, `title`, `body`, `platform` (web | android | all), `activeAt`, `expiresAt`, `createdBy`, `createdAt`.

### Collection: `maintenanceMode`

- Single-doc: `enabled` (Boolean), `message` (String), `updatedAt`, `updatedBy`.

---

## 4. Admin API Route List

### Auth
- `POST /api/admin/auth/login` — body: `{ email, password }` → JWT + admin user
- `GET /api/admin/auth/me` — requires Admin JWT → current admin user + permissions
- `POST /api/admin/auth/logout` — optional; blacklist token if using JWT blacklist

### Dashboard
- `GET /api/admin/dashboard/stats` — DAU, MAU, web vs android (if you have platform), revenue today/month/total, hints sold, failed payments count, server health (optional)

### Users
- `GET /api/admin/users` — list (paginated, filter by username/email/role, sort)
- `GET /api/admin/users/:username` — one user full detail
- `PUT /api/admin/users/:username` — update (username, email, points, hints, premium, reset progress per difficulty, reset daily check-in)
- `POST /api/admin/users/:username/ban` — set banned flag / reason
- `DELETE /api/admin/users/:username/ban` — unban
- `GET /api/admin/users/:username/referrals` — referral history
- `GET /api/admin/users/:username/purchases` — purchase history
- `POST /api/admin/users/:username/hints` — grant/revoke hints (body: delta or set)
- `POST /api/admin/users/:username/points` — grant/revoke points

### Gameplay & levels
- `GET /api/admin/gameplay/config` — get current game config
- `PUT /api/admin/gameplay/config` — update puppy count, timer, wrong tap limit, points per level
- `PUT /api/admin/gameplay/overrides` — live overrides (e.g. event mode)
- `GET /api/admin/gameplay/levels` — enable/disable levels or difficulties (if stored)

### Scenes & assets
- `GET /api/admin/scenes` — list scene assets
- `POST /api/admin/scenes` — upload/create (multipart or URL)
- `PUT /api/admin/scenes/:sceneId` — update, enable/disable, assign to levels
- `DELETE /api/admin/scenes/:sceneId` — soft delete or remove
- `GET /api/admin/scenes/:sceneId/preview` — metadata/preview

### Hints
- `GET /api/admin/hints/config` — free per level, duration, packs
- `PUT /api/admin/hints/config` — update config
- `POST /api/admin/hints/grant` — body: `{ username, hints }`
- `POST /api/admin/hints/revoke` — body: `{ username, hints }`
- `GET /api/admin/hints/abuse` — list suspicious usage (if tracked)

### Shop & payments
- `GET /api/admin/shop/offers` — list hint packs / price offers
- `PUT /api/admin/shop/offers/:id` — market price, offer price, enable/disable
- `GET /api/admin/shop/orders` — Razorpay order list (from your DB or Razorpay API)
- `POST /api/admin/shop/verify-payment` — manual verify by payment id
- `POST /api/admin/shop/refund` — body: `{ paymentId, reason }` (call Razorpay refund)
- `GET /api/admin/shop/transactions` — transaction logs (paginated)
- `GET /api/admin/shop/revenue` — revenue report (query params: from, to)
- `GET /api/admin/shop/revenue/export` — CSV export

### Referrals
- `GET /api/admin/referrals/config` — signup bonus, referrer reward
- `PUT /api/admin/referrals/config` — update
- `GET /api/admin/referrals` — list referrals (referrer, referred, date)
- `POST /api/admin/referrals/revoke` — revoke reward for a referral

### Daily check-in
- `GET /api/admin/dailycheckin/config` — reward rules, streak
- `PUT /api/admin/dailycheckin/config` — update
- `POST /api/admin/dailycheckin/reset-streak` — body: `{ username }`
- `POST /api/admin/dailycheckin/grant-missed` — body: `{ username, date }`

### Leaderboard
- `GET /api/admin/leaderboard/config` — ranking type, reset mode
- `PUT /api/admin/leaderboard/config` — update
- `POST /api/admin/leaderboard/reset` — optional body: season label
- `POST /api/admin/leaderboard/recalculate` — recalc from DB
- `DELETE /api/admin/leaderboard/entries/:userId` — remove cheater

### Themes & UI
- `GET /api/admin/themes` — list theme flags
- `PUT /api/admin/themes/:themeId` — enabled, default, eventOnly
- `GET /api/admin/ui-flags` — modals/popups toggles (if stored)
- `PUT /api/admin/ui-flags` — update

### Notifications
- `GET /api/admin/notifications` — list broadcast messages
- `POST /api/admin/notifications` — create broadcast (title, body, platform, activeAt, expiresAt)
- `PUT /api/admin/notifications/:id` — update
- `DELETE /api/admin/notifications/:id` — delete

### Analytics
- `GET /api/admin/analytics/level-dropoff` — query params: difficulty, from, to
- `GET /api/admin/analytics/play-time` — avg play time
- `GET /api/admin/analytics/hint-usage` — usage stats
- `GET /api/admin/analytics/difficulty-win-rate` — win rate by difficulty
- `GET /api/admin/analytics/funnel` — funnel report (e.g. start level → complete level)

### Security & logs
- `GET /api/admin/security/audit-logs` — paginated audit logs
- `GET /api/admin/security/login-history` — admin login history
- `GET /api/admin/security/rate-limit` — get current rate limit config
- `PUT /api/admin/security/rate-limit` — update (if you have rate limit config)
- `GET /api/admin/security/maintenance` — get maintenance mode status
- `PUT /api/admin/security/maintenance` — set maintenance mode (enabled, message)

---

## 5. RBAC Middleware Logic

- **requireAdmin**: Verify admin JWT (or session). Attach `req.admin` (admin user doc). If no token or invalid → 401.
- **requirePermission(permission)**: After requireAdmin, check `req.admin.role`:
  - If `super_admin` → next().
  - Else check `req.admin.permissions` (or role-to-permissions map) contains `permission`. If not → 403.
- **audit(action, resource)**: After successful mutation, write to `adminAuditLogs` with adminId, action, resource, details, ip, userAgent.

Use order: `requireAdmin` → `requirePermission('users:write')` → handler → `audit('user.update', 'user:'+username)`.

---

## 6. Security Best Practices

- Admin auth **separate** from player auth (different table and tokens).
- Admin routes **only** under `/api/admin`; all protected by `requireAdmin` (except login).
- Passwords hashed with **bcrypt** (same as existing server).
- **HTTPS only** in production.
- **Rate limit** admin login (e.g. 5 per 15 min per IP) and optionally per-admin on sensitive actions.
- **Audit log** all mutations (who, what, when, IP).
- **CORS**: Restrict admin API to your admin origin if different from game.
- **JWT**: Short-lived access token (e.g. 1h); optional refresh token; store in httpOnly cookie or memory (no localStorage if XSS is a concern).
- **Maintenance mode**: Middleware that returns 503 for game API when enabled; admin API still allowed so you can turn it off.
- **Sensitive env**: `ADMIN_JWT_SECRET`, `ADMIN_INIT_EMAIL`, `ADMIN_INIT_PASSWORD` for first-time super admin seed (change password on first login).

---

## 7. Scalability (10k–100k users)

- **Indexes**: `adminUsers.email`, `adminAuditLogs.adminId` + `createdAt`, `user.username`/`email`, `purchaseHistory` by date and username, `gameConfig` single doc.
- **Pagination**: All list endpoints use `page`, `limit`; default limit cap (e.g. 100).
- **Caching**: Dashboard stats can be cached 1–5 min (Redis or in-memory); invalidate on config change.
- **Read replicas**: If MongoDB replica set, admin reads can use secondary for reports.
- **Export**: Revenue/CSV via streaming or background job for large datasets.

---

## 8. Deployment Checklist

- [ ] Set `ADMIN_JWT_SECRET` in production.
- [ ] Seed first super admin (or use INIT email/password once).
- [ ] Ensure `GOOGLE_CLIENT_ID` and Razorpay keys are set (existing).
- [ ] Restrict admin route by IP or VPN if needed.
- [ ] Enable audit logging and rotate/log retention policy.
- [ ] Test RBAC for each role.
- [ ] Test maintenance mode and revert.
