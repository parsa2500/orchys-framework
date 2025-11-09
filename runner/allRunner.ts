import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const scenariosPath = path.join(__dirname, "scenarios.json");
const scenarios = JSON.parse(fs.readFileSync(scenariosPath, "utf8"));

console.log("🚀 Starting full test suite...\n");

const scenarioNames = Object.keys(scenarios);

for (const name of scenarioNames) {
  console.log(`🎯 Running scenario: ${name}`);
  try {
    execSync(`ts-node runner/scenarioManager.ts ${name}`, { stdio: "inherit" });
    console.log(`✅ Scenario '${name}' completed successfully.\n`);
  } catch (err) {
    console.error(`❌ Scenario '${name}' failed.\n`);
  }
}

console.log("🏁 All scenarios completed.\n");
