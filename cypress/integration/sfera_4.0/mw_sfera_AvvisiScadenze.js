
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
let options = {
    retries: {
        runMode: 0,
        openMode: 0,
    }
}
let today = Common.setDate(undefined, undefined, false)
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
            Sfera.accediSferaDaHomePageMW(true)
        })
    })
})

beforeEach(() => {
    cy.preserveCookies()
})

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

describe('Matrix Web : Sfera 4.0 - Avvisi Scadenze', function () {

    //#239

    //#240

    it('Verifica invio avviso SMS sfera 4.0', function () {
        Sfera.selezionaVistaSuggerita(Sfera.VISTESUGGERITE.AVVISI_SCADENZA)
        Sfera.estrai()
        Sfera.filtraSuColonna(Sfera.FILTRI.ULT_TIPO_INVIO, Sfera.FILTRI.ULT_TIPO_INVIO.values.VUOTO)
        Sfera.filtraSuColonna(Sfera.FILTRI.ULT_RICH_AVVISO_CPP, today)
        Sfera.checkAvvisoInviato(Sfera.TIPOAVVISO.SMS)
        // Sfera.clickInviaAvviso(Sfera.TIPOAVVISO.SMS)
        // Sfera.espandiPannello()
        // Sfera.estrai()
        // Sfera.selezionaRigaIndex(riga)
        // Sfera.checkExistUltTipoInvio('@selectRiga')
    })

})