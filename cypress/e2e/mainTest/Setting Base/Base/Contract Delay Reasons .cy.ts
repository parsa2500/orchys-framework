describe("CRUD", function () {
  this.beforeEach(() => {
    cy.clearData();
    cy.login();
  });

  it("Create", () => {
    cy.intercept("GET", "**/odata/**").as("odata");
    cy.intercept(
      "POST",
      "http://test.andishehpardaz.local/base/ContractDelayReasons/save"
    ).as("save");
    cy.visit("http://test.andishehpardaz.local/base/contractDelayReasons");
    cy.wait("@odata");

    cy.get('div[aria-label="ثبت مورد جدید"]').click();
    cy.get('div[role="presentation"]:visible')
      .last()
      .within(() => {
        cy.wait(3000);
        cy.get('tr[role="row"]')
          .first()
          .within(() => {
            cy.get("input:visible")
              .first()
              .randomValue(10)
              .invoke("val")
              .then((val: any) => {
                cy.updateJson(
                  "Setting",
                  "Base.contractDelayReasons.subject.first",
                  val
                );
              });

            cy.get("input:visible").eq(1).click({ force: true });
            cy.document().within(() => {
              cy.get('div[role="dialog"]:visible').within(() => {
                cy.get('div[role="option"]')
                  .eq(1)
                  .wait(3000)
                  .click({ force: true });
              });
            });
            cy.get("input:visible")
              .eq(1)
              .invoke("val")
              .then((val: any) => {
                cy.updateJson(
                  "Setting",
                  "Base.contractDelayReasons.ligal.first",
                  val
                );
              });

            cy.get("input:visible").eq(2).click({ force: true });
            cy.document().within(() => {
              cy.get('div[role="dialog"]:visible').within(() => {
                cy.get('div[role="option"]:last')
                  .wait(3000)
                  .click({ force: true });
              });
            });
            cy.get("input:visible")
              .eq(2)
              .invoke("val")
              .then((val: any) => {
                cy.updateJson(
                  "Setting",
                  "Base.contractDelayReasons.Guilty.first",
                  val
                );
              });

            cy.get("input:visible").eq(4).click({ force: true });
            cy.document().within(() => {
              cy.get('div[role="dialog"]:visible').within(() => {
                cy.get('div[role="option"]:first')
                  .wait(3000)
                  .click({ force: true });
              });
            });
          });
        cy.get('a[title="ذخیره"]:visible').click({ force: true });
      });
    cy.wait("@save");
  });

  it("Read", () => {
    cy.intercept(
      "POST",
      "http://test.andishehpardaz.local/requests/contract/adddate"
    ).as("adddate");
    cy.intercept(
      "GET",
      "http://test.andishehpardaz.local/odata/paye/delayReasons*"
    ).as("reasons");
    cy.visit(
      "http://test.andishehpardaz.local/audits/delays/create/3d53ca30-271c-490a-92a6-44a77f77e238?Type=delay"
    );
    cy.wait("@adddate");
    cy.get('button[ng-click="addNewReasonFromList()"]').click();
    cy.get("div[uib-modal-transclude]")
      .should("be.visible")
      .within(() => {
        cy.get('div[aria-label="Items per page: 100"]').click();
        cy.wait("@reasons");
        cy.wait(3000);
        cy.readFile("cypress/fixtures/Setting.json").then((Data: any) => {
          cy.contains(Data.Base.contractDelayReasons.subject.first).should(
            "exist"
          );
        });
      });
  });

  it("Update", () => {
    cy.intercept("GET", "**/odata/**").as("odata");
    cy.intercept(
      "POST",
      "http://test.andishehpardaz.local/base/ContractDelayReasons/save"
    ).as("save");
    cy.visit("http://test.andishehpardaz.local/base/contractDelayReasons");
    cy.wait("@odata");

    cy.readFile("cypress/fixtures/Setting.json").then((Data: any) => {
      cy.get('input[aria-label="فیلتر سلول"]')
        .first()
        .clear()
        .type(Data.Base.contractDelayReasons.subject.first);
    });

    cy.wait("@odata");
    cy.get('div[role="presentation"]:visible')
      .last()
      .within(() => {
        cy.wait(3000);
        cy.get('tr[role="row"]')
          .first()
          .within(() => {
            cy.get('a[title="ویرایش"]').click({ force: true });
            cy.get("input:visible")
              .first()
              .clear()
              .randomValue(10)
              .invoke("val")
              .then((val: any) => {
                cy.updateJson(
                  "Setting",
                  "Base.contractDelayReasons.subject.second",
                  val
                );
              });

            cy.get("input:visible").eq(1).click({ force: true });
            cy.document().within(() => {
              cy.get('div[role="dialog"]:visible').within(() => {
                cy.get('div[role="option"]:last')
                  .wait(3000)
                  .click({ force: true });
              });
            });
            cy.get("input:visible")
              .eq(1)
              .invoke("val")
              .then((val: any) => {
                cy.updateJson(
                  "Setting",
                  "Base.contractDelayReasons.ligal.second",
                  val
                );
              });

            cy.get("input:visible").eq(2).click({ force: true });
            cy.document().within(() => {
              cy.get('div[role="dialog"]:visible').within(() => {
                cy.get('div[role="option"]')
                  .eq(1)
                  .wait(3000)
                  .click({ force: true });
              });
            });
            cy.get("input:visible")
              .eq(2)
              .invoke("val")
              .then((val: any) => {
                cy.updateJson(
                  "Setting",
                  "Base.contractDelayReasons.Guilty.second",
                  val
                );
              });

            cy.get("input:visible").eq(4).click({ force: true });
            cy.document().within(() => {
              cy.get('div[role="dialog"]:visible').within(() => {
                cy.get('div[role="option"]:first')
                  .wait(3000)
                  .click({ force: true });
              });
            });
          });
        cy.get('a[title="ذخیره"]:visible').click({ force: true });
      });
    cy.wait("@save");

    cy.intercept(
      "POST",
      "http://test.andishehpardaz.local/requests/contract/adddate"
    ).as("adddate");
    cy.intercept(
      "GET",
      "http://test.andishehpardaz.local/odata/paye/delayReasons*"
    ).as("reasons");
    cy.visit(
      "http://test.andishehpardaz.local/audits/delays/create/3d53ca30-271c-490a-92a6-44a77f77e238?Type=delay"
    );
    cy.wait("@adddate");
    cy.get('button[ng-click="addNewReasonFromList()"]').click();
    cy.get("div[uib-modal-transclude]")
      .should("be.visible")
      .within(() => {
        cy.get('div[aria-label="Items per page: 100"]').click();
        cy.wait("@reasons");
        cy.wait(3000);
        cy.readFile("cypress/fixtures/Setting.json").then((Data: any) => {
          cy.contains(Data.Base.contractDelayReasons.subject.second).should(
            "exist"
          );
          cy.contains(Data.Base.contractDelayReasons.subject.first).should(
            "not.exist"
          );
        });
      });
  });

  it("Delete", () => {
    cy.intercept("GET", "**/odata/**").as("odata");
    cy.intercept(
      "POST",
      "http://test.andishehpardaz.local/base/ContractDelayReasons/Remove"
    ).as("delete");
    cy.visit("http://test.andishehpardaz.local/base/contractDelayReasons");
    cy.wait("@odata");
    cy.readFile("cypress/fixtures/Setting.json").then((Data: any) => {
      cy.get('input[aria-label="فیلتر سلول"]')
        .first()
        .clear()
        .type(Data.Base.contractDelayReasons.subject.second);
    });
    cy.wait("@odata");
    cy.get('div[role="presentation"]:visible')
      .last()
      .within(() => {
        cy.get('tr[role="row"]')
          .first()
          .within(() => {
            cy.get('a[title="حذف"]').click({ force: true });
          });
      });
    cy.wait("@delete");
  });
});
