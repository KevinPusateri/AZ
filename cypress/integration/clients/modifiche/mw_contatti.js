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
describe('Matrix Web - Aggiungi contatto ', function () {

  context('Contatto - Telefono Fisso', () => {

    it('Aggiungi Contatto tipo: Fisso', function () {
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

    it('Verifica telefono Fisso sia stato inserito', function () {
      HomePage.reloadMWHomePage()
      TopBar.search(client.name)
      LandingRicerca.clickClientName(client)
      DettaglioAnagrafica.clickTabDettaglioAnagrafica()
      DettaglioAnagrafica.clickSubTab('Contatti')
      DettaglioAnagrafica.checkContatti(contatto)
    })

    it('Verifica la modifica: Fisso ', function () {
      DettaglioAnagrafica.checkModificaContatti(contatto)
    })
  })

  context('Contatto - Telefono Cellulare', () => {
    it('Aggiungi Contatto tipo: Cellulare', function () {
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

    it('Verifica telefono Cellulare sia stato inserito', function () {
      HomePage.reloadMWHomePage()
      TopBar.search(client.name)
      LandingRicerca.clickClientName(client)
      DettaglioAnagrafica.clickTabDettaglioAnagrafica()
      DettaglioAnagrafica.clickSubTab('Contatti')
      DettaglioAnagrafica.checkContatti(contatto)
    })
  })

  context('Contatto - Fax', () => {
    it('Aggiungi Contatto tipo: Fax', function () {
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

    it('Verifica Fax sia stato inserito', function () {
      HomePage.reloadMWHomePage()
      TopBar.search(client.name)
      LandingRicerca.clickClientName(client)
      DettaglioAnagrafica.clickTabDettaglioAnagrafica()
      DettaglioAnagrafica.clickSubTab('Contatti')
      DettaglioAnagrafica.checkContatti(contatto)
    })
  })
  
  context('Contatto - Email', () => {
    it('Aggiungi Contatto tipo: Email', function () {
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

    it('Verifica Email sia stato inserito', function () {
      HomePage.reloadMWHomePage()
      TopBar.search(client.name)
      LandingRicerca.clickClientName(client)
      DettaglioAnagrafica.clickTabDettaglioAnagrafica()
      DettaglioAnagrafica.clickSubTab('Contatti')
      DettaglioAnagrafica.checkContatti(contatto)
    })
  })

  context('Contatto - Sito Web', () => {
    it('Aggiungi Contatto tipo: Sito Web', function () {
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

    it('Verifica Sito Web sia stato inserito', function () {
      HomePage.reloadMWHomePage()
      TopBar.search(client.name)
      LandingRicerca.clickClientName(client)
      DettaglioAnagrafica.clickTabDettaglioAnagrafica()
      DettaglioAnagrafica.clickSubTab('Contatti')
      DettaglioAnagrafica.checkContatti(contatto)
    })
  })

  context('Contatto - Numero Verde', () => {
    it('Aggiungi Contatto tipo: Numero Verde', function () {
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

    it('Verifica Numero Verde sia stato inserito', function () {
      HomePage.reloadMWHomePage()
      TopBar.search(client.name)
      LandingRicerca.clickClientName(client)
      DettaglioAnagrafica.clickTabDettaglioAnagrafica()
      DettaglioAnagrafica.clickSubTab('Contatti')
      DettaglioAnagrafica.checkContatti(contatto)
    })
  })

  context('Contatto - Fax Verde', () => {
    it('Aggiungi Contatto tipo: Fax Verde', function () {
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

    it('Verifica Fax Verde sia stato inserito', function () {
      HomePage.reloadMWHomePage()
      TopBar.search(client.name)
      LandingRicerca.clickClientName(client)
      DettaglioAnagrafica.clickTabDettaglioAnagrafica()
      DettaglioAnagrafica.clickSubTab('Contatti')
      DettaglioAnagrafica.checkContatti(contatto)
    })
  })

  context('Contatto - Ufficio', () => {
    it('Aggiungi Contatto tipo: Ufficio', function () {
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

    it('Verifica Ufficio sia stato inserito', function () {
      HomePage.reloadMWHomePage()
      TopBar.search(client.name)
      LandingRicerca.clickClientName(client)
      DettaglioAnagrafica.clickTabDettaglioAnagrafica()
      DettaglioAnagrafica.clickSubTab('Contatti')
      DettaglioAnagrafica.checkContatti(contatto)
    })
  })

  context('Contatto - PEC', () => {
    it('Aggiungi Contatto tipo: PEC', function () {
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

    it('Verifica PEC sia stato inserito', function () {
      HomePage.reloadMWHomePage()
      TopBar.search(client.name)
      LandingRicerca.clickClientName(client)
      DettaglioAnagrafica.clickTabDettaglioAnagrafica()
      DettaglioAnagrafica.clickSubTab('Contatti')
      DettaglioAnagrafica.checkContatti(contatto)
    })
  })
})