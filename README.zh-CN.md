# nnrm

English Docs | [中文文档](./README.zh-CN.md)

[![npm](https://img.shields.io/npm/v/nnrm)](https://www.npmjs.com/package/nnrm)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/yunyoujun/nnrm)
[![node-current](https://img.shields.io/node/v/nnrm)](https://nodejs.dev/)
![npm](https://img.shields.io/npm/dt/nnrm)
![Libraries.io dependency status for latest release](https://img.shields.io/librariesio/release/npm/nnrm)
![Snyk Vulnerabilities for npm scoped package](https://img.shields.io/snyk/vulnerabilities/npm/nnrm)

> nnrm = new nrm

新的 npm 源管理器。

相比 [nrm](https://github.com/Pana/nrm) 使用了更小的依赖。

> [由来](https://www.yunyoujun.cn/posts/nnrm-new-nrm/)

## 安装

```sh
# install
npm install -g nnrm
yarn global add nnrm
pnpm add -g nnrm
```

## 使用

以下命令是用来切换对应的包管理工具的源。

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

# 设置本地的 `.npmrc`
nrm use taobao -l

nnrm test
# nrm test
# yrm test
# prm test
```

- `nnrm -h`: 显示帮助信息

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

### 添加/删除自定义源

```sh
# 添加自定义源
nnrm add example https://xxx.com
```

```sh
# 移除自定义源
nrm remove example
```

它将会被记录在你的 `~/.nnrm/registries.json`。

### 默认源

- npm -------- <https://registry.npmjs.org/>
- yarn ------- <https://registry.yarnpkg.com/>
- taobao ----- <https://registry.npmmirror.com/> （淘宝已将 `npm.taobao.org` 重定向至 `npmmirror.com`）
- tencent ---- <https://mirrors.cloud.tencent.com/npm/>
- npmMirror -- <https://skimdb.npmjs.com/registry/>
- github ----- <https://npm.pkg.github.com/>

## Features

nnrm 相比 nrm 的改进之处：

- 支持 yarn （yarn 与 npm 的 registry 是互相独立的，`pnpm` 则与 npm 相同）
- 极小的依赖
  - 使用 `node-fetch` (289B) 替代 `request` (184.8KB) 进行测速 [node-fetch vs axios vs request | npmtrends](https://www.npmtrends.com/node-fetch-vs-axios-vs-request)
  - 使用 `execa` (8.4KB) 替代 `npm` (455.4KB) 通过终端而非 node API 实现切换 [execa vs npm | npmtrends](https://www.npmtrends.com/execa-vs-npm)
  - 使用 `cac` (3.6KB) 替代 `commander` (6.8KB) 实现简单的终端 [cac vs commander | npmtrends](https://www.npmtrends.com/minimist-vs-commander-vs-cac)
- 异步地显示源测速结果
- 彩色的输出结果
- 每次修改后自动显示 registry 列表，并标记当前 registry

## FAQ

### 为什么要写新的 nrm?

nrm 依赖了已经弃用的 `request` 和包体较大的 `npm`，以及其他一些依赖。

所以在没有切换镜像源时，安装 nrm 是一件很慢的事情。

### 为什么使用 cac?

> [minimist vs commander vs cac | npm trends](https://www.npmtrends.com/minimist-vs-commander-vs-cac)

[minimist](https://github.com/substack/minimist) 仅仅 1.3 KB，但它只是一个参数解析工具。

我们需要一个可以自动生成帮助信息的工具。

[commander](https://github.com/tj/commander.js) 和 [cac](https://github.com/cacjs/cac) 可以做到。

cac(3.6KB) 相比 commander(6.8KB) 更小。~~并且它的名字取自我喜爱的动漫人物 C.C.~~

### 为什么使用 node-fetch?

> [node-fetch vs axios vs request](https://www.npmtrends.com/node-fetch-vs-axios-vs-request)

[node-fetch](https://github.com/node-fetch/node-fetch) 大小仅仅 289B!

[axios](https://github.com/axios/axios)(4.6KB) 很棒，但是 `node-fetch` 更小。

[request](https://github.com/request/request)(184.8KB) 已经被弃用了，而且它是如此的大。

### 为什么使用 [execa](https://github.com/sindresorhus/execa)?

> [execa vs shelljs](https://www.npmtrends.com/execa-vs-shelljs)

[execa](https://github.com/sindresorhus/execa) 大小仅仅 8.4KB。

安装 [npm](https://www.npmjs.com/package/npm) 包来使用 `npm.config.set('registry', 'xxx')` 的代价是十分昂贵的。

我们只需要执行本地的命令: `npm config set registry xxx`。

### Windows 报错？

如果您是 Windows 用户，您可能需要确保你使用 `bash` 等类 UNIX 通用命令行（而非 CMD）。

## 参考

- [npm-config | npm Docs](https://docs.npmjs.com/cli/v7/commands/npm-config)

## [赞助者](https://sponsors.yunyoujun.cn)

<p align="center">
  <a href="https://sponsors.yunyoujun.cn">
    <img src='https://cdn.jsdelivr.net/gh/YunYouJun/sponsors/public/sponsors.svg'/>
  </a>
</p>
