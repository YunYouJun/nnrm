const execa = require("execa");
const chalk = require("chalk");
const fetch = require("node-fetch");

const cli = require("cac")();
const pkg = require("../package.json");

const {
  getCustomRegistry,
  addCustomRegistry,
  removeCustomRegistry,
} = require("./registries");

// init default and custom registries
const defaultRegistries = require("../registries.json");
let registries = getAllRegistries();

/**
 * generate equal width name with dashline
 * @param {string} str
 * @returns
 */
function dashline(str) {
  const maxCharWidth =
    Math.max(...Object.keys(registries).map((key) => key.length)) + 3;

  const line = new Array(Math.max(1, maxCharWidth - str.length)).join("-");
  return str + " " + line;
}

/**
 * get default and custom registries
 * @returns
 */
function getAllRegistries() {
  const customRegistries = getCustomRegistry();
  return Object.assign({}, defaultRegistries, customRegistries);
}

/**
 * Show all npm registries
 */
async function listRegistries(pkgManager = "npm") {
  let list = "";
  const currentRegistry = await getCurrentRegistry(pkgManager);

  Object.keys(registries).forEach((key) => {
    const isCurrentRegistry = key === currentRegistry;
    const prefix = isCurrentRegistry ? "*" : " ";
    const item = `\n ${prefix} ${dashline(key)} ${registries[key].registry}`;
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
      const time = new Date() - start;
      const msg = `${time} ms`;
      if (time < 500) {
        return chalk.green(msg);
      } else if (time < 1000) {
        return chalk.yellow(msg);
      } else {
        return chalk.red(msg);
      }
    })
    .catch((e) => {
      return chalk.red("Timeout");
    });
}

async function listDelayTime() {
  return await Promise.all(
    Object.keys(registries).map(async (key) => {
      const delayTime = await getDelayTime(registries[key].registry);
      const item = ` ${dashline(key)} ${delayTime}`;
      console.log(item);
    })
  );
}

/**
 * @param {string} pkgManager npm|yarn
 */
function main(pkgManager) {
  cli.command("ls", "List all the registries").action(async () => {
    await listRegistries(pkgManager);
  });

  cli.command("use [registry]", "Change registry").action(async (registry) => {
    if (!registry) {
      console.log(
        `\n  nnrm use <registry>\n  Example: ${chalk.yellow(
          "nnrm use taobao"
        )}\n`
      );
    } else {
      await setCurrentRegistry(registry, pkgManager);
      await listRegistries(pkgManager);
    }
  });

  cli
    .command("test", "Show response time for all registries")
    .action(async () => {
      console.log();
      await listDelayTime();
      console.log();
    });

  cli
    .command("add <registry> <url> [home]", "Add a custom registry")
    .action(async (name, url, home) => {
      addCustomRegistry(name, url, home);
      registries = getAllRegistries();
      await listRegistries(pkgManager);
    });

  cli
    .command("remove <registry>", "Remove a custom registry")
    .action(async (name) => {
      removeCustomRegistry(name);
      registries = getAllRegistries();
      await listRegistries(pkgManager);
    });

  cli.help();
  cli.version(pkg.version);
  cli.parse();
}

module.exports = {
  listRegistries,
  listDelayTime,
  setCurrentRegistry,
  main,
};
