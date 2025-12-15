import { defineConfig, globalIgnores } from 'eslint/config';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Run `npm run lint` to apply these checks locally and in CI.
const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const typeCheckedRules = tsPlugin.configs['strict-type-checked'].rules;

export default defineConfig([
  {
    name: 'site-shell/ignores',
    ignores: [
      'node_modules/**',
      'dist/**',
      '.next/**',
      'coverage/**',
      'tests/e2e/playwright-report/**',
      'tests/e2e/test-results/**',
    ],
  },
  {
    name: 'site-shell/typescript-overrides',
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: path.join(projectRoot, 'tsconfig.json'),
        tsconfigRootDir: projectRoot,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...typeCheckedRules,
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  ...nextCoreWebVitals,
  globalIgnores(['next-env.d.ts']),
]);
