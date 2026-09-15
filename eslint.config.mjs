import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';

// Core subset of eslint-config-react-app, which Create React App used to apply
export default defineConfig([
  { ignores: ['build', 'coverage'] },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      'react-hooks': reactHooks,
    },
    rules: {
      'array-callback-return': 'warn',
      eqeqeq: ['warn', 'smart'],
      'no-caller': 'warn',
      'no-cond-assign': ['warn', 'except-parens'],
      'no-const-assign': 'warn',
      'no-dupe-keys': 'warn',
      'no-duplicate-case': 'warn',
      'no-eval': 'warn',
      'no-fallthrough': 'warn',
      'no-implied-eval': 'warn',
      'no-loop-func': 'warn',
      'no-self-assign': 'warn',
      'no-self-compare': 'warn',
      'no-sequences': 'warn',
      'no-template-curly-in-string': 'warn',
      'no-throw-literal': 'warn',
      'no-unreachable': 'warn',
      'no-useless-concat': 'warn',
      'no-useless-escape': 'warn',
      '@typescript-eslint/consistent-type-assertions': 'warn',
      '@typescript-eslint/no-array-constructor': 'warn',
      '@typescript-eslint/no-redeclare': 'warn',
      '@typescript-eslint/no-unused-expressions': ['error', {
        allowShortCircuit: true, allowTernary: true, allowTaggedTemplates: true,
      }],
      '@typescript-eslint/no-unused-vars': ['warn', { args: 'none', ignoreRestSiblings: true }],
      '@typescript-eslint/no-useless-constructor': 'warn',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
]);
