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

const getFolder = () => {
  getIframe().find('iframe[class="w-100"]')
  .iframe();

  let iframeFolder = getIframe().find('iframe[class="w-100"]')
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
  cy.intercept(/embed.nocache.js/,'ignore').as('embededNoCache');
  cy.intercept(/launch-*/,'ignore').as('launchStaging');

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
        
        cy.get('span:contains("Cerca"):last').click();
        cy.contains('Aggiungi cliente').click();
    })

    it('Inserire i dati mancanti e premere avanti', () => { 
        getIframe().find('#ragione-sociale').type(nuovoClientePG.ragioneSociale);
        getIframe().find('span[aria-owns="forma-giuridica_listbox"]').click();
        getIframe().find('li').contains(/^S.R.L.$/).click();
        getIframe().find('span[aria-owns="tipologia_listbox"]').click();
        getIframe().find('li:contains("DITTA")').click();
        getIframe().find('span[aria-owns="settore-attivita_listbox"]').click();
        getIframe().find('li:contains("COSTRUZIONI")').click();
        getIframe().find('#partita-iva').type(nuovoClientePG.partitaIva);
        getIframe().find('#codice-fiscale-impresa').type(nuovoClientePG.partitaIva);
        getIframe().find('#unita-di-mercato').type('1022');
        getIframe().find('li:contains("1022")').click();
        getIframe().find('button:contains("Avanti")').click();
    })

    it('Contatti > inserire la mail e modificare l\'indirizzo della sede legale', () => {
        //Sede Legale
        getIframe().find('span[aria-owns="toponomastica_listbox"]').click();
        getIframe().find('li').contains(/^PIAZZA$/).click();
        getIframe().find('#indirizzo-via').type('GIUSEPPE GARIBALDO');
        getIframe().find('#indirizzo-num').type('1');
        getIframe().find('#residenza-comune').type('LONIGO');
        getIframe().find('#residenza-comune_listbox').click();
        //Contatto Email
        getIframe().find('#email').type(nuovoClientePG.email);

        cy.intercept({
          method: 'POST',
          url: /NormalizzaUbicazione/
        }).as('normalizzaUbicazione');

        getIframe().find('button:contains("Avanti")').click();

        cy.wait('@normalizzaUbicazione', { requestTimeout: 10000 });

        //#region Verifica presenza normalizzatore
        getIframe().find('#Allianz-msg-container').then((container) => {
            if (container.find('li:contains(normalizzata)').length > 0) {
              getIframe().find('button:contains("Avanti")').click();
            }
        });
        //#endregion
    })

    it('Consensi > tutto no', () => {
        getIframe().find('label[for="invio-documenti-no"]').click();
        getIframe().find('label[for="firma-grafometrica-no"]').click();
        getIframe().find('label[for="promo-allianz-no"]').click();
        getIframe().find('label[for="promo-allianz-terzi-no"]').click();
        getIframe().find('label[for="promo-allianz-profilazione-no"]').click();
        getIframe().find('label[for="promo-allianz-indagini-no"]').click();
        getIframe().find('label[for="quest-adeguatezza-vita-no"]').click();

        cy.intercept({
          method: 'GET',
          url: /VerificaPiva*/
        }).as('verificaPiva');

        cy.intercept({
          method: 'POST',
          url: /Post/
        }).as('post');

        getIframe().find('button:contains("Avanti")').click();

        cy.wait('@verificaPiva', { requestTimeout: 10000 });
        cy.wait('@post', { requestTimeout: 10000 });

        //#region Verifica presenza normalizzatore
        getIframe().find('#Allianz-msg-container').then((container) => {
          if (container.find('li:contains(normalizzata)').length > 0) {
            getIframe().find('button:contains("Avanti")').click();
          }
        });
        //#endregion

        getIframe().find('button:contains("Conferma")').click();
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
          mimeType: 'application/pdf'
        },{ subjectType: 'input' });
      });

      getFolder().contains('Upload dei file selezionati').click();
      cy.wait('@uploadCustomerDoc', { requestTimeout: 30000 });

      getIframe().find('button:contains("Conferma")').click();
      getIframe().find('button:contains("Inserisci il documento")').click();
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
        
      getIframe().find('button:contains("Conferma")').click();
        
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

    it('Ricercare il cliente appena censito nella buca di ricerca', () => {
      //Skip this two requests that blocks on homepage
      cy.intercept(/embed.nocache.js/,'ignore').as('embededNoCache');
      cy.intercept(/launch-*/,'ignore').as('launchStaging');
      cy.visit('https://portaleagenzie.pp.azi.allianz.it/matrix/')

      cy.contains('Clients').click();
      cy.get('input[name="main-search-input"]').type(nuovoClientePG.partitaIva).type('{enter}');
      cy.get('lib-client-item').first().click();
    })

    it('Verificare varie informazioni cliente', () => {
      cy.get('.client-name').should('contain.text',String(nuovoClientePG.ragioneSociale).toUpperCase().replace(",",""))
      cy.get('#app-clients > app-root > lib-page-layout > div > div > div > app-client-profile > lib-sub-header-layout > div > div > lib-container > div > div > app-sidebar-left > nx-sidebar > div > div > lib-scrollable-container > div > div > div.scrollable-sidebar-content > div > app-client-resume-card > nx-card > div.padder > div:nth-child(3) > app-link-client-resume > nx-link > a > div').should('contain.text',"PIAZZA GIUSEPPE GARIBALDI, 1 - 36045 - LONIGO (VI)")
      cy.get('#app-clients > app-root > lib-page-layout > div > div > div > app-client-profile > lib-sub-header-layout > div > div > lib-container > div > div > app-sidebar-left > nx-sidebar > div > div > lib-scrollable-container > div > div > div.scrollable-sidebar-content > div > app-client-resume-card > nx-card > div.padder > div:nth-child(5) > app-link-client-resume > nx-link > a > div').should('contain.text',String(nuovoClientePG.email).toLowerCase())

      cy.contains('DETTAGLIO ANAGRAFICA').click()
      cy.get('#nx-tab-content-0-0 > app-client-personal-data > div > div > app-legal-client-main-data > div.box > div:nth-child(1) > app-client-data-label:nth-child(1) > div > div.value > div > div').should('contain.text',String(nuovoClientePG.ragioneSociale).toUpperCase().replace(",",""))
      cy.get('#nx-tab-content-0-0 > app-client-personal-data > div > div > app-legal-client-main-data > div.box > div:nth-child(2) > app-client-data-label:nth-child(1) > div > div.value > div > div').should('contain.text',String(nuovoClientePG.partitaIva))
      cy.get('#nx-tab-content-0-0 > app-client-personal-data > div > div > app-legal-client-main-data > div.box > div:nth-child(2) > app-client-data-label:nth-child(2) > div > div.value > div > div').should('contain.text',String(nuovoClientePG.partitaIva))
      cy.get('#nx-tab-content-0-0 > app-client-personal-data > div > div > app-legal-client-main-data > div.box > div:nth-child(1) > app-client-data-label:nth-child(2) > div > div.value > div > div').should('contain.text',"S.R.L.")
      cy.get('#nx-tab-content-0-0 > app-client-personal-data > div > div > app-legal-client-main-data > div.box > div:nth-child(1) > app-client-data-label:nth-child(3) > div > div.value > div > div').should('contain.text',"DITTA")

      cy.contains('ARCHIVIO CLIENTE').click()
      cy.contains('Comunicazioni').click()
      cy.get('.card-title').should('contain.text',"Invio per verifica contatto")
      cy.contains('Unico').click()
      cy.get('#nx-tab-content-1-3 > app-client-archive-unique > div > div.actions-box.ng-star-inserted > app-section-title > div').should('contain.text'," 1 Aggiornamento unico")
      
      
    })

    it('Emettere una Plein Air', () => {
      cy.get('nx-icon[aria-label="Open menu"]').click();
      cy.contains('PLEINAIR').click();

      getIframe().find('#PageContentPlaceHolder_Questionario1_4701-15_0_i').select('NUOVA ISCRIZIONE')
      getIframe().find('#PageContentPlaceHolder_Questionario1_4701-40_0_i').select('FORMULA BASE')
      getIframe().find('#ButtonQuestOk').click()

      getIframe().find('#TabVarieInserimentoButton').click()
      
    })
})
