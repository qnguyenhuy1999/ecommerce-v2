import base from '@ecom/eslint-config/react-library'

export default [
  ...base,
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'sonarjs/prefer-read-only-props': 'off',
    },
  },
  {
    files: ['src/**/*.stories.tsx'],
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
    },
  },
]
