/// <reference types="Cypress" />

import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import SintesiCliente from "../../mw_page_objects/clients/SintesiCliente"
import Portafoglio from "../../mw_page_objects/clients/Portafoglio"
import HomePage from "../../mw_page_objects/common/HomePage"


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
    HomePage.reloadMWHomePage()

    if (!Cypress.env('monoUtenza') && !Cypress.env('isAviva')) {
        TopBar.search('Pulini Francesco')
        SintesiCliente.wait()
    } else if (!Cypress.env('isAviva')) {
        TopBar.search('SLZNLL54A04H431Q')
        SintesiCliente.wait()
    } else {
        TopBar.search('DRLTMS95L21F257R')
        SintesiCliente.wait()
    }

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

describe('MW: Navigazioni da Scheda Cliente - Tab Portafoglio', function() {

    it('Verifica subTab Portafoglio', function() {
        Portafoglio.clickTabPortafoglio()
        Portafoglio.checkLinksSubTabs()
    })

    it('Verifica subTab Polizze attive', function() {
        Portafoglio.clickTabPortafoglio()
        Portafoglio.clickSubTab('Polizze attive')
        Portafoglio.checkPolizzeAttive()
    })

    it('Verifica subTab Proposte', function() {
        Portafoglio.clickTabPortafoglio()
        Portafoglio.clickSubTab('Proposte')
        Portafoglio.checkProposte()
    })

    it('Verifica subTab Preventivi', function() {
        Portafoglio.clickTabPortafoglio()
        Portafoglio.clickSubTab('Preventivi')
        Portafoglio.checkPreventivi()
    })

    it('Verifica subTab Non in vigore', function() {
        Portafoglio.clickTabPortafoglio()
        Portafoglio.clickSubTab('Non in vigore')
        Portafoglio.checkNonInVigore()
    })

    it('Verifica subTab Sinistri', function() {
        cy.task('getHostName').then(hostName => {
            let currentHostName = hostName
            if (!currentHostName.includes('SM')) {
                Portafoglio.clickTabPortafoglio()
                Portafoglio.clickSubTab('Sinistri')
                Portafoglio.checkSinistri()
            }
        })
    })
})