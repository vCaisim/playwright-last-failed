import core from '@actions/core'
import exec from '@actions/exec'

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
  marixTotal?: string
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
    matrixIndex: core.getInput('matrix-index') || '0',
    marixTotal: core.getInput('matrix-total') || '1'
  }
}

async function run(): Promise<void> {
  try {
    const inputs = getInputs()

    const envVars: { [key: string]: string } = {}
    if (inputs.debug) {
      envVars['DEBUG'] = 'currents,currents:*'
    }

    // Install @currents/cmd globally
    await exec.exec('npm install -g @currents/cmd@beta')

    const presetOutput = '.currents_env'

    // Prepare cache get command with dynamic inputs
    let cacheGetCommand = `npx currents cache get \
        --key ${inputs.key} \
        --id ${inputs.id}
        --preset last-run \
        --preset-output ${presetOutput} \
        --matrix-index ${inputs.matrixIndex} \
        --matrix-total ${inputs.marixTotal} \
        `
    if (inputs.outputDir) {
      cacheGetCommand += ` --output-dir ${inputs.outputDir}`
    }

    // Execute cache get command
    await exec.exec(cacheGetCommand, [], { env: envVars })

    // Capture and output extra Playwright flags
    const extraPwFlags = await exec.getExecOutput(`cat ${presetOutput}`)
    core.setOutput('extra-pw-flags', extraPwFlags.stdout.trim())

    // Save state for post.js
    core.saveState('key', inputs.key)
    core.saveState('debug', inputs.debug)
    core.saveState('id', inputs.id)
    core.saveState('paths', inputs.paths || '')
    core.saveState('pwOutputDir', inputs.pwOutputDir)
    core.saveState('matrixIndex', inputs.matrixIndex)
    core.saveState('marixTotal', inputs.marixTotal)
  } catch (error) {
    core.setFailed((error as Error).message)
  }
}

run()
