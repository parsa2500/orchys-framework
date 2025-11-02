import { error } from "console";

describe("Update Part 1", () => {
  beforeEach(() => {
    cy.clearData();
    cy.login();
  });
  it.only("create option", () => {
    cy.intercept("GET", "**/odata/**").as("odata");
    cy.intercept(
      "POST",
      "http://test.andishehpardaz.local/Base/ClaimLevel/save"
    ).as("save");
    cy.visit("http://test.andishehpardaz.local/base/ClaimLevel");
    cy.wait("@odata");
    cy.readFile("cypress/fixtures/saveData.json").then((Data) => {
      cy.get('input[aria-label="فیلتر سلول"]')
        .first()
        .clear()
        .type(Data.claims.ClaimLevel.subject.first);
      cy.wait("@odata");
      cy.wait(3000);
      cy.get('div[role="presentation"]:visible')
        .last()
        .within(() => {
          cy.get('a[title="ویرایش"]:visible').click();
          cy.get('tr[role="row"]')
            .first()
            .within(() => {
              cy.get("input").first().clear().randomValue(10);
              cy.get("input")
                .first()
                .invoke("val")
                .then((val) => {
                  cy.updateJson(
                    "saveData",
                    "claims.ClaimLevel.subject.second",
                    val
                  );
                });
              cy.get("input").eq(1).clear().randomValue("10");
              cy.get("input")
                .eq(1)
                .invoke("val")
                .then((val) => {
                  cy.updateJson("Setting", "claims.ClaimLevel.En.second", val);
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
  });
  it("create case", () => {
    cy.intercept("GET", "**/OData/**").as("OData");
    cy.visit(
      "http://test.andishehpardaz.local/claims/level/index/fa4b6417-4599-416f-ba98-ff029c5a229d"
    );
    cy.get('div[aria-label="جدول"]').within(() => {
      cy.readFile("cypress/fixtures/saveData.json").then((Data) => {
        cy.contains(Data.claims.Case.first).click();
      });
    });
    cy.url().should("include", "Edit");
    cy.readFile("cypress/fixtures/saveData.json").then((Data) => {
      cy.get('input[aria-label="level"]').should(
        "have.value",
        Data.claims.ClaimLevel.subject.second
      );
    });
  });
});
