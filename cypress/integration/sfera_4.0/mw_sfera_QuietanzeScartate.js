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
const testName = Cypress.spec.name.split('/')[1].split('.')[0].toUpperCase()
const currentEnv = Cypress.env('currentEnv')
const dbConfig = Cypress.env('db')
let insertedId

//#region global variabled
let options = {
    retries: {
        runMode: 0,
        openMode: 0,
    }
}
//#endregion

let dataInizio = Common.setDate(1, 2, false)
let dataFine = Common.setDate()

//#region Before After
before(() => {
    cy.task("cleanScreenshotLog", Cypress.spec.name).then((folderToDelete) => {
        cy.log(folderToDelete + ' rimossa!')
        cy.getUserWinLogin().then(data => {
            cy.startMysql(dbConfig, testName, currentEnv, data).then((id) => insertedId = id)
        })
    })
    let customImpersonification = {
        "agentId": "ARDEMILI1",
        "agency": "010712000"
    }
    LoginPage.logInMWAdvanced(customImpersonification)
    Sfera.accediSferaDaHomePageMW(true)
    Sfera.selezionaVistaSuggerita(Sfera.VISTESUGGERITE.QUIETANZE_SCARTATE)
    Sfera.checkVistaExist(Sfera.VISTESUGGERITE.QUIETANZE_SCARTATE)
    Sfera.espandiPannello()
    Sfera.setDateEstrazione(false, dataInizio)
    Sfera.estrai(false)
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

describe('Matrix Web : Sfera 4.0 - Operatività - vista Quietanze Scartate', function () {

    it('Verifica caricamento dati', function () {
        Sfera.espandiPannello()
        Sfera.estrai(false)
    })

    it('Verifica Vista Quietanze Scartate', function () {
        Sfera.selezionaVistaSuggerita(Sfera.VISTESUGGERITE.QUIETANZE_SCARTATE)
        Sfera.checkVistaExist(Sfera.VISTESUGGERITE.QUIETANZE_SCARTATE)
    })

    it('Verifica LoB', function () {
        Sfera.checkLob(Sfera.PORTAFOGLI.MOTOR)
        Sfera.checkNotExistLob(Sfera.PORTAFOGLI.RAMI_VARI)
        Sfera.checkNotExistLob(Sfera.PORTAFOGLI.VITA)
    })

    it('Verifica Colonne corrette in tabella', function () {
        Sfera.espandiPannello()
        Sfera.estrai(false)
        Sfera.checkAllColonnePresenti(Sfera.COLUMNQUIETANZESCARTATE)
    })

    it('Verifica Colonne in tabella: Tooltip', function () {
        Sfera.checkTooltipHeadersColonne(Sfera.COLUMNQUIETANZESCARTATE)
    })

    it('Colonne in tabella: Report excel', function () {
        Sfera.espandiPannello()
        Sfera.setDateEstrazione(false, dataInizio)
        Sfera.estrai(false)
        Sfera.selectRighe(Sfera.SELEZIONARIGHE.PAGINA_CORRENTE)
        Sfera.estrazioneReportExcel(Sfera.COLUMNQUIETANZESCARTATE)
    })

    //! DA AGGIUNGERE SU TFS
    it('Verifica Ripetitore dati', function () {
        Sfera.checkExistRipetitoreDati(Sfera.VISTESUGGERITE.QUIETANZE_SCARTATE, dataInizio, dataFine)
    })
})