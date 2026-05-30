import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: [
      'node_modules/**',
      'android/**',
      'ios/**',
      'metro.config.js',
      'dist-access-control-smoke/**',
      'dist-notifications-test/**',
      'dist-push-notifications-test/**',
      'dist-realtime-operations-test/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
];
