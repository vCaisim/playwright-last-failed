import * as core from '@actions/core'
import * as exec from '@actions/exec'

interface PostState {
  or8n?: boolean
  key?: string
  debug?: boolean
  id?: string
  paths?: string
  pwOutputDir?: string
  matrixIndex?: string
  matrixTotal?: string
}

function getPostState(): PostState {
  return {
    key: core.getState('key') ?? process.env.CURRENTS_RECORD_KEY,
    debug: core.getState('debug') === 'true',
    id: core.getState('id'),
    paths: core.getState('paths'),
    pwOutputDir: core.getState('pwOutputDir'),
    matrixIndex: core.getState('matrixIndex'),
    matrixTotal: core.getState('matrixTotal')
  }
}

async function run(): Promise<void> {
  try {
    const state = getPostState()

    // Prepare cache set command with dynamic inputs
    const options: string[] = [
      `--preset last-run`,
      `--matrix-index ${state.matrixIndex}`,
      `--matrix-total ${state.matrixTotal}`
    ]

    if (state.key) {
      options.push(`--key ${state.key}`)
    }

    if (state.id) {
      options.push(`--id ${state.id}`)
    }

    if (state.pwOutputDir) {
      options.push(`--pw-output-dir ${state.pwOutputDir}`)
    }

    if (state.debug) {
      options.push(`--debug`)
    }

    const cacheSetCommand = `npx currents cache set ${options.join(' ')}`

    await exec.exec(cacheSetCommand)
  } catch (error) {
    core.setFailed((error as Error).message)
  }
}

run()
