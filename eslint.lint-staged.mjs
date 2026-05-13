/**
 * Lightweight ESLint config for lint-staged (pre-commit hook).
 *
 * Skips type-checked rules (recommendedTypeChecked + projectService)
 * which require spinning up the TypeScript compiler and are the main
 * reason the pre-commit hook is slow in this monorepo.
 *
 * Full type-aware linting still runs in CI via `turbo lint`.
 */
import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import tseslint from 'typescript-eslint'
import sonarjs from 'eslint-plugin-sonarjs'
import unicorn from 'eslint-plugin-unicorn'
import unusedImports from 'eslint-plugin-unused-imports'

export default [
  {
    ignores: [
      '**/dist/**',
      '**/.next/**',
      '**/node_modules/**',
      '**/.turbo/**',
      '**/storybook-static/**',
      '**/generated/**',
    ],
  },
  js.configs.recommended,
  // Use only `recommended` (no type-checking) instead of `recommendedTypeChecked`
  ...tseslint.configs.recommended,
  sonarjs.configs.recommended,
  {
    plugins: {
      unicorn,
      'unused-imports': unusedImports,
    },
    rules: {
      // ─── Core safety ───
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'prefer-const': 'error',
      'no-throw-literal': 'error',

      // ─── Unused imports (auto-fixable) ───
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
      ],

      // ─── TypeScript (non-type-checked only) ───
      '@typescript-eslint/no-unused-vars': 'off', // handled by unused-imports
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      '@typescript-eslint/no-non-null-assertion': 'warn',

      // ─── Unicorn (selective) ───
      'unicorn/prefer-node-protocol': 'error',
      'unicorn/no-array-for-each': 'warn',
      'unicorn/prefer-array-find': 'warn',
      'unicorn/no-useless-undefined': 'warn',

      // ─── Sonarjs overrides ───
      'sonarjs/cognitive-complexity': ['warn', 20],
      'sonarjs/no-duplicate-string': 'off',
      'sonarjs/prefer-read-only-props': 'off',
      'sonarjs/no-nested-conditional': 'off',
      'sonarjs/function-return-type': 'off',
      'sonarjs/void-use': 'off',

      // ─── Complexity guards ───
      'max-depth': ['warn', 4],
      'max-lines-per-function': ['warn', { max: 150, skipBlankLines: true, skipComments: true }],
    },
  },
  prettier,
]
