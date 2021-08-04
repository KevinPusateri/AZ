/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 * @author Andrea 'Bobo' Oboe <andrea.oboe@allianz.it>
 */

/// <reference types="Cypress" />
import SCU from "../../mw_page_objects/clients/SCU"
import Common from "../../mw_page_objects/common/Common"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import LandingRicerca from "../../mw_page_objects/ricerca/LandingRicerca"
import News from "../../mw_page_objects/Navigation/News"

//#region Username Variables
const userName = 'TUTF021'
const psw = 'P@ssw0rd!'
//#endregion

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
    cy.task('startMysql', { dbConfig: dbConfig, testCaseName: testName, currentEnv: currentEnv, currentUser: userName }).then((results) => {
        insertedId = results.insertId
    })
    LoginPage.logInMW(userName, psw)
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

describe('Buca di Ricerca', {
    retries: {
        runMode: 1,
        openMode: 0,
    }
}, function () {
    it('Verifica Click su Ricerca Classica 2', function () {
        LandingRicerca.searchRandomClient(false)
        LandingRicerca.checkRicercaClassica()
    })

    it('Verifica Click su Ricerca Cliente', function () {
        LandingRicerca.searchRandomClient(false)
        LandingRicerca.clickRicercaClassicaLabel('Ricerca Cliente')
        SCU.checkAggancioRicerca()
    })

    it('Verifica Click su Ricerca Polizze proposte', function () {
        LandingRicerca.searchRandomClient(false)
        LandingRicerca.clickRicercaClassicaLabel('Ricerca Polizze proposte')
        SCU.checkAggancioPolizzePropostePreventivi()
    })

    it('Verifica Click su Ricerca Preventivi', function () {
        LandingRicerca.searchRandomClient(false)
        LandingRicerca.clickRicercaClassicaLabel('Ricerca Preventivi')
        SCU.checkAggancioPolizzePropostePreventivi()
    })

    it('Verifica Click su Rubrica', function () {
        LandingRicerca.searchRandomClient(false)
        LandingRicerca.clickRicercaClassicaLabel('Rubrica')
        SCU.checkAggancioRubrica()
    })

    it('Verifica Click su Ricerca News', function () {
        LandingRicerca.searchRandomClient(false)
        LandingRicerca.clickRicercaClassicaLabel('Ricerca News')
        News.checkAtterraggio(true)
    })
})