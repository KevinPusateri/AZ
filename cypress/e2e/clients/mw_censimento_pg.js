/**
* @author Andrea 'Bobo' Oboe <andrea.oboe@allianz.it>
*/

/// <reference types="Cypress" />

//#region import
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import LandingClients from "../../mw_page_objects/clients/LandingClients"
import SCU from "../../mw_page_objects/clients/SCU"
import Folder from "../../mw_page_objects/common/Folder"
import HomePage from "../../mw_page_objects/common/HomePage"
import LandingRicerca from "../../mw_page_objects/ricerca/LandingRicerca"
import SintesiCliente from "../../mw_page_objects/clients/SintesiCliente"
import DettaglioAnagrafica from "../../mw_page_objects/clients/DettaglioAnagrafica"
import ArchivioCliente from "../../mw_page_objects/clients/ArchivioCliente"
//#endregion import

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)

//#endregion

//#region Mysql DB Variables
const testName = Cypress.spec.name.split('.')[0].toUpperCase()
const currentEnv = Cypress.env('currentEnv')
const dbConfig = Cypress.env('db')
let insertedId
//#endregion

let nuovoClientePG

//#region Before After
before(() => {
  cy.getUserWinLogin().then(data => {
    cy.startMysql(dbConfig, testName, currentEnv, data).then((id) => insertedId = id)
    LoginPage.logInMWAdvanced()
  })
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


})
beforeEach(() => {
  cy.ignoreRequest()
  cy.preserveCookies()
})
afterEach(function () {
  if (this.currentTest.state !== 'passed') {
    TopBar.logOutMW()
    //#region Mysql
    cy.getTestsInfos(this.test.parent.suites[0].tests).then(testsInfo => {
      let tests = testsInfo
      cy.finishMysql(dbConfig, insertedId, tests)
    })
    //#endregion
    Cypress.runner.stop();
  }
})
after(function () {
  TopBar.logOutMW()
  //#region Mysql
  cy.getTestsInfos(this.test.parent.suites[0].tests).then(testsInfo => {
    let tests = testsInfo
    cy.finishMysql(dbConfig, insertedId, tests)
  })
  //#endregion

})
//#endregion Before After

let urlClient
describe('Matrix Web : Censimento Nuovo Cliente PG', {
  retries: {
    runMode: 0,
    openMode: 0,
  }
}, () => {
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
    HomePage.reloadMWHomePage()
    TopBar.search(nuovoClientePG.partitaIva)
    LandingRicerca.filtra('PG','P')
    LandingRicerca.clickFirstResult()
  })

  it('Verificare varie informazioni cliente', () => {
    SintesiCliente.retriveUrl().then(currentUrl => {
      urlClient = currentUrl
    })
    SintesiCliente.verificaDatiSpallaSinistra(nuovoClientePG)
    DettaglioAnagrafica.verificaDatiDettaglioAnagrafica(nuovoClientePG)
    ArchivioCliente.clickTabArchivioCliente()
    ArchivioCliente.clickComunicazioni()
    ArchivioCliente.verificaCardComunicazioni("Invio per verifica contatto")
    ArchivioCliente.verificaUnico()
  })


  it('Emettere una Plein Air e verifica presenza in Folder', function () {
    if (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker')) {
      SintesiCliente.emettiPleinAir()
      SintesiCliente.visitUrlClient(urlClient)
      SintesiCliente.verificaInFolderDocumentiAnagrafici(["PleinAir"])
    }
    else
      this.skip()
  })
})