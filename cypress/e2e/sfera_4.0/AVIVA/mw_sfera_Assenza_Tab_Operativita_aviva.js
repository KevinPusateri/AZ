/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
*/

/// <reference types="Cypress" />

//#region import
import LoginPage from "../../../mw_page_objects/common/LoginPage"
import TopBar from "../../../mw_page_objects/common/TopBar"
import Sfera from "../../../mw_page_objects/sfera/Sfera"
//#endregion import

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)
//#endregion

//#region Mysql DB Variables
const testName = Cypress.spec.name.split('.')[0].toUpperCase()
const currentEnv = Cypress.env('currentEnv')
const dbConfig = Cypress.env('db')
let insertedId


//* STAMPA_QUIETANZE assente su AVIVA
Cypress.env('isAviva', true)
//* eliminato in quanto non contiene nessun dato
delete Sfera.VISTESUGGERITE.MENSILIZZATE
var viste = Object.values(Sfera.VISTESUGGERITE)

//#region Before After
before(() => {
    cy.task("cleanScreenshotLog", Cypress.spec.name).then((folderToDelete) => {
        cy.log(folderToDelete + ' rimossa!')
        cy.getUserWinLogin().then(data => {
            cy.startMysql(dbConfig, testName, currentEnv, data).then((id) => insertedId = id)
        })
    })
    let customImpersonification = {
        "agentId": "AAMCIPRIANO",
        "agency": "140001960"
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

describe('Matrix Web : Sfera 4.0 - Gestione Viste - Revisione gestione denominazione', function () {

    it('Step 1 - Verifica caricamento Dati', function () {
        Sfera.accediSferaDaHomePageMW(true)
    })

    it('Step 2 - Verifica assenza tab operatività', function () {
        Sfera.checkAssenzaTab('Operatività')
    })

    it('Step 3 - Verificare anche su altre viste', function () {
        for (let index = 0; index < viste.length; index++) {
            if (viste[index] !== Sfera.VISTESUGGERITE.VISTA_STANDARD) {
                Sfera.selezionaVistaSuggerita(viste[index])
                Sfera.checkAssenzaTab('Operatività')
            }
        }
        Sfera.selezionaVista(Sfera.VISTESUGGERITE.VISTA_STANDARD)
    })

    it('Step 4 - Verifica assenza tab operatività dopo estrazione', function () {
        for (let index = 0; index < viste.length; index++) {
            if (viste[index] !== Sfera.VISTESUGGERITE.VISTA_STANDARD) {
                Sfera.selezionaVistaSuggerita(viste[index])
                Sfera.estrai(false)
                Sfera.checkAssenzaTab('Operatività')
            }
        }
        Sfera.selezionaVista(Sfera.VISTESUGGERITE.VISTA_STANDARD)
    })


})