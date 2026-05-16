import type { Linter } from 'eslint'
import baseConfig from './eslint.js'

const reactLibraryConfig: Linter.Config[] = [
  ...baseConfig,
  {
    files: ['**/*.{jsx,tsx}'],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
]

export default reactLibraryConfig
export { reactLibraryConfig }
