# Google OAuth Setup - Step by Step Guide

## Step 1: Go to Google Cloud Console

1. Open your browser and go to: https://console.cloud.google.com/
2. Sign in with your Google account

## Step 2: Create or Select a Project

1. At the top of the page, click on the project dropdown (it might say "Select a project" or show your current project)
2. Click **"NEW PROJECT"** button
3. Enter project name: `FindMyPuppy` (or any name you prefer)
4. Click **"CREATE"**
5. Wait for the project to be created (a few seconds)
6. Select the newly created project from the dropdown

## Step 3: Enable Google+ API (if needed)

1. In the left sidebar, click **"APIs & Services"** > **"Library"**
2. Search for "Google+ API" or "Google Identity Services"
3. Actually, for OAuth 2.0, you might not need to enable any API - the Identity Services API is enabled by default
4. Skip this step if you don't see it - we'll proceed directly to credentials

## Step 4: Configure OAuth Consent Screen

1. In the left sidebar, click **"APIs & Services"** > **"OAuth consent screen"**
2. Select **"External"** (unless you have a Google Workspace account)
3. Click **"CREATE"**

**OAuth Consent Screen Configuration:**

4. **App information:**
   - App name: `Find My Puppy`
   - User support email: Select your email from the dropdown
   - App logo: (Optional - you can skip this)

5. Click **"SAVE AND CONTINUE"**

6. **Scopes:**
   - Click **"ADD OR REMOVE SCOPES"**
   - You should see scopes already added. The default ones are usually fine:
     - `.../auth/userinfo.email`
     - `.../auth/userinfo.profile`
     - `openid`
   - Click **"UPDATE"**
   - Click **"SAVE AND CONTINUE"**

7. **Test users** (if your app is in testing mode):
   - Click **"ADD USERS"**
   - Add your Google email address
   - Click **"ADD"**
   - Click **"SAVE AND CONTINUE"**

8. **Summary:**
   - Review the information
   - Click **"BACK TO DASHBOARD"**

## Step 5: Create OAuth 2.0 Client ID

1. In the left sidebar, click **"APIs & Services"** > **"Credentials"**

2. Click **"+ CREATE CREDENTIALS"** at the top

3. Select **"OAuth client ID"**

4. If prompted to configure consent screen, follow Step 4 above first, then come back here

5. **Application type:** Select **"Web application"**

6. **Name:** `Find My Puppy Web Client`

7. **Authorized JavaScript origins:**
   - Click **"+ ADD URI"**
   - Add: `http://localhost:5173` (for development)
   - If deploying to production, also add: `https://your-production-domain.com`

8. **Authorized redirect URIs:**
   - Click **"+ ADD URI"**
   - Add: `http://localhost:5173` (for development)
   - For production: `https://your-production-domain.com`
   - Note: Google Identity Services doesn't always require redirect URIs, but add them just in case

9. Click **"CREATE"**

10. **Copy the Client ID:**
    - A popup will appear showing your Client ID
    - It will look like: `123456789-abcdefghijklmnop.apps.googleusercontent.com`
    - **COPY THIS CLIENT ID** - you'll need it in the next step
    - Click **"OK"**

## Step 6: Configure Your Application

Now you need to add the Client ID to your application's environment variables.

1. Go back to your project directory: `/Users/mauryavishal/Project/FindMyPuppy`

2. Create a `.env` file in the root directory (same level as `package.json`)

3. Add the following line:
   ```
   VITE_GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
   ```
   Replace `your-client-id-here.apps.googleusercontent.com` with the Client ID you copied in Step 5.

4. **Important:** Make sure `.env` is in your `.gitignore` file (it should be already)

## Step 7: Configure Backend (Server)

The backend also needs the Client ID to verify tokens. Add it to your server environment:

1. If you have a `.env` file in the `server/` directory, add:
   ```
   GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
   ```
   (Same Client ID as frontend)

2. Or set it as an environment variable when running the server

## Step 8: Restart Your Development Server

1. **Stop** your current Vite dev server (press `Ctrl+C` in the terminal)

2. **Restart** the Vite dev server:
   ```bash
   npm run dev
   ```

3. The Google buttons should now appear!

## Verification

1. Open your app in the browser: `http://localhost:5173`
2. Navigate to the login/signup screen
3. You should see:
   - The "OR" divider
   - **"Sign in with Google"** button (on login screen)
   - **"Sign up with Google"** button (on signup screen)

## Troubleshooting

### "Google OAuth Client ID not configured" message
- Make sure you created the `.env` file in the root directory
- Check that the file contains: `VITE_GOOGLE_CLIENT_ID=your-client-id`
- Restart the Vite dev server after creating/updating `.env`
- Make sure there are no spaces around the `=` sign

### Buttons not appearing
- Open browser console (F12) and check for errors
- Verify the Google Identity Services script is loading
- Check that your Client ID is correct
- Make sure you restarted the dev server after adding the `.env` file

### "Error 400: redirect_uri_mismatch"
- Make sure you added `http://localhost:5173` to Authorized JavaScript origins
- Make sure you added `http://localhost:5173` to Authorized redirect URIs
- Wait a few minutes after making changes (Google sometimes takes time to propagate)

### OAuth consent screen issues
- Make sure you completed the OAuth consent screen setup
- If in testing mode, make sure you added your email as a test user

## Next Steps

Once configured, users will be able to:
1. Click "Sign in with Google" or "Sign up with Google"
2. Select their Google account
3. Grant permissions
4. Be automatically logged in or have their account created

The system will automatically:
- Create a username from their Google name/email
- Store their Google ID for future logins
- Handle referral codes if provided
- Create user records in the database

