# Cloudflare Workers Deployment Guide with OpenNext

This guide explains how to deploy your Next.js application to Cloudflare Workers using the OpenNext adapter.

## What Changed?

This project has migrated from `@cloudflare/next-on-pages` to `@opennextjs/cloudflare` for better Next.js compatibility and support. OpenNext provides:

- Full Node.js runtime support via `nodejs_compat`
- Better middleware and ISR support
- Active maintenance and updates
- Seamless integration with Cloudflare Workers

## Prerequisites

- [Cloudflare account](https://dash.cloudflare.com/sign-up)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) (already installed in this project)
- [Turso database](https://turso.tech/) (already configured)

## Setup Instructions

### 1. Login to Cloudflare

```bash
npm run cf:login
```

This will open a browser window to authenticate with Cloudflare.

### 2. Build for Cloudflare Workers

```bash
npm run cf:build
```

This builds your Next.js app optimized for Cloudflare Workers using OpenNext (`@opennextjs/cloudflare`).

### 3. Preview Locally (Optional)

Test your app locally with the Cloudflare Workers runtime:

```bash
npm run cf:preview
```

This will build and run a local preview server that mimics the Cloudflare Workers environment.

### 4. Deploy to Cloudflare Workers

Deploy your built application:

```bash
npm run cf:deploy
```

This command will:
1. Build your Next.js app with OpenNext
2. Deploy to Cloudflare Workers via Wrangler

### 5. Monitor Your Deployment

View real-time logs from your deployment:

```bash
npm run cf:tail
```

## Environment Variables

All environment variables are configured in `wrangler.toml` under the `[vars]` section. The following are already configured:

### Database
- `TURSO_DATABASE_URL` - Turso database connection URL
- `TURSO_AUTH_TOKEN` - Turso authentication token

### Authentication
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` - Google OAuth
- `AUTH_DISCORD_ID` / `AUTH_DISCORD_SECRET` - Discord OAuth
- `AUTH_FACEBOOK_ID` / `AUTH_FACEBOOK_SECRET` - Facebook OAuth
- `AUTH_LINKEDIN_ID` / `AUTH_LINKEDIN_SECRET` - LinkedIn OAuth
- `AUTH_RESEND_KEY` - Resend API key for magic links
- `BETTER_AUTH_SECRET` - Better-auth secret key
- `NEXT_PUBLIC_BASE_URL` - Your application URL

### Third-Party APIs
- `GROQ_API_KEY` - Groq AI API key
- `FINPREP_API_KEY` - Financial data API
- `ALPHA_VANTAGE_API_KEY` - Stock market data API
- `TAVILY_API_KEY` - Search API
- `OPENAI_API_KEY` - OpenAI API key

**Note**: Values in `wrangler.toml` are committed to the repo. For production, consider using Wrangler secrets instead:

```bash
wrangler secret put TURSO_AUTH_TOKEN
wrangler secret put BETTER_AUTH_SECRET
# etc...
```

## Local Development

### Next.js Dev Server

For normal Next.js development (fastest):

```bash
npm run dev
```

This runs the standard Next.js dev server at `http://localhost:3000`.

### Cloudflare Workers Preview

To test with the actual Workers runtime locally:

```bash
npm run cf:preview
```

This builds with OpenNext and starts a local Workers preview.

## File Structure

- `wrangler.toml` - Cloudflare Workers configuration
- `open-next.config.ts` - OpenNext adapter configuration
- `.open-next/` - OpenNext build output (gitignored)
  - `worker.js` - Main Worker entrypoint
  - `assets/` - Static assets
- `next.config.mjs` - Next.js configuration

## Important Notes

### Database Connection

The app is configured to use **Turso** (libSQL) as the database, which works perfectly with Cloudflare Workers:

- Turso provides HTTP-based database access
- No TCP connections required (compatible with Workers runtime)
- Low latency with edge database replicas
- Connection configured in [src/lib/db/index.ts](src/lib/db/index.ts)

### Alternative: Cloudflare D1

If you prefer to use Cloudflare's built-in D1 database instead of Turso:

1. Uncomment the D1 configuration in `wrangler.toml`
2. Create a D1 database:
   ```bash
   wrangler d1 create qwksearch-db
   ```
3. Update the database binding in your code
4. Migrate your schema to D1

### Image Optimization

Cloudflare Pages doesn't support Next.js Image Optimization out of the box. The config is set to:
- Use unoptimized images when `CLOUDFLARE_PAGES=1`
- Alternatively, use [Cloudflare Images](https://developers.cloudflare.com/images/)

### Node.js Compatibility

The app uses `nodejs_compat` compatibility flag in `wrangler.toml` to support Node.js APIs. OpenNext leverages Cloudflare's Node.js compatibility layer for seamless Next.js support.

**Important**: Do NOT use `export const runtime = "edge"` in your routes or layouts. OpenNext requires the Node.js runtime, not the Edge runtime.

## Troubleshooting

### Build Errors

If you encounter build errors with OpenNext:

1. Ensure you're using a compatible Next.js version (16.x+)
2. Check that no routes use `export const runtime = "edge"`
3. Verify `open-next.config.ts` is properly configured
4. Review [OpenNext Cloudflare documentation](https://opennext.js.org/cloudflare)

### Runtime Errors

- Check environment variables are properly set
- Verify Turso database credentials
- Review logs with `npm run cf:tail`

### Performance Issues

- Monitor CPU usage (50s limit per request)
- Consider caching strategies with KV or Cache API
- Use Turso edge replicas for better database latency

## Additional Resources

- [OpenNext Cloudflare Documentation](https://opennext.js.org/cloudflare)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Reference](https://developers.cloudflare.com/workers/wrangler/)
- [Turso Documentation](https://docs.turso.tech/)
- [Drizzle ORM with Turso](https://orm.drizzle.team/docs/get-started-sqlite#turso)
- [Better-auth Documentation](https://better-auth.com/)

## Deployment Options

### Option 1: CLI Deployment

Use `npm run cf:deploy` for direct deployments via Wrangler CLI.

### Option 2: GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare Workers

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm install
      - run: npm run cf:build
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

## Cost Estimation

Cloudflare Workers pricing:
- **Free Tier**: 100,000 requests/day
- **Paid ($5/month)**: 10 million requests/month included
- **Turso**: Free tier includes 9GB storage, 500 databases

Your current setup should work well within the free tier limits for development and small-scale production use.
