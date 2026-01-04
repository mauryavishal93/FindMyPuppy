# Google OAuth Setup Guide

This guide explains how to set up Google OAuth authentication for "Sign in with Google" and "Sign up with Google" functionality.

## Prerequisites

1. A Google Cloud Platform (GCP) account
2. Access to Google Cloud Console

## Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. If prompted, configure the OAuth consent screen:
   - Choose **External** user type (unless you have a Google Workspace)
   - Fill in the required information:
     - App name: "Find My Puppy"
     - User support email: Your email
     - Developer contact: Your email
   - Click **Save and Continue**
   - Add scopes: `email`, `profile`, `openid`
   - Add test users (if in testing mode)
   - Click **Save and Continue**
6. Create OAuth Client ID:
   - Application type: **Web application**
   - Name: "Find My Puppy Web Client"
   - Authorized JavaScript origins:
     - `http://localhost:5173` (for development)
     - `https://your-production-domain.com` (for production)
   - Authorized redirect URIs:
     - `http://localhost:5173` (for development)
     - `https://your-production-domain.com` (for production)
   - Click **Create**
7. Copy the **Client ID** (you'll need this)

## Step 2: Configure Environment Variables

### Frontend (Vite)

Create a `.env` file in the root directory:

```env
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here.apps.googleusercontent.com
```

### Backend (Server)

Add to your server environment variables or `.env` file in the `server/` directory:

```env
GOOGLE_CLIENT_ID=your-google-client-id-here.apps.googleusercontent.com
```

**Note:** The Client ID is the same for both frontend and backend, but they use different environment variable names:
- Frontend: `VITE_GOOGLE_CLIENT_ID` (Vite prefix is required)
- Backend: `GOOGLE_CLIENT_ID`

## Step 3: Install Dependencies

The backend dependency has already been added to `server/package.json`. Install it:

```bash
cd server
npm install
```

This will install `google-auth-library` which is used to verify Google ID tokens on the backend.

## Step 4: How It Works

### User Flow

1. **Sign Up with Google:**
   - User clicks "Sign up with Google" button
   - Google OAuth popup appears
   - User selects Google account and grants permissions
   - Google returns an ID token
   - Frontend sends ID token to backend `/api/auth/google/signin`
   - Backend verifies the token and creates a new user account
   - User is automatically logged in

2. **Sign In with Google:**
   - User clicks "Sign in with Google" button
   - Google OAuth popup appears
   - User selects Google account
   - Google returns an ID token
   - Frontend sends ID token to backend `/api/auth/google/signin`
   - Backend verifies the token and finds existing user
   - User is logged in

### Database Schema Changes

The user schema has been updated to support OAuth:
- `googleId`: Unique Google user ID
- `authProvider`: Either `'local'` or `'google'`
- `password`: Now optional (only required for local auth)

### Backend Endpoints

- **POST `/api/auth/google/signin`**
  - Handles both sign-in and sign-up
  - Verifies Google ID token
  - Creates new user if doesn't exist
  - Returns user data on success

### Frontend Integration

- Google Identity Services script loaded in `index.html`
- Google sign-in/sign-up buttons rendered in `LoginView.tsx`
- Buttons automatically switch based on Login/Signup mode
- Handles referral codes for Google sign-ups

## Step 5: Testing

1. Start the backend server:
   ```bash
   npm run server
   ```

2. Start the frontend:
   ```bash
   npm run dev
   ```

3. Navigate to the login page
4. Click "Sign in with Google" or "Sign up with Google"
5. Complete the Google OAuth flow
6. Verify user is created in the database with `authProvider: 'google'`

## Troubleshooting

### "Google OAuth Client ID not configured"
- Make sure `VITE_GOOGLE_CLIENT_ID` is set in your `.env` file
- Restart the Vite dev server after adding environment variables

### "Google OAuth not configured on server"
- Make sure `GOOGLE_CLIENT_ID` is set in server environment
- Restart the backend server

### "Invalid Google token"
- Verify the Client ID matches in both frontend and backend
- Check that the authorized origins/redirects are correct in Google Console

### Button not appearing
- Check browser console for errors
- Verify Google Identity Services script is loaded
- Check that `VITE_GOOGLE_CLIENT_ID` is set correctly

## Security Notes

- The Google Client ID is safe to expose in frontend code (it's public)
- The backend verifies all ID tokens before creating/logging in users
- Never expose the Google Client Secret (not needed for this implementation)
- Always use HTTPS in production

## Production Deployment

1. Update authorized origins in Google Console to include your production domain
2. Set environment variables on your hosting platform:
   - Frontend: `VITE_GOOGLE_CLIENT_ID`
   - Backend: `GOOGLE_CLIENT_ID`
3. Update OAuth consent screen to "Published" status (if using external users)

