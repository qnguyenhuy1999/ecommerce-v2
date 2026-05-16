import { defineConfig } from 'tsup'
import { copyFileSync, mkdirSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

function copyDir(src: string, dest: string) {
  mkdirSync(dest, { recursive: true })
  for (const entry of readdirSync(src)) {
    const srcPath = join(src, entry)
    const destPath = join(dest, entry)
    if (statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath)
    } else {
      copyFileSync(srcPath, destPath)
    }
  }
}

export default defineConfig({
  entry: ['src/index.ts', 'src/database.module.ts', 'src/prisma.service.ts', 'src/client.ts'],
  format: ['esm', 'cjs'],
  splitting: false,
  sourcemap: true,
  clean: true,
  // Mark everything from generated client as external
  external: ['@prisma/client', '@prisma/adapter-pg', /generated\/client/],
  async onSuccess() {
    // Copy the generated Prisma client to dist so relative imports resolve
    copyDir('src/generated', 'dist/generated')
    console.log('✓ Copied generated Prisma client to dist/')
  },
})
