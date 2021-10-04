/**
* @author Andrea 'Bobo' Oboe <andrea.oboe@allianz.it>
* @description Verifica delle Convenzioni da Clients (su AG che non puo' emetterle e su AG che puo' emetterle)
*/

/// <reference types="Cypress" />

//#region import
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import SintesiCliente from "../../mw_page_objects/clients/SintesiCliente"
import DettaglioAnagrafica from "../../mw_page_objects/clients/DettaglioAnagrafica"
import LandingRicerca from "../../mw_page_objects/ricerca/LandingRicerca"
import Legami from "../../mw_page_objects/clients/Legami"
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

//#region Before After
before(() => {
    cy.getUserWinLogin().then(data => {
        cy.task('startMysql', { dbConfig: dbConfig, testCaseName: testName, currentEnv: currentEnv, currentUser: data.tutf }).then((results) => {
            insertedId = results.insertId
        })

        let customImpersonification = {
            "agentId": "ARFPULINI2",
            "agency": "010710000"
        }
        LoginPage.logInMWAdvanced(customImpersonification)
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
            cy.task('finishMysql', { dbConfig: dbConfig, rowId: insertedId, tests })
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
        cy.task('finishMysql', { dbConfig: dbConfig, rowId: insertedId, tests })
    })
    //#endregion
})
//#endregion Before After

let retrivedClient
let retrivedPartyRelations
describe('Matrix Web : Convenzioni', {
    retries: {
        runMode: 0,
        openMode: 0,
    }
}, () => {

    it('Come delegato accedere all\'agenzia 01-710000 e cercare un cliente PG e verificare in Dettaglio Anagrafica la presenza del Tab Convenzioni', () => {
        LandingRicerca.searchRandomClient(true, 'PG', 'P')
        LandingRicerca.clickRandomResult()
        SintesiCliente.retriveClientNameAndAddress().then(currentClient => {
            currentClientPG = currentClient
        })

        DettaglioAnagrafica.clickTabDettaglioAnagrafica()
        DettaglioAnagrafica.clickSubTab('Convenzioni')
    })

    it('Cliccare su Aggiungi Nuovo e Verificare che : \n' +
        '- compaia il messaggio "Nessuna convenzione disponibile"\n' +
        '- non venga creata alcuna convenzione', () => {
            DettaglioAnagrafica.clickAggiungiConvenzione(false)
        });
})