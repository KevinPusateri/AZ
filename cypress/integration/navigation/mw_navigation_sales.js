/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 * @author Andrea 'Bobo' Oboe <andrea.oboe@allianz.it>
 */
/// <reference types="Cypress" />

import Common from "../../mw_page_objects/common/Common"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import Sales from "../../mw_page_objects/Navigation/Sales"

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


describe('Matrix Web : Navigazioni da Sales', function() {

    it('Verifica aggancio Sales', function() {
        TopBar.clickSales()
    })

    it('Verifica presenza dei collegamenti rapidi', function() {
        TopBar.clickSales()
        Sales.checkExistLinksCollegamentiRapidi()
    })

    it('Verifica aggancio Nuovo Sfera', function() {
        if (!Cypress.env('monoUtenza')) {
            TopBar.clickSales()
            Sales.clickLinkRapido('Nuovo Sfera')
            Sales.backToSales()
        } else this.skip()
    })

    it('Verifica aggancio Sfera', function() {
        TopBar.clickSales()
        Sales.clickLinkRapido('Sfera')
        Sales.backToSales()
    })

    it('Verifica aggancio Campagne Commerciali', function() {
        TopBar.clickSales()
        Sales.clickLinkRapido('Campagne Commerciali')
        Sales.backToSales()
    })

    it('Verifica aggancio Recupero preventivi e quotazioni', function() {
        TopBar.clickSales()
        Sales.clickLinkRapido('Recupero preventivi e quotazioni')
        Sales.backToSales()
    })

    it('Verifica aggancio Monitoraggio Polizze Proposte', function() {
        TopBar.clickSales()
        Sales.clickLinkRapido('Monitoraggio Polizze Proposte')
        Sales.backToSales()
    })

    it('Verifica la presenza dei link su "Emetti Polizza"', function() {
        TopBar.clickSales()
        Sales.checkLinksOnEmettiPolizza()
    })

    it('Verifica aggancio Emetti Polizza - Preventivo Motor', function() {
        TopBar.clickSales()
        Sales.clickLinkOnEmettiPolizza('Preventivo Motor')
        Sales.backToSales()
    })

    it('Verifica aggancio Emetti Polizza - Allianz Ultra Casa e Patrimonio', function() {
        TopBar.clickSales()
        Sales.clickLinkOnEmettiPolizza('Allianz Ultra Casa e Patrimonio')
        Sales.backToSales()
    })

    it('Verifica aggancio Emetti Polizza - Allianz Ultra Salute', function() {
        TopBar.clickSales()
        Sales.clickLinkOnEmettiPolizza('Allianz Ultra Salute')
        Sales.backToSales()
    })

    it('Verifica aggancio Emetti Polizza - Allianz Ultra Casa e Patrimonio BMP', function() {
        if (!Cypress.env('monoUtenza')) {
            TopBar.clickSales()
            Sales.clickLinkOnEmettiPolizza('Allianz Ultra Casa e Patrimonio BMP')
            Sales.backToSales()
        } else this.skip()
    })

    it('Verifica aggancio Emetti Polizza - Allianz1 Business', function() {
        TopBar.clickSales()
        Sales.clickLinkOnEmettiPolizza('Allianz1 Business')
        Sales.backToSales()
    })

    it('Verifica aggancio Emetti Polizza - FastQuote Impresa e Albergo', function() {
        TopBar.clickSales()
        Sales.clickLinkOnEmettiPolizza('FastQuote Impresa e Albergo')
        Sales.backToSales()
    })

    it('Verifica aggancio Emetti Polizza - Flotte e Convenzioni', function() {
        TopBar.clickSales()
        Sales.clickLinkOnEmettiPolizza('Flotte e Convenzioni')
        Sales.backToSales()
    })

    it('Verifica aggancio Emetti Polizza - Preventivo anonimo Vita Individuali', function() {
        TopBar.clickSales()
        Sales.clickLinkOnEmettiPolizza('Preventivo anonimo Vita Individuali')
        Sales.backToSales()
    })

    it('Verifica aggancio Emetti Polizza - MiniFlotte', function() {
        TopBar.clickSales()
        Sales.clickLinkOnEmettiPolizza('MiniFlotte')
        Sales.backToSales()
    })

    it('Verifica aggancio Emetti Polizza - Trattative Auto Corporate', function() {
        TopBar.clickSales()
        Sales.clickLinkOnEmettiPolizza('Trattative Auto Corporate')
        Sales.backToSales()
    })

    it('Verifica tab "Pezzi"', function() {
        if (!Cypress.env('monoUtenza')) {
            TopBar.clickSales()
            Sales.checkExistPezzi()
        } else this.skip()
    })

    it('Verifica "Premi"', function() {
        if (!Cypress.env('monoUtenza')) {
            TopBar.clickSales()
            Sales.checkExistPremi()
        } else this.skip()
    })

    it('Verifica aggancio Attività in scadenza - Estrai dettaglio', function() {
        TopBar.clickSales()
        if (!Cypress.env('monoUtenza')) {
            Sales.clickAttivitaInScadenza()
        }
        Sales.clickEstraiDettaglio()
        Sales.backToSales()
    })

    it('Verifica "Quietanzamento" - lob di interesse: Motor', function() {
        if (!Cypress.env('monoUtenza')) {
            TopBar.clickSales()
            Sales.lobDiInteresse('Motor')
            Sales.backToSales()
        } else this.skip()
    })

    it('Verifica "Quietanzamento" - lob di interesse: Rami Vari', function() {
        if (!Cypress.env('monoUtenza')) {
            TopBar.clickSales()
            Sales.lobDiInteresse('Rami vari')
            Sales.backToSales()
        } else this.skip()
    })

    it('Verifica "Quietanzamento" - lob di interesse: Vita', function() {
        if (!Cypress.env('monoUtenza')) {
            TopBar.clickSales()
            Sales.lobDiInteresse('Vita')
            Sales.backToSales()
        } else this.skip()
    })

    it('Verifica "Quietanzamento" - lob di interesse: Tutte', function() {
        if (!Cypress.env('monoUtenza')) {
            TopBar.clickSales()
            Sales.lobDiInteresse('Tutte')
            Sales.backToSales()
        } else this.skip()
    })

    it('Verifica TAB: "Campagne"', function() {
        if (!Cypress.env('monoUtenza')) {
            TopBar.clickSales()
            Sales.clickTabCampagne()
        } else this.skip()
    })

    it('Verifica aggancio Appuntamento', function() {
        TopBar.clickSales()
        Sales.clickAppuntamento()
    })
    it('Verifica aggancio Preventivi e quotazioni - Card Danni', function() {
        TopBar.clickSales()
        Sales.clickPreventiviQuotazioniOnTabDanni()
        Sales.clickPrimaCardDanniOnPreventivo()
        Sales.backToSales()
    })

    it('Verifica aggancio Preventivi e quotazioni Danni - button: Vedi Tutti', function() {
        TopBar.clickSales()
        Sales.clickPreventiviQuotazioniOnTabDanni()
        Sales.clickButtonVediTutti()
        Sales.backToSales()
    })

    it('Verifica aggancio Preventivi e quotazioni - Card Vita', function() {
        TopBar.clickSales()
        Sales.clickPreventiviQuotazioniOnTabVita()
        Sales.clickPrimACardVitaOnPreventivo()
        Sales.backToSales()
    })

    it('Verifica aggancio Preventivi e quotazioni Vita - button: Vedi Tutti', function() {
        TopBar.clickSales()
        Sales.clickPreventiviQuotazioniOnTabVita()
        Sales.clickButtonVediTutti()
        Sales.backToSales()
    })

    it('Verifica aggancio Proposte Danni - Card Danni', function() {
        TopBar.clickSales()
        Sales.clickTabDanniOnProposte()
        Sales.clickPrimaCardDanniOnProposte()
        Sales.backToSales()
    })

    it('Verifica aggancio Proposte Danni - button: Vedi Tutte', function() {
        TopBar.clickSales()
        Sales.clickTabDanniOnProposte()
        Sales.clickButtonVediTutte()
        Sales.backToSales()
    })

    it('Verifica aggancio Proposte Vita - Card Vita', function() {
        TopBar.clickSales()
        Sales.clickTabVitaOnProposte()
        Sales.clickPrimaCardVitaOnProposte()
        Sales.backToSales()
    })

    it('Verifica aggancio Proposte Vita - button: Vedi Tutte', function() {
        TopBar.clickSales()
        Sales.clickTabVitaOnProposte()
        Sales.clickButtonVediTutte()
        Sales.backToSales()
    })

});