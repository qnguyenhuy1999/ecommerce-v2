import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'api-client': 'src/api-client.ts',
    'env/index': 'src/env/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: false,
  clean: true,
  splitting: false,
  sourcemap: false,
  target: 'es2022',
})
