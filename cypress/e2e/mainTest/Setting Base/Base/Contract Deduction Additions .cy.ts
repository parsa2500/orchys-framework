describe("CRUD", function () {
  this.beforeEach(() => {
    cy.clearData();
    cy.login();
  });
  it("Create", () => {
    cy.intercept("GET", "**/odata/**").as("odata");
    cy.intercept(
      "POST",
      "http://test.andishehpardaz.local/Base/ContractDeductionAdditions/InsertContractDeductionAdditionsTemplate/"
    ).as("save");
    cy.visit(
      "http://test.andishehpardaz.local/base/contractDeductionAdditions"
    );
    cy.get('div[dx-data-grid="templateConfig"]').within(() => {
      cy.get('div[aria-label="ثبت مورد جدید"]').click();
      cy.get('div[role="presentation"]:visible')
        .last()
        .within(() => {
          cy.wait(3000);
          cy.get('tr[role="row"]')
            .first()
            .within(() => {
              cy.get("input:visible")
                .first()
                .randomValue("10")
                .invoke("val")
                .then((val) => {
                  cy.updateJson("Setting", "Base.Deduction.subject.first", val);
                });
              cy.get('a[title="ذخیره"]').click({ force: true });
            });
        });
      cy.wait("@save");
      cy.readFile("cypress/fixtures/Setting.json").then((Data) => {
        cy.get('input[aria-label="فیلتر سلول"]')
          .first()
          .clear()
          .type(Data.Base.Deduction.subject.first);
        cy.wait("@odata");
        cy.contains(Data.Base.Deduction.subject.first).click();
        cy.wait("@odata");
      });
    });
    cy.get('div[dx-data-grid="additionConfig"]').within(() => {
      cy.get('div[aria-label="ثبت مورد جدید"]').click();
      cy.get('div[role="presentation"]:visible')
        .last()
        .within(() => {
          cy.wait(3000);
          cy.get('tr[role="row"]')
            .first()
            .within(() => {
              cy.get("input:visible")
                .first()
                .randomValue("10")
                .invoke("val")
                .then((val) => {
                  cy.updateJson(
                    "Setting",
                    "Base.Deduction.personel.subject.first",
                    val
                  );
                });
              cy.get("input")
                .last()
                .randomNumber(2)
                .invoke("val")
                .then((val) => {
                  cy.updateJson(
                    "Setting",
                    "Base.Deduction.personel.percent.first",
                    val
                  );
                });
              cy.get('a[title="ذخیره"]').click({ force: true });
            });
        });
      cy.wait("@odata");
    });
  });
  it("Read", () => {
    cy.intercept("GET", "**/odata/**").as("odata");
    cy.intercept(
      "POST",
      "http://test.andishehpardaz.local/Base/ContractType/Load"
    ).as("load");
    cy.visit("http://test.andishehpardaz.local/requests/contract/create");
    cy.wait("@load");
    cy.readFile("cypress/fixtures/Setting.json").then((Data) => {
      cy.get('div[aria-label="انتخاب از قالب"]').click();
      cy.get("div[uib-modal-transclude]").within(() => {
        cy.get('div[dx-data-grid="templateConfig"]').within(() => {
          cy.get('input[aria-label="فیلتر سلول"]')
            .first()
            .clear()
            .type(Data.Base.Deduction.subject.first);
          cy.wait("@odata");
          cy.contains(Data.Base.Deduction.subject.first).click();
          cy.wait("@odata");
        });
      });
      cy.get('div[dx-data-grid="additionConfig"]').within(() => {
        cy.get('div[role="presentation"]:visible')
          .last()
          .within(() => {
            cy.wait(3000);
            cy.get('tr[role="row"]')
              .first()
              .within(() => {
                cy.get('td[aria-colindex="4"]')
                  .invoke("text")
                  .then((val) => {
                    expect(val).to.eq(
                      Data.Base.Deduction.personel.subject.first
                    );
                  });
                cy.get(`td[aria-colindex="5"]`)
                  .invoke("text")
                  .then((val) => {
                    expect(val).to.eq(
                      Data.Base.Deduction.personel.percent.first + "%"
                    );
                  });
              });
          });
      });
    });
  });
  it("Update part 1", () => {
    cy.intercept("GET", "**/odata/**").as("odata");
    cy.intercept(
      "POST",
      "http://test.andishehpardaz.local/Base/ContractDeductionAdditions/InsertContractDeductionAdditionsTemplate/"
    ).as("save");
    cy.readFile("cypress/fixtures/Setting.json").then((Data) => {
      cy.visit(
        "http://test.andishehpardaz.local/base/contractDeductionAdditions"
      );
      cy.get('div[dx-data-grid="templateConfig"]').within(() => {
        cy.get('input[aria-label="فیلتر سلول"]').type(
          Data.Base.Deduction.subject.first
        );
        cy.wait("@odata");
        cy.get('div[role="presentation"]:visible')
          .last()
          .within(() => {
            cy.wait(3000);
            cy.get('a[title="ویرایش"]').click();
            cy.wait(3000);
            cy.get('tr[role="row"]')
              .first()
              .within(() => {
                cy.get("input:visible")
                  .first()
                  .clear()
                  .randomValue("10")
                  .invoke("val")
                  .then((val) => {
                    cy.updateJson(
                      "Setting",
                      "Base.Deduction.subject.second",
                      val
                    );
                  });
                cy.get('a[title="ذخیره"]').click({ force: true });
              });
          });
        // cy.wait("@save");
        // cy.pause();
        // cy.get('input[aria-label="فیلتر سلول"]')
        //   .first()
        //   .clear()
        //   .wait(3000)
        //   .type(Data.Base.Deduction.subject.second);
        // cy.wait("@odata");
        // cy.contains(Data.Base.Deduction.subject.second).click();
        // cy.wait("@odata");
        cy.readFile("cypress/fixtures/Setting.json", { timeout: 5000 }).then(
          ({ Base }) => {
            const query = String(Base?.Deduction?.subject?.second || "");

            // صبر هدفمند برای input فیلتر (بعد از رندر مجدد grid)
            cy.get('input[aria-label="فیلتر سلول"]')
              .first()
              .should("be.visible")
              .clear()
              .focus()
              .type(query, { delay: 0 }) // همیشه string تایپ کن
              .should("have.value", query) // تأیید مقدار تایپ‌شده
              .blur();

            cy.wait("@odata");
            cy.contains(query).should("be.visible").click();
            cy.wait("@odata");
          }
        );
      });
      cy.get('div[dx-data-grid="additionConfig"]').within(() => {
        cy.get('div[role="presentation"]:visible')
          .last()
          .within(() => {
            cy.wait(3000);
            cy.get('a[title="ویرایش"]:visible').first().click();
            cy.wait(3000);
            cy.get('tr[role="row"]')
              .first()
              .within(() => {
                cy.get("input:visible")
                  .first()
                  .clear()
                  .randomValue("10")
                  .invoke("val")
                  .then((val) => {
                    cy.updateJson(
                      "Setting",
                      "Base.Deduction.personel.subject.second",
                      val
                    );
                  });
                cy.get("input")
                  .last()
                  .clear()
                  .randomNumber(2)
                  .invoke("val")
                  .then((val) => {
                    cy.updateJson(
                      "Setting",
                      "Base.Deduction.personel.percent.second",
                      val
                    );
                  });
                cy.get('a[title="ذخیره"]').click({ force: true });
                cy.wait(3000);
              });
          });
        cy.wait("@odata");
      });
    });
  });
  it("Update part 2", () => {
    cy.intercept("GET", "**/odata/**").as("odata");
    cy.intercept(
      "POST",
      "http://test.andishehpardaz.local/Base/ContractType/Load"
    ).as("load");
    cy.visit("http://test.andishehpardaz.local/requests/contract/create");
    cy.wait("@load");
    cy.readFile("cypress/fixtures/Setting.json").then((Data) => {
      cy.get('div[aria-label="انتخاب از قالب"]').click();
      cy.get("div[uib-modal-transclude]").within(() => {
        cy.get('div[dx-data-grid="templateConfig"]').within(() => {
          cy.get('input[aria-label="فیلتر سلول"]')
            .first()
            .clear()
            .type(Data.Base.Deduction.subject.second);
          cy.wait("@odata");
          cy.contains(Data.Base.Deduction.subject.second).click();
          cy.wait("@odata");
        });
      });
      cy.get('div[dx-data-grid="additionConfig"]').within(() => {
        cy.get('div[role="presentation"]:visible')
          .last()
          .within(() => {
            cy.wait(3000);
            cy.get('tr[role="row"]')
              .first()
              .within(() => {
                cy.get('td[aria-colindex="4"]')
                  .invoke("text")
                  .then((val) => {
                    expect(val).to.eq(
                      Data.Base.Deduction.personel.subject.second
                    );
                  });
                cy.get(`td[aria-colindex="5"]`)
                  .invoke("text")
                  .then((val) => {
                    expect(val).to.eq(
                      Data.Base.Deduction.personel.percent.second + "%"
                    );
                  });
              });
          });
      });
    });
  });
  it("Delete", () => {
    cy.intercept("GET", "**/odata/**").as("odata");
    cy.intercept(
      "POST",
      "http://test.andishehpardaz.local/Base/ContractDeductionAdditions/RemoveContractDeductionAdditionsTemplate/*"
    ).as("remove");
    cy.readFile("cypress/fixtures/Setting.json").then((Data) => {
      cy.visit(
        "http://test.andishehpardaz.local/base/contractDeductionAdditions"
      );
      cy.get('div[dx-data-grid="templateConfig"]').within(() => {
        cy.get('input[aria-label="فیلتر سلول"]')
          .clear()
          .type(Data.Base.Deduction.subject.second);
        cy.wait("@odata");
        cy.get('div[role="presentation"]:visible')
          .last()
          .within(() => {
            cy.wait(3000);
            cy.get('a[title="حذف"]').click();
            cy.wait(3000);
          });
      });
      cy.wait("@remove");
      cy.wait("@odata");
    });
  });
});
