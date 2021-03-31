/// <reference types="cypress" />

Cypress.config('defaultCommandTimeout', 30000);

const getSCU = () => {
  cy.get('iframe[class="iframe-content ng-star-inserted"]')
  .iframe();

  let  iframeSCU = cy.get('iframe[class="iframe-content ng-star-inserted"]')
  .its('0.contentDocument').should('exist');

  return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}

const getFolder = () => {
  //cy.wait(6000);
  //let bodySCU = cy.get('iframe[class="iframe-content ng-star-inserted"]')
  //.its('0.contentDocument').should('exist').its('body').should('not.be.undefined').then(cy.wrap);

  getSCU().find('iframe[class="w-100"]')
  .iframe();

  let  iframeFolder = getSCU().find('iframe[class="w-100"]')
  .its('0.contentDocument').should('exist');

  return iframeFolder.its('body').should('not.be.undefined').then(cy.wrap)


  //let iframeFolder = bodySCU.find('iframe[class="w-100"]')
  //.its('0.contentDocument').should('exist');

 //return iframeFolder.its('body').should('not.be.undefined').then(cy.wrap)
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

let nuovoClientePF;
let nuovoClientePG;

before(function () {
  cy.task('nuovoClientePersonaFisica').then((object) => {
    nuovoClientePF = object;
  });

    cy.task('nuovoClientePersonaGiuridica').then((object) => {
    nuovoClientePG = object;
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

it('Censimento Nuovo cliente PF', () => {

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
  getSCU().find('#pep-no').click({force: true});
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
  cy.contains('Clients').click();
  cy.get('input[name="main-search-input"]').type(nuovoCliente.cognome + " " + nuovoCliente.nome).type('{enter}');
  cy.get('lib-client-item').first().click();
  cy.get('nx-icon[aria-label="Open menu"]').click();
  cy.contains('Cancellazione cliente').click();
  cy.contains('Cancella cliente').click();
  cy.contains('Ok').click();
  cy.get('.user-icon-container').click();
  cy.contains('Logout').click();
});

it.only('Censimento Nuovo cliente PG', () => {

  cy.url().should('eq','https://portaleagenzie.pp.azi.allianz.it/matrix/');
  cy.contains('Clients').click();
  cy.contains('Nuovo cliente').click();
  cy.contains('Persona giuridica').click();
  cy.get('#nx-tab-content-0-1 > div > app-new-client-fiscal-code-box > div > div:nth-child(4) > div > nx-formfield').click().type(nuovoClientePG.partitaIva);
  cy.get('span:contains("Cerca"):last').click();
  cy.contains('Aggiungi cliente').click();

  getSCU().find('#ragione-sociale').type(nuovoClientePG.ragioneSociale);
  getSCU().find('span[aria-owns="forma-giuridica_listbox"]').click();
  getSCU().find('li').contains(/^S.R.L.$/).click();
  getSCU().find('span[aria-owns="tipologia_listbox"]').click();
  getSCU().find('li:contains("DITTA")').click();
  getSCU().find('span[aria-owns="settore-attivita_listbox"]').click();
  getSCU().find('li:contains("COSTRUZIONI")').click();
  getSCU().find('#partita-iva').type(nuovoClientePG.partitaIva);
  getSCU().find('#codice-fiscale-impresa').type(nuovoClientePG.partitaIva);
  getSCU().find('#unita-di-mercato').type('1022');
  getSCU().find('li:contains("1022")').click();
  getSCU().find('button:contains("Avanti")').click();

  //Sede Legale
  getSCU().find('span[aria-owns="toponomastica_listbox"]').click();
  getSCU().find('li:contains("CORTE")').click();
  getSCU().find('#indirizzo-via').type('GARIBALDI');
  getSCU().find('#indirizzo-num').type('1');
  getSCU().find('#residenza-comune').type('LONIGO');
  getSCU().find('#residenza-comune_listbox').click();
  //Contatto Email
  getSCU().find('#email').type(nuovoClientePG.email);

  getSCU().find('button:contains("Avanti")').click();

  //Consensi
  getSCU().find('label[for="invio-documenti-no"]').click();
  getSCU().find('label[for="firma-grafometrica-no"]').click();
  getSCU().find('label[for="promo-allianz-no"]').click();
  getSCU().find('label[for="promo-allianz-terzi-no"]').click();
  getSCU().find('label[for="promo-allianz-profilazione-no"]').click();
  getSCU().find('label[for="promo-allianz-indagini-no"]').click();
  getSCU().find('label[for="quest-adeguatezza-vita-no"]').click();
  getSCU().find('button:contains("Avanti")').click();

  //Verifica se i dati sono stati normalizzati
  // getSCU().then(($body)=>{
  //   if($body.find('li:contains("normalizzati")'))
  //     getSCU().find('button:contains("Avanti")').click();
  // });

  getSCU().find('button:contains("Conferma")').click();

  //Folder
  getFolder().find('span[class="k-icon k-plus"]:visible').click();
  getFolder().find('span[class="k-icon k-plus"]:first').click();

  //Autocertificazione con verifica di blocco per insufficienza documenti
  getFolder().find('#UploadDocument').click();
  getFolder().find('#win-upload-document_wnd_title').click();
  getFolder().find('span[aria-owns="wizard-folder-type-select_listbox"]').click().type('{downarrow}');
  getFolder().find('span[aria-owns="wizard-document-type-select_listbox"]').click().type('{downarrow}').type('{downarrow}').type('{enter}');
  const fileName = 'Autocertificazione_Test.pdf';
  getFolder().find('#file').attachFile(fileName);
  getFolder().contains('Upload dei file selezionati').click();
  getSCU().find('button:contains("Conferma")').click();
  getSCU().find('button:contains("Inserisci il documento")').click();

  //Visura camerale
  getFolder().find('span[class="k-icon k-plus"]:visible').click();
  getFolder().find('span[class="k-icon k-plus"]:first').click();
  getFolder().find('#UploadDocument').click();
  getFolder().find('#win-upload-document_wnd_title').click();
  getFolder().find('span[aria-owns="wizard-folder-type-select_listbox"]').click().type('{downarrow}');
  getFolder().find('span[aria-owns="wizard-document-type-select_listbox"]').click().type('Visura').type('{enter}');
  getFolder().find('#file').attachFile(fileName);
  getFolder().contains('Upload dei file selezionati').click();
  getSCU().find('button:contains("Conferma")').click();
  
  cy.wait(12000);
  getSCU().find('#endWorkflowButton').click();
  
  cy.get('lib-header-logo').click();
  cy.contains('Clients').click();
  cy.get('input[name="main-search-input"]').type(nuovoClientePG.ragioneSociale).type('{enter}');
  cy.get('lib-client-item').first().click();
  cy.get('nx-icon[aria-label="Open menu"]').click();
  cy.contains('Cancellazione cliente').click();
  cy.contains('Cancella cliente').click();
  cy.contains('Ok').click();
  cy.get('.user-icon-container').click();
  cy.contains('Logout').click();
});