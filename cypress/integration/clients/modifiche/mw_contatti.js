/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 */

/// <reference types="Cypress" />

import LoginPage from "../../../mw_page_objects/common/LoginPage"
import LandingRicerca from "../../../mw_page_objects/ricerca/LandingRicerca"
import SintesiCliente from "../../../mw_page_objects/clients/SintesiCliente"
import DettaglioAnagrafica from "../../../mw_page_objects/clients/DettaglioAnagrafica"
import SCUContatti from "../../../mw_page_objects/clients/SCUContatti"
import HomePage from "../../../mw_page_objects/common/HomePage"
import TopBar from "../../../mw_page_objects/common/TopBar"


//#region Variables
const userName = 'le00080'
const psw = 'Giugno2021$'
let contatto
//#endregion

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)
//#endregion
5372570165

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
describe('Matrix Web : Creazione Contatto', function () {

  context('Telefono Fisso', () => {

    it('Verifica l\'operazione di inserimento - tipo: Fisso', function () {
      LandingRicerca.searchRandomClient(true, "PF", "E")
      LandingRicerca.clickRandomResult()
      SintesiCliente.retriveClientNameAndAddress().then(currentClient => {
        client = currentClient
      })
      DettaglioAnagrafica.clickTabDettaglioAnagrafica()
      DettaglioAnagrafica.clickSubTab('Contatti')
      SCUContatti.aggiungiContattoFisso(contatto).then((contact) => {
        contatto = contact
      })
    })

    it('Verifica telefono Fisso sia inserito nella tabella', function () {
      HomePage.reloadMWHomePage()
      TopBar.search(client.name)
      LandingRicerca.clickClientName(client)
      DettaglioAnagrafica.clickTabDettaglioAnagrafica()
      DettaglioAnagrafica.clickSubTab('Contatti')
      DettaglioAnagrafica.checkContatti(contatto)
    })

    it('Verifica la modifica: Fisso ', function () {
      SCUContatti.modificaContatti(contatto).then(contact =>{
        contatto = contact
      })
      HomePage.reloadMWHomePage()
      TopBar.search(client.name)
      LandingRicerca.clickClientName(client)
      DettaglioAnagrafica.clickTabDettaglioAnagrafica()
      DettaglioAnagrafica.clickSubTab('Contatti')
      DettaglioAnagrafica.checkContatti(contatto)
    })
  })

  context('Telefono Cellulare', () => {
    it('Verifica l\'operazione di inserimento - tipo: Cellulare', function () {
      LandingRicerca.searchRandomClient(true, "PF", "E")
      LandingRicerca.clickRandomResult()
      SintesiCliente.retriveClientNameAndAddress().then(currentClient => {
        client = currentClient
      })
      DettaglioAnagrafica.clickTabDettaglioAnagrafica()
      DettaglioAnagrafica.clickSubTab('Contatti')
      SCUContatti.aggiungiContattoCellulare(contatto).then((contact) => {
        contatto = contact
      })
    })

    it('Verifica telefono Cellulare sia inserito nella tabella', function () {
      HomePage.reloadMWHomePage()
      TopBar.search(client.name)
      LandingRicerca.clickClientName(client)
      DettaglioAnagrafica.clickTabDettaglioAnagrafica()
      DettaglioAnagrafica.clickSubTab('Contatti')
      DettaglioAnagrafica.checkContatti(contatto)
    })

    it('Verifica la modifica: Cellulare ', function () {
      SCUContatti.modificaContatti(contatto).then(contact =>{
        contatto = contact
      })
      HomePage.reloadMWHomePage()
      TopBar.search(client.name)
      LandingRicerca.clickClientName(client)
      DettaglioAnagrafica.clickTabDettaglioAnagrafica()
      DettaglioAnagrafica.clickSubTab('Contatti')
      DettaglioAnagrafica.checkContatti(contatto)
    })
  })

  context('Fax', () => {
    it('Verifica l\'operazione di inserimento - tipo: Fax', function () {
      LandingRicerca.searchRandomClient(true, "PF", "E")
      LandingRicerca.clickRandomResult()
      SintesiCliente.retriveClientNameAndAddress().then(currentClient => {
        client = currentClient
      })
      DettaglioAnagrafica.clickTabDettaglioAnagrafica()
      DettaglioAnagrafica.clickSubTab('Contatti')
      SCUContatti.aggiungiContattoFax(contatto).then((contact) => {
        contatto = contact
      })
    })

    it('Verifica telefono Fisso sia inserito nella tabella', function () {
      HomePage.reloadMWHomePage()
      TopBar.search(client.name)
      LandingRicerca.clickClientName(client)
      DettaglioAnagrafica.clickTabDettaglioAnagrafica()
      DettaglioAnagrafica.clickSubTab('Contatti')
      DettaglioAnagrafica.checkContatti(contatto)
    })

    it('Verifica la modifica: Fax ', function () {
      SCUContatti.modificaContatti(contatto).then(contact =>{
        contatto = contact
      })
      HomePage.reloadMWHomePage()
      TopBar.search(client.name)
      LandingRicerca.clickClientName(client)
      DettaglioAnagrafica.clickTabDettaglioAnagrafica()
      DettaglioAnagrafica.clickSubTab('Contatti')
      DettaglioAnagrafica.checkContatti(contatto)
    })
  })
  
  context.only('Email', () => {
    it('Verifica l\'operazione di inserimento - tipo: Email', function () {
      LandingRicerca.searchRandomClient(true, "PF", "E")
      LandingRicerca.clickRandomResult()
      SintesiCliente.retriveClientNameAndAddress().then(currentClient => {
        client = currentClient
      })
      DettaglioAnagrafica.clickTabDettaglioAnagrafica()
      DettaglioAnagrafica.clickSubTab('Contatti')
      SCUContatti.aggiungiContattoEmail(contatto).then((contact) => {
        contatto = contact
      })
    })

    it('Verifica Email sia inserito nella tabella', function () {
      HomePage.reloadMWHomePage()
      TopBar.search(client.name)
      LandingRicerca.clickClientName(client)
      DettaglioAnagrafica.clickTabDettaglioAnagrafica()
      DettaglioAnagrafica.clickSubTab('Contatti')
      DettaglioAnagrafica.checkContatti(contatto)
    })

    it('Verifica la modifica: Email ', function () {
      SCUContatti.modificaContatti(contatto).then(contact =>{
        contatto = contact
      })
      HomePage.reloadMWHomePage()
      TopBar.search(client.name)
      LandingRicerca.clickClientName(client)
      DettaglioAnagrafica.clickTabDettaglioAnagrafica()
      DettaglioAnagrafica.clickSubTab('Contatti')
      DettaglioAnagrafica.checkContatti(contatto)
    })
  })

  context('Sito Web', () => {
    it('Verifica l\'operazione di inserimento - tipo: Sito Web', function () {
      LandingRicerca.searchRandomClient(true, "PF", "E")
      LandingRicerca.clickRandomResult()
      SintesiCliente.retriveClientNameAndAddress().then(currentClient => {
        client = currentClient
      })
      DettaglioAnagrafica.clickTabDettaglioAnagrafica()
      DettaglioAnagrafica.clickSubTab('Contatti')
      SCUContatti.aggiungiContattoSitoWeb(contatto).then((contact) => {
        contatto = contact
      })
    })

    it('Verifica Sito Web sia inserito nella tabella', function () {
      HomePage.reloadMWHomePage()
      TopBar.search(client.name)
      LandingRicerca.clickClientName(client)
      DettaglioAnagrafica.clickTabDettaglioAnagrafica()
      DettaglioAnagrafica.clickSubTab('Contatti')
      DettaglioAnagrafica.checkContatti(contatto)
    })

    it('Verifica la modifica: Sito Web ', function () {
      SCUContatti.modificaContatti(contatto).then(contact =>{
        contatto = contact
      })
      HomePage.reloadMWHomePage()
      TopBar.search(client.name)
      LandingRicerca.clickClientName(client)
      DettaglioAnagrafica.clickTabDettaglioAnagrafica()
      DettaglioAnagrafica.clickSubTab('Contatti')
      DettaglioAnagrafica.checkContatti(contatto)
    })
  })

  context('Numero Verde', () => {
    it('Verifica l\'operazione di inserimento - tipo: Numero Verde', function () {
      LandingRicerca.searchRandomClient(true, "PF", "E")
      LandingRicerca.clickRandomResult()
      SintesiCliente.retriveClientNameAndAddress().then(currentClient => {
        client = currentClient
      })
      DettaglioAnagrafica.clickTabDettaglioAnagrafica()
      DettaglioAnagrafica.clickSubTab('Contatti')
      SCUContatti.aggiungiContattoNumeroVerde(contatto).then((contact) => {
        contatto = contact
      })
    })

    it('Verifica Numero Verde sia inserito nella tabella', function () {
      HomePage.reloadMWHomePage()
      TopBar.search(client.name)
      LandingRicerca.clickClientName(client)
      DettaglioAnagrafica.clickTabDettaglioAnagrafica()
      DettaglioAnagrafica.clickSubTab('Contatti')
      DettaglioAnagrafica.checkContatti(contatto)
    })
    it('Verifica la modifica: Numero Verde ', function () {
      SCUContatti.modificaContatti(contatto).then(contact =>{
        contatto = contact
      })
      HomePage.reloadMWHomePage()
      TopBar.search(client.name)
      LandingRicerca.clickClientName(client)
      DettaglioAnagrafica.clickTabDettaglioAnagrafica()
      DettaglioAnagrafica.clickSubTab('Contatti')
      DettaglioAnagrafica.checkContatti(contatto)
    })
  })

  context('Fax Verde', () => {
    it('Verifica l\'operazione di inserimento - tipo: Fax Verde', function () {
      LandingRicerca.searchRandomClient(true, "PF", "E")
      LandingRicerca.clickRandomResult()
      SintesiCliente.retriveClientNameAndAddress().then(currentClient => {
        client = currentClient
      })
      DettaglioAnagrafica.clickTabDettaglioAnagrafica()
      DettaglioAnagrafica.clickSubTab('Contatti')
      SCUContatti.aggiungiContattoFaxVerde(contatto).then((contact) => {
        contatto = contact
      })
    })

    it('Verifica Fax Verde sia inserito nella tabella', function () {
      HomePage.reloadMWHomePage()
      TopBar.search(client.name)
      LandingRicerca.clickClientName(client)
      DettaglioAnagrafica.clickTabDettaglioAnagrafica()
      DettaglioAnagrafica.clickSubTab('Contatti')
      DettaglioAnagrafica.checkContatti(contatto)
    })

    it('Verifica la modifica: Fax Verde ', function () {
      SCUContatti.modificaContatti(contatto).then(contact =>{
        contatto = contact
      })
      HomePage.reloadMWHomePage()
      TopBar.search(client.name)
      LandingRicerca.clickClientName(client)
      DettaglioAnagrafica.clickTabDettaglioAnagrafica()
      DettaglioAnagrafica.clickSubTab('Contatti')
      DettaglioAnagrafica.checkContatti(contatto)
    })
  })

  context('Ufficio', () => {
    it('Verifica l\'operazione di inserimento - tipo: Ufficio', function () {
      LandingRicerca.searchRandomClient(true, "PF", "E")
      LandingRicerca.clickRandomResult()
      SintesiCliente.retriveClientNameAndAddress().then(currentClient => {
        client = currentClient
      })
      DettaglioAnagrafica.clickTabDettaglioAnagrafica()
      DettaglioAnagrafica.clickSubTab('Contatti')
      SCUContatti.aggiungiContattoUfficio(contatto).then((contact) => {
        contatto = contact
      })
    })

    it('Verifica Ufficio sia inserito nella tabella', function () {
      HomePage.reloadMWHomePage()
      TopBar.search(client.name)
      LandingRicerca.clickClientName(client)
      DettaglioAnagrafica.clickTabDettaglioAnagrafica()
      DettaglioAnagrafica.clickSubTab('Contatti')
      DettaglioAnagrafica.checkContatti(contatto)
    })

    it('Verifica la modifica: Ufficio ', function () {
      SCUContatti.modificaContatti(contatto).then(contact =>{
        contatto = contact
      })
      HomePage.reloadMWHomePage()
      TopBar.search(client.name)
      LandingRicerca.clickClientName(client)
      DettaglioAnagrafica.clickTabDettaglioAnagrafica()
      DettaglioAnagrafica.clickSubTab('Contatti')
      DettaglioAnagrafica.checkContatti(contatto)
    })
  })

  context('PEC', () => {
    it('Verifica l\'operazione di inserimento - tipo: PEC', function () {
      LandingRicerca.searchRandomClient(true, "PF", "E")
      LandingRicerca.clickRandomResult()
      SintesiCliente.retriveClientNameAndAddress().then(currentClient => {
        client = currentClient
      })
      DettaglioAnagrafica.clickTabDettaglioAnagrafica()
      DettaglioAnagrafica.clickSubTab('Contatti')
      SCUContatti.aggiungiContattoPEC(contatto).then((contact) => {
        contatto = contact
      })
    })

    it('Verifica PEC sia inserito nella tabella', function () {
      HomePage.reloadMWHomePage()
      TopBar.search(client.name)
      LandingRicerca.clickClientName(client)
      DettaglioAnagrafica.clickTabDettaglioAnagrafica()
      DettaglioAnagrafica.clickSubTab('Contatti')
      DettaglioAnagrafica.checkContatti(contatto)
    })

    it('Verifica la modifica: PEC ', function () {
      SCUContatti.modificaContatti(contatto).then(contact =>{
        contatto = contact
      })
      HomePage.reloadMWHomePage()
      TopBar.search(client.name)
      LandingRicerca.clickClientName(client)
      DettaglioAnagrafica.clickTabDettaglioAnagrafica()
      DettaglioAnagrafica.clickSubTab('Contatti')
      DettaglioAnagrafica.checkContatti(contatto)
    })
  })
})