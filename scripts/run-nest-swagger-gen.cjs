const { spawnSync } = require('node:child_process')
const path = require('node:path')

const env = {
  ...process.env,
  GENERATE_SWAGGER: 'true',
}

const nestBin = path.join(
  process.cwd(),
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'nest.CMD' : 'nest',
)

const result =
  process.platform === 'win32'
    ? spawnSync(process.env.ComSpec || 'cmd.exe', ['/d', '/s', '/c', `${nestBin} start --entryFile main`], {
        stdio: 'inherit',
        env,
      })
    : spawnSync(nestBin, ['start', '--entryFile', 'main'], {
        stdio: 'inherit',
        env,
      })

if (result.error) {
  throw result.error
}

process.exit(result.status ?? 1)
