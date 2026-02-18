# Forgot Password on Render.com – Checklist

If forgot password works on **localhost** but not after deployment on **Render**, use this checklist.

---

## 1. Backend environment variables (Render Dashboard → Your Web Service → Environment)

Set these on the **service that runs `server/server.js`** (your Node/Express backend):

| Variable | Required | Example | Notes |
|---------|----------|---------|--------|
| **SMTP_USER** | Yes (for email) | `yourname@gmail.com` | Gmail address that sends reset emails |
| **SMTP_PASS** | Yes (for email) | Gmail App Password (16 chars) | **Not** your normal Gmail password. Create at [Google App Passwords](https://myaccount.google.com/apppasswords). |
| **FRONTEND_URL** | Recommended | `https://findmypuppy.onrender.com` | Exact URL where your app is hosted. Used for the reset link in the email. If unset, the server uses a default that may be wrong. |

**Optional (if Gmail blocks port 587 on Render):**

| Variable | Value | Notes |
|----------|--------|--------|
| **SMTP_PORT** | `465` | Often more reliable from cloud IPs |
| **SMTP_SECURE** | `true` | Use with port 465 |

After changing env vars, **redeploy** the service so they take effect.

---

## 2. Frontend API URL (same service or separate)

The client calls `getApiBase()` which uses **VITE_API_BASE_URL** at **build time**.

- **Single service (backend serves the built React app):**  
  The API is on the same origin as the app (e.g. `https://yourservice.onrender.com`).  
  Set **VITE_API_BASE_URL** in Render to that URL (e.g. `https://yourservice.onrender.com` or use **RENDER_EXTERNAL_URL** if you rely on it).  
  Then run `npm run build` (or your build command) **in that environment** so the built JS uses the correct API base.

- **Separate backend service:**  
  Set **VITE_API_BASE_URL** to your backend URL (e.g. `https://findmypuppydb.onrender.com`) when building the frontend.

If **VITE_API_BASE_URL** is not set and the app is built in production mode, the code falls back to `https://findmypuppydb.onrender.com`. If your API is actually at a different URL (e.g. the same Render service as the frontend), forgot-password requests will go to the wrong host and fail.

---

## 3. Verify in Render logs

After deploy, check **Logs** for your service:

1. **Email transporter**  
   Look for: `✅ Email transporter created` or `📧 Email transporter created (verification skipped).`  
   If you see `❌ Email transporter NOT created`, **SMTP_USER** and **SMTP_PASS** are missing or wrong.

2. **Reset link base URL**  
   When running on Render, the server logs the **FRONTEND_URL** it uses for reset links. Confirm it matches your app URL (e.g. `https://findmypuppy.onrender.com`).

3. **When a user submits “Forgot password”**  
   Look for `[FORGOT-PASSWORD] REQUEST RECEIVED` and either success or the specific error (e.g. transporter null, send failure, timeout).

---

## 4. Common issues

| Symptom | Cause | Fix |
|--------|--------|-----|
| “Email service is temporarily unavailable” | Transporter not created (missing/wrong SMTP env) | Set **SMTP_USER** and **SMTP_PASS** (Gmail App Password) and redeploy. |
| “Connection error” / request never hits server | Frontend calling wrong API URL | Set **VITE_API_BASE_URL** to your backend URL and **rebuild** the frontend. |
| Email not received / timeout | Gmail blocking SMTP from Render IPs or port 587 | Set **SMTP_PORT=465** and **SMTP_SECURE=true** and redeploy. |
| Reset link in email goes to wrong site | Wrong or missing FRONTEND_URL | Set **FRONTEND_URL** to your app’s full URL (e.g. `https://findmypuppy.onrender.com`). |

---

## 5. Quick test

1. Open your deployed app (e.g. `https://findmypuppy.onrender.com`).
2. Open browser DevTools → Network.
3. Trigger “Forgot password” and submit an email.
4. Check the request:
   - **URL** should be your backend + `/api/auth/forgot-password` (e.g. `https://yourservice.onrender.com/api/auth/forgot-password`). If it’s a different host, fix **VITE_API_BASE_URL** and rebuild.
   - **Status**: 200 = success (check inbox); 500 often = email not configured or send failed (check Render logs).

Once **SMTP_USER**, **SMTP_PASS**, **FRONTEND_URL**, and (if needed) **VITE_API_BASE_URL** are set correctly and the frontend is rebuilt, forgot password should work on Render.
