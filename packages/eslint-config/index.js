import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import tseslint from 'typescript-eslint'

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
  prettier,
  {
    files: ['packages/shared/**'],
    rules: {
      'no-restricted-imports': ['warn', {
        patterns: [
          {
            group: ['@ecom/contracts', '@ecom/database', '@ecom/auth', '@ecom/auth-next',
              '@ecom/redis', '@ecom/email', '@ecom/api-client', '@ecom/core-ui',
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
            // CRITICAL BOUNDARY: contracts must stay framework-light.
            // DTOs here are reused by frontend, SDK generators, and future GraphQL/gRPC.
            // Swagger decorators belong in packages/nestjs-openapi or apps/api-*.
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
]

export default baseConfig
export { baseConfig }
