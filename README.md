# nnrm

New npm registry manager.

Use smaller dependencies than [nrm](https://github.com/Pana/nrm).

## Install

```sh
# install
yarn global add nnrm
npm install -g nnrm
```

## Usage

`nnrm` & `nrm` is used to toggle npm registry.

`nyrm` & `yrm` is used to toggle yarn registry.

```sh
nnrm ls
# nrm ls
# yrm ls
nnrm use taobao
# nrm use taobao
# yrm use taobao
nnrm test
# nrm test
# yrm test
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

### Add custom registry

```sh
nnrm add example https://xxx.com
# nnrm remove example
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

- use node-fetch instead of request for speed test
- use execa instead of npm
- use cac instead of commander
- asynchronously display source speed test results
- colorful info
- support npm and yarn

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
