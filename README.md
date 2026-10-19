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

### Code layout

- `src/core`: what every feature needs (auth, config, UI shell and primitives, later i18n). **Core never
  imports from `src/features`.**
- `src/features/<name>`: one feature each (actions, components, queries and its own `config.ts`).
  A feature may import core. Features should not import each other.
- `src/app`: thin Next.js route files that wire the two together.

### Central config: `src/core/config/appConfig.ts`

- `features`: an on/off flag per feature. `false` switches the feature off everywhere: its sidebar entry
  disappears, its API routes answer 404, and its code refuses to run. Its dashboard pages answer 404 too,
  but signed-in users see a short notice ("The X feature is not enabled") instead of a bare
  "not found"; logged-out visitors are sent to the login as usual.
- `routes`: only the core routes (login, home, users). Each feature owns its own routes.
- `auth.protectedPaths`: page prefixes that require a login.
- `api.public` / `api.blocked` / `api.cors`: which `/api` paths are open to anonymous visitors
  (everything else needs a session). Features add their own public entries (see below).
- `theme`: color presets (`active`, `presets`, `overrides`). Set the `THEME` variable per deployment to
  switch without code changes.

### Per-feature config: `src/features/<name>/config.ts`

Each feature describes itself with `defineFeature()`: its `routes`, sidebar entry (`nav`), page and API
prefixes (`pagePrefix`, `apiPrefix`, used to switch it off), anonymous API entries (`publicApi`) and its
own `settings` (e.g. the subscription link settings). Keep these files free of server-only imports
(prisma, auth): the proxy and the sidebar import them.

`src/features/registry.ts` is the **only** file that lists all features. It combines their configs with
the flags and hands core plain data (sidebar entries, access rules), which is how core stays independent
of features.

### Adding a feature

1. Add its id to `FeatureId` in `src/core/config/feature.ts` and a flag in `appConfig.features`
   (forgetting the flag is a compile error).
2. Create `src/features/<id>/config.ts` with `defineFeature({ ... })`.
3. List it in `src/features/registry.ts` (and in its `sidebar` array if it has a sidebar entry; a new
   sidebar icon also needs adding to `NavIcon` and the icon map in `core/ui/dashboard-shell.tsx`).
4. Build its pages under `src/app/dashboard/<id>` and its logic under `src/features/<id>`.

## API

Request bodies are validated with [zod](https://zod.dev/). Each feature keeps its schemas in
`features/<id>/validation.ts` (built from the helpers in `src/core/validation.ts`), services call
`parse(schema, body)`, and the forms reuse the same field lists. Schemas are strict: unknown fields are
a `400`.

Routes live in `src/app/api/<feature>/<verb>/route.ts`. Anything not listed in `api.public` (or a
feature's `publicApi`) needs a login: the proxy rejects requests without a session cookie with 401, and
admin routes verify the session again with `requireSession` (`src/core/api.ts`). Errors are always
`{ "error": "message" }`. Writes must send `Content-Type: application/json`.

### Contact (`features/contact`)

| Endpoint | Access | Body | Result |
| --- | --- | --- | --- |
| `GET /api/contact/get` | public, CORS | none | `200 { "contact": { email, phone, mobile, address, openingHours, updatedAt } }`, or `{ "contact": null }` |
| `POST /api/contact/add` | login | any of the five fields (at least one) | `201 { contact }`; `409` if it already exists |
| `POST /api/contact/edit` | login | only the fields to change; `null` or `""` clears one | `200 { contact }`; `404` if there is nothing yet |
| `POST /api/contact/delete` | login | `{}` | `200 { "deleted": true }`; `404` if there is nothing |

The dashboard form uses these same endpoints. Unknown fields and invalid values are `400`. The public
response never includes ids or the names/emails of admins.

### Items (`features/items`) and blogs (`features/blogs`)

Both follow the same shape (`/api/item/...` and `/api/blog/...`):

| Endpoint | Access | Body / query | Result |
| --- | --- | --- | --- |
| `GET /api/item/get` | public, CORS | none for the list, `?id=` for one | ACTIVE items only: `{ items }` or `{ item }` (`id, category, technique, imageUrl, createdAt`); `404` if missing or inactive |
| `POST /api/item/add` | login | `category`, `technique`, `imageUrl` (all required) | `201 { item }` |
| `POST /api/item/edit` | login | `id` plus only the fields to change | `200 { item }`; `404` if unknown |
| `POST /api/item/status` | login | `{ id, status: "ACTIVE" \| "INACTIVE" }` | `200 { item }`; `404` if unknown |
| `POST /api/item/delete` | login | `{ id }` | `200 { "deleted": true }`; `404` if unknown |
| `GET /api/blog/get` | public, CORS | none for the list, `?id=` for one | ACTIVE blogs only |
| `POST /api/blog/add` | login | `title`, `content` required; `excerpt`, `imageUrl` optional | `201 { blog }` |
| `POST /api/blog/edit` | login | `id` plus only the fields to change; `null` or `""` clears an optional field | `200 { blog }` |
| `POST /api/blog/status` | login | `{ id, status }` | `200 { blog }` |
| `POST /api/blog/delete` | login | `{ id }` | `200 { "deleted": true }` |

The dashboard buttons and forms call these endpoints (`ApiButton`, `DeleteButton`, `postJson` in
`src/core/ui`); there are no server actions left.

## Cloudflare Workers gotchas

- No I/O in global scope: `auth` and `prisma` are created lazily inside requests (`src/lib/auth.ts`,
  `src/lib/prisma.ts`). Don't create database clients at module load.
- Don't share a database connection between requests; `prisma.ts` builds a fresh client per use.
- The Prisma client uses the `workerd` runtime. The seed script uses a separate Node client
  (`src/generated/prisma-node`), generated by the same `prisma generate`.
