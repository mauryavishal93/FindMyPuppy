# API Configuration Guide

## Current Setup

Your application needs to connect to the backend API for database operations. There are two servers available:

### 1. Production Server
- **URL**: `https://findmypuppydb.onrender.com`
- **Status**: ✅ Running (confirmed via web check)
- **Use Case**: Production deployment, DB writes
- **Google OAuth**: Needs to be configured (see below)

### 2. Local Development Server
- **URL**: `http://localhost:5774`
- **Status**: Runs when you execute `npm run server`
- **Use Case**: Local development and testing
- **Google OAuth**: ✅ Configured (has GOOGLE_CLIENT_ID in .env)

## The Problem

You mentioned:
- ✅ Google sign-in works with `localhost:5173` (actually `localhost:5774` via proxy)
- ❌ Google sign-in doesn't work with production server
- ❌ DB writes don't work with localhost

## The Solution

### Option 1: Use Vite Proxy (Recommended for Development)

**Best for**: Local development with automatic proxying

1. Set `API_BASE_URL` to empty string in `services/db.tsx`:
   ```typescript
   export const API_BASE_URL = "";
   ```

2. Vite proxy will automatically forward `/api/*` requests to `localhost:5774`

3. Start both servers:
   ```bash
   npm run server  # Starts backend on 5774 and frontend on 5173
   ```

**Pros**: 
- Works seamlessly in development
- No need to change URLs
- CORS handled automatically

**Cons**: 
- Only works when both servers are running locally

### Option 2: Use Environment Variables (Recommended for Production)

**Best for**: Different environments (dev/prod)

1. Create/update `.env.local`:
   ```env
   # For local development (use Vite proxy)
   VITE_API_BASE_URL=
   
   # OR for direct connection to local backend
   # VITE_API_BASE_URL=http://localhost:5774
   
   # For production (set in your hosting platform)
   # VITE_API_BASE_URL=https://findmypuppydb.onrender.com
   ```

2. The code automatically uses the environment variable:
   ```typescript
   export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
                               (import.meta.env.DEV ? "" : "https://findmypuppydb.onrender.com");
   ```

**Pros**:
- Flexible configuration
- Different URLs for dev/prod
- No code changes needed

### Option 3: Direct Production URL (For Production Only)

**Best for**: Production deployment

1. Set `API_BASE_URL` to production URL:
   ```typescript
   export const API_BASE_URL = "https://findmypuppydb.onrender.com";
   ```

**Important**: You must configure Google OAuth on the production server (see below)

## Fixing Google OAuth on Production Server

The production server at `https://findmypuppydb.onrender.com` needs Google OAuth configured. 

### Steps to Configure:

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Find your service**: `findmypuppydb`
3. **Go to Environment Variables**
4. **Add/Update these variables**:
   ```
   GOOGLE_CLIENT_ID=432104127842-br66htaeo4khnhpb85vbjmei43etkvkf.apps.googleusercontent.com
   ```
5. **Redeploy** the service

### Verify Production Server Has Google OAuth Endpoint

The production server should have:
- ✅ `/api/auth/google/signin` endpoint
- ✅ `google-auth-library` package installed
- ✅ `GOOGLE_CLIENT_ID` environment variable set

## Recommended Configuration

### For Local Development:
```typescript
// services/db.tsx
export const API_BASE_URL = ""; // Uses Vite proxy to localhost:5774
```

Start servers:
```bash
npm run server  # Runs both frontend and backend
```

### For Production Deployment:
Set environment variable on your hosting platform:
```env
VITE_API_BASE_URL=https://findmypuppydb.onrender.com
```

And configure Google OAuth on Render:
```env
GOOGLE_CLIENT_ID=432104127842-br66htaeo4khnhpb85vbjmei43etkvkf.apps.googleusercontent.com
```

## Summary

1. **Local Development**: Use empty string `""` for API_BASE_URL → Uses Vite proxy → Backend on 5774
2. **Production**: Set `VITE_API_BASE_URL=https://findmypuppydb.onrender.com` → Direct connection
3. **Production Server**: Must have Google OAuth configured (GOOGLE_CLIENT_ID environment variable)

The code is now configured to automatically:
- Use Vite proxy in development (when API_BASE_URL is empty)
- Use production URL in production builds
- Allow override via environment variable

