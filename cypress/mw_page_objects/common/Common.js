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
   * Setta il il baseUrl
   */
  static setBaseUrl() {
    Cypress.env('currentEnv') === 'TEST' ? Cypress.config('baseUrl', Cypress.env('baseUrlTest')) : Cypress.config('baseUrl', Cypress.env('baseUrlPreprod'))

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
  static visitUrlOnEnv(mockedNotifications = true, mockedNews = true) {
    cy.intercept(/embed.nocache.js/, 'ignore').as('embededNoCache')
    cy.intercept(/launch-*/, 'ignore').as('launchStaging')

    if (mockedNotifications) {

      cy.intercept('POST', '**/graphql', (req) => {
        if (req.body.operationName.includes('notifications')) {
          req.reply({ fixture: 'mockNotifications.json' })
        }
      })
      cy.intercept('POST', '**/graphql', (req) => {
        if (req.body.operationName.includes('getNotificationCategories')) {
          req.reply({ fixture: 'mockGetNotificationCategories.json' })
        }
      })

    }

    if (mockedNotifications) {

      cy.intercept('POST', '**/graphql', (req) => {
        if (req.body.operationName.includes('news')) {
          req.reply({ fixture: 'mockNews.json' })
        }
      })
    }
    else {
      //Wait for news graphQL to be returned
      cy.intercept('POST', '**/graphql', (req) => {
        if (req.body.operationName.includes('news')) {
          req.alias = 'gqlNews'
          req.res
        }
      })
    }

    Cypress.env('currentEnv') === 'TEST' ?
      cy.visit(Cypress.env('urlMWTest'), { responseTimeout: 31000 }) :
      cy.visit(Cypress.env('urlMWPreprod'), { responseTimeout: 31000 })
    if (!mockedNews)
      cy.wait('@gqlNews')
  }
}



export default Common