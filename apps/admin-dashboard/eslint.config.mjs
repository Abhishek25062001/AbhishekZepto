import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: [
      'dist/**',
      'dist-access-control-smoke/**',
      'dist-catalog-test/**',
      'dist-stores-test/**',
      'dist-inventory-test/**',
      'build/**',
      'node_modules/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
];

