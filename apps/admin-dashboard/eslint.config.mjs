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
      'dist-admin-orders-test/**',
      'dist-admin-users-test/**',
      'dist-catalog-oversight-test/**',
      'dist-data-exports-test/**',
      'dist-delivery-agents-test/**',
      'dist-notifications-test/**',
      'dist-operational-overview-test/**',
      'dist-platform-settings-test/**',
      'dist-audit-logs-test/**',
      'dist-realtime-control-tower-test/**',
      'dist-support-test/**',
      'dist-vendor-stores-test/**',
      'build/**',
      'node_modules/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
];
