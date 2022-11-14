/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
*/

/// <reference types="Cypress" />

//#region import
import Common from "../../mw_page_objects/common/Common"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import Sfera from "../../mw_page_objects/sfera/Sfera"
//#endregion import

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)
//#endregion

//#region Mysql DB Variables
const testName = Cypress.spec.name.split('.')[0].toUpperCase()
const currentEnv = Cypress.env('currentEnv')
const dbConfig = Cypress.env('db')
let insertedId

//#region global variabled
let dataInizio = Common.setDate(undefined, 1, true)

let options = {
    retries: {
        runMode: 0,
        openMode: 0,
    }
}
//#endregion


//#region Before After
before(() => {
    cy.task("cleanScreenshotLog", Cypress.spec.name).then((folderToDelete) => {
        cy.log(folderToDelete + ' rimossa!')
        cy.getUserWinLogin().then(data => {
            cy.startMysql(dbConfig, testName, currentEnv, data).then((id) => insertedId = id)
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

if (!Cypress.env('isSecondWindow'))
    describe('Matrix Web : Sfera 4.0 - Gestione Ente', function () {

        it('Gestione ente NON presente su age HUB SENZA age CP 73', function () {
            let customImpersonification = {
                "agentId": "ARFBOSIO",
                "agency": "010119000"
            }
            LoginPage.logInMWAdvanced(customImpersonification)
            Sfera.accediSferaDaHomePageMW(true)
            Sfera.checkVistaSuggeriteNotExistByMenu(Sfera.VISTESUGGERITE.GESTIONE_ENTE)
            cy.wait(5000)
        })


    })
else
    describe('Matrix Web : Sfera 4.0 -> Seconda Finestra', function () {
        it('Gestione ente NON presente su age HUB SENZA age CP 73', function () {
            //Gestione ente NON presente su age HUB SENZA age CP 73
            let customImpersonification = {
                "agentId": "ARFBOSIO",
                "agency": "010119000"
            }
            LoginPage.logInMWAdvanced(customImpersonification)
            Sfera.accediSferaDaHomePageMW(true)
            Sfera.checkVistaSuggeriteNotExistByMenu(Sfera.VISTESUGGERITE.GESTIONE_ENTE)
        })
    })