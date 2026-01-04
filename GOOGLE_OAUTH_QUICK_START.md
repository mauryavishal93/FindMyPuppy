# Google OAuth - Quick Start

## ✅ Good News!

Your Google OAuth Client ID is already configured in `.env.local`:
```
VITE_GOOGLE_CLIENT_ID=432104127842-br66htaeo4khnhpb85vbjmei43etkvkf.apps.googleusercontent.com
```

## 🚀 Next Steps

**1. Restart Your Development Server**

The environment variables are only loaded when the server starts. You need to restart Vite:

```bash
# Stop the current server (press Ctrl+C in the terminal where npm run dev is running)
# Then restart it:
npm run dev
```

**2. Check the Browser**

1. Open your app: `http://localhost:5173`
2. Navigate to the login/signup screen
3. You should now see:
   - "Sign in with Google" button (on login screen)
   - "Sign up with Google" button (on signup screen)

**3. Test Google Sign In/Up**

1. Click "Sign in with Google" or "Sign up with Google"
2. Select your Google account
3. Grant permissions
4. You should be logged in!

## ⚠️ If Buttons Still Don't Appear

1. **Check Browser Console** (F12):
   - Look for any errors related to Google OAuth
   - Check if `window.google` is defined

2. **Verify Environment Variable**:
   ```bash
   # In the terminal, check:
   cat .env.local | grep VITE_GOOGLE_CLIENT_ID
   ```
   Should show: `VITE_GOOGLE_CLIENT_ID=432104127842-br66htaeo4khnhpb85vbjmei43etkvkf.apps.googleusercontent.com`

3. **Hard Refresh Browser**:
   - Press `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
   - Or clear browser cache

4. **Check Google Console Settings**:
   - Go to: https://console.cloud.google.com/apis/credentials
   - Verify your OAuth Client ID has:
     - **Authorized JavaScript origins**: `http://localhost:5173`
     - **Authorized redirect URIs**: `http://localhost:5173`

## 🔧 Backend Configuration

If you want Google OAuth to work with the backend (for token verification), also add the Client ID to your server environment:

**Option 1: Server .env file** (if you have one in `server/` directory):
```
GOOGLE_CLIENT_ID=432104127842-br66htaeo4khnhpb85vbjmei43etkvkf.apps.googleusercontent.com
```

**Option 2: Environment variable when running server**:
```bash
GOOGLE_CLIENT_ID=432104127842-br66htaeo4khnhpb85vbjmei43etkvkf.apps.googleusercontent.com npm run server
```

## 📝 Notes

- The Client ID is the same for both frontend and backend
- Frontend uses: `VITE_GOOGLE_CLIENT_ID` (Vite prefix required)
- Backend uses: `GOOGLE_CLIENT_ID` (no prefix)

## 🎉 You're All Set!

Once you restart the dev server, the Google sign-in/sign-up buttons should appear and work perfectly!

