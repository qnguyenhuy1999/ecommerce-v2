import fs from 'node:fs'
import path from 'node:path'

export function ensureWorkspaceEnvFileLoaded(): void {
  if (typeof process.loadEnvFile !== 'function') {
    return
  }

  let currentDirectory = process.cwd()

  for (let depth = 0; depth < 5; depth += 1) {
    const envPath = path.join(currentDirectory, '.env')

    if (fs.existsSync(envPath)) {
      process.loadEnvFile(envPath)
      return
    }

    const parentDirectory = path.dirname(currentDirectory)
    if (parentDirectory === currentDirectory) {
      return
    }

    currentDirectory = parentDirectory
  }
}
