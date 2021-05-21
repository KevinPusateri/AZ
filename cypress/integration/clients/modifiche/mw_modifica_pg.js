/**
* @author Andrea 'Bobo' Oboe <andrea.oboe@allianz.it>
*/

/// <reference types="Cypress" />

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)
const delayBetweenTests = 2000
//#endregion

//#region Global Variables
const getIframe = () => {
  cy.get('iframe[class="iframe-content ng-star-inserted"]')
  .iframe();

  let iframeSCU = cy.get('iframe[class="iframe-content ng-star-inserted"]')
  .its('0.contentDocument').should('exist');

  return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}

const getDocumentScanner = () => {
  getIframe().find('iframe[src*="IdDocumentScanner"]')
  .iframe();

  let iframeDocumentScanner = getIframe().find('iframe[src*="IdDocumentScanner"]')
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

let nuovoClientePG
let currentSelectedPG

before(() => {

  cy.task('nuovoClientePersonaGiuridica').then((object) => {
    nuovoClientePG = object;
  })

  cy.clearCookies();
  cy.clearLocalStorage();

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

  cy.visit('https://matrix.pp.azi.allianz.it/',{
    onBeforeLoad: win =>{
        win.sessionStorage.clear();
    }
  })

  cy.visit('https://matrix.pp.azi.allianz.it/')
  cy.get('input[name="Ecom_User_ID"]').type(currentUser)
  cy.get('input[name="Ecom_Password"]').type('P@ssw0rd!')
  cy.get('input[type="SUBMIT"]').click()
  cy.url().should('include','/portaleagenzie.pp.azi.allianz.it/matrix/')

  cy.wait('@gqlNotifications',{'responseTimeout': 60000})
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

    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName.includes('searchClient')) {
        req.alias = 'gqlSearchClient'
      }
    });

    cy.get('input[name="main-search-input"]').click()
    cy.generateTwoLetters().then(randomChars => {
      cy.get('input[name="main-search-input"]').type(randomChars).type('{enter}')
    })
    cy.wait('@gqlSearchClient', { requestTimeout: 30000 });
    cy.url().should('include', '/search/clients/clients')

    //Rimuoviamo le persone finische dai filtri di ricerca
    cy.get('.icon').find('[name="filter"]').click()
    cy.get('.filter-group').contains('Persona fisica').click()
    //Rimuoviamo le effettive e cessate
    cy.get('.filter-group').contains('Potenziale').click()
    cy.get('.footer').find('button').contains('applica').click()
    cy.wait('@gqlSearchClient', { requestTimeout: 30000 });

    cy.get('lib-applied-filters-item').find('span').should('be.visible')
    cy.get('lib-client-item').first().click().wait(3000)
    cy.get('#app-clients > app-root > lib-page-layout > div > div > div > app-client-profile > lib-sub-header-layout > div > div > lib-container > div > div > app-sidebar-left > nx-sidebar > div > div > lib-scrollable-container > div > div > div.scrollable-sidebar-content > div > app-client-resume-card > nx-card > div.padder > div.center > div > div.client-name.ng-star-inserted').then(($pgName) => {
      currentSelectedPG = $pgName.text()
      cy.log("Cliente PG selezionato : " + currentSelectedPG)
    })
    cy.contains('DETTAGLIO ANAGRAFICA').click()
  })

  it('Modificare alcuni dati inserendo la PEC il consenso all\'invio', () => {

    cy.contains('Modifica dati cliente').click()
    //Modifichiamo vari dati
    getIframe().find('#partita-iva').clear().type(nuovoClientePG.partitaIva)
    getIframe().find('#codice-fiscale-impresa').clear().type(nuovoClientePG.partitaIva)
    getIframe().find('span[aria-owns="settore-attivita_listbox"]').click();
    getIframe().find('li:contains("COSTRUZIONI")').click();
    getIframe().find('#unita-di-mercato').clear().type('1022');
    getIframe().find('li:contains("1022")').click();
    getIframe().find('span[aria-owns="forma-giuridica_listbox"]').click();
    getIframe().find('li').contains(/^S.R.L.$/).click();
    getIframe().find('span[aria-owns="tipologia_listbox"]').click();
    getIframe().find('li:contains("DITTA")').click();
    getIframe().find('span[aria-owns="nazione-partita-iva_listbox"]').click();
    getIframe().find('li:contains("IT-Italia")').click();
    //Inseriamo la pec e mail (sovrascriviamo con una nuova) 
    getIframe().find('a:contains("Contatti")').click().wait(1000)
    getIframe().find('#pec').clear().type("test_automatici@pec.it")
    getIframe().find('#email').clear().type("test_automatici@mail.it")
    //Modifichiamo i consensi
    getIframe().find('a:contains("Consensi")').click()
    getIframe().find('label[for="invio-documenti-pec-si"]').click()
    getIframe().find('label[for="firma-grafometrica-no"]').click()
    getIframe().find('label[for="promo-allianz-no"]').click()
    getIframe().find('label[for="promo-allianz-terzi-no"]').click()
    getIframe().find('label[for="promo-allianz-profilazione-no"]').click()
    getIframe().find('label[for="promo-allianz-indagini-no"]').click()

    cy.intercept({
      method: 'POST',
      url: /NormalizeImpresa/
    }).as('normalizeImpresa')

    cy.intercept({
      method: 'POST',
      url: /ValidateForEdit/
    }).as('validateForEdit')

    cy.intercept({
      method: 'GET',
      url: '**/AnagrafeWA40/**'
    }).as('anagrafeWA40')

    cy.intercept({
      method: 'GET',
      url: '**/SCU/**'
    }).as('scu')

    getIframe().find('#submit').click().wait(1000)

    //#region Verifica presenza normalizzatore
    getIframe().find('#Allianz-msg-container').then((container) => {
      if (container.find('li:contains(normalizzati)').length > 0) {
        getIframe().find('#submit').click()
    }
    });
    //#endregion

    cy.wait('@normalizeImpresa', { requestTimeout: 30000 });
    cy.wait('@validateForEdit', { requestTimeout: 30000 });
    cy.wait('@anagrafeWA40', { requestTimeout: 30000 });
    cy.wait('@scu', { requestTimeout: 30000 }).wait(1000);

    getIframe().find('button:contains("Conferma")').click();

    cy.intercept({
      method: 'POST',
      url: /getCustomerTree/
    }).as('getCustomerTree')

    cy.wait('@getCustomerTree', { requestTimeout: 30000 });
    
  })
  
  it('Da Folder inserire la visura camerale e procedere', () => {
    getIframe().find('span[class="k-icon k-plus"]:visible').click();
    getIframe().find('span[class="k-icon k-plus"]:first').click();
    getIframe().find('#UploadDocument').click();
    getIframe().find('#win-upload-document_wnd_title').click();
    getIframe().find('span[aria-owns="wizard-folder-type-select_listbox"]').click().type('{downarrow}');
    getIframe().find('span[aria-owns="wizard-document-type-select_listbox"]').click().type('Visura').type('{enter}');
    cy.intercept({
      method: 'POST',
      url: /uploadCustomerDocument/
    }).as('uploadCustomerDoc');

    const fileName = 'Autocertificazione_Test.pdf';
    cy.fixture(fileName).then(fileContent => {
      getIframe().find('#file').attachFile({
        fileContent, 
        fileName, 
        mimeType: 'application/pdf'
      },{ subjectType: 'input' });
    });

    getIframe().contains('Upload dei file selezionati').click()
    cy.wait('@uploadCustomerDoc', { requestTimeout: 30000 })
      
    getIframe().find('#idUrlBack').click().wait(2000)

    //#region Generazione documentazione
    cy.intercept({
      method: 'POST',
      url: /WriteConsensi/
    }).as('writeConsensi');

    cy.intercept({
      method: 'POST',
      url: /GenerazioneStampe/
    }).as('generazioneStampe');

    cy.intercept({
      method: 'POST',
      url: /SalvaInContentManager/
    }).as('salvaInContentManager');

    cy.wait('@writeConsensi', { requestTimeout: 60000 });
    cy.wait('@generazioneStampe', { requestTimeout: 60000 });
    cy.wait('@salvaInContentManager', { requestTimeout: 60000 });

    getIframe().find('#endWorkflowButton').click();
    //#endregion
  })

  it.skip("Verificare che i consensi/contatti si siano aggiornati correttamente e Verificare il folder (unici + documento)",()=> {
    //Skip this two requests that blocks on homepage
    cy.intercept(/embed.nocache.js/,'ignore').as('embededNoCache');
    cy.intercept(/launch-*/,'ignore').as('launchStaging');
    cy.visit('https://portaleagenzie.pp.azi.allianz.it/matrix/')

    cy.contains('Clients').click();
    cy.get('input[name="main-search-input"]').type(currentSelectedPG).type('{enter}');
    cy.get('lib-client-item').first().click();

    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName.includes('client')) {
        req.alias = 'gqlClient'
      }
    });

    cy.contains('DETTAGLIO ANAGRAFICA').click()

    cy.wait('@gqlClient', { requestTimeout: 30000 });

    cy.contains('Invio documento via PEC')
    .parent('div')
    .get('nx-icon').should('have.class','nx-icon--s nx-icon--check-circle color-true')

    //Verifica in Folder
    cy.get('nx-icon[aria-label="Open menu"]').click();
    cy.contains('folder').click();
    cy.get('nx-modal-container').find('.agency-row').first().click().wait(3000)

    getIframe().find('span[class="k-icon k-plus"]:visible').click();
    getIframe().find('span[class="k-icon k-plus"]:first').click();

    cy.generateUnicoClienteLabel().then(label => {
      getIframe().find('span').contains(label).click()
    })

    cy.generateUnicoDirezioneLabel().then(label => {
      getIframe().find('span').contains(label).click()
    })

    cy.generateVisuraCameraleLabel().then(label => {
      getIframe().find('span').contains(label).click()
    })
    
  })
})