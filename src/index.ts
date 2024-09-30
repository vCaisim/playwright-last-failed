import * as core from '@actions/core'
import * as exec from '@actions/exec'

// Define interface for inputs
interface ActionInputs {
  // set
  or8n?: boolean
  key?: string
  debug?: boolean
  id?: string
  paths?: string
  outputDir?: string
  pwOutputDir?: string
  matrixIndex?: string
  matrixTotal?: string
}

// Get inputs with types
function getInputs(): ActionInputs {
  return {
    key: core.getInput('key') ?? process.env.CURRENTS_RECORD_KEY,
    debug: core.getBooleanInput('debug'),
    id: core.getInput('id'),
    paths: core.getInput('paths'),
    outputDir: core.getInput('output-dir'),
    pwOutputDir: core.getInput('pw-output-dir') || 'test-results',
    matrixIndex: core.getInput('matrix-index') || '1',
    matrixTotal: core.getInput('matrix-total') || '1'
  }
}

async function run(): Promise<void> {
  try {
    const inputs = getInputs()

    await exec.exec('npm install -g @currents/cmd@beta')

    const presetOutput = '.currents_env'

    const options: string[] = [
      `--preset last-run`,
      `--preset-output ${presetOutput}`,
      `--matrix-index ${inputs.matrixIndex}`,
      `--matrix-total ${inputs.matrixTotal}`
    ]

    if (inputs.key) {
      options.push(`--key ${inputs.key}`)
    }

    if (inputs.id) {
      options.push(`--id ${inputs.id}`)
    }

    if (inputs.outputDir) {
      options.push(`--output-dir ${inputs.outputDir}`)
    }

    if (inputs.debug) {
      options.push(`--debug`)
    }

    const cacheGetCommand = `npx currents cache get ${options.join(' ')}`

    await exec.exec(cacheGetCommand)

    const extraPwFlags = await exec.getExecOutput(`cat ${presetOutput}`)
    core.setOutput('extra-pw-flags', extraPwFlags.stdout.trim())

    core.saveState('key', inputs.key)
    core.saveState('debug', inputs.debug)
    core.saveState('id', inputs.id)
    core.saveState('paths', inputs.paths || '')
    core.saveState('pwOutputDir', inputs.pwOutputDir)
    core.saveState('matrixIndex', inputs.matrixIndex)
    core.saveState('matrixTotal', inputs.matrixTotal)
  } catch (error) {
    core.setFailed((error as Error).message)
  }
}

run()
