/// <reference types="cypress" />

describe("Health Main Server API", () => {
  it("should respond with ok and required services", () => {
    // داده‌های محیطی را از fixtures بخوان
    cy.fixture("env.json").then((env) => {
      const healthUrl = `${env.urls.base}${env.api.health}`;

      cy.intercept("GET", healthUrl).as("health");
      cy.request("GET", healthUrl).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.have.property("status");

        cy.fixture("health.expect.json").then((expected) => {
          expect(res.body.status).to.eq(expected.status);
          expected.services.forEach((svc: string) => {
            expect(res.body.services).to.include(svc);
          });
        });
      });

      cy.wait("@health");
    });
  });
});
