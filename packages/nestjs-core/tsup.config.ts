import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: { compilerOptions: { ignoreDeprecations: '6.0' } },
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
  outExtension({ format }) {
    return format === 'cjs' ? '.cjs' : '.mjs'
  },
})
