# Catalogue administration

## Local panel

Run `npm run admin:setup`, then `npm run dev`. Open `/admin` and sign in using
`ADMIN_PASSWORD` from your local `.env.local`. That file is ignored by Git and
must never be shared or pushed. The setup command preserves existing values.
Use a unique password of at least 16 characters and a session secret of at least
32 characters. Rotating either value invalidates existing sessions.

Add, edit, delete, categorise, hide and feature products. Upload JPG, PNG or WebP
images up to 4 MB, or reference an existing local image path. Prices are private
admin notes and are not returned by the public catalogue API.

**Save draft** does not affect the public site. **Publish catalogue** copies the
saved draft into the public catalogue. Unsaved editor changes must be saved
first. Public pages use only the published snapshot; hidden products stay hidden.
The existing 15 products are seeded into both snapshots. Changes persist locally
in `.data/catalogue.json`; uploads are in `.data/images/`. Back up `.data/`.
Deleting a product does not delete its image, so other products cannot lose images.

## Free persistent storage for the hosted site

Use the separate private repository `Pranav0024/paniar-catalogue` for catalogue
JSON and uploaded images. The website source repository `Pranav0024/vercel-website`
is public, so it must not be used for drafts or private catalogue updates. The
adapter verifies that its storage repository is private before accessing it.
No paid database or separate cloud storage subscription is used. GitHub repository
size, API and hosting limits still apply; this is for a modest catalogue.

The private repository has been initialized on its `main` branch. It is not linked
to Vercel, so saving catalogue data there does not trigger website builds. The
website remains deployed from the public source repository's `master` branch.

1. Create a fine-grained GitHub token restricted to **paniar-catalogue**, granting
   only **Contents: read and write** plus required metadata read access.
2. Keep it in the ignored local `.env.local` as `CATALOGUE_GITHUB_TOKEN` and in
   Vercel's encrypted server-side environment settings. Never paste it into chat,
   commit it, or prefix it with `NEXT_PUBLIC_`.
3. Configure these variables on the Vercel project, then redeploy:
   - `ADMIN_PASSWORD`: the locally configured admin password, or a new strong one.
   - `ADMIN_SESSION_SECRET`: the locally configured random signing secret.
   - `CATALOGUE_STORAGE=github`
   - `CATALOGUE_GITHUB_REPOSITORY=Pranav0024/paniar-catalogue`
   - `CATALOGUE_GITHUB_BRANCH=main`
   - `CATALOGUE_GITHUB_TOKEN`: the restricted token from step 1.

Production settings belong only to the Production environment, not untrusted
pull-request previews. Credentials are stored as sensitive variables in Vercel.
When renewing or rotating a token, update the ignored local file and Vercel's
production value, then redeploy; changing the local file alone does not update
the hosted application.

To migrate local drafts and uploads for the first time, run `npm run catalogue:migrate`
from a workstation signed into GitHub CLI. It refuses public repositories and does
not overwrite an existing remote catalogue. It uses the workstation login only
for migration; it never copies that broader credential into the app or Vercel.

After adding the restricted token locally, run `npm run catalogue:verify` to
verify repository privacy and read access. `npm run catalogue:verify -- --check-write`
also saves the identical JSON with its current revision to verify write access;
it does not change product data or publish drafts. The token is never printed.

On Vercel, trusted client addressing is detected automatically. On another host,
configure a reverse proxy that replaces client-supplied forwarded-address headers,
then set `ADMIN_TRUST_PROXY=true`. Production login refuses an untrusted or missing
client address instead of allowing spoofable sign-in limits. Local development
is bound to the local machine and uses its own attempt bucket.

Do not use `NEXT_PUBLIC_` for any of these credentials. The server proxies image
requests so the private repository token and raw private GitHub URLs never reach
visitors. Saves use GitHub's file revision to reject concurrent overwrites.

Local `.data/` changes do not migrate automatically. To move them, privately copy
the local JSON into the private repository and its uploaded images into
`data/catalogue-images/`, preserving filenames. Or start with the seeded catalogue.
Keep the repository private: Git history retains previous draft values and images.

Without explicit persistent storage configuration, production serves the deployed
seed catalogue but rejects admin writes. Do not configure local storage on Vercel
or another ephemeral filesystem. A persistent self-hosted server can explicitly
use `CATALOGUE_STORAGE=local` and back up `.data/`. Local mode supports one Node
worker only; use GitHub mode for multiple processes or serverless hosting.

Public GitHub catalogue reads are shared and cached for up to 15 seconds per
server instance. Publishing refreshes the writing instance immediately; other
instances may take up to 15 seconds to reflect it. Unknown or unpublished image
references are rejected before fetching image bytes from GitHub. Draft images
can only be read through the authenticated admin image route.

## Access and limits

The panel has one shared admin password, eight-hour signed HttpOnly sessions,
same-origin write checks, bounded uploads and JSON bodies, and a conservative
process-local per-requester sign-in throttle (eight failures per minute). For public hosting, also use the host's free
request-rate controls where available; the in-process throttle is not a distributed
rate limiter. There is no password-reset email service; rotate the environment
credentials to recover access. No public sign-up or payment services are involved.

Run `npm run test:admin`, `npm run lint -- --max-warnings=0` and `npm run build`
before deploying. Backend tests use isolated temporary catalogue files.

References: [GitHub Free](https://docs.github.com/en/get-started/learning-about-github/githubs-plans#github-free),
[repository contents API](https://docs.github.com/en/rest/repos/contents).
