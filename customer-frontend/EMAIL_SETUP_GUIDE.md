# Email Setup Guide for OTP Functionality

## Quick Setup Steps

### 1. Gmail Configuration
1. Go to your Google Account settings
2. Enable 2-Factor Authentication if not already enabled
3. Generate an App Password:
   - Go to Security → 2-Step Verification → App passwords
   - Select "Mail" and generate password
   - Copy the 16-character password

### 2. Update Environment Variables
Edit `.env.local` file and replace:
```
EMAIL_USER=your-actual-email@gmail.com
EMAIL_PASS=your-16-character-app-password
```

### 3. Alternative Email Services
If you prefer other services, update the transporter in `/api/change-password/route.ts`:

**For Outlook/Hotmail:**
```javascript
service: 'hotmail'
```

**For Yahoo:**
```javascript
service: 'yahoo'
```

**For Custom SMTP:**
```javascript
host: 'your-smtp-server.com',
port: 587,
secure: false,
```

### 4. Test the Setup
1. Restart your development server: `npm run dev`
2. Try the change password feature
3. Check your email inbox for OTP

## Security Notes
- Never commit real credentials to version control
- Use App Passwords, not your regular Gmail password
- The OTP expires in 10 minutes for security
- OTPs are securely stored in MongoDB with expiry

## Troubleshooting
- If emails don't send, check your Gmail App Password
- Ensure 2FA is enabled on your Google account
- Check spam folder for OTP emails
- Verify environment variables are loaded correctly