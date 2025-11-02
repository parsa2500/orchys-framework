describe("CRUD", function () {
  this.beforeEach(() => {
    cy.clearData();
    cy.login();
  });

  it("Create", () => {
    cy.intercept(
      "POST",
      "http://test.andishehpardaz.local/Base/bank/savebank"
    ).as("save");
    cy.intercept("GET", "**/odata/**").as("odata");
    cy.visit("http://test.andishehpardaz.local/base/bank");
    cy.wait("@odata");

    cy.get('div[ng-controller="pageCtrl"]')
      .children("div:first")
      .within(() => {
        cy.get('div[title="ثبت مورد جدید"]').click();
        cy.wait(5000);

        cy.get('tr[aria-rowindex="1"]:visible')
          .first()
          .within(() => {
            cy.get('td[aria-describedby="dx-col-3"]').within(() => {
              cy.get("input")
                .randomValue(10)
                .invoke("val")
                .then((val: any) => {
                  cy.updateJson("Setting", "Base.Bank.subject.first", val);
                });
            });

            cy.get('td[aria-describedby="dx-col-4"]').within(() => {
              cy.get("input").randomValue(10);
            });

            cy.get('td[aria-describedby="dx-col-5"]').within(() => {
              cy.get("input:first",{timeout:20000})
                .scrollIntoView()
                .wait(1000)
                .click({ force: true });

              cy.document().within(() => {
                cy.get('div[role="listbox"]:visible').within(() => {
                  cy.get('div[role="option"]').first().click({ force: true });
                });
              });
            });

            cy.get('a[title="ذخیره"]').click({ force: true });
          });

        cy.wait("@save");
      });
  });

  it("Read", () => {
    cy.intercept(
      "GET",
      "http://test.andishehpardaz.local/Calendar/GetEventsJson"
    ).as("weekData");
    cy.intercept("GET", "**/odata/**").as("odata");

    cy.visit(
      "http://test.andishehpardaz.local/requests/bonds/create/?ContractID=3d53ca30-271c-490a-92a6-44a77f77e238"
    );

    cy.get('select[name="TypeID"]').select("a");

    cy.get('input[name="BankBranchName"]')
      .should("be.visible")
      .parent()
      .find('button[ng-click="selectBankAndBranch()"]')
      .click();

    cy.get("div[uib-modal-transclude]")
      .should("be.visible")
      .within(() => {
        cy.readFile("cypress/fixtures/Setting.json").then((Data: any) => {
          cy.request(
            "GET",
            "http://test.andishehpardaz.local/odata/paye/banks"
          ).then(({ body }: any) => {
            const names = Array.isArray(body?.value)
              ? body.value.map((x: any) => x?.Name).filter(Boolean)
              : [];

            expect(names.length).to.be.greaterThan(0);
            console.log(names.join(", "));
            expect(names).to.include(Data.Base.Bank.subject.first);
          });
        });
      });
  });

  it("update part 1", () => {
    cy.intercept(
      "GET",
      "http://test.andishehpardaz.local/Scripts/cldr/supplemental/weekData.json"
    ).as("weekData");
    cy.intercept("GET", "**/odata/**").as("odata");
    cy.intercept(
      "POST",
      "http://test.andishehpardaz.local/Base/bank/savebank"
    ).as("save");

    cy.visit("http://test.andishehpardaz.local/base/bank");
    cy.wait("@odata");

    cy.get('div[ng-controller="pageCtrl"]')
      .children("div:first")
      .within(() => {
        cy.readFile("cypress/fixtures/Setting.json").then((Data: any) => {
          cy.wait(3000);
          cy.get('input[aria-label="فیلتر سلول"]')
            .first()
            .type(Data.Base.Bank.subject.first);
          cy.contains(Data.Base.Bank.subject.first)
            .closest("tr")
            .within(() => {
              cy.get('a[title="ویرایش"]').click({ force: true });
            });
        });

        cy.wait(5000);

        cy.get('tr[aria-rowindex="1"]:visible')
          .first()
          .within(() => {
            cy.get('td[aria-describedby="dx-col-3"]').within(() => {
              cy.get("input")
                .clear()
                .randomValue(10)
                .invoke("val")
                .then((val: any) => {
                  cy.updateJson("Setting", "Base.Bank.subject.second", val);
                });
            });

            cy.get('td[aria-describedby="dx-col-4"]').within(() => {
              cy.get("input").randomValue(10);
            });

            cy.get('td[aria-describedby="dx-col-5"]').within(() => {
              cy.get("input:first")
                .scrollIntoView()
                .wait(1000)
                .click({ force: true });

              cy.document().within(() => {
                cy.get('div[role="listbox"]:visible').within(() => {
                  cy.get('div[role="option"]').first().click({ force: true });
                });
              });
            });

            cy.get('a[title="ذخیره"]').click({ force: true });
          });

        cy.wait("@save");
      });
  });

  it("update part 2", () => {
    cy.intercept(
      "GET",
      "http://test.andishehpardaz.local/Scripts/cldr/supplemental/weekData.json"
    ).as("weekData");
    cy.intercept("GET", "**/odata/**").as("odata");
    cy.visit(
      "http://test.andishehpardaz.local/requests/bonds/create/?ContractID=3d53ca30-271c-490a-92a6-44a77f77e238"
    );

    cy.get('select[name="TypeID"]').select("a");

    cy.get('input[name="BankBranchName"]')
      .should("be.visible")
      .parent()
      .find('button[ng-click="selectBankAndBranch()"]')
      .click();

    cy.get("div[uib-modal-transclude]")
      .should("be.visible")
      .within(() => {
        cy.readFile("cypress/fixtures/Setting.json").then((Data: any) => {
          cy.request(
            "GET",
            "http://test.andishehpardaz.local/odata/paye/banks"
          ).then(({ body }: any) => {
            const names = Array.isArray(body?.value)
              ? body.value.map((x: any) => x?.Name).filter(Boolean)
              : [];

            expect(names.length).to.be.greaterThan(0);
            console.log(names.join(", "));
            expect(names).to.include(Data.Base.Bank.subject.second);
            expect(names).not.to.include(Data.Base.Bank.subject.first);
          });
        });
      });
  });

  it("Delete", () => {
    cy.intercept(
      "GET",
      "http://test.andishehpardaz.local/Scripts/cldr/supplemental/weekData.json"
    ).as("weekData");
    cy.intercept("GET", "**/odata/**").as("odata");
    cy.intercept(
      "POST",
      "http://test.andishehpardaz.local/Base/bank/removebank"
    ).as("removeBank");

    cy.visit("http://test.andishehpardaz.local/base/bank");
    cy.wait("@odata");

    cy.get('div[ng-controller="pageCtrl"]')
      .children("div:first")
      .within(() => {
        cy.readFile("cypress/fixtures/Setting.json").then((Data: any) => {
          cy.get('input[aria-label="فیلتر سلول"]')
            .first()
            .type(Data.Base.Bank.subject.second);
          cy.contains(Data.Base.Bank.subject.second)
            .closest("tr")
            .find('a[title="حذف"]')
            .click({ force: true });
        });
      });

    cy.wait("@removeBank");
  });
});
