/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 */

import Common from "../../mw_page_objects/common/Common"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import BurgerMenuNumbers from "../../mw_page_objects/burgerMenu/BurgerMenuNumbers"

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

describe('Matrix Web : Navigazioni da Burger Menu in Numbers', function () {

    it('Verifica i link da Burger Menu', function () {
        TopBar.clickNumbers()
        BurgerMenuNumbers.checkExistLinks()
    })

    it('Verifica aggancio Monitoraggio Fonti', function () {
        TopBar.clickNumbers()
        BurgerMenuNumbers.clickLink('Monitoraggio Fonti')
        BurgerMenuNumbers.backToNumbers()
    })

    it('Verifica aggancio Monitoraggio Carico', function () {
        TopBar.clickNumbers()
        BurgerMenuNumbers.clickLink('Monitoraggio Carico')
        BurgerMenuNumbers.backToNumbers()
    })

    it('Verifica aggancio Monitoraggio Carico per Fonte', function () {
        TopBar.clickNumbers()
        BurgerMenuNumbers.clickLink('Monitoraggio Carico per Fonte')
        BurgerMenuNumbers.backToNumbers()

    })

    it.skip('Verifica aggancio X - Advisor', function () {
        cy.task('getHostName').then(hostName => {
            let currentHostName = hostName
            if (!currentHostName.includes('SM')) {
                TopBar.clickNumbers()
                BurgerMenuNumbers.clickLink('X - Advisor')
            }
        })
    })

    it('Verifica aggancio Incentivazione', function () {
        TopBar.clickNumbers()
        BurgerMenuNumbers.clickLink('Incentivazione')
        BurgerMenuNumbers.backToNumbers()
    })

    //TODO: Seconda finestra
    //! DA CAPIRE SE é BUG
    it.skip('Verifica aggancio Incentivazione Recruiting', function () {
        TopBar.clickNumbers()
        BurgerMenuNumbers.clickLink('Incentivazione Recruiting')
        BurgerMenuNumbers.backToNumbers()
    })

    it('Verifica aggancio Andamenti Tecnici', function () {
        TopBar.clickNumbers()
        BurgerMenuNumbers.clickLink('Andamenti Tecnici')
        BurgerMenuNumbers.backToNumbers()
    })

    it('Verifica aggancio Estrazioni Avanzate', function () {
        TopBar.clickNumbers()
        BurgerMenuNumbers.clickLink('Estrazioni Avanzate')
        BurgerMenuNumbers.backToNumbers()
    })

    it('Verifica aggancio Scarico Dati', function () {
        if (!Cypress.env('isSecondWindow')) {
            TopBar.clickNumbers()
            BurgerMenuNumbers.clickLink('Scarico Dati')
            BurgerMenuNumbers.backToNumbers()
        } else this.skip()

    })

    it('Verifica aggancio Indici Digitali', function () {
        TopBar.clickNumbers()
        BurgerMenuNumbers.clickLink('Indici Digitali')
        BurgerMenuNumbers.backToNumbers()
    })

    it('Verifica aggancio New Business Danni', function () {
        TopBar.clickNumbers()
        BurgerMenuNumbers.clickLink('New Business Danni')
        BurgerMenuNumbers.backToNumbers()
    })

    it('Verifica aggancio New Business Ultra Casa e Patrimonio', function () {
        TopBar.clickNumbers()
        BurgerMenuNumbers.clickLink('New Business Ultra Casa e Patrimonio')
        BurgerMenuNumbers.backToNumbers()
    })
    
    it('Verifica aggancio New Business Ultra Salute', function () {
        TopBar.clickNumbers()
        BurgerMenuNumbers.clickLink('New Business Ultra Salute')
        BurgerMenuNumbers.backToNumbers()
    })

    it('Verifica aggancio New Business Vita', function () {
        TopBar.clickNumbers()
        BurgerMenuNumbers.clickLink('New Business Vita')
        BurgerMenuNumbers.backToNumbers()
    })

    it('Verifica aggancio New Business Allianz1', function () {
        TopBar.clickNumbers()
        BurgerMenuNumbers.clickLink('New Business Allianz1')
        BurgerMenuNumbers.backToNumbers()
    })

    it('Verifica aggancio Monitoraggio PTF Danni', function () {
        TopBar.clickNumbers()
        BurgerMenuNumbers.clickLink('Monitoraggio PTF Danni')
        BurgerMenuNumbers.backToNumbers()
    })

    it('Verifica aggancio Monitoraggio Riserve Vita', function () {
        TopBar.clickNumbers()
        BurgerMenuNumbers.clickLink('Monitoraggio Riserve Vita')
        BurgerMenuNumbers.backToNumbers()
    })

    it('Verifica aggancio Retention Motor', function () {
        TopBar.clickNumbers()
        BurgerMenuNumbers.clickLink('Retention Motor')
        BurgerMenuNumbers.backToNumbers()
    })

    it('Verifica aggancio Retention Rami Vari', function () {
        TopBar.clickNumbers()
        BurgerMenuNumbers.clickLink('Retention Rami Vari')
        BurgerMenuNumbers.backToNumbers()
    })

    it('Verifica aggancio Monitoraggio Andamento Premi', function () {
        TopBar.clickNumbers()
        BurgerMenuNumbers.clickLink('Monitoraggio Andamento Premi')
        BurgerMenuNumbers.backToNumbers()
    })

    it('Verifica aggancio Monitoraggio Ricavi d\'Agenzia', function () {
        TopBar.clickNumbers()
        BurgerMenuNumbers.clickLink('Monitoraggio Ricavi d\'Agenzia')
        BurgerMenuNumbers.backToNumbers()
    })

    it('Verifica aggancio Capitale Vita Scadenza', function () {
        TopBar.clickNumbers()
        BurgerMenuNumbers.clickLink('Capitale Vita Scadenza')
        BurgerMenuNumbers.backToNumbers()
    })
})