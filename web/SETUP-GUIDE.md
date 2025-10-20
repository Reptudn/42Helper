# 42 Helper Authentication Setup Guide

## Current Issue: OAuth Redirect Error

You're getting an error because your 42 OAuth app is configured for `localhost` but your server runs on `91.98.148.201`.

## Step-by-Step Fix:

### 1. Update Your 42 OAuth Application

Go to your 42 intranet profile → API applications → Your app and change:

**FROM:**
```
Redirect Uri: http://localhost:3000/api/auth/callback/42-school
```

**TO:**
```
Redirect Uri: http://91.98.148.201:3000/api/auth/callback/42-school
```

### 2. Your Environment Variables (Already Fixed)

Your `.env.local` should now have:
```bash
NEXTAUTH_URL=http://91.98.148.201:3000
FORTY_TWO_CLIENT_ID=u-s4t2ud-9e49b12d13c23606af84c94d7700570f90eedcd03b8dca16247e6febb6524b1d
FORTY_TWO_CLIENT_SECRET=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
```

### 3. Test the Setup

1. **Start your development server:**
   ```bash
   cd /home/hello_x/Desktop/hackathon42/web
   npm run dev
   ```

2. **Access your site at:**
   ```
   http://91.98.148.201:3000
   ```

3. **Click "Login with 42"** - it should now work!

### 4. Understanding the Flow

1. User clicks "Login with 42" → redirects to 42 OAuth
2. User authorizes → 42 redirects back to your callback URL
3. NextAuth processes the callback → user is logged in
4. User is redirected to your home page

### 5. If You Still Get Errors

**Common Issues:**

- **"Invalid redirect_uri"** → Your 42 app still has wrong redirect URI
- **"Invalid client"** → Check your Client ID/Secret are correct
- **"NEXTAUTH_URL mismatch"** → Make sure NEXTAUTH_URL matches your actual domain

**Debug Steps:**

1. Check the browser network tab for OAuth redirect URLs
2. Verify your 42 app settings match exactly: `http://91.98.148.201:3000/api/auth/callback/42-school`
3. Make sure your Next.js app is running on port 3000

### 6. Production Deployment

When you deploy to production, you'll need to:

1. Update `NEXTAUTH_URL` to your production domain
2. Add the production callback URL to your 42 OAuth app
3. Keep the same Client ID/Secret

## Current Configuration Summary

- **Server**: `http://91.98.148.201:3000` (Next.js)
- **PocketBase**: `http://91.98.148.201:8090` (Data storage)
- **42 OAuth Callback**: `http://91.98.148.201:3000/api/auth/callback/42-school`

This setup allows 42 students to login with their intranet credentials and access your platform.
