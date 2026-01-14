# Google Sign-In Feature - Required Files

This document lists all the files needed for Google OAuth sign-in functionality in the FindMyPuppy application.

## 📁 Core Implementation Files

### 1. **Frontend Files**

#### `index.html`
- **Purpose**: Loads Google Identity Services script
- **Location**: Root directory
- **Key Code**:
  ```html
  <!-- Google Identity Services -->
  <script src="https://accounts.google.com/gsi/client" async defer></script>
  ```
- **Required**: ✅ Yes

#### `views/LoginView.tsx`
- **Purpose**: Main login/signup component with Google OAuth integration
- **Location**: `views/LoginView.tsx`
- **Key Features**:
  - Google Sign-In button rendering
  - Google OAuth callback handling
  - Error handling for Google authentication
  - Environment variable reading (`VITE_GOOGLE_CLIENT_ID`)
- **Required**: ✅ Yes

#### `services/db.tsx`
- **Purpose**: API service layer for Google sign-in
- **Location**: `services/db.tsx`
- **Key Function**: `signInWithGoogle(idToken, referralCode)`
- **Endpoint**: `POST /api/auth/google/signin`
- **Required**: ✅ Yes

### 2. **Backend Files**

#### `server/server.js`
- **Purpose**: Express.js backend server with Google OAuth endpoint
- **Location**: `server/server.js`
- **Key Sections**:
  - **Google OAuth Configuration** (lines ~39-46):
    ```javascript
    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
    const googleClient = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null;
    ```
  - **Google OAuth Sign-In Endpoint** (lines ~1233-1384):
    - Route: `POST /api/auth/google/signin`
    - Verifies Google ID token
    - Creates new users or signs in existing users
    - Handles referral codes
- **Required**: ✅ Yes

#### `server/package.json`
- **Purpose**: Backend dependencies
- **Location**: `server/package.json`
- **Required Package**: `google-auth-library` (^9.0.0)
- **Required**: ✅ Yes

### 3. **Configuration Files**

#### `.env` (Root Directory)
- **Purpose**: Environment variables for Google OAuth
- **Location**: Root directory (not committed to git)
- **Required Variables**:
  ```env
  # Frontend (Vite)
  VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
  
  # Backend (Server)
  GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
  GOOGLE_CLIENT_SECRET=your-client-secret
  ```
- **Required**: ✅ Yes (create locally)

#### `package.json` (Root Directory)
- **Purpose**: Frontend dependencies
- **Location**: Root directory
- **Note**: No Google-specific packages needed (uses CDN script)
- **Required**: ✅ Yes

### 4. **Database Schema**

#### `server/server.js` - User Model
- **Purpose**: MongoDB schema with Google OAuth fields
- **Location**: `server/server.js` (User schema)
- **Required Fields**:
  ```javascript
  googleId: { type: String, unique: true, sparse: true },
  authProvider: { type: String, enum: ['local', 'google'] },
  email: { type: String, required: true, unique: true },
  ```
- **Required**: ✅ Yes (already in User schema)

## 📚 Documentation Files (Optional but Recommended)

### `GOOGLE_OAUTH_UPDATE.md`
- **Purpose**: Setup instructions for Google OAuth
- **Location**: Root directory
- **Required**: ⚠️ Recommended

### `FIX_OAUTH_ORIGIN_MISMATCH.md`
- **Purpose**: Troubleshooting guide for origin mismatch errors
- **Location**: Root directory
- **Required**: ⚠️ Recommended

### `setup-google-oauth.sh`
- **Purpose**: Automated script to set up Google OAuth credentials
- **Location**: Root directory
- **Required**: ⚠️ Optional (helper script)

## 🔧 Setup Requirements

### 1. **Google Cloud Console Configuration**
- Create OAuth 2.0 Client ID
- Configure Authorized JavaScript origins
- Configure Authorized redirect URIs
- Get Client ID and Client Secret

### 2. **Environment Variables**
Set these in your `.env` file:
```env
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
```

### 3. **Google Cloud Console Origins**
Add these JavaScript origins:
- `http://localhost:5173` (development)
- `https://findmypuppy.onrender.com` (production)
- `https://findmypuppydb.onrender.com` (production)

## 📋 File Checklist

### ✅ Required Files (Must Have)
- [x] `index.html` - Google script loading
- [x] `views/LoginView.tsx` - Frontend Google OAuth UI
- [x] `services/db.tsx` - API service layer
- [x] `server/server.js` - Backend OAuth endpoint
- [x] `server/package.json` - Backend dependencies
- [x] `.env` - Environment variables (create locally)
- [x] `package.json` - Frontend dependencies

### ⚠️ Recommended Files (Helpful)
- [ ] `GOOGLE_OAUTH_UPDATE.md` - Setup guide
- [ ] `FIX_OAUTH_ORIGIN_MISMATCH.md` - Troubleshooting
- [ ] `setup-google-oauth.sh` - Setup script

## 🔄 Data Flow

1. **User clicks Google Sign-In button** → `LoginView.tsx`
2. **Google Identity Services** → Authenticates user
3. **Callback receives ID token** → `handleGoogleSignIn()` in `LoginView.tsx`
4. **Frontend sends token** → `db.signInWithGoogle()` in `services/db.tsx`
5. **API request** → `POST /api/auth/google/signin` in `server/server.js`
6. **Backend verifies token** → Uses `google-auth-library`
7. **User created/logged in** → MongoDB User model updated
8. **Response sent back** → User data returned to frontend

## 🚀 Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   cd server && npm install
   ```

2. **Set up Google OAuth**:
   - Run `./setup-google-oauth.sh` OR
   - Manually add credentials to `.env` file

3. **Configure Google Cloud Console**:
   - Add JavaScript origins
   - Add redirect URIs
   - See `GOOGLE_OAUTH_UPDATE.md` for details

4. **Start servers**:
   ```bash
   # Terminal 1: Frontend
   npm run dev
   
   # Terminal 2: Backend
   cd server && npm start
   ```

## 🔍 Verification

After setup, check:
- ✅ Server logs show: `🔐 Google OAuth Initialized with Client ID: ...`
- ✅ Google Sign-In button appears on login page
- ✅ Clicking button opens Google sign-in popup
- ✅ After authentication, user is logged in

## 📝 Notes

- **Client Secret**: Not required for ID token verification, but good to have configured
- **Environment Variables**: Never commit `.env` file to git
- **HTTPS Required**: Production domains must use HTTPS
- **CORS**: Backend must allow frontend origin in CORS settings
