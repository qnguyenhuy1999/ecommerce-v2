import { build } from 'tsup'

await build({
  config: false,
  entry: {
    index: 'src/index.ts',
    'database.module': 'src/database.module.ts',
    'prisma.service': 'src/prisma.service.ts',
    client: 'src/client.ts',
  },
  format: ['esm', 'cjs'],
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['@prisma/client', '@prisma/adapter-pg'],
})
