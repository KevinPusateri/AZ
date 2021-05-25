/// <reference types="Cypress" />
/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 */
import Common from "../../mw_page_objects/common/Common"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import Numbers from "../../mw_page_objects/Navigation/Numbers"

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


describe('Matrix Web : Navigazioni da Numbers - ', function () {
    it('Verifica aggancio Numbers', function () {
        TopBar.clickNumbers()
    })

    it('Verifica Filtro', function () {
        TopBar.clickNumbers()
        Numbers.verificaFiltro()
    })

    it('Verifica PDF', function () {
        TopBar.clickNumbers()
        Numbers.verificaFiltro()
    })

    it('Verifica aggancio Ricavi di Agenzia', function () {
        TopBar.clickNumbers()
        Numbers.checkAtterraggioRicaviDiAgenzia()
        Numbers.backToNumbers('business-lines')
    })

    it('Verifica su Linee di Business aggancio New Business', function () {
        TopBar.clickNumbers()
        Numbers.clickTab('LINEE DI BUSINESS','business-lines')
        Numbers.clickAndCheckAtterraggioNewBusiness()
        Numbers.backToNumbers('business-lines')

    })

    it('Verifica su Linee di Business aggancio Incassi', function () {
        TopBar.clickNumbers()
        Numbers.clickTab('LINEE DI BUSINESS','business-lines')
        Numbers.clickAndCheckAtterraggioIncassi()
        Numbers.backToNumbers('business-lines')

    })

    it('Verifica su Linee di Business aggancio Portafoglio', function () {
        TopBar.clickNumbers()
        Numbers.clickTab('LINEE DI BUSINESS','business-lines')
        Numbers.clickAndCheckAtterraggioPortafoglio()
        Numbers.backToNumbers('business-lines')
    })

    it('Verifica su Prodotti aggancio Primo indice prodotto', function () {
        TopBar.clickNumbers()
        Numbers.clickTab('PRODOTTI','products')
        Numbers.clickAndCheckAtterraggioPrimoIndiceProdotto()
        Numbers.backToNumbers('products')
    })

    // Mancherebbe test su Monitoraggio carico
    it('Verifica su Indicatori Operativi aggancio Primo indice digitale', function () {
        TopBar.clickNumbers()
        Numbers.clickTab('INDICATORI OPERATIVI','operational-indicators')
        Numbers.clickAndCheckAtterraggioPrimoIndiceDigitale()
        Numbers.backToNumbers('operational-indicators')
    })

    it('Verifica aggancio su Incentivi', function () {
        TopBar.clickNumbers()
        Numbers.clickTab('INCENTIVI','incentives')
        Numbers.checkAtterraggioIncentivi()
    })
});