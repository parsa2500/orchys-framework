describe("Delete", () => {
  beforeEach(() => {
    cy.clearData();
    cy.login();
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
  it("Delete", () => {
    cy.intercept("GET", "**/odata/**").as("odata");
    cy.intercept(
      "POST",
      "http://test.andishehpardaz.local/Base/ClaimLevel/delete"
    ).as("remove");
    cy.visit("http://test.andishehpardaz.local/base/ClaimLevel");
    cy.wait("@odata");
    cy.readFile("cypress/fixtures/saveData.json").then((Data) => {
      cy.get('input[aria-label="فیلتر سلول"]')
        .first()
        .clear()
        .type(Data.claims.ClaimLevel.subject.second);
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
