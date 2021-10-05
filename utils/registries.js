import fs from "fs";
import path from "path";

import chalk from "chalk";
import execa from "execa";

import { require } from "./require.js";

const NNRM = path.join(process.env.HOME, ".nnrm");
const NNRM_REGISTRIES = path.join(NNRM, "registries.json");

async function getCustomRegistry() {
  let customRegistries = {};
  try {
    customRegistries = require(NNRM_REGISTRIES);
  } catch (e) {
    const msg = `\nWe will create '${chalk.yellow(
      NNRM_REGISTRIES
    )}' to record your custom registries.\n`;
    console.log(msg);

    if (!fs.existsSync(NNRM)) {
      try {
        fs.mkdirSync(NNRM, { recursive: true });
      } catch (e) {
        // permission denied
        console.log(e.message);
        await execa("mkdir", [NNRM]).catch((e) => {
          console.log(e.message);
        });
      }
    }
    setCustomRegistry(customRegistries);
  }
  return customRegistries;
}

/**
 * write ~/.nnrm/registries.json
 * @param {object} registries
 */
function setCustomRegistry(registries) {
  return fs.writeFileSync(NNRM_REGISTRIES, JSON.stringify(registries, null, 2));
}

/**
 * add custom registry
 * @param {string} name
 * @param {string} registry url
 * @param {string} home
 */
function addCustomRegistry(name, url, home) {
  let customRegistries = getCustomRegistry();

  // npm config set registry auto add '/'
  if (url.slice(-1) !== "/") {
    url += "/";
  }

  customRegistries[name] = {
    home,
    registry: url,
  };
  setCustomRegistry(customRegistries);
}

/**
 * remove a custom registry
 * @param {string} name
 */
function removeCustomRegistry(name) {
  let customRegistries = getCustomRegistry();
  if (customRegistries[name]) {
    delete customRegistries[name];
  }
  setCustomRegistry(customRegistries);
}

export { getCustomRegistry, addCustomRegistry, removeCustomRegistry };
