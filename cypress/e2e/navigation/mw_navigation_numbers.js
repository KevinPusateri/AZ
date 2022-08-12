/// <reference types="Cypress" />
/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 */
import Common from "../../mw_page_objects/common/Common"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import Numbers from "../../mw_page_objects/navigation/Numbers"

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
    cy.getUserWinLogin().then(data => {
        cy.startMysql(dbConfig, testName, currentEnv, data).then((id) => insertedId = id)
        LoginPage.logInMWAdvanced()
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

    if (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker')) {
        it('Verifica su Linee di Business - dal Tab MOTOR l\'aggancio a Retention', function () {
            TopBar.clickNumbers()
            Numbers.clickTab('LINEE DI BUSINESS', 'business-lines')
            Numbers.clickAndCheckAtterraggio('MOTOR', 'Retention')
            Numbers.backToNumbers('business-lines')
        })
    }

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

    if (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker')) {
        it('Verifica su Linee di Business - dal Tab RAMI VARI RETAIL l\'aggancio a Retention', function () {
            TopBar.clickNumbers()
            Numbers.clickTab('LINEE DI BUSINESS', 'business-lines')
            Numbers.clickAndCheckAtterraggio('RAMI VARI RETAIL', 'Retention')
            Numbers.backToNumbers('business-lines')
        })
    }

    if (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker')) {
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
    }

    it('Verifica su Prodotti aggancio Primo indice prodotto', function () {
        TopBar.clickNumbers()
        Numbers.clickTab('PRODOTTI', 'products')
        Numbers.clickAndCheckAtterraggioPrimoIndiceProdotto()
        Numbers.backToNumbers('products')
    })

    if (!Cypress.env('isAviva') && !Cypress.env('isAvivaBroker')) {
        it('Verifica su Indicatori Operativi aggancio  Monitoraggio carico', function () {
            TopBar.clickNumbers()
            Numbers.clickTab('INDICATORI OPERATIVI', 'operational-indicators')
            Numbers.clickAndCheckAtterraggioMonitoraggioCarico()
        })

        it('Verifica su Incentivi aggancio Primo indice dal Panel "GRUPPO INCENTIVATO 178 DAN"', function () {
            TopBar.clickNumbers()
            Numbers.filtri('2021')
            Numbers.clickTab('INCENTIVI', 'incentives')
            Numbers.checkAtterraggioPrimoIndiceIncentivi('GRUPPO INCENTIVATO 178 DAN')
            Numbers.backToNumbers('incentives')
        })

        it('Verifica su Incentivi aggancio Primo indice dal Panel "GRUPPO INCENTIVATO 178"', function () {
            if (!Cypress.env('monoUtenza')) {
                TopBar.clickNumbers()
                Numbers.filtri('2021')
                Numbers.clickTab('INCENTIVI', 'incentives')
                Numbers.checkAtterraggioPrimoIndiceIncentivi('GRUPPO INCENTIVATO 178')
                Numbers.backToNumbers('incentives')
            } else this.skip()
        })

        if (Cypress.env('monoUtenza')) {
            it('Verifica su Incentivi aggancio Primo indice dal Panel "AGENZIA 7 - 4549 MONZA"', function () {
                TopBar.clickNumbers()
                Numbers.filtri('2021')
                Numbers.clickTab('INCENTIVI', 'incentives')
                Numbers.checkAtterraggioPrimoIndiceIncentivi('AGENZIA 7 - 4549 MONZA')
                Numbers.backToNumbers('incentives')
            })
        }

        it('Verifica su Indicatori Operativi aggancio Primo indice digitale', function () {
            TopBar.clickNumbers()
            //Indici Presenti nel periodo 2022
            Numbers.filtri('2022')
            Numbers.clickTab('INDICATORI OPERATIVI', 'operational-indicators')
            Numbers.clickAndCheckAtterraggioPrimoIndiceDigitale()
            Numbers.backToNumbers('operational-indicators')
        })
    }
});