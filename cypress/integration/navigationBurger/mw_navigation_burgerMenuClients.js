/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 */

import Common from "../../mw_page_objects/common/Common"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import BurgerMenuClients from "../../mw_page_objects/burgerMenu/BurgerMenuClients"
import Clients from "../../mw_page_objects/clients/LandingClients"
import HomePage from "../../mw_page_objects/common/HomePage"

//#region Mysql DB Variables
const testName = Cypress.spec.name.split('/')[1].split('.')[0].toUpperCase()
const currentEnv = Cypress.env('currentEnv')
const dbConfig = Cypress.env('db')
let insertedId
    //#endregion

//#region Configuration
Cypress.config('defaultCommandTimeout', 120000)

//#endregion

before(() => {
    cy.getUserWinLogin().then(data => {
        cy.startMysql(dbConfig, testName, currentEnv, data).then((id) => insertedId = id)
        LoginPage.logInMWAdvanced()
    })
})

beforeEach(() => {
    cy.preserveCookies()
    Common.visitUrlOnEnv()
})

after(function() {
    TopBar.logOutMW()
        //#region Mysql
    cy.getTestsInfos(this.test.parent.suites[0].tests).then(testsInfo => {
            let tests = testsInfo
            cy.finishMysql(dbConfig, insertedId, tests)
        })
        //#endregion

})

describe('Matrix Web : Navigazioni da Burger Menu in Clients', function() {

    it('Verifica i link da Burger Menu', function() {

        TopBar.clickClients()
        BurgerMenuClients.checkExistLinks()
    });

    it('Verifica aggancio Analisi dei bisogni', function() {
        cy.task('getHostName').then(hostName => {
            let currentHostName = hostName
            cy.log(currentHostName)
            if (!currentHostName.includes('SM')) {
                TopBar.clickClients()
                BurgerMenuClients.clickLink('Analisi dei bisogni')
            }
        })
    });

    it('Verifica aggancio Censimento nuovo cliente', function() {
        TopBar.clickClients()
        BurgerMenuClients.clickLink('Censimento nuovo cliente')
        BurgerMenuClients.backToClients()
    });

    it('Verifica aggancio Digital Me', function() {
        TopBar.clickClients()
        BurgerMenuClients.clickLink('Digital Me')
        Clients.checkDigitalMe()
        BurgerMenuClients.backToClients()
    });

    it('Verifica aggancio Pannello anomalie', function() {
        TopBar.clickClients()
        BurgerMenuClients.clickLink('Pannello anomalie')
        BurgerMenuClients.backToClients()
    });

    it('Verifica aggancio Clienti duplicati', function() {
        TopBar.clickClients()
        BurgerMenuClients.clickLink('Clienti duplicati')
        BurgerMenuClients.backToClients()
    });

    it('Verifica aggancio Cancellazione Clienti', function() {
        TopBar.clickClients()
        BurgerMenuClients.clickLink('Cancellazione Clienti')
        BurgerMenuClients.backToClients()
    });

    it('Verifica aggancio Cancellazione Clienti per fonte', function() {
        TopBar.clickClients()
        BurgerMenuClients.clickLink('Cancellazione Clienti per fonte')
        BurgerMenuClients.backToClients()
    });

    it('Verifica aggancio Hospital scanner', function() {
        if (!Cypress.env('isAviva')) {
            TopBar.clickClients()
            BurgerMenuClients.clickLink('Hospital scanner')
            HomePage.reloadMWHomePage()
        }
    });

    it('Verifica aggancio Antiriciclaggio', function() {
        if (!Cypress.env('isAviva')) {
            TopBar.clickClients()
            BurgerMenuClients.clickLink('Antiriciclaggio')
            BurgerMenuClients.backToClients()
        }
    });
    it('Verifica aggancio Gestione fonte principale', function() {
        TopBar.clickClients()
        BurgerMenuClients.clickLink('Gestione fonte principale')
        BurgerMenuClients.backToClients()
    });
})