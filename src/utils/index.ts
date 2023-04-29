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

// init default and custom registries

const cli = cac()

// init in main
let registries: Record<string, any> = {}

/**
 * generate equal width name with dashline
 * @returns
 */
function dashline(str: string) {
  const maxCharWidth
    = Math.max(...Object.keys(registries).map(key => key.length)) + 3

  const line = new Array(Math.max(1, maxCharWidth - str.length)).join('-')
  return `${str} ${line}`
}

/**
 * Ensure suffix of a string
 */
function ensureSuffix(suffix: string, str: string) {
  if (!str.endsWith(suffix))
    return str + suffix
  return str
}

/**
 * get default and custom registries
 * @returns
 */
async function getAllRegistries() {
  const customRegistries = await getCustomRegistry()
  return Object.assign({}, defaultRegistries, customRegistries)
}

/**
 * Show all npm registries
 */
export async function listRegistries(pkgManager = 'npm') {
  let list = ''
  const currentRegistry = await getCurrentRegistry(pkgManager)

  let inList = false

  Object.keys(registries).forEach((key) => {
    const isCurrentRegistry = key === currentRegistry
    if (isCurrentRegistry)
      inList = true
    const prefix = isCurrentRegistry ? '*' : ' '
    const item = `\n ${prefix} ${dashline(key)} ${registries[key].registry}`
    list += isCurrentRegistry ? green(item) : item
  })
  if (!inList)
    console.log(`\n  ${red('Unknown')} registry: ${yellow(currentRegistry)}`)
  console.log(`${list}\n`)
  return list
}

async function getCurrentRegistry(pkgManager = 'npm') {
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

  for (const name in registries) {
    if (registries[name].registry === ensureSuffix('/', registry))
      return name
  }
  return registry
}

/**
 * https://docs.npmjs.com/cli/v7/commands/npm-config
 * @param {*} pkgManager
 * @returns
 */
export async function setCurrentRegistry(name: string, pkgManager = 'npm') {
  await $`${pkgManager} config set registry ${registries[name].registry}`
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
 * @returns
 */
export async function listDelayTime() {
  return await Promise.all(
    Object.keys(registries).map(async (key) => {
      const delayTime = await getDelayTime(registries[key].registry)
      const item = ` ${dashline(key)} ${delayTime}`
      console.log(item)
    }),
  )
}

/**
 * @param {string} pkgManager npm|yarn
 */
export async function main(pkgManager = 'npm') {
  // init
  registries = await getAllRegistries()

  const onLs = async () => {
    await listRegistries(pkgManager)
  }
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
      else {
        await setCurrentRegistry(registry, pkgManager)
        await listRegistries(pkgManager)
      }

      if (options.l || options.local) {
        const registryText = `registry=${registries[registry].registry}`
        if (existsSync('.npmrc')) {
          const content = await fs.readFile('.npmrc', 'utf-8')
          await fs.writeFile(
            '.npmrc',
            content.replace(/^registry=.*/gm, registryText),
          )
        }
        else {
          await fs.writeFile('.npmrc', registryText)
        }
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
      registries = await getAllRegistries()
      await listRegistries(pkgManager)
    })

  cli
    .command('remove <registry>', 'Remove a custom registry')
    .action(async (name) => {
      await removeCustomRegistry(name)
      registries = await getAllRegistries()
      await listRegistries(pkgManager)
    })

  cli.help()
  cli.version(pkg.version)
  cli.parse()
}
