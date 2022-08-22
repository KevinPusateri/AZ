/**
 * @author Andrea 'Bobo' Oboe <andrea.oboe@allianz.it>
*/

/// <reference types="Cypress" />

//#region import
import Common from "../../mw_page_objects/common/Common"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import Sales from "../../mw_page_objects/Navigation/Sales"
import CampagneCommerciali from "../../mw_page_objects/cm/CampagneCommerciali"
//#endregion import

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)
//#endregion

//#region Mysql DB Variables
const testName = Cypress.spec.name.split('.')[0].toUpperCase()
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
            LoginPage.logInMWAdvanced()
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

    it('Accesso a Campagne Commerciali da Sales', function () {
        TopBar.clickSales()
        Sales.clickLinkRapido('Campagne Commerciali')
        Common.visitUrlOnEnv()
    })

    it('Accesso a Campagne Commerciali da Buca di Ricerca', function () {
        TopBar.searchAndClickSuggestedNavigations('Campagne Commerciali')
        CampagneCommerciali.verificaAccessoCampagneCommerciali()
    })

    it('Visualizzazione Monitoraggio Campagne (Verifica Stato Campagne Attive)', function () {
        CampagneCommerciali.statoCampagneAttive()
    })

    it('Visualizzazione Monitoraggio Campagne (Controlla i Risultati delle Vendite)', function () {
        CampagneCommerciali.risultatiDelleVendite()
    })

    it('Filtri - Campagne Disponibili', function () {
        Common.visitUrlOnEnv()
        TopBar.searchAndClickSuggestedNavigations('Campagne Commerciali')
        CampagneCommerciali.verificaAccessoCampagneCommerciali()

        CampagneCommerciali.verificaPresenzaFiltri().then(isFiltri => {
            if (!isFiltri)
                this.skip()
        })
    })

    it('Campagne Attive', function () {
        CampagneCommerciali.campagneAttive().then(isCampagneAttivePresent => {
            if (!isCampagneAttivePresent)
                this.skip()
        })
    })

    it('Campagne in Arrivo', function () {
        CampagneCommerciali.campagneInArrivo().then(isCampagneArrivoPresent => {
            if (!isCampagneArrivoPresent)
                this.skip()
        })
    })

    it('Suggerimento Campagna', function () {
        CampagneCommerciali.suggerimentoCampagna()
    })

    it('Campagne Nuove', function () {
        CampagneCommerciali.campagneNuove().then(isCampagneNuovePresent => {
            if (!isCampagneNuovePresent)
                this.skip()
        })
    })
})