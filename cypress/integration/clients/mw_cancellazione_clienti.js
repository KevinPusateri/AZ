/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 */

/// <reference types="Cypress" />

import SCUCancellazioneClienti from "../../mw_page_objects/clients/SCUCancellazioneClienti";
import BurgerMenuClients from "../../mw_page_objects/burgerMenu/BurgerMenuClients";
import Common from "../../mw_page_objects/common/Common"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import LandingRicerca from "../../mw_page_objects/ricerca/LandingRicerca"
import HomePage from "../../mw_page_objects/common/HomePage";

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
  cy.task('startMyql', { dbConfig: dbConfig, testCaseName: testName, currentEnv: currentEnv, currentUser: userName }).then((results) => {
      insertedId = results.insertId
  })
  LoginPage.logInMW(userName, psw)
})

beforeEach(() => {
  Common.visitUrlOnEnv()
  cy.preserveCookies()
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
//#endregion

var cliente;
describe('Matrix Web - Hamburger Menu: Cancellazione Clienti ', function () {

  it('Verifica aggancio pagina Cancellazione Clienti', function () {
    TopBar.clickClients()
    BurgerMenuClients.clickLink('Cancellazione Clienti')
    BurgerMenuClients.backToClients()
  })

  context('Cancellazione Clienti - Persona Fisica', () => {

    it('Verifica Cancellazione clienti PF', function () {
      TopBar.clickClients()
      BurgerMenuClients.clickLink('Cancellazione Clienti')
      SCUCancellazioneClienti.eseguiCancellazioneOnPersonaFisica().then(currentClient => {
        cliente = currentClient
      })
    })

    it('Ricercare i clienti in buca di ricerca - accedere alla scheda', function () {
      HomePage.reloadMWHomePage()
      TopBar.search(cliente)
      LandingRicerca.filtraRicerca('P')
      LandingRicerca.checkClienteNotFound(cliente)
    })
  })

  Cypress._.times(1, () => {

    context('Cancellazione Clienti - Persona Giuridica', () => {

      it('Verifica Cancellazione clienti PG', function () {
        TopBar.clickClients()
        BurgerMenuClients.clickLink('Cancellazione Clienti')
        SCUCancellazioneClienti.eseguiCancellazioneOnPersonaGiuridica().then(currentClient => {
          cliente = currentClient
        })

      })

      it('Ricercare i clienti in buca di ricerca - accedere alla scheda', function () {
        HomePage.reloadMWHomePage()
        TopBar.search(cliente)
        LandingRicerca.checkClienteNotFound(cliente)
      })
    })
  })
})

