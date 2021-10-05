# nnrm

English Docs | [中文文档](./README.zh-CN.md)

[![npm](https://img.shields.io/npm/v/nnrm)](https://www.npmjs.com/package/nnrm)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/yunyoujun/nnrm)
[![node-current](https://img.shields.io/node/v/nnrm)](https://nodejs.dev/)
![npm](https://img.shields.io/npm/dt/nnrm)
![Libraries.io dependency status for latest release](https://img.shields.io/librariesio/release/npm/nnrm)
![Snyk Vulnerabilities for npm scoped package](https://img.shields.io/snyk/vulnerabilities/npm/nnrm)

> nnrm = new nrm

New npm registry manager.

Use smaller dependencies than [nrm](https://github.com/Pana/nrm).

> [由来](https://www.yunyoujun.cn/posts/nnrm-new-nrm/)

## Install

```sh
# install
npm install -g nnrm
yarn global add nnrm
pnpm add -g nnrms
```

## Usage

These commands are used to toggle the corresponding registry.

- `nnrm` & `nrm`: npm
- `nyrm` & `yrm`: yarn
- `prm`: pnpm

```sh
nnrm ls
# nrm ls
# yrm ls
# prm ls

nnrm use taobao
# nrm use taobao
# yrm use taobao
# prm use taobao

# set `.npmrc` for local
nrm use taobao -l

nnrm test
# nrm test
# yrm test
# prm test
```

- `nnrm -h`: show help message

```bash
Usage:
  $ nrm <command> [options]

Commands:
  ls                           List all the registries
  use [registry]               Change registry
  test                         Show response time for all registries
  add <registry> <url> [home]  Add a custom registry
  remove <registry>            Remove a custom registry

Options:
  -h, --help     Display this message
  -v, --version  Display version number
```

```bash
Usage:
  $ nrm use [registry]

Options:
  -l, --local    set '.npmrc' for local
```

### Add/Remove custom registry

```bash
nnrm add example https://xxx.com
```

```bash
nnrm remove example
```

It will be recorded in your `~/.nnrm/registries.json`.

### Default Registires

- npm -------- <https://registry.npmjs.org/>
- yarn ------- <https://registry.yarnpkg.com/>
- taobao ----- <https://registry.npm.taobao.org/>
- tencent ---- <https://mirrors.cloud.tencent.com/npm/>
- npmMirror -- <https://skimdb.npmjs.com/registry/>
- github ----- <https://npm.pkg.github.com/>

## Features

- Support `npm`/`yarn`/`pnpm` (the registry of `yarn` and `npm/pnpm` is independent of each other)
- Smaller Dependencies
  - Use `node-fetch` instead of `request` for speed test
  - Use `execa` instead of `npm`
  - Use `cac` instead of `commander`
- Asynchronously display source speed test results
- Colorful console info
- Automatically display the registry list after each modification, and mark the current registry

## FAQ

### Why new nrm?

nrm relies on the deprecated `request` with a larger package body, the `npm` package, and some other npm dependencies.

So installing nrm is also a very slow thing.

### Why cac?

> [minimist vs commander vs cac | npm trends](https://www.npmtrends.com/minimist-vs-commander-vs-cac)

[minimist](https://github.com/substack/minimist) is only 1.3 KB, but it is just a parameter parsing tool.

We need a tool that can automatically generate help information.

[commander](https://github.com/tj/commander.js) and [cac](https://github.com/cacjs/cac) can do it.

cac(3.6KB) is smaller than commander(6.8KB). ~~And i love C.C.~~

### Why node-fetch?

> [node-fetch vs axios vs request](https://www.npmtrends.com/node-fetch-vs-axios-vs-request)

[node-fetch](https://github.com/node-fetch/node-fetch) is only 289B!

[axios](https://github.com/axios/axios)(4.6KB) is good, but node-fetch is smaller.

[request](https://github.com/request/request)(184.8KB) has been deprecated and it is so big.

### Why [execa](https://github.com/sindresorhus/execa)?

> [execa vs shelljs](https://www.npmtrends.com/execa-vs-shelljs)

[execa](https://github.com/sindresorhus/execa) is only 8.4KB.

Install package [npm](https://www.npmjs.com/package/npm) to use `npm.config.set('registry', 'xxx')` is expensive.

We just need use local command: `npm config set registry xxx`.

### Error when use Windows?

If you are a Windows user, you may want to make sure that you use a generic command line like `bash` instead of `CMD`.
