/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 * @author Andrea 'Bobo' Oboe <andrea.oboe@allianz.it>
*/
/// <reference types="Cypress" />

import Common from "../../mw_page_objects/common/Common"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import Sales from "../../mw_page_objects/Navigation/Sales"

//#region Variables
const userName = 'TUTF021'
const psw = 'P@ssw0rd!'
//#endregion

//#region Configuration
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


describe('Matrix Web : Navigazioni da Sales', function () {

    it('Verifica aggancio Sales', function () {
        TopBar.clickSales()
    })

    it('Verifica presenza dei collegamenti rapidi', function () {
        TopBar.clickSales()
        Sales.checkExistLinksCollegamentiRapidi()
    })

    it('Verifica aggancio Sfera', function () {
        TopBar.clickSales()
        Sales.clickLinkRapido('Sfera')
        Sales.backToSales()
    })

    it('Verifica aggancio Campagne Commerciali', function () {
        TopBar.clickSales()
        Sales.clickLinkRapido('Campagne Commerciali')
        Sales.backToSales()
    })

    it('Verifica aggancio Recupero preventivi e quotazioni', function () {
        TopBar.clickSales()
        Sales.clickLinkRapido('Recupero preventivi e quotazioni')
        Sales.backToSales()
    })

    it('Verifica aggancio Monitoraggio Polizze Proposte', function () {
        TopBar.clickSales()
        Sales.clickLinkRapido('Monitoraggio Polizze Proposte')
        Sales.backToSales()
    })

    it('Verifica aggancio Emetti Polizza - Preventivo Motor', function () {
        TopBar.clickSales()
        Sales.clickLinkOnEmettiPolizza('Preventivo Motor')
        Sales.backToSales()
    })

    it('Verifica aggancio Emetti Polizza - Allianz Ultra Casa e Patrimonio', function () {
        TopBar.clickSales()
        Sales.clickLinkOnEmettiPolizza('Allianz Ultra Casa e Patrimonio')
        Sales.backToSales()
    })

    it('Verifica aggancio Emetti Polizza - Allianz Ultra Salute', function () {
        TopBar.clickSales()
        Sales.clickLinkOnEmettiPolizza('Allianz Ultra Salute')
        Sales.backToSales()
    })

    it('Verifica aggancio Emetti Polizza - Allianz Ultra Casa e Patrimonio BMP', function () {
        TopBar.clickSales()
        Sales.clickLinkOnEmettiPolizza('Allianz Ultra Casa e Patrimonio BMP')
        Sales.backToSales()
    })

    it('Verifica aggancio Emetti Polizza - Allianz1 Business', function () {
        TopBar.clickSales()
        Sales.clickLinkOnEmettiPolizza('Allianz1 Business')
        Sales.backToSales()
    })

    it('Verifica aggancio Emetti Polizza - FastQuote Impresa e Albergo', function () {
        TopBar.clickSales()
        Sales.clickLinkOnEmettiPolizza('FastQuote Impresa e Albergo')
        Sales.backToSales()
    })

    it('Verifica aggancio Emetti Polizza - Flotte e Convenzioni', function () {
        TopBar.clickSales()
        Sales.clickLinkOnEmettiPolizza('Flotte e Convenzioni')
        Sales.backToSales()
    })

    it('Verifica aggancio Emetti Polizza - Preventivo anonimo Vita Individuali', function () {
        TopBar.clickSales()
        Sales.clickLinkOnEmettiPolizza('Preventivo anonimo Vita Individuali')
        Sales.backToSales()
    })

    it('Verifica aggancio Emetti Polizza - MiniFlotte', function () {
        TopBar.clickSales()
        Sales.clickLinkOnEmettiPolizza('MiniFlotte')
        Sales.backToSales()
    })

    it('Verifica aggancio Emetti Polizza - Trattative Auto Corporate', function () {
        TopBar.clickSales()
        Sales.clickLinkOnEmettiPolizza('Trattative Auto Corporate')
        Sales.backToSales()
    })

    it('Verifica aggancio Emetti Polizza - Gestione Richieste per PA', function () {
        TopBar.clickSales()
        Sales.clickLinkOnEmettiPolizza('Gestione Richieste per PA')
        Sales.backToSales()
    })

    it('Verifica aggancio Estrai dettaglio', function () {
        TopBar.clickSales()
        Sales.clickAttivitaInScadenza()
        Sales.clickEstraiDettaglio()
        Sales.backToSales()
    })

    it('Verifica aggancio Appuntamento', function () {
        TopBar.clickSales()
        Sales.clickAppuntamento()
    })

    it('Verifica aggancio News image Primo comandamento', function () {
        TopBar.clickSales()
        Sales.clickNewsImagePrimoComandamento()
        Sales.backToSales()
    })

    it('Verifica aggancio Preventivi e quotazioni - Card Danni', function () {
        TopBar.clickSales()
        Sales.clickPreventiviQuotazioniOnTabDanni()
        Sales.clickPrimaCardDanniOnPreventivo()
        Sales.backToSales()
    })

    it('Verifica aggancio Preventivi e quotazioni Danni - button: Vedi Tutti', function () {
        TopBar.clickSales()
        Sales.clickPreventiviQuotazioniOnTabDanni()
        Sales.clickButtonVediTutti()
        Sales.backToSales()
    })

    it('Verifica aggancio Preventivi e quotazioni - Card Vita', function () {
        TopBar.clickSales()
        Sales.clickPreventiviQuotazioniOnTabVita()
        Sales.clickPrimACardVitaOnPreventivo()
        Sales.backToSales()
    })

    it('Verifica aggancio Preventivi e quotazioni Vita - button: Vedi Tutti', function () {
        TopBar.clickSales()
        Sales.clickPreventiviQuotazioniOnTabVita()
        Sales.clickButtonVediTutti()
        Sales.backToSales()
    })

    it('Verifica aggancio Proposte Danni - Card Danni', function () {
        TopBar.clickSales()
        Sales.clickTabDanniOnProposte()
        Sales.clickPrimaCardDanniOnProposte()
        Sales.backToSales()
    })


    it('Verifica aggancio Proposte Danni - button: Vedi Tutte', function () {
        TopBar.clickSales()
        Sales.clickTabDanniOnProposte()
        Sales.clickButtonVediTutte()
        Sales.backToSales()
    })

    // NEW
    it('Verifica aggancio Proposte Vita - Card Vita', function(){
        TopBar.clickSales()
        Sales.clickTabVitaOnProposte()
        Sales.clickPrimaCardVitaOnProposte()
        Sales.backToSales()
    })

    it('Verifica aggancio Proposte Vita - button: Vedi Tutte', function () {
        TopBar.clickSales()
        Sales.clickTabVitaOnProposte()
        Sales.clickButtonVediTutte()
        Sales.backToSales()
    })

});