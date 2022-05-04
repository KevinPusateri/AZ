
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
let options = {
    retries: {
        runMode: 0,
        openMode: 0,
    }
}
//#endregion

//#region Mysql DB Variables
const testName = Cypress.spec.name.split('/')[1].split('.')[0].toUpperCase()
const currentEnv = Cypress.env('currentEnv')
const dbConfig = Cypress.env('db')
let insertedId
//#endregion

//#region Before After
before(() => {
    cy.task("cleanScreenshotLog", Cypress.spec.name).then((folderToDelete) => {
        cy.log(folderToDelete + ' rimossa!')
        cy.getUserWinLogin().then(data => {
            cy.startMysql(dbConfig, testName, currentEnv, data).then((id) => insertedId = id)
            LoginPage.logInMWAdvanced()
            Sfera.accediSferaDaHomePageMW()
            // Sfera.setDateEstrazione()
            Sfera.estrai()
            Sfera.selectRandomContraente()
        })
    })
})

beforeEach(() => {
    cy.preserveCookies()
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

describe('Matrix Web : Sfera 4.0', options, function () {

    context(Sfera.TABSCHEDA.PANORAMICA, () => {

        it('Verifica Dati Complementari ' + Sfera.TABSCHEDA.PANORAMICA, options, function () {
            Sfera.checkDatiComplementari(Sfera.TABSCHEDA.PANORAMICA)
        })

        it('Verifica Ripetitore cliente griglia valore cliente', options, function () {
            Sfera.checkGrigliaValoreCliente()
        })

        it('Verifica Ripetitore cliente Polizze', options, function () {
            Sfera.checkPolizze()
        })
    });

    context(Sfera.TABSCHEDA.NOTE, () => {

        it('Verifica Dati Complementari ' + Sfera.TABSCHEDA.NOTE, options, function () {
            Sfera.checkDatiComplementari(Sfera.TABSCHEDA.NOTE)
        })
    })

    context(Sfera.TABSCHEDA.DETTAGLIO_PREMI, () => {
        it('Verifica Dati Complementari ' + Sfera.TABSCHEDA.DETTAGLIO_PREMI, options, function () {
            Sfera.checkDatiComplementari(Sfera.TABSCHEDA.DETTAGLIO_PREMI)
        })
    })

    context(Sfera.TABSCHEDA.INIZIATIVE, () => {

        it('Verifica Dati Complementari ' + Sfera.TABSCHEDA.INIZIATIVE, options, function () {
            Sfera.checkDatiComplementari(Sfera.TABSCHEDA.INIZIATIVE)
        })
    })

})