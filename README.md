# Administration

Admin console (Next.js App Router API on [vinext](https://github.com/cloudflare/vinext)) running on
Cloudflare Workers, with PostgreSQL via Prisma 7 + Hyperdrive, Better Auth for the admin login, and
Tailwind CSS for styling.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server (http://localhost:5173). The first start takes ~30s while Vite pre-bundles dependencies; early requests may fail or hang. |
| `npm run build` | Builds the Cloudflare Worker output into `dist/`. |
| `npm run start` | Runs the built Worker locally with Wrangler. |
| `npm run deploy` | Deploys the Worker. |
| `npm run db:seed` | Seeds dummy items (and an admin user if none exists). Safe to re-run. |
| `npm run check:hyperdrive` | Fails if Hyperdrive query caching is on. See below. |
| `npm run biome:check` / `biome:fix` | Lint / format. |

## Local setup

Create `.env`:

```
DATABASE_URL=postgres://...          # direct connection string
BETTER_AUTH_SECRET=...               # long random string
BETTER_AUTH_URL=http://localhost:5173  # must match the URL in the browser exactly
# optional
RESEND_API_KEY=...                   # confirmation emails; without it they are logged to the console
CLIENT_APP_URL=http://localhost:3001 # where email links send visitors
THEME=slate                          # slate | indigo | emerald | rose
```

Then:

```bash
npm install
npx prisma migrate dev
npm run db:seed        # prints the generated admin password once
npm run dev
```

`BETTER_AUTH_URL` must equal the origin you open in the browser (scheme, host and port). If it
doesn't, sign-in works but sign-out fails with `Invalid origin`.

## Hyperdrive: keep caching OFF

The Worker reaches the database through a Cloudflare **Hyperdrive** config (binding `HYPERDRIVE` in
`wrangler.jsonc`). Hyperdrive **caches read queries by default** (60s, plus 15s stale) and does **not**
invalidate them when you write. With caching on:

- an admin action (inactivate, delete, edit) succeeds but the list keeps showing the old rows;
- Better Auth session lookups can be stale, so a sign-out can look ignored for up to a minute.

This only happens on Cloudflare, never in local dev (local Hyperdrive connects straight to the
database), so it is easy to miss. The setting belongs to the Hyperdrive config itself; it cannot be set
in `wrangler.jsonc` or per query from code.

**Every new Hyperdrive config defaults to caching ON**, so always create it with the flag:

```bash
npx wrangler hyperdrive create <name> --connection-string="postgres://..." --caching-disabled
```

Verify (or fix) an existing one:

```bash
npm run check:hyperdrive              # fails only if caching is confirmed ON
npm run check:hyperdrive -- --strict  # also fails if the check could not run
npm run check:hyperdrive -- --fix     # turns caching off (changes your Cloudflare account)
```

To enforce it on every deploy, make the check part of the Cloudflare build command, e.g.
`npm run check:hyperdrive && npm run build` (the build's API token must be allowed to read Hyperdrive
configs; otherwise the check only warns, unless you pass `--strict`).

If you later want caching for heavy, public, read-only traffic, create a second Hyperdrive config *with*
caching and bind it under another name; keep admin pages and login on the uncached one.

## Deploying to Cloudflare (checklist for a new site)

1. Create the Hyperdrive config **with `--caching-disabled`** (above) and put its `id` in the
   `hyperdrive` binding in `wrangler.jsonc`.
2. Set `BETTER_AUTH_URL` (under `vars` in `wrangler.jsonc`) to the production URL, no trailing slash.
3. Set secrets on the Worker (not as build variables; those only exist during the build):
   ```bash
   npx wrangler secret put BETTER_AUTH_SECRET
   npx wrangler secret put RESEND_API_KEY   # if subscriptions are enabled
   ```
4. Optional Worker variables: `CLIENT_APP_URL`, `THEME`.
5. Run migrations against the production database: `npx prisma migrate deploy`.
6. Create the first admin: `npm run db:seed` against the production database (it prints the password),
   or set `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` first.
7. `npm run check:hyperdrive`, then deploy.

## Configuration

Almost everything is in `src/core/config/appConfig.ts`:

- `routes`, `nav`: page paths and the top navigation.
- `auth.protectedPaths`: page prefixes that require a login.
- `api.public` / `api.blocked` / `api.cors`: which `/api` paths are open to anonymous visitors
  (everything else needs a session).
- `subscription.isEnabled`: feature flag; off means every `/api/subscribe/*` route answers 404.
- `theme`: color presets (`active`, `presets`, `overrides`). Set the `THEME` variable per deployment to
  switch without code changes.

## Cloudflare Workers gotchas

- No I/O in global scope: `auth` and `prisma` are created lazily inside requests (`src/lib/auth.ts`,
  `src/lib/prisma.ts`). Don't create database clients at module load.
- Don't share a database connection between requests; `prisma.ts` builds a fresh client per use.
- The Prisma client uses the `workerd` runtime. The seed script uses a separate Node client
  (`src/generated/prisma-node`), generated by the same `prisma generate`.
