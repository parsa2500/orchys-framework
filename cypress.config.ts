// cypress.config.ts
import { defineConfig } from "cypress";
import fs from "fs";

export default defineConfig({
  e2e: {
    specPattern: ["cypress/e2e/**/*.cy.{ts,js}"],
    supportFile: "cypress/support/e2e.ts",
    screenshotsFolder: "reports/screenshots",
    videosFolder: "reports/videos",
    trashAssetsBeforeRuns: true,
    watchForFileChanges: false,

    setupNodeEvents(on, config) {
      // ⚙️ تشخیص حالت اجرا (UI یا CLI)
      const isOpenMode = config.isTextTerminal === false;

      if (isOpenMode) {
        config.video = false;
        config.screenshotOnRunFailure = false;
        console.log("🎬 UI Mode → ویدیو و اسکرین‌شات غیرفعال شد");
      } else {
        config.video = true;
        config.screenshotOnRunFailure = true;
        console.log("📹 CLI Mode → ضبط ویدیو و اسکرین فعال است");
      }

      // 🧹 پاک‌سازی کل پوشه reports قبل از شروع تست‌ها
      on("before:run", () => {
        const reportDirs = [
          "reports/videos",
          "reports/screenshots",
          "reports/logs",
        ];

        for (const dir of reportDirs) {
          if (fs.existsSync(dir)) {
            fs.rmSync(dir, { recursive: true, force: true });
            console.log(`🧽 پوشه '${dir}' قبل از اجرا پاک شد`);
          }
        }
      });

      // 🧹 حذف ویدیوهای پاس‌شده بعد از اتمام تست‌ها
      on("after:run", (results: any) => {
        const videosDir = "reports/videos";
        if (!results || !fs.existsSync(videosDir)) return;

        const allSpecs = results.runs || [];
        for (const spec of allSpecs) {
          if (!spec.video) continue;

          const allPassed = spec.tests.every((t: any) =>
            t.attempts.every((a: any) => a.state === "passed")
          );

          if (allPassed) {
            try {
              fs.unlinkSync(spec.video);
              console.log(`🧹 حذف ویدیو پاس‌شده: ${spec.spec.name}`);
            } catch (err) {
              console.warn(`⚠️ خطا در حذف ویدیو: ${spec.video}`);
            }
          }
        }
      });

      return config;
    },
  },
});
