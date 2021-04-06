/**
* @author Andrea 'Bobo' Oboe <andrea.oboe@allianz.it>
*/

/// <reference types="Cypress" />

//#region Configuration
Cypress.config('defaultCommandTimeout', 30000)
const delayBetweenTests = 2000
//#endregion

//#region Global Variables
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
//#endregion

beforeEach(() => {
  cy.viewport(1920, 1080)
  cy.visit('https://matrix.pp.azi.allianz.it/')
  cy.get('input[name="Ecom_User_ID"]').type('TUTF002')
  cy.get('input[name="Ecom_Password"]').type('Pi-bo1r0')
  cy.get('input[type="SUBMIT"]').click()
  cy.url().should('include','/portaleagenzie.pp.azi.allianz.it/matrix/')
})

afterEach(() => {
  cy.get('.user-icon-container').click()
  cy.contains('Logout').click()
  cy.wait(delayBetweenTests)
})

describe('Matrix Web : Censimento Nuovo Cliente PG', function () {

    cy.task('nuovoClientePersonaGiuridica').then((object) => {
        nuovoClientePG = object;
    });

    it('Verifica apertura maschera di censimento', () => {
        cy.contains('Clients').click();
        cy.contains('Nuovo cliente').click();
        cy.contains('Persona giuridica').click();
        cy.get('#nx-tab-content-0-1 > div > app-new-client-fiscal-code-box > div > div:nth-child(4) > div > nx-formfield').click().type(nuovoClientePG.partitaIva);
        cy.get('span:contains("Cerca"):last').click();
        cy.contains('Aggiungi cliente').click();
    })

    it('Inserire i dati mancanti e premere avanti', () => { 
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
    })

    it('Contatti > inserire la mail e modificare l\'indirizzo della sede legale', () => {
        //Sede Legale
        getSCU().find('span[aria-owns="toponomastica_listbox"]').click();
        getSCU().find('li').contains(/^PIAZZA$/).click();
        getSCU().find('#indirizzo-via').type('GARIBALDI');
        getSCU().find('#indirizzo-num').type('1');
        getSCU().find('#residenza-comune').type('LONIGO');
        getSCU().find('#residenza-comune_listbox').click();
        //Contatto Email
        getSCU().find('#email').type(nuovoClientePG.email);
        getSCU().find('button:contains("Avanti")').click();
    })

    it('Consensi > tutto no', () => {
        getSCU().find('label[for="invio-documenti-no"]').click();
        getSCU().find('label[for="firma-grafometrica-no"]').click();
        getSCU().find('label[for="promo-allianz-no"]').click();
        getSCU().find('label[for="promo-allianz-terzi-no"]').click();
        getSCU().find('label[for="promo-allianz-profilazione-no"]').click();
        getSCU().find('label[for="promo-allianz-indagini-no"]').click();
        getSCU().find('label[for="quest-adeguatezza-vita-no"]').click();
        getSCU().find('button:contains("Avanti")').click();

            //Verifica se i dati sono stati normalizzati
    //getSCU().then(($body)=>{
    //   if($body.find('li:contains("normalizzati")'))
    //     getSCU().find('button:contains("Avanti")').click();
    // });

        getSCU().find('button:contains("Conferma")').click();
    })

    it('Da Folder inserire l\'autocertificazione e verificare che l\'inserimento venga bloccato', () => {
      getFolder().find('span[class="k-icon k-plus"]:visible').click();
      getFolder().find('span[class="k-icon k-plus"]:first').click();
      getFolder().find('#UploadDocument').click();
      getFolder().find('#win-upload-document_wnd_title').click();
      getFolder().find('span[aria-owns="wizard-folder-type-select_listbox"]').click().type('{downarrow}');
      getFolder().find('span[aria-owns="wizard-document-type-select_listbox"]').click().type('{downarrow}').type('{downarrow}').type('{enter}');
      const fileName = 'Autocertificazione_Test.pdf';
      getFolder().find('#file').attachFile(fileName);
      getFolder().contains('Upload dei file selezionati').click();
      getSCU().find('button:contains("Conferma")').click();
      getSCU().find('button:contains("Inserisci il documento")').click();
    })

    it('Da Folder inserire la visura camerale e procedere', () => {
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
    })

    it('Ricercare il cliente appena censito nella buca di ricerca', () => {
        cy.get('lib-header-logo').click();
        cy.contains('Clients').click();
        cy.get('input[name="main-search-input"]').type(nuovoClientePG.ragioneSociale).type('{enter}');
        cy.get('lib-client-item').first().click();
    })
})