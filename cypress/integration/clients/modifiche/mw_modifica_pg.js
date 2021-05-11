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

before(() => {
  cy.clearCookies();
  cy.clearLocalStorage();

  let currentTestCaseName = 'Matrix.Tests.Matrix_Web_Modifica_PG'
  let currentEnv = 'PREPROD'
  let currentUser = 'TUTF021'

  //cy.task('mysqlStart', {"testCaseName": currentTestCaseName, "currentEnv": currentEnv, "currentUser": currentUser});

  //Skip this two requests that blocks on homepage
  cy.intercept(/embed.nocache.js/,'ignore').as('embededNoCache');
  cy.intercept(/launch-*/,'ignore').as('launchStaging');

  cy.visit('https://matrix.pp.azi.allianz.it/')
  cy.get('input[name="Ecom_User_ID"]').type(currentUser)
  cy.get('input[name="Ecom_Password"]').type('P@ssw0rd!')
  cy.get('input[type="SUBMIT"]').click()
  cy.url().should('include','/portaleagenzie.pp.azi.allianz.it/matrix/')
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
//   cy.get('body').then($body => {
//       if ($body.find('.user-icon-container').length > 0) {   
//           cy.get('.user-icon-container').click();
//           cy.wait(1000).contains('Logout').click()
//           cy.wait(delayBetweenTests)
//       }
//   });
//   cy.clearCookies();
// })

describe('Matrix Web : Modifica PG', function () {

  it('Ricercare un cliente PG e verificare il caricamento corretto della scheda del cliente', () => {
    cy.get('input[name="main-search-input"]').click()
    cy.generateTwoLetters().then(randomChars => {
      cy.get('input[name="main-search-input"]').type(randomChars).type('{enter}')
    })
    cy.url().should('include', '/search/clients/clients').wait(5000)

    //Rimuoviamo le persone finische dai filtri di ricerca
    cy.get('.icon').find('[name="filter"]').click()
    cy.get('.filter-group').contains('Persona fisica').click()
    cy.get('.footer').find('button').contains('applica').click()
    cy.get('lib-applied-filters-item').find('span').should('be.visible')
    cy.get('lib-client-item').first().click().wait(3000)
    cy.contains('DETTAGLIO ANAGRAFICA').click()
  })

  it('Modificare alcuni dati inserendo la PEC il consenso all\'invio', () => {

    cy.contains('Modifica dati cliente').click()
    let currentPartitaIva
    getSCU().find('#partita-iva').then(($partitaIva) => {
      currentPartitaIva = $partitaIva.text()
      cy.log('Partita IVA recuperata : ' + currentPartitaIva)
    })
    getSCU().find('#codice-fiscale-impresa').clear().type(currentPartitaIva);
    getSCU().find('a:contains("Consensi")').click()
    
  })
})