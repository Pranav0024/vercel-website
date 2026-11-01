// eslint-disable-next-line @typescript-eslint/no-require-imports -- This bridge must adapt the CommonJS module cache used by legacy plugins.
const patched = require('minimatch');

// Keep upstream v11's safe implementation, while supporting the callable v3
// export still used by ESLint's React, import, and accessibility plugins.
const match = Object.assign(
  (path, pattern, options) => patched.minimatch(path, pattern, options),
  patched,
);
match.minimatch = match;

// import/no-internal-modules only calls makeRe(pattern).test(path). Do not
// recreate the regex compiler removed in v11; use its safe matcher instead.
match.makeRe = (pattern, options) => {
  const matcher = new patched.Minimatch(pattern, options);
  return { test: (path) => matcher.match(path) };
};

// The ESLint config loads this before plugins. All consumers resolve the same
// overridden module, so legacy require/default and modern named APIs coexist.
require.cache[require.resolve('minimatch')].exports = match;
module.exports = match;
