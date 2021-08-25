/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 */

/// <reference types="Cypress" />

import BurgerMenuClients from "../../mw_page_objects/burgerMenu/BurgerMenuClients";
import Common from "../../mw_page_objects/common/Common"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import SCUGestioneFontePrincipale from "../../mw_page_objects/clients/SCUGestioneFontePrincipale"

//#region Username Variables
const userName = 'TUTF021'
const psw = 'P@ssw0rd!'
const agency = '010710000'
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

