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

  cy.task('nuovoClientePersonaFisica').then((object) => {
    nuovoClientePF = object;
  });

  let currentTestCaseName = 'Matrix.Tests.Matrix_Web_Censimento_PF'
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

after(() => {
  cy.get('.user-icon-container').click()
  cy.contains('Logout').click()
  cy.wait(delayBetweenTests)
  cy.clearCookies();
})

describe('Matrix Web : Censimento Nuovo Cliente PF', function () {

  it('Verifica apertura maschera di censimento', () => {
    cy.contains('Clients').click();
    cy.contains('Nuovo cliente').click();
    cy.get('.nx-formfield__row > .nx-formfield__flexfield > .nx-formfield__input-container > .nx-formfield__input > #nx-input-1').type('AS')
    cy.contains('Cerca').click();
    cy.contains('Aggiungi cliente').click();
  })

  it('Inserimento dati mancanti compreso PEP', () => {

    getSCU().find('#nome').type(nuovoClientePF.nome);
    getSCU().find('#cognome').type(nuovoClientePF.cognome);
    getSCU().find('#comune-nascita').type('LONIGO');
    getSCU().find('li:contains("LONIGO")').click();
    getSCU().find('span[aria-owns="sesso_listbox"]').click();
    getSCU().find('li:contains("Maschile")').click();
    getSCU().find('#data-nascita').type('25011985');
    getSCU().find('#calcola-codice-fiscale').click();
    getSCU().find('span[aria-owns="professione_listbox"]').click();
    getSCU().find('li:contains("Architetto")').click();
    getSCU().find('#unita-di-mercato').type('1022');
    getSCU().find('li:contains("1022")').click();
    getSCU().find('#pep-no').click({force: true});
    getSCU().find('button:contains("Avanti")').click();
  })

  it('Inserimento contatti : residenza (no cellulare e mail)', () => {
    getSCU().find('span[aria-owns="toponomastica_listbox"]').click();
    getSCU().find('li').contains(/^PIAZZA$/).click();
    getSCU().find('#indirizzo-via').type('GIUSEPPE GARIBALDI');
    getSCU().find('#indirizzo-num').type('1');
    getSCU().find('#residenza-comune').type('LONIGO');
    getSCU().find('#residenza-comune_listbox').click();
    getSCU().find('span[aria-owns="tipo-tel_listbox"]').click();
    getSCU().find('button:contains("Avanti")').click();
  })

  it('Inserimento consensi (firma grafo e OTP a no)', () => {
    getSCU().find('label[for="invio-documenti-no"]').click();
    getSCU().find('label[for="firma-grafometrica-no"]').click();
    getSCU().find('label[for="consenso-otp-no"]').click();
    getSCU().find('label[for="promo-allianz-no"]').click();
    getSCU().find('label[for="promo-allianz-terzi-no"]').click();
    getSCU().find('label[for="promo-allianz-profilazione-no"]').click();
    getSCU().find('label[for="promo-allianz-indagini-no"]').click();
    getSCU().find('label[for="quest-adeguatezza-vita-no"]').click();
    getSCU().find('button:contains("Avanti")').click();
  })

  it('Inserimento documento di identita e completamento flusso', () => {
    //#region Documento
    getSCU().find('span[aria-owns="tipo-documento_listbox"]').click();
    getSCU().find('li:contains("CARTA D\'IDENTITA\'")').click();
    getSCU().find('#numero-documento').type('AR66666');
    getSCU().find('#data-emissione').type('01012021');
    getSCU().find('#data-scadenza').type('01012030');
    getSCU().find('#luogo-emissione').type('LONIGO');
    getSCU().find('#luogo-emissione_listbox').click();
    getSCU().find('button:contains("Avanti")').click();
    getSCU().find('button:contains("Conferma")').click();
    //#endregion

    //#region Folder
    getFolder().find('span[class="k-icon k-plus"]:visible').click();
    getFolder().find('span[class="k-icon k-plus"]:first').click();
    getFolder().find('#UploadDocumentFromPortal').click();

    //Upload documento
    getDocumentScanner().find('button:contains("Continua"):visible').click();
    getDocumentoPersonale().find('#pupload').click();

    cy.intercept({
      method: 'POST',
      url: /uploadPdfDocument/
    }).as('uploadPdfDoc');

    cy.intercept({
      method: 'POST',
      url: /previewPdfTemplate/
    }).as('preview');

    cy.intercept({
      method: 'POST',
      url: /uploadMobileDocument/
    }).as('uploadMobileDoc');

    const fileName = 'CI_Test.pdf';
    
    cy.fixture(fileName).then(fileContent => {
      getDocumentoPersonale().find('#pdfUpload').attachFile({ 
        fileContent, 
        fileName, 
        mimeType: 'application/pdf'
      },{ subjectType: 'input' });
    });

    cy.wait('@uploadPdfDoc', { requestTimeout: 30000 });
    cy.wait('@preview', { requestTimeout: 30000 });

    getDocumentoPersonale().find('#importMobileDocument').click();
    cy.wait('@uploadMobileDoc', { requestTimeout: 30000 });

    getSCU().contains('Conferma').click();
    //#endregion
  
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

    getSCU().find('#endWorkflowButton').click();
    //#endregion
  })

  it('Ricercare il cliente appena censito nella buca di ricerca', () => {

    //Skip this two requests that blocks on homepage
    cy.intercept(/embed.nocache.js/,'ignore').as('embededNoCache');
    cy.intercept(/launch-*/,'ignore').as('launchStaging');

    cy.visit('https://portaleagenzie.pp.azi.allianz.it/matrix/')
    cy.contains('Clients').click();
    cy.get('input[name="main-search-input"]').type(nuovoClientePF.cognome + " " + nuovoClientePF.nome).type('{enter}');
    cy.get('lib-client-item').first().click();
  })

  it('Cancellare il cliente', () => {
    cy.get('nx-icon[aria-label="Open menu"]').click();
    cy.contains('Cancellazione cliente').click();
    cy.contains('Cancella cliente').click();
    cy.contains('Ok').click();
  })
})