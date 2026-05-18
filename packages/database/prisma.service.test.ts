import assert from 'node:assert/strict'
import test from 'node:test'

test('prisma service import loads DATABASE_URL from workspace root env file', async () => {
  const previousDatabaseUrl = process.env['DATABASE_URL']

  delete process.env['DATABASE_URL']
  await import(new URL(`./src/prisma.service.ts?test=${Date.now()}`, import.meta.url).href)

  assert.match(process.env['DATABASE_URL'] ?? '', /^postgresql:\/\//)

  if (previousDatabaseUrl === undefined) {
    delete process.env['DATABASE_URL']
    return
  }

  process.env['DATABASE_URL'] = previousDatabaseUrl
})
