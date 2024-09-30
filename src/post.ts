import core from '@actions/core'
import exec from '@actions/exec'

interface PostState {
  or8n?: boolean
  key?: string
  debug?: boolean
  id?: string
  paths?: string
  pwOutputDir?: string
  matrixIndex?: string
  marixTotal?: string
}

function getPostState(): PostState {
  return {
    key: core.getState('key') ?? process.env.CURRENTS_RECORD_KEY,
    debug: core.getState('debug') === 'true',
    id: core.getInput('id'),
    paths: core.getInput('paths'),
    pwOutputDir: core.getInput('pw-output-dir'),
    matrixIndex: core.getInput('matrix-index'),
    marixTotal: core.getInput('matrix-total')
  }
}

async function run(): Promise<void> {
  try {
    const state = getPostState()

    // Prepare cache set command with dynamic inputs
    const cacheSetCommand = `npx currents cache set \
        --key ${state.key} \
        --preset last-run \
        --id ${state.id} \
        --pw-output-dir ${state.pwOutputDir} \
        --matrix-index ${state.matrixIndex} \
        --matrix-total ${state.marixTotal}`

    // Execute cache set command
    await exec.exec(cacheSetCommand)
  } catch (error) {
    core.setFailed((error as Error).message)
  }
}

run()
