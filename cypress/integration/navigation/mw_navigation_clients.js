/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 * @author Andrea 'Bobo' Oboe <andrea.oboe@allianz.it>
 */

/// <reference types="Cypress" />
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import Clients from "../../mw_page_objects/clients/LandingClients";
import HomePage from "../../mw_page_objects/common/HomePage";

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
    cy.task('startMysql', { dbConfig: dbConfig, testCaseName: testName, currentEnv: currentEnv, currentUser: userName }).then((results) => {
        insertedId = results.insertId
    })
    LoginPage.logInMW(userName, psw)
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
        cy.task('finishMysql', { dbConfig: dbConfig, rowId: insertedId, tests })
    })
    //#endregion

})


describe('Matrix Web : Navigazioni da Clients', function () {

    it('Verifica aggancio Clients', function () {
        TopBar.clickClients()
    });

    it('Verifica presenza dei collegamenti rapidi', function () {
        TopBar.clickClients()
        Clients.checkExistLinksCollegamentiRapidi()
    })

    it('Verifica aggancio Analisi dei bisogni', function () {
        cy.task('getHostName').then(hostName => {
            let currentHostName = hostName
            if (currentHostName.startsWith('SM'))
                this.skip()
            else {
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

    it('Verifica che il contenuto di Visione globale cliente sia presente', function () {
        TopBar.clickClients()
        Clients.checkVisioneGlobaleCliente()
    })

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
        Clients.clickVediTutte()
        Clients.checkDigitalMe()
    });
})