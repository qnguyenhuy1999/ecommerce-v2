import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'api-client': 'src/api-client.ts',
    'env/index': 'src/env/index.ts',
    'tooling/eslint': 'src/tooling/eslint.ts',
    'tooling/eslint-react-library': 'src/tooling/eslint-react-library.ts',
    'tooling/prettier': 'src/tooling/prettier.ts',
    'tooling/commitlint': 'src/tooling/commitlint.ts',
  },
  format: ['esm', 'cjs'],
  dts: false,
  clean: true,
  splitting: false,
  sourcemap: false,
  target: 'es2022',
})
