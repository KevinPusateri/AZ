/// <reference types="cypress" />

Cypress.config('defaultCommandTimeout', 10000);

const getSCU = () => {
  cy.get('iframe[class="iframe-content ng-star-inserted"]')
  .iframe();

  let  iframeSCU = cy.get('iframe[class="iframe-content ng-star-inserted"]')
  .its('0.contentDocument').should('exist');

  return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}

const getFolder = () => {
  cy.wait(2000);
  let bodySCU = cy.get('iframe[class="iframe-content ng-star-inserted"]')
  .its('0.contentDocument').should('exist').its('body').should('not.be.undefined').then(cy.wrap);

  let iframeFolder = bodySCU.find('iframe[class="w-100"]')
  .its('0.contentDocument').should('exist');

  return iframeFolder.its('body').should('not.be.undefined').then(cy.wrap)
}

const getDocumentScanner = () => {

  cy.wait(2000);

  let bodySCU = cy.get('iframe[class="iframe-content ng-star-inserted"]')
  .its('0.contentDocument').should('exist').its('body').should('not.be.undefined').then(cy.wrap);

  let bodyFolder = bodySCU.find('iframe[class="w-100"]')
  .its('0.contentDocument').should('exist').its('body').should('not.be.undefined').then(cy.wrap);

  let iframeDocumentScanner = bodyFolder.find('iframe[src*="IdDocumentScanner"]')
  .its('0.contentDocument').should('exist');

  return iframeDocumentScanner.its('body').should('not.be.undefined').then(cy.wrap);
}

const getDocumentoPersonale = () => {

  cy.wait(4000);

  let bodySCU = cy.get('iframe[class="iframe-content ng-star-inserted"]')
  .its('0.contentDocument').should('exist').its('body').should('not.be.undefined').then(cy.wrap);

  let bodyFolder = bodySCU.find('iframe[class="w-100"]')
  .its('0.contentDocument').should('exist').its('body').should('not.be.undefined').then(cy.wrap);

  let iframeDocumentScanner = bodyFolder.find('iframe[src*="IdDocumentScanner"]')
  .its('0.contentDocument').should('exist').its('body').should('not.be.undefined').then(cy.wrap);

  let iframeDocumentoPersonale = iframeDocumentScanner.find('#documentoPersonaleFrame')
  .its('0.contentDocument').should('exist')

  return iframeDocumentoPersonale.its('body').should('not.be.undefined').then(cy.wrap)
}

let nuovoCliente;

before(function () {
  cy.task('nuovoClientePersonaFisica').then((object) => {
    nuovoCliente = object;
  });

  cy.viewport(1920,1080);
  
  cy.visit('https://matrix.pp.azi.allianz.it/');

  cy.get('input[name="Ecom_User_ID"]').type('TUTF003');
  cy.get('input[name="Ecom_Password"]').type('P@ssw0rd!');
  cy.get('input[value="Conferma"]').click();

  cy.window().then((win) =>  {
    win.onbeforeunload = null;
  })
});

it('Censimento Persona Fisica', () => {

  cy.url().should('eq','https://portaleagenzie.pp.azi.allianz.it/matrix/');
  cy.contains('Clients').click();
  cy.contains('Nuovo cliente').click();
  cy.get('.nx-formfield__row > .nx-formfield__flexfield > .nx-formfield__input-container > .nx-formfield__input > #nx-input-1').type('AS')
  cy.contains('Cerca').click();
  cy.contains('Aggiungi cliente').click();
  getSCU().find('#nome').type(nuovoCliente.nome);
  getSCU().find('#cognome').type(nuovoCliente.cognome);
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
  getSCU().find('button:contains("Avanti")').click();

  //Residenza Anagrafica
  getSCU().find('span[aria-owns="toponomastica_listbox"]').click();
  getSCU().find('li:contains("CORTE")').click();
  getSCU().find('#indirizzo-via').type('GARIBALDI');
  getSCU().find('#indirizzo-num').type('1');
  getSCU().find('#residenza-comune').type('LONIGO');
  getSCU().find('#residenza-comune_listbox').click();
  getSCU().find('span[aria-owns="tipo-tel_listbox"]').click();
  getSCU().find('button:contains("Avanti")').click();

  //Consensi
  getSCU().find('label[for="invio-documenti-no"]').click();
  getSCU().find('label[for="firma-grafometrica-no"]').click();
  getSCU().find('label[for="consenso-otp-no"]').click();
  getSCU().find('label[for="promo-allianz-no"]').click();
  getSCU().find('label[for="promo-allianz-terzi-no"]').click();
  getSCU().find('label[for="promo-allianz-profilazione-no"]').click();
  getSCU().find('label[for="promo-allianz-indagini-no"]').click();
  getSCU().find('label[for="quest-adeguatezza-vita-no"]').click();
  getSCU().find('button:contains("Avanti")').click();

  //Documento
  getSCU().find('span[aria-owns="tipo-documento_listbox"]').click();
  getSCU().find('li:contains("CARTA D\'IDENTITA\'")').click();
  getSCU().find('#numero-documento').type('AR66666');
  getSCU().find('#data-emissione').type('01012021');
  getSCU().find('#data-scadenza').type('01012030');
  getSCU().find('#luogo-emissione').type('LONIGO');
  getSCU().find('#luogo-emissione_listbox').click();
  getSCU().find('button:contains("Avanti")').click();
  getSCU().find('button:contains("Conferma")').click();

  //Folder
  getFolder().find('span[class="k-icon k-plus"]:visible').click();
  getFolder().find('span[class="k-icon k-plus"]:first').click();
  getFolder().find('#UploadDocumentFromPortal').click();

  //Upload documento
  getDocumentScanner().find('button:contains("Continua"):visible').click();
  getDocumentoPersonale().find('#pupload').click();


  const fileName = 'CI_Test.pdf';
  getDocumentoPersonale().find('#pdfUpload').attachFile(fileName);
  
  cy.wait(2000);
  getDocumentoPersonale().find('#importMobileDocument').click();
  cy.wait(5000);
  getSCU().contains('Conferma').click();
  cy.wait(12000);
  getSCU().find('#endWorkflowButton').click();
  
  cy.get('lib-header-logo').click();
  //cy.visit('https://portaleagenzie.pp.azi.allianz.it/matrix/clients');
  cy.get('div[class="surname"]:contains("'+nuovoCliente.cognome+'")').should('exist').click();
});