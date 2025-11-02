// runner/roadMap.ts
import fs from "fs";
import path from "path";
import { faultController } from "./faultController";
import { Logger } from "./logger";

export async function runGrand(grandName: string) {
  const roadmapPath = path.join(__dirname, "roadmap.json");
  const scenariosPath = path.join(__dirname, "scenarios.json");

  if (!fs.existsSync(roadmapPath) || !fs.existsSync(scenariosPath)) {
    console.error("❌ Missing roadmap.json or scenarios.json");
    process.exit(1);
  }

  const pipelines = JSON.parse(fs.readFileSync(roadmapPath, "utf8"));
  const scenarios = JSON.parse(fs.readFileSync(scenariosPath, "utf8"));
  const pipeline = pipelines[grandName];

  if (!pipeline) {
    console.error(`❌ Pipeline '${grandName}' not found.`);
    process.exit(1);
  }

  console.log(`🚀 Starting pipeline: ${grandName}`);
  console.log(`📋 ${pipeline.description}\n`);

  const logger = new Logger(grandName);

  //commands on scenarios in pipeline

  for (const rawStep of pipeline.roadmap) {
    let stopOnFail = false;
    let stepName = rawStep;

    // اگر دستور خاصی مثل stopOnFail در انتهای مرحله نوشته شده بود
    if (typeof rawStep === "string" && rawStep.endsWith(".stopOnFail")) {
      stepName = rawStep.replace(".stopOnFail", "");
      stopOnFail = true;
    }

    // اگه مرحله در scenarios.json تعریف شده بود
    if (scenarios[stepName]) {
      console.log(`▶ Running scenario: ${stepName}`);
      const scenario = scenarios[stepName];

      for (const spec of scenario.roadmap) {
        console.log(`   ↳ Running test: ${spec}`);
        const result = await faultController(spec, logger);

        if (!result.success) {
          console.error(`❌ Failed at: ${spec}`);
          if (stopOnFail || result.stopLine) {
            console.log(`🛑 Pipeline stopped at '${stepName}'`);
            logger.endScenario("failed");
            process.exit(1);
          } else {
            console.log(`⚠️ Continuing pipeline...`);
          }
        }
      }
    } else {
      // اگه مستقیماً یه تست فایل بود
      console.log(`▶ Running test file: ${stepName}`);
      const result = await faultController(stepName, logger);

      if (!result.success) {
        console.error(`❌ Failed at: ${stepName}`);
        if (stopOnFail || result.stopLine) {
          console.log(`🛑 Pipeline stopped at '${stepName}'`);
          logger.endScenario("failed");
          process.exit(1);
        } else {
          console.log(`⚠️ Continuing pipeline...`);
        }
      }
    }
  }

  logger.endScenario("passed");
  console.log(`✅ Pipeline '${grandName}' completed successfully.`);
}
