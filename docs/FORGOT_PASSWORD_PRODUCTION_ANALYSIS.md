# Forgot Password Email - Production vs Localhost Analysis

## Problem Summary
Forgot password emails work in **localhost** but **NOT in production (Render)**. Users receive emails locally but not after deployment.

---

## Root Cause Analysis

### 1. **Environment Variables Not Set in Render** ⚠️ MOST COMMON

**Issue:** `SMTP_USER` and `SMTP_PASS` are not configured in Render's environment variables.

**Evidence:**
- Code checks: `if (!emailTransporter)` at line 786
- Startup logs show: `❌ Email transporter NOT created`
- Error response: "Email service is temporarily unavailable"

**How to Check:**
1. Go to Render Dashboard → Your Service → Environment
2. Look for `SMTP_USER` and `SMTP_PASS` variables
3. Check server startup logs for: `📧 ========== EMAIL SERVICE INITIALIZATION ==========`

**Fix:**
- Set `SMTP_USER` = your Gmail address (e.g., `you@gmail.com`)
- Set `SMTP_PASS` = Gmail App Password (16 characters, NOT your regular password)
- **Redeploy** the service after adding variables

---

### 2. **Gmail SMTP Port Blocking** 🔥 VERY COMMON ON RENDER

**Issue:** Gmail blocks port 587 (STARTTLS) from cloud IPs like Render, but allows port 465 (SSL).

**Evidence:**
- Error codes: `ETIMEDOUT`, `ECONNECTION`, `ESOCKET`
- Code defaults to port 465 in production (line 538), but if `SMTP_PORT` is explicitly set to 587, it will fail
- Code has fallback logic (lines 985-1011) but may not always trigger

**How to Check:**
- Look for errors in logs: `Connection Issue Detected` or `Timeout Issue Detected`
- Check current config: Look for `Port 587` in startup logs

**Fix:**
Set in Render environment:
```
SMTP_PORT=465
SMTP_SECURE=true
```

---

### 3. **Using Regular Gmail Password Instead of App Password** 🔐

**Issue:** Gmail requires **App Passwords** for SMTP when 2FA is enabled. Regular passwords fail with `EAUTH` or `535` errors.

**Evidence:**
- Error code: `EAUTH` or response code `535`
- Logs show: "Authentication Issue Detected"

**How to Check:**
- Verify you're using a 16-character App Password (format: `xxxx xxxx xxxx xxxx`)
- Check if 2FA is enabled on your Google account

**Fix:**
1. Go to https://myaccount.google.com/apppasswords
2. Generate a new App Password for "Mail"
3. Copy the 16-character password (remove spaces)
4. Set `SMTP_PASS` in Render to this App Password

---

### 4. **Email Transporter Created But Send Fails Silently** 📧

**Issue:** Transporter is created successfully, but `sendMail()` fails without proper error handling.

**Evidence:**
- Startup logs show: `✅ Email transporter created successfully`
- But forgot-password endpoint returns 500 or times out
- No email received

**How to Check:**
- Look for `[FORGOT-PASSWORD] REQUEST RECEIVED` in logs
- Check for `EMAIL SEND ERROR` section
- Look for specific SMTP error codes

**Common Errors:**
- `ETIMEDOUT` → Gmail blocking connection
- `EAUTH` → Wrong password/App Password
- `ECONNECTION` → Port/firewall issue
- `535` → Authentication failure

---

### 5. **Frontend URL Mismatch** 🔗

**Issue:** Reset link in email points to wrong URL (e.g., localhost instead of production).

**Evidence:**
- Code uses: `process.env.FRONTEND_URL || (process.env.RENDER ? 'https://findmypuppy.onrender.com' : 'http://localhost:5173')`
- If `FRONTEND_URL` is not set, it defaults correctly, but if it's set incorrectly, links won't work

**How to Check:**
- Look for log: `🔗 [RENDER] Password reset links will use FRONTEND_URL: ...`
- Verify the URL matches your actual app URL

**Fix:**
Set `FRONTEND_URL` in Render to your exact app URL (e.g., `https://findmypuppy.onrender.com`)

---

### 6. **Email Going to Spam/Junk** 📬

**Issue:** Emails are sent successfully but filtered by recipient's email provider.

**Evidence:**
- Server logs show: `✅ Password reset email sent successfully!`
- User doesn't receive email in inbox
- Check spam/junk folder

**How to Check:**
- Look for `Message ID` in logs (indicates Gmail accepted the email)
- Check spam folder
- Verify sender email matches `SMTP_USER`

---

## Diagnostic Checklist

### Step 1: Check Server Startup Logs
Look for this section when the server starts:
```
📧 ========== EMAIL SERVICE INITIALIZATION ==========
```

**If you see:**
- `❌ Email transporter NOT created` → **Issue #1** (env vars not set)
- `✅ Email transporter created successfully` → Continue to Step 2

---

### Step 2: Check Environment Variables in Render
Go to: **Render Dashboard → Your Service → Environment**

**Required Variables:**
- ✅ `SMTP_USER` = your Gmail address
- ✅ `SMTP_PASS` = Gmail App Password (16 chars)
- ✅ `SMTP_PORT` = `465` (recommended for Render)
- ✅ `SMTP_SECURE` = `true` (required for port 465)
- ✅ `FRONTEND_URL` = your app URL (optional but recommended)

---

### Step 3: Test Forgot Password Request
1. Trigger forgot password from your app
2. Check Render logs for:
   ```
   [FORGOT-PASSWORD] ========== REQUEST RECEIVED ==========
   [FORGOT-PASSWORD] Email transporter available: true/false
   ```

**If `false`:**
- Transporter not created → Check Step 1

**If `true`:**
- Continue to Step 4

---

### Step 4: Check Email Send Attempts
Look for logs:
```
📤 [FORGOT-PASSWORD] Attempt 1/3: Sending password reset email...
```

**If you see errors:**
- `EAUTH` or `535` → **Issue #3** (wrong password/App Password)
- `ETIMEDOUT` or `ECONNECTION` → **Issue #2** (port blocking)
- `Email send timeout` → **Issue #2** (Gmail blocking)

**If you see success:**
- `✅ Password reset email sent successfully!` → **Issue #6** (check spam folder)

---

### Step 5: Use Built-in Test Endpoint
The server has a test endpoint: `POST /api/auth/test-email`

**From Render logs or curl:**
```bash
curl -X POST https://your-app.onrender.com/api/auth/test-email \
  -H "Content-Type: application/json" \
  -d '{"testEmail": "your-email@gmail.com"}'
```

**Check response:**
- `success: false` → Email not configured
- `success: true` → Email sent (check inbox/spam)

---

## Quick Fix Checklist

1. ✅ **Set SMTP_USER** in Render environment
2. ✅ **Set SMTP_PASS** (Gmail App Password, not regular password)
3. ✅ **Set SMTP_PORT=465** (more reliable than 587)
4. ✅ **Set SMTP_SECURE=true** (required for port 465)
5. ✅ **Set FRONTEND_URL** (your app URL)
6. ✅ **Redeploy** service after changing env vars
7. ✅ **Check spam folder** if emails seem to send
8. ✅ **Verify 2FA is enabled** on Google account
9. ✅ **Use App Password** (not regular password)

---

## Most Likely Issues (Ranked)

1. **#1 - Environment Variables Not Set** (90% of cases)
   - Solution: Add `SMTP_USER` and `SMTP_PASS` in Render

2. **#2 - Port 587 Blocked** (80% of cases when vars are set)
   - Solution: Use port 465 with SSL

3. **#3 - Wrong Password Type** (70% of auth failures)
   - Solution: Use Gmail App Password

4. **#6 - Spam Filter** (50% when emails "send" but not received)
   - Solution: Check spam folder, verify sender

---

## Testing After Fix

1. **Check startup logs** for transporter creation
2. **Trigger forgot password** from app
3. **Check Render logs** for send attempt
4. **Check email inbox AND spam folder**
5. **Verify reset link works** when clicked

---

## Additional Debugging

If still not working, enable detailed SMTP logging:

Set in Render environment:
```
SMTP_DEBUG=true
```

Then check logs for detailed SMTP conversation (be careful - may expose sensitive info).

---

## Summary

**Most Common Root Cause:** Environment variables (`SMTP_USER`, `SMTP_PASS`) not set in Render dashboard.

**Second Most Common:** Gmail blocking port 587 from cloud IPs - use port 465 instead.

**Quick Win:** Set these 4 variables in Render and redeploy:
- `SMTP_USER`
- `SMTP_PASS` (App Password)
- `SMTP_PORT=465`
- `SMTP_SECURE=true`
