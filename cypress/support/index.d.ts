/// <reference path="./commands.d.ts" />


declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      [key: string]: (...args: any[]) => Chainable<any>;
    }
  }
}
export {};
