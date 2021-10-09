import fs from "fs";

import execa from "execa";
import chalk from "chalk";
import fetch from "node-fetch";

import { cac } from "cac";
// ES Module doesn't have require
import { require } from "./require.js";

const pkg = require("../package.json");
const cli = cac();

import {
  getCustomRegistry,
  addCustomRegistry,
  removeCustomRegistry,
} from "./registries.js";

// init default and custom registries
const defaultRegistries = require("../registries.json");
// init in main
let registries;

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
async function getAllRegistries() {
  const customRegistries = await getCustomRegistry();
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

/**
 * https://docs.npmjs.com/cli/v7/commands/npm-config
 * @param {string} name
 * @param {*} pkgManager
 * @returns
 */
async function setCurrentRegistry(name, pkgManager = "npm") {
  return execa(pkgManager, [
    "config",
    "set",
    `registry=${registries[name].registry}`,
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

/**
 * list registries delay time
 * @returns
 */
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
async function main(pkgManager) {
  // init
  registries = await getAllRegistries();

  cli.command("ls", "List all the registries").action(async () => {
    await listRegistries(pkgManager);
  });

  cli
    .command("use [registry]", "Change registry")
    .option("-l, --local", "set '.npmrc' for local")
    .action(async (registry, options) => {
      if (!registry) {
        console.log(
          `\n  nnrm use <registry>\n  Example: ${chalk.yellow(
            "nnrm use taobao"
          )}\n`
        );
      } else {
        const info = await setCurrentRegistry(registry, pkgManager);
        console.log(info);
        await listRegistries(pkgManager);
      }

      if (options.l || options.local) {
        const registryText = `registry=${registries[registry].registry}`;
        if (fs.existsSync(".npmrc")) {
          const content = fs.readFileSync(".npmrc", "utf-8");
          fs.writeFileSync(
            ".npmrc",
            content.replace(/^registry=.*/gm, registryText)
          );
        } else {
          fs.writeFileSync(".npmrc", registryText);
        }
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

export { listRegistries, listDelayTime, setCurrentRegistry, main };
