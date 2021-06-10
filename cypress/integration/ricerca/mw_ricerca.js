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

describe('Matrix Ricerca', function () {

  it('Verifica Ricerca Da Switch Page', function () {
    LandingRicerca.checkBucaRicercaSuggerrimenti()
  })

  it('Verifica Ricerca Da Landing Clients', function () {
    TopBar.clickClients()
    LandingRicerca.checkBucaRicercaSuggerrimenti()
  })

  it('Verifica Ricerca Da Landing Sales', function () {
    TopBar.clickSales()
    LandingRicerca.checkBucaRicercaSuggerrimenti()
    TopBar.clickMatrixHome()
  })

  it('Verifica Ricerca Da Landing Numbers', function () {
    TopBar.clickNumbers()
    LandingRicerca.checkBucaRicercaSuggerrimenti()
    TopBar.clickMatrixHome()
  })

  it('Verifica Ricerca Da Landing BackOffice', function () {

    TopBar.clickBackOffice()
    LandingRicerca.checkBucaRicercaSuggerrimenti()
    TopBar.clickMatrixHome()
  })

  it('Verifica Ricerca Da Landing News', function () {
    TopBar.clickNews()
    LandingRicerca.checkBucaRicercaSuggerrimenti()
    TopBar.clickMatrixHome()
  })

  it('Verifica Ricerca Da Landing Le mie info', function () {
    TopBar.clickMieInfo()
    LandingRicerca.checkBucaRicercaSuggerrimenti()
    TopBar.clickMatrixHome()
  })
})