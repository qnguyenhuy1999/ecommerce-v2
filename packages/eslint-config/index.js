import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import tseslint from 'typescript-eslint'
import sonarjs from 'eslint-plugin-sonarjs'
import unicorn from 'eslint-plugin-unicorn'
import unusedImports from 'eslint-plugin-unused-imports'

const baseConfig = [
  {
    ignores: [
      '**/dist/**',
      '**/.next/**',
      '**/node_modules/**',
      '**/.turbo/**',
      '**/storybook-static/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  sonarjs.configs.recommended,
  {
    files: ['**/*.{ts,tsx,mts,cts}'],
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
  },
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

      // ─── Unused imports ───
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
      ],

      // ─── TypeScript overrides ───
      '@typescript-eslint/no-unused-vars': 'off', // handled by unused-imports
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-call': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'error',
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      '@typescript-eslint/no-non-null-assertion': 'warn',

      // ─── Unicorn (selective) ───
      'unicorn/prefer-node-protocol': 'error',
      'unicorn/no-array-for-each': 'warn',
      'unicorn/prefer-array-find': 'warn',
      'unicorn/no-useless-undefined': 'warn',

      // ─── Sonarjs overrides ───
      'sonarjs/cognitive-complexity': ['warn', 20],
      'sonarjs/no-duplicate-string': 'off', // too noisy for DTOs
      'sonarjs/prefer-read-only-props': 'off', // too noisy for React prop interfaces
      'sonarjs/no-nested-conditional': 'off', // spread spread-based optional props trigger false positives
      'sonarjs/function-return-type': 'off', // useMemo return type inference is sufficient

      // ─── Complexity guards ───
      'max-depth': ['warn', 4],
      'max-lines-per-function': ['warn', { max: 150, skipBlankLines: true, skipComments: true }],
    },
  },
  prettier,
  // ─── Architectural boundary rules ───
  {
    files: ['packages/shared/**'],
    rules: {
      'no-restricted-imports': ['warn', {
        patterns: [
          {
            group: ['@ecom/contracts', '@ecom/database', '@ecom/auth',
              '@ecom/redis', '@ecom/email', '@ecom/core-ui',
              '@ecom/ui-admin', '@ecom/ui-seller', '@ecom/ui-storefront',
              '@ecom/config', '@ecom/nestjs-core'],
            message: '@ecom/shared is a leaf package — it cannot import internal workspace packages. Use external libs only.'
          },
        ]
      }]
    }
  },
  {
    files: ['packages/contracts/**'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          {
            group: ['@ecom/shared', '@ecom/shared/*'],
            message: '@ecom/contracts is a stable leaf layer — it cannot import from @ecom/shared.'
          },
          {
            group: ['@nestjs/swagger', '@nestjs/swagger/*'],
            message: '@ecom/contracts MUST NOT import @nestjs/swagger. Use class-validator only. Add @ApiProperty in packages/nestjs-openapi or apps/api-* instead.'
          },
        ]
      }]
    }
  },
  {
    files: ['apps/storefront/**', 'apps/admin/**', 'apps/seller/**', 'packages/ui-*/**', 'packages/core-ui/**'],
    rules: {
      'no-restricted-imports': ['warn', {
        patterns: [
          {
            group: ['@ecom/database', '@ecom/nestjs-core',
              '@ecom/shared/pagination/prisma', '@ecom/shared/pagination/nestjs'],
            message: 'UI packages cannot import backend/server modules.'
          },
        ]
      }]
    }
  },
  {
    files: ['apps/api-*/**', 'packages/auth/**', 'packages/database/**'],
    rules: {
      'no-restricted-imports': ['warn', {
        patterns: [
          {
            group: ['@ecom/shared/pagination/react'],
            message: 'Backend packages cannot import React hooks/modules.'
          },
        ]
      }]
    }
  },
  {
    files: ['**/generated/**'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
    },
  },
]

export default baseConfig
export { baseConfig }
