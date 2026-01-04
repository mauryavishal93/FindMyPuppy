# How to Fix Google OAuth on Production Server

## Quick Fix: Configure Google OAuth on Render

Your production server at `https://findmypuppydb.onrender.com` needs the `GOOGLE_CLIENT_ID` environment variable.

### Steps:

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Find your service**: `findmypuppydb` 
3. **Click on it** to open the service
4. **Go to "Environment" tab**
5. **Click "Add Environment Variable"**
6. **Add**:
   - **Key**: `GOOGLE_CLIENT_ID`
   - **Value**: `432104127842-br66htaeo4khnhpb85vbjmei43etkvkf.apps.googleusercontent.com`
7. **Click "Save Changes"**
8. **Render will automatically redeploy** (takes 1-2 minutes)

### Verify:

After redeploy, check the logs. You should see:
```
🔐 Google OAuth Initialized with Client ID: 432104127842-br66...
```

## Current Configuration

I've updated `services/db.tsx` to automatically:
- Use **Vite proxy** in development (empty string → proxies to localhost:5774)
- Use **production URL** in production builds (`https://findmypuppydb.onrender.com`)

### To Use Production Server in Development:

Create/update `.env.local`:
```env
VITE_API_BASE_URL=https://findmypuppydb.onrender.com
```

Then restart:
```bash
npm run dev
```

## Summary

- **Port 5173** = Frontend (Vite) - This is normal ✅
- **Port 5774** = Backend (Local) - Only when running `npm run server`
- **Production** = `https://findmypuppydb.onrender.com` - Needs GOOGLE_CLIENT_ID ✅

Once you add `GOOGLE_CLIENT_ID` to Render, Google OAuth will work with the production server!

