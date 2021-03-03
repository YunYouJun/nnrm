const execa = require("execa");
const chalk = require("chalk");
const fetch = require("node-fetch");

const registries = require("./registries.json");

const cli = require("cac")();
const pkg = require("./package.json");

const keys = Object.keys(registries);
const len = Math.max(...keys.map((key) => key.length)) + 3;

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

async function getCurrentRegistry(pkgManager = "npm") {
  const { stdout } = await execa(pkgManager, ["config", "get", "registry"]);
  for (const name in registries) {
    if (registries[name].registry === stdout) {
      return name;
    }
  }
}

async function setCurrentRegistry(name, pkgManager = "npm") {
  await execa(pkgManager, [
    "config",
    "set",
    "registry",
    registries[name].registry,
  ]);
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

async function listDelayTime() {
  return await Promise.all(
    Object.keys(registries).map(async (key) => {
      const delayTime = await getDelayTime(registries[key].registry);
      const item = ` ${dashline(key, len)} ${delayTime}`;
      console.log(item);
    })
  );
}

/**
 * @param {string} pkgManager npm|yarn
 */
function main(pkgManager) {
  cli.command("ls", "List all the registries").action(async () => {
    await listRegistry(pkgManager);
  });

  cli.command("use [registry]", "Change registry").action(async (registry) => {
    if (!registry) {
      console.log("\n  nnrm use <registry>\n  Example: nnrm use taobao\n");
    } else {
      await setCurrentRegistry(registry, pkgManager);
      await listRegistry(pkgManager);
    }
  });

  cli
    .command("test", "Show response time for all registries")
    .action(async () => {
      console.log();
      await listDelayTime();
      console.log();
    });

  cli.help();
  cli.version(pkg.version);
  cli.parse();
}

module.exports = {
  listRegistry,
  listDelayTime,
  setCurrentRegistry,
  main,
};
