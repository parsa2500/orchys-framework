// runner/scenarioManager.ts

import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { Logger } from "./logger";
import { faultController } from "./faultController";
import { TestPolicyConfig } from "./policyEngine";

// تعریف ساختار جدید roadmap
interface RoadmapItem {
  spec: string;
  FilePolicy?: TestPolicyConfig;
  CasesPolicy?: Record<string, Record<string, TestPolicyConfig>>;
}

type RoadmapEntry = string | RoadmapItem;

interface Scenario {
  description: string;
  roadmap: RoadmapEntry[];
}

// مسیر فایل سناریوها
const SCENARIOS_PATH = path.join(__dirname, "scenarios.json");

// گرفتن نام سناریو از CLI یا مقدار پیش‌فرض
const scenarioName = process.argv[2] || "contracts";

// خواندن فایل JSON سناریوها
const scenarios: Record<string, Scenario> = JSON.parse(
  fs.readFileSync(SCENARIOS_PATH, "utf8")
);

// بررسی وجود سناریو
const scenario = scenarios[scenarioName];
if (!scenario) {
  console.error(`❌ سناریوی '${scenarioName}' پیدا نشد`);
  process.exit(1);
}

// ساخت لاگر
const logger = new Logger(scenarioName);
logger.startScenario(scenario.description);

console.log(`🎯 شروع سناریو: ${scenarioName}`);
console.log(`📜 توضیح: ${scenario.description}`);

// اجرای ترتیبی roadmap
(async () => {
  for (const entry of scenario.roadmap) {
    // تعیین نوع آیتم
    const specInfo: RoadmapItem =
      typeof entry === "string" ? { spec: entry } : entry;

    console.log(`▶ اجرا: ${specInfo.spec}`);

    try {
      // اجرای تست با faultController
      await faultController(specInfo, logger);
      logger.logSpec(specInfo.spec, "passed");
    } catch (err) {
      // در صورت خطا در faultController، سناریو را fail کن و خارج شو
      logger.logSpec(specInfo.spec, "failed", err);
      logger.endScenario("failed");
      process.exit(1);
    }
  }

  logger.endScenario("passed");
  console.log(`✅ سناریو '${scenarioName}' با موفقیت انجام شد.`);
})();
