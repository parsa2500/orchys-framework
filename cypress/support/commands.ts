/// <reference types="cypress" />
import moment from "moment-jalaali";

Cypress.Commands.add(
  "randomValue",
  { prevSubject: "element" },
  (subject, length: any = 8) => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const value = Array.from(
      { length },
      () => chars[Math.floor(Math.random() * chars.length)]
    ).join("");

    const tryType = (attempt = 0) => {
      if (attempt > 5) throw new Error("❌ مقدار تایپ نشد بعد از چند تلاش!");

      cy.wrap(subject).should("be.visible").type(value, { force: true });
      cy.wait(200);
      cy.wrap(subject)
        .invoke("val")
        .then((val) => {
          const strVal = String(val);
          if (!strVal.includes(value)) {
            cy.log(`⚠️ تلاش مجدد (${attempt + 1})`);
            tryType(attempt + 1);
          } else {
            cy.log(`✅ مقدار ${value} تایپ شد`).then(() => {
              return subject;
            });
          }
        });
    };

    tryType();
  }
);
Cypress.Commands.add("login", () => {
  function tryGetOrReload(selector: string, retries = 3) {
    cy.visit("http://test.andishehpardaz.local");
    cy.log(`🔍 سعی در یافتن: ${selector} | باقی‌مانده تلاش‌ها: ${retries}`);
    cy.wait(3000);
    cy.get("body").then(($body) => {
      if ($body.find(selector).length > 0) {
        cy.log("✅ المنت پیدا شد");
        cy.get(selector, { timeout: 5000 })
          .should("be.visible")
          .type("parsa", { force: true });
      } else if (retries > 0) {
        cy.log("❌ المنت پیدا نشد. رفرش می‌کنیم...");
        cy.visit("http://test.andishehpardaz.local");
        cy.wait(1000);
        tryGetOrReload(selector, retries - 1);
      } else if ($body.find("pre").length > 0) {
        tryLogin();
      } else {
        throw new Error("💥 بعد از چند بار تلاش هم، المنت پیدا نشد!");
      }
    });
  }
  function tryLogin() {
    tryGetOrReload("#Username");
    cy.get("#encriptPassword")
      .should("be.visible")
      .type("12345678", { force: true });
    cy.get("#submitBtn").click({ force: true });
    cy.get("body").then((body) => {
      if (body.find("pre").length > 0) {
        tryLogin();
      }
    });
    cy.url().then((url) => {
      if (url != "http://test.andishehpardaz.local/dashboard") {
        tryLogin();
      } else if (url == "http://test.andishehpardaz.local/dashboard") {
        return;
      }
    });
    return;
  }
  tryLogin();
});
Cypress.Commands.add(
  "PermistionSwitch",
  (sub: string[], num: string, names: string[], submit: number) => {
    // 🔹 تابع برعکس‌کردن رشته
    function reverseString(str: string): string {
      return str.split("").reverse().join("");
    }

    let allSub: string[] = [];
    let allName: string[] = [];
    let times: number[] = [0];
    let tactic1: string = reverseString(num);

    // 🔹 بررسی ورودی submit
    if (submit !== 1 && submit !== 0) {
      throw new Error(
        `bro you chose ${submit}, you must choose a number between 1 or 0`
      );
    }

    // 🔹 بررسی طول num
    if (num.length === 6) {
      console.log(`its ok your tactics is ${tactic1}`);
    } else {
      throw new Error(
        `out of range your tactic is ${tactic1} and your length is ${tactic1.length}, it must be 6`
      );
    }

    // 🔹 تابع گرفتن Subها
    function takeAllSub(): Cypress.Chainable<string[]> {
      return cy
        .get('a[ng-click="chasngeAngleIcon(key1)"]')
        .each(($el) => {
          cy.wrap($el)
            .invoke("text")
            .then((val) => {
              allSub.push((val as string).trim());
            });
        })
        .then(() => {
          return allSub;
        });
    }

    // 🔹 تابع گرفتن Nameها
    function takeAllNames(): void {
      allSub.forEach((name) => {
        cy.contains("p", name)
          .closest("#accordion")
          .within(() => {
            cy.get('span[ng-if="value2.AdditionalOptions.length == 0"]')
              .each(($el) => {
                cy.wrap($el)
                  .invoke("text")
                  .then((val) => {
                    allName.push((val as string).trim());
                  });
              })
              .then(() => {
                cy.get('span[ng-click="chasngeAngleIcons2(key2)"]').each(
                  ($el) => {
                    cy.wrap($el)
                      .invoke("text")
                      .then((val) => {
                        allName.push((val as string).trim());
                      });
                  }
                );
              });
          });
      });
    }

    // 🔹 آماده‌سازی subها
    cy.then(() => {
      if (allSub[0] === "all") {
        allSub.splice(0, allSub.length);
        takeAllSub();
      } else {
        sub.forEach((item) => {
          allSub.push(item);
        });
      }
    });

    // 🔹 آماده‌سازی nameها
    names.forEach((item) => {
      allName.push(item);
    });

    cy.then(() => {
      if (allName[0] === "all") {
        allName.splice(0, allName.length);
        takeAllNames();
      }
    });

    // 🔹 محاسبه times
    cy.then(() => {
      allSub.forEach((item) => {
        cy.contains("p", item)
          .scrollIntoView()
          .closest("#accordion")
          .within(() => {
            cy.get("span").then((element) => {
              const pageTexts = Cypress._.map(element, (el) =>
                Cypress.$(el).text().trim()
              );
              cy.log("Extracted texts: " + pageTexts);
              const commonItem = allName.filter((thing) =>
                pageTexts.includes(thing)
              );

              times.push(commonItem.length + times[times.length - 1]);
              console.log(`آخرین ${allName.slice(times[0], times[1])}`);
            });
          });
      });
    });

    // 🔹 تابع اصلی اعمال پرمیژن
    function starter(tm1: number, tm2: number): void {
      allName.slice(tm1, tm2).forEach((og) => {
        console.log(og);
        cy.contains("span", og)
          .scrollIntoView()
          .parent()
          .parent()
          .within(() => {
            cy.get("span").each(($el) => {
              if ($el.attr("ng-click") === "chasngeAngleIcons2(key2)") {
                cy.get('span[ng-click="chasngeAngleIcons2(key2)"]').each(
                  (nameEl) => {
                    cy.wrap(nameEl)
                      .scrollIntoView()
                      .parent()
                      .parent()
                      .within(() => {
                        cy.get("input").each(($check, index) => {
                          const target1 = Number(tactic1[index]);
                          const isChecked1 = ($check as any).prop("checked");
                          if (index > 5) return;
                          else if (target1 === 1 && !isChecked1) {
                            cy.wrap($check).click({ force: true });
                          } else if (target1 === 0 && isChecked1) {
                            cy.wrap($check).click({ force: true });
                          } else if (target1 > 1) {
                            throw new Error(
                              `out of range: value ${target1} in ${num} index[${index}]`
                            );
                          }
                        });
                      });
                  }
                );
              } else if (
                $el.attr("ng-if") === "value2.AdditionalOptions.length == 0"
              ) {
                cy.get(
                  'span[ng-if="value2.AdditionalOptions.length == 0"]'
                ).each((nameEl) => {
                  cy.wrap(nameEl)
                    .scrollIntoView()
                    .parent()
                    .parent()
                    .within(() => {
                      cy.get("input").each(($check, index) => {
                        const target = Number(tactic1[index]);
                        const isChecked = ($check as any).prop("checked");
                        if (index > 5) return;
                        else if (target === 1 && !isChecked) {
                          cy.wrap($check).click({ force: true });
                        } else if (target === 0 && isChecked) {
                          cy.wrap($check).click({ force: true });
                        } else if (target > 1) {
                          throw new Error(
                            `out of range you use ${target} in ${num} index[${index}]`
                          );
                        }
                      });
                    });
                });
              } else {
                cy.log("oh");
              }
            });
          });
      });
    }

    // 🔹 اجرای نهایی
    cy.then(() => {
      console.log(allName);
      console.log(allSub);
      console.log(times);
      allSub.forEach((name, index) => {
        const time1 = times[index];
        const time2 = times[index + 1];
        cy.contains("p", name)
          .closest("#accordion")
          .within(() => {
            starter(time1, time2);
            console.log(time1, time2);
          });
      });
      if (submit === 1) {
        cy.get(".submit").click();
      } else {
        cy.log("you chose to deactivate your change");
      }
    });
  }
);
Cypress.Commands.add("PermistionSwitchMax", (sub, num, name = []) => {
  let tactic = num;
  cy.contains("p", `${sub}`)
    .closest("#accordion")
    .within(() => {
      name.forEach((el: string, index: number) => {
        cy.contains(`${el}`)
          .closest("#accordion")
          .within(() => {
            cy.get("input")
              .eq(index)
              .then(($chk) => {
                const isChecked = $chk.prop("checked");
                if (Number(tactic[index]) === Number(isChecked)) {
                  // وضعیت درست است، کاری نمی‌کنیم
                } else {
                  cy.get("input").eq(index).click({ force: true });
                }
              });
          });
      });
    });
});
Cypress.Commands.add("fastPermission", (user) => {
  cy.visit("http://test.andishehpardaz.local/settings/localChart", {
    timeout: 120000,
  });
  cy.wait(2000);
  cy.get('div[aria-label="Items per page: 100"]')
    .first()
    .click({ force: true });
  cy.wait(2500);
  cy.contains("a", `${user}`).click();
  cy.url().should("include", "edit");
  cy.wait(5000);
});
Cypress.Commands.add("clearData", () => {
  cy.clearAllCookies();
  cy.clearAllLocalStorage();
  cy.clearAllSessionStorage();
});
Cypress.Commands.add(
  "updateJson",
  (
    filePath: string,
    pathOrMap: string | Record<string, any>,
    value?: any
  ): Cypress.Chainable<any> => {
    const fileLocation: string = `./cypress/fixtures/${filePath}.json`;
    return cy.readFile(fileLocation).then((data) => {
      if (typeof pathOrMap === "string") {
        // حالت تک مسیر
        Cypress._.set(data, pathOrMap, value);
      } else if (Cypress._.isPlainObject(pathOrMap)) {
        // حالت چند مسیر با map
        Object.entries(pathOrMap).forEach(([p, v]) => {
          Cypress._.set(data, p, v);
        });
      } else {
        throw new Error("❌ The path is invalid: use a string or object.");
      }

      return cy.writeFile(fileLocation, data).then(() => data);
    });
  }
);
Cypress.Commands.add(
  "newDatePicker",
  (year: number | string, month: number | string, day: number | string) => {
    cy.get(".bd-main:visible", { timeout: 10000 })
      .should("exist")
      .then(($el: JQuery<HTMLElement>) => {
        cy.wrap($el).within(() => {
          cy.wait(500); // برای اطمینان از کامل شدن render اولیه

          // 🎯 انتخاب سال
          cy.get(".bd-year:visible", { timeout: 5000 })
            .should("be.visible")
            .then(($year: JQuery<HTMLElement>) => {
              cy.wrap($year)
                .invoke("val", String(year))
                .trigger("change", { force: true });
            });

          // صبر کوتاه برای re-render ماه
          cy.wait(300);

          // 🎯 انتخاب ماه
          cy.get(".bd-month:visible", { timeout: 5000 })
            .should("exist")
            .should("be.visible")
            .then(($month: JQuery<HTMLElement>) => {
              cy.wrap($month)
                .invoke("val", String(month))
                .trigger("change", { force: true });
            });

          // 🎯 انتخاب روز
          cy.get(".bd-table-days:visible", { timeout: 5000 })
            .should("exist")
            .contains("button", new RegExp(`^${day}$`))
            .click({ force: true });
        });
      });
  }
);
Cypress.Commands.add("currentDate", (): void => {
  const year: number = Number(moment().format("jYYYY"));
  const month: number = Number(moment().format("jMM"));
  const day: number = Number(moment().format("jDD"));

  cy.newDatePicker(year, month, day);
});
Cypress.Commands.add("buttonMode", (locate: number) => {
  cy.document().within(() => {
    cy.get("div[uib-modal-transclude]:visible")
      .first()
      .should("be.visible")
      .within(() => {
        cy.get(".btn-primary")
          .invoke("attr", "ng-click")
          .then((name: string | undefined) => {
            cy.wait(3000);
            cy.get('tr[role="row"]')
              .eq(locate + 1)
              .trigger("click");
            cy.wait(3000);
            if (name === "ok()") {
              cy.get('button[ng-click="ok()"]').click({ force: true });
            } else if (name === "submit()") {
              cy.get('button[ng-click="submit()"]').click({ force: true });
            } else {
              cy.log(`⚠️ Unknown ng-click action: ${name}`);
            }
          });
      });
    cy.get("div[uib-modal-transclude]").should("not.exist");
  });
});
Cypress.Commands.add(
  "randomGenrate",
  { prevSubject: "element" },
  (subject: JQuery<HTMLElement>, length: number = 10): void => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }

    cy.wrap(subject).type(result, { force: true });
  }
);
Cypress.Commands.add(
  "randomNumber",
  { prevSubject: "element" },
  (subject, length: any = 8) => {
    const chars = "0123456789";
    const value = Array.from(
      { length },
      () => chars[Math.floor(Math.random() * chars.length)]
    ).join("");

    const tryType = (attempt = 0) => {
      if (attempt > 5) throw new Error("❌ مقدار تایپ نشد بعد از چند تلاش!");

      cy.wrap(subject).should("be.visible").type(value, { force: true });
      cy.wait(200);
      cy.wrap(subject)
        .invoke("val")
        .then((val) => {
          const strVal = String(val);
          if (!strVal.includes(value)) {
            cy.log(`⚠️ تلاش مجدد (${attempt + 1})`);
            tryType(attempt + 1);
          } else {
            cy.log(`✅ مقدار ${value} تایپ شد`).then(() => {
              return subject;
            });
          }
        });
    };

    tryType();
  }
);
Cypress.Commands.add(
  "TryToCheck",
  (alias: string, tryCount = 3, timeoutOrFn = 20000, maybeAction) => {
    // --- Normalization of arguments ---
    let timeout, actionFn;
    if (typeof timeoutOrFn === "function") {
      actionFn = timeoutOrFn;
      timeout = 20000;
    } else {
      timeout = timeoutOrFn;
      actionFn = maybeAction;
    }

    // --- Auto-prefix alias if missing @ ---
    if (typeof alias === "string" && !alias.startsWith("@")) {
      alias = "@" + alias;
    }

    const safeAction = typeof actionFn === "function" ? actionFn : () => {};
    let attempt = 0;

    const tryWait = () => {
      attempt++;

      if (attempt === 1) {
        cy.log(`🚀 Starting TryToCheck for ${alias}`);
        safeAction();
      } else {
        cy.log(`🔁 Retrying ${alias} (attempt ${attempt}/${tryCount})`);
      }

      (cy.wait as any)(alias).then(
        (resp: any) => {
          const status = resp?.response?.statusCode;
          if (status === 200) {
            cy.log(`✅ ${alias} succeeded (status 200 on attempt ${attempt})`);
            return;
          }

          if (attempt < tryCount) {
            tryWait();
          } else {
            throw new Error(
              `❌ ${alias} failed after ${attempt} attempts (last status: ${
                status || "unknown"
              })`
            );
          }
        },
        () => {
          if (attempt < tryCount) {
            tryWait();
          } else {
            throw new Error(
              `❌ ${alias} did not fire after ${attempt} attempts`
            );
          }
        }
      );
    };

    tryWait();
  }
);
