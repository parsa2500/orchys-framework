describe("CRUD", function () {
  this.beforeEach(() => {
    cy.login();
  });

  it("Create", () => {
    cy.intercept("GET", "**/odata/**").as("odata");
    cy.intercept(
      "POST",
      "http://test.andishehpardaz.local/base/pricelists/save"
    ).as("save");
    cy.visit("http://test.andishehpardaz.local/base/pricelists");
    cy.wait("@odata");

    cy.get('div[aria-label="ثبت مورد جدید"]').click();
    cy.get('div[role="presentation"]:visible')
      .last()
      .within(() => {
        cy.get('tr[role="row"]')
          .first()
          .within(() => {
            cy.wait(4000);
            cy.get("input")
              .first()
              .randomValue("10")
              .invoke("val")
              .then((val: any) => {
                cy.updateJson("Setting", "Base.pricelists.subject.first", val);
              });

            cy.get("input").eq(1).click({ force: true });
            cy.document().within(() => {
              cy.get('div[role="dialog"]:visible').within(() => {
                cy.get('div[role="option"]:first')
                  .wait(3000)
                  .click({ force: true });
              });
            });

            cy.get('a[title="ذخیره"]:visible').click({ force: true });
          });
      });
    cy.wait("@save");
  });

  it.only("Read", () => {
    cy.visit("http://test.andishehpardaz.local/requests/request/create");
    cy.readFile("cypress/fixtures/Setting.json").then((Data: any) => {
      cy.get('select[name="Request.PriceListTypeID"]').select("paye");
      cy.get('div[ng-model="Request.PriceListItems"]').click();
      cy.get('div[dx-tag-box="tagBox.customTemplate"]:visible').within(() => {
        cy.contains(Data.Base.pricelists.subject.first).should("be.visible");
      });
    });
  });

  it("Update", () => {
    // part 1
    cy.readFile("cypress/fixtures/Setting.json").then((Data: any) => {
      cy.intercept("GET", "**/odata/**").as("odata");
      cy.intercept(
        "POST",
        "http://test.andishehpardaz.local/base/pricelists/save"
      ).as("save");
      cy.visit("http://test.andishehpardaz.local/base/pricelists");
      cy.wait("@odata");

      cy.get('input[aria-label="فیلتر سلول"]')
        .first()
        .type(Data.Base.pricelists.subject.first);
      cy.wait("@odata");

      cy.get('div[role="presentation"]:visible')
        .last()
        .within(() => {
          cy.get('tr[role="row"]')
            .first()
            .within(() => {
              cy.wait(4000);
              cy.get('a[title="ویرایش"]').click();
              cy.get("input")
                .first()
                .clear()
                .randomValue("10")
                .invoke("val")
                .then((val: any) => {
                  cy.updateJson(
                    "Setting",
                    "Base.pricelists.subject.second",
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

              cy.get('a[title="ذخیره"]:visible').click({ force: true });
            });
        });
      cy.wait("@save");
    });

    // part 2
    cy.visit("http://test.andishehpardaz.local/requests/request/create");
    cy.readFile("cypress/fixtures/Setting.json").then((Data: any) => {
      cy.get('select[name="Request.PriceListTypeID"]').select("paye");
      cy.get('div[ng-model="Request.PriceListItems"]').click();
      cy.get('div[dx-tag-box="tagBox.customTemplate"]:visible').within(() => {
        cy.contains(Data.Base.pricelists.subject.second).should("be.visible");
        cy.contains(Data.Base.pricelists.subject.first).should("not.exist");
      });
    });
  });

  it("Delete", () => {
    cy.readFile("cypress/fixtures/Setting.json").then((Data: any) => {
      cy.intercept("GET", "**/odata/**").as("odata");
      cy.intercept(
        "POST",
        "http://test.andishehpardaz.local/base/pricelists/remove"
      ).as("delete");
      cy.visit("http://test.andishehpardaz.local/base/pricelists");
      cy.wait("@odata");

      cy.get('input[aria-label="فیلتر سلول"]')
        .first()
        .type(Data.Base.pricelists.subject.second);
      cy.wait("@odata");

      cy.get('div[role="presentation"]:visible')
        .last()
        .within(() => {
          cy.contains(Data.Base.pricelists.subject.second)
            .closest("tr")
            .find('a[title="حذف"]')
            .click();
        });
      cy.wait("@delete");
    });
  });
});
