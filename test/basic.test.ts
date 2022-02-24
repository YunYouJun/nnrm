import { execa } from 'execa'
import { expect, test } from 'vitest'
import registries from '../registries.json'

const nnrmCommand = async (...args: string[]) => {
  return await execa('node', ['index.js', ...args])
}

test('nnrm ls', async () => {
  const name = 'npm'
  const { stdout } = await nnrmCommand('ls')
  expect(stdout.includes(name) && stdout.includes(registries[name].registry)).toBe(true)
})

// test('nnrm use', async () => {
//   const checkUse = async (registry: string) => {
//     const { stdout } = await nnrmCommand('use', registry)
//     // to debug, why this can not affect global registry?
//     // had removed .npmrc
//     expect(stdout.includes(`* ${registry}`)).toBe(true)
//   }

//   await checkUse('yarn')
//   await checkUse('taobao')
// })

const name = 'yyj'

test('nnrm add', async () => {
  const url = 'https://www.yunyoujun.cn'
  const { stdout } = await nnrmCommand('add', name, url)
  expect(stdout.includes(name) && stdout.includes(url)).toBe(true)

  // const test = await nnrmCommand('remove', name)
  // console.log(test.stdout)
})

test('nnrm remove', async () => {
  const { stdout } = await nnrmCommand('remove', name)
  expect(stdout.includes(name)).toBe(false)
})
