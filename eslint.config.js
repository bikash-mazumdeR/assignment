import js from '@eslint/js';
import ts from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';

export default ts.config(
  js.configs.recommended,
  ...ts.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: ts.parser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    ...playwright.configs['flat/recommended'],
    files: ['tests/**/*.spec.ts', 'tests/**/*.test.ts'],
  },
  {
    ignores: [
      'node_modules',
      'dist',
      'playwright-report',
      'test-results',
      'allure-results',
      'allure-report',
      'logs',
      'playwright',
    ],
  },
);
