/**
* @author Andrea 'Bobo' Oboe <andrea.oboe@allianz.it>
*/

/// <reference types="Cypress" />

//#region import
import LoginPage from "../../../mw_page_objects/common/LoginPage"
import TopBar from "../../../mw_page_objects/common/TopBar"
import LandingClients from "../../../mw_page_objects/clients/LandingClients"
import SCU from "../../../mw_page_objects/clients/SCU"
import Folder from "../../../mw_page_objects/common/Folder"
import HomePage from "../../../mw_page_objects/common/HomePage"
import LandingRicerca from "../../../mw_page_objects/ricerca/LandingRicerca"
import SintesiCliente from "../../../mw_page_objects/clients/SintesiCliente"
//#endregion import

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)
//#endregion

//#region Variables
const userName = 'TUTF021'
const psw = 'P@ssw0rd!'
let nuovoClientePG
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

//#region Before After
before(() => {
  cy.task('nuovoClientePersonaGiuridica').then((object) => {
    nuovoClientePG = object;
  })
  LoginPage.logInMW(userName, psw)
})

beforeEach(() => {
  cy.preserveCookies()
})

after(() => {
  TopBar.logOutMW()
})
//#endregion Before After

describe('Matrix Web : Censimento Nuovo Cliente PG', function () {

  it('Verifica apertura maschera di censimento', () => {
    LandingClients.inizializzaCensimentoClientePG(nuovoClientePG.partitaIva)
  })

  it.only('Inserire i dati mancanti e premere avanti', () => {
    SCU.nuovoClientePGDatiAnagrafici(nuovoClientePG)
  })

  it('Contatti > inserire la mail e modificare l\'indirizzo della sede legale', () => {
    SCU.nuovoClientePGDatiAnagrafici(nuovoClientePG)
  })

  it('Consensi > tutto no', () => {
    SCU.nuovoClientePGConsensi()
    SCU.nuovoClientePGConfermaInserimento()
  })

  it('Da Folder inserire l\'autocertificazione e verificare che l\'inserimento venga bloccato', () => {
    Folder.CaricaAutocertificazione()
    SCU.VerificaDocumentiInsufficienti()
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
      }, { subjectType: 'input' });
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
    cy.intercept(/embed.nocache.js/, 'ignore').as('embededNoCache');
    cy.intercept(/launch-*/, 'ignore').as('launchStaging');
    cy.visit('https://portaleagenzie.pp.azi.allianz.it/matrix/')

    cy.contains('Clients').click();
    cy.get('input[name="main-search-input"]').type(nuovoClientePG.partitaIva).type('{enter}');
    cy.get('lib-client-item').first().click();
  })

  it('Verificare varie informazioni cliente', () => {
    cy.get('.client-name').should('contain.text', String(nuovoClientePG.ragioneSociale).toUpperCase().replace(",", ""))
    cy.get('#app-clients > app-root > lib-page-layout > div > div > div > app-client-profile > lib-sub-header-layout > div > div > lib-container > div > div > app-sidebar-left > nx-sidebar > div > div > lib-scrollable-container > div > div > div.scrollable-sidebar-content > div > app-client-resume-card > nx-card > div.padder > div:nth-child(3) > app-link-client-resume > nx-link > a > div').should('contain.text', "PIAZZA GIUSEPPE GARIBALDI, 1 - 36045 - LONIGO (VI)")
    cy.get('#app-clients > app-root > lib-page-layout > div > div > div > app-client-profile > lib-sub-header-layout > div > div > lib-container > div > div > app-sidebar-left > nx-sidebar > div > div > lib-scrollable-container > div > div > div.scrollable-sidebar-content > div > app-client-resume-card > nx-card > div.padder > div:nth-child(5) > app-link-client-resume > nx-link > a > div').should('contain.text', String(nuovoClientePG.email).toLowerCase())

    cy.contains('DETTAGLIO ANAGRAFICA').click()
    //cy.get('#nx-tab-content-0-0 > app-client-personal-data > div > div > app-legal-client-main-data > div.box > div:nth-child(1) > app-client-data-label:nth-child(1) > div > div.value > div > div').should('contain.text',String(nuovoClientePG.ragioneSociale).toUpperCase().replace(",",""))
    // cy.get('#nx-tab-content-0-0 > app-client-personal-data > div > div > app-legal-client-main-data > div.box > div:nth-child(2) > app-client-data-label:nth-child(1) > div > div.value > div > div').should('contain.text',String(nuovoClientePG.partitaIva))
    // cy.get('#nx-tab-content-0-0 > app-client-personal-data > div > div > app-legal-client-main-data > div.box > div:nth-child(2) > app-client-data-label:nth-child(2) > div > div.value > div > div').should('contain.text',String(nuovoClientePG.partitaIva))
    // cy.get('#nx-tab-content-0-0 > app-client-personal-data > div > div > app-legal-client-main-data > div.box > div:nth-child(1) > app-client-data-label:nth-child(2) > div > div.value > div > div').should('contain.text',"S.R.L.")
    // cy.get('#nx-tab-content-0-0 > app-client-personal-data > div > div > app-legal-client-main-data > div.box > div:nth-child(1) > app-client-data-label:nth-child(3) > div > div.value > div > div').should('contain.text',"DITTA")

    cy.contains('ARCHIVIO CLIENTE').click()
    cy.contains('Comunicazioni').click()
    cy.get('.card-title').should('contain.text', "Invio per verifica contatto")
    cy.contains('Unico').click()
    //cy.get('#nx-tab-content-1-3 > app-client-archive-unique > div > div.actions-box.ng-star-inserted > app-section-title > div').should('contain.text'," 1 Aggiornamento unico")
  })

  it('Emettere una Plein Air e verifica presenza in Folder', () => {
    cy.get('nx-icon[aria-label="Open menu"]').click();
    cy.contains('PLEINAIR').click();

    getIframe().find('#PageContentPlaceHolder_Questionario1_4701-15_0_i').select('NUOVA ISCRIZIONE')
    getIframe().find('#PageContentPlaceHolder_Questionario1_4701-40_0_i').select('FORMULA BASE')
    getIframe().find('#ButtonQuestOk').click().wait(6000)
    getIframe().find('#TabVarieInserimentoTipoPagamento > div.left > span > span').click()
    getIframe().find('li').contains("Contanti").click()
    getIframe().find('#FiltroTabVarieInserimentoDescrizione').type("TEST AUTOMATICO")

    cy.intercept({
      method: 'POST',
      url: /QuestionariWeb/
    }).as('questionariWeb');

    getIframe().find('#TabVarieInserimentoButton').click().wait(20000)

    cy.wait('@questionariWeb', { requestTimeout: 60000 });

    getIframe().find('#ButtonQuestOk').click()

    cy.intercept(/embed.nocache.js/, 'ignore').as('embededNoCache');
    cy.intercept(/launch-*/, 'ignore').as('launchStaging');
    cy.visit('https://portaleagenzie.pp.azi.allianz.it/matrix/')

    cy.contains('Clients').click();
    cy.get('input[name="main-search-input"]').type(nuovoClientePG.partitaIva).type('{enter}');
    cy.get('lib-client-item').first().click();

    cy.get('nx-icon[aria-label="Open menu"]').click();
    cy.contains('folder').click();
    cy.get('nx-modal-container').find('.agency-row').first().click().wait(3000)

    getIframe().find('span[class="k-icon k-plus"]:visible').click();
    getIframe().find('span[class="k-icon k-plus"]:first').click();

    getIframe().find('span').contains("PleinAir").click();

  })
})