import { baseConfig, ignoresConfig } from '@vietvi/config-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...ignoresConfig,
  ...baseConfig,
];
