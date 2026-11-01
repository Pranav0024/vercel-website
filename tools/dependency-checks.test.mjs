import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { test } from 'node:test';
import './minimatch-compat.cjs';

const load = createRequire(import.meta.url);
const matcher = load('minimatch');

test('all installed lint consumers resolve the patched matcher', () => {
  const expected = load.resolve('minimatch');
  assert.equal(load('minimatch/package.json').version, '11.0.3');
  for (const consumer of [
    'eslint', '@eslint/eslintrc', '@eslint/config-array',
    '@typescript-eslint/typescript-estree', 'eslint-plugin-import',
    'eslint-plugin-react', 'eslint-plugin-jsx-a11y',
  ]) {
    const consumerLoad = createRequire(load.resolve(consumer));
    assert.equal(consumerLoad.resolve('minimatch'), expected, consumer);
  }
});

test('legacy callable, named, class and modern ESM APIs work', async () => {
  assert.equal(typeof matcher, 'function');
  assert.equal(matcher.minimatch, matcher);
  const cases = [
    ['app/page.tsx', '**/*.{ts,tsx}', {}, true],
    ['app/page.js', '**/*.{ts,tsx}', {}, false],
    ['.next/cache/build.js', '**/*.js', { dot: true }, true],
    ['.next/cache/build.js', '**/*.js', {}, false],
    ['app/page.tsx', '!**/*.js', {}, true],
    ['app/page.tsx', '*.tsx', { matchBase: true }, true],
    ['app', 'app/**/page.tsx', { partial: true }, true],
    ['C:\\site\\app\\page.tsx', 'C:/site/**/*.tsx', { platform: 'win32' }, true],
  ];
  for (const [path, pattern, options, expected] of cases) {
    assert.equal(matcher(path, pattern, options), expected, `${path}: ${pattern}`);
    assert.equal(new matcher.Minimatch(pattern, options).match(path), expected);
    assert.equal(matcher.makeRe(pattern, options).test(path), expected);
  }
  assert.equal((await import('minimatch')).minimatch('app/page.tsx', '**/*.tsx'), true);
});

test('amplifying and nested glob patterns complete within a bounded subprocess', () => {
  const output = execFileSync(process.execPath, ['--max-old-space-size=128', '-e', `
    const assert = require('node:assert/strict');
    const match = require('./tools/minimatch-compat.cjs');
    const patterns = [
      'a/' + '**/../'.repeat(40) + 'target',
      '**/a/../'.repeat(40) + 'target',
      'a/' + '*('.repeat(24) + 'x' + ')'.repeat(24),
    ];
    for (const pattern of patterns) {
      const mm = new match.Minimatch(pattern, { optimizationLevel: 2 });
      assert.ok(mm.set.length <= 2);
      assert.equal(typeof mm.match('a/target'), 'boolean');
      assert.equal(typeof match('a/target', pattern, { optimizationLevel: 2 }), 'boolean');
      assert.equal(typeof match.makeRe(pattern, { optimizationLevel: 2 }).test('a/target'), 'boolean');
    }
    console.log('completed');
  `], { cwd: new URL('../', import.meta.url), timeout: 5000, encoding: 'utf8' });
  assert.equal(output.trim(), 'completed');
});

test('ESLint still enforces optional import and JSX glob rules', async () => {
  const { ESLint } = await import('eslint');
  const importLint = new ESLint({ overrideConfig: {
    rules: { 'import/no-internal-modules': ['error', { forbid: ['react/*'] }] },
  } });
  const [blocked] = await importLint.lintText(
    "import { jsx } from 'react/jsx-runtime'; void jsx;",
    { filePath: 'app/dependency-check.ts' },
  );
  assert.equal(blocked.messages.filter(m => m.ruleId === 'import/no-internal-modules').length, 1);
  const [allowed] = await importLint.lintText(
    "import React from 'react'; void React;",
    { filePath: 'app/dependency-check.ts' },
  );
  assert.equal(allowed.errorCount, 0);

  const jsx = 'const BAD_name = () => null; export default function Page() { return <BAD_name />; }';
  for (const [ignore, expectedErrors] of [[['BAD_*'], 0], [['Allowed*'], 1]]) {
    const jsxLint = new ESLint({ overrideConfig: {
      rules: { 'react/jsx-pascal-case': ['error', { ignore }] },
    } });
    const [result] = await jsxLint.lintText(jsx, { filePath: 'app/dependency-check.tsx' });
    assert.equal(result.messages.filter(m => m.ruleId === 'react/jsx-pascal-case').length, expectedErrors);
  }
});
