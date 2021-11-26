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
let notExist = ''
if (Cypress.env('isAviva'))
    notExist = 'ASSENTE '
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

after(function() {
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
}, function() {

    it('Verifica Ricerca Da Switch Page', function() {
        LandingRicerca.checkBucaRicercaSuggerrimenti()
    })

    it('Verifica Ricerca Da Landing Clients', function() {
        TopBar.clickClients()
        LandingRicerca.checkBucaRicercaSuggerrimenti()
    })

    it('Verifica Ricerca Da Landing Sales', function() {
        TopBar.clickSales()
        LandingRicerca.checkBucaRicercaSuggerrimenti()
        TopBar.clickMatrixHome()
    })

    it('Verifica Ricerca Da Landing Numbers', function() {
        TopBar.clickNumbers()
        LandingRicerca.checkBucaRicercaSuggerrimenti()
        TopBar.clickMatrixHome()
    })

    if (!Cypress.env('isAviva')) {
        it(notExist + 'Verifica Ricerca Da Landing News', function() {
            TopBar.clickNews()
            LandingRicerca.checkBucaRicercaSuggerrimenti()
            TopBar.clickMatrixHome()
        })

        it(notExist + 'Verifica Ricerca Da Landing Le mie info', function() {
            TopBar.clickMieInfo()
            LandingRicerca.checkBucaRicercaSuggerrimenti()
            TopBar.clickMatrixHome()
        })
    }

    it('Verifica Ricerca Da Landing BackOffice', function() {
        TopBar.clickBackOffice()
        LandingRicerca.checkBucaRicercaSuggerrimenti()
        TopBar.clickMatrixHome()
    })

})

if (Cypress.env('isAviva')) {
    describe('Matrix Ricerca - AVIVA', {
        retries: {
            runMode: 1,
            openMode: 0,
        }
    }, function() {


        it(notExist + 'Verifica Ricerca Da Landing News', function() {
            TopBar.checkNotExistLanding('News')
        })

        it(notExist + 'Verifica Ricerca Da Landing Le mie info', function() {
            TopBar.checkNotExistLanding('Le mie info')
        })


    })
}