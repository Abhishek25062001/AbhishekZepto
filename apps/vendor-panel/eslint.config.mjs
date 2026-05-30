import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: [
      'dist/**',
      'build/**',
      'node_modules/**',
      'dist-access-control-smoke/**',
      'dist-store-catalog-test/**',
      'dist-store-inventory-test/**',
      'dist-vendor-orders-test/**',
      'dist-notifications-test/**',
      'dist-realtime-store-operations-test/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
];
