/// <reference types="Cypress" />

import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import SintesiCliente from "../../mw_page_objects/clients/SintesiCliente"
import Portafoglio from "../../mw_page_objects/clients/Portafoglio"
import HomePage from "../../mw_page_objects/common/HomePage"

Cypress.config('defaultCommandTimeout', 60000)

//#region Variables
const userName = 'TUTF021'
const psw = 'P@ssw0rd!'
//#endregion

//#region  Configuration
Cypress.config('defaultCommandTimeout', 60000)
//#endregion


before(() => {
    LoginPage.logInMW(userName, psw)
})

beforeEach(() => {
    cy.preserveCookies()
    HomePage.reloadMWHomePage()
    // TopBar.searchClickLinkSuggest()
    TopBar.search('Pulini Francesco')
    SintesiCliente.wait()
})


after(() => {
    TopBar.logOutMW()
})

describe('MW: Navigazioni da Scheda Cliente - Tab Portafoglio', function () {

    it('Verifica Subtab Portafoglio', function () {
        Portafoglio.clickTabPortafoglio()
        Portafoglio.checkLinksSubTabs()
    })

    it('Verifica Tab Polizze attive', function () {
        Portafoglio.clickTabPortafoglio()
        Portafoglio.clickSubTab('Polizze attive')
        Portafoglio.checkPolizzeAttive()
        Portafoglio.back()
    })

    it('Verifica Tab Proposte', function () {
        Portafoglio.clickTabPortafoglio()
        Portafoglio.clickSubTab('Proposte')
        Portafoglio.checkProposte()
        Portafoglio.back()
    })

    it('Verifica Tab Preventivi', function () {
        Portafoglio.clickTabPortafoglio()
        Portafoglio.clickSubTab('Preventivi')
        Portafoglio.checkPreventivi()
        Portafoglio.back()
    })

    it('Verifica Tab Non in vigore', function () {
        Portafoglio.clickTabPortafoglio()
        Portafoglio.clickSubTab('Non in vigore')
        Portafoglio.checkNonInVigore()
        Portafoglio.back()
    })

    it('Verifica Tab Sinistri', function () {
        Portafoglio.clickTabPortafoglio()
        Portafoglio.clickSubTab('Sinistri')
        Portafoglio.checkSinistri()
        Portafoglio.back()
    })
})