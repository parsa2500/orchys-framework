describe("CRUD", function () {
  this.beforeEach(() => {
    cy.clearData();
    cy.login();
  });

  it("Create", () => {
    cy.intercept("GET", "**/odata/**").as("odata");
    cy.intercept(
      "POST",
      "http://test.andishehpardaz.local/Base/ContractType/save"
    ).as("save");
    cy.visit("http://test.andishehpardaz.local/base/contracttype");
    cy.wait("@odata");
    cy.get('div[title="ثبت مورد جدید"]').click();
    cy.get('div[role="presentation"]:visible')
      .last()
      .within(() => {
        cy.get('tr[role="row"]')
          .first()
          .within(() => {
            cy.get("input")
              .first()
              .randomValue(10)
              .invoke("val")
              .then((val: any) => {
                cy.updateJson(
                  "Setting",
                  "Base.ContractType.subject.first",
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
            cy.get('a[title="ذخیره"]').click({ force: true });
          });
      });
    cy.wait("@save");
  });

  it("Read", () => {
    cy.intercept("GET", "**/odata/**").as("odata");
    cy.intercept(
      "POST",
      "http://test.andishehpardaz.local/Base/ContractType/Load"
    ).as("load");
    cy.visit("http://test.andishehpardaz.local/requests/contract/create");
    cy.wait("@load");
    cy.readFile("cypress/fixtures/Setting.json").then((Data: any) => {
      cy.get('button[ng-click="selectContract()"]').click();
      cy.wait("@odata");
      cy.get("div[uib-modal-transclude]")
        .should("be.visible")
        .within(() => {
          cy.get('tr[aria-rowindex="1"]').click();
          cy.get("table")
            .last()
            .within(() => {
              cy.contains(Data.Base.ContractType.subject.first).should("exist");
            });
        });
    });
  });

  it("Update", () => {
    cy.intercept("GET", "**/odata/**").as("odata");
    cy.intercept(
      "POST",
      "http://test.andishehpardaz.local/Base/ContractType/save"
    ).as("save");
    cy.visit("http://test.andishehpardaz.local/base/contracttype");
    cy.wait("@odata");
    cy.readFile("cypress/fixtures/Setting.json").then((Data: any) => {
      cy.get('input[aria-label="فیلتر سلول"]')
        .first()
        .clear()
        .type(Data.Base.ContractType.subject.first);
      cy.wait("@odata");
      cy.wait(3000);
      cy.get('div[role="presentation"]:visible')
        .last()
        .within(() => {
          cy.get('a[title="ویرایش"]:visible').click();
          cy.get('tr[role="row"]')
            .first()
            .within(() => {
              cy.get("input")
                .first()
                .clear()
                .randomValue(10)
                .invoke("val")
                .then((val: any) => {
                  cy.updateJson(
                    "Setting",
                    "Base.ContractType.subject.second",
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
              cy.get('a[title="ذخیره"]').click({ force: true });
            });
        });
      cy.wait("@save");
    });

    cy.intercept("GET", "**/odata/**").as("odata");
    cy.intercept(
      "POST",
      "http://test.andishehpardaz.local/Base/ContractType/Load"
    ).as("load");
    cy.visit("http://test.andishehpardaz.local/requests/contract/create");
    cy.wait("@load");
    cy.readFile("cypress/fixtures/Setting.json").then((Data: any) => {
      cy.get('button[ng-click="selectContract()"]').click();
      cy.wait("@odata");
      cy.get("div[uib-modal-transclude]")
        .should("be.visible")
        .within(() => {
          cy.get('tr[aria-rowindex="1"]').click();
          cy.get("table")
            .last()
            .within(() => {
              cy.contains(Data.Base.ContractType.subject.second).should(
                "exist"
              );
              cy.contains(Data.Base.ContractType.subject.first).should(
                "not.exist"
              );
            });
        });
    });
  });

  it("Delete", () => {
    cy.intercept("GET", "**/odata/**").as("odata");
    cy.intercept(
      "POST",
      "http://test.andishehpardaz.local/Base/ContractType/remove"
    ).as("remove");
    cy.visit("http://test.andishehpardaz.local/base/contracttype");
    cy.wait("@odata");
    cy.readFile("cypress/fixtures/Setting.json").then((Data: any) => {
      cy.get('input[aria-label="فیلتر سلول"]')
        .first()
        .clear()
        .type(Data.Base.ContractType.subject.second);
      cy.wait("@odata");
      cy.wait(3000);
      cy.get('div[role="presentation"]:visible')
        .last()
        .within(() => {
          cy.get('a[title="حذف"]:visible').click();
        });
      cy.get('div[role="dialog"]:visible').within(() => {
        cy.get('div[aria-label="بلی"]').click();
      });
      cy.wait("@remove");
    });
  });
});
