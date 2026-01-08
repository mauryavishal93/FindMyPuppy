# Email Setup Guide - Find My Puppy

## Quick Setup

To enable email functionality for password reset, you need to configure SMTP settings in your environment variables.

### Step 1: Create or Update `.env` File

Create a `.env` file in the root directory of your project (if it doesn't exist) and add the following:

```env
# Email Configuration (Required for password reset emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=findmypuppys@gmail.com
SMTP_PASS=your-app-password-here

# Frontend URL (for reset link)
FRONTEND_URL=http://localhost:5173
# For production: FRONTEND_URL=https://yourdomain.com
```

### Step 2: Gmail App Password Setup

Since you're using `findmypuppys@gmail.com`, follow these steps:

1. **Enable 2-Factor Authentication** on your Gmail account
   - Go to: https://myaccount.google.com/security
   - Enable "2-Step Verification" if not already enabled

2. **Generate App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Or: Google Account → Security → 2-Step Verification → App passwords
   - Select "Mail" as the app
   - Select "Other (Custom name)" as device, enter "Find My Puppy Server"
   - Click "Generate"
   - Copy the 16-character password (it will look like: `abcd efgh ijkl mnop`)

3. **Add to `.env` file**:
   ```env
   SMTP_PASS=abcdefghijklmnop
   ```
   (Remove spaces from the app password)

### Step 3: Restart Server

After updating the `.env` file, restart your server:

```bash
npm run server
```

You should see:
```
✅ Email service verified and ready
   SMTP Host: smtp.gmail.com:587
   From Email: findmypuppys@gmail.com
```

### Step 4: Test Email Service

You can test the email service using the test endpoint:

```bash
curl -X POST http://localhost:5774/api/auth/test-email \
  -H "Content-Type: application/json" \
  -d '{"testEmail": "findmypuppys@gmail.com"}'
```

Or check email status:
```bash
curl http://localhost:5774/api/auth/email-status
```

## Troubleshooting

### Email Not Sending

1. **Check Server Logs**: Look for error messages when requesting password reset
   - ✅ Success: `Password reset email sent successfully!`
   - ❌ Error: Check the error message for details

2. **Verify Environment Variables**:
   ```bash
   # Check if variables are loaded
   node -e "require('dotenv').config(); console.log('SMTP_USER:', process.env.SMTP_USER); console.log('SMTP_PASS:', process.env.SMTP_PASS ? 'SET' : 'NOT SET');"
   ```

3. **Common Issues**:
   - **"Invalid login"**: App password is incorrect or expired
   - **"Connection timeout"**: Check firewall/network settings
   - **"Authentication failed"**: Verify 2FA is enabled and app password is correct
   - **"Email service not configured"**: SMTP_USER or SMTP_PASS not set

4. **Check Email Spam Folder**: Sometimes emails go to spam initially

### Alternative Email Providers

#### Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

#### Yahoo
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@yahoo.com
SMTP_PASS=your-app-password
```

## Verification

After setup, when a user requests password reset:

1. Check server console for:
   ```
   ✅ Password reset email sent successfully!
      Message ID: <message-id>
      To: user@example.com
      From: findmypuppys@gmail.com
   ```

2. User should receive email in their inbox (check spam if not in inbox)

3. Email contains a reset link that expires in 1 hour

## Production Deployment

For production:

1. Set environment variables on your hosting platform (Render, Heroku, Railway, etc.)
2. Update `FRONTEND_URL` to your production domain
3. Use secure SMTP (port 465 with `SMTP_SECURE=true`) if supported:
   ```env
   SMTP_PORT=465
   SMTP_SECURE=true
   ```

---

**Need Help?** Check server logs for detailed error messages. The improved logging will show exactly what's wrong with email sending.

