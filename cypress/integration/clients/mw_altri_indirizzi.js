/**
* @author Kevin Pusateri <kevin.pusateri@allianz.it>
*/

/// <reference types="Cypress" />

//#region import
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import LandingRicerca from "../../mw_page_objects/ricerca/LandingRicerca"
import SintesiCliente from "../../mw_page_objects/clients/SintesiCliente"
import SCUAltriIndirizzi from "../../mw_page_objects/clients/SCUAltriIndirizzi"
import DettaglioAnagrafica from "../../mw_page_objects/clients/DettaglioAnagrafica"
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
var indirizzo = {
    toponimo: "",
    numero: "1",
    address: "TORINO",
    comune: "TRIESTE",
    ruolo: "",
    cap: "34123"
}

//#region Before After
before(() => {
    cy.getUserWinLogin().then(data => {
        cy.startMysql(dbConfig, testName, currentEnv, data)
        LoginPage.logInMWAdvanced()
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
describe('Matrix Web : Creazione Indirizzo', function () {

    it('Verifica l\'operazione di inserimento Indirizzo', function () {
        LandingRicerca.searchRandomClient(true, "PF", "E")
        LandingRicerca.clickRandomResult()
        SintesiCliente.retriveClientNameAndAddress().then(currentClient => {
            client = currentClient
        })
        SintesiCliente.retriveUrl().then(currentUrl => {
            urlClient = currentUrl
        })
        DettaglioAnagrafica.clickTabDettaglioAnagrafica()
        DettaglioAnagrafica.clickSubTab('Altri indirizzi')
        SCUAltriIndirizzi.aggiungiInidirizzo(indirizzo).then((address) => {
            indirizzo = address
        })
    })

    it('Verifica Indirizzo sia inserito nella tabella', function () {
        SintesiCliente.visitUrlClient(urlClient)
        DettaglioAnagrafica.clickTabDettaglioAnagrafica()
        DettaglioAnagrafica.clickSubTab('Altri indirizzi')
        SCUAltriIndirizzi.checkAltriIndirizzi(indirizzo)

    })


    it('Verifica la modifica Indirizzo ', function () {
        SCUAltriIndirizzi.modificaIndirizzo(indirizzo).then(address => {
            indirizzo = address
        })
        SintesiCliente.visitUrlClient(urlClient)
        DettaglioAnagrafica.clickTabDettaglioAnagrafica()
        DettaglioAnagrafica.clickSubTab('Altri indirizzi')
        SCUAltriIndirizzi.checkAltriIndirizzi(indirizzo)
    })


    it('Verifica Elimina Indirizzo ', function () {
        SCUAltriIndirizzi.eliminaIndirizzo(indirizzo)
    })
})
