import { baseConfig, boundaryConfig, ignoresConfig } from '@vietvi/config-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [...ignoresConfig, ...baseConfig, ...boundaryConfig];
