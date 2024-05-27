#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const axios = require("axios");
const tar = require("tar");
const { exec } = require("child_process");

const PACKAGE_JSON_PATH = path.resolve(__dirname, "package.json");
const PACKAGES_DIR = path.resolve(__dirname, "node_modules");

function readPackageJson(filePath = PACKAGE_JSON_PATH) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writePackageJson(data, filePath = PACKAGE_JSON_PATH) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}
function count() {
    let contador = 0;
  
    function aumentador(valor) {
      contador += valor;
      return contador;
    }
  
    return aumentador;
  }
  
  const countTime = count();
  let totalTime = 0;
  
async function installPackage(packageName) {
  const url = `https://registry.npmjs.org/${packageName}/latest`;

  try {
    const startTime = Date.now();

    const response = await axios.get(url);
    const packageData = response.data;
    const packageVersion = packageData.version;
    const packageTarball = packageData.dist.tarball;

    console.log(`Installing ${packageName}@${packageVersion}...`);

    const packagePath = path.join(PACKAGES_DIR, packageName);
    fs.mkdirSync(packagePath, { recursive: true });

    const tarballResponse = await axios({
      url: packageTarball,
      method: "GET",
      responseType: "stream",
    });

    await new Promise((resolve, reject) => {
      const extractStream = tar.x({
        cwd: packagePath,
        strip: 1,
      });

      tarballResponse.data.pipe(extractStream);
      tarballResponse.data.on("end", resolve);
      tarballResponse.data.on("error", reject);
    });

    const packageJson = readPackageJson();
    packageJson.dependencies[packageName] = packageVersion;
    writePackageJson(packageJson);

    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    totalTime += duration;
    console.log(
      `${packageName}@${packageVersion} installed successfully in ${duration} seconds.`
    );
    console.log(`Total time elapsed: ${countTime(duration)} seconds.`);

    // Install dependencies of the installed package
    const installedPackageJsonPath = path.join(packagePath, "package.json");
    if (fs.existsSync(installedPackageJsonPath)) {
      const installedPackageJson = readPackageJson(installedPackageJsonPath);
      const dependencies = installedPackageJson.dependencies || {};
      for (const [depName, depVersion] of Object.entries(dependencies)) {
        console.log(
          `Installing dependency ${depName}@${depVersion} for ${packageName}...`
        );
        await installPackage(depName);
      }
    }
  } catch (error) {
    console.error(`Failed to install ${packageName}: ${error.message}`);
  }
}

async function installDependencies() {
    const packageJson = readPackageJson();
    const dependencies = Object.keys(packageJson.dependencies);
  
    for (const packageName of dependencies) {
      await installPackage(packageName);
    }
  
    console.log(`Total installation time: ${totalTime} seconds.`);
  }

function listPackages() {
  const packageJson = readPackageJson();
  const dependencies = packageJson.dependencies;
  console.log("Installed packages:");
  for (const [name, version] of Object.entries(dependencies)) {
    console.log(`${name}@${version}`);
  }
}

function runScript(scriptPath) {
  exec(`node ${scriptPath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing script: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Error: ${stderr}`);
      return;
    }
    console.log(stdout);
  });
}

const [, , command, arg] = process.argv;

switch (command) {
  case "install":
    if (arg) {
      installPackage(arg);
    } else {
      console.error("Please specify a package name to install.");
    }
    break;
  case "install-all":
    installDependencies();
    break;
  case "list":
    listPackages();
    break;
  case "run":
    if (arg) {
      runScript(arg);
    } else {
      console.error("Please specify a script to run.");
    }
    break;
  default:
    console.log("Usage: fpj <command> [argument]");
    console.log("Commands:");
    console.log("  install <package-name>     Install a package");
    console.log(
      "  install-all                Install all dependencies from package.json"
    );
    console.log("  list                       List installed packages");
    console.log("  run <script-path>          Run a JavaScript file");
}
