/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 */

import Common from "../../mw_page_objects/common/Common"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import BurgerMenuClients from "../../mw_page_objects/burgerMenu/BurgerMenuClients"
import BurgerMenuSales from "../../mw_page_objects/burgerMenu/BurgerMenuSales"
import BurgerMenuNumbers from "../../mw_page_objects/burgerMenu/BurgerMenuNumbers"

//#region Mysql DB Variables
// const testName = Cypress.spec.name.split('.')[0].toUpperCase()
const testName = Cypress.spec.name.split('.')[0].toUpperCase()
const currentEnv = Cypress.env('currentEnv')
const dbConfig = Cypress.env('db')
let insertedId
//#endregion

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)
let options = {
    retries: {
        runMode: 0,
        openMode: 0,
    }
}
var urlClients = Common.getUrlBeforeEach() + 'clients/'
var urlSales = Common.getUrlBeforeEach() + 'sales/'
var urlNumbers = Common.getUrlBeforeEach() + 'numbers/business-lines'
//#endregion

let keys = {
    ALLIANZ_GLOBAL_ASSISTANCE_OAZIS: true,
    ALLIANZ_GLOBAL_ASSISTANCE_GLOBY: true,
    X_ADVISOR: true,
    HOSPITAL_SCANNER: true
}

let keyDigitalMe = {
    PUBBLICAZIONE_PROPOSTE: true
}
before(() => {

    expect(Cypress.browser.name).to.contain('chrome')
    cy.getUserWinLogin().then(data => {
        cy.startMysql(dbConfig, testName, currentEnv, data).then((id) => insertedId = id)
        LoginPage.logInMWAdvanced()
        cy.getProfiling(data.tutf).then(profiling => {
            cy.filterProfile(profiling, 'PO_PULSANTE_AGA').then(profiled => { keys.ALLIANZ_GLOBAL_ASSISTANCE_OAZIS = profiled })
            cy.filterProfile(profiling, 'PO_PULSANTE_AGA').then(profiled => { keys.ALLIANZ_GLOBAL_ASSISTANCE_GLOBY = profiled })
            cy.filterProfile(profiling, 'COMMON_CRYSTAL').then(profiled => { keys.X_ADVISOR = profiled })
            cy.filterProfile(profiling, 'HOSPITAL_SCANNER').then(profiled => { keys.HOSPITAL_SCANNER = profiled })

        })
    })
})

beforeEach(() => {
    cy.preserveCookies()
    cy.ignoreRequest()
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

//! SETTARE I PROXY prima del run
//! export HTTP_PROXY=http://it000-surf.zone2.proxy.allianz:8080
//! export NO_PROXY=ageallianz.it,.servizi.allianzit,.azi.allianzit
//! npm run cypress:open
describe('Matrix Web : Navigazioni da Burger Menu in Clients', options, function () {

    it('Analisi dei bisogni', function () {
        if (Cypress.env('isAviva') || Cypress.env('isAvivaBroker'))
            this.skip()

        cy.visit(urlClients)
        BurgerMenuClients.clickBurgerMenu()
        BurgerMenuClients.clickLink('Analisi dei bisogni', false)
    });

    it('Hospital scanner', function () {
        if (Cypress.env('isAviva') || Cypress.env('isAvivaBroker'))
            this.skip()

        cy.visit(urlClients)
        BurgerMenuClients.clickBurgerMenu()
        BurgerMenuClients.clickLink('Hospital scanner', false)
    });

    it('Verifica aggancio GED – Gestione Documentale', function () {
        if (Cypress.env('isAviva'))
            this.skip()

        cy.visit(urlSales)
        BurgerMenuClients.clickBurgerMenu()
        BurgerMenuSales.clickLink('GED – Gestione Documentale', false)
    })

    it('Allianz Global Assistance - OAZIS', function () {
        if (!keys.ALLIANZ_GLOBAL_ASSISTANCE_OAZIS)
            this.skip()

        cy.visit(urlSales)
        BurgerMenuClients.clickBurgerMenu()
        BurgerMenuSales.clickLink('Allianz global assistance - OAZIS', false)
    })

    it('Allianz Global Assistance - GLOBY', function () {
        if (!keys.ALLIANZ_GLOBAL_ASSISTANCE_GLOBY)
            this.skip()

        cy.visit(urlSales)
        BurgerMenuClients.clickBurgerMenu()
        BurgerMenuSales.clickLink('Allianz global assistance - GLOBY', false)
    })

    it('X - Advisor', function () {
        if (!keys.X_ADVISOR)
            this.skip()

        cy.visit(urlNumbers)
        BurgerMenuClients.clickBurgerMenu()
        BurgerMenuNumbers.clickLink('X - Advisor')
    })
})