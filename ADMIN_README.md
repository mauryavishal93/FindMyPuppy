# Find My Puppy — Admin Panel

## Quick start

1. **Backend**
   - From repo root: `npm run server` (or run `node server/server.js` from `server/`).
   - Install server deps if needed: `cd server && npm install` (adds `jsonwebtoken` for admin JWT).

2. **First super admin**
   - Set env and restart server:
     - `ADMIN_INIT_EMAIL=admin@example.com`
     - `ADMIN_INIT_PASSWORD=your-secure-password`
   - On first start, one super admin is created. **Change password after first login.**

3. **Admin JWT secret (production)**
   - Set `ADMIN_JWT_SECRET` (and optionally `ADMIN_JWT_EXPIRY`, default `8h`).

4. **Frontend**
   - Dev: `npm run dev`. Open **http://localhost:5173/admin**.
   - Production: build with `npm run build`; open **https://your-domain.com/admin**.

5. **API base**
   - Dev: Vite proxies `/api` to the backend. Admin API is at `/api/admin/*`.
   - Production: set `VITE_API_BASE_URL` to your backend URL so the admin UI can call the API (or serve same origin).

## What’s included

- **Spec:** [ADMIN_PANEL_SPEC.md](./ADMIN_PANEL_SPEC.md) — architecture, roles, API list, schemas, security.
- **Backend:** `server/admin/` — schemas, RBAC, audit, routes (auth, dashboard, users, gameplay). Other modules return 501 until implemented.
- **Frontend:** `admin/` — login, dashboard stats, users list, gameplay config (hash routing; no extra deps).

## Optional: MUI and React Router

For a full MUI dashboard and React Router:

```bash
npm install react-router-dom @mui/material @emotion/react @emotion/styled
```

Then switch `index.tsx` to use `BrowserRouter` and route `/admin/*` to an `AdminApp` that uses MUI and `<Routes>` (see spec for page list).

## Security

- Admin auth is **separate** from player auth (different DB collection and JWT).
- All `/api/admin/*` routes (except `POST /auth/login`) require the Admin JWT and RBAC.
- Set `ADMIN_JWT_SECRET` in production; restrict admin by IP/VPN if needed.
- Audit log: `adminAuditLogs` collection (backend writes on mutations).
