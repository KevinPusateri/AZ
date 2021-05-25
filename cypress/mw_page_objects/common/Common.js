/// <reference types="Cypress" />


class Common {

  static canaleFromPopup() {
    cy.get('body').then($body => {
      if ($body.find('nx-modal-container').length > 0) {
        cy.wait(2000)
        cy.get('nx-modal-container').find('.agency-row').first().click()
      }
    })
  }

  static getBaseUrl() {
    const url = Cypress.env('currentEnv') === 'TEST' ? Cypress.env('baseUrlTest') : Cypress.env('baseUrlPreprod');
    return url;
  }

  static checkUrlEnv() {
    Cypress.env('currentEnv') === 'TEST' ?
      cy.url().should('include', Cypress.env('baseUrlTest')) :
      cy.url().should('include', Cypress.env('baseUrlPreprod'))
  }

  static visitUrlOnEnv(){
    Cypress.env('currentEnv') === 'TEST' ?
      cy.visit(Cypress.env('urlMWTest')) :
      cy.visit(Cypress.env('urlMWPreprod'))
  }
}


export default Common