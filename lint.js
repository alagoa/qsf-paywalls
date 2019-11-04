"use strict";

const os = require("os");
const execSync = require("child_process").execSync;

if (os.platform() === "win32") {
  delete process.env.GIT_DIR;
}

let output;

try {
  output = execSync(`git status "${__dirname}" --porcelain`, {
    encoding: "utf8"
  });
} catch (e) {
  console.log("ERROR: " + e.message);
  process.exit(1);
}

console.log(`git status output\n${output}`);

function shouldProcess(output) {
  const lines = output.split("\n");

  for (var line of lines) {
    line = line.trim();

    if (line.length === 0) {
      continue;
    }

    if (line.startsWith("??") === false) {
      return true;
    }
  }

  return false;
}

if (shouldProcess(output)) {
  console.log("run tslint...");
  try {
    const stdio = os.platform() === "win32" ? [] : undefined;
    output = execSync("npm run lint", {
      encoding: "utf8",
      cwd: __dirname,
      stdio: stdio
    });
  } catch (e) {
    console.log('ERROR. please run "npm run lint" to check for the errors.');
    process.exit(1);
  }
  console.log(output);
} else {
  console.log("skip tslint");
}
