/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
*/

/// <reference types="Cypress" />

//#region import
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import LandingRicerca from "../../mw_page_objects/ricerca/LandingRicerca"
import SintesiCliente from "../../mw_page_objects/clients/SintesiCliente"
import DettaglioAnagrafica from "../../mw_page_objects/clients/DettaglioAnagrafica"
import SCUContiCorrenti from "../../mw_page_objects/clients/SCUContiCorrenti"
//#endregion import

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)

//#endregion

//#region Mysql DB Variables
const testName = Cypress.spec.name.split('/')[1].split('.')[0].toUpperCase()
const currentEnv = Cypress.env('currentEnv')
const dbConfig = Cypress.env('db')
let insertedId
//#endregion

var client
var contoCorrente = {
  coordinate: "",
  denominazioneBanca: "",
  sportello: "",
  comune: "",
  indirizzo: "",
  provincia: "",
  cap: "",
  intestatario: "",
  annoApertura: "",
  iban: "",
  vat: "",
}
let urlClient
//#region Before After
before(() => {
  cy.getUserWinLogin().then(data => {
    cy.task('startMysql', { dbConfig: dbConfig, testCaseName: testName, currentEnv: currentEnv, currentUser: data.tutf }).then((results) => {
      insertedId = results.insertId
    })
    LoginPage.logInMWAdvanced()
  })

  cy.fixture('iban.json').then((data) => {
    var indexScelta = Math.floor(Math.random() * data.iban.length);
    contoCorrente.iban = data.iban[indexScelta]
  })
  cy.fixture('vat_codFisc.json').then((data) => {
    var indexScelta = Math.floor(Math.random() * data.codFisc.length);
    contoCorrente.vat = data.codFisc[indexScelta]
  })


  LandingRicerca.searchRandomClient(true, "PF", "E")
  LandingRicerca.clickRandomResult()
  SintesiCliente.retriveUrl().then(currentUrl => {
    urlClient = currentUrl
  })
  SintesiCliente.retriveClientNameAndAddress().then(currentClient => {
    client = currentClient
  })
})

beforeEach(() => {
  cy.preserveCookies()
})

after(function () {
  TopBar.logOutMW()
  //#region Mysql
  cy.getTestsInfos(this.test.parent.suites[0].tests).then(testsInfo => {
    let tests = testsInfo
    cy.task('finishMysql', { dbConfig: dbConfig, rowId: insertedId, tests })
  })
  //#endregion

})
//#endregion Before After

var contoModificato
describe('Matrix Web : Conti Correnti', function () {

  it('Verifica Aggiungi Conto corrente', function () {
    DettaglioAnagrafica.clickTabDettaglioAnagrafica()
    DettaglioAnagrafica.clickSubTab('Conti correnti')
    SCUContiCorrenti.aggiungiContoCorrente(contoCorrente, client).then((conto) => {
      contoCorrente = conto
    })

  })

  it('Verifica Conto corrente inserito', function () {
    SintesiCliente.visitUrlClient(urlClient)
    DettaglioAnagrafica.clickTabDettaglioAnagrafica()
    DettaglioAnagrafica.clickSubTab('Conti correnti')
    SCUContiCorrenti.checkContoCorrente(contoCorrente)
  })

  it('Verifica Modifica Conto corrente', function () {
    SCUContiCorrenti.modificaConto(contoCorrente).then((newConto) => {
      contoModificato = newConto
      SintesiCliente.visitUrlClient(urlClient)
      DettaglioAnagrafica.clickTabDettaglioAnagrafica()
      DettaglioAnagrafica.clickSubTab('Conti correnti')
      SCUContiCorrenti.checkContoCorrenteModificato(contoModificato)
    })
  })


  //ADD TFS
  it('Verifica Conto corrente eliminato', function () {
    SCUContiCorrenti.eliminaConto(contoModificato)
  })
})