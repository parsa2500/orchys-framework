describe("CRUD", function () {
  this.beforeEach(() => {
    cy.clearData();
    cy.login();
  });

  it("Create", () => {
    cy.intercept("GET", "**/odata/**").as("odata");
    cy.intercept(
      "POST",
      "http://test.andishehpardaz.local/base/newspapers/save"
    ).as("save");
    cy.visit("http://test.andishehpardaz.local/base/newspapers");
    cy.wait("@odata");
    cy.get('div[title="ثبت مورد جدید"]').click();
    cy.get('div[role="presentation"]:visible')
      .last()
      .within(() => {
        cy.get("input")
          .eq(0)
          .randomValue(10)
          .invoke("val")
          .then((val: any) => {
            cy.updateJson("Setting", "Base.newsPaper.subject.first", val);
          });
        cy.get("input").eq(1).click({ force: true });
        cy.document().within(() => {
          cy.get('div[role="dialog"]:visible').within(() => {
            cy.get('div[role="option"]:last').wait(3000).click({ force: true });
          });
        });
        cy.get("input").eq(2).click({ force: true });
        cy.document().within(() => {
          cy.get('div[role="dialog"]:visible').within(() => {
            cy.get('div[role="option"]:first').click({ force: true });
          });
        });
        cy.get("input").eq(3).click({ force: true });
        cy.document().within(() => {
          cy.get('div[role="dialog"]:visible')
            .last()
            .within(() => {
              cy.get('div[role="option"]:first').click({ force: true });
            });
        });
        cy.get('a[title="ذخیره"]:visible').click({ force: true });
      });
    cy.wait("@save");
  });

  it("Read", () => {
    cy.intercept("GET", "**/odata/**").as("odata");
    cy.visit(
      "http://test.andishehpardaz.local/requests/announcements/index/489a0252-bb03-4497-8e1f-261515c489c0"
    );
    cy.wait("@odata");
    cy.get('div[title="ثبت مورد جدید"]').click();
    cy.url().should("include", "create");
    cy.get('select[name="Tender_Newspaper.TypeID"]').select("local");
    cy.readFile("cypress/fixtures/Setting.json").then((Data: any) => {
      cy.get('select[ng-model="model.Tender_Newspaper.NewspaperID"]').should(
        "contains.text",
        Data.Base.newsPaper.subject.first
      );
    });
  });

  it("update part 1", () => {
    cy.intercept("GET", "**/odata/**").as("odata");
    cy.intercept(
      "POST",
      "http://test.andishehpardaz.local/base/newspapers/save"
    ).as("save");
    cy.visit("http://test.andishehpardaz.local/base/newspapers");
    cy.wait("@odata");
    cy.readFile("cypress/fixtures/Setting.json").then((Data: any) => {
      cy.get('input[aria-label="فیلتر سلول"]')
        .first()
        .type(Data.Base.newsPaper.subject.first);
      cy.get('div[role="presentation"]:visible')
        .last()
        .within(() => {
          cy.contains(Data.Base.newsPaper.subject.first)
            .closest("tr")
            .within(() => {
              cy.get('a[title="ویرایش"]').click({ force: true });
            });
          cy.get('tr[aria-rowindex="1"]:visible')
            .first()
            .within(() => {
              cy.get("input")
                .eq(0)
                .clear()
                .randomValue(10)
                .invoke("val")
                .then((val: any) => {
                  cy.updateJson(
                    "Setting",
                    "Base.newsPaper.subject.second",
                    val
                  );
                });
              cy.get("input").eq(1).click({ force: true });
              cy.document().within(() => {
                cy.get('div[role="dialog"]:visible').within(() => {
                  cy.get('div[role="option"]:last')
                    .wait(3000)
                    .click({ force: true });
                });
              });
              cy.get("input").eq(2).click({ force: true });
              cy.document().within(() => {
                cy.get('div[role="dialog"]:visible').within(() => {
                  cy.get('div[role="option"]:first').click({ force: true });
                });
              });
              cy.get("input").eq(3).click({ force: true });
              cy.document().within(() => {
                cy.get('div[role="dialog"]:visible')
                  .last()
                  .within(() => {
                    cy.get('div[role="option"]:first').click({ force: true });
                  });
              });
            });
          cy.get('a[title="ذخیره"]:visible').click({ force: true });
        });
      cy.wait("@save");
    });
  });

  it("update part 2", () => {
    cy.intercept("GET", "**/odata/**").as("odata");
    cy.visit(
      "http://test.andishehpardaz.local/requests/announcements/index/489a0252-bb03-4497-8e1f-261515c489c0"
    );
    cy.wait("@odata");
    cy.get('div[title="ثبت مورد جدید"]').click();
    cy.url().should("include", "create");
    cy.get('select[name="Tender_Newspaper.TypeID"]').select("local");
    cy.readFile("cypress/fixtures/Setting.json").then((Data: any) => {
      cy.get(
        'select[ng-model="model.Tender_Newspaper.NewspaperID"] option'
      ).should("contains.text", Data.Base.newsPaper.subject.second);
      cy.get(
        'select[ng-model="model.Tender_Newspaper.NewspaperID"] option'
      ).should("not.contains.text", Data.Base.newsPaper.subject.first);
    });
  });

  it("Delete", () => {
    cy.intercept("GET", "**/odata/**").as("odata");
    cy.intercept(
      "POST",
      "http://test.andishehpardaz.local/base/newspapers/delete"
    ).as("delete");
    cy.visit("http://test.andishehpardaz.local/base/newspapers");
    cy.wait("@odata");
    cy.readFile("cypress/fixtures/Setting.json").then((Data: any) => {
      cy.get('input[aria-label="فیلتر سلول"]')
        .first()
        .type(Data.Base.newsPaper.subject.second);
      cy.get('div[role="presentation"]:visible')
        .last()
        .within(() => {
          cy.contains(Data.Base.newsPaper.subject.second)
            .closest("tr")
            .within(() => {
              cy.get('a[title="حذف"]').click({ force: true });
            });
        });
      cy.wait("@delete");
    });
  });
});
