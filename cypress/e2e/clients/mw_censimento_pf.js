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
import LandingRicerca from "../../mw_page_objects/ricerca/LandingRicerca"
import SintesiCliente from "../../mw_page_objects/clients/SintesiCliente"
import HomePage from "../../mw_page_objects/common/HomePage"
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

let nuovoClientePF
//#region Before After
before(() => {
  cy.getUserWinLogin().then(data => {
    cy.startMysql(dbConfig, testName, currentEnv, data).then((id)=> insertedId = id )
    LoginPage.logInMWAdvanced()
  })
  cy.task('nuovoClientePersonaFisica').then((object) => {
    nuovoClientePF = object;
  })

})
beforeEach(() => {
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

describe('Matrix Web : Censimento Nuovo Cliente PF', {
  retries: {
    runMode: 1,
    openMode: 0,
  }
}, () => {

  it('Verifica apertura maschera di censimento', () => {
    LandingClients.inizializzaCensimentoClientePF()
  })

  it('Inserimento dati mancanti (no PEP)', () => {
    SCU.nuovoClientePFDatiAnagrafici(nuovoClientePF)
  })

  it('Inserimento contatti : residenza (no cellulare e mail)', () => {
    SCU.nuovoClientePFContatti()
  })

  it('Inserimento consensi (firma grafo e OTP a no)', () => {
    SCU.nuovoClientePFConsensi()
  })

  it('Inserimento documento di identita e completamento flusso', () => {
    SCU.nuovoClientePFDocumento()
    Folder.caricaDocumentoIdentita()
    SCU.generazioneStampe()
  })

  it('Ricercare il cliente appena censito nella buca di ricerca', () => {
    HomePage.reloadMWHomePage()
    TopBar.search(`${nuovoClientePF.cognome} ${nuovoClientePF.nome}`)
    LandingRicerca.filtra('PF','P')
    LandingRicerca.clickClientePF(`${nuovoClientePF.cognome} ${nuovoClientePF.nome}`)
  })

  it('Cancellare il cliente', () => {
    SintesiCliente.cancellaCliente()
  })
})