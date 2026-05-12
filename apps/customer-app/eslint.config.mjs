import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: ['node_modules/**', 'android/**', 'ios/**', 'metro.config.js'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
];
