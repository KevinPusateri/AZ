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
if (!Cypress.env('monoUtenza')) { //! Skippiamo tutti i test se monoUtenza è attiva 
    before(() => {
        cy.getUserWinLogin().then(data => {
            cy.startMysql(dbConfig, testName, currentEnv, data).then((id)=> insertedId = id )

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
}
//#endregion Before After

describe('Matrix Web : Convenzioni', {
    retries: {
        runMode: 0,
        openMode: 0,
    }
}, () => {
    it('Come delegato accedere all\'agenzia 01-710000 e cercare un cliente PG e verificare in Dettaglio Anagrafica la presenza del Tab Convenzioni', function () {
        if (!Cypress.env('monoUtenza')) {

            LandingRicerca.searchRandomClient(true, 'PG', 'P')
            LandingRicerca.clickRandomResult()

            DettaglioAnagrafica.clickTabDettaglioAnagrafica()
            DettaglioAnagrafica.clickSubTab('Convenzioni')
        } else this.skip()
    })

    it('Cliccare su Aggiungi Nuovo e Verificare che : \n' +
        '- compaia il messaggio "Nessuna convenzione disponibile"\n' +
        '- non venga creata alcuna convenzione', function () {
            if (!Cypress.env('monoUtenza')) {
                DettaglioAnagrafica.clickAggiungiConvenzione(false)
            } else this.skip()
        });
})