import { config } from 'dotenv'
import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

export function loadDatabaseEnv() {
  const envPath = findWorkspaceEnvPath()
  return config({
    path: envPath,
  })
}

function findWorkspaceEnvPath() {
  let currentDir = process.cwd()

  while (true) {
    const envPath = resolve(currentDir, '.env')
    if (existsSync(envPath)) {
      return envPath
    }

    const parentDir = dirname(currentDir)
    if (parentDir === currentDir) {
      return resolve(process.cwd(), '.env')
    }
    currentDir = parentDir
  }
}
