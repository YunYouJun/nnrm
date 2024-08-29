import { $ } from 'execa'
import { beforeAll, describe, expect, it } from 'vitest'
import registries from '../registries.json'
import { addCustomRegistry, getAllRegistries, getCurrentRegistry, getRegistriesList, removeCustomRegistry, setCurrentRegistry, store } from '../src/utils'

async function nnrmCommand(...args: string[]) {
  return await $`node dist/index.js ${args.join(' ')}`
}

const customRegistry = {
  name: 'yyj',
  url: 'https://www.yunyoujun.cn',
  urlWithSlash: 'https://www.yunyoujun.cn/',
}

describe('nnrm ls', () => {
  beforeAll(async () => {
    // init
    store.registries = await getAllRegistries()
    store.pkgManager = 'npm'
  })

  const name = 'npm'

  it('command', async () => {
    const { stdout } = await nnrmCommand('ls')
    expect(stdout.includes(name) && stdout.includes(registries[name].registry)).toBe(true)
  })

  it('list', async () => {
    const { list } = await getRegistriesList()
    expect(list.includes(name) && list.includes(registries[name].registry)).toBe(true)
  })
})

async function useRegistry(registry: string) {
  await setCurrentRegistry(registry, 'npm')
}

describe('nnrm use', () => {
  // use setTimeout to wait `npm config set` `npm config get`
  it('use toggle', async () => {
    await useRegistry('taobao')
    setTimeout(async () => {
      expect(await getCurrentRegistry()).toBe('taobao')
    }, 50)

    setTimeout(async () => {
      await useRegistry('npm')
      setTimeout(async () => {
        expect(await getCurrentRegistry()).toBe('npm')
      }, 50)
    }, 50)
  })
})

describe('nnrm add', () => {
  it('add', async () => {
    const { name, url, urlWithSlash } = customRegistry
    await addCustomRegistry(name, url)
    store.registries = await getAllRegistries()
    expect(store.registries[name]).toStrictEqual({
      home: urlWithSlash,
      registry: urlWithSlash,
    })
  })

  it('list after add', async () => {
    const { name, url } = customRegistry
    const { inList, list } = await getRegistriesList()
    expect(inList).toBe(true)
    expect(list.includes(name) && list.includes(url)).toBe(true)
  })
})

describe('nnrm remove', () => {
  it('utils', async () => {
    expect(store.registries[customRegistry.name]).not.toBeUndefined()
    await removeCustomRegistry(customRegistry.name)
    store.registries = await getAllRegistries()
    expect(store.registries[customRegistry.name]).toBeUndefined()
  })
})
