#!/usr/bin/env node
const cli = require("cac")();
const execa = require("execa");
const chalk = require("chalk");
const fetch = require("node-fetch");
const pkg = require("./package.json");
const registries = require("./registries.json");

const keys = Object.keys(registries);
const len = Math.max(...keys.map((key) => key.length)) + 3;

cli.command("ls", "List all the registries").action(async () => {
  await listRegistry();
});

cli.command("use [registry]", "Change registry").action(async (registry) => {
  if (!registry) {
    console.log("\n  nnrm use <registry>\n  Example: nnrm use taobao\n");
  } else {
    await setCurrentRegistry(registry);
    await listRegistry();
  }
});

cli
  .command("test", "Show response time for all registries")
  .action(async () => {
    console.log();
    await Promise.all(
      Object.keys(registries).map(async (key) => {
        const delayTime = await getDelayTime(registries[key].registry);
        const item = ` ${dashline(key, len)} ${delayTime}`;
        console.log(item);
      })
    );
    console.log();
  });

cli.help();
cli.version(pkg.version);
cli.parse();

function dashline(str, len) {
  var line = new Array(Math.max(1, len - str.length)).join("-");
  return str + " " + line;
}

/**
 * Show all npm registries
 */
async function listRegistry() {
  let list = "";

  const currentRegistries = await getCurrentRegistry();
  keys.forEach((key) => {
    const isCurrentRegistry = key === currentRegistries;
    const prefix = isCurrentRegistry ? "*" : " ";
    const item = `\n ${prefix} ${dashline(key, len)} ${
      registries[key].registry
    }`;
    list += isCurrentRegistry ? chalk.green(item) : item;
  });
  console.log(list + "\n");
  return list;
}

async function getCurrentRegistry() {
  const { stdout } = await execa("npm", ["config", "get", "registry"]);
  for (const name in registries) {
    if (registries[name].registry === stdout) {
      return name;
    }
  }
}

async function setCurrentRegistry(name) {
  await execa("npm", ["config", "set", "registry", registries[name].registry]);
}

/**
 * delay time
 * @param {string} url
 */
async function getDelayTime(url) {
  const start = +new Date();
  return fetch(url)
    .then(() => {
      return `${new Date() - start} ms`;
    })
    .catch((e) => {
      return "Timeout";
    });
}
