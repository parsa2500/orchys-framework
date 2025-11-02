🧠 Orchys Framework

Enterprise E2E Test Orchestrator built with Cypress + TypeScript

📘 Overview

Orchys is a modular, fault-tolerant automation framework built for enterprise-grade systems.
It provides:

Scenario-based orchestration

Retry & fault handling via Policy Engine

Structured JSON reporting

Roadmap-driven test pipelines

🧱 Project Structure
orchys/
├── runner/
│   ├── scenarioManager.ts       # Scenario execution orchestrator
│   ├── faultController.ts       # Error handling & retry controller
│   ├── policyEngine.ts          # Policy resolver for error actions
│   ├── logger.ts                # JSON logger for test outputs
│   ├── config.ts                # Central configuration
│   └── ...
│
├── cypress/
│   ├── e2e/                     # Modular test specs
│   ├── fixtures/                # Mock data & resources
│   └── support/                 # Custom commands, hooks & types
│
├── reports/                     # Logs, screenshots, videos
├── shared/                      # Common utilities
└── tsconfig.json

🚀 Usage
▶ Run a Specific Scenario
npm run scenario -- contracts

🧩 GUI Mode (For Local Debugging)
MODE=gui npm run scenario -- contracts

📁 Log Output

All run logs are stored under:

reports/logs/<scenario>_<date>.json

⚙️ Tech Stack
Component	Version	Description
Cypress	15.5.0	E2E testing engine
TypeScript	5.9	Type-safe scripting
Node.js	22+	Execution environment
Allure (Planned)	—	Visual reporting
🧩 Roadmap
Phase	Feature	Status
MVP	Scenario-based runner	✅ Done
Core	Fault Controller (retry/stop-line)	✅ Done
Core	Policy Engine	✅ Done
Reporting	JSON Logger	✅ Done
Integration	Allure & CLI Dashboard	🔜 Planned
CI/CD	GitHub Actions Pipeline	🔜 Planned
🧑‍💻 Author

Parsa Safapour
QA Automation Architect & Technical Developer
📍 Andishehpardaz Pooya Afzar

📜 License

MIT License © 2025 — Orchys Framework
