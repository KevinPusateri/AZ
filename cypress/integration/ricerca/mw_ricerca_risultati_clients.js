/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 * @author Andrea 'Bobo' Oboe <andrea.oboe@allianz.it>
 */

/// <reference types="Cypress" />
import Common from "../../mw_page_objects/common/Common"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import LandingRicerca from "../../mw_page_objects/ricerca/LandingRicerca"
import SintesiCliente from "../../mw_page_objects/clients/SintesiCliente"
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

describe('Buca di Ricerca - Risultati Clients', function () {
    it('Verifica Ricerca Cliente: nome o cognome ', function () {
        LandingRicerca.searchRandomClient(false)
        LandingRicerca.checkRisultatiRicerca()
    })

    it('Verifica Modifica filtri', function () {
        LandingRicerca.searchRandomClient(false)
        LandingRicerca.filtraRicerca("P")
    })

    it('Verifica Click su Ricerca Cliente e Atterraggio in Sintesi Cliente', function () {
        TopBar.search('PULINI')
        LandingRicerca.clickFirstResult()
        SintesiCliente.checkAtterraggioSintesiCliente('PULINI')
    })
})