describe("CRUD", function () {
  this.beforeEach(() => {
    cy.clearData();
    cy.login();
  });

  it("Create", () => {
    cy.intercept("GET", "**/odata/**").as("odata");
    cy.intercept(
      "POST",
      "http://test.andishehpardaz.local/base/requestCategory/saveGroup"
    ).as("save");
    cy.intercept(
      "POST",
      "http://test.andishehpardaz.local/base/requestCategory/saveCategory"
    ).as("saveCategory");
    cy.visit("http://test.andishehpardaz.local/base/requestCategory");
    cy.wait("@odata");
    cy.wait(4000);

    // set 1
    cy.get("#gridContainer").within(() => {
      cy.get('div[aria-label="ثبت مورد جدید"]').click();
      cy.get('div[role="presentation"]:visible')
        .last()
        .within(() => {
          cy.get('tr[role="row"]')
            .first()
            .within(() => {
              cy.get("input")
                .first()
                .randomNumber(4)
                .invoke("val")
                .then((val) => {
                  cy.updateJson(
                    "Setting",
                    "Base.RequestCategory.num.first",
                    val
                  );
                });
              cy.get("input")
                .eq(1)
                .randomValue(10)
                .invoke("val")
                .then((val) => {
                  cy.updateJson(
                    "Setting",
                    "Base.RequestCategory.subject.first",
                    val
                  );
                });
              cy.get("input").eq(2).click({ force: true });
              cy.document().within(() => {
                cy.get('div[role="dialog"]:visible').within(() => {
                  cy.get('div[role="option"]:first')
                    .wait(3000)
                    .click({ force: true });
                });
              });
              cy.get("input")
                .eq(2)
                .invoke("val")
                .then((val) => {
                  cy.updateJson(
                    "Setting",
                    "Base.RequestCategory.perk.first",
                    val
                  );
                });
              cy.get("input").eq(3).click({ force: true });
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
      cy.wait("@odata");
      cy.readFile("cypress/fixtures/Setting.json").then((Data) => {
        cy.get('input[aria-label="فیلتر سلول"]').type(
          Data.Base.RequestCategory.subject.first
        );
        cy.contains(Data.Base.RequestCategory.subject.first).click();
      });
    });

    // set 2
    cy.get('div[dx-tree-list="gridCateConfig"]').within(() => {
      cy.get('div[aria-label="ثبت مورد جدید"]').click();
      cy.get('div[role="presentation"]:visible')
        .last()
        .within(() => {
          cy.get('tr[role="row"]')
            .first()
            .within(() => {
              cy.wait(3000);
              cy.get("input")
                .first()
                .clear()
                .randomValue(10)
                .invoke("val")
                .then((val) => {
                  cy.updateJson(
                    "Setting",
                    "Base.RequestCategory.category.first",
                    val
                  );
                });
              cy.get("input").eq(3).click({ force: true });
              cy.document().within(() => {
                cy.get('div[role="dialog"]:visible').within(() => {
                  cy.get('div[role="option"]:first')
                    .wait(3000)
                    .click({ force: true });
                });
              });
              cy.get('a[title="ذخیره"]:visible').click({ force: true });
            });
        });
      cy.wait("@saveCategory");
    });
  });

  it("Read", () => {
    cy.intercept(
      "GET",
      "http://test.andishehpardaz.local/base/requestCategory/*"
    ).as("GetGroup");
    cy.intercept(
      "GET",
      "http://test.andishehpardaz.local/odata/paye/requestcategories*"
    ).as("requestCategory");
    cy.intercept(
      "GET",
      "http://test.andishehpardaz.local/requests/request/CheckCondition"
    ).as("checkcondition");
    cy.visit(
      "http://test.andishehpardaz.local/requests/request/edit/5bfd3906-0781-4a07-8fe7-408ade7ad569"
    );

    cy.get('button[ng-click="selectTypeAndCategory()"]').click();
    cy.get("div[uib-modal-transclude]")
      .should("be.visible")
      .within(() => {
        cy.wait("@GetGroup");
        cy.readFile("cypress/fixtures/Setting.json").then((Data) => {
          cy.wait(2000);
          cy.get('input[aria-label="فیلتر سلول"]')
            .first()
            .clear()
            .type(Data.Base.RequestCategory.subject.first);
          cy.contains(Data.Base.RequestCategory.subject.first).click();
          cy.wait("@requestCategory");
          cy.contains(Data.Base.RequestCategory.category.first).click();
          cy.get('button[ng-click="ok()"]').click();
        });
      });
    cy.get(`button[ng-click="selectDepartment('applicant')"]`).click();
    cy.buttonMode(2);
    cy.get(".submit").click();

    // Restore workflow
    cy.intercept(
      "GET",
      "http://test.andishehpardaz.local/odata/requestcontractor?id*"
    ).as("Odata");
    cy.visit(
      "http://test.andishehpardaz.local/requests/details/index/5bfd3906-0781-4a07-8fe7-408ade7ad569"
    );

    cy.get("body").then(($body) => {
      if ($body.find('a[href*="/requests/request/selectWorkflow/"]').length) {
        cy.log("✅ Workflow exists, going to restore it");
      } else {
        cy.log("🧹 No workflow found, cleaning up first...");
        cy.get('a[data-hint="موارد بیشتر"]').click();
        cy.get('div[aria-labelledby="dropdownMenuLink"]:visible').within(() => {
          cy.get('a[ng-click="deleteworkflow()"]').click();
        });
        cy.TryToCheck("@Odata", 1, 40000, () => {
          cy.get("div[uib-modal-transclude]")
            .should("be.visible")
            .within(() => {
              cy.get('button[type="submit"]').click();
            });
        });
      }
    });

    cy.get("#sidebar").within(() => {
      cy.get('a[href*="/requests/request/selectWorkflow/"]').click();
    });
    cy.url().should("include", "selectWorkflow");
    cy.contains("مناقصه عمومی").should("be.visible");
  });

  it("update part 1", () => {
    cy.intercept("GET", "**/odata/**").as("odata");
    cy.intercept(
      "POST",
      "http://test.andishehpardaz.local/base/requestCategory/saveGroup"
    ).as("save");
    cy.intercept(
      "POST",
      "http://test.andishehpardaz.local/base/requestCategory/saveCategory"
    ).as("saveCategory");
    cy.visit("http://test.andishehpardaz.local/base/requestCategory");
    cy.wait("@odata");
    cy.wait(4000);

    cy.readFile("cypress/fixtures/Setting.json").then((Data) => {
      // set 1
      cy.get("#gridContainer").within(() => {
        cy.get('input[aria-label="فیلتر سلول"]')
          .first()
          .clear()
          .type(Data.Base.RequestCategory.subject.first);
        cy.wait(3000);
        cy.get('div[role="presentation"]:visible')
          .last()
          .within(() => {
            cy.get('tr[role="row"]')
              .first()
              .within(() => {
                cy.get("a:first").click();
              });
            cy.get('tr[role="row"]')
              .first()
              .within(() => {
                cy.get("input")
                  .first()
                  .clear()
                  .randomNumber(4)
                  .invoke("val")
                  .then((val) => {
                    cy.updateJson(
                      "Setting",
                      "Base.RequestCategory.num.second",
                      val
                    );
                  });
                cy.get("input")
                  .eq(1)
                  .clear()
                  .randomValue(10)
                  .invoke("val")
                  .then((val) => {
                    cy.updateJson(
                      "Setting",
                      "Base.RequestCategory.subject.second",
                      val
                    );
                  });
                cy.get("input").eq(2).click({ force: true });
                cy.document().within(() => {
                  cy.get('div[role="dialog"]:visible').within(() => {
                    cy.get('div[role="option"]')
                      .eq(2)
                      .wait(3000)
                      .click({ force: true });
                  });
                });
                cy.get("input")
                  .eq(2)
                  .invoke("val")
                  .then((val) => {
                    cy.updateJson(
                      "Setting",
                      "Base.RequestCategory.perk.second",
                      val
                    );
                  });
                cy.get("input").eq(3).click({ force: true });
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
        cy.wait("@odata");
        cy.readFile("cypress/fixtures/Setting.json").then((Data) => {
          cy.get('input[aria-label="فیلتر سلول"]')
            .clear()
            .type(Data.Base.RequestCategory.subject.second);
          cy.contains(Data.Base.RequestCategory.subject.second).click();
        });
      });

      // set 2
      cy.get('div[dx-tree-list="gridCateConfig"]').within(() => {
        cy.get('div[role="presentation"]:visible')
          .last()
          .within(() => {
            cy.get('a[title="ویرایش"]').click();
            cy.get('tr[role="row"]')
              .first()
              .within(() => {
                cy.wait(3000);
                cy.get("input")
                  .first()
                  .clear()
                  .randomValue(10)
                  .invoke("val")
                  .then((val) => {
                    cy.updateJson(
                      "Setting",
                      "Base.RequestCategory.category.second",
                      val
                    );
                  });
                cy.get("input").eq(3).click({ force: true });
                cy.document().within(() => {
                  cy.get('div[role="dialog"]:visible').within(() => {
                    cy.get('div[role="option"]:first')
                      .wait(3000)
                      .click({ force: true });
                  });
                });
                cy.get('a[title="ذخیره"]:visible').click({ force: true });
              });
          });
        cy.wait("@saveCategory");
      });
    });
  });

  it("Update part 2", () => {
    cy.intercept(
      "GET",
      "http://test.andishehpardaz.local/base/requestCategory/*"
    ).as("GetGroup");
    cy.intercept(
      "GET",
      "http://test.andishehpardaz.local/odata/paye/requestcategories*"
    ).as("requestCategory");
    cy.intercept(
      "GET",
      "http://test.andishehpardaz.local/requests/request/CheckCondition"
    ).as("checkcondition");
    cy.visit(
      "http://test.andishehpardaz.local/requests/request/edit/5bfd3906-0781-4a07-8fe7-408ade7ad569"
    );
    cy.get('button[ng-click="selectTypeAndCategory()"]').click();
    cy.get("div[uib-modal-transclude]")
      .should("be.visible")
      .within(() => {
        cy.wait("@GetGroup");
        cy.readFile("cypress/fixtures/Setting.json").then((Data) => {
          cy.wait(2000);
          cy.get('input[aria-label="فیلتر سلول"]')
            .first()
            .clear()
            .type(Data.Base.RequestCategory.subject.second);
          cy.contains(Data.Base.RequestCategory.subject.second).click();
          cy.wait("@requestCategory");
          cy.contains(Data.Base.RequestCategory.category.second).click();
          cy.get('button[ng-click="ok()"]').click();
        });
      });
    cy.get(".submit").click();

    // Restore workflow
    cy.intercept(
      "GET",
      "http://test.andishehpardaz.local/odata/requestcontractor?id*"
    ).as("Odata");
    cy.visit(
      "http://test.andishehpardaz.local/requests/details/index/5bfd3906-0781-4a07-8fe7-408ade7ad569"
    );
    cy.get("body").then(($body) => {
      if ($body.find('a[href*="/requests/request/selectWorkflow/"]').length) {
        cy.log("✅ Workflow exists, going to restore it");
      } else {
        cy.log("🧹 No workflow found, cleaning up first...");
        cy.get('a[data-hint="موارد بیشتر"]').click();
        cy.get('div[aria-labelledby="dropdownMenuLink"]:visible').within(() => {
          cy.get('a[ng-click="deleteworkflow()"]').click();
        });
        cy.TryToCheck("@Odata", 1, 40000, () => {
          cy.get("div[uib-modal-transclude]")
            .should("be.visible")
            .within(() => {
              cy.get('button[type="submit"]').click();
            });
        });
      }
    });
    cy.get("#sidebar").within(() => {
      cy.get('a[href*="/requests/request/selectWorkflow/"]').click();
    });
    cy.url().should("include", "selectWorkflow");
    cy.contains("استعلام").should("be.visible");
  });

  it("Delete", () => {
    cy.intercept(
      "GET",
      "http://test.andishehpardaz.local/base/requestCategory/*"
    ).as("GetGroup");
    cy.intercept(
      "GET",
      "http://test.andishehpardaz.local/odata/paye/requestcategories*"
    ).as("requestCategory");
    cy.intercept(
      "GET",
      "http://test.andishehpardaz.local/requests/request/CheckCondition"
    ).as("checkcondition");
    cy.visit(
      "http://test.andishehpardaz.local/requests/request/edit/5bfd3906-0781-4a07-8fe7-408ade7ad569"
    );

    cy.get('button[ng-click="selectTypeAndCategory()"]').click();
    cy.get("div[uib-modal-transclude]")
      .should("be.visible")
      .within(() => {
        cy.wait(3000);
        cy.get('input[aria-label="فیلتر سلول"]')
          .first()
          .clear()
          .type("M پیمانکاری (ویرایش نشود!)");
        cy.wait(3000);
        cy.contains("M پیمانکاری (ویرایش نشود!)").click();
        cy.wait("@requestCategory");
        cy.contains("فضای سبز").click();
        cy.get('button[ng-click="ok()"]').click();
      });
    cy.get(".submit").click();

    cy.intercept("GET", "**/odata/**").as("odata");
    cy.intercept(
      "POST",
      "http://test.andishehpardaz.local/base/requestCategory/removeCategory/"
    ).as("remove");
    cy.intercept(
      "GET",
      "http://test.andishehpardaz.local/odata/paye/requestcategories*"
    ).as("removeCategory");
    cy.visit("http://test.andishehpardaz.local/base/requestCategory");
    cy.wait("@odata");
    cy.wait(4000);

    cy.readFile("cypress/fixtures/Setting.json").then((Data) => {
      cy.get("#gridContainer").within(() => {
        cy.get('input[aria-label="فیلتر سلول"]')
          .first()
          .clear()
          .type(Data.Base.RequestCategory.subject.second);
        cy.wait(3000);
        cy.get('div[role="presentation"]:visible')
          .last()
          .within(() => {
            cy.get('tr[role="row"]').first().click();
          });
        cy.wait("@odata");
        cy.readFile("cypress/fixtures/Setting.json").then((Data) => {
          cy.get('input[aria-label="فیلتر سلول"]')
            .clear()
            .type(Data.Base.RequestCategory.subject.second);
          cy.contains(Data.Base.RequestCategory.subject.second).click();
        });
      });

      cy.get('div[dx-tree-list="gridCateConfig"]').within(() => {
        cy.get('div[role="presentation"]:visible')
          .last()
          .within(() => {
            cy.get('tr[role="row"]')
              .first()
              .within(() => {
                cy.get(`a[title="حذف"]`).click();
              });
          });
        cy.wait("@remove");
      });

      cy.contains(Data.Base.RequestCategory.subject.second)
        .closest("tr")
        .find('a[title="حذف"]')
        .click();
    });

    cy.wait("@removeCategory");
  });
});
