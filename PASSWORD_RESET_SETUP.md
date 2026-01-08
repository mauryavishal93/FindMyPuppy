# Password Reset Feature Setup Guide

## Overview
The Forgot Password feature allows users to reset their password via email. When a user requests a password reset, they receive an email with a secure link to reset their password.

## Features
- ✅ "Forgot Password?" link on login screen
- ✅ Email with secure reset link
- ✅ Password reset token (expires in 1 hour)
- ✅ Secure password reset page
- ✅ Works with both local and Google OAuth accounts

## Email Configuration

### Environment Variables Required

Add these to your `.env` file in the root directory:

```env
# Email Configuration (for password reset)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Frontend URL (for reset link)
FRONTEND_URL=http://localhost:5173
# For production: FRONTEND_URL=https://yourdomain.com
```

### Gmail Setup (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account → Security
   - Under "2-Step Verification", click "App passwords"
   - Generate a new app password for "Mail"
   - Copy the 16-character password
3. **Set in `.env`**:
   ```env
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-16-char-app-password
   ```

### Other Email Providers

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

#### Custom SMTP
```env
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@domain.com
SMTP_PASS=your-password
```

## Installation

1. **Install nodemailer** (already added to package.json):
   ```bash
   npm install
   ```

2. **Configure environment variables** in `.env` file

3. **Restart the server**:
   ```bash
   npm run server
   ```

## How It Works

### User Flow

1. User clicks "Forgot Password?" on login screen
2. User enters their email address
3. System sends email with reset link (if email exists)
4. User clicks link in email
5. User enters new password
6. Password is reset and user can login

### Security Features

- ✅ Reset tokens expire in 1 hour
- ✅ Tokens are cryptographically secure (32-byte random)
- ✅ Tokens are single-use (cleared after use)
- ✅ Email validation before sending
- ✅ Password strength validation (minimum 6 characters)
- ✅ Doesn't reveal if email exists (security best practice)

## API Endpoints

### POST `/api/auth/forgot-password`
Request password reset email.

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "If an account with that email exists, a password reset link has been sent."
}
```

### POST `/api/auth/reset-password`
Reset password with token.

**Request:**
```json
{
  "token": "reset-token-from-email",
  "newPassword": "newSecurePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password has been reset successfully. You can now login with your new password."
}
```

## Testing

### Without Email Service (Development)

If email service is not configured, the reset link will be logged to the console:
```
🔗 Password reset link for user@example.com: http://localhost:5173/reset-password?token=abc123...
```

### With Email Service

1. Request password reset
2. Check email inbox
3. Click reset link
4. Enter new password
5. Login with new password

## Troubleshooting

### Email Not Sending

1. **Check environment variables** are set correctly
2. **Verify SMTP credentials** (especially app password for Gmail)
3. **Check server logs** for email errors
4. **Test SMTP connection** using nodemailer test

### Reset Link Not Working

1. **Check token expiration** (1 hour limit)
2. **Verify FRONTEND_URL** matches your frontend URL
3. **Check token format** in URL
4. **Verify user exists** and has local auth (not OAuth only)

### Common Errors

- **"Email service not configured"**: Set SMTP_USER and SMTP_PASS
- **"Invalid or expired reset token"**: Token expired or already used
- **"Password must be at least 6 characters"**: Password too short

## Production Deployment

1. **Set environment variables** on your hosting platform (Render, Heroku, etc.)
2. **Update FRONTEND_URL** to your production domain
3. **Use secure SMTP** (port 465 with SMTP_SECURE=true)
4. **Test email delivery** before going live

## Notes

- Email service is optional - app works without it (logs reset links to console)
- Reset tokens are stored in database and automatically cleaned up
- Google OAuth users can also reset password if they have a local password set
- Password reset emails are HTML formatted with branding

---

**Created:** January 2025  
**Version:** 1.0

