# Fix Google OAuth Origin Mismatch Error

## Error: `Error 400: origin_mismatch`

This error occurs when the JavaScript origin where your app is running doesn't match what's registered in Google Cloud Console.

## Solution: Register All JavaScript Origins

You need to add **ALL possible origins** where your app can run to Google Cloud Console.

### Step 1: Go to Google Cloud Console

1. Visit: https://console.cloud.google.com/
2. Select your project: **findmypuppy**
3. Navigate to: **APIs & Services** → **Credentials**
4. Click on your OAuth 2.0 Client ID: `977430971765-k7csafri1sidju96oikgr74ab0l9j4kn.apps.googleusercontent.com`
5. Click **Edit** (pencil icon)

### Step 2: Add ALL JavaScript Origins

In the **Authorized JavaScript origins** section, add **ALL** of these origins:

#### For Local Development:
```
http://localhost:5173
http://127.0.0.1:5173
```

#### For Render Production (HTTP):
```
http://findmypuppy.onrender.com
http://findmypuppydb.onrender.com
```

#### For Render Production (HTTPS) - **REQUIRED**:
```
https://findmypuppy.onrender.com
https://findmypuppydb.onrender.com
```

**Important:** Google requires **HTTPS** for production domains. Make sure you add the `https://` versions!

### Step 3: Add ALL Redirect URIs

In the **Authorized redirect URIs** section, add **ALL** of these:

#### For Local Development:
```
http://localhost:5173
http://localhost:5173/
```

#### For Render Production:
```
https://findmypuppy.onrender.com
https://findmypuppy.onrender.com/
https://findmypuppydb.onrender.com
https://findmypuppydb.onrender.com/
```

### Step 4: Save Changes

1. Click **Save** at the bottom
2. Wait 1-2 minutes for changes to propagate
3. Clear your browser cache or try in incognito mode
4. Test Google Sign-In again

## Complete List of Origins to Add

Copy and paste these into the **Authorized JavaScript origins** field (one per line):

```
http://localhost:5173
http://127.0.0.1:5173
http://findmypuppy.onrender.com
https://findmypuppy.onrender.com
http://findmypuppydb.onrender.com
https://findmypuppydb.onrender.com
```

## Complete List of Redirect URIs to Add

Copy and paste these into the **Authorized redirect URIs** field (one per line):

```
http://localhost:5173
http://localhost:5173/
https://findmypuppy.onrender.com
https://findmypuppy.onrender.com/
https://findmypuppydb.onrender.com
https://findmypuppydb.onrender.com/
```

## Troubleshooting

### Still Getting the Error?

1. **Check the exact URL** where your app is running:
   - Open browser DevTools (F12)
   - Go to Console tab
   - Look for the exact origin in error messages
   - Add that exact origin to Google Cloud Console

2. **Verify HTTPS**: 
   - Render uses HTTPS by default
   - Make sure you added `https://` versions, not just `http://`

3. **Wait for Propagation**:
   - Changes can take 1-5 minutes to propagate
   - Try clearing browser cache
   - Try incognito/private browsing mode

4. **Check Current Origin**:
   - In your browser console, run: `window.location.origin`
   - This shows the exact origin you need to register

5. **Common Mistakes**:
   - ❌ Missing trailing slash `/`
   - ❌ Using `http://` instead of `https://` for production
   - ❌ Wrong port number
   - ❌ Typo in domain name

## Quick Check

After adding origins, verify by:
1. Opening your app
2. Opening browser DevTools (F12)
3. Going to Network tab
4. Trying Google Sign-In
5. Check the failed request - it will show the exact origin that failed

## Additional Notes

- **Local Development**: Use `http://localhost:5173` (no HTTPS needed)
- **Production**: Must use `https://` (Google requirement)
- **Render**: Automatically provides HTTPS, so always use `https://` for Render domains
- **Port Numbers**: Must match exactly (e.g., `:5173` for Vite dev server)

## Still Having Issues?

If you're still getting the error after adding all origins:

1. Check the browser console for the exact error message
2. Note the exact origin shown in the error
3. Make sure that exact origin (with protocol, domain, and port) is in Google Cloud Console
4. Wait 2-3 minutes after saving
5. Try in a different browser or incognito mode
