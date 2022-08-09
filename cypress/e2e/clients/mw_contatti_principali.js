/**
* @author Andrea 'Bobo' Oboe <andrea.oboe@allianz.it>
*/

/// <reference types="Cypress" />

//#region import
import TopBar from "../../mw_page_objects/common/TopBar"
import SCUContatti from "../../mw_page_objects/clients/SCUContatti"
import SintesiCliente from "../../mw_page_objects/clients/SintesiCliente"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import LandingRicerca from "../../mw_page_objects/ricerca/LandingRicerca"
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

let contatto
let cliente

//#region Support
/**
 * 
 * @param {string} contactType : tipo di contatto a scelta tra 'numero' e 'mail'
 */
const searchClientWithoutContattiPrincipali = (contactType) => {
    LandingRicerca.searchRandomClient(true, "PF", (Cypress.env('isAviva') || Cypress.env('isAvivaBroker')) ? "E" : "P")
    LandingRicerca.clickRandomResult("PF", (Cypress.env('isAviva') || Cypress.env('isAvivaBroker')) ? "E" : "P")
    SintesiCliente.checkContattoPrincipale(contactType).then(contactIsPresent => {
        if (!contactIsPresent)
            return
        else
            searchClientWithoutContattiPrincipali(contactType)

    })
}
//#endregion

//#region Before After
before(() => {
    cy.task("cleanScreenshotLog", Cypress.spec.name).then((folderToDelete) => {
        cy.log(folderToDelete + ' rimossa!')
        cy.getUserWinLogin().then(data => {
            cy.startMysql(dbConfig, testName, currentEnv, data).then((id) => insertedId = id)
            LoginPage.logInMWAdvanced()
        })
        cy.task('nuovoContatto').then((object) => {
            contatto = object
        })
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

let urlClient
describe('Matrix Web : Clients Numero e Mail Principali', {
    retries: {
        runMode: 0,
        openMode: 0,
    }
}, () => {
    it('Cerca Cliente senza Numero Principale', () => {
        searchClientWithoutContattiPrincipali('numero')
    })

    it('Aggiungi Numero Principale', () => {
        SintesiCliente.retriveClientNameAndAddress().then(currentClient => {
            cliente = currentClient
        })

        SintesiCliente.retriveUrl().then(currentUrl => {
            urlClient = currentUrl
        })

        SintesiCliente.aggiungiContattoPrincipale('numero')
        SCUContatti.aggiungiNuovoTelefonoPrincipale(contatto)
    })

    it('Verifica Numero Principale inserito', () => {
        TopBar.search(cliente.name)
        LandingRicerca.filtra('PF')
        LandingRicerca.clickClientePF(cliente.name)
        SintesiCliente.checkAtterraggioSintesiCliente(cliente.name)
        SintesiCliente.checkContattoPrincipale('numero').then(contactIsPresent => {
            if (!contactIsPresent)
                assert.fail('Numero Principale NON inserito correttamente')
        })
    })
    it('Cerca Cliente senza Mail Principale', () => {
        searchClientWithoutContattiPrincipali('mail')
    })

    it('Aggiungi Mail Principale', () => {
        SintesiCliente.retriveClientNameAndAddress().then(currentClient => {
            cliente = currentClient
        })
        SintesiCliente.retriveUrl().then(currentUrl => {
            urlClient = currentUrl
        })

        SintesiCliente.aggiungiContattoPrincipale('mail')
        SCUContatti.aggiungiNuovaMailPrincipale(contatto)
    })

    it('Verifica Mail Principale inserita', () => {
        TopBar.search(cliente.name)
        LandingRicerca.filtra('PF')
        LandingRicerca.clickClientePF(cliente.name)
        SintesiCliente.checkAtterraggioSintesiCliente(cliente.name)
        SintesiCliente.checkContattoPrincipale('mail').then(contactIsPresent => {
            if (!contactIsPresent)
                assert.fail('Mail Principale NON inserita correttamente')
        })
    })
})