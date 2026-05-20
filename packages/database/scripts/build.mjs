import { build } from 'tsup'
import { fileURLToPath } from 'node:url'

await build({
  config: false,
  entry: {
    index: fileURLToPath(new URL('../src/index.ts', import.meta.url)),
    'database.module': fileURLToPath(new URL('../src/database.module.ts', import.meta.url)),
    'prisma.service': fileURLToPath(new URL('../src/prisma.service.ts', import.meta.url)),
    client: fileURLToPath(new URL('../src/client.ts', import.meta.url)),
  },
  format: ['esm', 'cjs'],
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['@prisma/client', '@prisma/adapter-pg'],
})
