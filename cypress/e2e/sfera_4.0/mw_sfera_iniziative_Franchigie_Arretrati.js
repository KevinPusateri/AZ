/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
*/

/// <reference types="Cypress" />

//#region import
import Sales from "../../mw_page_objects/navigation/Sales"
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

let dataInizio = Common.setDate(undefined, undefined, false)
let dataFine = Common.setDate(undefined, 1, true)

//#region Before After
before(() => {
    cy.task("cleanScreenshotLog", Cypress.spec.name).then((folderToDelete) => {
        cy.log(folderToDelete + ' rimossa!')
        cy.getUserWinLogin().then(data => {
            cy.startMysql(dbConfig, testName, currentEnv, data).then((id) => insertedId = id)
        })
    })
    let customImpersonification = {
        "agentId": "ARALONGO7",
        "agency": "010375000"
    }
    LoginPage.logInMWAdvanced(customImpersonification)
    TopBar.clickSales()
})

beforeEach(() => {
    cy.preserveCookies()
})

// afterEach(function () {
//     if (this.currentTest.state !== 'passed') {
//         TopBar.logOutMW()
//         //#region Mysql
//         cy.getTestsInfos(this.test.parent.suites[0].tests).then(testsInfo => {
//             let tests = testsInfo
//             cy.finishMysql(dbConfig, insertedId, tests)
//         })
//         //#endregion
//         Cypress.runner.stop();
//     }
// })

// after(function () {
//     TopBar.logOutMW()
//     //#region Mysql
//     cy.getTestsInfos(this.test.parent.suites[0].tests).then(testsInfo => {
//         let tests = testsInfo
//         cy.finishMysql(dbConfig, insertedId, tests)
//     })
//     //#endregion
// })
//#endregion Before After

describe('Matrix Web : Sfera 4.0 - Franchigie ed Arretrati', function () {

    it('Step 1 - Verifica la "Data Al" deve avere come massimo estraibile \n' +
        ' il fine mese successivo (es: oggi è il 26/07 posso estarre al massimo fino al 31/08)\n' +
        '_verifica caricamento dati MONITORAGGIO ARRETRATI', function () {
            Sales.clickOperativita()
            Sfera.clickVistaOperativita(Sfera.OPERATIVITA.MONITORAGGIO_ARRETRATI)
            Sfera.checkVistaOperativitaExist(Sfera.OPERATIVITA.MONITORAGGIO_ARRETRATI)
        })

    it('Step 2 - seleziona data AL', function () {
        Sfera.selezionaDataFine()
    })

    it('Step 3 - verifica selezione data Al monitoraggio arretrati', function () {
        Sfera.checkDateArretrati()
    })

    it('Step 4 - verifica selezione data Al monitoraggio arretrati Estrazione', function () {
        Sfera.estrai(false)
    })
    
    
})