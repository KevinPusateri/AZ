/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 * @author Andrea 'Bobo' Oboe <andrea.oboe@allianz.it>
 */

/// <reference types="Cypress" />
import Common from "../../mw_page_objects/common/Common"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import LandingRicerca from "../../mw_page_objects/ricerca/LandingRicerca"

//#region Mysql DB Variables
const testName = Cypress.spec.name.split('/')[1].split('.')[0].toUpperCase()
const currentEnv = Cypress.env('currentEnv')
const dbConfig = Cypress.env('db')
let insertedId
//#endregion

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)

//#endregion

before(() => {
    cy.getUserWinLogin().then(data => {
        cy.startMysql(dbConfig, testName, currentEnv, data).then((id) => insertedId = id)
        LoginPage.logInMWAdvanced()
    })
})

beforeEach(() => {
    cy.preserveCookies()
    Common.visitUrlOnEnv()
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

describe('Matrix Ricerca', {
    retries: {
        runMode: 1,
        openMode: 0,
    }
}, function () {

    it('Verifica Ricerca Da Switch Page', function () {
        LandingRicerca.checkBucaRicercaSuggerrimenti()
    })

    it('Verifica Ricerca Da Landing Clients', function () {
        TopBar.clickClients()
        LandingRicerca.checkBucaRicercaSuggerrimenti()
    })

    it('Verifica Ricerca Da Landing Sales', function () {
        TopBar.clickSales()
        LandingRicerca.checkBucaRicercaSuggerrimenti()
        TopBar.clickMatrixHome()
    })

    it('Verifica Ricerca Da Landing Numbers', function () {
        TopBar.clickNumbers()
        LandingRicerca.checkBucaRicercaSuggerrimenti()
        TopBar.clickMatrixHome()
    })
    it('Verifica Ricerca Da Landing News e Info', function () {
        TopBar.clickNewsInfo()
        LandingRicerca.checkBucaRicercaSuggerrimenti()
        TopBar.clickMatrixHome()
    })

    it('Verifica Ricerca Da Landing BackOffice', function () {
        TopBar.clickBackOffice()
        LandingRicerca.checkBucaRicercaSuggerrimenti()
        TopBar.clickMatrixHome()
    })
})