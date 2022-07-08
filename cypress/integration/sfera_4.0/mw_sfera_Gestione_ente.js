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

describe('Matrix Web : Sfera 4.0 - Gestione Ente', function () {

    it('Gestione ente NON presente su age HUB SENZA age CP 73', function () {
        let customImpersonification = {
            "agentId": "ARFBOSIO",
            "agency": "010119000"
        }
        LoginPage.logInMWAdvanced(customImpersonification)
        Sfera.accediSferaDaHomePageMW(true)
        Sfera.checkVistaSuggeriteNotExistByMenu(Sfera.VISTESUGGERITE.GESTIONE_ENTE)
        TopBar.logOutMW()
        cy.wait(5000)
    })

    it('Verifica Gestione ente presente su age HUB CON age CP 73', function () {
        let customImpersonification = {
            "agentId": "ARFPULINI2",
            "agency": "010710000"
        }
        LoginPage.logInMWAdvanced(customImpersonification)
        Sfera.accediSferaDaHomePageMW(true)
        Sfera.selezionaVistaSuggerita(Sfera.VISTESUGGERITE.GESTIONE_ENTE)
    })

    it('Verifica Parametri di default associati alla vista', function () {
        Sfera.checkAgenzieSabbiate('552 - FRASCATI FC GROUP')
        Sfera.checkLob(Sfera.PORTAFOGLI.MOTOR)
        Sfera.checkLob(Sfera.PORTAFOGLI.RAMI_VARI)
        Sfera.checkLob(Sfera.PORTAFOGLI.VITA)
        Sfera.checkDateModifiedOneMonthLater(dataInizio)
        Sfera.checkTipoQuietanzeCheckedDefault(Sfera.VISTESUGGERITE.GESTIONE_ENTE)
        Sfera.checkClusterAllUnchecked()
    })

    it('Verifica Colonna ente di genarazione avvisi', function () {
        Sfera.estrai()
        Sfera.checkColonnaPresente(Sfera.COLUMNGESTIONEENTE.ENTE_GEN_AVV.key)
    })

    it('Verifica Colonna ente di generazione avvisi_report', function () {
        Sfera.selectRighe(Sfera.SELEZIONARIGHE.PAGINA_CORRENTE)
        Sfera.estrazioneReportExcel(Sfera.COLUMNGESTIONEENTE)
        Sfera.selectRighe(Sfera.SELEZIONARIGHE.PAGINA_CORRENTE)
    })

    it('Verifica Azioni veloci tre puntini', function () {
        Sfera.selezionaRigaRandom()
        Sfera.selezionaRigaRandom()
        Sfera.checkTrePuntiniLink('Gestione ente')
    })

    it('Verifica Colonne in tabella: Tooltip', function () {
        Sfera.checkTooltipHeadersColonne(Sfera.COLUMNGESTIONEENTE)
    })

    it('Verifica filtro calendario t+2 mesi', function () {
        Sfera.espandiPannello()
        let dataInizio = Common.setDate(undefined, 1, false)
        Sfera.setDateInizio(dataInizio)
        Sfera.checkCalendarNextOnlyTwoMonth(Sfera.COLUMNGESTIONEENTE)
    })

    it('Verifica sezioni decadi', function () {
        Sfera.estrai()
        Sfera.checkSezioniDecadi()
    })

    it('Verifica sezioni decadi -> Tooltip', function () {
        Sfera.checkTooltipSezioniDecadi()
    })

    it('Verifica aggiornamento decadi cambiando periodo', function () {
        Sfera.espandiPannello()
        Sfera.checkVaraziazioneDecadiByCalendar()
    })

    it('Verifica colonna decade in tabella', function () {
        Sfera.checkColonnaPresente(Sfera.COLUMNGESTIONEENTE.DEC.key)
    })

    it('Verifica colonna decade -> Tooltip', function () {
        Sfera.checkTooltipSingleColumn(Sfera.COLUMNGESTIONEENTE.DEC)
    })
})