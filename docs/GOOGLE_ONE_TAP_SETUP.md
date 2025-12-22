# Google One Tap Setup Guide

Google One Tap is already integrated into QwkSearch and provides a streamlined sign-in experience for users.

## Prerequisites

You need a Google Cloud Project with OAuth 2.0 credentials configured.

## Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Select **Web application** as the application type
6. Configure the following:

   **Authorized JavaScript origins:**
   ```
   http://localhost:3000
   https://yourdomain.com
   ```

   **Authorized redirect URIs:**
   ```
   http://localhost:3000/api/auth/callback/google
   https://yourdomain.com/api/auth/callback/google
   ```

7. Click **Create** and copy your **Client ID** and **Client Secret**

## Step 2: Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Add your Google OAuth credentials to `.env`:
   ```env
   # Server-side credentials
   GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-client-secret

   # Client-side credential (same as GOOGLE_CLIENT_ID)
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com

   # Your application URL
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

3. Generate a secret key for Better-Auth:
   ```bash
   openssl rand -base64 32
   ```

   Add it to `.env`:
   ```env
   BETTER_AUTH_SECRET=your-generated-secret-key
   ```

## Step 3: Database Setup

The authentication system uses SQLite with Turso. For local development:

```env
TURSO_DATABASE_URL=file:./data/qwksearch.db
```

The database will be created automatically when you first run the application.

## Step 4: Run Database Migrations

```bash
npm run db:push
```

This will create all necessary authentication tables in your database.

## Step 5: Start the Application

```bash
npm run dev
```

Visit http://localhost:3000 and you should see the Google One Tap prompt automatically appear for unauthenticated users.

## How Google One Tap Works

- **Automatic Display**: The One Tap prompt appears automatically on page load for unauthenticated users
- **One-Click Sign-In**: Users can sign in with a single click without navigating to a separate login page
- **Smart Prompting**: The prompt won't show if the user is already authenticated
- **Privacy-Focused**: Uses Google's official One Tap SDK with proper security measures

## Components Involved

The Google One Tap integration consists of:

- **`src/lib/auth.ts`** - Server-side Better-Auth configuration with Google OAuth
- **`src/lib/auth-client.ts`** - Client-side auth client with One Tap plugin
- **`src/components/GoogleOneTap.tsx`** - React component that initializes One Tap
- **`src/app/layout.tsx`** - Root layout that renders the GoogleOneTap component

## Troubleshooting

### 404 Error When Loading Google One Tap

**Cause**: Missing `NEXT_PUBLIC_GOOGLE_CLIENT_ID` environment variable.

**Solution**:
1. Ensure `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is set in your `.env` file
2. Restart your development server after adding environment variables
3. Verify the variable starts with `NEXT_PUBLIC_` (required for client-side access in Next.js)

### One Tap Prompt Not Appearing

**Possible causes**:
1. User is already authenticated
2. User previously dismissed the prompt (stored in browser cookies)
3. Missing Google OAuth credentials
4. Incorrect authorized origins in Google Cloud Console

**Solutions**:
- Clear browser cookies and reload
- Verify all environment variables are set correctly
- Check browser console for error messages
- Ensure your domain is added to authorized origins in Google Cloud Console

### "Invalid Client ID" Error

**Cause**: The Client ID in your `.env` doesn't match the one configured in Google Cloud Console.

**Solution**:
1. Verify `GOOGLE_CLIENT_ID` and `NEXT_PUBLIC_GOOGLE_CLIENT_ID` match exactly
2. Ensure they match the Client ID shown in Google Cloud Console
3. Restart your development server

### Redirect URI Mismatch

**Cause**: The callback URL isn't authorized in Google Cloud Console.

**Solution**:
1. Add `http://localhost:3000/api/auth/callback/google` to authorized redirect URIs
2. For production, add `https://yourdomain.com/api/auth/callback/google`
3. Save changes in Google Cloud Console (may take a few minutes to propagate)

## Production Deployment

For production deployments:

1. Update `NEXT_PUBLIC_BASE_URL` to your production domain:
   ```env
   NEXT_PUBLIC_BASE_URL=https://yourdomain.com
   ```

2. Add your production domain to Google Cloud Console:
   - Authorized JavaScript origins: `https://yourdomain.com`
   - Authorized redirect URIs: `https://yourdomain.com/api/auth/callback/google`

3. Use environment variables or secrets management (not `.env` files) for credentials

4. For Cloudflare Pages deployment, see [CLOUDFLARE_DEPLOYMENT.md](../CLOUDFLARE_DEPLOYMENT.md)

## Security Best Practices

1. **Never commit `.env` files** - They contain sensitive credentials
2. **Use different OAuth credentials** for development and production
3. **Rotate secrets regularly** - Especially `BETTER_AUTH_SECRET`
4. **Enable HTTPS in production** - Required for secure authentication
5. **Restrict authorized origins** - Only add domains you control

## Additional OAuth Providers

QwkSearch also supports:
- Discord OAuth
- Facebook OAuth
- LinkedIn OAuth
- Email/Password authentication
- Magic link authentication (via Resend)

See `.env.example` for configuration options.

## Resources

- [Better-Auth Documentation](https://better-auth.com)
- [Google One Tap Documentation](https://developers.google.com/identity/gsi/web/guides/overview)
- [Google Cloud Console](https://console.cloud.google.com)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
