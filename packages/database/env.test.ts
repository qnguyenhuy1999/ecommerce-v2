import assert from 'node:assert/strict'
import test from 'node:test'

import { loadDatabaseEnv } from './env'

test('loadDatabaseEnv loads DATABASE_URL from workspace root env file', () => {
  const previousDatabaseUrl = process.env['DATABASE_URL']

  delete process.env['DATABASE_URL']
  loadDatabaseEnv()

  assert.match(process.env['DATABASE_URL'] ?? '', /^postgresql:\/\//)

  if (previousDatabaseUrl === undefined) {
    delete process.env['DATABASE_URL']
    return
  }

  process.env['DATABASE_URL'] = previousDatabaseUrl
})
