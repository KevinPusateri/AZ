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
import DettaglioAnagrafica from "../../../mw_page_objects/clients/DettaglioAnagrafica"
//#endregion import

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)
//#endregion

//#region Variables
const userName = 'TUTF021'
const psw = 'P@ssw0rd!'
let nuovoClientePG
//#endregion

//#region Before After
before(() => {
  cy.task('nuovoClientePersonaGiuridica').then((object) => {
    nuovoClientePG = object
    nuovoClientePG.tipologia = "DITTA"
    nuovoClientePG.formaGiuridica = "S.R.L."
    nuovoClientePG.toponimo = "PIAZZA"
    nuovoClientePG.indirizzo = "GIUSEPPE GARIBALDI"
    nuovoClientePG.numCivico = "1"
    nuovoClientePG.cap = "36045"
    nuovoClientePG.citta = "LONIGO"
    nuovoClientePG.provincia = "VI"
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

  it('Inserire i dati mancanti e premere avanti', () => {
    SCU.nuovoClientePGDatiAnagrafici(nuovoClientePG)
  })

  it('Contatti > inserire la mail e modificare l\'indirizzo della sede legale', () => {
    SCU.nuovoClientePGContatti(nuovoClientePG)
  })

  it('Consensi > tutto no', () => {
    SCU.nuovoClientePGConsensi()
    SCU.nuovoClientePGConfermaInserimento()
  })

  it('Da Folder inserire l\'autocertificazione e verificare che l\'inserimento venga bloccato', () => {
    Folder.caricaAutocertificazione()
    SCU.VerificaDocumentiInsufficienti()
  })

  it('Da Folder inserire la visura camerale e procedere', () => {
    Folder.caricaVisuraCamerale()
    SCU.generazioneStampe()
  })

  it('Ricercare il cliente appena censito nella buca di ricerca', () => {

    HomePage.ReloadMWHomePage()
    TopBar.searchClientByCForPI(nuovoClientePG.partitaIva)
    LandingRicerca.clickFirstResult()
  })

  it('Verificare varie informazioni cliente', () => {
    SintesiCliente.verificaDatiSpallaSinistra(nuovoClientePG)
    DettaglioAnagrafica.verificaDatiDettaglioAnagrafica(nuovoClientePG)

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