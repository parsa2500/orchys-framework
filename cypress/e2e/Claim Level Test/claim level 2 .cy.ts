describe("Read", () => {
  beforeEach(() => {
    cy.clearData();
    cy.login();
  });
  it("Status", () => {
    cy.intercept("GET", "**/OData/**").as("OData");
    cy.intercept(
      "POST",
      "http://test.andishehpardaz.local/claims/status/CheckBaseStatusCondition/"
    ).as("condition");
    cy.visit(
      "http://test.andishehpardaz.local/claims/status/index/fa4b6417-4599-416f-ba98-ff029c5a229d"
    );
    cy.wait("@OData");
    cy.get('div[title="ثبت مورد جدید"]').click();
    cy.url().should("include", "create");
    cy.wait("@condition");
    cy.readFile("cypress/fixtures/saveData.json").then((Data) => {
      cy.get("#setLevelsWithSearchBox")
        .find("input:visible")
        .invoke("val")
        .then((val) => {
          expect(val).to.eq(Data.claims.ClaimLevel.subject.first);
        });
      cy.get("#setLevelsWithSearchBox").find("input:visible").click();
      cy.get('div[role="listbox"]:visible').within(() => {
        cy.get('div[role="option"]').should(
          "have.text",
          Data.claims.ClaimLevel.subject.first
        );
      });
    });
  });
  it("petition", () => {
    cy.intercept("GET", "**/OData/**").as("OData");
    cy.visit(
      "http://test.andishehpardaz.local/claims/petition/index/fa4b6417-4599-416f-ba98-ff029c5a229d"
    );
    cy.wait("@OData");
    cy.get('div[title="ثبت مورد جدید"]').click();
    cy.url().should("include", "create");
    cy.readFile("cypress/fixtures/saveData.json").then((Data) => {
      cy.get("#setLevelsWithSearchBox")
        .find("input:visible")
        .invoke("val")
        .then((val) => {
          expect(val).to.eq(Data.claims.ClaimLevel.subject.first);
        });
      cy.get("#setLevelsWithSearchBox").find("input:visible").click();
      cy.get('div[role="listbox"]:visible').within(() => {
        cy.get('div[role="option"]').should(
          "have.text",
          Data.claims.ClaimLevel.subject.first
        );
      });
    });
  });
  it("summons", () => {
    cy.intercept("GET", "**/OData/**").as("OData");
    cy.visit(
      "http://test.andishehpardaz.local/claims/summons/index/fa4b6417-4599-416f-ba98-ff029c5a229d"
    );
    cy.wait("@OData");
    cy.get('div[title="ثبت مورد جدید"]').click();
    cy.url().should("include", "create");
    cy.readFile("cypress/fixtures/saveData.json").then((Data) => {
      cy.get("#setLevelsWithSearchBox")
        .find("input:visible")
        .invoke("val")
        .then((val) => {
          expect(val).to.eq(Data.claims.ClaimLevel.subject.first);
        });
      cy.get("#setLevelsWithSearchBox").find("input:visible").click();
      cy.get('div[role="listbox"]:visible').within(() => {
        cy.get('div[role="option"]').should(
          "have.text",
          Data.claims.ClaimLevel.subject.first
        );
      });
    });
  });
  it("bill", () => {
    cy.intercept("GET", "**/OData/**").as("OData");
    cy.visit(
      "http://test.andishehpardaz.local/claims/bill/index/fa4b6417-4599-416f-ba98-ff029c5a229d"
    );
    cy.wait("@OData");
    cy.get('div[title="ثبت مورد جدید"]').click();
    cy.url().should("include", "create");
    cy.readFile("cypress/fixtures/saveData.json").then((Data) => {
      cy.get("#setLevelsWithSearchBox")
        .find("input:visible")
        .invoke("val")
        .then((val) => {
          expect(val).to.eq(Data.claims.ClaimLevel.subject.first);
        });
      cy.get("#setLevelsWithSearchBox").find("input:visible").click();
      cy.get('div[role="listbox"]:visible').within(() => {
        cy.get('div[role="option"]').should(
          "have.text",
          Data.claims.ClaimLevel.subject.first
        );
      });
    });
  });
  it("experttheory", () => {
    cy.intercept("GET", "**/OData/**").as("OData");
    cy.visit(
      "http://test.andishehpardaz.local/claims/experttheory/index/fa4b6417-4599-416f-ba98-ff029c5a229d"
    );
    cy.wait("@OData");
    cy.get('div[aria-label="ثبت نظریه جدید"]').click();
    cy.url().should("include", "create");
    cy.readFile("cypress/fixtures/saveData.json").then((Data) => {
      cy.get("#setLevelsWithSearchBox")
        .find("input:visible")
        .invoke("val")
        .then((val) => {
          expect(val).to.eq(Data.claims.ClaimLevel.subject.first);
        });
      cy.get("#setLevelsWithSearchBox").find("input:visible").click();
      cy.get('div[role="listbox"]:visible').within(() => {
        cy.get('div[role="option"]').should(
          "have.text",
          Data.claims.ClaimLevel.subject.first
        );
      });
    });
  });
  it("proceedings", () => {
    cy.intercept("GET", "**/OData/**").as("OData");
    cy.visit(
      "http://test.andishehpardaz.local/claims/proceedings/index/fa4b6417-4599-416f-ba98-ff029c5a229d"
    );
    cy.wait("@OData");
    cy.get('div[aria-label="ثبت دادنامه جدید"]').click();
    cy.url().should("include", "create");
    cy.readFile("cypress/fixtures/saveData.json").then((Data) => {
      cy.get("#setLevelsWithSearchBox")
        .find("input:visible")
        .invoke("val")
        .then((val) => {
          expect(val).to.eq(Data.claims.ClaimLevel.subject.first);
        });
      cy.get("#setLevelsWithSearchBox").find("input:visible").click();
      cy.get('div[role="listbox"]:visible').within(() => {
        cy.get('div[role="option"]').should(
          "have.text",
          Data.claims.ClaimLevel.subject.first
        );
      });
    });
  });
  it("cost", () => {
    cy.intercept("GET", "**/OData/**").as("OData");
    cy.visit(
      "http://test.andishehpardaz.local/claims/cost/index/fa4b6417-4599-416f-ba98-ff029c5a229d"
    );
    cy.wait("@OData");
    cy.get('div[title="ثبت مورد جدید"]').click();
    cy.url().should("include", "create");
    cy.readFile("cypress/fixtures/saveData.json").then((Data) => {
      cy.get("#setLevelsWithSearchBox")
        .find("input:visible")
        .invoke("val")
        .then((val) => {
          expect(val).to.eq(Data.claims.ClaimLevel.subject.first);
        });
      cy.get("#setLevelsWithSearchBox").find("input:visible").click();
      cy.get('div[role="listbox"]:visible').within(() => {
        cy.get('div[role="option"]').should(
          "have.text",
          Data.claims.ClaimLevel.subject.first
        );
      });
    });
  });
});
