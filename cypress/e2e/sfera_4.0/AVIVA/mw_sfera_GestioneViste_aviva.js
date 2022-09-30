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

var selectedRiga

//#region Before After
before(() => {
    Cypress.env('isAviva',true)
    cy.task("cleanScreenshotLog", Cypress.spec.name).then((folderToDelete) => {
        cy.log(folderToDelete + ' rimossa!')
        cy.getUserWinLogin().then(data => {
            cy.startMysql(dbConfig, testName, currentEnv, data).then((id) => insertedId = id)
        })
    })
    LoginPage.logInMWAdvanced()
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

describe('Matrix Web : Sfera 4.0 - AVIVA - Gestione Viste - Revisione gestione denominazione', function () {


    it('Step 1 - Verifica caricamento Dati', function () {
        Sfera.accediSferaDaHomePageMW(true)
    })

    it('Step 2 - Verifica caricamento estrazione', function () {
        Sfera.estrai(true)
    })

    it('Step 3 - Verifica creazione vista', function () {
        Sfera.gestisciColonne(['Cod. AZPay'])
        Sfera.checkColonnaPresente('Cod. AZPay')
    })

    it('Step 4 - Verifica salvataggio vista', function () {
        Sfera.salvaVistaPersonalizzata('vista personalizzata')
        Sfera.selezionaVista('vista personalizzata')
        Sfera.espandiPannello()
        Sfera.estrai()
    })

    it('Step 5 - Verifica vista post salvataggio', function () {
        Sfera.checkVistaExist('vista personalizzata')
        Sfera.checkColonnaPresente('Cod. AZPay')
        Sfera.eliminaVista('vista personalizzata')
    })

})
