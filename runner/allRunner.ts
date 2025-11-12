import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const scenariosPath = path.join(__dirname, "scenarios.json");
const scenarios = JSON.parse(fs.readFileSync(scenariosPath, "utf8"));
const scenarioNames = Object.keys(scenarios);

console.log("🚀 Starting full test suite...\n");

// Clean logs only once at the beginning
const logsPath = path.join(__dirname, "../reports/logs");
if (fs.existsSync(logsPath)) {
  fs.rmSync(logsPath, { recursive: true, force: true });
}
fs.mkdirSync(logsPath, { recursive: true });

for (const name of scenarioNames) {
  console.log(`🎯 Running scenario: ${name}`);
  try {
    // Pass --preserve-logs so logs are not deleted between scenarios
    execSync(`ts-node runner/scenarioManager.ts ${name} --preserve-logs`, {
      stdio: "inherit",
    });
    console.log(`✅ Scenario '${name}' completed successfully.\n`);
  } catch (err) {
    console.error(`❌ Scenario '${name}' failed.\n`);
  }
}

console.log("🏁 All scenarios completed.\n");
