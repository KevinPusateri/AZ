/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
*/

/// <reference types="Cypress" />

//#region import
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

var selectedRiga

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

describe('Matrix Web : Sfera 4.0 - Checkbox per selezione multipla e selezione singola riga per ripetitore', function () {


    it('Step 1 - Verifica caricamento Dati', function () {
        Sfera.accediSferaDaHomePageMW(true)
    })

    it('Step 2 - Verifica caricamento estrazione', function () {
        Sfera.estrai(true)
    })

    it('Step 3 - Verifica selezione riga su vista standard', function () {
        Sfera.selezionaRigaRandom()
        cy.get('@selectRiga').then((riga) => {
            selectedRiga = riga
        })
    })

    it('Step 4 - Verifica selezione riga vista standard evidenziata', function () {
        Sfera.checkRigaEvidenziata(selectedRiga)
    })

    it('Step 5 - Verifica selezione riga vista delta premio', function () {
        Sfera.selezionaVistaSuggerita(Sfera.VISTESUGGERITE.DELTA_PREMIO)
        Sfera.estrai(true)
    })

    it('Step 6 - Verifica selezione riga vista delta premio ripetitore', function () {
        Sfera.selezionaRigaRandom()
        Sfera.checkExistRipetitoreDati(Sfera.VISTESUGGERITE.DELTA_PREMIO)
    })
})
