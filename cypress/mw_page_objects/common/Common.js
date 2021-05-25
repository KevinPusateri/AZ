/// <reference types="Cypress" />


class Common {

  /**
   * dal popup clicca sulla prima agenzia per accedere alla pagina
   */
  static canaleFromPopup() {
    cy.get('body').then($body => {
      if ($body.find('nx-modal-container').length > 0) {
        cy.wait(2000)
        cy.get('nx-modal-container').find('.agency-row').first().click()
      }
    })
  }

  /**
   * Resituisce l'url in base all'ambiente(env) 
   * @returns {string} indirizzo url
   */
  static getBaseUrl() {
    const url = Cypress.env('currentEnv') === 'TEST' ? Cypress.env('baseUrlTest') : Cypress.env('baseUrlPreprod');
    return url;
  }

  /**
   * Se Preprod fa should su baseUrlPreprod altrimenti su baseUrlTest
   */
  static checkUrlEnv() {
    Cypress.env('currentEnv') === 'TEST' ?
      cy.url().should('include', Cypress.env('baseUrlTest')) :
      cy.url().should('include', Cypress.env('baseUrlPreprod'))
  }

  /**
   * Se Preprod fa il visit su urlMWPreprod altrimenti su urlMWTest
   */
  static visitUrlOnEnv(){
    Cypress.env('currentEnv') === 'TEST' ?
      cy.visit(Cypress.env('urlMWTest')) :
      cy.visit(Cypress.env('urlMWPreprod'))
  }
}


export default Common