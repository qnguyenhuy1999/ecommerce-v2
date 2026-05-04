import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/providers/ThemeProvider.tsx'],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
  outExtension({ format }) {
    return format === 'cjs' ? '.cjs' : '.mjs'
  },
  esbuildOptions(options) {
    options.jsx = 'automatic'
  },
})
