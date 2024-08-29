import { existsSync, promises as fs } from 'node:fs'

import { $ } from 'execa'
import { green, red, yellow } from 'picocolors'
import fetch from 'node-fetch'

import { cac } from 'cac'

import pkg from '../../package.json'

// init default and custom registries
import defaultRegistries from '../../registries.json'
import {
  addCustomRegistry,
  getCustomRegistry,
  removeCustomRegistry,
} from './registries'
import { dashLine, ensureSuffix } from './common'

export * from './common'
export * from './registries'

// init default and custom registries

const cli = cac()

// init in main
export const store: {
  pkgManager: 'npm' | 'yarn' | 'pnpm' | string
  registries: Record<string, any>
} = {
  pkgManager: 'npm',
  registries: {},
}

/**
 * get default and custom registries
 */
export async function getAllRegistries() {
  const customRegistries = await getCustomRegistry()
  return Object.assign({}, defaultRegistries, customRegistries)
}

export async function getRegistriesList() {
  let list = ''
  const currentRegistry = await getCurrentRegistry(store.pkgManager)

  let inList = false

  Object.keys(store.registries).forEach((key) => {
    const isCurrentRegistry = key === currentRegistry
    if (isCurrentRegistry)
      inList = true
    const prefix = isCurrentRegistry ? '*' : ' '
    const item = `\n ${prefix} ${dashLine(store.registries, key)} ${store.registries[key].registry}`
    list += isCurrentRegistry ? green(item) : item
  })

  return {
    inList,
    list,
    currentRegistry,
  }
}

/**
 * Show all npm registries
 */
export async function listRegistries() {
  const { inList, list, currentRegistry } = await getRegistriesList()

  if (!inList)
    console.log(`\n  ${red('Unknown')} registry: ${yellow(currentRegistry)}`)
  console.log(`${list}\n`)
  return list
}

export async function getCurrentRegistry(pkgManager = 'npm') {
  let registry = ''
  try {
    const { stdout = '' } = await $`${pkgManager} config get registry`
    registry = stdout.trim()
  }
  catch {
    // for yarn v3
    const { stdout = '' } = await $`${pkgManager} config get npmRegistryServer`
    registry = stdout.trim()
  }

  for (const name in store.registries) {
    if (store.registries[name].registry === ensureSuffix('/', registry))
      return name
  }
  return registry
}

/**
 * https://docs.npmjs.com/cli/v7/commands/npm-config
 */
export async function setCurrentRegistry(name: string, pkgManager = 'npm') {
  if (!store.registries[name]) {
    console.log(`\n  ${red('Unknown')} registry: ${yellow(name)}`)
    return
  }

  await $`${pkgManager} config set registry ${store.registries[name].registry}`
}

/**
 * delay time
 */
async function getDelayTime(url: string) {
  const start = +new Date()
  return fetch(url)
    .then(() => {
      const time = +(new Date()) - start
      const msg = `${time} ms`
      if (time < 500)
        return green(msg)

      else if (time < 1000)
        return yellow(msg)

      else
        return red(msg)
    })
    .catch((_e) => {
      return red('Timeout')
    })
}

/**
 * list registries delay time
 */
export async function listDelayTime() {
  return await Promise.all(
    Object.keys(store.registries).map(async (key) => {
      const delayTime = await getDelayTime(store.registries[key].registry)
      const item = ` ${dashLine(store.registries, key)} ${delayTime}`
      console.log(item)
    }),
  )
}

async function onLs() {
  await listRegistries()
}

/**
 * @param pkgManager npm|yarn
 */
export async function main(pkgManager = 'npm') {
  // init
  store.registries = await getAllRegistries()
  store.pkgManager = pkgManager

  cli.command('ls', 'List all the registries').action(onLs)

  cli
    .command('use [registry]', 'Change registry')
    .option('-l, --local', 'set \'.npmrc\' for local')
    .action(async (registry, options) => {
      if (!registry) {
        console.log(
          `\n  nnrm use <registry>\n  Example: ${yellow(
            'nnrm use taobao',
          )}\n`,
        )
      }
      else if (options.l || options.local) {
        const registryText = `registry=${store.registries[registry].registry}`
        if (existsSync('.npmrc')) {
          const content = await fs.readFile('.npmrc', 'utf-8')
          await fs.writeFile(
            '.npmrc',
            content.replace(/^registry=.*/gm, registryText),
          )
        }
        else {
          await fs.writeFile('.npmrc', registryText)
          await listRegistries()
        }
      }
      else {
        await setCurrentRegistry(registry, pkgManager)
        await listRegistries()
      }
    })

  cli
    .command('test', 'Show response time for all registries')
    .action(async () => {
      console.log()
      await listDelayTime()
      console.log()
    })

  cli
    .command('add <registry> <url> [home]', 'Add a custom registry')
    .action(async (name, url, home) => {
      await addCustomRegistry(name, url, home)
      store.registries = await getAllRegistries()
      await listRegistries()
    })

  cli
    .command('remove <registry>', 'Remove a custom registry')
    .action(async (name) => {
      await removeCustomRegistry(name)
      store.registries = await getAllRegistries()
      await listRegistries()
    })

  cli.help()
  cli.version(pkg.version)
  cli.parse()
}
