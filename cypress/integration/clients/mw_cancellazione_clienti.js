/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 */

/// <reference types="Cypress" />

import SCUCancellazioneClienti from "../../mw_page_objects/clients/SCUCancellazioneClienti";
import BurgerMenuClients from "../../mw_page_objects/burgerMenu/BurgerMenuClients";
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import LandingRicerca from "../../mw_page_objects/ricerca/LandingRicerca"
import HomePage from "../../mw_page_objects/common/HomePage";

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

var cliente;
describe('Matrix Web - Hamburger Menu: Cancellazione Clienti ', function () {

    it('Verifica aggancio pagina Cancellazione Clienti', function () {
        TopBar.clickClients()
        BurgerMenuClients.clickLink('Cancellazione Clienti')
    })

    it('Verifica Cancellazione clienti PF', function () {
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

    it('Verifica Cancellazione clienti PG', function () {
        HomePage.reloadMWHomePage()
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