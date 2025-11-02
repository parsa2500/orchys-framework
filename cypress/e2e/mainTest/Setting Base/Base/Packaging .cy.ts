describe("CRUD", function () {
  this.beforeEach(() => {
    cy.clearData();
    cy.login();
  });

  it("Create", () => {
    cy.intercept("GET", "**/odata/**").as("odata");
    cy.intercept(
      "POST",
      "http://test.andishehpardaz.local/Base/packaging/addoredit"
    ).as("save");
    cy.visit("http://test.andishehpardaz.local/base/packaging");
    cy.wait(3000);
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
                cy.updateJson("Setting", "Base.packaging.subject.first", val);
              });
            cy.get("input").eq(2).click({ force: true });
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
    cy.visit(
      "http://test.andishehpardaz.local/requests/tender/edit/e2f4ec74-ddb5-4252-a326-40805a7bf6c9"
    );
    cy.get('select[ng-model="Tender.ShowPackageType"]')
      .select("C")
      .closest(".col-md-6")
      .find(".btn-primary")
      .click();
    cy.get("div[uib-modal-transclude]")
      .should("be.visible")
      .within(() => {
        cy.readFile("cypress/fixtures/Setting.json").then((Data: any) => {
          cy.contains(Data.Base.packaging.subject.first).should("be.visible");
        });
      });
  });

  it("Update", () => {
    cy.intercept("GET", "**/odata/**").as("odata");
    cy.intercept(
      "POST",
      "http://test.andishehpardaz.local/Base/packaging/addoredit"
    ).as("save");
    cy.visit("http://test.andishehpardaz.local/base/packaging");
    cy.wait("@odata");
    cy.readFile("cypress/fixtures/Setting.json").then((Data: any) => {
      cy.get('input[aria-label="فیلتر سلول"]')
        .first()
        .clear()
        .type(Data.Base.packaging.subject.first);
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
                    "Base.packaging.subject.second",
                    val
                  );
                });
              cy.get("input").eq(2).click({ force: true });
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

    cy.visit(
      "http://test.andishehpardaz.local/requests/tender/edit/e2f4ec74-ddb5-4252-a326-40805a7bf6c9"
    );
    cy.get('select[ng-model="Tender.ShowPackageType"]')
      .select("C")
      .closest(".col-md-6")
      .find(".btn-primary")
      .click();
    cy.get("div[uib-modal-transclude]")
      .should("be.visible")
      .within(() => {
        cy.readFile("cypress/fixtures/Setting.json").then((Data: any) => {
          cy.contains(Data.Base.packaging.subject.second).should("be.visible");
          cy.contains(Data.Base.packaging.subject.first).should("not.exist");
        });
      });
  });

  it("Delete", () => {
    cy.intercept("GET", "**/odata/**").as("odata");
    cy.intercept(
      "POST",
      "http://test.andishehpardaz.local/Base/packaging/Remove"
    ).as("remove");
    cy.visit("http://test.andishehpardaz.local/base/packaging");
    cy.wait("@odata");
    cy.readFile("cypress/fixtures/Setting.json").then((Data: any) => {
      cy.get('input[aria-label="فیلتر سلول"]')
        .first()
        .clear()
        .type(Data.Base.packaging.subject.second);
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
