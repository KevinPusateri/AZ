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

let nuovoClientePG;

before(() => {
  cy.task('nuovoClientePersonaGiuridica').then((object) => {
    nuovoClientePG = object;
  });

  cy.clearCookies();
  
  //Skip this two requests that blocks on homepage
  cy.intercept(/embed.nocache.js/,'success').as('embededNoCache');
  cy.intercept(/launch-*/,'success').as('launchStaging');

  cy.visit('https://matrix.pp.azi.allianz.it/')
  cy.get('input[name="Ecom_User_ID"]').type('TUTF021')
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
//   cy.get('.user-icon-container').click()
//   cy.contains('Logout').click()
//   cy.wait(delayBetweenTests)
//   cy.clearCookies();
// })

describe('Matrix Web : Censimento Nuovo Cliente PG', function () {

    it('Verifica apertura maschera di censimento', () => {
        cy.contains('Clients').click();
        cy.contains('Nuovo cliente').click();
        cy.contains('Persona giuridica').click();
        cy.get('#nx-tab-content-0-1 > div > app-new-client-fiscal-code-box > div > div:nth-child(4) > div > nx-formfield').click().type(nuovoClientePG.partitaIva+"1");

        cy.find('span:contains("Cerca")').next().click();

        cy.intercept('POST', '/graphql', (req) => {
          if (req.body.operationName.includes('search')) {
            req.alias = 'gqlSearch'
          }
        })
        
        cy.wait('@gqlSearch')
        
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
        getSCU().find('#indirizzo-via').type('GIUSEPPE GARIBALDO');
        getSCU().find('#indirizzo-num').type('1');
        getSCU().find('#residenza-comune').type('LONIGO');
        getSCU().find('#residenza-comune_listbox').click();
        //Contatto Email
        getSCU().find('#email').type(nuovoClientePG.email);

        cy.intercept({
          method: 'POST',
          url: /NormalizzaUbicazione/
        }).as('normalizzaUbicazione');

        getSCU().find('button:contains("Avanti")').click();

        cy.wait('@normalizzaUbicazione', { requestTimeout: 10000 });

        //#region Verifica presenza normalizzatore
        getSCU().find('#Allianz-msg-container').then((container) => {
            if (container.find('li:contains(normalizzata)').length > 0) {
              getSCU().find('button:contains("Avanti")').click();
            }
        });
        //#endregion
    })

    it('Consensi > tutto no', () => {
        getSCU().find('label[for="invio-documenti-no"]').click();
        getSCU().find('label[for="firma-grafometrica-no"]').click();
        getSCU().find('label[for="promo-allianz-no"]').click();
        getSCU().find('label[for="promo-allianz-terzi-no"]').click();
        getSCU().find('label[for="promo-allianz-profilazione-no"]').click();
        getSCU().find('label[for="promo-allianz-indagini-no"]').click();
        getSCU().find('label[for="quest-adeguatezza-vita-no"]').click();

        cy.intercept({
          method: 'GET',
          url: /VerificaPiva*/
        }).as('verificaPiva');

        cy.intercept({
          method: 'POST',
          url: /Post/
        }).as('post');

        getSCU().find('button:contains("Avanti")').click();

        cy.wait('@verificaPiva', { requestTimeout: 10000 });
        cy.wait('@post', { requestTimeout: 10000 });

        //#region Verifica presenza normalizzatore
        getSCU().find('#Allianz-msg-container').then((container) => {
          if (container.find('li:contains(normalizzata)').length > 0) {
            getSCU().find('button:contains("Avanti")').click();
          }
        });
        //#endregion

        getSCU().find('button:contains("Conferma")').click();
    })

    it('Da Folder inserire l\'autocertificazione e verificare che l\'inserimento venga bloccato', () => {
      getFolder().find('span[class="k-icon k-plus"]:visible').click();
      getFolder().find('span[class="k-icon k-plus"]:first').click();
      getFolder().find('#UploadDocument').click();
      getFolder().find('#win-upload-document_wnd_title').click();
      getFolder().find('span[aria-owns="wizard-folder-type-select_listbox"]').click().type('{downarrow}');
      getFolder().find('span[aria-owns="wizard-document-type-select_listbox"]').click().type('{downarrow}').type('{downarrow}').type('{enter}');

      cy.intercept({
        method: 'POST',
        url: /uploadCustomerDocument/
      }).as('uploadCustomerDoc');

      const fileName = 'Autocertificazione_Test.pdf';
      cy.fixture(fileName).then(fileContent => {
        getFolder().find('#file').attachFile({ 
          fileContent, 
          fileName, 
          mimeType,
          name: "Autocertificazione_Test.pdf", 
          encoding: 'base64' 
        });
      });

      getFolder().contains('Upload dei file selezionati').click();
      cy.wait('@uploadCustomerDoc', { requestTimeout: 30000 });

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
        cy.intercept({
          method: 'POST',
          url: /uploadCustomerDocument/
        }).as('uploadCustomerDoc');

        const fileName = 'Autocertificazione_Test.pdf';
        cy.fixture(fileName).then(fileContent => {
          getFolder().find('#file').attachFile({ 
            fileContent, 
            fileName, 
            mimeType: 'application/pdf'
          },{ subjectType: 'input' });
        });

      getFolder().contains('Upload dei file selezionati').click();
      cy.wait('@uploadCustomerDoc', { requestTimeout: 30000 });
        
      getSCU().find('button:contains("Conferma")').click();
        
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
      cy.visit('https://portaleagenzie.pp.azi.allianz.it/matrix')
      cy.contains('Clients').click();
      cy.get('input[name="main-search-input"]').type(nuovoClientePG.partitaIva).type('{enter}');
      cy.get('lib-client-item').first().click();
    })

    it('Verificare varie informazioni cliente', () => {
      cy.get('div[ngClass="client-name"]').should('contain',nuovoClientePG.ragioneSociale)
    })
})