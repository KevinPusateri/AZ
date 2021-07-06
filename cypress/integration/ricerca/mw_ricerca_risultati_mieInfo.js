/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 * @author Andrea 'Bobo' Oboe <andrea.oboe@allianz.it>
 */

/// <reference types="Cypress" />
import Common from "../../mw_page_objects/common/Common"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import LandingRicerca from "../../mw_page_objects/ricerca/LandingRicerca"

//#region Variables
const userName = 'TUTF021'
const psw = 'P@ssw0rd!'
//#endregion

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)
//#endregion


before(() => {
    LoginPage.logInMW(userName, psw)
})

beforeEach(() => {
    Common.visitUrlOnEnv()
    cy.preserveCookies()
})

after(() => {
    TopBar.logOutMW()
})

describe('Buca di Ricerca - Risultati Le mie Info', function () {

    it('Verifica Ricerca Incasso', function () {
        LandingRicerca.search('incasso')
        LandingRicerca.checkTabs()
        LandingRicerca.checkSuggestedLinks('incasso')
        LandingRicerca.checkLeMieInfo()
    })

    it('Verifica Ricerca Fastquote', function () {
        LandingRicerca.search('fastquote')
        LandingRicerca.checkTabs()
        LandingRicerca.checkSuggestedLinks('fastquote')
        LandingRicerca.checkLeMieInfo()
    })

    it('Verifica Ricerca Prodotto: Ultra', function () {
        LandingRicerca.search('ultra')
        LandingRicerca.checkTabs()
        LandingRicerca.checkSuggestedLinks('ultra')
        // LandingRicerca.checkClients()
        LandingRicerca.checkLeMieInfo()
    })

    it('Verifica Click su card di una Circolare', function () {
        LandingRicerca.search('circolari')
        LandingRicerca.checkTabs()
        //LandingRicerca.checkAggancioCircolari()
    })
})