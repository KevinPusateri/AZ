/// <reference types="Cypress" />

class Common {

  /**
   * 
   * dal popup clicca sulla prima agenzia per accedere alla pagina
   * @param {boolean} chooseUtenza : default a false, effettua l'accesso alla seconda finestra dalla homepage
   */
  static canaleFromPopup(chooseUtenza = false) {

    if (Cypress.env('monoUtenza')) {
      cy.get('body').then($body => {
        if ($body.find('nx-modal-container').length > 0) {
          cy.wait(2000)
          cy.get('div[ngclass="agency-row"]').should('be.visible')
          cy.get('div[ngclass="agency-row"]').first().click()
        }
      })
    }

    // Scegli utenza se siamo su finestra principale e procediamo dall'icona sulla seconda finestra
    if (Cypress.env('isSecondWindow') && !Cypress.env('monoUtenza') && chooseUtenza) {
      cy.get('body').then($body => {
        if ($body.find('nx-modal-container').length > 0) {
          cy.wait(2000)
          cy.get('div[ngclass="agency-row"]').should('be.visible')

          cy.get('div[ngclass="agency-row"]').contains(Cypress.env('Utenza')).click()
          cy.window().then(win => {
            cy.stub(win, 'open').as('windowOpen');
          });
          cy.get('@windowOpen').should('be.calledWith', Cypress.sinon.match.string).then(stub => {
            cy.visit(stub.args[0][0]);
            stub.restore;
          });
        }
      })
    }

    // Scegli utenza se siamo su finestra principale multiutenza
    if (!Cypress.env('isSecondWindow') && !Cypress.env('monoUtenza')) {
      cy.get('body').then($body => {
        if ($body.find('nx-modal-container').length > 0) {
          cy.wait(2000)
          cy.get('div[ngclass="agency-row"]').should('be.visible')

          cy.get('div[ngclass="agency-row"]').contains(Cypress.env('Utenza')).click()
        }
      })
    }

  }

  /**
   * Resituisce l'url in base all'ambiente(env) 
   * @returns {string} indirizzo url
   */
  static getBaseUrl() {
    let url
    if (Cypress.env('currentEnv') === 'TEST')
      url = Cypress.env('baseUrlTest')
    else
      if (!Cypress.env('monoUtenza'))
        url = Cypress.env('baseUrlPreprod')
      else
        url = Cypress.env('urlSecondWindow')

    return url;
  }

  /**
   * Se Preprod fa should su baseUrlPreprod altrimenti su baseUrlTest
   */
  static checkUrlEnv() {
    if (Cypress.env('currentEnv') === 'TEST')
      cy.url().should('include', Cypress.env('baseUrlTest'))
    else {
      if (!Cypress.env('monoUtenza'))
        cy.url().should('include', Cypress.env('baseUrlPreprod'))
      else
        cy.url().should('include', Cypress.env('urlSecondWindow'))
    }
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

    if (mockedNews) {

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

    if (Cypress.env('currentEnv') === 'TEST')
      cy.visit(Cypress.env('urlMWTest'), { responseTimeout: 31000 })
    else {
      if (!Cypress.env('monoUtenza'))
        cy.visit(Cypress.env('urlMWPreprod'), { responseTimeout: 31000 })
      else
        cy.visit(Cypress.env('urlSecondWindow'), { responseTimeout: 31000 })
    }
    if (!mockedNews)
      cy.wait('@gqlNews')
  }

}



export default Common