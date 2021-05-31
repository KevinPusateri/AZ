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
import ArchivioCliente from "../../../mw_page_objects/clients/ArchivioCliente"
//#endregion import

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)
//#endregion

//#region Variables
const userName = 'TUTF021'
const psw = 'P@ssw0rd!'
let clientePG
//#endregion

//#region Before After
before(() => {
  cy.task('nuovoClientePersonaGiuridica').then((object) => {
    clientePG = object
    clientePG.tipologia = "DITTA"
    clientePG.formaGiuridica = "S.R.L."
    clientePG.toponimo = "PIAZZA"
    clientePG.indirizzo = "GIUSEPPE GARIBALDI"
    clientePG.numCivico = "1"
    clientePG.cap = "36045"
    clientePG.citta = "LONIGO"
    clientePG.provincia = "VI"
    clientePG.mail = "test_automatici@allianz.it"
    clientePG.pec = "test_automatici@pec.it"
    clientePG.invioPec = true
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

describe('Matrix Web : Modifica PG', function () {

  it.only('Ricercare un cliente PG e verificare il caricamento corretto della scheda del cliente', () => {
    LandingRicerca.searchRandomClient(true, "PG", "E")
    LandingRicerca.clickFirstResult()
    clientePG.nominatico = SintesiCliente.retriveClientName()
  })

  it.only('Modificare alcuni dati inserendo la PEC il consenso all\'invio', () => {
    DettaglioAnagrafica.modificaCliente()
    SCU.modificaClientePGDatiAnagrafici(clientePG)
    SCU.modificaClientePGModificaContatti(clientePG)
    SCU.modificaClientePGConsensi(clientePG)
    SCU.modificaClientePGConfermaModifiche()
  })

  it.only('Da Folder inserire la visura camerale e procedere', () => {
    Folder.caricaVisuraCamerale()
    Folder.clickTornaIndietro()
    SCU.generazioneStampe()
  })

  it.skip("Verificare che i consensi/contatti si siano aggiornati correttamente e Verificare il folder (unici + documento)", () => {
    //Skip this two requests that blocks on homepage
    cy.intercept(/embed.nocache.js/, 'ignore').as('embededNoCache');
    cy.intercept(/launch-*/, 'ignore').as('launchStaging');
    cy.visit('https://portaleagenzie.pp.azi.allianz.it/matrix/')

    cy.contains('Clients').click();
    cy.get('input[name="main-search-input"]').type(currentSelectedPG).type('{enter}');
    cy.get('lib-client-item').first().click();

    cy.intercept('POST', '**/graphql', (req) => {
      if (req.body.operationName.includes('client')) {
        req.alias = 'gqlClient'
      }
    });

    cy.contains('DETTAGLIO ANAGRAFICA').click()

    cy.wait('@gqlClient', { requestTimeout: 30000 });

    cy.contains('Invio documento via PEC')
      .parent('div')
      .get('nx-icon').should('have.class', 'nx-icon--s nx-icon--check-circle color-true')

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