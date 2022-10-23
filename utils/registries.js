import fs from "fs";
import path from "path";

import pc from "picocolors";
import { execa } from "execa";

const NNRM = path.join(process.env.HOME || process.env.USERPROFILE, ".nnrm");
const NNRM_REGISTRIES = path.join(NNRM, "registries.json");

export async function getCustomRegistry() {
  let customRegistries = {};
  try {
    customRegistries = JSON.parse(fs.readFileSync(NNRM_REGISTRIES));
  } catch (e) {
    const msg = `\nWe will create '${pc.yellow(
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
export async function addCustomRegistry(name, url, home) {
  let customRegistries = await getCustomRegistry();

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
export async function removeCustomRegistry(name) {
  let customRegistries = await getCustomRegistry();
  if (customRegistries[name]) {
    delete customRegistries[name];
  }
  setCustomRegistry(customRegistries);
}
