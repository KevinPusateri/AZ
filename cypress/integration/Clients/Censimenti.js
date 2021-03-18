/// <reference types="cypress" />

const getIframeDocumentSCU = () => {
  return cy
  .get('iframe[class="iframe-content ng-star-inserted"]')
  .its('0.contentDocument').should('exist')
}
  
const getIframeBodySCU = () => {
  return getIframeDocumentSCU()
  .its('body').should('not.be.undefined')
  .then(cy.wrap)
}

const getIframeBodyFolder = () => {
  return getIframeBodySCU().find('iframe[class="w-100"]')
  .its('0.contentDocument').should('exist')
  .its('body').should('not.be.undefined')
  .then(cy.wrap)
}

const getIframeBodyIdDocumentScanner = () => {
  return getIframeBodyFolder().find('iframe[src*="IdDocumentScanner"]')
  .its('0.contentDocument').should('exist')
  .its('body').should('not.be.undefined')
  .then(cy.wrap)
}

const getIframeBodyDocumentoPersonale = () => {
  return getIframeBodyIdDocumentScanner().find('#documentoPersonaleFrame')
  .its('0.contentDocument').should('exist')
  .its('body').should('not.be.undefined')
  .then(cy.wrap)
}

let nuovoCliente;

before(function () {
  cy.task('nuovoClientePersonaFisica').then((object) => {
    nuovoCliente = object;
  });
});

it('Censimento Persona Fisica', () => {
  Cypress.config('defaultCommandTimeout', 10000);
  
  cy.viewport(1920,1080);
  cy.visit('https://matrix.pp.azi.allianz.it/');
  cy.get('input[name="Ecom_User_ID"]').type('le00038');
  cy.get('input[name="Ecom_Password"]').type('Febbraio2021$');
  cy.get('input[value="Conferma"]').click();
  //cy.visit('https://matrix.pp.azi.allianz.it/');
  cy.contains('Clients').click();
  cy.contains('Nuovo cliente').click();
  cy.get('.nx-formfield__row > .nx-formfield__flexfield > .nx-formfield__input-container > .nx-formfield__input > #nx-input-1').type('AS')
  cy.contains('Cerca').click();
  cy.contains('Aggiungi cliente').click();
  cy.wait(5000);
  cy.get('iframe[class="iframe-content ng-star-inserted"]');
  getIframeBodySCU().find('#nome').type(nuovoCliente.nome);
  getIframeBodySCU().find('#cognome').type(nuovoCliente.cognome);
  getIframeBodySCU().find('#comune-nascita').type('LONIGO');
  getIframeBodySCU().find('li:contains("LONIGO")').click();
  getIframeBodySCU().find('span[aria-owns="sesso_listbox"]').click();
  getIframeBodySCU().find('li:contains("Maschile")').click();
  getIframeBodySCU().find('#data-nascita').type('25011985');
  getIframeBodySCU().find('#calcola-codice-fiscale').click();
  getIframeBodySCU().find('span[aria-owns="professione_listbox"]').click();
  getIframeBodySCU().find('li:contains("Architetto")').click();
  getIframeBodySCU().find('#unita-di-mercato').type('1022');
  getIframeBodySCU().find('li:contains("1022")').click();
  getIframeBodySCU().find('button:contains("Avanti")').click();

  //Residenza Anagrafica
  getIframeBodySCU().find('span[aria-owns="toponomastica_listbox"]').click();
  getIframeBodySCU().find('li:contains("CORTE")').click();
  getIframeBodySCU().find('#indirizzo-via').type('GARIBALDI');
  getIframeBodySCU().find('#indirizzo-num').type('1');
  getIframeBodySCU().find('#residenza-comune').type('LONIGO');
  getIframeBodySCU().find('#residenza-comune_listbox').click();
  getIframeBodySCU().find('span[aria-owns="tipo-tel_listbox"]').click();
  getIframeBodySCU().find('button:contains("Avanti")').click();

  //Consensi
  getIframeBodySCU().find('label[for="invio-documenti-no"]').click();
  getIframeBodySCU().find('label[for="firma-grafometrica-no"]').click();
  getIframeBodySCU().find('label[for="consenso-otp-no"]').click();
  getIframeBodySCU().find('label[for="promo-allianz-no"]').click();
  getIframeBodySCU().find('label[for="promo-allianz-terzi-no"]').click();
  getIframeBodySCU().find('label[for="promo-allianz-profilazione-no"]').click();
  getIframeBodySCU().find('label[for="promo-allianz-indagini-no"]').click();
  getIframeBodySCU().find('label[for="quest-adeguatezza-vita-no"]').click();
  getIframeBodySCU().find('button:contains("Avanti")').click();

  //Documento
  getIframeBodySCU().find('span[aria-owns="tipo-documento_listbox"]').click();
  getIframeBodySCU().find('li:contains("CARTA D\'IDENTITA\'")').click();
  getIframeBodySCU().find('#numero-documento').type('AR66666');
  getIframeBodySCU().find('#data-emissione').type('01012021');
  getIframeBodySCU().find('#data-scadenza').type('01012030');
  getIframeBodySCU().find('#luogo-emissione').type('LONIGO');
  getIframeBodySCU().find('#luogo-emissione_listbox').click();
  getIframeBodySCU().find('button:contains("Avanti")').click();
  cy.wait(6000);
  getIframeBodySCU().find('button:contains("Conferma")').click();
  cy.wait(6000);

  //Folder
  getIframeBodyFolder().find('span[class="k-icon k-plus"]:visible').click();
  getIframeBodyFolder().find('span[class="k-icon k-plus"]:first').click();
  getIframeBodyFolder().find('#UploadDocumentFromPortal').click();
  cy.wait(4000);

  //Upload documento
  getIframeBodyIdDocumentScanner().contains('Continua').click();
  cy.wait(4000);
  getIframeBodyDocumentoPersonale().find('#pupload').click();

  const fileName = '../../support/doc_testing/CI_Test.pdf';
  cy.fixture(fileName, 'binary')
  .then(Cypress.Blob.binaryStringToBlob)
  .then(fileContent => {
    getIframeBodyDocumentoPersonale().find('#pdfUpload').attachFile({
      fileContent,
      fileName,
      mimeType: 'application/pdf',
      encoding: 'utf-8',
    });
  });
  getIframeBodyDocumentoPersonale().find('#importMobileDocument').click();
  cy.wait(5000);
  getIframeBodySCU().contains('Conferma').click();
  cy.wait(12000);
  getIframeBodySCU().find('#endWorkflowButton').click();
  cy.url();
});