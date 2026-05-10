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
          {
            group: ['@ecom/shared', '@ecom/shared/*'],
            message: '@ecom/contracts is a stable leaf layer — it cannot import from @ecom/shared.'
          },
          {
            group: ['@ecom/database', '@ecom/nestjs-core',
              '@ecom/shared/pagination/prisma', '@ecom/shared/pagination/nestjs'],
            message: 'UI packages cannot import backend/server modules.'
          },
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
