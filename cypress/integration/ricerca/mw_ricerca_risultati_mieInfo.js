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
        cy.task('startMysql', { dbConfig: dbConfig, testCaseName: testName, currentEnv: currentEnv, currentUser: data.tutf }).then((results) => {
            insertedId = results.insertId
        })
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
        cy.task('finishMysql', { dbConfig: dbConfig, rowId: insertedId, tests })
    })
    //#endregion

})
describe('Buca di Ricerca - Risultati Le mie Info', {
    retries: {
        runMode: 1,
        openMode: 0,
    }
}, function () {

    it('Verifica Ricerca Incasso', function () {
        LandingRicerca.search('incasso')
        LandingRicerca.clickTabMieInfo()
        LandingRicerca.checkSubTabMieInfo()
        LandingRicerca.checkSuggestedLinks('incasso')
    })

    it('Verifica Ricerca Fastquote', function () {
        LandingRicerca.search('fastquote')
        LandingRicerca.clickTabMieInfo()
        LandingRicerca.checkSubTabMieInfo()
        LandingRicerca.checkSuggestedLinks('fastquote')
    })

    it('Verifica Ricerca Prodotto: Ultra', function () {
        LandingRicerca.search('ultra')
        LandingRicerca.clickTabMieInfo()
        LandingRicerca.checkSubTabMieInfo()
        LandingRicerca.checkSuggestedLinks('ultra')
    })

    //!Rimosso in quanto non presenta nemmeno una circola per il click
    // it('Verifica Click su card di una Circolare', function () {
    //     LandingRicerca.search('circolari')
    //     LandingRicerca.checkTabs()
    //     LandingRicerca.clickTabMieInfo
    //     LandingRicerca.checkSubTabMieInfo()
    //     //LandingRicerca.checkAggancioCircolari()
    //     cy.get('body').find('lib-subsection:contains("La ricerca non ha prodotto risultati"):visible')
    // })
})