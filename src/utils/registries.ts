import fs from 'node:fs'
import path from 'node:path'

import { yellow } from 'picocolors'
import { $ } from 'execa'
import type { Registries, RegistryName } from '../types'

const NNRM = path.join(process.env.HOME || process.env.USERPROFILE, '.nnrm')
const NNRM_REGISTRIES = path.join(NNRM, 'registries.json')

export async function getCustomRegistry() {
  let customRegistries: Registries = {}
  try {
    customRegistries = JSON.parse(fs.readFileSync(NNRM_REGISTRIES, 'utf-8'))
  }
  catch (e) {
    const msg = `\nWe will create '${yellow(
      NNRM_REGISTRIES,
    )}' to record your custom registries.\n`
    console.log(msg)

    if (!fs.existsSync(NNRM)) {
      try {
        fs.mkdirSync(NNRM, { recursive: true })
      }
      catch (e: any) {
        // permission denied
        console.log(e.message)
        await $`mkdir ${NNRM}`.catch((e) => {
          console.log(e.message)
        })
      }
    }
    setCustomRegistry(customRegistries)
  }
  return customRegistries
}

/**
 * write ~/.nnrm/registries.json
 */
function setCustomRegistry(registries: Registries) {
  return fs.writeFileSync(NNRM_REGISTRIES, JSON.stringify(registries, null, 2))
}

/**
 * add custom registry
 */
export async function addCustomRegistry(name: RegistryName, url: string, home: string) {
  const customRegistries = await getCustomRegistry()

  // npm config set registry auto add '/'
  if (url.slice(-1) !== '/')
    url += '/'

  customRegistries[name] = {
    home,
    registry: url,
  }
  setCustomRegistry(customRegistries)
}

/**
 * remove a custom registry
 */
export async function removeCustomRegistry(name: string) {
  const customRegistries = await getCustomRegistry()
  if (customRegistries[name])
    delete customRegistries[name]

  setCustomRegistry(customRegistries)
}
