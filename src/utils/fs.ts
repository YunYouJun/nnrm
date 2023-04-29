import fs from 'node:fs'

export function readJson(file: string) {
  return JSON.parse(fs.readFileSync(file, 'utf-8'))
}
