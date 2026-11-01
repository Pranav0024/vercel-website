import "./tools/minimatch-compat.cjs";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { createRequire } from "node:module";

// The legacy config's ESM build imports minimatch's removed default export.
// Its CommonJS build uses the compatibility export loaded above instead.
const load = createRequire(import.meta.url);
const { FlatCompat } = load("@eslint/eslintrc");

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;
