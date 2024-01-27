/**
 * generate equal width name with dashLine
 */
export function dashLine(registries: Record<string, any>, str: string) {
  const maxCharWidth
    = Math.max(...Object.keys(registries).map(key => key.length)) + 3

  const line = Array.from({ length: Math.max(1, maxCharWidth - str.length) }).join('-')
  return `${str} ${line}`
}

/**
 * Ensure suffix of a string
 */
export function ensureSuffix(suffix: string, str: string) {
  if (!str.endsWith(suffix))
    return str + suffix
  return str
}
