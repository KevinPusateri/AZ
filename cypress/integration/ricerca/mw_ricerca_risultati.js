/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 * @author Andrea 'Bobo' Oboe <andrea.oboe@allianz.it>
 */

/// <reference types="Cypress" />
import LandingRicerca from "../../mw_page_objects/ricerca/LandingRicerca"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"


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

let notExist = ''
if (Cypress.env('isAviva'))
    notExist = 'ASSENTE '



if (Cypress.env('isAviva')) {
    describe('Buca di Ricerca - Risultati - AVIVA', function() {

        it('Verifica Atterraggio nella Pagina', function() {
            LandingRicerca.search('RO')
            LandingRicerca.checkNotExistMieInfo()
            LandingRicerca.checkSuggestedLinks('RO')
            LandingRicerca.checkButtonRicercaClassica()
        })


    })
} else {
    describe('Buca di Ricerca - Risultati', function() {

        it('Verifica Atterraggio nella Pagina', function() {
            LandingRicerca.search('RO')
            LandingRicerca.clickTabMieInfo()
            LandingRicerca.checkTabDopoRicerca()
            LandingRicerca.checkSuggestedLinks('RO')
            LandingRicerca.checkButtonRicercaClassica()
        })

    })
}