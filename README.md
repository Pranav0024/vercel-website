# Paniar website

Product catalogue built with Next.js 15, React 19, TypeScript, and Tailwind CSS 4.
The home page and `/shop` use the catalogue in `data/products.ts` and product
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
- `data/` and `types/`: product catalogue and shared types.
- `public/`: product images and branding.
- `tools/`: required lint compatibility bridge and dependency checks; see
  [tools/README.md](tools/README.md) before changing these.

`node_modules/`, `.next/`, and `next-env.d.ts` are generated locally. They are
needed while developing but are excluded from version control.
