/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 */

import Common from "../../mw_page_objects/common/Common"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import Numbers from "../../mw_page_objects/navigation/Numbers"
import BurgerMenuNumbers from "../../mw_page_objects/burgerMenu/BurgerMenuNumbers"
const getIFrame = () => {
    cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .iframe();

    let iframeSCU = cy.get('iframe[class="iframe-content ng-star-inserted"]')
        .its('0.contentDocument').should('exist');

    return iframeSCU.its('body').should('not.be.undefined').then(cy.wrap)
}
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
        BurgerMenuNumbers.checkLinksBurgerMenu()
    })

    it('Verifica aggancio Monitoraggio Fonti', function () {
        TopBar.clickNumbers()
        BurgerMenuNumbers.clickLinkOnBurgerMenu('Monitoraggio Fonti')
        Common.canaleFromPopup()
        BurgerMenuNumbers.checkMonitoraggioFonti()
        BurgerMenuNumbers.backToNumbers()
    })

    // TODO Da capire dove usare interceptGetAgenziePDF 
    it.only('Verifica aggancio Monitoraggio Carico', function () {
        TopBar.clickNumbers()
        cy.get('lib-burger-icon').click()
        interceptGetAgenziePDF()
        cy.contains('Monitoraggio Carico').click()
        Common.canaleFromPopup()
        cy.wait('@getDacommerciale', { requestTimeout: 30000 });
        getIFrame().find('#contentPane:contains("Fonti"):visible')
        cy.get('a').contains('Numbers').click()
        // cy.url().should('eq', baseUrl + 'numbers/business-lines')
    })

    it('Verifica aggancio Monitoraggio Carico per Fonte', function () {
        cy.get('app-product-button-list').find('a').contains('Numbers').click()
        cy.url().should('eq', baseUrl + 'numbers/business-lines')
        cy.get('lib-burger-icon').click()
        interceptGetAgenziePDF()
        cy.contains('Monitoraggio Carico per Fonte').click()
        cy.wait('@getDacommerciale', { requestTimeout: 30000 });
        getIFrame().find('#contentPane:contains("Applica filtri"):visible')
        cy.get('a').contains('Numbers').click()
        cy.url().should('eq', baseUrl + 'numbers/business-lines')
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
        cy.get('app-product-button-list').find('a').contains('Numbers').click()
        cy.url().should('eq', baseUrl + 'numbers/business-lines')
        cy.get('lib-burger-icon').click()
        cy.contains('Incentivazione').click()
        canaleFromPopup()
        getIFrame().find('button:contains("Incentivazione: Maturato per Fonte"):visible')
        cy.get('a').contains('Numbers').click()
        cy.url().should('eq', baseUrl + 'numbers/business-lines')
    })

    it('Verifica aggancio Incentivazione Recruiting', function () {
        cy.get('app-product-button-list').find('a').contains('Numbers').click()
        cy.url().should('eq', baseUrl + 'numbers/business-lines')
        cy.get('lib-burger-icon').click()
        cy.contains('Incentivazione Recruiting').click()
        canaleFromPopup()
        getIFrame().find('[class="menu-padre"]:contains("Report"):visible')
        cy.get('a').contains('Numbers').click()
        cy.url().should('eq', baseUrl + 'numbers/business-lines')
    })

    it('Verifica aggancio Andamenti Tecnici', function () {
        cy.get('app-product-button-list').find('a').contains('Numbers').click()
        cy.url().should('eq', baseUrl + 'numbers/business-lines')
        cy.get('lib-burger-icon').click()
        cy.contains('Andamenti Tecnici').click()
        interceptGetAgenziePDF()
        canaleFromPopup()
        getIFrame().find('button:contains("Fonti produttive"):visible')
        cy.wait('@getDacommerciale', { requestTimeout: 30000 });
        cy.get('a').contains('Numbers').click()
        cy.url().should('eq', baseUrl + 'numbers/business-lines')
    })

    it('Verifica aggancio Estrazioni Avanzate', function () {
        cy.get('app-product-button-list').find('a').contains('Numbers').click()
        cy.url().should('eq', baseUrl + 'numbers/business-lines')
        cy.get('lib-burger-icon').click()
        cy.contains('Estrazioni Avanzate').click()
        cy.intercept({
            method: 'GET',
            url: /pentahoDA*/
        }).as('pentahoDA');
        cy.intercept({
            method: 'GET',
            url: /pentahoDama*/
        }).as('pentahoDama');
        canaleFromPopup()
        cy.wait('@pentahoDA', { requestTimeout: 30000 });
        cy.wait('@pentahoDama', { requestTimeout: 30000 });
        getIFrame().find('a:contains("Nuovo Report"):visible')
        cy.get('a').contains('Numbers').click()
        cy.url().should('eq', baseUrl + 'numbers/business-lines')
    })

    it('Verifica aggancio Scarico Dati', function () {
        cy.get('app-product-button-list').find('a').contains('Numbers').click()
        cy.url().should('eq', baseUrl + 'numbers/business-lines')
        cy.get('lib-burger-icon').click()
        cy.contains('Scarico Dati').click()
        canaleFromPopup()
        getIFrame().find('form:contains("Esporta tracciato")')
        cy.get('a').contains('Numbers').click()
        cy.url().should('eq', baseUrl + 'numbers/business-lines')
    })

    it('Verifica aggancio Indici Digitali', function () {
        cy.get('app-product-button-list').find('a').contains('Numbers').click()
        cy.url().should('eq', baseUrl + 'numbers/business-lines')
        cy.get('lib-burger-icon').click()
        cy.contains('Indici Digitali').click()
        canaleFromPopup()
        getIFrame().find('#toggleFilters:contains("Apri filtri")')
        cy.get('a').contains('Numbers').click()
        cy.url().should('eq', baseUrl + 'numbers/business-lines')
    })

    //#region Report
    it('Verifica aggancio New Business Danni', function () {
        cy.get('app-product-button-list').find('a').contains('Numbers').click()
        cy.url().should('eq', baseUrl + 'numbers/business-lines')
        cy.get('lib-burger-icon').click()
        interceptGetAgenziePDF()
        cy.contains('New Business Danni').click()
        canaleFromPopup()
        cy.wait('@getDacommerciale', { requestTimeout: 30000 });
        getIFrame().find('#ricerca_cliente:contains("Filtra"):visible')
        cy.get('a').contains('Numbers').click()
        cy.url().should('eq', baseUrl + 'numbers/business-lines')
    })

    // da aggiungere excel
    it('Verifica aggancio Ultra Casa e Patrimonio', function () {
        cy.get('app-product-button-list').find('a').contains('Numbers').click()
        cy.url().should('eq', baseUrl + 'numbers/business-lines')
        cy.get('lib-burger-icon').click()
        interceptGetAgenziePDF()
        cy.contains('Ultra Casa e Patrimonio').click()
        canaleFromPopup()
        cy.wait('@getDacommerciale', { requestTimeout: 60000 });
        getIFrame().find('#submit-Mon_PTF:contains("Filtra"):visible')
        cy.get('a').contains('Numbers').click()
        cy.url().should('eq', baseUrl + 'numbers/business-lines')
    })

    // da aggiungere excel
    it('Verifica aggancio Ultra Salute', function () {
        cy.get('app-product-button-list').find('a').contains('Numbers').click()
        cy.url().should('eq', baseUrl + 'numbers/business-lines')
        cy.get('lib-burger-icon').click()
        interceptGetAgenziePDF()
        cy.contains('Ultra Salute').click()
        canaleFromPopup()
        cy.wait('@getDacommerciale', { requestTimeout: 60000 });
        getIFrame().find('#submit-Mon_PTF:contains("Filtra"):visible')
        cy.get('a').contains('Numbers').click()
        cy.url().should('eq', baseUrl + 'numbers/business-lines')
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
        cy.get('app-product-button-list').find('a').contains('Numbers').click()
        cy.url().should('eq', baseUrl + 'numbers/business-lines')
        cy.get('lib-burger-icon').click()
        interceptGetAgenziePDF()
        cy.contains('New Business Vita').click()
        canaleFromPopup()
        cy.wait('@getDacommerciale', { requestTimeout: 50000 });
        cy.wait(5000)
        getIFrame().find('[class="page-container"]:contains("Filtra"):visible')
        cy.get('a').contains('Numbers').click()
        cy.url().should('eq', baseUrl + 'numbers/business-lines')
    })

    it('Verifica aggancio New Business Allianz1', function () {
        cy.get('app-product-button-list').find('a').contains('Numbers').click()
        cy.url().should('eq', baseUrl + 'numbers/business-lines')
        cy.get('lib-burger-icon').click()
        interceptGetAgenziePDF()
        cy.contains('New Business Allianz1').click()
        canaleFromPopup()
        cy.wait('@getDacommerciale', { requestTimeout: 120000 });
        getIFrame().find('[class="page-container"]:contains("Filtra"):visible')
        cy.get('a').contains('Numbers').click()
        cy.url().should('eq', baseUrl + 'numbers/business-lines')
    })

    it('Verifica aggancio Monitoraggio PTF Danni', function () {
        cy.get('app-product-button-list').find('a').contains('Numbers').click()
        cy.url().should('eq', baseUrl + 'numbers/business-lines')
        cy.get('lib-burger-icon').click()
        interceptGetAgenziePDF()
        cy.contains('Monitoraggio PTF Danni').click()
        canaleFromPopup()
        cy.wait('@getDacommerciale', { requestTimeout: 30000 });
        getIFrame().find('[class="page-container"]:contains("Filtra"):visible')
        cy.get('a').contains('Numbers').click()
        cy.url().should('eq', baseUrl + 'numbers/business-lines')
    })

    it('Verifica aggancio Monitoraggio Riserve Vita', function () {
        cy.get('app-product-button-list').find('a').contains('Numbers').click()
        cy.url().should('eq', baseUrl + 'numbers/business-lines')
        cy.get('lib-burger-icon').click()
        interceptGetAgenziePDF()
        cy.contains('Monitoraggio Riserve Vita').click()
        canaleFromPopup()
        cy.wait('@getDacommerciale', { requestTimeout: 120000 });
        getIFrame().find('[class="page-container"]:contains("Filtra"):visible')
        cy.get('a').contains('Numbers').click()
        cy.url().should('eq', baseUrl + 'numbers/business-lines')
    })

    it('Verifica aggancio Retention Motor', function () {
        cy.get('app-product-button-list').find('a').contains('Numbers').click()
        cy.url().should('eq', baseUrl + 'numbers/business-lines')
        cy.get('lib-burger-icon').click()
        interceptGetAgenziePDF()
        cy.contains('Retention Motor').click()
        canaleFromPopup()
        cy.wait('@getDacommerciale', { requestTimeout: 30000 });
        getIFrame().find('[class="page-container"]:contains("Filtra"):visible')
        cy.get('a').contains('Numbers').click()
        cy.url().should('eq', baseUrl + 'numbers/business-lines')
    })

    it('Verifica aggancio Retention Rami Vari', function () {
        cy.get('app-product-button-list').find('a').contains('Numbers').click()
        cy.url().should('eq', baseUrl + 'numbers/business-lines')
        cy.get('lib-burger-icon').click()
        interceptGetAgenziePDF()
        cy.contains('Retention Rami Vari').click()
        canaleFromPopup()
        cy.wait('@getDacommerciale', { requestTimeout: 30000 });
        getIFrame().find('[class="page-container"]:contains("Filtra"):visible')
        cy.get('a').contains('Numbers').click()
        cy.url().should('eq', baseUrl + 'numbers/business-lines')
    })

    it('Verifica aggancio Monitoraggio Andamento Premi', function () {
        cy.get('app-product-button-list').find('a').contains('Numbers').click()
        cy.url().should('eq', baseUrl + 'numbers/business-lines')
        cy.get('lib-burger-icon').click()
        interceptGetAgenziePDF()
        cy.contains('Monitoraggio Andamento Premi').click()
        canaleFromPopup()
        cy.wait('@getDacommerciale', { requestTimeout: 30000 });
        getIFrame().find('[class="page-container"]:contains("Filtra"):visible')
        cy.get('a').contains('Numbers').click()
        cy.url().should('eq', baseUrl + 'numbers/business-lines')
    })

    it('Verifica aggancio Monitoraggio Ricavi d\'Agenzia', function () {
        cy.get('app-product-button-list').find('a').contains('Numbers').click()
        cy.url().should('eq', baseUrl + 'numbers/business-lines')
        cy.get('lib-burger-icon').click()
        interceptGetAgenziePDF()
        cy.contains('Monitoraggio Ricavi d\'Agenzia').click()
        canaleFromPopup()
        cy.wait('@getDacommerciale', { requestTimeout: 30000 });
        getIFrame().find('[class="page-container"]:contains("Filtra"):visible')
        cy.get('a').contains('Numbers').click()
        cy.url().should('eq', baseUrl + 'numbers/business-lines')
    })

    it('Verifica aggancio Capitale Vita Scadenza', function () {
        cy.get('app-product-button-list').find('a').contains('Numbers').click()
        cy.url().should('eq', baseUrl + 'numbers/business-lines')
        cy.get('lib-burger-icon').click()
        interceptGetAgenziePDF()
        cy.contains('Capitale Vita Scadenza').click()
        canaleFromPopup()
        cy.wait('@getDacommerciale', { requestTimeout: 30000 });
        getIFrame().find('[class="page-container"]:contains("Filtra"):visible')
        cy.get('a').contains('Numbers').click()
        cy.url().should('eq', baseUrl + 'numbers/business-lines')
    })
    //#endregion
})