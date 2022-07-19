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

let currentProfiling
before(() => {
    cy.getUserWinLogin().then(data => {
        cy.startMysql(dbConfig, testName, currentEnv, data).then((id) => insertedId = id)
        LoginPage.logInMWAdvanced()
        cy.getProfiling(data.tutf).then(profiling => currentProfiling = profiling)
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

describe('Buca di Ricerca - Risultati Le mie Info', {
    retries: {
        runMode: 1,
        openMode: 1,
    }
}, function () {

    it('Verifica Ricerca Incasso', function () {
        LandingRicerca.search('incasso')
        if (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker')) {
            LandingRicerca.clickTabMieInfo()
            LandingRicerca.checkSubTabMieInfo()
        } else
            LandingRicerca.checkNotExistMieInfo()
        LandingRicerca.checkSuggestedLinks('incasso')


    })

    it('Verifica Ricerca Fastquote', function () {
        LandingRicerca.search('fastquote')
        if (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker')) {
            LandingRicerca.clickTabMieInfo()
            LandingRicerca.checkSubTabMieInfo()
            LandingRicerca.checkSuggestedLinks('fastquote')
        } else {
            LandingRicerca.checkNotExistMieInfo()
            LandingRicerca.checkNotExistSuggestLinks('fastquote')
        }
    })

    it('Verifica Ricerca Prodotto: BMP', function () {
        cy.filterProfile(currentProfiling, 'COMMON_ULTRA_BMP').then(profiled => {
            if (profiled) {
                LandingRicerca.search('bmp')
                if (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker')) {
                    LandingRicerca.clickTabMieInfo()
                    LandingRicerca.checkSubTabMieInfo()
                } else
                    LandingRicerca.checkNotExistMieInfo()
                LandingRicerca.checkSuggestedLinks('bmp')
            }
            else
                this.skip()
        })
    })

    it('Verifica Ricerca Prodotto: Ultra', function () {
        LandingRicerca.search('ultra')
        if (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker')) {
            LandingRicerca.clickTabMieInfo()
            LandingRicerca.checkSubTabMieInfo()
        } else
            LandingRicerca.checkNotExistMieInfo()
        LandingRicerca.checkSuggestedLinks('ultra')
    })
})