/// <reference types="Cypress" />
/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 */
import Common from "../../mw_page_objects/common/Common"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import Numbers from "../../mw_page_objects/navigation/Numbers"

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

    it('Verifica dati scritti siano corretti nella pagina Linee di Business', function () {
        TopBar.clickNumbers()
        Numbers.checkCards()
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

    context('Tab: DANNI', () => {
        it('Verifica su Linee di Business - dal Tab DANNI l\'aggancio a New business', function () {
            TopBar.clickNumbers()
            Numbers.clickTab('LINEE DI BUSINESS', 'business-lines')
            Numbers.clickAndCheckAtterraggio('DANNI', 'New business')
            Numbers.backToNumbers('business-lines')
        })

        it('Verifica su Linee di Business - dal Tab DANNI l\'aggancio a Incassi', function () {
            TopBar.clickNumbers()
            Numbers.clickTab('LINEE DI BUSINESS', 'business-lines')
            Numbers.clickAndCheckAtterraggio('DANNI', 'Incassi')
            Numbers.backToNumbers('business-lines')

        })

        it('Verifica su Linee di Business - dal Tab DANNI l\'aggancio a Portafoglio', function () {
            TopBar.clickNumbers()
            Numbers.clickTab('LINEE DI BUSINESS', 'business-lines')
            Numbers.clickAndCheckAtterraggio('DANNI', 'Portafoglio')
            Numbers.backToNumbers('business-lines')
        })
    })
    context('Tab: MOTOR', () => {
        it('Verifica su Linee di Business - dal Tab MOTOR l\'aggancio a New business', function () {
            TopBar.clickNumbers()
            Numbers.clickTab('LINEE DI BUSINESS', 'business-lines')
            Numbers.clickAndCheckAtterraggio('MOTOR', 'New business')
            Numbers.backToNumbers('business-lines')
        })

        it('Verifica su Linee di Business - dal Tab MOTOR l\'aggancio a Incassi', function () {
            TopBar.clickNumbers()
            Numbers.clickTab('LINEE DI BUSINESS', 'business-lines')
            Numbers.clickAndCheckAtterraggio('MOTOR', 'Incassi')
            Numbers.backToNumbers('business-lines')
        })

        it('Verifica su Linee di Business - dal Tab MOTOR l\'aggancio a Portafoglio', function () {
            TopBar.clickNumbers()
            Numbers.clickTab('LINEE DI BUSINESS', 'business-lines')
            Numbers.clickAndCheckAtterraggio('MOTOR', 'Portafoglio')
            Numbers.backToNumbers('business-lines')
        })

        it('Verifica su Linee di Business - dal Tab MOTOR l\'aggancio a Retention', function () {
            TopBar.clickNumbers()
            Numbers.clickTab('LINEE DI BUSINESS', 'business-lines')
            Numbers.clickAndCheckAtterraggio('MOTOR', 'Retention')
            Numbers.backToNumbers('business-lines')
        })
    })

    context('Tab: RAMI VARI RETAIL', () => {
        it('Verifica su Linee di Business - dal Tab RAMI VARI RETAIL l\'aggancio a New business', function () {
            TopBar.clickNumbers()
            Numbers.clickTab('LINEE DI BUSINESS', 'business-lines')
            Numbers.clickAndCheckAtterraggio('RAMI VARI RETAIL', 'New business')
            Numbers.backToNumbers('business-lines')
        })

        it('Verifica su Linee di Business - dal Tab RAMI VARI RETAIL l\'aggancio a Incassi', function () {
            TopBar.clickNumbers()
            Numbers.clickTab('LINEE DI BUSINESS', 'business-lines')
            Numbers.clickAndCheckAtterraggio('RAMI VARI RETAIL', 'Incassi')
            Numbers.backToNumbers('business-lines')
        })

        it('Verifica su Linee di Business - dal Tab RAMI VARI RETAIL l\'aggancio a Portafoglio', function () {
            TopBar.clickNumbers()
            Numbers.clickTab('LINEE DI BUSINESS', 'business-lines')
            Numbers.clickAndCheckAtterraggio('RAMI VARI RETAIL', 'Portafoglio')
            Numbers.backToNumbers('business-lines')
        })
        it('Verifica su Linee di Business - dal Tab RAMI VARI RETAIL l\'aggancio a Retention', function () {
            TopBar.clickNumbers()
            Numbers.clickTab('LINEE DI BUSINESS', 'business-lines')
            Numbers.clickAndCheckAtterraggio('RAMI VARI RETAIL', 'Retention')
            Numbers.backToNumbers('business-lines')
        })
    })

    context('Tab: MIDCO', () => {
        it('Verifica su Linee di Business - dal Tab MIDCO l\'aggancio a New business', function () {
            TopBar.clickNumbers()
            Numbers.clickTab('LINEE DI BUSINESS', 'business-lines')
            Numbers.clickAndCheckAtterraggio('MIDCO', 'New business')
            Numbers.backToNumbers('business-lines')
        })

        it('Verifica su Linee di Business - dal Tab MIDCO l\'aggancio a Incassi', function () {
            TopBar.clickNumbers()
            Numbers.clickTab('LINEE DI BUSINESS', 'business-lines')
            Numbers.clickAndCheckAtterraggio('MIDCO', 'Incassi')
            Numbers.backToNumbers('business-lines')
        })

        it('Verifica su Linee di Business - dal Tab MIDCO l\'aggancio a Portafoglio', function () {
            TopBar.clickNumbers()
            Numbers.clickTab('LINEE DI BUSINESS', 'business-lines')
            Numbers.clickAndCheckAtterraggio('MIDCO', 'Portafoglio')
            Numbers.backToNumbers('business-lines')
        })

    })

    context('Tab: ALTRO', () => {
        it('Verifica su Linee di Business - dal Tab ALTRO l\'aggancio a New business', function () {
            TopBar.clickNumbers()
            Numbers.clickTab('LINEE DI BUSINESS', 'business-lines')
            Numbers.clickAndCheckAtterraggio('ALTRO', 'New business')
            Numbers.backToNumbers('business-lines')
        })

        it('Verifica su Linee di Business - dal Tab ALTRO l\'aggancio a Incassi', function () {
            TopBar.clickNumbers()
            Numbers.clickTab('LINEE DI BUSINESS', 'business-lines')
            Numbers.clickAndCheckAtterraggio('ALTRO', 'Incassi')
            Numbers.backToNumbers('business-lines')
        })

        it('Verifica su Linee di Business - dal Tab ALTRO l\'aggancio a Portafoglio', function () {
            TopBar.clickNumbers()
            Numbers.clickTab('LINEE DI BUSINESS', 'business-lines')
            Numbers.clickAndCheckAtterraggio('ALTRO', 'Portafoglio')
            Numbers.backToNumbers('business-lines')
        })

    })

    it('Verifica su Prodotti aggancio Primo indice prodotto', function () {
        TopBar.clickNumbers()
        Numbers.clickTab('PRODOTTI', 'products')
        Numbers.clickAndCheckAtterraggioPrimoIndiceProdotto()
        Numbers.backToNumbers('products')
    })

    it('Verifica su Indicatori Operativi aggancio  Monitoraggio carico', function () {
        TopBar.clickNumbers()
        Numbers.clickTab('INDICATORI OPERATIVI', 'operational-indicators')
        Numbers.clickAndCheckAtterraggioMonitoraggioCarico()
    })

    it('Verifica su Indicatori Operativi aggancio Primo indice digitale', function () {
        TopBar.clickNumbers()
        Numbers.clickTab('INDICATORI OPERATIVI', 'operational-indicators')
        Numbers.clickAndCheckAtterraggioPrimoIndiceDigitale()
        Numbers.backToNumbers('operational-indicators')
    })
 
    it('Verifica su Incentivi aggancio Primo indice dal Panel "GRUPPO INCENTIVATO 178 DAN"', function () {
        TopBar.clickNumbers()
        Numbers.clickTab('INCENTIVI', 'incentives')
        Numbers.checkAtterraggioPrimoIndiceIncentivi('GRUPPO INCENTIVATO 178 DAN')
        Numbers.backToNumbers('incentives')
    })

    it('Verifica su Incentivi aggancio Primo indice dal Panel "GRUPPO INCENTIVATO 178"', function () {
        TopBar.clickNumbers()
        Numbers.clickTab('INCENTIVI', 'incentives')
        Numbers.checkAtterraggioPrimoIndiceIncentivi('GRUPPO INCENTIVATO 178')
        Numbers.backToNumbers('incentives')
    })
});