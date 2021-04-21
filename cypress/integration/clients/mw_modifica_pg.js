/**
* @author Andrea 'Bobo' Oboe <andrea.oboe@allianz.it>
*/

/// <reference types="Cypress" />

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)
const delayBetweenTests = 2000
//#endregion

//#region Global Variables
const getSCU = () => {
  cy.get('iframe[class="iframe-content ng-star-inserted"]')
  .iframe();

  let iframeSCU = cy.get('iframe[class="iframe-content ng-star-inserted"]')
  .its('0.contentDocument').should('exist');

  return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}

const getFolder = () => {
  getSCU().find('iframe[class="w-100"]')
  .iframe();

  let iframeFolder = getSCU().find('iframe[class="w-100"]')
  .its('0.contentDocument').should('exist');

  return iframeFolder.its('body').should('not.be.undefined').then(cy.wrap)
}

const getDocumentScanner = () => {
  getFolder().find('iframe[src*="IdDocumentScanner"]')
  .iframe();

  let iframeDocumentScanner = getFolder().find('iframe[src*="IdDocumentScanner"]')
  .its('0.contentDocument').should('exist');

  return iframeDocumentScanner.its('body').should('not.be.undefined').then(cy.wrap)
}

const getDocumentoPersonale = () => {
  getDocumentScanner().find('#documentoPersonaleFrame')
  .iframe();

  let iframeDocumentoPersonale = getDocumentScanner().find('#documentoPersonaleFrame')
  .its('0.contentDocument').should('exist');

  return iframeDocumentoPersonale.its('body').should('not.be.undefined').then(cy.wrap)
}
//#endregion

let nuovoClientePF;

before(() => {
  cy.clearCookies();

  let currentTestCaseName = 'Matrix.Tests.Matrix_Web_Modifica_PG'
  let currentEnv = 'PREPROD'
  let currentUser = 'TUTF021'

  //cy.task('mysqlStart', {"testCaseName": currentTestCaseName, "currentEnv": currentEnv, "currentUser": currentUser});

  //Skip this two requests that blocks on homepage
  cy.intercept(/embed.nocache.js/,'ignore').as('embededNoCache');
  cy.intercept(/launch-*/,'ignore').as('launchStaging');
  cy.intercept('POST', '/graphql', (req) => {
    if (req.body.operationName.includes('notifications')) {
      req.alias = 'gqlNotifications'
    }
  });

  cy.visit('https://matrix.pp.azi.allianz.it/')
  cy.get('input[name="Ecom_User_ID"]').type(currentUser)
  cy.get('input[name="Ecom_Password"]').type('P@ssw0rd!')
  cy.get('input[type="SUBMIT"]').click()
  cy.url().should('include','/portaleagenzie.pp.azi.allianz.it/matrix/')

  cy.wait('@gqlNotifications')
})

beforeEach(() => {
  cy.viewport(1920, 1080)
  Cypress.Cookies.defaults({
    preserve: (cookie) => {
      return true;
    }
  })
})

// after(() => {
//   cy.get('.user-icon-container').click()
//   cy.contains('Logout').click()
//   cy.wait(delayBetweenTests)
//   cy.clearCookies();
// })

describe('Matrix Web : Modifica PG', function () {

  it('Ricercare un cliente PG e verificare il caricamento corretto della scheda del cliente', () => {
    cy.get('input[name="main-search-input"]').click()
    cy.get('input[name="main-search-input"]').type('RO')
    //cy.url().should('include', '/search/clients/clients')
  })
 
})