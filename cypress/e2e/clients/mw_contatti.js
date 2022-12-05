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
const testName = Cypress.spec.name.split('.')[0].toUpperCase()
const currentEnv = Cypress.env('currentEnv')
const dbConfig = Cypress.env('db')
let insertedId
//#endregion

let contatto

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)

//#endregion
let client
let urlClient
before(() => {
    cy.getUserWinLogin().then(data => {
        cy.startMysql(dbConfig, testName, currentEnv, data).then((id) => insertedId = id)
        LoginPage.logInMWAdvanced()
        let fileAgency
        if (!Cypress.env('monoUtenza') && !Cypress.env('isAviva') && !Cypress.env('isAvivaBroker'))
            fileAgency = 'agencies'
        else if (!Cypress.env('isAvivaBroker'))
            fileAgency = 'agenciesAviva'
        else
            fileAgency = 'agenciesAvivaBroker'

        cy.fixture(fileAgency).then(agenciesFromFixture => {
            var currentAgency = agenciesFromFixture.shift()
            console.log(fileAgency)
            cy.log('Perform impersonification on ' + currentAgency.agency)
            cy.impersonification(data.tutf, currentAgency.agentId, currentAgency.agency)
            cy.getClientWithoutConsentAgreements(data.tutf, 'PF', currentAgency).then((currentClient) => {
                client = currentClient
                TopBar.search(client.socialSecurityNumber)
                LandingRicerca.filtra()
                SintesiCliente.wait()
            })
        })
        SintesiCliente.retriveClientNameAndAddress().then(currentClient => {
            client = currentClient
        })
        SintesiCliente.retriveUrl().then(currentUrl => {
            urlClient = currentUrl
        })
        DettaglioAnagrafica.clickTabDettaglioAnagrafica()
        DettaglioAnagrafica.clickSubTab('Contatti')
        DettaglioAnagrafica.removeAllContatti()

        cy.task('nuovoContatto').then((object) => {
            contatto = object
            contatto.tipo = ""
            contatto.prefissoInt = ""
            contatto.prefisso = ""
            contatto.orario = ""
        })
    })
})

beforeEach(() => {
    cy.preserveCookies()
    cy.ignoreRequest()
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
//#endregion


describe('Matrix Web : Creazione Contatto', function () {
    it('Verifica l\'operazione di inserimento - tipo: Fisso', function () {
        SCUContatti.aggiungiContattoFisso(contatto).then((contact) => {
            contatto = contact
        })
    })

    it('Verifica telefono Fisso sia inserito nella tabella', function () {
        TopBar.search(client.socialSecurityNumber)
        LandingRicerca.filtra()
        LandingRicerca.clickFirstResult()
        DettaglioAnagrafica.clickTabDettaglioAnagrafica()
        DettaglioAnagrafica.clickSubTab('Contatti')
        DettaglioAnagrafica.checkContatti(contatto)
    })

    it('Verifica la modifica: Fisso ', function () {
        SCUContatti.modificaContatti(contatto).then(contact => {
            contatto = contact
        })
        TopBar.search(client.socialSecurityNumber)
        LandingRicerca.filtra()
        LandingRicerca.clickFirstResult()
        DettaglioAnagrafica.clickTabDettaglioAnagrafica()
        DettaglioAnagrafica.clickSubTab('Contatti')
        DettaglioAnagrafica.checkContatti(contatto)
    })

    it('Verifica l\'eliminazione del Fisso', function () {
        SCUContatti.eliminaContatto(contatto)
    })

    it('Verifica l\'operazione di inserimento - tipo: Cellulare', function () {

        SCUContatti.aggiungiContattoCellulare(contatto).then((contact) => {
            contatto = contact
        })
    })

    it('Verifica telefono Cellulare sia inserito nella tabella', function () {
        TopBar.search(client.socialSecurityNumber)
        LandingRicerca.filtra()
        LandingRicerca.clickFirstResult()
        DettaglioAnagrafica.clickTabDettaglioAnagrafica()
        DettaglioAnagrafica.clickSubTab('Contatti')
        DettaglioAnagrafica.checkContatti(contatto)
    })

    it('Verifica la modifica: Cellulare ', function () {
        SCUContatti.modificaContatti(contatto).then(contact => {
            contatto = contact
        })
        TopBar.search(client.socialSecurityNumber)
        LandingRicerca.filtra()
        LandingRicerca.clickFirstResult()
        DettaglioAnagrafica.clickTabDettaglioAnagrafica()
        DettaglioAnagrafica.clickSubTab('Contatti')
        DettaglioAnagrafica.checkContatti(contatto)
    })

    it('Verifica l\'eliminazione del Cellulare', function () {
        SCUContatti.eliminaContatto(contatto)
    })

    it('Verifica l\'operazione di inserimento - tipo: Fax', function () {

        SCUContatti.aggiungiContattoFax(contatto).then((contact) => {
            contatto = contact
        })
    })

    it('Verifica Fax sia inserito nella tabella', function () {
        TopBar.search(client.socialSecurityNumber)
        LandingRicerca.filtra()
        LandingRicerca.clickFirstResult()
        DettaglioAnagrafica.clickTabDettaglioAnagrafica()
        DettaglioAnagrafica.clickSubTab('Contatti')
        DettaglioAnagrafica.checkContatti(contatto)
    })

    it('Verifica la modifica: Fax ', function () {
        SCUContatti.modificaContatti(contatto).then(contact => {
            contatto = contact
        })
        TopBar.search(client.socialSecurityNumber)
        LandingRicerca.filtra()
        LandingRicerca.clickFirstResult()
        DettaglioAnagrafica.clickTabDettaglioAnagrafica()
        DettaglioAnagrafica.clickSubTab('Contatti')
        DettaglioAnagrafica.checkContatti(contatto)
    })
    it('Verifica l\'eliminazione del Fax', function () {
        SCUContatti.eliminaContatto(contatto)
    })

    it('Verifica l\'operazione di inserimento - tipo: Email', function () {

        SCUContatti.aggiungiContattoEmail(contatto).then((contact) => {
            contatto = contact
        })
    })

    it('Verifica Email sia inserito nella tabella', function () {
        TopBar.search(client.socialSecurityNumber)
        LandingRicerca.filtra()
        LandingRicerca.clickFirstResult()
        DettaglioAnagrafica.clickTabDettaglioAnagrafica()
        DettaglioAnagrafica.clickSubTab('Contatti')
        DettaglioAnagrafica.checkContatti(contatto)
    })

    it('Verifica la modifica: Email ', function () {
        SCUContatti.modificaContatti(contatto).then(contact => {
            contatto = contact
        })
        TopBar.search(client.socialSecurityNumber)
        LandingRicerca.filtra()
        LandingRicerca.clickFirstResult()
        DettaglioAnagrafica.clickTabDettaglioAnagrafica()
        DettaglioAnagrafica.clickSubTab('Contatti')
        DettaglioAnagrafica.checkContatti(contatto)
    })

    it('Verifica l\'eliminazione del Email', function () {
        SCUContatti.eliminaContatto(contatto)
    })

    it('Verifica l\'operazione di inserimento - tipo: Sito Web', function () {

        SCUContatti.aggiungiContattoSitoWeb(contatto).then((contact) => {
            contatto = contact
        })
    })

    it('Verifica Sito Web sia inserito nella tabella', function () {
        TopBar.search(client.socialSecurityNumber)
        LandingRicerca.filtra()
        LandingRicerca.clickFirstResult()
        DettaglioAnagrafica.clickTabDettaglioAnagrafica()
        DettaglioAnagrafica.clickSubTab('Contatti')
        DettaglioAnagrafica.checkContatti(contatto)
    })

    it('Verifica la modifica: Sito Web ', function () {
        SCUContatti.modificaContatti(contatto).then(contact => {
            contatto = contact
        })
        TopBar.search(client.socialSecurityNumber)
        LandingRicerca.filtra()
        LandingRicerca.clickFirstResult()
        DettaglioAnagrafica.clickTabDettaglioAnagrafica()
        DettaglioAnagrafica.clickSubTab('Contatti')
        DettaglioAnagrafica.checkContatti(contatto)
    })

    it('Verifica l\'eliminazione del Sito Web', function () {
        SCUContatti.eliminaContatto(contatto)
    })

    it('Verifica l\'operazione di inserimento - tipo: Numero Verde', function () {
        SCUContatti.aggiungiContattoNumeroVerde(contatto).then((contact) => {
            contatto = contact
        })
    })

    it('Verifica Numero Verde sia inserito nella tabella', function () {
        TopBar.search(client.socialSecurityNumber)
        LandingRicerca.filtra()
        LandingRicerca.clickFirstResult()
        DettaglioAnagrafica.clickTabDettaglioAnagrafica()
        DettaglioAnagrafica.clickSubTab('Contatti')
        DettaglioAnagrafica.checkContatti(contatto)
    })

    it('Verifica la modifica: Numero Verde ', function () {
        SCUContatti.modificaContatti(contatto).then(contact => {
            contatto = contact
        })
        TopBar.search(client.socialSecurityNumber)
        LandingRicerca.filtra()
        LandingRicerca.clickFirstResult()
        DettaglioAnagrafica.clickTabDettaglioAnagrafica()
        DettaglioAnagrafica.clickSubTab('Contatti')
        DettaglioAnagrafica.checkContatti(contatto)
    })

    it('Verifica l\'eliminazione del Numero Verde', function () {
        SCUContatti.eliminaContatto(contatto)
    })

    it('Verifica l\'operazione di inserimento - tipo: Fax Verde', function () {

        SCUContatti.aggiungiContattoFaxVerde(contatto).then((contact) => {
            contatto = contact
        })
    })

    it('Verifica Fax Verde sia inserito nella tabella', function () {
        TopBar.search(client.socialSecurityNumber)
        LandingRicerca.filtra()
        LandingRicerca.clickFirstResult()
        DettaglioAnagrafica.clickTabDettaglioAnagrafica()
        DettaglioAnagrafica.clickSubTab('Contatti')
        DettaglioAnagrafica.checkContatti(contatto)
    })

    it('Verifica la modifica: Fax Verde ', function () {
        SCUContatti.modificaContatti(contatto).then(contact => {
            contatto = contact
        })
        TopBar.search(client.socialSecurityNumber)
        LandingRicerca.filtra()
        LandingRicerca.clickFirstResult()
        DettaglioAnagrafica.clickTabDettaglioAnagrafica()
        DettaglioAnagrafica.clickSubTab('Contatti')
        DettaglioAnagrafica.checkContatti(contatto)
    })

    it('Verifica l\'eliminazione del Fax Verde', function () {
        SCUContatti.eliminaContatto(contatto)
    })

    it('Verifica l\'operazione di inserimento - tipo: Ufficio', function () {

        SCUContatti.aggiungiContattoUfficio(contatto).then((contact) => {
            contatto = contact
        })
    })

    it('Verifica Ufficio sia inserito nella tabella', function () {
        TopBar.search(client.socialSecurityNumber)
        LandingRicerca.filtra()
        LandingRicerca.clickFirstResult()
        DettaglioAnagrafica.clickTabDettaglioAnagrafica()
        DettaglioAnagrafica.clickSubTab('Contatti')
        DettaglioAnagrafica.checkContatti(contatto)
    })

    it('Verifica la modifica: Ufficio ', function () {
        SCUContatti.modificaContatti(contatto).then(contact => {
            contatto = contact
        })
        TopBar.search(client.socialSecurityNumber)
        LandingRicerca.filtra()
        LandingRicerca.clickFirstResult()
        DettaglioAnagrafica.clickTabDettaglioAnagrafica()
        DettaglioAnagrafica.clickSubTab('Contatti')
        DettaglioAnagrafica.checkContatti(contatto)
    })

    it('Verifica l\'eliminazione dell\'Ufficio', function () {
        SCUContatti.eliminaContatto(contatto)
    })

    it('Verifica l\'operazione di inserimento - tipo: PEC', function () {
        SCUContatti.aggiungiContattoPEC(contatto).then((contact) => {
            contatto = contact
        })
    })

    it('Verifica PEC sia inserito nella tabella', function () {
        TopBar.search(client.socialSecurityNumber)
        LandingRicerca.filtra()
        LandingRicerca.clickFirstResult()
        DettaglioAnagrafica.clickTabDettaglioAnagrafica()
        DettaglioAnagrafica.clickSubTab('Contatti')
        DettaglioAnagrafica.checkContatti(contatto)
    })

    it('Verifica la modifica: PEC ', function () {
        SCUContatti.modificaContatti(contatto).then(contact => {
            contatto = contact
        })
        TopBar.search(client.socialSecurityNumber)
        LandingRicerca.filtra()
        LandingRicerca.clickFirstResult()
        DettaglioAnagrafica.clickTabDettaglioAnagrafica()
        DettaglioAnagrafica.clickSubTab('Contatti')
        DettaglioAnagrafica.checkContatti(contatto)
    })

    it('Verifica l\'eliminazione della PEC', function () {
        SCUContatti.eliminaContatto(contatto)
    })
})