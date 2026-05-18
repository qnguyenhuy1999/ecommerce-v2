import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/database.module.ts', 'src/prisma.service.ts', 'src/client.ts'],
  format: ['esm', 'cjs'],
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['@prisma/client', '@prisma/adapter-pg'],
})
