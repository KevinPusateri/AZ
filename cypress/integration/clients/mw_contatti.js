/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 */

/// <reference types="Cypress" />

import LoginPage from "../../mw_page_objects/common/LoginPage"
import LandingRicerca from "../../mw_page_objects/ricerca/LandingRicerca"
import SintesiCliente from "../../mw_page_objects/clients/SintesiCliente"
import DettaglioAnagrafica from "../../mw_page_objects/clients/DettaglioAnagrafica"
import SCUContatti from "../../mw_page_objects/clients/SCUContatti"
import HomePage from "../../mw_page_objects/common/HomePage"
import TopBar from "../../mw_page_objects/common/TopBar"

//#region Mysql DB Variables
const testName = Cypress.spec.name.split('/')[1].split('.')[0].toUpperCase()
const currentEnv = Cypress.env('currentEnv')
const dbConfig = Cypress.env('db')
let insertedId
    //#endregion

let contatto

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)

//#endregion

before(() => {
    cy.getUserWinLogin().then(data => {
        cy.startMysql(dbConfig, testName, currentEnv, data).then((id) => insertedId = id)
        LoginPage.logInMWAdvanced()
    })


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

after(function() {
        TopBar.logOutMW()
            //#region Mysql
        cy.getTestsInfos(this.test.parent.suites[0].tests).then(testsInfo => {
                let tests = testsInfo
                cy.finishMysql(dbConfig, insertedId, tests)
            })
            //#endregion

    })
    //#endregion


let client
let urlClient
describe('Matrix Web : Creazione Contatto', function() {
    it('Verifica l\'operazione di inserimento - tipo: Fisso', function() {
        LandingRicerca.searchRandomClient(true, "PF", "E")
        LandingRicerca.clickRandomResult('PF')
        SintesiCliente.retriveClientNameAndAddress().then(currentClient => {
            client = currentClient
        })
        SintesiCliente.retriveUrl().then(currentUrl => {
            urlClient = currentUrl
        })
        DettaglioAnagrafica.clickTabDettaglioAnagrafica()
        DettaglioAnagrafica.clickSubTab('Contatti')
        SCUContatti.aggiungiContattoFisso(contatto).then((contact) => {
            contatto = contact
        })
    })

    it('Verifica telefono Fisso sia inserito nella tabella', function() {
        TopBar.search(client.name)
        LandingRicerca.clickClientePF(client.name)
        DettaglioAnagrafica.clickTabDettaglioAnagrafica()
        DettaglioAnagrafica.clickSubTab('Contatti')
        DettaglioAnagrafica.checkContatti(contatto)
    })

    it('Verifica la modifica: Fisso ', function() {
        SCUContatti.modificaContatti(contatto).then(contact => {
            contatto = contact
        })
        TopBar.search(client.name)
        LandingRicerca.clickClientePF(client.name)
        DettaglioAnagrafica.clickTabDettaglioAnagrafica()
        DettaglioAnagrafica.clickSubTab('Contatti')
        DettaglioAnagrafica.checkContatti(contatto)
    })

    it('Verifica l\'eliminazione del Fisso', function() {
        SCUContatti.eliminaContatto(contatto)
    })

    it('Verifica l\'operazione di inserimento - tipo: Cellulare', function() {
        LandingRicerca.searchRandomClient(true, "PF", "E")
        LandingRicerca.clickRandomResult('PF')
        SintesiCliente.retriveClientNameAndAddress().then(currentClient => {
            client = currentClient
        })
        SintesiCliente.retriveUrl().then(currentUrl => {
            urlClient = currentUrl
        })
        DettaglioAnagrafica.clickTabDettaglioAnagrafica()
        DettaglioAnagrafica.clickSubTab('Contatti')
        SCUContatti.aggiungiContattoCellulare(contatto).then((contact) => {
            contatto = contact
        })
    })

    it('Verifica telefono Cellulare sia inserito nella tabella', function() {
        TopBar.search(client.name)
        LandingRicerca.clickClientePF(client.name)
        DettaglioAnagrafica.clickTabDettaglioAnagrafica()
        DettaglioAnagrafica.clickSubTab('Contatti')
        DettaglioAnagrafica.checkContatti(contatto)
    })

    it('Verifica la modifica: Cellulare ', function() {
        SCUContatti.modificaContatti(contatto).then(contact => {
            contatto = contact
        })
        TopBar.search(client.name)
        LandingRicerca.clickClientePF(client.name)
        DettaglioAnagrafica.clickTabDettaglioAnagrafica()
        DettaglioAnagrafica.clickSubTab('Contatti')
        DettaglioAnagrafica.checkContatti(contatto)
    })

    it('Verifica l\'eliminazione del Cellulare', function() {
        SCUContatti.eliminaContatto(contatto)
    })

    it('Verifica l\'operazione di inserimento - tipo: Fax', function() {
        LandingRicerca.searchRandomClient(true, "PF", "E")
        LandingRicerca.clickRandomResult('PF')
        SintesiCliente.retriveClientNameAndAddress().then(currentClient => {
            client = currentClient
        })
        SintesiCliente.retriveUrl().then(currentUrl => {
            urlClient = currentUrl
        })
        DettaglioAnagrafica.clickTabDettaglioAnagrafica()
        DettaglioAnagrafica.clickSubTab('Contatti')
        SCUContatti.aggiungiContattoFax(contatto).then((contact) => {
            contatto = contact
        })
    })

    it('Verifica Fax sia inserito nella tabella', function() {
        TopBar.search(client.name)
        LandingRicerca.clickClientePF(client.name)
        DettaglioAnagrafica.clickTabDettaglioAnagrafica()
        DettaglioAnagrafica.clickSubTab('Contatti')
        DettaglioAnagrafica.checkContatti(contatto)
    })

    it('Verifica la modifica: Fax ', function() {
        SCUContatti.modificaContatti(contatto).then(contact => {
            contatto = contact
        })
        TopBar.search(client.name)
        LandingRicerca.clickClientePF(client.name)
        DettaglioAnagrafica.clickTabDettaglioAnagrafica()
        DettaglioAnagrafica.clickSubTab('Contatti')
        DettaglioAnagrafica.checkContatti(contatto)
    })
    it('Verifica l\'eliminazione del Fax', function() {
        SCUContatti.eliminaContatto(contatto)
    })

    it('Verifica l\'operazione di inserimento - tipo: Email', function() {
        LandingRicerca.searchRandomClient(true, "PF", "E")
        LandingRicerca.clickRandomResult('PF')
        SintesiCliente.retriveClientNameAndAddress().then(currentClient => {
            client = currentClient
        })
        SintesiCliente.retriveUrl().then(currentUrl => {
            urlClient = currentUrl
        })
        DettaglioAnagrafica.clickTabDettaglioAnagrafica()
        DettaglioAnagrafica.clickSubTab('Contatti')
        SCUContatti.aggiungiContattoEmail(contatto).then((contact) => {
            contatto = contact
        })
    })

    it('Verifica Email sia inserito nella tabella', function() {
        TopBar.search(client.name)
        LandingRicerca.clickClientePF(client.name)


        DettaglioAnagrafica.clickTabDettaglioAnagrafica()
        DettaglioAnagrafica.clickSubTab('Contatti')
        DettaglioAnagrafica.checkContatti(contatto)
    })

    it('Verifica la modifica: Email ', function() {
        SCUContatti.modificaContatti(contatto).then(contact => {
            contatto = contact
        })
        TopBar.search(client.name)
        LandingRicerca.clickClientePF(client.name)


        DettaglioAnagrafica.clickTabDettaglioAnagrafica()
        DettaglioAnagrafica.clickSubTab('Contatti')
        DettaglioAnagrafica.checkContatti(contatto)
    })

    it('Verifica l\'eliminazione del Email', function() {
        SCUContatti.eliminaContatto(contatto)
    })

    it('Verifica l\'operazione di inserimento - tipo: Sito Web', function() {
        LandingRicerca.searchRandomClient(true, "PF", "E")
        LandingRicerca.clickRandomResult('PF')
        SintesiCliente.retriveClientNameAndAddress().then(currentClient => {
            client = currentClient
        })
        SintesiCliente.retriveUrl().then(currentUrl => {
            urlClient = currentUrl
        })
        DettaglioAnagrafica.clickTabDettaglioAnagrafica()
        DettaglioAnagrafica.clickSubTab('Contatti')
        SCUContatti.aggiungiContattoSitoWeb(contatto).then((contact) => {
            contatto = contact
        })
    })

    it('Verifica Sito Web sia inserito nella tabella', function() {
        TopBar.search(client.name)
        LandingRicerca.clickClientePF(client.name)


        DettaglioAnagrafica.clickTabDettaglioAnagrafica()
        DettaglioAnagrafica.clickSubTab('Contatti')
        DettaglioAnagrafica.checkContatti(contatto)
    })

    it('Verifica la modifica: Sito Web ', function() {
        SCUContatti.modificaContatti(contatto).then(contact => {
            contatto = contact
        })
        TopBar.search(client.name)
        LandingRicerca.clickClientePF(client.name)


        DettaglioAnagrafica.clickTabDettaglioAnagrafica()
        DettaglioAnagrafica.clickSubTab('Contatti')
        DettaglioAnagrafica.checkContatti(contatto)
    })

    it('Verifica l\'eliminazione del Sito Web', function() {
        SCUContatti.eliminaContatto(contatto)
    })

    it('Verifica l\'operazione di inserimento - tipo: Numero Verde', function() {
        LandingRicerca.searchRandomClient(true, "PF", "E")
        LandingRicerca.clickRandomResult('PF')
        SintesiCliente.retriveClientNameAndAddress().then(currentClient => {
            client = currentClient
        })
        SintesiCliente.retriveUrl().then(currentUrl => {
            urlClient = currentUrl
        })
        DettaglioAnagrafica.clickTabDettaglioAnagrafica()
        DettaglioAnagrafica.clickSubTab('Contatti')
        SCUContatti.aggiungiContattoNumeroVerde(contatto).then((contact) => {
            contatto = contact
        })
    })

    it('Verifica Numero Verde sia inserito nella tabella', function() {
        TopBar.search(client.name)
        LandingRicerca.clickClientePF(client.name)


        DettaglioAnagrafica.clickTabDettaglioAnagrafica()
        DettaglioAnagrafica.clickSubTab('Contatti')
        DettaglioAnagrafica.checkContatti(contatto)
    })

    it('Verifica la modifica: Numero Verde ', function() {
        SCUContatti.modificaContatti(contatto).then(contact => {
            contatto = contact
        })
        TopBar.search(client.name)
        LandingRicerca.clickClientePF(client.name)


        DettaglioAnagrafica.clickTabDettaglioAnagrafica()
        DettaglioAnagrafica.clickSubTab('Contatti')
        DettaglioAnagrafica.checkContatti(contatto)
    })

    it('Verifica l\'eliminazione del Numero Verde', function() {
        SCUContatti.eliminaContatto(contatto)
    })

    it('Verifica l\'operazione di inserimento - tipo: Fax Verde', function() {
        LandingRicerca.searchRandomClient(true, "PF", "E")
        LandingRicerca.clickRandomResult('PF')
        SintesiCliente.retriveClientNameAndAddress().then(currentClient => {
            client = currentClient
        })
        SintesiCliente.retriveUrl().then(currentUrl => {
            urlClient = currentUrl
        })
        DettaglioAnagrafica.clickTabDettaglioAnagrafica()
        DettaglioAnagrafica.clickSubTab('Contatti')
        SCUContatti.aggiungiContattoFaxVerde(contatto).then((contact) => {
            contatto = contact
        })
    })

    it('Verifica Fax Verde sia inserito nella tabella', function() {
        TopBar.search(client.name)
        LandingRicerca.clickClientePF(client.name)


        DettaglioAnagrafica.clickTabDettaglioAnagrafica()
        DettaglioAnagrafica.clickSubTab('Contatti')
        DettaglioAnagrafica.checkContatti(contatto)
    })

    it('Verifica la modifica: Fax Verde ', function() {
        SCUContatti.modificaContatti(contatto).then(contact => {
            contatto = contact
        })
        TopBar.search(client.name)
        LandingRicerca.clickClientePF(client.name)


        DettaglioAnagrafica.clickTabDettaglioAnagrafica()
        DettaglioAnagrafica.clickSubTab('Contatti')
        DettaglioAnagrafica.checkContatti(contatto)
    })

    it('Verifica l\'eliminazione del Fax Verde', function() {
        SCUContatti.eliminaContatto(contatto)
    })

    it('Verifica l\'operazione di inserimento - tipo: Ufficio', function() {
        LandingRicerca.searchRandomClient(true, "PF", "E")
        LandingRicerca.clickRandomResult('PF')
        SintesiCliente.retriveClientNameAndAddress().then(currentClient => {
            client = currentClient
        })
        SintesiCliente.retriveUrl().then(currentUrl => {
            urlClient = currentUrl
        })
        DettaglioAnagrafica.clickTabDettaglioAnagrafica()
        DettaglioAnagrafica.clickSubTab('Contatti')
        SCUContatti.aggiungiContattoUfficio(contatto).then((contact) => {
            contatto = contact
        })
    })

    it('Verifica Ufficio sia inserito nella tabella', function() {
        TopBar.search(client.name)
        LandingRicerca.clickClientePF(client.name)


        DettaglioAnagrafica.clickTabDettaglioAnagrafica()
        DettaglioAnagrafica.clickSubTab('Contatti')
        DettaglioAnagrafica.checkContatti(contatto)
    })

    it('Verifica la modifica: Ufficio ', function() {
        SCUContatti.modificaContatti(contatto).then(contact => {
            contatto = contact
        })
        TopBar.search(client.name)
        LandingRicerca.clickClientePF(client.name)


        DettaglioAnagrafica.clickTabDettaglioAnagrafica()
        DettaglioAnagrafica.clickSubTab('Contatti')
        DettaglioAnagrafica.checkContatti(contatto)
    })

    it('Verifica l\'eliminazione dell\'Ufficio', function() {
        SCUContatti.eliminaContatto(contatto)
    })

    it('Verifica l\'operazione di inserimento - tipo: PEC', function() {
        LandingRicerca.searchRandomClient(true, "PF", "E")
        LandingRicerca.clickRandomResult('PF')

        SintesiCliente.retriveClientNameAndAddress().then(currentClient => {
            client = currentClient
        })
        SintesiCliente.retriveUrl().then(currentUrl => {
            urlClient = currentUrl
        })
        DettaglioAnagrafica.clickTabDettaglioAnagrafica()
        DettaglioAnagrafica.clickSubTab('Contatti')
        SCUContatti.aggiungiContattoPEC(contatto).then((contact) => {
            contatto = contact
        })
    })

    it('Verifica PEC sia inserito nella tabella', function() {
        TopBar.search(client.name)
        LandingRicerca.clickClientePF(client.name)
        DettaglioAnagrafica.clickTabDettaglioAnagrafica()
        DettaglioAnagrafica.clickSubTab('Contatti')
        DettaglioAnagrafica.checkContatti(contatto)
    })

    it('Verifica la modifica: PEC ', function() {
        SCUContatti.modificaContatti(contatto).then(contact => {
            contatto = contact
        })
        TopBar.search(client.name)
        LandingRicerca.clickClientePF(client.name)
        DettaglioAnagrafica.clickTabDettaglioAnagrafica()
        DettaglioAnagrafica.clickSubTab('Contatti')
        DettaglioAnagrafica.checkContatti(contatto)
    })

    it('Verifica l\'eliminazione della PEC', function() {
        SCUContatti.eliminaContatto(contatto)
    })
})