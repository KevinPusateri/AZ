/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
*/

/// <reference types="Cypress" />
import Common from "../../mw_page_objects/common/Common"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import Ricerca from "../../mw_page_objects/ricerca/LandingRicerca";

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

describe('Matrix Ricerca', function () {

  it('Verifica Ricerca Da Switch Page', function () {
    Ricerca.checkBucaRicercaSuggerrimenti()
  })

  it('Verifica Ricerca Da Landing Page', function () {
    TopBar.clickClients()
    Ricerca.checkBucaRicercaSuggerrimenti()

    TopBar.clickSales()
    Ricerca.checkBucaRicercaSuggerrimenti()
    cy.get('a[href="/matrix/"]').click()

    TopBar.clickNumbers()
    Ricerca.checkBucaRicercaSuggerrimenti()
    cy.get('a[href="/matrix/"]').click()

    TopBar.clickBackOffice()
    Ricerca.checkBucaRicercaSuggerrimenti()
    cy.get('a[href="/matrix/"]').click()

    landingPage().contains('News').click()
    cy.url().should('include', '/news/home')
    checkBucaRicerca()
    cy.get('a[href="/matrix/"]').click()
  })

})