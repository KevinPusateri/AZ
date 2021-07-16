/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 */

/// <reference types="Cypress" />

import BurgerMenuClients from "../mw_page_objects/burgerMenu/BurgerMenuClients";
import Common from "../mw_page_objects/common/Common"
import LoginPage from "../mw_page_objects/common/LoginPage"
import TopBar from "../mw_page_objects/common/TopBar"
import SCUGestioneFontePrincipale from "../mw_page_objects/clients/SCUGestioneFontePrincipale"

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
//#endregion


describe('Matrix Web : Gestione fonte principale', function () {

  Cypress._.times(1, () => {

    it('Verifica aggancio Gestione fonte principale - Persona Fisica -i referenti siano corretti', function () {
      TopBar.clickClients()
      BurgerMenuClients.clickLink('Gestione fonte principale')
      SCUGestioneFontePrincipale.eseguiOnPersonaFisica()
    })

    it('Verifica aggancio Gestione fonte principale - Persona Giuridica -i referenti siano corretti', function () {
      TopBar.clickClients()
      BurgerMenuClients.clickLink('Gestione fonte principale')
      SCUGestioneFontePrincipale.eseguiOnPersonaGiuridica()
    })

  })
})

