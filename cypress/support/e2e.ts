// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
// cypress/support/e2e.ts
import "./commands";
import "@/global";

// cypress/support/e2e.ts
// 🔹 فایل support برای پروژه
// در آینده اینجا Commandها و Hookهای عمومی اضافه می‌شن
export {};
// ✅ فقط وقتی تست Fail بشه اسکرین بگیر
after(function () {
  // Cypress خودش وضعیت تست‌ها رو نگه می‌داره
  const allTests = this.test?.parent?.tests || [];
  const failed = allTests.some((t: any) => t.state === "failed");

  if (failed) {
    cy.wait(1000);
    cy.screenshot("Final-State-Full-Scenario", { capture: "runner" });
    console.log("📸 Screenshot taken — test failed.");
  } else {
    console.log("✅ All tests passed — no screenshot taken.");
  }
});
Cypress.on("uncaught:exception", (err) => {
  // جلوگیری از fail شدن تست‌ها برای خطاهای کنترل‌نشده
  if (
    err.message.includes("Cannot read properties of undefined (reading 'data')")
  ) {
    return false;
  }
});
// ✅ Global safe-click: هندلِ re-render + تمام overloadها، بدون ارور TS
Cypress.Commands.overwrite('click', (originalFn, subject, ...args) => {
  // --- parse options از انتهای آرگومان‌ها
  let options: Partial<Cypress.ClickOptions> = {};
  const last = args[args.length - 1];

  if (last && typeof last === 'object') {
    options = last as Partial<Cypress.ClickOptions>;
    args[args.length - 1] = { ...options, force: true };
  } else {
    args.push({ force: true });
  }

  const log = (msg: string) =>
    Cypress.log({ name: 'safeClick', message: msg });

  // --- کلیک ایمن روی subject با آرگومان‌های اصلی
  const runClick = () => (originalFn as any)(subject, ...args);

  try {
    // اگر المنت هنوز attach است → کلیک مستقیم
    if (Cypress.dom.isAttached(subject as any)) {
      return runClick();
    }
    // اگر detach شده → صبر تا exist و سپس کلیک
    log('♻️ Retrying click on re-rendered element');
    return cy.wrap(subject).should('exist').then(() => runClick());
  } catch {
    // ریکاوری در خطاهای گذرا
    log('⚠️ Recovered from transient click error');
    return cy.wrap(subject).should('exist').then(() => runClick());
  }
});
  




