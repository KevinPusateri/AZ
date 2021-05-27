/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 * @author Andrea 'Bobo' Oboe <andrea.oboe@allianz.it>
 */

/// <reference types="Cypress" />
import Common from "../../mw_page_objects/common/Common"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import Clients from "../../mw_page_objects/clients/LandingClients";

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


describe('Matrix Web : Navigazioni da Clients', function () {

    it('Verifica aggancio Clients', function () {
        TopBar.clickClients()
    });

    it('Verifica presenza dei collegamenti rapidi',function() {
        TopBar.clickClients()
        Clients.checkExistLinksCollegamentiRapidi()
    })

    // TODO: NEW PAGINA con firefox
    it('Verifica aggancio Analisi dei bisogni', function () {
        TopBar.clickClients()
        Clients.clickLinkRapido('Analisi dei bisogni')
    });

    it('Verifica aggancio Digital Me', function () {
        TopBar.clickClients()
        Clients.clickLinkRapido('Digital Me')
        Clients.backToClients()
    });

    it('Verifica aggancio Pannello anomalie', function () {
        TopBar.clickClients()
        Clients.clickLinkRapido('Pannello anomalie')
        Clients.backToClients()
    });

    it('Verifica aggancio Clienti duplicati', function () {
        TopBar.clickClients()
        Clients.clickLinkRapido('Clienti duplicati')
        Clients.backToClients()
    });

    it('Verifica aggancio Antiriciclaggio', function () {
        TopBar.clickClients()
        Clients.clickLinkRapido('Antiriciclaggio')
        Clients.backToClients()
    });

    it('Verifica aggancio Nuovo cliente', function () {
        TopBar.clickClients()
        Clients.clickNuovoCliente()
        Clients.backToClients()
    });

    it('Verifica aggancio Vai a visione globale', function () {
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
        Clients.verificaVediTutte()

    });
})