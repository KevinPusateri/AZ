/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 */

/// <reference types="Cypress" />

import Common from "../../../mw_page_objects/common/Common"
import LoginPage from "../../../mw_page_objects/common/LoginPage"
import LandingRicerca from "../../../mw_page_objects/ricerca/LandingRicerca"
import SintesiCliente from "../../../mw_page_objects/clients/SintesiCliente"

import DettaglioAnagrafica from "../../../mw_page_objects/clients/DettaglioAnagrafica"
import SCUContatti from "../../../mw_page_objects/clients/SCUContatti"
import HomePage from "../../../mw_page_objects/common/HomePage"
import TopBar from "../../../mw_page_objects/common/TopBar"


//#region Variables
const userName = 'TUTF021'
const psw = 'P@ssw0rd!'
let contatto
//#endregion

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)
//#endregion


before(() => {
  LoginPage.logInMW(userName, psw)
  cy.task('nuovoContatto').then((object) => {
    contatto = object
    contatto.tipo = ""
    contatto.prefissoInt = ""
    contatto.prefisso = ""
    contatto.orario = ""
  })
})

beforeEach(() => {
  cy.preserveCookies()
})

after(() => {
  // TopBar.logOutMW()
})
//#endregion


let client
describe('Matrix Web - Aggiungi contatto ', function () {

  it.only('Aggiungi tipo: Fisso', function () {
    LandingRicerca.searchRandomClient(true, "PF", "E")
    LandingRicerca.clickRandomResult()
    SintesiCliente.retriveClientName().then(currentClient => {
      client = currentClient
    })
    DettaglioAnagrafica.clickTabDettaglioAnagrafica()
    DettaglioAnagrafica.clickSubTab('Contatti')
    SCUContatti.aggiungiFisso(contatto).then((contact)=>{
      contatto = contact
    })


  })


  
  it.only('Verifica telefono: Fisso', function () {

    HomePage.reloadMWHomePage()
      TopBar.search(client.name)
      LandingRicerca.clickClientName(client)
      DettaglioAnagrafica.clickTabDettaglioAnagrafica()
      DettaglioAnagrafica.clickSubTab('Contatti')
      DettaglioAnagrafica.checkContattiFisso(contatto)

  })

  it('Verifica Contatto inserito', function () {
    LandingRicerca.searchRandomClient(true, "PF", "E")
    LandingRicerca.clickRandomResult()
    SintesiCliente.retriveClientName().then(currentClientName => {
      Client = currentClientName
      cy.log(Client)
    })
    DettaglioAnagrafica.clickTabDettaglioAnagrafica()
    DettaglioAnagrafica.clickSubTab('Contatti')
    SCUContatti.aggiungiFisso(contatto)
    DettaglioAnagrafica.checkContattiFisso(contatto)
  })


  it('Aggiungi tipo: Cellulare', function () {
    LandingRicerca.searchRandomClient(true, "PF", "E")
    LandingRicerca.clickFirstResult()
    SintesiCliente.retriveClientName().then(currentClientName => {
      Client = currentClientName
      cy.log(Client)
    })
    DettaglioAnagrafica.clickTabDettaglioAnagrafica()
    DettaglioAnagrafica.clickSubTab('Contatti')
    SCUContatti.aggiungiCellulare().then(lista => {
      console.log(lista)
    })
    DettaglioAnagrafica.clickSubTab('Contatti')
  })

  it('Aggiungi tipo: Fax', function () {
    LandingRicerca.searchRandomClient(true, "PF", "E")
    LandingRicerca.clickFirstResult()
    SintesiCliente.retriveClientName().then(currentClientName => {
      Client = currentClientName
      cy.log(Client)
    })
    DettaglioAnagrafica.clickTabDettaglioAnagrafica()
    DettaglioAnagrafica.clickSubTab('Contatti')
    SCUContatti.aggiungiFax().then(lista => {
      console.log(lista)
    })
    DettaglioAnagrafica.clickSubTab('Contatti')
  })

  it('Aggiungi tipo: Email', function () {
    LandingRicerca.searchRandomClient(true, "PF", "E")
    LandingRicerca.clickFirstResult()
    SintesiCliente.retriveClientName().then(currentClientName => {
      Client = currentClientName
      cy.log(Client)
    })
    DettaglioAnagrafica.clickTabDettaglioAnagrafica()
    DettaglioAnagrafica.clickSubTab('Contatti')
    SCUContatti.aggiungiEmail().then(lista => {
      console.log(lista)
    })
    DettaglioAnagrafica.clickSubTab('Contatti')
  })

  it('Aggiungi tipo: Sito Web', function () {
    LandingRicerca.searchRandomClient(true, "PF", "E")
    LandingRicerca.clickFirstResult()
    SintesiCliente.retriveClientName().then(currentClientName => {
      Client = currentClientName
      cy.log(Client)
    })
    DettaglioAnagrafica.clickTabDettaglioAnagrafica()
    DettaglioAnagrafica.clickSubTab('Contatti')
    SCUContatti.aggiungiSitoWeb().then(lista => {
      console.log(lista)
    })
    DettaglioAnagrafica.clickSubTab('Contatti')
  })

  it('Aggiungi tipo: Numero Verde', function () {
    LandingRicerca.searchRandomClient(true, "PF", "E")
    LandingRicerca.clickFirstResult()
    SintesiCliente.retriveClientName().then(currentClientName => {
      Client = currentClientName
      cy.log(Client)
    })
    DettaglioAnagrafica.clickTabDettaglioAnagrafica()
    DettaglioAnagrafica.clickSubTab('Contatti')
    SCUContatti.aggiungiNumeroVerde().then(lista => {
      console.log(lista)
    })
    DettaglioAnagrafica.clickSubTab('Contatti')
  })

  it('Aggiungi tipo: Fax Verde', function () {
    LandingRicerca.searchRandomClient(true, "PF", "E")
    LandingRicerca.clickFirstResult()
    SintesiCliente.retriveClientName().then(currentClientName => {
      Client = currentClientName
      cy.log(Client)
    })
    DettaglioAnagrafica.clickTabDettaglioAnagrafica()
    DettaglioAnagrafica.clickSubTab('Contatti')
    SCUContatti.aggiungiFaxVerde().then(lista => {
      console.log(lista)
    })
    DettaglioAnagrafica.clickSubTab('Contatti')
  })

  it('Aggiungi tipo: Ufficio', function () {
    LandingRicerca.searchRandomClient(true, "PF", "E")
    LandingRicerca.clickFirstResult()
    SintesiCliente.retriveClientName().then(currentClientName => {
      Client = currentClientName
      cy.log(Client)
    })
    DettaglioAnagrafica.clickTabDettaglioAnagrafica()
    DettaglioAnagrafica.clickSubTab('Contatti')
    SCUContatti.aggiungiUfficio().then(lista => {
      console.log(lista)
    })
    DettaglioAnagrafica.clickSubTab('Contatti')
  })
  
  it('Aggiungi tipo: PEC', function () {
    LandingRicerca.searchRandomClient(true, "PF", "E")
    LandingRicerca.clickFirstResult()
    SintesiCliente.retriveClientName().then(currentClientName => {
      Client = currentClientName
      cy.log(Client)
    })
    DettaglioAnagrafica.clickTabDettaglioAnagrafica()
    DettaglioAnagrafica.clickSubTab('Contatti')
    SCUContatti.aggiungiPEC().then(lista => {
      console.log(lista)
    })
    DettaglioAnagrafica.clickSubTab('Contatti')
  })

})