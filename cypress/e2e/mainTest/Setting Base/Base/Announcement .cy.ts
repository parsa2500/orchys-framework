/// <reference types="cypress" />

// cypress/e2e/base/announcement.crud.cy.ts

// نوع داده‌ی فایل Setting.json برای تایپ بهتر
interface SettingData {
  Base: {
    announcement: {
      subject: {
        first: string;
        second: string;
      };
      textarea: {
        first: string;
        second: string;
      };
    };
  };
}

describe("CRUD", function () {
  this.beforeEach(() => {
    cy.clearData();
    cy.login();
  });
  it("Create", () => {
    cy.intercept("GET", "**/odata/**").as("odata");
    cy.intercept(
      "POST",
      "http://test.andishehpardaz.local/base/announcement/save"
    ).as("save");

    cy.visit("http://test.andishehpardaz.local/base/announcement");
    cy.wait(3000);
    cy.wait("@odata");

    cy.get('div[title="ثبت مورد جدید"]').click();

    cy.get('div[role="presentation"]:visible')
      .last()
      .within(() => {
        cy.get('div [role="form"]')
          .first()
          .within(() => {
            cy.get("input").first().randomValue("10");
            cy.get("input")
              .first()
              .invoke("val")
              .then((val) => {
                cy.updateJson(
                  "Setting",
                  "Base.announcement.subject.first",
                  val
                );
              });

            cy.get("input").eq(1).click({ force: true });

            cy.document().within(() => {
              cy.get('div[role="dialog"]:visible').within(() => {
                cy.get('div[role="option"]:first')
                  .wait(3000)
                  .click({ force: true });
              });
            });

            cy.get('div[aria-label="Editor content"]')
              .randomGenrate(30)
              .invoke("text")
              .then((val) => {
                cy.updateJson(
                  "Setting",
                  "Base.announcement.textarea.first",
                  val
                );
              });
          });

        cy.get('div[aria-label="ذخیره"]').click({ force: true });
      });

    cy.wait("@save");
  });
  it("Read", () => {
    cy.intercept(
      "POST",
      "http://test.andishehpardaz.local/requests/tender/SaveAnnouncment"
    ).as("save");

    cy.visit(
      "http://test.andishehpardaz.local/requests/tender/edit/e2f4ec74-ddb5-4252-a326-40805a7bf6c9"
    );

    cy.readFile("cypress/fixtures/Setting.json").then((Data: SettingData) => {
      cy.get('button[ng-click="selectAnnouncment()"]').click();

      cy.get("div[uib-modal-transclude]")
        .should("be.visible")
        .within(() => {
          cy.contains(Data.Base.announcement.subject.first)
            .should("exist")
            .click();
          cy.get('button[ng-click="ok()"]').click();
        });

      cy.wait("@save");

      cy.get('div[aria-label="Editor content"]')
        .find("p")
        .invoke("text")
        .then((txt: string) => {
          expect(txt).to.eq(Data.Base.announcement.textarea.first);
        });
    });
  });
  it("Update", () => {
    // part 1
    cy.intercept("GET", "**/odata/**").as("odata");
    cy.intercept(
      "POST",
      "http://test.andishehpardaz.local/base/announcement/save"
    ).as("save");

    cy.visit("http://test.andishehpardaz.local/base/announcement");
    cy.wait("@odata");

    cy.readFile("cypress/fixtures/Setting.json").then((Data: SettingData) => {
      cy.get('input[aria-label="فیلتر سلول"]')
        .first()
        .clear()
        .type(Data.Base.announcement.subject.first);

      cy.wait("@odata");
      cy.wait(3000);

      cy.get('div[role="presentation"]:visible')
        .last()
        .within(() => {
          cy.get('a[title="ویرایش"]:visible').click();

          cy.get('div [role="form"]')
            .first()
            .within(() => {
              cy.get("input")
                .first()
                .clear()
                .randomValue("10")
                .invoke("val")
                .then((val) => {
                  cy.updateJson(
                    "Setting",
                    "Base.announcement.subject.second",
                    val
                  );
                });

              cy.get("input").eq(1).click({ force: true });

              cy.document().within(() => {
                cy.get('div[role="dialog"]:visible').within(() => {
                  cy.get('div[role="option"]:first')
                    .wait(3000)
                    .click({ force: true });
                });
              });

              cy.get('div[aria-label="Editor content"]')
                .randomGenrate(30)
                .invoke("text")
                .then((val) => {
                  cy.updateJson(
                    "Setting",
                    "Base.announcement.textarea.second",
                    val
                  );
                });
            });

          cy.get('div[aria-label="ذخیره"]').click({ force: true });
        });

      cy.wait("@save");
    });

    // part 2
    cy.intercept(
      "POST",
      "http://test.andishehpardaz.local/requests/tender/SaveAnnouncment"
    ).as("save");

    cy.visit(
      "http://test.andishehpardaz.local/requests/tender/edit/e2f4ec74-ddb5-4252-a326-40805a7bf6c9"
    );

    cy.readFile("cypress/fixtures/Setting.json").then((Data: SettingData) => {
      cy.get('button[ng-click="selectAnnouncment()"]').click();

      cy.get("div[uib-modal-transclude]")
        .should("be.visible")
        .within(() => {
          cy.contains(Data.Base.announcement.subject.first).should("not.exist");
          cy.contains(Data.Base.announcement.subject.second)
            .should("exist")
            .click();
          cy.get('button[ng-click="ok()"]').click();
        });

      cy.wait("@save");

      cy.get('div[aria-label="Editor content"]')
        .find("p")
        .invoke("text")
        .then((txt: string) => {
          expect(txt).to.eq(Data.Base.announcement.textarea.second);
        });
    });
  });
  it("Delete", () => {
    cy.intercept("GET", "**/odata/**").as("odata");
    cy.intercept(
      "POST",
      "http://test.andishehpardaz.local/base/announcement/Remove"
    ).as("remove");

    cy.visit("http://test.andishehpardaz.local/base/announcement");
    cy.wait("@odata");

    cy.readFile("cypress/fixtures/Setting.json").then((Data: SettingData) => {
      cy.get('input[aria-label="فیلتر سلول"]')
        .first()
        .clear()
        .type(Data.Base.announcement.subject.second);

      cy.wait("@odata");
      cy.wait(3000);

      cy.get('div[role="presentation"]:visible')
        .last()
        .within(() => {
          cy.get('a[title="حذف"]:visible').click();
        });

      cy.wait("@remove");
    });
  });
});
