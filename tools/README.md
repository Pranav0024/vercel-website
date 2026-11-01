# Development matcher compatibility

The npm override replaces every old minimatch implementation with the original
upstream minimatch 11.0.3 package. This fixes GHSA-g3hv-75wg-m249; no advisories
are suppressed and no upstream source files are patched after installation.

ESLint's older plugins expect a callable CommonJS export. The ESLint config
loads `minimatch-compat.cjs` before loading its plugins; it adapts the Node module
cache's export to support both the legacy function and modern named properties.
The config loads FlatCompat's CommonJS build because its ESM build expects
minimatch's removed default export. Only linting loads this bridge; Next.js's
runtime is unchanged.

The `makeRe` compatibility method supports the `.test()` interface used by
`import/no-internal-modules`. It returns a matcher, not a RegExp. This is a bridge
for the installed lint tools, not a complete implementation of the old API.

Remove the bridge, its config import, the direct minimatch development dependency,
and its override once the upstream lint dependencies support a patched matcher
natively. Validate changes with `npm run test:dependencies`, `npm run lint`,
`npm run build`, and `npm audit`.
