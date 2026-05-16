import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'constants/index': 'src/constants/index.ts',
    'utils/index': 'src/utils/index.ts',
    'errors/index': 'src/errors/index.ts',
    'pagination/core/index': 'src/pagination/core/index.ts',
    'pagination/prisma/index': 'src/pagination/prisma/index.ts',
    'pagination/react/index': 'src/pagination/react/index.ts',
    'pagination/nestjs/index': 'src/pagination/nestjs/index.ts',
  },
  format: ['cjs', 'esm'],
  dts: { compilerOptions: { ignoreDeprecations: '6.0' } },
  splitting: false,
  sourcemap: true,
  clean: true,
  target: 'es2022',
  platform: 'neutral',
  esbuildOptions(options) {
    options.keepNames = true
  },
})
