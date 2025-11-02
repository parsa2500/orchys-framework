/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    login(): Chainable<void>;
    randomValue(length: number | string): Chainable<void>;
    randomNumber(length: number | string): Chainable<void>;
    permissionSwitchMax(
      sub?: string,
      num?: number,
      name?: string[]
    ): Chainable<void>;
    fastPermission(user?: string): Chainable<void>;
    clearData(): Chainable<void>;
    updateJson(
      filePath: string,
      pathOrMap: string | Record<string, any>,
      value?: any
    ): Chainable<void>;
    newDatePicker(
      year: number | string,
      month: number | string,
      day: number | string
    ): Chainable<viod>;
    currentDate(): Chainable<void>;
    buttonMode(locate: number): Chainable<void>;
    randomGenrate(length?: number): Chainable<JQuery<HTMLElement>>;
  }
}
