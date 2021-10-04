/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
*/

/// <reference types="Cypress" />

//#region import
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import DettaglioAnagrafica from "../../mw_page_objects/clients/DettaglioAnagrafica"
import SintesiCliente from "../../mw_page_objects/clients/SintesiCliente"
import Legami from "../../mw_page_objects/clients/Legami"
//#endregion import

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)

//#endregion

//#region Username Variables
const psw = 'P@ssw0rd!'
//#endregion

//#region Mysql DB Variables
const testName = Cypress.spec.name.split('/')[1].split('.')[0].toUpperCase()
const currentEnv = Cypress.env('currentEnv')
const dbConfig = Cypress.env('db')
let insertedId
//#endregion

let currentClient = ''
var membro = ''

//#region Before After
before(() => {
    cy.getUserWinLogin().then(data => {
        cy.task('startMysql', { dbConfig: dbConfig, testCaseName: testName, currentEnv: currentEnv, currentUser: data.tutf }).then((results) => {
            insertedId = results.insertId
        })
        let customImpersonification = {
            "agentId": "ARGBERNARDI2",
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

describe('Matrix Web : Legami', function () {

    it('Verifica con fonte secondaria il non utilizzo dei legami', function () {
        if (!Cypress.env('monoUtenza')) {
            DettaglioAnagrafica.checkClientWithoutLegame()
            Legami.checkLegameIsNotPresent()
        } else this.skip()
    })
})