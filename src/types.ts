export type RegistryName = 'npm' | 'yarn' | 'taobao' | 'tencent' | 'github' | 'npmMirror' | string

export interface Registry {
  registry: string
  home: string
}

export type Registries = Record<RegistryName, Registry>
