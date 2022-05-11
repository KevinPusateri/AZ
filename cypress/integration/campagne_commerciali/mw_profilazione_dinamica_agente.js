/**
 * @author Andrea 'Bobo' Oboe <andrea.oboe@allianz.it>
*/

/// <reference types="Cypress" />

//#region import
import Common from "../../mw_page_objects/common/Common"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import CampagneCommerciali from "../../mw_page_objects/cm/CampagneCommerciali"
import StrutturaAgenzia from "../../mw_page_objects/da/StrutturaAgenzia"
//#endregion import

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)
//#endregion

//#region Mysql DB Variables
const testName = Cypress.spec.name.split('/')[1].split('.')[0].toUpperCase()
const currentEnv = Cypress.env('currentEnv')
const dbConfig = Cypress.env('db')
let insertedId
let optionsRetrials = {
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
            let customImpersonification = {
                "agentId": "AREGASBARRI",
                "agency": "010710000"
            }
            LoginPage.logInMWAdvanced(customImpersonification)
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

describe('Matrix Web : Campagne Commerciali', optionsRetrials, function () {

    it('Profilazione Dinamica Agente (Salesman)', function () {

        TopBar.searchAndClickSuggestedNavigations('Struttura di agenzia')
        StrutturaAgenzia.verificaAccessoDBFonti()
        StrutturaAgenzia.clickVoceMenu(StrutturaAgenzia.VOCIMENU.GEST_ACCOUNTS)
        cy.pause()

        Common.visitUrlOnEnv()
        TopBar.searchAndClickSuggestedNavigations('Campagne Commerciali')
        CampagneCommerciali.verificaAccessoCampagneCommerciali()
    })

    it('Profilazione Dinamica Agente (Salesman) - Ripristino default', function () {

    })
})