# Paniar website

Product catalogue built with Next.js 15, React 19, TypeScript, and Tailwind CSS 4.
The home page and `/shop` use the published catalogue seeded by `data/catalogue.json` and product
images in `public/`. Enquiries are sent through WhatsApp links.

## Local development

Use Node.js 22 and npm. Install dependencies with `npm ci`, then run
`npm run dev` and open http://localhost:3000.

## Checks and production

- `npm run lint -- --max-warnings=0`: check code quality.
- `npm run test:dependencies`: test dependency compatibility and security regressions.
- `npx tsc --noEmit`: check TypeScript types.
- `npm audit`: check dependency advisories.
- `npm run build`: create a production build.
- `npm start`: serve the production build.

## Project layout

- `app/`: pages, shared layout, and styles.
- `components/`: shared UI used by the pages.
- `data/`: the initial draft and published catalogue snapshots.
- `lib/`: catalogue validation, storage, shared types, and server-only admin helpers.
- `public/`: product images and branding.
- `tools/`: required lint compatibility bridge and dependency checks; see
  [tools/README.md](tools/README.md) before changing these.

`node_modules/`, `.next/`, and `next-env.d.ts` are generated locally. They are
needed while developing but are excluded from version control.

## Redesign notes

The website now focuses on dealership, materials and sourcing enquiries. Existing
product price data is retained, but the catalogue presents quotation-led enquiries.
The enquiry form prepares a WhatsApp message for the visitor to review and send;
it does not submit to a backend or send a message automatically.

## Catalogue admin

Run `npm run admin:setup` and visit `/admin`. Use the password in your ignored
`.env.local` file. Add/edit/remove products, upload images and save drafts; use
**Publish catalogue** only when ready to update the public site. Local-only mode
persists in `.data/`; GitHub mode stores drafts and published snapshots in the
separate private `Pranav0024/paniar-catalogue` repository. The public website
source repo must not be used for private draft storage. See
[ADMIN_SETUP.md](ADMIN_SETUP.md) for configuration. No paid database is
used. Run `npm run test:admin` for isolated backend tests, and
`npm run test:admin:http` for temporary-draft HTTP checks against a running local
development server. The HTTP checks never publish and refuse GitHub storage.

Architectural photography is illustrative, not a claim of completed Paniar projects.
Locally saved source images:

- https://images.unsplash.com/photo-1600607687939-ce8a6c25118c
- https://images.unsplash.com/photo-1600210492486-724fe5c67fb0
