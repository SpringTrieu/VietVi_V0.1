import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import boundaries from 'eslint-plugin-boundaries';

/** @type {import('eslint').Linter.Config[]} */
export const baseConfig = [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
];

/** @type {import('eslint').Linter.Config[]} */
export const boundaryConfig = [
  {
    plugins: { boundaries },
    settings: {
      'boundaries/elements': [
        { type: 'app-web', pattern: 'apps/web/**' },
        { type: 'app-admin', pattern: 'apps/admin/**' },
        { type: 'app-api', pattern: 'apps/api/**' },
        { type: 'pkg-contracts', pattern: 'packages/contracts/**' },
        { type: 'pkg-ui', pattern: 'packages/ui/**' },
        { type: 'pkg-i18n', pattern: 'packages/i18n/**' },
      ],
    },
    rules: {
      // Apps must not import from each other
      'boundaries/element-types': [
        'error',
        {
          default: 'allow',
          rules: [
            { from: 'app-web', disallow: ['app-admin', 'app-api'] },
            { from: 'app-admin', disallow: ['app-web', 'app-api'] },
            { from: 'app-api', disallow: ['app-web', 'app-admin'] },
            // contracts must not depend on React, NestJS, or Kysely
            {
              from: 'pkg-contracts',
              disallow: ['app-web', 'app-admin', 'app-api', 'pkg-ui'],
            },
          ],
        },
      ],
    },
  },
];

/** @type {import('eslint').Linter.Config[]} */
export const ignoresConfig = [
  {
    ignores: [
      'pnpm-lock.yaml',
      '**/generated/**',
      '**/.next/**',
      '**/dist/**',
      '**/coverage/**',
      'apps/api/db/schema.sql',
      'apps/api/db/migrations/**',
      'docs/api/openapi.json',
      '**/node_modules/**',
    ],
  },
];
