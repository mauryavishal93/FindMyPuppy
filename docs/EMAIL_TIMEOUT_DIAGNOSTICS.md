# Email Timeout Diagnostics - Enhanced Logging

## Issue
Logs show email send attempt starts but cuts off without showing success or error:
```
📤 [FORGOT-PASSWORD] Attempt 1/3: Sending password reset email...
   [EMAIL-SEND] Timeout set to 120000ms (PRODUCTION)
   Mail options prepared: from="...", to="..."
```

## Enhanced Logging Added

The code now logs more detailed information to help diagnose timeout issues:

### 1. SMTP Configuration Logged
Before each send attempt, you'll see:
```
[SMTP-CONFIG] Port: 587, Secure: false, Host: smtp.gmail.com
⚠️  [SMTP-CONFIG] WARNING: Using port 587 in production - Gmail may block this from Render IPs
⚠️  [SMTP-CONFIG] RECOMMENDATION: Set SMTP_PORT=465 and SMTP_SECURE=true in Render
```

### 2. Detailed Send Process Logging
```
[EMAIL-SEND] SMTP Config: Host=smtp.gmail.com, Port=587, Secure=false
[EMAIL-SEND] Starting sendMail() at 2026-01-28T...
[EMAIL-SEND] sendMail promise created, waiting for response...
```

### 3. Timeout Detection
If timeout occurs:
```
⏱️  [EMAIL-SEND] TIMEOUT triggered after 120 seconds
⏱️  [EMAIL-SEND] This usually means Gmail SMTP is blocking the connection
```

### 4. Error Details on Retry
```
⚠️  Connection/timeout error on attempt 1/3
   Error Code: ETIMEDOUT
   Error Message: Email send timeout after 120 seconds
   💡 SUGGESTION: Port 587 is likely blocked by Gmail from Render
   💡 Set SMTP_PORT=465 and SMTP_SECURE=true in Render environment
```

## What to Check in Logs

### If You See Timeout:
1. **Check SMTP Port:**
   - Look for `[SMTP-CONFIG] Port: 587`
   - If port is 587 → **This is likely the problem**

2. **Check for Warnings:**
   - Look for `⚠️  WARNING: Using port 587 in production`
   - This confirms Gmail is likely blocking

3. **Check Error Code:**
   - `ETIMEDOUT` → Connection timeout
   - `ECONNECTION` → Connection refused
   - `ESOCKET` → Socket error

## Immediate Fix

If you see port 587 in logs:

1. **Go to Render Dashboard → Your Service → Environment**
2. **Add/Update:**
   ```
   SMTP_PORT=465
   SMTP_SECURE=true
   ```
3. **Redeploy** the service
4. **Test again** - logs should now show:
   ```
   [SMTP-CONFIG] Port: 465, Secure: true
   ```

## Expected Success Logs

After fix, you should see:
```
📤 [FORGOT-PASSWORD] Attempt 1/3: Sending password reset email...
[SMTP-CONFIG] Port: 465, Secure: true
[EMAIL-SEND] Starting sendMail()...
✅ [EMAIL-SEND] Email send completed successfully in 2500ms
✅ Password reset email sent successfully!
   Message ID: <...>
   Response: 250 2.0.0 OK ...
```

## Why Port 587 Fails on Render

- Gmail often blocks port 587 (STARTTLS) from cloud IP addresses
- Port 465 (SSL) is more reliable from cloud platforms
- Render's IP addresses may be flagged by Gmail's security

## Next Steps

1. **Check your current logs** for the new detailed output
2. **Look for port number** in `[SMTP-CONFIG]` line
3. **If port is 587** → Add `SMTP_PORT=465` and `SMTP_SECURE=true` to Render
4. **Redeploy and test again**

The enhanced logging will now show exactly what's happening during the email send process.
