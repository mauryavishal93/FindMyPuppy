# Google OAuth Configuration Update

## Credentials Required

You need to obtain Google OAuth credentials from Google Cloud Console:

- **Client ID**: Get from Google Cloud Console → Credentials
- **Client Secret**: Get from Google Cloud Console → Credentials
- **Project ID**: `findmypuppy`

**⚠️ IMPORTANT:** Never commit actual credentials to git. Store them only in `.env` file or environment variables.

## Redirect URIs Configured

**IMPORTANT:** You must add **ALL** of these redirect URIs in Google Cloud Console:

### Local Development:
- `http://localhost:5173`
- `http://localhost:5173/`

### Production (HTTPS) - **REQUIRED**:
- `https://findmypuppy.onrender.com` ⚠️ **MUST ADD THIS**
- `https://findmypuppy.onrender.com/` ⚠️ **MUST ADD THIS**
- `https://findmypuppydb.onrender.com` ⚠️ **MUST ADD THIS**
- `https://findmypuppydb.onrender.com/` ⚠️ **MUST ADD THIS**

**Note:** Google requires HTTPS for production redirect URIs!

## JavaScript Origins Configured

**IMPORTANT:** You must add **ALL** of these origins in Google Cloud Console:

### Local Development:
- `http://localhost:5173`
- `http://127.0.0.1:5173`

### Production (HTTP):
- `http://findmypuppy.onrender.com`
- `http://findmypuppydb.onrender.com`

### Production (HTTPS) - **REQUIRED**:
- `https://findmypuppy.onrender.com` ⚠️ **MUST ADD THIS**
- `https://findmypuppydb.onrender.com` ⚠️ **MUST ADD THIS**

**Note:** Google requires HTTPS for production. Make sure you add the `https://` versions!

## Setup Instructions

### 1. Update Your `.env` File

Add the following variables to your `.env` file in the root directory:

```env
# Google OAuth Configuration
# Replace with your actual credentials from Google Cloud Console
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

### 2. For Render Deployment

Add these environment variables in your Render dashboard:

1. Go to your Render service dashboard
2. Navigate to **Environment** tab
3. Add the following variables (replace with your actual credentials):
   - `GOOGLE_CLIENT_ID` = `your-client-id.apps.googleusercontent.com`
   - `GOOGLE_CLIENT_SECRET` = `your-client-secret`
   - `VITE_GOOGLE_CLIENT_ID` = `your-client-id.apps.googleusercontent.com`

### 3. Restart Your Server

After updating the environment variables:

1. **Local Development**: Restart your dev server
   ```bash
   npm run dev
   ```

2. **Render Deployment**: The service will automatically restart after you save the environment variables

## Verification

After setup, you should see in your server logs:

```
🔐 Google OAuth Initialized with Client ID: your-client-id...
```

If you see a warning instead, check that:
- The `.env` file exists in the root directory
- The `GOOGLE_CLIENT_ID` variable is set correctly
- You've restarted the server after updating the `.env` file

## Frontend Configuration

The frontend automatically reads `VITE_GOOGLE_CLIENT_ID` from the environment. Make sure this variable is set in your `.env` file for local development, or in your deployment platform's environment variables.

## ⚠️ IMPORTANT: Fix Origin Mismatch Error

If you see `Error 400: origin_mismatch`, you need to add **HTTPS origins** to Google Cloud Console!

**See `FIX_OAUTH_ORIGIN_MISMATCH.md` for detailed instructions.**

Quick fix:
1. Go to Google Cloud Console → Credentials → Your OAuth Client
2. Add these JavaScript origins:
   - `https://findmypuppy.onrender.com` ⚠️ **REQUIRED**
   - `https://findmypuppydb.onrender.com` ⚠️ **REQUIRED**
3. Add these redirect URIs:
   - `https://findmypuppy.onrender.com` ⚠️ **REQUIRED**
   - `https://findmypuppy.onrender.com/` ⚠️ **REQUIRED**
4. Save and wait 1-2 minutes

## Security Notes

- Never commit your `.env` file to git (it's already in `.gitignore`)
- Keep your `GOOGLE_CLIENT_SECRET` secure
- The client secret is not required for ID token verification (current implementation), but it's good to have it configured for future use
