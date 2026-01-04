# Production Server Setup for Google OAuth

## Problem Summary

- ✅ Production server at `https://findmypuppydb.onrender.com` is running
- ❌ Google OAuth sign-in doesn't work with production server
- ✅ Google OAuth works with localhost (because local server has GOOGLE_CLIENT_ID configured)
- ❌ DB writes don't work when using localhost

## Root Cause

The production server on Render needs to have:
1. ✅ The `/api/auth/google/signin` endpoint (should already exist in server code)
2. ✅ The `google-auth-library` package installed
3. ❌ **The `GOOGLE_CLIENT_ID` environment variable configured**

## Solution: Configure Google OAuth on Render

### Step 1: Add Environment Variable on Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Find your service: `findmypuppydb`
3. Click on it to open the service
4. Go to **"Environment"** tab
5. Click **"Add Environment Variable"**
6. Add:
   - **Key**: `GOOGLE_CLIENT_ID`
   - **Value**: `432104127842-br66htaeo4khnhpb85vbjmei43etkvkf.apps.googleusercontent.com`
7. Click **"Save Changes"**
8. Render will automatically redeploy your service

### Step 2: Verify the Deployment

After the redeploy completes:
1. Check the logs to see: `🔐 Google OAuth Initialized with Client ID: 432104127842-br66...`
2. Test Google sign-in from your app

### Step 3: Update Google OAuth Settings (If Needed)

If your app is hosted on a different domain, you may need to update Google OAuth settings:

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Find your OAuth 2.0 Client ID
3. Click **"Edit"**
4. Add your production domain to:
   - **Authorized JavaScript origins**: `https://your-production-domain.com`
   - **Authorized redirect URIs**: `https://your-production-domain.com`

## Current Configuration

The code in `services/db.tsx` now supports:

```typescript
// For development: Uses Vite proxy (localhost:5774)
// For production: Uses production server URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
                            (import.meta.env.DEV ? "" : "https://findmypuppydb.onrender.com");
```

This means:
- **Development**: When running `npm run dev`, it uses Vite proxy (no DB writes to production)
- **Production Build**: When deployed, it uses `https://findmypuppydb.onrender.com`

## To Use Production Server for DB Writes in Development

If you want to use the production server even in development:

1. Create/update `.env.local`:
   ```env
   VITE_API_BASE_URL=https://findmypuppydb.onrender.com
   ```

2. Restart the dev server:
   ```bash
   npm run dev
   ```

3. **Important**: Make sure the production server has `GOOGLE_CLIENT_ID` configured (see Step 1 above)

## Testing

After configuring Google OAuth on Render:

1. Set `VITE_API_BASE_URL=https://findmypuppydb.onrender.com` in `.env.local`
2. Restart your dev server
3. Try Google sign-in
4. Check browser console for any errors
5. Check Render logs for backend errors

## Summary

- **Port 5173**: Frontend (Vite) - This is normal ✅
- **Port 5774**: Backend (Express) - Local development only
- **Production**: `https://findmypuppydb.onrender.com` - Needs GOOGLE_CLIENT_ID environment variable ✅

Once you add `GOOGLE_CLIENT_ID` to Render, Google OAuth will work with the production server!

