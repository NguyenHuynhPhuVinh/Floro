import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      // TypeScript specific rules - AI-friendly settings
      '@typescript-eslint/no-explicit-any': 'off', // AI often uses any for prototyping
      '@typescript-eslint/explicit-function-return-type': 'off', // TypeScript can infer, saves tokens
      '@typescript-eslint/no-unused-vars': 'warn', // Warn instead of error
      '@typescript-eslint/prefer-interface': 'off',
      '@typescript-eslint/consistent-type-definitions': ['warn'],

      // General code quality rules
      'prefer-const': 'warn', // Warn instead of error for AI code
      'no-var': 'error',
      'no-console': 'off', // Allow console for debugging AI-generated code
      'no-debugger': 'error',

      // Import organization - DISABLED
      'import/order': 'off',

      // React specific rules
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
];

export default eslintConfig;
