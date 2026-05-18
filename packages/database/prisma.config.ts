import { defineConfig } from 'prisma/config'
import { loadDatabaseEnv } from './env'

loadDatabaseEnv()

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url:
      process.env['DATABASE_URL'] ??
      'postgresql://postgres:1234@localhost:5432/ecommerce?schema=public',
  },
})
