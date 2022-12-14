/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 */

import Common from "../../mw_page_objects/common/Common"
import LoginPage from "../../mw_page_objects/common/LoginPage"
import TopBar from "../../mw_page_objects/common/TopBar"
import BurgerMenuClients from "../../mw_page_objects/burgerMenu/BurgerMenuClients"
import Clients from "../../mw_page_objects/clients/LandingClients"
import HomePage from "../../mw_page_objects/common/HomePage"

//#region Mysql DB Variables
// const testName = Cypress.spec.name.split('.')[0].toUpperCase()
const testName = Cypress.spec.name.split('.')[0].toUpperCase()
const currentEnv = Cypress.env('currentEnv')
const dbConfig = Cypress.env('db')
let insertedId
//#endregion

//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)
var url = Common.getUrlBeforeEach() + 'clients/'
let options = {
    retries: {
        runMode: 0,
        openMode: 0,
    }
}
const linksBurger = BurgerMenuClients.getLinks()
//#endregion

let keys = {
    CENSIMENTO_NUOVO_CLIENTE: true,
    PANNELLO_ANOMALIE: true,
    CLIENTI_DUPLICATI: true,
    CANCELLAZIONE_CLIENTI: true,
    CANCELLAZIONE_CLIENTI_PER_FONTE: true,
    GESTIONE_FONTE_PRINCIPALE: true,
    ANTIRICICLAGGIO: true,
    HOSPITAL_SCANNER: true,
    CONSENSI_EMAIL_SUI_CONTRATTI: true,
}

let keyDigitalMe = {
    PUBBLICAZIONE_PROPOSTE: true
}
before(() => {

    cy.getUserWinLogin().then(data => {
        cy.startMysql(dbConfig, testName, currentEnv, data).then((id) => insertedId = id)
        LoginPage.logInMWAdvanced()
        cy.getProfiling(data.tutf).then(profiling => {
            cy.filterProfile(profiling, 'CLIENTE_CENSIMENTO').then(profiled => { keys.CENSIMENTO_NUOVO_CLIENTE = profiled })
            cy.filterProfile(profiling, 'PO_DATA_QUALITY').then(profiled => { keys.PANNELLO_ANOMALIE = profiled })
            cy.filterProfile(profiling, 'COMMON_CLIENTE_SOGGETTI_DUPLICATI').then(profiled => { keys.CLIENTI_DUPLICATI = profiled })
            cy.filterProfile(profiling, 'COMMON_CLIENTE_CANCELLAZIONE').then(profiled => { keys.CANCELLAZIONE_CLIENTI = profiled })
            cy.filterProfile(profiling, 'COMMON_CLIENTE_GESTIONE_FONTE_PRINCIPALE').then(profiled => { keys.CANCELLAZIONE_CLIENTI_PER_FONTE = profiled })
            cy.filterProfile(profiling, 'PO_ANTIRICICLAGGIO').then(profiled => { keys.ANTIRICICLAGGIO = profiled })
            cy.filterProfile(profiling, 'HOSPITAL_SCANNER').then(profiled => { keys.HOSPITAL_SCANNER = profiled })
            cy.filterProfile(profiling, 'DIGITALME_OFFERTA').then(profiled => { keyDigitalMe.PUBBLICAZIONE_PROPOSTE = profiled })
            cy.filterProfile(profiling, 'CLIENTE_MODIFICA_ANAGRAFICA').then(profiled => { keys.CONSENSI_EMAIL_SUI_CONTRATTI = profiled })
        })
    })
    TopBar.clickClients()
})

beforeEach(() => {
    cy.preserveCookies()
    cy.ignoreRequest()
    BurgerMenuClients.clickBurgerMenu()
})

afterEach(function () {
    cy.task('getHostName').then(hostName => {
        //! Eseguire i test su vedi file BurgerMenuLinkEsterni.js
        //! Settare HTTP_PROXY e NO_PROXY(vedi file BurgerMenuLinkEsterni.js)
        if (this.currentTest.title.includes(linksBurger.ANALISI_DEI_BISOGNI) ||
            this.currentTest.title.includes(linksBurger.HOSPITAL_SCANNER)) {
            if (!hostName.includes('SM')) {
                cy.task('warn', 'WARN --> Eseguire questo Test in Locale settando il Proxy')
            } else {
                cy.task('warnTFS', 'WARN --> Eseguire questo Test in settando il Proxy')
            }
        }
    })

    if (this.currentTest.state !== 'passed') {
        cy.ignoreRequest()
        cy.visit(url)
        cy.wait(3000)
    }
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

describe('Matrix Web : Navigazioni da Burger Menu in Clients', options, function () {

    it('Verifica i link da Burger Menu', function () {

        BurgerMenuClients.checkExistLinks(keys)
    });

    it('Verifica aggancio Analisi dei bisogni', function () {
        if (Cypress.env('isAviva') || Cypress.env('isAvivaBroker'))
            this.skip()

        this.skip() //FORZATO testare su BurgerMenuLinkEsterni
        BurgerMenuClients.clickLink('Analisi dei bisogni', false)
    });

    it('Verifica aggancio Censimento nuovo cliente', function () {
        if (!keys.CENSIMENTO_NUOVO_CLIENTE)
            this.skip()

        BurgerMenuClients.clickLink('Censimento nuovo cliente', false)
        BurgerMenuClients.backToClients()
    });

    it('Verifica aggancio Digital Me', function () {

        BurgerMenuClients.clickLink('Digital Me', false)
        Clients.checkDigitalMe(keyDigitalMe)
        BurgerMenuClients.backToClients()
    });

    it('Verifica aggancio Pannello anomalie', function () {
        if (!keys.PANNELLO_ANOMALIE)
            this.skip()

        BurgerMenuClients.clickLink('Pannello anomalie', false)
        BurgerMenuClients.backToClients()
    });

    it('Verifica aggancio Clienti duplicati', function () {
        if (!keys.CLIENTI_DUPLICATI)
            this.skip()

        BurgerMenuClients.clickLink('Clienti duplicati', false)
        BurgerMenuClients.backToClients()
    });

    it('Verifica aggancio Cancellazione Clienti', function () {
        if (!keys.CANCELLAZIONE_CLIENTI)
            this.skip()

        BurgerMenuClients.clickLink('Cancellazione Clienti', false)
        BurgerMenuClients.backToClients()
    });

    it('Verifica aggancio Cancellazione Clienti per fonte', function () {
        if (!keys.CANCELLAZIONE_CLIENTI_PER_FONTE)
            this.skip()

        BurgerMenuClients.clickLink('Cancellazione Clienti per fonte', false)
        BurgerMenuClients.backToClients()
    });

    it('Verifica aggancio Hospital scanner', function () {
        if (!keys.HOSPITAL_SCANNER)
            this.skip()

        this.skip() //FORZATO testare su BurgerMenuLinkEsterni
        BurgerMenuClients.clickLink('Hospital scanner', false)
    });

    it('Verifica aggancio Antiriciclaggio', function () {
        if (!keys.ANTIRICICLAGGIO)
            this.skip()

        BurgerMenuClients.clickLink('Antiriciclaggio', false)
        BurgerMenuClients.backToClients()
    });
    it('Verifica aggancio Gestione fonte principale', function () {
        if (!keys.GESTIONE_FONTE_PRINCIPALE)
            this.skip()

        BurgerMenuClients.clickLink('Gestione fonte principale', false)
        BurgerMenuClients.backToClients()
    });

    it('Verifica aggancio Conensi Email sui Contratti', function () {
        if (!keys.CONSENSI_EMAIL_SUI_CONTRATTI)
            this.skip()

        BurgerMenuClients.clickLink('Consensi email sui contratti', false)
        BurgerMenuClients.backToClients()
    });

});