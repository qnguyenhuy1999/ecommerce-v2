import baseConfig from './index.js'

const reactLibraryConfig = [
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
