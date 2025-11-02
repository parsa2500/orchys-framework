// runner/scenarioRunner.ts
import { execSync } from "child_process";
import path from "path";

/**
 * این فایل بهت اجازه میده هم اینطوری اجرا کنی:
 *   npm run scenario -- claim_level_tests3
 * و هم اینطوری:
 *   node runner/scenarioRunner.ts claim_level_tests3
 * بدون اینکه npm نیاز باشه اسکریپت مخصوص بسازه.
 */

const args = process.argv.slice(2);
const scenarioName = args[0];

if (!scenarioName) {
  console.error("❌ نام سناریو مشخص نیست. مثال: npm run scenario -- contracts");
  process.exit(1);
}

console.log(`🎯 اجرای سناریو '${scenarioName}' ...`);

const scenarioPath = path.join("runner", "scenarioManager.ts");

try {
  execSync(`npx ts-node "${scenarioPath}" ${scenarioName}`, {
    stdio: "inherit",
  });
} catch (err) {
  console.error(`💥 خطا در اجرای سناریو '${scenarioName}'`);
  process.exit(1);
}
