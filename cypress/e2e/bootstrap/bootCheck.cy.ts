describe("Health Check", () => {
  it("should visit the BASE_URL and assert title", () => {
    cy.visit(Cypress.env("BASE_URL") || "http://example.com");
    cy.title().should("exist");
  });
});
