import { Data } from "@/dataCenter";

console.log("✅ Base URL:", Data.urls.base);
describe("craete claim", () => {
    beforeEach(() => {
      cy.clearData()
      cy.login()
    });
  it('check1', () => {
    cy.url().should('include', 'dashboard')
    cy.visit("http://test.andishehpardaz.local");
  });
});
