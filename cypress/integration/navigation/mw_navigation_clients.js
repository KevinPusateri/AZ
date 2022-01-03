/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 * @author Andrea 'Bobo' Oboe <andrea.oboe@allianz.it>
 */

/// <reference types="Cypress" />
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import Clients from "../../mw_page_objects/clients/LandingClients";
import HomePage from "../../mw_page_objects/common/HomePage";

//#region Mysql DB Variables
const testName = Cypress.spec.name.split('/')[1].split('.')[0].toUpperCase()
const currentEnv = Cypress.env('currentEnv')
const dbConfig = Cypress.env('db')
let insertedId
//#endregion

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)
//#endregion

let keys = {
    ANALISI_DEI_BISOGNI: true,
    PANNELLO_ANOMALIE: true,
    CLIENTI_DUPLICATI: true,
    ANTIRICICLAGGIO: true,
    HOSPITAL_SCANNER: true,
}
before(() => {
    cy.getUserWinLogin().then(data => {
        cy.startMysql(dbConfig, testName, currentEnv, data).then((id) => insertedId = id)
        LoginPage.logInMWAdvanced()
        cy.getProfiling(data.tutf).then(profiling => {
            cy.filterProfile(profiling, 'PO_DATA_QUALITY').then(profiled => { keys.PANNELLO_ANOMALIE = profiled })
            cy.filterProfile(profiling, 'COMMON_CLIENTE_SOGGETTI_DUPLICATI').then(profiled => { keys.CLIENTI_DUPLICATI = profiled })
            cy.filterProfile(profiling, 'PO_ANTIRICICLAGGIO').then(profiled => { keys.ANTIRICICLAGGIO = profiled })
            cy.filterProfile(profiling, 'HOSPITAL_SCANNER').then(profiled => { keys.HOSPITAL_SCANNER = profiled })
        })
    })
})

beforeEach(() => {
    cy.preserveCookies()
    HomePage.reloadMWHomePage()
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


describe('Matrix Web : Navigazioni da Clients', function () {

    it('Verifica aggancio Clients', function () {
        TopBar.clickClients()
    });

    it('Verifica presenza dei collegamenti rapidi', function () {
        TopBar.clickClients()
        Clients.checkExistLinksCollegamentiRapidi(keys)
    })

    it('Verifica aggancio Analisi dei bisogni', function () {
        cy.task('getHostName').then(hostName => {
            let currentHostName = hostName
            if (!currentHostName.includes('SM')) {
                TopBar.clickClients()
                Clients.clickLinkRapido('Analisi dei bisogni')
            }
        })

    });

    it('Verifica aggancio Digital Me', function () {
        TopBar.clickClients()
        Clients.clickLinkRapido('Digital Me')
        Clients.backToClients()
    });

    it('Verifica aggancio Pannello anomalie', function () {
        if (!keys.PANNELLO_ANOMALIE)
            this.skip()
        TopBar.clickClients()
        Clients.clickLinkRapido('Pannello anomalie')
        Clients.backToClients()
    });

    it('Verifica aggancio Clienti duplicati', function () {
        if (!keys.CLIENTI_DUPLICATI)
            this.skip()
        TopBar.clickClients()
        Clients.clickLinkRapido('Clienti duplicati')
        Clients.backToClients()
    });

    it('Verifica aggancio Antiriciclaggio', function () {
        if (!keys.ANTIRICICLAGGIO)
            this.skip()
        TopBar.clickClients()
        Clients.clickLinkRapido('Antiriciclaggio')
        Clients.backToClients()
    });

    it('Verifica aggancio Nuovo cliente', function () {
        TopBar.clickClients()
        Clients.clickNuovoCliente()
        Clients.backToClients()
    });

    it('Verifica che il contenuto di Visione globale cliente sia presente', function () {
        if (Cypress.env('isAviva'))
            this.skip()
        TopBar.clickClients()
        Clients.checkVisioneGlobaleCliente()
    })

    it('Verifica aggancio Vai a visione globale', function () {
        if (Cypress.env('isAviva'))
            this.skip()
        TopBar.clickClients()
        Clients.clickVisioneGlobale()
        Clients.backToClients()
    });

    it('Verifica aggancio Appuntamenti', function () {
        TopBar.clickClients()
        Clients.clickAppuntamenti()
    });

    it('Verifica aggancio Richiesta Digital Me', function () {
        TopBar.clickClients()
        Clients.verificaRichiesteDigitalMe()
    });

    it('Verifica aggancio Richiesta Digital Me - button Vedi tutte', function () {
        TopBar.clickClients()
        Clients.clickVediTutte()
        Clients.checkDigitalMe()
    });
})