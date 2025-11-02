// runner/faultController.ts
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { Logger } from "./logger";
import { TestPolicyConfig, resolvePolicy } from "./policyEngine";

type ErrorAction = "retry" | "stop_line" | "skip" | "relogin_then_retry";

export interface RoadmapItem {
  spec: string;
  FilePolicy?: TestPolicyConfig;
  CasesPolicy?: Record<string, Record<string, TestPolicyConfig>>;
}

type SpecEntry = string | RoadmapItem;

interface CypressJsonResult {
  stats?: { tests?: number; passes?: number; failures?: number };
  tests?: Array<{
    title?: string[];
    state?: "passed" | "failed";
    err?: { message?: string };
  }>;
}

// ✅ ساختار جدید خروجی
export interface SpecResult {
  spec: string;
  success: boolean;
  stopLine?: boolean;
  attempt: number;
  timestamp: string;
  error?: string | null;
}

function isRoadmapItem(x: SpecEntry): x is RoadmapItem {
  return typeof x === "object" && x !== null && "spec" in x;
}

function normalizeSpecPath(specPath: string) {
  return path.join("cypress", "e2e", specPath);
}

function testNameFromSpec(specPath: string) {
  return (
    specPath
      .split("/")
      .pop()
      ?.replace(/\.(cy\.)?(t|j)s$/, "") || "default"
  );
}

function resolveCasePolicy(
  filePolicy: TestPolicyConfig,
  casesPolicy: RoadmapItem["CasesPolicy"] | undefined,
  describeName?: string,
  itName?: string
): TestPolicyConfig {
  let merged: TestPolicyConfig = { ...filePolicy };
  if (!casesPolicy) return merged;
  if (describeName && casesPolicy[describeName]) {
    merged = {
      ...merged,
      ...casesPolicy[describeName]["*"],
      ...{},
    };
    if (itName && casesPolicy[describeName][itName]) {
      merged = { ...merged, ...casesPolicy[describeName][itName] };
    }
  }
  return merged;
}

function ensureTmpDir(dir = "reports/tmp") {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function parseFailures(
  jsonPath: string
): Array<{ describe?: string; it?: string; titlePath: string[] }> {
  try {
    const raw = fs.readFileSync(jsonPath, "utf8");
    const data: CypressJsonResult = JSON.parse(raw);
    const failed =
      (data.tests || []).filter(
        (t) => t.state === "failed" && Array.isArray(t.title)
      ) || [];
    return failed.map((t) => {
      const title = t.title || [];
      const it = title[title.length - 1];
      const describe = title.length > 1 ? title[0] : undefined;
      return { describe, it, titlePath: title };
    });
  } catch {
    return [];
  }
}

/**
 * کنترل خطا با پشتیبانی پالیسی سطح فایل و سطح کیس‌ها
 */
export async function faultController(
  specEntry: SpecEntry,
  logger: Logger,
  inlinePolicy?: TestPolicyConfig
): Promise<SpecResult> {
  const specPath: string = isRoadmapItem(specEntry)
    ? specEntry.spec
    : specEntry;
  const casesPolicy = isRoadmapItem(specEntry)
    ? specEntry.CasesPolicy
    : undefined;
  const fileInline = isRoadmapItem(specEntry)
    ? specEntry.FilePolicy
    : undefined;

  const spec = normalizeSpecPath(specPath);
  const testName = testNameFromSpec(specPath);

  const filePolicy = resolvePolicy(testName, {
    inline: {
      ...(inlinePolicy || {}),
      ...(fileInline || {}),
    },
  });

  const maxRetries = filePolicy.retries ?? 0;
  let attempt = 0;
  const tmpDir = ensureTmpDir();

  while (attempt <= maxRetries) {
    attempt += 1;
    console.log(`🧪 اجرای ${testName} | تلاش ${attempt}/${maxRetries + 1}`);

    const jsonOut = path.join(
      tmpDir,
      `${testName}-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}-attempt${attempt}.json`
    );

    try {
      const envVars = {
        ...process.env,
        CYPRESS_FILE_POLICY: JSON.stringify(filePolicy),
        CYPRESS_CASES_POLICY: JSON.stringify(casesPolicy || {}),
      };

      const cmd = [
        `npx cypress run`,
        `--spec "${spec}"`,
        `--browser chrome`,
        `--reporter json`,
        `--reporter-options "output=${jsonOut}"`,
      ].join(" ");

      execSync(cmd, { stdio: "inherit", env: envVars });

      // ✅ موفقیت
      logger.logSpec(specPath, "passed");
      return {
        spec: specPath,
        success: true,
        stopLine: false,
        attempt,
        timestamp: new Date().toISOString(),
        error: null,
      };
    } catch (err: any) {
      const failures = parseFailures(jsonOut);

      // اگر چیزی برای تحلیل نبود
      if (!failures.length) {
        const canRetry = attempt <= (filePolicy.retries ?? 0);
        if (canRetry) {
          console.warn(
            "⚠️ شکست بدون دیتیل قابل تحلیل؛ بر اساس FilePolicy دوباره تلاش می‌کنیم…"
          );
          continue;
        }
        logger.logSpec(specPath, "failed", err);
        logger.endScenario("failed");
        return {
          spec: specPath,
          success: false,
          stopLine: true,
          attempt,
          timestamp: new Date().toISOString(),
          error: err?.message || "Unknown failure",
        };
      }

      let shouldRetryByCases = false;

      for (const f of failures) {
        const casePolicy = resolveCasePolicy(
          filePolicy,
          casesPolicy,
          f.describe,
          f.it
        );
        const caseRetries = casePolicy.retries ?? 0;
        if (attempt <= caseRetries + 1) {
          shouldRetryByCases = true;
          break;
        }
      }

      if (shouldRetryByCases) {
        console.warn(
          "🔁 پالیسی سطح کیس اجازهٔ retry می‌دهد؛ دوباره تلاش می‌کنیم…"
        );
        continue;
      }

      const canRetryFile = attempt <= (filePolicy.retries ?? 0);
      if (canRetryFile) {
        console.warn(
          "🔁 پالیسی سطح فایل اجازهٔ retry می‌دهد؛ دوباره تلاش می‌کنیم…"
        );
        continue;
      }

      // ❌ شکست نهایی
      logger.logSpec(specPath, "failed", err);
      logger.endScenario("failed");
      return {
        spec: specPath,
        success: false,
        stopLine: true,
        attempt,
        timestamp: new Date().toISOString(),
        error: err?.message || "Max retries reached",
      };
    }
  }

  // اگر حلقه تموم شد ولی پاس نشد
  logger.logSpec(specPath, "failed", new Error("Max retries reached"));
  logger.endScenario("failed");
  return {
    spec: specPath,
    success: false,
    stopLine: true,
    attempt,
    timestamp: new Date().toISOString(),
    error: "Max retries reached",
  };
}
