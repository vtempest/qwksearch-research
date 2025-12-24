# Database Migration Fix - ArticleCache Tables

## Issue
The application was failing with the error:
```
Error: SQLITE_UNKNOWN: SQLite error: no such table: articleCache
```

This occurred because migration `0006_article_cache.sql` existed but was not registered in the migration journal and had not been applied to the database.

## What Was Fixed

### 1. Updated Migration Journal
Added migration 0006 to `drizzle/meta/_journal.json`:
```json
{
  "idx": 6,
  "version": "6",
  "when": 1734925200000,
  "tag": "0006_article_cache",
  "breakpoints": true
}
```

### 2. Created Standalone Migration Script
Created `scripts/run-migration.mjs` for manual migration execution if needed.

## How Migrations Work

### Automatic Migration (Recommended)
The application automatically runs migrations on startup through Next.js instrumentation:
- **File**: `src/instrumentation.ts`
- **When**: Every time the Next.js application starts
- **Process**:
  1. Imports `src/lib/db/migrate.ts`
  2. Reads all `.sql` files from `drizzle/` folder
  3. Checks `ran_migrations` table for already-applied migrations
  4. Applies any pending migrations

### Manual Migration (If Needed)
Run the standalone migration script:
```bash
node scripts/run-migration.mjs
```

**Note**: Requires dependencies to be installed (`npm install`)

## Tables Created by Migration 0006

### `articleCache`
Caches article metadata and content:
- `url` (unique) - Article URL
- `title`, `cite`, `author`, etc. - Article metadata
- `html` - Article content
- `followUpQuestions` - JSON array of follow-up questions
- `hitCount` - Access counter
- `lastAccessed`, `createdAt`, `expiresAt` - Timestamps

### `articleQA`
Stores Q&A pairs for cached articles:
- `articleUrl` - Foreign key to `articleCache.url`
- `question` - Question text
- `answer` - Answer text
- `createdAt` - Timestamp

## Solution

**To apply this fix, simply restart your application.** The migration will run automatically and create the missing tables.

## Verification

After restart, check logs for:
```
Running database migrations...
→ Applying migration: 0006_article_cache.sql
✓ Applied migration: 0006_article_cache.sql
Database migrations completed successfully
```

## Related Files
- Migration SQL: `drizzle/0006_article_cache.sql`
- Schema Definition: `src/lib/db/schema.ts` (lines 137-183)
- Migration Runner: `src/lib/db/migrate.ts`
- Instrumentation: `src/instrumentation.ts`
- Manual Script: `scripts/run-migration.mjs`
