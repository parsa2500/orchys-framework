// runner/grandManager.ts
import prompts from "prompts";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

interface ScenarioMap {
  description?: string;
  roadmap?: any;
}

(async () => {
  console.clear();
  console.log("🚀 Enterprise Test Runner\n");

  // مسیر فایل‌های ورودی
  const scenariosPath = path.resolve("runner/scenarios.json");
  const roadmapPath = path.resolve("runner/roadmap.json");

  // خواندن فایل‌ها
  const scenarios: Record<string, ScenarioMap> = fs.existsSync(scenariosPath)
    ? JSON.parse(fs.readFileSync(scenariosPath, "utf8"))
    : {};
  const roadmaps: Record<string, any> = fs.existsSync(roadmapPath)
    ? JSON.parse(fs.readFileSync(roadmapPath, "utf8"))
    : {};

  // --- مرحله ۱: انتخاب بین Scenarios و Roadmaps ---
  let mainMenuActive = true;
  while (mainMenuActive) {
    const { section } = await prompts({
      type: "select",
      name: "section",
      message: "📂 Select category",
      choices: [
        { title: "🧩 Scenarios", value: "scenarios" },
        { title: "🗺️ Roadmaps", value: "roadmaps" },
        { title: "❌ Exit", value: "exit" },
      ],
    });

    if (section === "exit" || !section) {
      console.log("\n👋 Exiting CLI...\n");
      process.exit(0);
    }

    if (section === "scenarios") {
      await handleList("scenarios", scenarios);
    } else if (section === "roadmaps") {
      await handleList("roadmaps", roadmaps);
    }
  }

  // --- تابع داخلی برای لیست‌ها ---
  async function handleList(
    type: "scenarios" | "roadmaps",
    data: Record<string, any>
  ) {
    let inList = true;
    while (inList) {
      const items = Object.keys(data).map((key) => ({
        title: `${key} — ${data[key].description || "with out any explantion"}`,
        value: key,
      }));

      const { selected } = await prompts({
        type: "select",
        name: "selected",
        message: `📜 Select ${type === "scenarios" ? "Scenario" : "Roadmap"}`,
        choices: [...items, { title: "🔙 Back", value: "back" }],
      });

      if (selected === "back" || !selected) {
        inList = false; // برگشت به منوی اصلی
        break;
      }

      // انتخاب حالت اجرا
      const { mode } = await prompts({
        type: "select",
        name: "mode",
        message: "⚙️ Select mode",
        choices: [
          { title: "Headless (recommended)", value: "headless" },
          { title: "GUI (Cypress open)", value: "gui" },
          { title: "🔙 Back", value: "back" },
        ],
      });

      if (mode === "back") continue;

      console.log(`\n▶ Running ${type.slice(0, -1)}: ${selected} (${mode})\n`);

      const command =
        mode === "gui"
          ? `MODE=gui ts-node runner/scenarioManager.ts ${selected}`
          : `ts-node runner/scenarioManager.ts ${selected}`;

      try {
        execSync(command, { stdio: "inherit" });
      } catch (err) {
        console.error(`❌ ${type} failed.`, err);
      }

      console.log(`\n✅ ${selected} finished.\n`);
    }
  }
})();
