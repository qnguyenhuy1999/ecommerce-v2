import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/providers/ThemeProvider.tsx'],
  format: ['esm', 'cjs'],
  dts: { compilerOptions: { ignoreDeprecations: '6.0' } },
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
  esbuildOptions(options) {
    options.jsx = 'automatic'
    options.alias = {
      '@': './src',
    }
  },
})
