// runner/logger.ts
import fs from "fs";
import path from "path";

export class Logger {
  private scenario: string;
  private logs: any[] = [];
  private startTime = new Date();

  constructor(scenario: string) {
    this.scenario = scenario;
  }

  startScenario(desc: string) {
    console.log(`🎯 شروع سناریو: ${desc}`);
  }

  logSpec(spec: string, status: string, error?: any, attempt?: number) {
    const log = {
      spec,
      status,
      attempt: attempt ?? 1,
      timestamp: new Date().toISOString(),
      error: error ? String(error).slice(0, 200) : null,
      video: this.findAsset("videos", spec),
      screenshot: this.findAsset("screenshots", spec),
    };
    this.logs.push(log);
  }

  private findAsset(folder: string, spec: string) {
    const dir = path.join("reports", folder);
    if (!fs.existsSync(dir)) return null;
    const files = fs.readdirSync(dir);
    const match = files.find((f) => f.includes(spec.split("/").pop() || ""));
    return match ? path.join("reports", folder, match) : null;
  }

  endScenario(finalStatus: string) {
    const endTime = new Date();
    const summary = {
      scenario: this.scenario,
      status: finalStatus,
      durationSec: (endTime.getTime() - this.startTime.getTime()) / 1000,
      specs: this.logs,
    };
    const logDir = path.join("reports", "logs");
    fs.mkdirSync(logDir, { recursive: true });
    fs.writeFileSync(
      path.join(logDir, `${this.scenario}.json`),
      JSON.stringify(summary, null, 2)
    );
    console.log(`✅ log summary → reports/logs/${this.scenario}.json`);
  }
}
