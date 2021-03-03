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

```sh
nnrm ls
nnrm use taobao
```

- `nnrm -h`: show help message
- `nnrm test`: show registry delay time

## Base

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
