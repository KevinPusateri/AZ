/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 */

/// <reference types="Cypress" />

import BurgerMenuClients from "../../mw_page_objects/burgerMenu/BurgerMenuClients";
import Common from "../../mw_page_objects/common/Common"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import SCUGestioneFontePrincipale from "../../mw_page_objects/clients/SCUGestioneFontePrincipale"

//#region Mysql DB Variables
const testName = Cypress.spec.name.split('.')[0].toUpperCase()
const currentEnv = Cypress.env('currentEnv')
const dbConfig = Cypress.env('db')
let insertedId
//#endregion

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)

//#endregion

before(() => {
    cy.task("cleanScreenshotLog", Cypress.spec.name).then((folderToDelete) => {
        cy.log(folderToDelete + ' rimossa!')

        cy.getUserWinLogin().then(data => {
            cy.startMysql(dbConfig, testName, currentEnv, data).then((id) => insertedId = id)
            LoginPage.logInMWAdvanced()
        })
    })
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
        cy.finishMysql(dbConfig, insertedId, tests)
    })
    //#endregion

})
//#endregion


describe('Matrix Web : Gestione fonte principale', function () {

    Cypress._.times(1, () => {

        it('Verifica aggancio Gestione fonte principale - Persona Fisica - i referenti siano corretti', function () {
            TopBar.clickClients()
            BurgerMenuClients.clickLink('Gestione fonte principale')
            SCUGestioneFontePrincipale.eseguiOnPersonaFisica()
        })

        it('Verifica aggancio Gestione fonte principale - Persona Giuridica - i referenti siano corretti', function () {
            TopBar.clickClients()
            BurgerMenuClients.clickLink('Gestione fonte principale')
            SCUGestioneFontePrincipale.eseguiOnPersonaGiuridica()
        })

    })
})