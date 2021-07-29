/// <reference types="Cypress" />

import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import SintesiCliente from "../../mw_page_objects/clients/SintesiCliente"
import Portafoglio from "../../mw_page_objects/clients/Portafoglio"
import HomePage from "../../mw_page_objects/common/HomePage"

Cypress.config('defaultCommandTimeout', 60000)

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

//#region  Configuration
Cypress.config('defaultCommandTimeout', 60000)
//#endregion


before(() => {
    cy.task('startMyql', { dbConfig: dbConfig, testCaseName: testName, currentEnv: currentEnv, currentUser: userName }).then((results) => {
        insertedId = results.insertId
    })
    LoginPage.logInMW(userName, psw)
})

beforeEach(() => {
    cy.preserveCookies()
    HomePage.reloadMWHomePage()
    // TopBar.searchClickLinkSuggest()
    TopBar.search('Pulini Francesco')
    SintesiCliente.wait()
})


after(function () {
    //#region Mysql
    cy.getTestsInfos(this.test.parent.suites[0].tests).then(testsInfo => {
        let tests = testsInfo
        cy.task('finishMyql', { dbConfig: dbConfig, rowId: insertedId, tests })
    })
    //#endregion

    TopBar.logOutMW()
})

describe('MW: Navigazioni da Scheda Cliente - Tab Portafoglio', function () {

    it('Verifica subTab Portafoglio', function () {
        Portafoglio.clickTabPortafoglio()
        Portafoglio.checkLinksSubTabs()
    })

    it('Verifica subTab Polizze attive', function () {
        Portafoglio.clickTabPortafoglio()
        Portafoglio.clickSubTab('Polizze attive')
        Portafoglio.checkPolizzeAttive()
        Portafoglio.back()
    })

    it('Verifica subTab Proposte', function () {
        Portafoglio.clickTabPortafoglio()
        Portafoglio.clickSubTab('Proposte')
        Portafoglio.checkProposte()
        Portafoglio.back()
    })

    it('Verifica subTab Preventivi', function () {
        Portafoglio.clickTabPortafoglio()
        Portafoglio.clickSubTab('Preventivi')
        Portafoglio.checkPreventivi()
        Portafoglio.back()
    })

    it('Verifica subTab Non in vigore', function () {
        Portafoglio.clickTabPortafoglio()
        Portafoglio.clickSubTab('Non in vigore')
        Portafoglio.checkNonInVigore()
        Portafoglio.back()
    })

    it('Verifica subTab Sinistri', function () {
        Portafoglio.clickTabPortafoglio()
        Portafoglio.clickSubTab('Sinistri')
        Portafoglio.checkSinistri()
        Portafoglio.back()
    })
})