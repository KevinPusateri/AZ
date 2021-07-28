/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 * @author Andrea 'Bobo' Oboe <andrea.oboe@allianz.it>
*/
/// <reference types="Cypress" />

import Common from "../../mw_page_objects/common/Common"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import Sales from "../../mw_page_objects/Navigation/Sales"

//#region Username Variables
const userName = 'TUTF021'
const psw = 'P@ssw0rd!'
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
    cy.task('startMyql', { dbConfig: dbConfig, testCaseName: testName, currentEnv: currentEnv, currentUser: userName }).then((results) => {
        insertedId = results.insertId
    })
    LoginPage.logInMW(userName, psw)
})

beforeEach(() => {
    Common.visitUrlOnEnv()
    cy.preserveCookies()
})

after(function () {
    //#region Mysql
    cy.getTestsInfos(this.test.parent.suites[0].tests).then(testsInfo => {
        let tests = testsInfo
        cy.task('finishMyql', { dbConfig: dbConfig, rowId: insertedId, tests })
    })
    //#endregion

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

    it('Verifica aggancio Nuovo Sfera', function () {
        TopBar.clickSales()
        Sales.clickLinkRapido('Nuovo Sfera')
        Sales.backToSales()
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

    it('Verifica la presenza dei link su "Emetti Polizza"', function () {
        TopBar.clickSales()
        Sales.checkLinksOnEmettiPolizza()
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

    it('Verifica tab "Pezzi"', function () {

        TopBar.clickSales()
        Sales.checkExistPezzi()
    })

    it('Verifica "Premi"', function () {

        TopBar.clickSales()
        Sales.checkExistPremi()
    })

    it('Verifica aggancio Attività in scadenza - Estrai dettaglio', function () {
        TopBar.clickSales()
        Sales.clickAttivitaInScadenza()
        Sales.clickEstraiDettaglio()
        Sales.backToSales()
    })

    it('Verifica "Quietanamento" - lob di interesse: Motor', function () {
        TopBar.clickSales()
        Sales.lobDiInteresse()
        Sales.backToSales()
    })

    it('Verifica "Quietanamento" - lob di interesse: Rami Vari', function () {
        TopBar.clickSales()        
        Sales.lobDiInteresse()
        Sales.backToSales()
    })

    it('Verifica "Quietanamento" - lob di interesse: Vita', function () {
        TopBar.clickSales()
        Sales.lobDiInteresse()
        Sales.backToSales()

    })

    it('Verifica "Quietanamento" - lob di interesse: Tutte', function () {
        TopBar.clickSales()
        Sales.lobDiInteresse()
        Sales.backToSales()
    })

    it('Verifica TAB: "Campagne"', function () {
        TopBar.clickSales()
        Sales.clickTabCampagne()
    })

    it('Verifica aggancio Appuntamento', function () {
        TopBar.clickSales()
        Sales.clickAppuntamento()
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

    it('Verifica aggancio Proposte Vita - Card Vita', function () {
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