/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
*/

/// <reference types="Cypress" />

//#region import
import LoginPage from "../../../mw_page_objects/common/LoginPage"
import TopBar from "../../../mw_page_objects/common/TopBar"
import LandingRicerca from "../../../mw_page_objects/ricerca/LandingRicerca"
import SintesiCliente from "../../../mw_page_objects/clients/SintesiCliente"
import DettaglioAnagrafica from "../../../mw_page_objects/clients/DettaglioAnagrafica"
import HomePage from "../../../mw_page_objects/common/HomePage"
import SCUContiCorrenti from "../../../mw_page_objects/clients/SCUContiCorrenti"
const ibantools = require('ibantools')
//#endregion import

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)
//#endregion

//#region Variables
const userName = 'le00080'
const psw = 'Giugno2021$'
// var contoCorrente = {}
let codFisc
// var iban
// var vat
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

//#endregion

//#region Before After
before(() => {
  LoginPage.logInMW(userName, psw)
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
  SintesiCliente.retriveClientNameAndAddress().then(currentClient => {
    client = currentClient
  })
})

beforeEach(() => {
  cy.preserveCookies()
})

after(() => {
  TopBar.logOutMW()
})
//#endregion Before After

describe('Matrix Web : Conti Correnti', function () {

  it('Verifica Aggiugni Conto orrente', function () {
    DettaglioAnagrafica.clickTabDettaglioAnagrafica()
    DettaglioAnagrafica.clickSubTab('Conti correnti')
    SCUContiCorrenti.aggiungiContoCorrente(contoCorrente, client).then((conto) => {
      contoCorrente = conto
    })

  })

  it('Verifica Conto corrente inserito', function () {
    HomePage.reloadMWHomePage()
    TopBar.search(client.name)
    LandingRicerca.clickClientName(client)
    DettaglioAnagrafica.clickTabDettaglioAnagrafica()
    DettaglioAnagrafica.clickSubTab('Conti correnti')
    SCUContiCorrenti.checkContoCorrente(contoCorrente)
  })
  // it('Verifica Modifica Conto corrente', function () {
  //   SCUContiCorrenti.modificaConto(contoCorrente)
  // })

  it('Verifica Conto corrente eliminato', function () {
    SCUContiCorrenti.eliminaConto(contoCorrente)
  })
})