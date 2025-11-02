describe("Set", () => {
  beforeEach(() => {
    cy.clearData();
    cy.login();
  });
  it("Create option", () => {
    cy.intercept("GET", "**/odata/**").as("odata");
    cy.intercept(
      "POST",
      "http://test.andishehpardaz.local/Base/ClaimLevel/save"
    ).as("save");
    cy.visit("http://test.andishehpardaz.local/base/ClaimLevel");
    cy.wait(3000);
    cy.wait("@odata");
    cy.get('div[title="ثبت مورد جدید"]').click();
    cy.get('div[role="presentation"]:visible')
      .last()
      .within(() => {
        cy.get('tr[role="row"]')
          .first()
          .within(() => {
            cy.get("input").first().randomValue("10");
            cy.get("input")
              .first()
              .invoke("val")
              .then((val) => {
                cy.updateJson(
                  "saveData",
                  "claims.ClaimLevel.subject.first",
                  val
                );
              });
            cy.get("input").eq(1).randomValue("10");
            cy.get("input")
              .eq(1)
              .invoke("val")
              .then((val) => {
                cy.updateJson("saveData", "claims.ClaimLevel.En.first", val);
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
  it("delete all levels if exist", () => {
    cy.intercept("GET", "**/OData/**").as("OData");

    cy.visit(
      "http://test.andishehpardaz.local/claims/level/index/fa4b6417-4599-416f-ba98-ff029c5a229d"
    );
    cy.wait("@OData");

    const deleteFirstRow = () => {
      cy.get('tbody[role="presentation"]:visible').then(($tbody) => {
        const rows = $tbody.find("tr[aria-rowindex]");

        if (rows.length === 0) {
          cy.log("✅ هیچ موردی باقی نمونده.");
          return;
        }

        cy.wrap(rows[0]).find('td[aria-colindex="2"]').click();
        cy.url().should("include", "Level");

        cy.get('button[ng-click="delete()"]').click();
        cy.url().should("include", "index");

        // 🔁 دوباره فراخوانی تابع برای ردیف بعدی
        deleteFirstRow();
      });
    };

    deleteFirstRow();
  });
  it("create case", () => {
    cy.intercept("GET", "**/OData/**").as("OData");
    cy.visit(
      "http://test.andishehpardaz.local/claims/level/index/fa4b6417-4599-416f-ba98-ff029c5a229d"
    );
    cy.wait("@OData");
    cy.get('div[title="ثبت مورد جدید"]').click();
    cy.url().should("include", "create");
    cy.readFile("cypress/fixtures/saveData.json").then((Data) => {
      cy.get('input[aria-label="level"]').click();
      cy.get('div[role="listbox"]:visible').within(() => {
        cy.contains(Data.claims.ClaimLevel.subject.first).click();
      });
      cy.get('button[ng-click="selectCourt()"]').click();
      cy.buttonMode(1);
      cy.get('input[name="Claim_Level.CourtName"]')
        .invoke("val")
        .then((val) => {
          cy.updateJson("saveData", "claims.Case.first", val);
        });
      cy.get('input[name="Claim_Level.Date"]').click();
      cy.currentDate();
      cy.get("textarea").randomValue(40);
      cy.get('button[type=submit]:visible').click();
    });
  });
});
