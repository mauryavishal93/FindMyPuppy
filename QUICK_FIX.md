# Quick Fix: Google OAuth on Production Server

## The Problem
- ✅ Google sign-in works with `localhost` (local backend has GOOGLE_CLIENT_ID)
- ❌ Google sign-in doesn't work with production server (missing GOOGLE_CLIENT_ID)

## The Solution
Add `GOOGLE_CLIENT_ID` to your Render production server.

### Steps:
1. Go to: https://dashboard.render.com
2. Find service: `findmypuppydb`
3. Click → **Environment** tab
4. Click → **Add Environment Variable**
5. Add:
   - **Key**: `GOOGLE_CLIENT_ID`
   - **Value**: `432104127842-br66htaeo4khnhpb85vbjmei43etkvkf.apps.googleusercontent.com`
6. **Save** → Render auto-redeploys (1-2 min)

### To Use Production Server in Development:
Create `.env.local` in project root:
```env
VITE_API_BASE_URL=https://findmypuppydb.onrender.com
```

Then restart: `npm run dev`

---

**Note**: Port 5173 is your frontend (Vite) - that's correct! The backend is on 5774 locally, or use the production server URL.

