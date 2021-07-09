/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 */

import Common from "../../mw_page_objects/common/Common"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import BurgerMenuNumbers from "../../mw_page_objects/burgerMenu/BurgerMenuNumbers"

//#region Variables
const userName = 'TUTF021'
const psw = 'P@ssw0rd!'
//#endregion

//#region  Configuration
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

    //TODO: connessione non sicura Apre una nuova pagina
    // it('Verifica aggancio X - Advisor', function () {
    // cy.get('app-product-button-list').find('a').contains('Numbers').click()
    //     cy.url().should('eq', baseUrl + 'numbers/business-lines')
    //     cy.get('lib-burger-icon').click()
    //     cy.contains('X - Advisor').click()
    //     canaleFromPopup()
    //     cy.get('a').contains('Numbers').click()
    // })

    it('Verifica aggancio Incentivazione', function () {
        TopBar.clickNumbers()
        BurgerMenuNumbers.clickLink('Incentivazione')
        BurgerMenuNumbers.backToNumbers()
    })

    it('Verifica aggancio Incentivazione Recruiting', function () {
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
        TopBar.clickNumbers()
        BurgerMenuNumbers.clickLink('Scarico Dati')
        BurgerMenuNumbers.backToNumbers()
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

    // tolto per esigenze di business
    /* it('Verifica aggancio New Business Ultra', function () {
         cy.get('app-product-button-list').find('a').contains('Numbers').click()
         cy.url().should('eq', baseUrl + 'numbers/business-lines')
         cy.get('lib-burger-icon').click()
         interceptGetAgenziePDF()
         cy.contains('New Business Ultra').click()
         canaleFromPopup()
         cy.wait('@getDacommerciale', { requestTimeout: 30000 });
         getIFrame().find('[class="page-container"]:contains("Filtra"):visible')
         cy.get('a').contains('Numbers').click()
         cy.url().should('eq', baseUrl + 'numbers/business-lines')
     })*/

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