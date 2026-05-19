import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    openapi: 'src/openapi/index.ts',
  },
  format: ['cjs', 'esm'],
  dts: { compilerOptions: { ignoreDeprecations: '6.0' } },
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
})
