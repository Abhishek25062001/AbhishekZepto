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
      'dist-catalog-test/**',
      'dist-cart-test/**',
      'dist-checkout-test/**',
      'dist-orders-test/**',
      'dist-payment-test/**',
      'dist-profile-test/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
];
