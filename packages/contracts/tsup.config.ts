import { defineConfig } from 'tsup'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/enums/index.ts',
    'src/http/index.ts',
    'src/product/index.ts',
    'src/order/index.ts',
    'src/auth/index.ts',
    'src/common/index.ts',
    'src/generated/index.ts',
  ],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  minify: true,
  sourcemap: true,
})
